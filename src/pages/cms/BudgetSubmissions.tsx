import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2, RefreshCw, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Allocation = { pct: number; amount: number };

type SubmissionRow = {
  id: string;
  name: string;
  email: string;
  allocations: Record<string, Allocation>;
  is_balanced: boolean;
  wants_membership: boolean;
  share_id: string | null;
  created_at: string;
};

function formatDollars(amount: number): string {
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  return `$${amount.toLocaleString()}`;
}

const BudgetSubmissions = () => {
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadSubmissions = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("budget_submissions")
      .select("id, name, email, allocations, is_balanced, wants_membership, share_id, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) {
      logError("Failed to load budget submissions:", error);
      toast.error("Could not load budget submissions.");
      setIsLoading(false);
      return;
    }

    setSubmissions((data ?? []) as SubmissionRow[]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return submissions;
    return submissions.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    );
  }, [submissions, search]);

  const handleDelete = async (s: SubmissionRow) => {
    if (!confirm(`Delete budget submission from ${s.name}? This cannot be undone.`)) return;
    setIsProcessing(true);
    const { error } = await supabase.from("budget_submissions").delete().eq("id", s.id);
    if (error) {
      logError("Failed to delete submission:", error);
      toast.error("Could not delete submission.");
      setIsProcessing(false);
      return;
    }
    toast.success("Submission deleted");
    await loadSubmissions();
    setIsProcessing(false);
  };

  const getTotalPct = (allocations: Record<string, Allocation>) => {
    return Object.values(allocations).reduce((sum, a) => sum + (a?.pct || 0), 0);
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
          <h1 className="text-2xl font-semibold text-foreground">Budget Submissions</h1>
          <p className="text-muted-foreground mt-1">
            {filtered.length} of {submissions.length} submissions
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={loadSubmissions}
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
              placeholder="Search name or email…"
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
                <th className="text-left p-4 w-8" />
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-center p-4 hidden sm:table-cell">Balanced</th>
                <th className="text-center p-4 hidden sm:table-cell">Member</th>
                <th className="text-left p-4 hidden md:table-cell">Submitted</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    {submissions.length === 0
                      ? "No budget submissions yet."
                      : "No submissions match your search."}
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const allocs = (s.allocations || {}) as Record<string, Allocation>;
                  const totalPct = getTotalPct(allocs);
                  const isExpanded = expandedId === s.id;

                  return (
                    <tr key={s.id} className="border-b last:border-0">
                      <td className="p-4" colSpan={1}>
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : s.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-foreground">{s.name}</span>
                        {isExpanded && (
                          <div className="mt-3 space-y-1.5">
                            {Object.entries(allocs).map(([agency, data]) => (
                              <div key={agency} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{agency}</span>
                                <span className="font-medium text-foreground">
                                  {data?.pct ?? 0}% · {formatDollars(data?.amount ?? 0)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-4 align-top">
                        <a
                          className="text-sm text-foreground hover:text-primary transition-colors"
                          href={`mailto:${s.email}`}
                        >
                          {s.email}
                        </a>
                      </td>
                      <td className="p-4 text-center hidden sm:table-cell align-top">
                        <span
                          className={cn(
                            "text-xs font-medium px-2 py-0.5 rounded",
                            s.is_balanced
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          )}
                        >
                          {s.is_balanced ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-4 text-center hidden sm:table-cell align-top">
                        {s.wants_membership && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                            ✓
                          </span>
                        )}
                      </td>
                      <td className="p-4 hidden md:table-cell align-top">
                        <span className="text-xs text-muted-foreground">
                          {new Date(s.created_at).toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4 text-right align-top">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(s)}
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

export default BudgetSubmissions;
