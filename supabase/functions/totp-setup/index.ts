import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";
import { encode as base32Encode } from "https://deno.land/std@0.208.0/encoding/base32.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// In-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 5; // max 5 setup attempts per minute

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.warn("[SECURITY] totp-setup: Request without auth header", {
        ip: req.headers.get("x-forwarded-for") || "unknown",
        timestamp: new Date().toISOString(),
      });
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create user-context client to get the user
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
      console.warn("[SECURITY] totp-setup: Invalid auth token", {
        ip: req.headers.get("x-forwarded-for") || "unknown",
        timestamp: new Date().toISOString(),
      });
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user is a CMS user
    const { data: isCms } = await supabaseUser.rpc("is_cms_user", {
      _user_id: user.id,
    });
    if (!isCms) {
      console.warn("[SECURITY] totp-setup: Non-CMS user attempted access", {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
      });
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limit
    if (isRateLimited(user.id)) {
      console.warn("[SECURITY] totp-setup: Rate limited", {
        userId: user.id,
        timestamp: new Date().toISOString(),
      });
      return new Response(
        JSON.stringify({ error: "Too many attempts. Please wait." }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "60" },
        }
      );
    }

    // Generate a random secret (20 bytes)
    const secretBytes = new Uint8Array(20);
    crypto.getRandomValues(secretBytes);
    const secret = base32Encode(secretBytes);

    // Service role client for DB operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Upsert the TOTP secret (not enabled yet until verified)
    const { error: upsertError } = await supabaseAdmin
      .from("user_totp_secrets")
      .upsert(
        {
          user_id: user.id,
          encrypted_secret: secret,
          is_enabled: false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (upsertError) {
      return new Response(
        JSON.stringify({ error: "Failed to save secret" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build otpauth URI for QR code
    const issuer = "MamdaniTracker";
    const accountName = encodeURIComponent(user.email || user.id);
    const otpauthUri = `otpauth://totp/${issuer}:${accountName}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;

    console.log("[AUTH] totp-setup: TOTP setup initiated", {
      userId: user.id,
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ secret, otpauth_uri: otpauthUri }),
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
