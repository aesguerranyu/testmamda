import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Star, ThumbsUp, ThumbsDown, Scale } from "lucide-react";
import { getCategoryColor, getCategoryTextColor } from "@/lib/category-colors";

interface RankedPromise {
  id: string;
  headline: string;
  category: string;
  status: string;
  url_slugs: string;
  priority_count: number;
  doable_count: number;
  unrealistic_count: number;
  doability_total: number;
  doable_pct: number;
  unrealistic_pct: number;
  contested_score: number;
}

const STATUS_COLOR: Record<string, string> = {
  "Not started": "#808183",
  "In progress": "#0039A6",
  Completed: "#00933C",
  Stalled: "#FCCC0A",
  Broken: "#EE352E",
};

export default function PromiseRankings() {
  const [promises, setPromises] = useState<RankedPromise[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"priority" | "doable" | "unrealistic" | "contested">("priority");

  useEffect(() => {
    const load = async () => {
      const [{ data: promiseData }, { data: statsData }] = await Promise.all([
        supabase
          .from("promises")
          .select("id, headline, category, status, url_slugs")
          .eq("editorial_state", "published"),
        (supabase as any).from("promise_signal_stats").select("*"),
      ]);

      if (!promiseData) {
        setLoading(false);
        return;
      }

      const statsMap = new Map<string, any>();
      (statsData || []).forEach((s: any) => statsMap.set(s.promise_id, s));

      const merged: RankedPromise[] = promiseData.map((p) => {
        const s = statsMap.get(p.id) || {};
        const doable = Number(s.doable_count) || 0;
        const unreal = Number(s.unrealistic_count) || 0;
        const total = Number(s.doability_total) || 0;
        const doablePct = total > 0 ? Math.round((doable / total) * 100) : 0;
        const unrealPct = total > 0 ? Math.round((unreal / total) * 100) : 0;
        // contested = lots of signals + close split between doable / unrealistic
        const split = total > 0 ? 1 - Math.abs(doable - unreal) / Math.max(doable + unreal, 1) : 0;
        return {
          id: p.id,
          headline: p.headline,
          category: p.category,
          status: p.status,
          url_slugs: p.url_slugs,
          priority_count: Number(s.priority_count) || 0,
          doable_count: doable,
          unrealistic_count: unreal,
          doability_total: total,
          doable_pct: doablePct,
          unrealistic_pct: unrealPct,
          contested_score: split * Math.min(total, 100),
        };
      });

      setPromises(merged);
      setLoading(false);
    };
    load();
  }, []);

  const ranked = (() => {
    const list = [...promises];
    if (tab === "priority") list.sort((a, b) => b.priority_count - a.priority_count);
    if (tab === "doable") list.sort((a, b) => b.doable_pct - a.doable_pct || b.doability_total - a.doability_total);
    if (tab === "unrealistic") list.sort((a, b) => b.unrealistic_pct - a.unrealistic_pct || b.doability_total - a.doability_total);
    if (tab === "contested") list.sort((a, b) => b.contested_score - a.contested_score);
    return list.slice(0, 25);
  })();

  const tabs = [
    { id: "priority" as const, label: "Top priorities", icon: Star },
    { id: "doable" as const, label: "Most believed", icon: ThumbsUp },
    { id: "unrealistic" as const, label: "Least believed", icon: ThumbsDown },
    { id: "contested" as const, label: "Most contested", icon: Scale },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Reader Rankings | Mamdani Tracker"
        description="What readers care about most. Top priorities, most believed promises, and most contested ones — based on reader signals."
        canonical="https://mamdanitracker.nyc/promises/rankings"
      />

      {/* Header */}
      <div className="bg-[#0C2788] text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/promises" className="text-xs uppercase tracking-wide font-bold text-white/70 hover:text-white mb-4 inline-block">
            ← All promises
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Reader Rankings</h1>
          <p className="text-white/80 max-w-2xl">
            What readers care about most. Based on reader signals — not a scientific sample.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b-2 border-gray-200 sticky top-16 bg-white z-30">
        <div className="max-w-5xl mx-auto px-4 flex overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-4 font-bold uppercase tracking-wide text-xs whitespace-nowrap transition-all border-b-4 ${
                  active ? "border-[#0C2788] text-[#0C2788]" : "border-transparent text-gray-500 hover:text-[#0C2788]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="py-20 text-center text-gray-500">Loading...</div>
        ) : ranked.length === 0 ? (
          <div className="py-20 text-center text-gray-500">No reader signals yet. Be the first!</div>
        ) : (
          <ol className="space-y-3">
            {ranked.map((p, idx) => (
              <li key={p.id}>
                <Link
                  to={`/promises/${p.url_slugs}`}
                  className="flex items-stretch gap-0 bg-white border-2 border-gray-200 hover:border-[#0C2788] transition-all"
                >
                  <div className="w-16 sm:w-20 flex items-center justify-center bg-[#0C2788] text-white font-bold text-2xl sm:text-3xl">
                    {idx + 1}
                  </div>
                  <div className="flex-1 p-4 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{
                          backgroundColor: getCategoryColor(p.category),
                          color: getCategoryTextColor(p.category),
                        }}
                      >
                        {p.category.charAt(0)}
                      </span>
                      <span className="text-xs uppercase tracking-wide font-bold text-gray-600">
                        {p.category}
                      </span>
                      <span
                        className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                        style={{ backgroundColor: STATUS_COLOR[p.status] || "#808183" }}
                      >
                        {p.status}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#0C2788] leading-snug mb-2">
                      {p.headline}
                    </h3>
                    <RankMeta tab={tab} p={p} />
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}

        <p className="mt-10 text-xs text-gray-500 italic text-center">
          Rankings update live based on reader signals. Not a scientific sample.
        </p>
      </div>
    </div>
  );
}

function RankMeta({ tab, p }: { tab: string; p: RankedPromise }) {
  if (tab === "priority") {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <Star className="w-4 h-4 text-[#FCCC0A] fill-current" />
        <span className="font-bold">{p.priority_count.toLocaleString()}</span>
        <span className="text-gray-500">readers marked as priority</span>
      </div>
    );
  }
  if (tab === "doable") {
    return (
      <div className="text-sm text-gray-700">
        <span className="font-bold text-[#00933C]">{p.doable_pct}%</span>
        <span className="text-gray-500"> say doable · {p.doability_total} signals</span>
      </div>
    );
  }
  if (tab === "unrealistic") {
    return (
      <div className="text-sm text-gray-700">
        <span className="font-bold text-[#EE352E]">{p.unrealistic_pct}%</span>
        <span className="text-gray-500"> say unrealistic · {p.doability_total} signals</span>
      </div>
    );
  }
  return (
    <div className="text-sm text-gray-700">
      <span className="text-[#00933C] font-bold">{p.doable_pct}% doable</span>
      <span className="text-gray-400"> vs </span>
      <span className="text-[#EE352E] font-bold">{p.unrealistic_pct}% unrealistic</span>
      <span className="text-gray-500"> · {p.doability_total} signals</span>
    </div>
  );
}
