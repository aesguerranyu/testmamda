import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/public/StatusBadge";
import { getCategoryColor, getCategoryTextColor } from "@/lib/category-colors";

type PromiseStatus = "Not started" | "In progress" | "Completed" | "Stalled" | "Broken";

const STATUS_COLORS: Record<PromiseStatus, string> = {
  Completed: "#00933C",
  "In progress": "#0039A6",
  Stalled: "#FCCC0A",
  "Not started": "#808183",
  Broken: "#EE352E",
};

/* ── Subway Train (reused from Home) ─────────────────────────── */
const SubwayTrain = ({ color = "#0C2788" }: { color?: string }) => (
  <svg width="360" height="26" viewBox="0 0 360 26" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.6, display: "block" }}>
    {[0, 54, 108, 162, 216, 270].map((x, i) => (
      <g key={i}>
        <rect x={x + 1} y="5" width="52" height="18" fill="none" stroke={color} strokeWidth="1" />
        <rect x={x + 4} y="7" width="10" height="11" fill={color} opacity="0.3" />
        <rect x={x + 17} y="7" width="14" height="11" fill={color} opacity="0.3" />
        <rect x={x + 34} y="7" width="10" height="11" fill={color} opacity="0.3" />
        <circle cx={x + 10} cy="24" r="1.5" fill={color} />
        <circle cx={x + 44} cy="24" r="1.5" fill={color} />
      </g>
    ))}
  </svg>
);

/* ── Subway-style section divider ────────────────────────────── */
function SectionDivider({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="mt-16 mb-6">
      <p className="text-xs font-bold uppercase tracking-[.14em] mb-1" style={{ color: "#808183" }}>{tag}</p>
      <div className="border-t-4 border-[#0C2788] pt-4">
        <h2 className="font-bold text-black tracking-tight" style={{ fontSize: "clamp(28px, 4vw, 36px)" }}>
          {title}
        </h2>
      </div>
    </div>
  );
}

/* ── Inline promise card for the report (subway tile style) ─── */
function ReportPromiseCard({
  status,
  category,
  headline,
  paragraphs,
  evidence,
  slug,
}: {
  status: PromiseStatus;
  category: string;
  headline: string;
  paragraphs: string[];
  evidence: string;
  slug?: string;
}) {
  const catColor = getCategoryColor(category);
  const catText = getCategoryTextColor(category);
  const content = (
    <div className="bg-white border border-[#071c5f]/[0.42] mb-6">
      {/* Top bar: Category + Status (same as PromiseCard) */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: "2.25rem", height: "2.25rem", backgroundColor: catColor }}>
            <span className="font-bold text-xs" style={{ color: catText }}>{category.charAt(0)}</span>
          </div>
          <span className="text-gray-600 font-bold uppercase tracking-wide text-xs">{category}</span>
        </div>
        <div className="px-3 py-2 shrink-0" style={{ backgroundColor: STATUS_COLORS[status] }}>
          <span className="text-white font-bold uppercase tracking-wide text-xs" style={{ color: status === "Stalled" ? "#000" : "#fff" }}>
            {status}
          </span>
        </div>
      </div>
      {/* Body */}
      <div className="px-5 pb-5">
        <h3 className="text-[#0C2788] font-bold leading-tight mb-3" style={{ fontSize: "clamp(20px, 2.5vw, 24px)" }}>
          {headline}
        </h3>
        {paragraphs.map((p, i) => (
          <p key={i} className="text-gray-600 leading-relaxed mb-3" style={{ fontSize: "clamp(15px, 1.8vw, 17px)" }}>{p}</p>
        ))}
        {/* Evidence bar */}
        <div className="pt-3 mt-3" style={{ borderTop: "2px solid #e5e7eb" }}>
          <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#808183" }}>Evidence</p>
          <p className="text-sm text-gray-600 leading-relaxed">{evidence}</p>
        </div>
      </div>
      {/* CTA */}
      {slug && (
        <div className="px-5 pb-5">
          <span className="inline-flex items-center gap-2 px-4 py-2 text-white font-bold text-xs uppercase tracking-wide" style={{ backgroundColor: "rgba(12,39,136,0.65)" }}>
            Track This <ArrowRightIcon style={{ width: "1rem", height: "1rem" }} />
          </span>
        </div>
      )}
    </div>
  );

  if (slug) {
    return <Link to={`/promises/${slug}`} className="block no-underline" onClick={() => window.scrollTo(0, 0)}>{content}</Link>;
  }
  return content;
}

/* ── Pull quote in subway style ──────────────────────────────── */
function PullQuote({ quote, cite }: { quote: string; cite: string }) {
  return (
    <div className="my-10 bg-white border-l-4 border-[#0C2788] px-6 py-6">
      <p className="text-[#0C2788] font-bold leading-snug mb-3" style={{ fontSize: "clamp(22px, 3.5vw, 32px)" }}>
        "{quote}"
      </p>
      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#808183" }}>— {cite}</p>
    </div>
  );
}

/* ── Big stat tile (subway square style) ─────────────────────── */
function BigStatTile({ num, label, context, color = "#0C2788" }: { num: string; label: string; context: string; color?: string }) {
  return (
    <div className="my-10 text-center">
      <div className="w-48 h-48 md:w-56 md:h-56 mx-auto flex flex-col items-center justify-center" style={{ backgroundColor: color }}>
        <p className="text-white font-bold leading-none" style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)" }}>{num}</p>
        <p className="text-white/80 text-xs font-bold uppercase tracking-wide mt-2 px-4 text-center">{label}</p>
      </div>
      <p className="text-sm text-gray-600 mt-4 mx-auto leading-relaxed" style={{ maxWidth: 500 }}>{context}</p>
    </div>
  );
}

/* ── Highlight callout ───────────────────────────────────────── */
function Callout({ children, color = "#EE352E" }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="my-6 border-l-4 bg-white px-5 py-4" style={{ borderLeftColor: color }}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════════ */
/* ── Password Gate ── */
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (pw === "Mamda100") {
            onUnlock();
            setPwError(false);
          } else {
            setPwError(true);
          }
        }}
        className="w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold" style={{ color: "#0C2788" }}>
          This page is password-protected
        </h1>
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setPwError(false); }}
          placeholder="Enter password"
          className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-[#0C2788]"
        />
        {pwError && (
          <p className="text-sm font-semibold" style={{ color: "#EE352E" }}>
            Incorrect password.
          </p>
        )}
        <button
          type="submit"
          className="w-full py-2 text-sm font-bold text-white"
          style={{ backgroundColor: "#0C2788" }}
        >
          Enter
        </button>
      </form>
    </div>
  );
}

export default function HundredDayReport() {
  const [unlocked, setUnlocked] = useState(false);
  const [counts, setCounts] = useState<Record<PromiseStatus, number>>({
    "In progress": 0, Completed: 0, Broken: 0, Stalled: 0, "Not started": 0,
  });
  const [total, setTotal] = useState(0);
  const [trainVisible, setTrainVisible] = useState(false);
  const [trainFromLeft, setTrainFromLeft] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("promises").select("status").eq("editorial_state", "published");
      if (!data) return;
      setTotal(data.length);
      const c: Record<string, number> = {};
      data.forEach((r) => { c[r.status] = (c[r.status] || 0) + 1; });
      setCounts(c as any);
    })();
  }, []);

  // Train animation
  useEffect(() => {
    const triggerTrain = () => {
      setTrainFromLeft(Math.random() > 0.5);
      setTrainVisible(true);
      setTimeout(() => setTrainVisible(false), 8000);
    };
    const t = setTimeout(triggerTrain, 2000);
    const i = setInterval(() => triggerTrain(), 8000 + Math.random() * 7000);
    return () => { clearTimeout(t); clearInterval(i); };
  }, []);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <>
      <SEO
        title="100 Days, 100 Promises — Mamdani Tracker"
        description="We tracked every pledge against his preliminary budget, executive orders, and the public record. Here is what happened."
        keywords="Zohran Mamdani 100 days, NYC mayor promises, promise tracker report"
        canonical="https://mamdanitracker.nyc/100-day-report"
        ogType="article"
      />

      {/* ═══ HERO — Subway grid background ═══ */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: `
            linear-gradient(0deg, rgba(12,39,136,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(12,39,136,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "120px 60px",
          minHeight: "90vh",
        }}
      >
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5 relative z-10">
          <div className="text-center">
            {/* Animated subway train */}
            <div className="relative overflow-hidden mb-6" style={{ height: 32 }}>
              <div
                className={`absolute ${trainVisible ? (trainFromLeft ? "animate-[train-left-to-right_8s_linear_forwards]" : "animate-[train-right-to-left_8s_linear_forwards]") : "opacity-0"}`}
                style={{
                  top: 0,
                  left: trainFromLeft ? "-360px" : "auto",
                  right: trainFromLeft ? "auto" : "-360px",
                  width: 360,
                  transform: trainFromLeft ? "scaleX(1)" : "scaleX(-1)",
                }}
              >
                <SubwayTrain color="#0C2788" />
              </div>
            </div>

            <p className="text-xs font-bold uppercase tracking-[.15em] mb-4" style={{ color: "#808183" }}>
              Mamdani Tracker · 100-Day Report · April 2026
            </p>
            <h1
              className="font-bold text-[#0C2788] mb-5 leading-tight tracking-tight"
              style={{ fontSize: "clamp(36px, 6vw, 68px)", lineHeight: 1.1 }}
            >
              He Made 100 Promises.<br />Here Is What Happened.
            </h1>
            <p
              className="text-black mx-auto leading-relaxed mb-6 font-medium px-4"
              style={{ maxWidth: "48rem", fontSize: "clamp(17px, 2.2vw, 21px)" }}
            >
              We tracked every pledge against his preliminary budget, his executive orders,
              and the public record. Eighteen are in progress. Two are done. Two are
              already broken. Seventy-eight have not moved at all.
            </p>
            <p className="text-xs mx-auto" style={{ color: "#808183", maxWidth: "40rem" }}>
              Analysis based on the NYC FY2026–2030 Preliminary Financial Plan and
              Executive Orders 1–17 · Updated April 14, 2026
            </p>
          </div>
        </div>
      </section>

      {/* ═══ SCORECARD — Subway status squares ═══ */}
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5 py-8">
        <div className="border border-gray-300 p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left: Total */}
            <div className="text-center md:text-left">
              <p className="text-7xl md:text-9xl font-bold leading-none" style={{ color: "#0C2788" }}>
                {total || 100}
              </p>
              <p className="text-sm font-bold uppercase tracking-widest mt-2" style={{ color: "#6B7280" }}>
                Total Promises Tracked
              </p>
            </div>

            {/* Right: Status squares (same as PromiseTracker) */}
            <div className="grid grid-cols-3 md:flex gap-3 md:gap-4">
              {(["Completed", "In progress", "Stalled", "Broken", "Not started"] as PromiseStatus[]).map((status) => {
                const count = counts[status] || 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={status} className="text-center">
                    <div
                      className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center mx-auto"
                      style={{ backgroundColor: STATUS_COLORS[status] }}
                    >
                      <span className="text-2xl md:text-5xl font-bold" style={{ color: status === "Stalled" ? "#000" : "#fff" }}>{count}</span>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wide mt-2 text-black">{status}</p>
                    <p className="text-sm md:text-lg font-bold" style={{ color: STATUS_COLORS[status] }}>{pct}%</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-12 flex overflow-hidden mt-10">
            {(["Completed", "In progress", "Stalled", "Broken", "Not started"] as PromiseStatus[]).map((status) => {
              const pct = total > 0 ? Math.round((counts[status] || 0) / total * 100) : 0;
              if (pct === 0) return null;
              return (
                <div
                  key={status}
                  className="h-full flex items-center justify-center"
                  style={{ backgroundColor: STATUS_COLORS[status], width: `${pct}%`, minWidth: 48 }}
                >
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wide whitespace-nowrap px-1" style={{ color: status === "Stalled" ? "#000" : "#fff" }}>
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="h-1 bg-black mt-6"></div>
      </div>

      {/* ═══ BODY ═══ */}
      <div className="container mx-auto max-w-4xl px-3 sm:px-4 lg:px-5">

        {/* Intro */}
        <div className="mb-10">
          <p className="text-lg leading-relaxed mb-5 first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-[0.82] first-letter:text-[#0C2788]" style={{ color: "#1f2937" }}>
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

        {/* ═══ SECTION I ═══ */}
        <SectionDivider tag="Section I" title="Notable Moves Worth Tracking" />

        <BigStatTile
          num="12,000"
          label="Free childcare seats by Fall 2027"
          context="Mamdani secured a deal with Governor Hochul on this promise eight days into his tenure — his strongest early win, albeit a partial one."
          color="#EE352E"
        />

        <ReportPromiseCard
          status="In progress"
          category="Childcare"
          headline="Universal Childcare"
          paragraphs={[
            "Universal childcare is Mamdani's strongest early win, albeit a partial one. By Fall 2027, New York City will fund roughly 12,000 free child care seats for two-year-olds across five boroughs.",
            "How the administration scales from there will be worth watching closely, as expanding universal childcare for all children six weeks to five years is estimated to cost $6 billion annually.",
          ]}
          evidence="$1.2B state commitment secured from Gov. Hochul, Day 8. 2,000 seats Fall 2026; 12,000 seats Fall 2027."
        />

        <ReportPromiseCard
          status="In progress"
          category="Housing"
          headline="Rent Freeze in Motion"
          paragraphs={[
            "Mamdani appointed six members to the Rent Guidelines Board, which controls annual rent adjustments for roughly one million rent-stabilized apartments.",
            "Its key hearing is expected around June and will be worth watching to see whether the promise to freeze rents for rent-stabilized apartments can be checked off by then.",
          ]}
          evidence="6 of 9 RGB members appointed. Official process begun. Vote expected June 2026."
        />

        <ReportPromiseCard
          status="In progress"
          category="Housing"
          headline="Going After Bad Landlords"
          paragraphs={[
            "The Mamdani administration secured a landmark $2.1 million court judgment against a repeat-offender Bronx landlord and placed 250 of the city's most distressed buildings under heightened oversight.",
            "The Rental Ripoff Hearings, held across all five boroughs, have given tenants a direct platform to document conditions and shape enforcement policy.",
          ]}
          evidence="$2.1M court judgment; 250 buildings under heightened oversight; Rental Ripoff Hearings completed citywide."
        />

        <ReportPromiseCard
          status="In progress"
          category="Public Safety"
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

        <ReportPromiseCard
          status="Completed"
          category="LGBTQIA+"
          headline="LGBTQIA+ Office Created"
          paragraphs={[
            "On Day 72, Mamdani established the Mayor's Office of LGBTQIA+ Affairs by executive order and appointed Taylor Brown as its director.",
            "New York City was simultaneously declared an LGBTQIA+ sanctuary city — one of two promises our tracker marks as completed, accomplished through executive action with a confirmed budget line in the preliminary financial plan.",
          ]}
          evidence="EO signed Day 72; Taylor Brown appointed; NYC declared LGBTQIA+ sanctuary; FY27 budget line confirmed."
        />

        <ReportPromiseCard
          status="In progress"
          category="Labor"
          headline="Minimum Wage Push"
          paragraphs={[
            "A City Council bill has been introduced to raise the minimum wage to $30, which is aligned with Mamdani's campaign promise, though not yet enacted.",
            "Passage depends on the Council, whose relationship with Mamdani has at times been strained — Council Speaker Julie Menin has publicly opposed several of his positions.",
          ]}
          evidence="City Council bill introduced. Not yet enacted. Requires Council passage."
        />

        <ReportPromiseCard
          status="In progress"
          category="Labor"
          headline="Deliverista Hubs"
          paragraphs={[
            "Progress on investing in rest stops for food delivery workers, with a new hub announced near City Hall.",
            "It is an early, visible step for the city's largely immigrant delivery workforce — the kind of concrete delivery that has earned Mamdani a reputation as a mayor who governs as well as he communicates.",
          ]}
          evidence="New hub opened near City Hall. Budget line in FY27 plan (DCWP)."
        />

        {/* ═══ Less Movement ═══ */}
        <SectionDivider tag="Worth Noting" title="Where There's Less Movement" />

        <Callout color="#FCCC0A">
          <p className="text-base leading-relaxed" style={{ color: "#374151" }}>
            The promises with the least movement are in education and climate.
            We see no meaningful action yet on school renovations, green schoolyards, resilience
            hubs, or CUNY promises. Our analysis found that 73 of 100 promises require a funding
            allocation — of these, <strong className="text-black">32 show no dedicated FY2027 budget line</strong> in any existing
            document. The Adopted Budget, expected in June, will be the first real test.
          </p>
        </Callout>

        <Callout color="#EE352E">
          <p className="text-base leading-relaxed" style={{ color: "#374151" }}>
            <strong className="text-black">Healthcare is the starkest gap.</strong> None of the nine healthcare promises
            have a named program line. Mobile crisis teams, peer clubhouses, and expanded abortion
            access all lack any identified appropriation.
          </p>
        </Callout>

        {/* ═══ SECTION II ═══ */}
        <SectionDivider tag="Section II" title="Two Broken Promises" />

        <ReportPromiseCard
          status="Broken"
          category="Housing"
          headline="CityFHEPS Housing Vouchers Retreat"
          paragraphs={[
            "Mamdani campaigned on dropping the city's lawsuit against the CityFHEPS rental voucher expansion program, which provides housing assistance to low-income New Yorkers in city shelters. His administration instead appealed a court order that would have expanded it — a direct reversal of the campaign commitment.",
            '"It was very disappointing that he has walked this back," said Twyla Carter, chief executive of the Legal Aid Society. "The question isn\'t whether we can afford to expand it — it\'s really whether we can afford not to."',
          ]}
          evidence="Administration appealed court order directing CityFHEPS expansion. Campaign promise: drop the lawsuit entirely."
        />

        <ReportPromiseCard
          status="Broken"
          category="Libraries"
          headline="Public Library Funding Deprioritized"
          paragraphs={[
            "Mamdani pledged to allocate 0.5 percent of the city budget to the public library system. His FY 2027 Preliminary Budget has so far fell short of that threshold.",
            "Whether this is a full reversal or a budget-constrained delay remains to be seen. The June adopted budget is the next meaningful checkpoint.",
          ]}
          evidence="FY2027 Preliminary Budget below 0.5% threshold. Adopted Budget (June 2026) will be key test."
        />

        {/* ═══ SECTION III ═══ */}
        <SectionDivider tag="Section III" title="What We're Watching" />

        <PullQuote
          quote="Campaigning is easy. Governing is tough. That's true even in the best of times, and this is a more challenging time."
          cite="Mark Levine, NYC Comptroller"
        />

        <p className="text-lg leading-relaxed mb-5" style={{ color: "#1f2937" }}>
          This spring's budget negotiations will be a major test of where Mamdani's promises
          are headed. Can the administration close the <strong className="text-black">$5.4 billion budget gap</strong>?
          The answer will matter most for commitments that require substantial spending. For
          example, meeting the free buses promise — estimated to cost
          <strong className="text-black"> $600–800 million yearly</strong> — will likely depend on having more wiggle
          room in the budget.
        </p>

        <BigStatTile
          num="$5.4B"
          label="Budget gap facing the administration"
          context="Every promise requiring significant new spending lives in its shadow. Free buses alone is estimated at $600–800 million per year."
          color="#0C2788"
        />

        <p className="text-lg leading-relaxed mb-5" style={{ color: "#1f2937" }}>
          Our analysis found that 73 of 100 promises require funding allocation — of these,
          4 require state cooperation and 69 require a dedicated funding source. Currently,
          32 of those 69 show no dedicated FY2027 budget line in existing documents — not even
          an agency proxy — though this may change when the Adopted Budget is released in June.
        </p>

        <p className="text-lg leading-relaxed mb-5" style={{ color: "#1f2937" }}>
          Healthcare is the starkest case: none of the nine healthcare promises have a named
          program line, and mobile crisis teams, peer clubhouses, and expanded abortion access
          all lack any identified appropriation. The Adopted Budget, expected in June, will be
          the first real test of whether these gaps are deliberate or merely deferred.
        </p>

        <PullQuote
          quote="I am absolutely committed to making buses fast and free."
          cite="Mayor Mamdani, April 2026 — while acknowledging it will not happen this year"
        />

        <p className="text-lg leading-relaxed mb-5" style={{ color: "#1f2937" }}>
          Finally, we are wondering about the timelines for delivering the Mayor's promises.
          Many of these promises have yet to meet the "T" in SMART criteria,
          having no clear deadlines. It would be nice to put some of them on our calendars,
          for better tracking, of course.
        </p>

        {/* ═══ CLOSING ═══ */}
        <div className="border-t-4 border-[#0C2788] pt-8 mt-16 mb-10">
          <p className="text-lg leading-relaxed" style={{ color: "#1f2937" }}>
            Mamdani Tracker is an independent, nonpartisan public-interest project built to
            help New Yorkers follow how their city is governed. We are not affiliated with any
            campaign, political party, or government office.
          </p>
          <div className="mt-6">
            <Link
              to="/promises"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#0C2788] text-white font-bold uppercase tracking-[.15em] text-sm hover:bg-[#1436B3] transition-all no-underline"
            >
              Explore All Promises
              <ArrowRightIcon style={{ width: "1rem", height: "1rem" }} />
            </Link>
          </div>
        </div>

        {/* ═══ METHODOLOGY FOOTER ═══ */}
        <div className="border-t border-gray-200 pt-6 pb-12 text-sm leading-relaxed" style={{ color: "#808183" }}>
          <p className="mb-3">
            <strong className="text-black">Methodology:</strong> Promise statuses were determined by cross-referencing
            each of Mayor Mamdani's 100 campaign pledges against the NYC FY2026–2030 Preliminary
            Financial Plan (February 2026), Executive Orders 1–17, and press releases from
            nyc.gov. A promise is <strong>In Progress</strong> when confirmed executive or budget action
            is underway. <strong>Completed</strong> means the policy was formally enacted. <strong>Broken</strong>{" "}
            means the administration acted contrary to the pledge. All others are <strong>Not Yet Started</strong>.
          </p>
          <p>
            <strong className="text-black">Sources:</strong> NYC Office of Management and Budget; NYC Mayor's Office; The New York Times
            (Rubinstein & Goldenberg, April 10, 2026); BBC News (Halperin, April 10, 2026);
            The City NYC (Maldonado, Honan & Martinez, April 9, 2026); Marist Poll (April 2026);
            Siena University Poll (February 2026); Corcoran Group market report (March 2026).
          </p>
        </div>
      </div>
    </>
  );
}
