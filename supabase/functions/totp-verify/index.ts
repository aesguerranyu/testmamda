import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";
import { decode as base32Decode } from "https://deno.land/std@0.208.0/encoding/base32.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// TOTP implementation using Web Crypto API
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
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { code, enable } = await req.json();
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

    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser();
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

    // Get the user's TOTP secret
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

    // Check current and adjacent time windows (±1) for clock drift
    let valid = false;
    for (const offset of [-1, 0, 1]) {
      const expected = await generateTOTP(
        totpRecord.encrypted_secret,
        30,
        6,
        offset
      );
      if (expected === code) {
        valid = true;
        break;
      }
    }

    if (!valid) {
      return new Response(
        JSON.stringify({ error: "Invalid code", valid: false }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // If this is the setup verification, enable TOTP
    if (enable) {
      await supabaseAdmin
        .from("user_totp_secrets")
        .update({
          is_enabled: true,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
    }

    return new Response(JSON.stringify({ valid: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
