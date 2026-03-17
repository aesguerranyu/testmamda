import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { BudgetShareCard } from "@/components/public/BudgetShareCard";

type Allocation = { pct: number; amount: number };

type SharedData = {
  allocations: Record<string, Allocation>;
  is_balanced: boolean;
  created_at: string;
  share_id: string;
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

export default function SharedBudget() {
  const { shareId } = useParams<{ shareId: string }>();
  const [unlocked, setUnlocked] = useState(false);
  const [data, setData] = useState<SharedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!shareId || !unlocked) return;
    (async () => {
      const { data: result, error } = await supabase
        .from("budget_submissions")
        .select("allocations, is_balanced, created_at, share_id")
        .eq("share_id", shareId)
        .single();
      if (error || !result) {
        setNotFound(true);
      } else {
        setData(result as unknown as SharedData);
      }
      setLoading(false);
    })();
  }, [shareId, unlocked]);

  if (!unlocked) {
    return (
      <>
        <SEO title="Shared Budget · Mamdani Tracker" description="View a shared NYC budget allocation." />
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

  if (notFound || !data) {
    return (
      <>
        <SEO title="Budget Not Found · Mamdani Tracker" description="This shared budget could not be found." />
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2" style={{ color: "#0C2788" }}>Budget not found</h1>
            <p className="text-sm" style={{ color: "#374151" }}>This shared budget may have been removed or the link is incorrect.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Someone's NYC Budget · Mamdani Tracker"
        description="See how this New Yorker would allocate the city's $94 billion budget."
      />
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <p className="text-sm mb-4" style={{ color: "#4D4D4D" }}>
          A New Yorker built this budget on Mamdani Tracker.
        </p>
        <BudgetShareCard
          allocations={data.allocations}
          isBalanced={data.is_balanced}
          createdAt={data.created_at}
        />
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
