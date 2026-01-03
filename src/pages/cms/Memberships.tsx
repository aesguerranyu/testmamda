import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type MembershipRow = {
  id: string;
  name: string;
  last_name: string | null;
  email: string;
  borough: string;
  city: string | null;
  created_at: string;
};

const Memberships = () => {
  const [memberships, setMemberships] = useState<MembershipRow[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadMemberships = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("memberships")
      .select("id, name, last_name, email, borough, city, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) {
      console.error("Failed to load memberships:", error);
      toast.error("Could not load memberships.");
      setIsLoading(false);
      return;
    }

    setMemberships((data ?? []) as MembershipRow[]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadMemberships();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return memberships;

    return memberships.filter((m) => {
      const fullName = `${m.name} ${m.last_name ?? ""}`.trim().toLowerCase();
      return (
        fullName.includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.borough ?? "").toLowerCase().includes(q) ||
        (m.city ?? "").toLowerCase().includes(q)
      );
    });
  }, [memberships, search]);

  const handleDelete = async (m: MembershipRow) => {
    if (!confirm(`Delete membership for ${m.email}? This cannot be undone.`)) return;

    setIsProcessing(true);
    const { error } = await supabase.from("memberships").delete().eq("id", m.id);

    if (error) {
      console.error("Failed to delete membership:", error);
      toast.error("Could not delete membership.");
      setIsProcessing(false);
      return;
    }

    toast.success("Membership deleted");
    await loadMemberships();
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Memberships</h1>
          <p className="text-muted-foreground mt-1">
            {filtered.length} of {memberships.length} submissions
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={loadMemberships}
          disabled={isProcessing}
        >
          <RefreshCw className={cn("w-4 h-4", isProcessing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="cms-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email, borough, city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="cms-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="cms-table-header border-b">
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4 hidden md:table-cell">Location</th>
                <th className="text-left p-4 hidden sm:table-cell">Submitted</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    {memberships.length === 0
                      ? "No membership submissions yet."
                      : "No memberships match your search."}
                  </td>
                </tr>
              ) : (
                filtered.map((m) => {
                  const fullName = `${m.name} ${m.last_name ?? ""}`.trim();
                  const location = [m.borough, m.city].filter(Boolean).join(" · ");

                  return (
                    <tr
                      key={m.id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <span className="font-medium text-foreground">{fullName}</span>
                      </td>
                      <td className="p-4">
                        <a
                          className="text-sm text-foreground hover:text-primary transition-colors"
                          href={`mailto:${m.email}`}
                        >
                          {m.email}
                        </a>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {location || "—"}
                        </span>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {new Date(m.created_at).toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(m)}
                          disabled={isProcessing}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Memberships;
