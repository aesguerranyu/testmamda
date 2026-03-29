import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.warn("[SECURITY] totp-status: Request without auth header", {
        ip: req.headers.get("x-forwarded-for") || "unknown",
        timestamp: new Date().toISOString(),
      });
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
      console.warn("[SECURITY] totp-status: Invalid auth token", {
        ip: req.headers.get("x-forwarded-for") || "unknown",
        timestamp: new Date().toISOString(),
      });
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user is a CMS user before revealing TOTP status
    const { data: isCms } = await supabaseUser.rpc("is_cms_user", {
      _user_id: user.id,
    });
    if (!isCms) {
      console.warn("[SECURITY] totp-status: Non-CMS user attempted access", {
        userId: user.id,
        timestamp: new Date().toISOString(),
      });
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to check TOTP status
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: totpRecord } = await supabaseAdmin
      .from("user_totp_secrets")
      .select("is_enabled")
      .eq("user_id", user.id)
      .single();

    return new Response(
      JSON.stringify({
        has_totp: !!totpRecord,
        is_enabled: totpRecord?.is_enabled || false,
      }),
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
