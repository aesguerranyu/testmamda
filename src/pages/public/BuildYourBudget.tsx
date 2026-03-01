import { useState, useMemo } from "react";
import { SEO } from "@/components/SEO";

const TOTAL_BUDGET = 94_000_000_000;

const AGENCIES = [
  "Department of Education",
  "Health + Hospitals",
  "Social Services",
  "NYPD",
  "FDNY",
  "Sanitation",
  "Parks",
  "Housing",
  "Other",
];

function formatDollars(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `$${amount.toLocaleString()}`;
}

export default function BuildYourBudget() {
  const [percentages, setPercentages] = useState<Record<string, string>>(
    () => Object.fromEntries(AGENCIES.map((a) => [a, ""]))
  );

  const totalPct = useMemo(
    () => AGENCIES.reduce((sum, a) => sum + (parseFloat(percentages[a]) || 0), 0),
    [percentages]
  );

  const isBalanced = Math.abs(totalPct - 100) < 0.01;

  const handleChange = (agency: string, value: string) => {
    // Allow empty, or valid number 0-100
    if (value === "" || (/^\d{0,3}(\.\d{0,2})?$/.test(value) && parseFloat(value) <= 100)) {
      setPercentages((prev) => ({ ...prev, [agency]: value }));
    }
  };

  return (
    <>
      <SEO
        title="Build Your Own Budget | Mamdani Tracker"
        description="Allocate New York City's $94 billion budget across agencies. An interactive tool from Mamdani Tracker."
      />
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: "#0C2788" }}>
          Build Your Own Budget
        </h1>
        <p className="text-sm mb-6" style={{ color: "#4D4D4D" }}>
          Allocate NYC's <strong>{formatDollars(TOTAL_BUDGET)}</strong> expense budget across agencies using percentages.
        </p>

        <div className="border-2 border-black">
          {/* Header */}
          <div
            className="grid grid-cols-[1fr_100px_120px] sm:grid-cols-[1fr_120px_140px] gap-2 px-4 py-3 font-bold text-sm"
            style={{ backgroundColor: "#0C2788", color: "#FFFFFF" }}
          >
            <span>Agency</span>
            <span className="text-right">%</span>
            <span className="text-right">Amount</span>
          </div>

          {/* Rows */}
          {AGENCIES.map((agency) => {
            const pct = parseFloat(percentages[agency]) || 0;
            const amount = (pct / 100) * TOTAL_BUDGET;
            return (
              <div
                key={agency}
                className="grid grid-cols-[1fr_100px_120px] sm:grid-cols-[1fr_120px_140px] gap-2 px-4 py-3 border-t border-black items-center"
              >
                <span className="text-sm font-semibold" style={{ color: "#000" }}>
                  {agency}
                </span>
                <div className="flex justify-end">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={percentages[agency]}
                    onChange={(e) => handleChange(agency, e.target.value)}
                    placeholder="0"
                    className="w-20 sm:w-24 text-right border-2 border-black px-2 py-1 text-sm bg-white focus:outline-none focus:border-[#0C2788]"
                  />
                </div>
                <span className="text-sm text-right font-mono" style={{ color: "#374151" }}>
                  {pct > 0 ? formatDollars(amount) : "—"}
                </span>
              </div>
            );
          })}

          {/* Totals */}
          <div
            className="grid grid-cols-[1fr_100px_120px] sm:grid-cols-[1fr_120px_140px] gap-2 px-4 py-3 border-t-2 border-black font-bold text-sm"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <span>Total</span>
            <span
              className="text-right"
              style={{ color: isBalanced ? "#00933C" : "#EE352E" }}
            >
              {totalPct.toFixed(1)}%
            </span>
            <span className="text-right font-mono">
              {formatDollars((totalPct / 100) * TOTAL_BUDGET)}
            </span>
          </div>
        </div>

        {/* Warning */}
        {!isBalanced && totalPct > 0 && (
          <div
            className="mt-4 border-l-4 px-3 py-2 text-sm font-semibold"
            style={{
              borderColor: "#EE352E",
              backgroundColor: "#FEF2F2",
              color: "#EE352E",
            }}
          >
            Total must equal 100%.{" "}
            {totalPct > 100
              ? `You're ${(totalPct - 100).toFixed(1)}% over.`
              : `You need ${(100 - totalPct).toFixed(1)}% more.`}
          </div>
        )}

        {isBalanced && (
          <div
            className="mt-4 border-l-4 px-3 py-2 text-sm font-semibold"
            style={{
              borderColor: "#00933C",
              backgroundColor: "#F0FDF4",
              color: "#00933C",
            }}
          >
            ✓ Budget balanced at 100%.
          </div>
        )}
      </div>
    </>
  );
}
