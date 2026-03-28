import { logError } from '@/lib/logger';
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";

const TOTAL_BUDGET = 94_000_000_000;

function formatDollars(amount: number): string {
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  return `$${amount.toLocaleString()}`;
}

type AgencyStat = {
  agency: string;
  avg_pct: number;
  median_pct: number;
  min_pct: number;
  max_pct: number;
};

type AggregateData = {
  total_submissions: number;
  balanced_submissions: number;
  agencies: AgencyStat[] | null;
};

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (pw === "MamdaniBudget") { onUnlock(); setPwError(false); }
          else setPwError(true);
        }}
        className="w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold" style={{ color: "#0C2788" }}>This page is password-protected</h1>
        <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setPwError(false); }} placeholder="Enter password" className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-[#0C2788]" />
        {pwError && <p className="text-sm font-semibold" style={{ color: "#EE352E" }}>Incorrect password.</p>}
        <button type="submit" className="w-full py-2 text-sm font-bold text-white" style={{ backgroundColor: "#0C2788" }}>Enter</button>
      </form>
    </div>
  );
}

export default function BudgetResults() {
  const [unlocked, setUnlocked] = useState(false);
  const [data, setData] = useState<AggregateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!unlocked) return;
    (async () => {
      const { data: result, error } = await supabase.rpc("get_budget_aggregates" as any);
      if (error) {
        logError("Failed to load aggregates:", error);
      } else {
        setData(result as unknown as AggregateData);
      }
      setLoading(false);
    })();
  }, [unlocked]);

  if (!unlocked) {
    return (
      <>
        <SEO title="Budget Results · Mamdani Tracker" description="See how New Yorkers want the city budget allocated." />
        <PasswordGate onUnlock={() => setUnlocked(true)} />
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#0C2788" }} />
      </div>
    );
  }

  if (!data || !data.agencies || data.total_submissions === 0) {
    return (
      <>
        <SEO title="Budget Results · Mamdani Tracker" description="See how New Yorkers want the city budget allocated." />
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2" style={{ color: "#0C2788" }}>No submissions yet</h1>
            <p className="text-sm mb-4" style={{ color: "#374151" }}>
              Be the first to build your own budget.
            </p>
            <a
              href="/build-your-budget"
              className="inline-block px-6 py-3 text-sm font-bold text-white"
              style={{ backgroundColor: "#0C2788" }}
            >
              Build Your Budget →
            </a>
          </div>
        </div>
      </>
    );
  }

  const maxAvg = Math.max(...data.agencies.map((a) => a.avg_pct), 1);

  return (
    <>
      <SEO
        title="How New Yorkers Would Allocate the Budget · Mamdani Tracker"
        description={`Based on ${data.total_submissions} submissions, see how New Yorkers want NYC's $94 billion budget allocated.`}
      />
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: "#0C2788" }}>
          How New Yorkers Would Allocate the Budget
        </h1>
        <p className="text-sm mb-6" style={{ color: "#4D4D4D" }}>
          Based on <strong>{data.total_submissions.toLocaleString()}</strong> crowdsourced submissions
          {data.balanced_submissions > 0 && (
            <> ({data.balanced_submissions.toLocaleString()} balanced at 100%)</>
          )}
        </p>

        {/* Results table */}
        <div className="border-2 border-black">
          <div
            className="grid grid-cols-[1fr_80px_100px] sm:grid-cols-[1fr_80px_80px_120px] gap-2 px-4 py-3 font-bold text-xs sm:text-sm"
            style={{ backgroundColor: "#0C2788", color: "#FFFFFF" }}
          >
            <span>Agency</span>
            <span className="text-right">Avg %</span>
            <span className="text-right hidden sm:block">Median %</span>
            <span className="text-right">Avg Amount</span>
          </div>

          {data.agencies.map((agency) => {
            const barWidth = Math.max((agency.avg_pct / maxAvg) * 100, 3);
            const avgAmount = (agency.avg_pct / 100) * TOTAL_BUDGET;
            return (
              <div
                key={agency.agency}
                className="border-t border-black px-4 py-3"
              >
                <div className="grid grid-cols-[1fr_80px_100px] sm:grid-cols-[1fr_80px_80px_120px] gap-2 items-center">
                  <span className="text-sm font-semibold text-black">{agency.agency}</span>
                  <span className="text-sm text-right font-mono" style={{ color: "#374151" }}>
                    {agency.avg_pct}%
                  </span>
                  <span className="text-sm text-right font-mono hidden sm:block" style={{ color: "#374151" }}>
                    {agency.median_pct}%
                  </span>
                  <span className="text-sm text-right font-mono font-bold" style={{ color: "#0C2788" }}>
                    {formatDollars(avgAmount)}
                  </span>
                </div>
                {/* Bar */}
                <div className="mt-1.5 h-3 w-full bg-gray-100 border border-black/10">
                  <div
                    className="h-full"
                    style={{ width: `${barWidth}%`, backgroundColor: "#0C2788" }}
                  />
                </div>
                {/* Range */}
                <div className="mt-1 flex justify-between text-[10px]" style={{ color: "#6B7280" }}>
                  <span>Min: {agency.min_pct}%</span>
                  <span>Max: {agency.max_pct}%</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <a
            href="/build-your-budget"
            className="inline-block px-6 py-3 text-sm font-bold text-white"
            style={{ backgroundColor: "#0C2788" }}
          >
            Build Your Own Budget →
          </a>
        </div>
      </div>
    </>
  );
}
