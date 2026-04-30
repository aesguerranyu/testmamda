import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { Star, ThumbsUp, ThumbsDown, HelpCircle } from "lucide-react";

interface Stats {
  priority_count: number;
  doable_count: number;
  unrealistic_count: number;
  unsure_count: number;
  doability_total: number;
}

interface MySignal {
  is_priority: boolean;
  doability: "doable" | "unrealistic" | "unsure" | null;
}

interface PromiseSignalsProps {
  promiseId: string;
  promiseSlug: string;
}

export function PromiseSignals({ promiseId, promiseSlug }: PromiseSignalsProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    priority_count: 0,
    doable_count: 0,
    unrealistic_count: 0,
    unsure_count: 0,
    doability_total: 0,
  });
  const [mine, setMine] = useState<MySignal>({ is_priority: false, doability: null });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const loadStats = async () => {
    const { data } = await supabase
      .from("promise_signal_stats" as any)
      .select("*")
      .eq("promise_id", promiseId)
      .maybeSingle();
    if (data) {
      setStats({
        priority_count: Number(data.priority_count) || 0,
        doable_count: Number(data.doable_count) || 0,
        unrealistic_count: Number(data.unrealistic_count) || 0,
        unsure_count: Number(data.unsure_count) || 0,
        doability_total: Number(data.doability_total) || 0,
      });
    }
  };

  const loadMine = async () => {
    if (!user) {
      setMine({ is_priority: false, doability: null });
      return;
    }
    const { data } = await supabase
      .from("promise_signals")
      .select("is_priority, doability")
      .eq("promise_id", promiseId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) {
      setMine({ is_priority: data.is_priority, doability: data.doability as any });
    } else {
      setMine({ is_priority: false, doability: null });
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([loadStats(), loadMine()]).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promiseId, user?.id]);

  const upsertSignal = async (changes: Partial<MySignal>) => {
    if (!user) return;
    setBusy(true);
    const next = { ...mine, ...changes };
    const { error } = await supabase
      .from("promise_signals")
      .upsert(
        {
          promise_id: promiseId,
          user_id: user.id,
          is_priority: next.is_priority,
          doability: next.doability,
        },
        { onConflict: "promise_id,user_id" }
      );
    if (error) {
      toast({ title: "Could not save", description: error.message, variant: "destructive" });
    } else {
      setMine(next);
      await loadStats();
    }
    setBusy(false);
  };

  const togglePriority = () => upsertSignal({ is_priority: !mine.is_priority });
  const setDoability = (val: MySignal["doability"]) =>
    upsertSignal({ doability: mine.doability === val ? null : val });

  const pct = (n: number) =>
    stats.doability_total > 0 ? Math.round((n / stats.doability_total) * 100) : 0;

  if (!user) {
    return (
      <section className="bg-white border-2 border-gray-200 p-6 sm:p-8 mb-6">
        <h2 className="text-xl font-bold text-[#0C2788] mb-2">Reader signals</h2>
        <p className="text-gray-600 text-sm mb-4">
          Sign in to mark this as a priority and share whether you think it's doable. Not a poll — just a quick reader signal.
        </p>
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="bg-gray-100 px-4 py-3 flex-1 min-w-[140px]">
            <div className="text-2xl font-bold text-[#0C2788]">{stats.priority_count}</div>
            <div className="text-xs uppercase tracking-wide font-bold text-gray-600">
              Marked as priority
            </div>
          </div>
          <div className="bg-gray-100 px-4 py-3 flex-1 min-w-[140px]">
            <div className="text-2xl font-bold text-[#0C2788]">{stats.doability_total}</div>
            <div className="text-xs uppercase tracking-wide font-bold text-gray-600">
              Doability signals
            </div>
          </div>
        </div>
        <Link
          to={`/auth?redirect=/promises/${promiseSlug}`}
          className="inline-block px-5 py-3 bg-[#0C2788] text-white font-bold uppercase tracking-wide text-xs hover:bg-[#1436B3] transition-colors"
        >
          Sign in to add a signal
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-white border-2 border-gray-200 p-6 sm:p-8 mb-6">
      <h2 className="text-xl font-bold text-[#0C2788] mb-1">Reader signals</h2>
      <p className="text-xs text-gray-500 mb-5 italic">
        Based on reader responses. Not a scientific sample.
      </p>

      {/* Priority */}
      <div className="mb-6">
        <button
          onClick={togglePriority}
          disabled={busy || loading}
          className={`w-full flex items-center justify-between gap-3 px-4 py-3 border-2 transition-all ${
            mine.is_priority
              ? "bg-[#FCCC0A] border-black text-black"
              : "bg-white border-gray-300 hover:border-[#0C2788] text-[#0C2788]"
          } disabled:opacity-60`}
        >
          <span className="flex items-center gap-2 font-bold uppercase tracking-wide text-sm">
            <Star className={`w-5 h-5 ${mine.is_priority ? "fill-current" : ""}`} />
            {mine.is_priority ? "Priority marked" : "Mark as priority"}
          </span>
          <span className="text-sm font-bold">
            {stats.priority_count.toLocaleString()} reader{stats.priority_count === 1 ? "" : "s"}
          </span>
        </button>
      </div>

      {/* Doability */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">
          Does this seem doable?
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <DoabilityButton
            active={mine.doability === "doable"}
            onClick={() => setDoability("doable")}
            disabled={busy || loading}
            color="#00933C"
            icon={<ThumbsUp className="w-4 h-4" />}
            label="Doable"
          />
          <DoabilityButton
            active={mine.doability === "unrealistic"}
            onClick={() => setDoability("unrealistic")}
            disabled={busy || loading}
            color="#EE352E"
            icon={<ThumbsDown className="w-4 h-4" />}
            label="Unrealistic"
          />
          <DoabilityButton
            active={mine.doability === "unsure"}
            onClick={() => setDoability("unsure")}
            disabled={busy || loading}
            color="#808183"
            icon={<HelpCircle className="w-4 h-4" />}
            label="Unsure"
          />
        </div>

        {stats.doability_total > 0 && (
          <div className="space-y-2">
            <StatBar label="Doable" value={stats.doable_count} pct={pct(stats.doable_count)} color="#00933C" />
            <StatBar label="Unrealistic" value={stats.unrealistic_count} pct={pct(stats.unrealistic_count)} color="#EE352E" />
            <StatBar label="Unsure" value={stats.unsure_count} pct={pct(stats.unsure_count)} color="#808183" />
            <div className="text-xs text-gray-500 pt-1">
              {stats.doability_total.toLocaleString()} reader signal{stats.doability_total === 1 ? "" : "s"}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function DoabilityButton({
  active,
  onClick,
  disabled,
  color,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  disabled: boolean;
  color: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center gap-1 px-2 py-3 border-2 transition-all disabled:opacity-60 ${
        active ? "text-white border-black" : "bg-white border-gray-300 text-gray-700 hover:border-gray-500"
      }`}
      style={active ? { backgroundColor: color } : undefined}
    >
      {icon}
      <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
    </button>
  );
}

function StatBar({ label, value, pct, color }: { label: string; value: number; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-bold uppercase tracking-wide text-gray-700">{label}</span>
        <span className="font-bold text-gray-700">{pct}% · {value.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-100 overflow-hidden">
        <div className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
