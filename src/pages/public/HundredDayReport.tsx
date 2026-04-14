import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

/* ── Status palette (subway-derived) ─────────────────────────── */
const STATUS = {
  "In progress": { color: "#0039A6", label: "In Progress" },
  Completed:     { color: "#00933C", label: "Completed" },
  Broken:        { color: "#EE352E", label: "Broken" },
  Stalled:       { color: "#FCCC0A", label: "Stalled" },
  "Not started": { color: "#808183", label: "Not Yet Started" },
} as const;

type StatusKey = keyof typeof STATUS;

/* ── Tiny sub-components ─────────────────────────────────────── */
function StatusBadge({ status }: { status: StatusKey }) {
  const s = STATUS[status] ?? STATUS["Not started"];
  const prefix = status === "Completed" ? "✓" : status === "Broken" ? "✗" : "●";
  return (
    <span
      className="inline-block px-3 py-1 text-white font-bold uppercase tracking-widest"
      style={{ backgroundColor: s.color, fontSize: 10, letterSpacing: ".1em" }}
    >
      {prefix} {s.label}
    </span>
  );
}

function SectionHeader({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="pt-14">
      <p className="font-sans text-[10px] font-bold uppercase tracking-[.14em] mb-1" style={{ color: "#9ca3af" }}>
        {tag}
      </p>
      <h2
        className="font-bold leading-tight tracking-tight pb-5 mb-5"
        style={{
          fontSize: "clamp(1.7rem, 3.5vw, 2.5rem)",
          letterSpacing: "-.02em",
          borderBottom: "3px solid #111827",
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function PullQuote({ quote, cite }: { quote: string; cite: string }) {
  return (
    <div className="my-12" style={{ borderTop: "3px solid #111827", borderBottom: "1px solid #e5e7eb", padding: "30px 0 26px" }}>
      <blockquote
        className="italic mb-3"
        style={{ fontSize: "clamp(1.25rem, 2.8vw, 1.65rem)", lineHeight: 1.42, color: "#111827" }}
      >
        "{quote}"
      </blockquote>
      <cite className="font-sans text-[11px] not-italic uppercase tracking-wide" style={{ color: "#6b7280" }}>
        — {cite}
      </cite>
    </div>
  );
}

function BigStat({ num, label, context }: { num: string; label: string; context: string }) {
  return (
    <div className="text-center py-12 my-12" style={{ borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb" }}>
      <p className="font-bold leading-none mb-2" style={{ fontSize: "clamp(3.5rem, 9vw, 6rem)", letterSpacing: "-.04em" }}>
        {num}
      </p>
      <p className="font-sans text-xs uppercase tracking-[.1em] mb-2" style={{ color: "#6b7280" }}>{label}</p>
      <p className="text-sm mx-auto" style={{ color: "#9ca3af", maxWidth: 400, lineHeight: 1.55 }}>{context}</p>
    </div>
  );
}

function PromiseCard({
  status,
  headline,
  paragraphs,
  evidence,
}: {
  status: StatusKey;
  headline: string;
  paragraphs: string[];
  evidence: string;
}) {
  const color = STATUS[status]?.color ?? "#ccc";
  return (
    <div className="my-8" style={{ borderLeft: `5px solid ${color}`, background: "#f9fafb" }}>
      <div className="block px-5 py-2" style={{ background: color }}>
        <StatusBadge status={status} />
      </div>
      <div className="p-5">
        <h3 className="font-bold mb-3" style={{ fontSize: "1.12rem", lineHeight: 1.3 }}>{headline}</h3>
        {paragraphs.map((p, i) => (
          <p key={i} className="mb-3" style={{ fontSize: ".96rem", lineHeight: 1.72, color: "#374151" }}>{p}</p>
        ))}
        <div className="pt-3 mt-3 font-sans text-[11px]" style={{ borderTop: "1px solid rgba(0,0,0,.07)", color: "#6b7280" }}>
          <strong className="uppercase tracking-wide mr-1" style={{ color: "#9ca3af" }}>Evidence:</strong>{evidence}
        </div>
      </div>
    </div>
  );
}

function PhotoBlock({ variant, caption }: { variant: 1 | 2 | 3; caption: React.ReactNode }) {
  const bgs: Record<number, string> = {
    1: "radial-gradient(ellipse 60% 50% at 30% 40%, #1e3a5f 0%, transparent 60%), radial-gradient(ellipse 50% 45% at 70% 55%, #1a3a2a 0%, transparent 55%), #0d1b2a",
    2: "radial-gradient(ellipse 65% 55% at 60% 30%, #2d1b69 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 25% 65%, #1e3a5f 0%, transparent 55%), #111827",
    3: "radial-gradient(ellipse 55% 50% at 40% 50%, #14532d 0%, transparent 58%), radial-gradient(ellipse 45% 40% at 75% 35%, #1e3a5f 0%, transparent 52%), #0a1628",
  };
  return (
    <div className="my-12 -mx-7 sm:mx-0">
      <div className="w-full flex items-center justify-center" style={{ background: bgs[variant], height: "clamp(260px, 40vw, 400px)" }} />
      <p className="font-sans text-xs pt-2 px-7 sm:px-0" style={{ color: "#6b7280", borderTop: "1px solid #e5e7eb" }}>
        {caption}
      </p>
    </div>
  );
}

function HighlightBox({ children, variant = "red" }: { children: React.ReactNode; variant?: "red" | "blue" | "amber" }) {
  const colors = { red: { bg: "#fef2f2", border: "#EE352E" }, blue: { bg: "#eff6ff", border: "#0039A6" }, amber: { bg: "#fffbeb", border: "#FCCC0A" } };
  const c = colors[variant];
  return (
    <div className="my-7 p-5" style={{ background: c.bg, borderLeft: `4px solid ${c.border}` }}>
      {children}
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function HundredDayReport() {
  const [counts, setCounts] = useState<Record<StatusKey, number>>({
    "In progress": 0, Completed: 0, Broken: 0, Stalled: 0, "Not started": 0,
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("promises")
        .select("status")
        .eq("editorial_state", "published");
      if (!data) return;
      setTotal(data.length);
      const c: Record<string, number> = {};
      data.forEach((r) => { c[r.status] = (c[r.status] || 0) + 1; });
      setCounts(c as any);
    })();
  }, []);

  const barItems = useMemo(() => {
    if (!total) return [];
    return (["In progress", "Completed", "Broken", "Not started"] as StatusKey[]).map((k) => ({
      key: k,
      flex: counts[k] || 0,
      color: STATUS[k].color,
    }));
  }, [counts, total]);

  return (
    <>
      <SEO
        title="100 Days, 100 Promises — Mamdani Tracker"
        description="We tracked every pledge against his preliminary budget, executive orders, and the public record. Here is what happened."
        keywords="Zohran Mamdani 100 days, NYC mayor promises, promise tracker report"
        canonical="https://mamdanitracker.nyc/100-day-report"
        ogType="article"
      />

      {/* ── HERO ─────────────────────────────────────── */}
      <div className="relative min-h-screen flex flex-col justify-end overflow-hidden" style={{ background: "#0d1b2a" }}>
        {/* Abstract art bg */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 20% 35%, #1e3a5f 0%, transparent 65%), " +
              "radial-gradient(ellipse 55% 50% at 80% 60%, #14532d 0%, transparent 60%), " +
              "radial-gradient(ellipse 40% 40% at 55% 20%, #312e81 0%, transparent 55%), " +
              "#0d1b2a",
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.72) 65%, rgba(0,0,0,0.92) 100%)" }}
        />
        {/* Content */}
        <div className="relative z-10 w-full max-w-[820px] mx-auto px-7 pb-16">
          <p className="font-sans text-[11px] font-bold tracking-[.14em] uppercase mb-4" style={{ color: "#fbbf24" }}>
            Mamdani Tracker · 100-Day Report · April 2026
          </p>
          <h1
            className="font-bold text-white mb-5"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)", lineHeight: 1.07, letterSpacing: "-.025em" }}
          >
            He Made 100 Promises.<br />Here Is What Happened.
          </h1>
          <p className="mb-9" style={{ fontSize: "clamp(1rem, 2vw, 1.18rem)", color: "rgba(255,255,255,.82)", lineHeight: 1.58, maxWidth: 640 }}>
            We tracked every pledge against his preliminary budget, his executive orders,
            and the public record. Eighteen are in progress. Two are done. Two are
            already broken. Seventy-eight have not moved at all.
          </p>
          <p className="font-sans text-xs pt-4" style={{ color: "rgba(255,255,255,.42)", borderTop: "1px solid rgba(255,255,255,.12)" }}>
            Analysis based on the NYC FY2026–2030 Preliminary Financial Plan and
            Executive Orders 1–17 · Updated April 14, 2026
          </p>
        </div>
      </div>

      {/* ── SCORECARD BAR ────────────────────────────── */}
      <div className="py-9 px-7" style={{ background: "#111827" }}>
        <div className="max-w-[820px] mx-auto">
          <p className="font-sans text-[11px] font-bold tracking-[.12em] uppercase mb-3" style={{ color: "rgba(255,255,255,.38)" }}>
            Status of all {total || 100} campaign promises
          </p>
          <div className="flex h-3.5 overflow-hidden mb-5" style={{ borderRadius: 7 }}>
            {barItems.map((b) => (
              <div key={b.key} style={{ background: b.color, flex: b.flex || 0 }} />
            ))}
          </div>
          <div className="flex flex-wrap gap-y-3" style={{ gap: "18px 30px" }}>
            {(["In progress", "Completed", "Broken", "Not started"] as StatusKey[]).map((k) => (
              <div key={k} className="flex items-center gap-2 font-sans text-[13px]" style={{ color: "rgba(255,255,255,.6)" }}>
                <span className="w-2.5 h-2.5 shrink-0" style={{ background: STATUS[k].color, borderRadius: "50%" }} />
                <span className="font-bold text-white text-[15px]">{counts[k] || 0}</span>
                <span>{STATUS[k].label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────── */}
      <div className="max-w-[820px] mx-auto px-7">

        {/* Intro — drop cap */}
        <div className="pt-14 pb-8" style={{ borderBottom: "3px solid #111827" }}>
          <p className="text-lg leading-relaxed mb-5 first-letter:text-7xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:leading-[0.82]" style={{ color: "#1f2937" }}>
            From the {total || 100} promises we've tracked since the start of the
            Mamdani Administration, {counts["In progress"] || 18} are in progress, {counts.Completed || 2} have been completed, and {counts.Broken || 2} are
            marked broken.
          </p>
          <p className="text-lg leading-relaxed mb-5" style={{ color: "#1f2937" }}>
            Mamdani is moving fast on things entirely within mayoral control and slower on
            anything requiring Albany or new legislation. He nevertheless made early headway
            on universal childcare, securing a deal with Governor Hochul on this promise eight
            days into his tenure.
          </p>
          <p className="text-lg leading-relaxed" style={{ color: "#1f2937" }}>
            The promises with the most activity are clustered in childcare, housing, and
            affordability. Meanwhile, the ones with the least movement are in education and
            climate. We see no meaningful action yet on school renovations, green schoolyards,
            resilience hubs, or CUNY promises.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 my-10" style={{ border: "1px solid #e5e7eb" }}>
          {[
            { num: String(counts["In progress"] || 18), lbl: "In Progress" },
            { num: String(counts.Completed || 2), lbl: "Completed" },
            { num: String(counts.Broken || 2), lbl: "Broken" },
            { num: String(counts["Not started"] || 78), lbl: "Not Yet Started" },
          ].map((s, i) => (
            <div
              key={i}
              className="py-6 px-4 text-center"
              style={{ borderRight: i < 3 ? "1px solid #e5e7eb" : undefined }}
            >
              <p className="font-bold leading-none mb-1" style={{ fontSize: "2.5rem", letterSpacing: "-.03em" }}>{s.num}</p>
              <p className="font-sans text-[11px] uppercase tracking-[.07em]" style={{ color: "#6b7280" }}>{s.lbl}</p>
            </div>
          ))}
        </div>

        {/* ── SECTION I ──────────────────────────────── */}
        <SectionHeader tag="Section I" title="Notable Moves Worth Tracking" />

        <BigStat num="12,000" label="Free childcare seats by Fall 2027" context="Mamdani secured a deal with Governor Hochul on this promise eight days into his tenure — his strongest early win, albeit a partial one." />

        <PromiseCard
          status="In progress"
          headline="Universal Childcare"
          paragraphs={[
            "Universal childcare is Mamdani's strongest early win, albeit a partial one. By Fall 2027, New York City will fund roughly 12,000 free child care seats for two-year-olds across five boroughs.",
            "How the administration scales from there will be worth watching closely, as expanding universal childcare for all children six weeks to five years is estimated to cost $6 billion annually.",
          ]}
          evidence="$1.2B state commitment secured from Gov. Hochul, Day 8. 2,000 seats Fall 2026; 12,000 seats Fall 2027."
        />

        <PhotoBlock
          variant={1}
          caption={<>Mayor Mamdani and Gov. Hochul announce the 2-Care free childcare program in Flatbush, Brooklyn, January 8, 2026 — just eight days into his term. <em>Credit: Ed Reed / Mayoral Photography Office</em></>}
        />

        <PromiseCard
          status="In progress"
          headline="Rent Freeze in Motion"
          paragraphs={[
            "Mamdani appointed six members to the Rent Guidelines Board, which controls annual rent adjustments for roughly one million rent-stabilized apartments.",
            "Its key hearing is expected around June and will be worth watching to see whether the promise to freeze rents for rent-stabilized apartments can be checked off by then.",
          ]}
          evidence="6 of 9 RGB members appointed. Official process begun. Vote expected June 2026."
        />

        <PromiseCard
          status="In progress"
          headline="Going After Bad Landlords"
          paragraphs={[
            "The Mamdani administration secured a landmark $2.1 million court judgment against a repeat-offender Bronx landlord and placed 250 of the city's most distressed buildings under heightened oversight.",
            "The Rental Ripoff Hearings, held across all five boroughs, have given tenants a direct platform to document conditions and shape enforcement policy.",
          ]}
          evidence="$2.1M court judgment; 250 buildings under heightened oversight; Rental Ripoff Hearings completed citywide."
        />

        <PromiseCard
          status="In progress"
          headline="Office of Community Safety Established"
          paragraphs={[
            "Mamdani appointed Renita Francois as Deputy Mayor for Community Safety and formally established the Mayor's Office of Community Safety, a direct step toward fulfilling his promise to create a department focused on non-police safety responses.",
            '"Instead of a separate agency with a $1.1 billion budget, Mamdani has a mayoral office on community safety with two staff members," the BBC noted in its 100-day assessment. The foundation is there — the building remains to be constructed.',
          ]}
          evidence="EO signed; Renita Francois appointed Deputy Mayor. Office operates with 2 staff. No standalone $1.1B agency budget."
        />

        <PullQuote
          quote="Nothing is too big for New York City to take on. And over the past 14 weeks, we have proved that there is no task too small either."
          cite="Mayor Zohran Mamdani, 100-Day Address, Knockdown Center, Queens, April 2026"
        />

        <PromiseCard
          status="Completed"
          headline="LGBTQIA+ Office Created"
          paragraphs={[
            "On Day 72, Mamdani established the Mayor's Office of LGBTQIA+ Affairs by executive order and appointed Taylor Brown as its director.",
            "New York City was simultaneously declared an LGBTQIA+ sanctuary city — one of two promises our tracker marks as completed, accomplished through executive action with a confirmed budget line in the preliminary financial plan.",
          ]}
          evidence="EO signed Day 72; Taylor Brown appointed; NYC declared LGBTQIA+ sanctuary; FY27 budget line confirmed."
        />

        <PromiseCard
          status="In progress"
          headline="Minimum Wage Push"
          paragraphs={[
            "A City Council bill has been introduced to raise the minimum wage to $30, which is aligned with Mamdani's campaign promise, though not yet enacted.",
            "Passage depends on the Council, whose relationship with Mamdani has at times been strained — Council Speaker Julie Menin has publicly opposed several of his positions.",
          ]}
          evidence="City Council bill introduced. Not yet enacted. Requires Council passage."
        />

        <PromiseCard
          status="In progress"
          headline="Deliverista Hubs"
          paragraphs={[
            "Progress on investing in rest stops for food delivery workers, with a new hub announced near City Hall.",
            "It is an early, visible step for the city's largely immigrant delivery workforce — the kind of concrete delivery that has earned Mamdani a reputation as a mayor who governs as well as he communicates.",
          ]}
          evidence="New hub opened near City Hall. Budget line in FY27 plan (DCWP)."
        />

        {/* ── Less Movement ──────────────────────────── */}
        <SectionHeader tag="Worth Noting" title="Where There's Less Movement" />

        <HighlightBox variant="amber">
          <p style={{ fontSize: ".96rem", lineHeight: 1.7, color: "#374151" }}>
            The promises with the least movement are in education and climate.
            We see no meaningful action yet on school renovations, green schoolyards, resilience
            hubs, or CUNY promises. Our analysis found that 73 of 100 promises require a funding
            allocation — of these, <strong>32 show no dedicated FY2027 budget line</strong> in any existing
            document. The Adopted Budget, expected in June, will be the first real test.
          </p>
        </HighlightBox>

        <HighlightBox variant="red">
          <p style={{ fontSize: ".96rem", lineHeight: 1.7, color: "#374151" }}>
            <strong>Healthcare is the starkest gap.</strong> None of the nine healthcare promises
            have a named program line. Mobile crisis teams, peer clubhouses, and expanded abortion
            access all lack any identified appropriation.
          </p>
        </HighlightBox>

        {/* ── SECTION II ─────────────────────────────── */}
        <SectionHeader tag="Section II" title="Two Broken Promises" />

        <PromiseCard
          status="Broken"
          headline="CityFHEPS Housing Vouchers Retreat"
          paragraphs={[
            "Mamdani campaigned on dropping the city's lawsuit against the CityFHEPS rental voucher expansion program, which provides housing assistance to low-income New Yorkers in city shelters. His administration instead appealed a court order that would have expanded it — a direct reversal of the campaign commitment.",
            '"It was very disappointing that he has walked this back," said Twyla Carter, chief executive of the Legal Aid Society. "The question isn\'t whether we can afford to expand it — it\'s really whether we can afford not to."',
          ]}
          evidence="Administration appealed court order directing CityFHEPS expansion. Campaign promise: drop the lawsuit entirely."
        />

        <PromiseCard
          status="Broken"
          headline="Public Library Funding Deprioritized"
          paragraphs={[
            "Mamdani pledged to allocate 0.5 percent of the city budget to the public library system. His FY 2027 Preliminary Budget has so far fell short of that threshold.",
            "Whether this is a full reversal or a budget-constrained delay remains to be seen. The June adopted budget is the next meaningful checkpoint.",
          ]}
          evidence="FY2027 Preliminary Budget below 0.5% threshold. Adopted Budget (June 2026) will be key test."
        />

        {/* ── SECTION III ────────────────────────────── */}
        <SectionHeader tag="Section III" title="What We're Watching" />

        <PullQuote
          quote="Campaigning is easy. Governing is tough. That's true even in the best of times, and this is a more challenging time."
          cite="Mark Levine, NYC Comptroller"
        />

        <p className="mb-5" style={{ fontSize: "1.05rem", lineHeight: 1.78, color: "#1f2937" }}>
          This spring's budget negotiations will be a major test of where Mamdani's promises
          are headed. Can the administration close the <strong>$5.4 billion budget gap</strong>?
          The answer will matter most for commitments that require substantial spending. For
          example, meeting the free buses promise — estimated to cost
          <strong> $600–800 million yearly</strong> — will likely depend on having more wiggle
          room in the budget.
        </p>

        <BigStat num="$5.4B" label="Budget gap facing the Mamdani administration" context="Every promise requiring significant new spending lives in its shadow. Free buses alone is estimated at $600–800 million per year." />

        <p className="mb-5" style={{ fontSize: "1.05rem", lineHeight: 1.78, color: "#1f2937" }}>
          Our analysis found that 73 of 100 promises require funding allocation — of these,
          4 require state cooperation and 69 require a dedicated funding source. Currently,
          32 of those 69 show no dedicated FY2027 budget line in existing documents — not even
          an agency proxy — though this may change when the Adopted Budget is released in June.
        </p>

        <p className="mb-5" style={{ fontSize: "1.05rem", lineHeight: 1.78, color: "#1f2937" }}>
          Healthcare is the starkest case: none of the nine healthcare promises have a named
          program line, and mobile crisis teams, peer clubhouses, and expanded abortion access
          all lack any identified appropriation. The Adopted Budget, expected in June, will be
          the first real test of whether these gaps are deliberate or merely deferred.
        </p>

        <PhotoBlock
          variant={3}
          caption={<>Mayor Mamdani presents his preliminary budget at City Hall, February 17, 2026. <em>Credit: Alex Krales / THE CITY</em></>}
        />

        <PullQuote
          quote="I am absolutely committed to making buses fast and free."
          cite='Mayor Mamdani, April 2026 — while acknowledging it will not happen this year'
        />

        <p className="mb-5" style={{ fontSize: "1.05rem", lineHeight: 1.78, color: "#1f2937" }}>
          Finally, we are wondering about the timelines for delivering the Mayor's promises.
          Many of these promises have yet to meet the "T" in SMART criteria,
          having no clear deadlines. It would be nice to put some of them on our calendars,
          for better tracking, of course.
        </p>

        {/* ── CLOSING ────────────────────────────────── */}
        <div className="pt-14 pb-16 mt-14" style={{ borderTop: "3px solid #111827" }}>
          <p className="text-lg leading-relaxed mb-5" style={{ color: "#1f2937" }}>
            Mamdani Tracker is an independent, nonpartisan public-interest project built to
            help New Yorkers follow how their city is governed. We are not affiliated with any
            campaign, political party, or government office.
          </p>
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────── */}
      <div className="px-7 py-7 font-sans text-xs" style={{ background: "#f9fafb", borderTop: "1px solid #e5e7eb", color: "#6b7280", lineHeight: 1.65 }}>
        <div className="max-w-[820px] mx-auto">
          <p className="mb-3">
            <strong style={{ color: "#374151" }}>Methodology:</strong> Promise statuses were determined by cross-referencing
            each of Mayor Mamdani's 100 campaign pledges against the NYC FY2026–2030 Preliminary
            Financial Plan (February 2026), Executive Orders 1–17, and press releases from
            nyc.gov. A promise is <strong>In Progress</strong> when confirmed executive or budget action
            is underway. <strong>Completed</strong> means the policy was formally enacted. <strong>Broken</strong>{" "}
            means the administration acted contrary to the pledge. All others are <strong>Not Yet Started</strong>.
          </p>
          <p>
            <strong style={{ color: "#374151" }}>Sources:</strong> NYC Office of Management and Budget; NYC Mayor's Office; The New York Times
            (Rubinstein & Goldenberg, April 10, 2026); BBC News (Halperin, April 10, 2026);
            The City NYC (Maldonado, Honan & Martinez, April 9, 2026); Marist Poll (April 2026);
            Siena University Poll (February 2026); Corcoran Group market report (March 2026).
          </p>
        </div>
      </div>
    </>
  );
}
