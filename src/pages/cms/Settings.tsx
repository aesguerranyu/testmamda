import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

interface Setting {
  id: string;
  key: string;
  enabled: boolean;
  label: string;
  description: string;
}

const CMSSettings = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const load = async () => {
    const { data, error } = await (supabase as any)
      .from("site_settings")
      .select("*")
      .order("label");
    if (error) {
      toast({ title: "Could not load settings", description: error.message, variant: "destructive" });
    } else {
      setSettings((data ?? []) as Setting[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (s: Setting, value: boolean) => {
    setSavingKey(s.key);
    const { error } = await (supabase as any)
      .from("site_settings")
      .update({ enabled: value })
      .eq("id", s.id);
    if (error) {
      toast({ title: "Could not save", description: error.message, variant: "destructive" });
    } else {
      setSettings((prev) => prev.map((x) => (x.id === s.id ? { ...x, enabled: value } : x)));
      toast({ title: `${s.label} ${value ? "enabled" : "disabled"}` });
    }
    setSavingKey(null);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold uppercase tracking-wide text-[#0C2788] mb-1">Feature Settings</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Turn public site features on or off. Changes take effect immediately for new page loads. Admin only.
      </p>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : settings.length === 0 ? (
        <div className="text-sm text-muted-foreground">No feature flags defined.</div>
      ) : (
        <div className="border-2 border-gray-200 divide-y divide-gray-200 bg-white">
          {settings.map((s) => (
            <div key={s.id} className="flex items-start justify-between gap-6 p-5">
              <div>
                <div className="font-bold uppercase tracking-wide text-sm">{s.label || s.key}</div>
                {s.description && (
                  <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
                )}
                <div className="text-xs uppercase tracking-wide font-bold mt-2 text-muted-foreground">
                  {s.enabled ? "Live" : "Hidden"}
                </div>
              </div>
              <Switch
                checked={s.enabled}
                disabled={savingKey === s.key}
                onCheckedChange={(v) => toggle(s, v)}
                aria-label={`Toggle ${s.label}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CMSSettings;
