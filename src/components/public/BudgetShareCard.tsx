import { useMemo } from "react";

const TOTAL_BUDGET = 94_000_000_000;

type Allocation = { pct: number; amount: number };

function formatDollars(amount: number): string {
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  return `$${amount.toLocaleString()}`;
}

interface BudgetShareCardProps {
  allocations: Record<string, Allocation>;
  isBalanced: boolean;
  createdAt?: string;
}

export function BudgetShareCard({ allocations, isBalanced, createdAt }: BudgetShareCardProps) {
  const sortedAgencies = useMemo(() => {
    return Object.entries(allocations)
      .filter(([, data]) => (data?.pct ?? 0) > 0)
      .sort((a, b) => (b[1]?.pct ?? 0) - (a[1]?.pct ?? 0));
  }, [allocations]);

  const maxPct = sortedAgencies[0]?.[1]?.pct ?? 1;

  return (
    <div
      id="budget-share-card"
      className="w-full max-w-lg mx-auto border-2 border-black bg-white"
    >
      {/* Header */}
      <div className="px-5 py-4" style={{ backgroundColor: "#0C2788" }}>
        <h2 className="text-lg font-bold text-white">My NYC Budget</h2>
        <p className="text-xs text-white/70 mt-0.5">
          Built on Mamdani Tracker · {formatDollars(TOTAL_BUDGET)} total
        </p>
      </div>

      {/* Bars */}
      <div className="px-5 py-4 space-y-2.5">
        {sortedAgencies.map(([agency, data]) => {
          const pct = data?.pct ?? 0;
          const barWidth = Math.max((pct / maxPct) * 100, 2);
          return (
            <div key={agency}>
              <div className="flex items-baseline justify-between mb-0.5">
                <span className="text-xs font-semibold text-black truncate mr-2">
                  {agency}
                </span>
                <span className="text-xs font-mono shrink-0" style={{ color: "#374151" }}>
                  {pct.toFixed(1)}% · {formatDollars(data?.amount ?? (pct / 100) * TOTAL_BUDGET)}
                </span>
              </div>
              <div className="h-4 w-full bg-gray-100 border border-black/10">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: "#0C2788",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3 border-t-2 border-black flex items-center justify-between"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        <span
          className="text-xs font-bold"
          style={{ color: isBalanced ? "#00933C" : "#EE352E" }}
        >
          {isBalanced ? "✓ Balanced at 100%" : "Unbalanced budget"}
        </span>
        {createdAt && (
          <span className="text-[10px]" style={{ color: "#6B7280" }}>
            {new Date(createdAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
