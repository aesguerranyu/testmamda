import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";
import { decode as base32Decode } from "https://deno.land/std@0.208.0/encoding/base32.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// In-memory rate limiting (per-instance, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // max 10 attempts per minute per user

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

async function generateTOTP(
  secretBase32: string,
  timeStep: number = 30,
  digits: number = 6,
  offset: number = 0
): Promise<string> {
  const secretBytes = base32Decode(secretBase32);
  const time = Math.floor(Date.now() / 1000 / timeStep) + offset;

  const timeBuffer = new ArrayBuffer(8);
  const timeView = new DataView(timeBuffer);
  timeView.setUint32(4, time, false);

  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, timeBuffer);
  const hmac = new Uint8Array(signature);

  const offset_val = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset_val] & 0x7f) << 24) |
    ((hmac[offset_val + 1] & 0xff) << 16) |
    ((hmac[offset_val + 2] & 0xff) << 8) |
    (hmac[offset_val + 3] & 0xff);

  return (code % Math.pow(10, digits)).toString().padStart(digits, "0");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.warn("[SECURITY] totp-verify: Request without auth header", {
        ip: req.headers.get("x-forwarded-for") || "unknown",
        timestamp: new Date().toISOString(),
      });
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { code, enable, remember_device, device_token } = await req.json();

    // If device_token is provided, check if it's trusted
    if (device_token && !code) {
      const supabaseUser = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
      if (userError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { data: trusted } = await supabaseAdmin
        .from("totp_trusted_devices")
        .select("id, expires_at")
        .eq("user_id", user.id)
        .eq("device_token", device_token)
        .single();

      if (trusted && new Date(trusted.expires_at) > new Date()) {
        return new Response(JSON.stringify({ valid: true, trusted: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Expired or not found — clean up and require code
      if (trusted) {
        await supabaseAdmin.from("totp_trusted_devices").delete().eq("id", trusted.id);
      }

      return new Response(JSON.stringify({ valid: false, trusted: false }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!code || typeof code !== "string" || code.length !== 6) {
      return new Response(
        JSON.stringify({ error: "Invalid code format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      console.warn("[SECURITY] totp-verify: Invalid auth token", {
        ip: req.headers.get("x-forwarded-for") || "unknown",
        timestamp: new Date().toISOString(),
      });
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limit by user ID
    if (isRateLimited(user.id)) {
      console.warn("[SECURITY] totp-verify: Rate limited", {
        userId: user.id,
        timestamp: new Date().toISOString(),
      });
      return new Response(
        JSON.stringify({ error: "Too many attempts. Please wait and try again." }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "60" },
        }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: totpRecord, error: fetchError } = await supabaseAdmin
      .from("user_totp_secrets")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (fetchError || !totpRecord) {
      return new Response(
        JSON.stringify({ error: "TOTP not configured" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let valid = false;
    for (const offset of [-1, 0, 1]) {
      const expected = await generateTOTP(totpRecord.encrypted_secret, 30, 6, offset);
      if (expected === code) {
        valid = true;
        break;
      }
    }

    if (!valid) {
      console.warn("[SECURITY] totp-verify: Failed TOTP attempt", {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
      });
      return new Response(
        JSON.stringify({ error: "Invalid code", valid: false }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Enable TOTP if this is setup verification
    if (enable) {
      await supabaseAdmin
        .from("user_totp_secrets")
        .update({ is_enabled: true, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);
    }

    // If remember_device is requested, create a trusted device token
    let newDeviceToken: string | null = null;
    if (remember_device) {
      newDeviceToken = crypto.randomUUID() + "-" + crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Clean up old tokens for this user (max 5 devices)
      const { data: existing } = await supabaseAdmin
        .from("totp_trusted_devices")
        .select("id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (existing && existing.length >= 5) {
        const toDelete = existing.slice(0, existing.length - 4);
        for (const d of toDelete) {
          await supabaseAdmin.from("totp_trusted_devices").delete().eq("id", d.id);
        }
      }

      await supabaseAdmin.from("totp_trusted_devices").insert({
        user_id: user.id,
        device_token: newDeviceToken,
        expires_at: expiresAt.toISOString(),
      });
    }

    console.log("[AUTH] totp-verify: Successful verification", {
      userId: user.id,
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ valid: true, device_token: newDeviceToken }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
