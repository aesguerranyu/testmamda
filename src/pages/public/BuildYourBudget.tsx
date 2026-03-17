import { useState, useMemo } from "react";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

type Step = "allocate" | "preview" | "submitted";

export default function BuildYourBudget() {
  const [percentages, setPercentages] = useState<Record<string, string>>(
    () => Object.fromEntries(AGENCIES.map((a) => [a, ""]))
  );
  const [step, setStep] = useState<Step>("allocate");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wantsMembership, setWantsMembership] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const totalPct = useMemo(
    () => AGENCIES.reduce((sum, a) => sum + (parseFloat(percentages[a]) || 0), 0),
    [percentages]
  );

  const isBalanced = Math.abs(totalPct - 100) < 0.01;

  const handleChange = (agency: string, value: string) => {
    if (value === "" || (/^\d{0,3}(\.\d{0,2})?$/.test(value) && parseFloat(value) <= 100)) {
      setPercentages((prev) => ({ ...prev, [agency]: value }));
    }
  };

  const handleSubmit = async () => {
    const missingAgencies = AGENCIES.filter((a) => !percentages[a] || percentages[a].trim() === "");
    if (missingAgencies.length > 0) {
      toast({ title: "Missing allocations", description: `Please enter a percentage for all agencies.`, variant: "destructive" });
      return;
    }
    if (!name.trim() || !email.trim()) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const allocations: Record<string, { pct: number; amount: number }> = {};
    AGENCIES.forEach((a) => {
      const pct = parseFloat(percentages[a]) || 0;
      allocations[a] = { pct, amount: (pct / 100) * TOTAL_BUDGET };
    });

    const { error } = await supabase.from("budget_submissions").insert({
      name: name.trim(),
      email: email.trim(),
      allocations,
    });

    if (error) {
      setSubmitting(false);
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
      return;
    }

    if (wantsMembership) {
      await supabase.from("memberships").insert({
        name: name.trim(),
        email: email.trim(),
        borough: "Unknown",
      });
    }

    setSubmitting(false);
    setStep("submitted");
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

        {/* ── STEP: ALLOCATE ── */}
        {step === "allocate" && (
          <>
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
                <span className="text-right" style={{ color: isBalanced ? "#00933C" : "#EE352E" }}>
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
                style={{ borderColor: "#EE352E", backgroundColor: "#FEF2F2", color: "#EE352E" }}
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
                style={{ borderColor: "#00933C", backgroundColor: "#F0FDF4", color: "#00933C" }}
              >
                ✓ Budget balanced at 100%.
              </div>
            )}

            <button
              onClick={() => setStep("preview")}
              className="mt-6 w-full py-3 text-sm font-bold text-white"
              style={{ backgroundColor: "#0C2788" }}
            >
              Review & Submit →
            </button>
          </>
        )}

        {/* ── STEP: PREVIEW ── */}
        {step === "preview" && (
          <>
            <div className="border-2 border-black mb-6">
              <div
                className="px-4 py-3 font-bold text-sm"
                style={{ backgroundColor: "#0C2788", color: "#FFFFFF" }}
              >
                Your Budget Allocation
              </div>
              {AGENCIES.map((agency) => {
                const pct = parseFloat(percentages[agency]) || 0;
                if (pct === 0) return null;
                const amount = (pct / 100) * TOTAL_BUDGET;
                return (
                  <div
                    key={agency}
                    className="flex items-center justify-between px-4 py-3 border-t border-black text-sm"
                  >
                    <span className="font-semibold">{agency}</span>
                    <div className="flex items-center gap-4">
                      <span style={{ color: "#374151" }}>{pct.toFixed(1)}%</span>
                      <span className="font-mono font-bold" style={{ color: "#0C2788" }}>
                        {formatDollars(amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div
                className="flex items-center justify-between px-4 py-3 border-t-2 border-black font-bold text-sm"
                style={{ backgroundColor: "#F5F5F5" }}
              >
                <span>Total</span>
                <span className="font-mono" style={{ color: "#00933C" }}>
                  {formatDollars(TOTAL_BUDGET)}
                </span>
              </div>
            </div>

            {/* Name & Email */}
            <div className="border-2 border-black p-4 mb-4">
              <p className="text-sm font-bold mb-4" style={{ color: "#0C2788" }}>
                Enter your details to submit
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide block mb-1" style={{ color: "#6B7280" }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-[#0C2788]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide block mb-1" style={{ color: "#6B7280" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-[#0C2788]"
                  />
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="membership"
                    checked={wantsMembership}
                    onChange={(e) => setWantsMembership(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#0C2788]"
                  />
                  <label htmlFor="membership" className="text-sm" style={{ color: "#374151" }}>
                    Become a member of Mamdani Tracker and receive regular updates from us.{" "}
                    <span className="text-xs" style={{ color: "#6B7280" }}>No spam. No information selling. We promise.</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("allocate")}
                className="flex-1 py-3 text-sm font-bold border-2 border-black"
              >
                ← Edit Budget
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !name.trim() || !email.trim()}
                className="flex-1 py-3 text-sm font-bold text-white disabled:opacity-50"
                style={{ backgroundColor: "#0C2788" }}
              >
                {submitting ? "Submitting…" : "Submit Budget"}
              </button>
            </div>
          </>
        )}

        {/* ── STEP: SUBMITTED ── */}
        {step === "submitted" && (
          <div className="border-2 border-black p-8 text-center">
            <div
              className="text-4xl mb-3"
              style={{ color: "#00933C" }}
            >
              ✓
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "#0C2788" }}>
              Budget Submitted!
            </h2>
            <p className="text-sm mb-6" style={{ color: "#374151" }}>
              Thanks, {name}. Your budget allocation has been recorded.
            </p>
            <button
              onClick={() => {
                setStep("allocate");
                setPercentages(Object.fromEntries(AGENCIES.map((a) => [a, ""])));
                setName("");
                setEmail("");
              }}
              className="px-6 py-2 text-sm font-bold border-2 border-black"
            >
              Build Another Budget
            </button>
          </div>
        )}
      </div>
    </>
  );
}
