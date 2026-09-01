import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const cache = new Map<string, boolean>();

/**
 * Reads a site-wide feature flag from site_settings.
 * Returns { enabled, isLoading }. Defaults to disabled while loading.
 */
export function useFeatureFlag(key: string) {
  const [enabled, setEnabled] = useState<boolean>(cache.get(key) ?? false);
  const [isLoading, setIsLoading] = useState(!cache.has(key));

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await (supabase as any)
        .from("site_settings")
        .select("enabled")
        .eq("key", key)
        .maybeSingle();
      if (!active) return;
      const value = !!data?.enabled;
      cache.set(key, value);
      setEnabled(value);
      setIsLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [key]);

  return { enabled, isLoading };
}

export const FEATURE_READER_SIGNALS = "reader_signals";
