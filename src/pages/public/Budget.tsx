import { SEO } from "@/components/SEO";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell } from
"@/components/ui/table";

/* ── static data ── */

const agencies = [
{ name: "Dept of Education (DOE)", value: 31.2, color: "#0039A6" },
{ name: "Health + Hospitals (H+H)", value: 11.4, color: "#EE352E" },
{ name: "Social Services (DSS/HRA)", value: 10.8, color: "#FF6319" },
{ name: "Police (NYPD)", value: 5.8, color: "#B933AD" },
{ name: "Fire (FDNY)", value: 2.6, color: "#EE352E" },
{ name: "Correction (DOC)", value: 2.8, color: "#A7A9AC" },
{ name: "Sanitation (DSNY)", value: 2.1, color: "#00933C" },
{ name: "Parks & Recreation", value: 0.71, color: "#6CBE45" },
{ name: "All Other Agencies", value: 26.6, color: "#FCCC0A" }];

const maxAgency = Math.max(...agencies.map((a) => a.value));

const revenueSources = [
{ label: "General Property Tax", value: "$36.6B", pct: 28.8, color: "#0039A6" },
{ label: "Property Tax Increase (9.5%)", value: "$3.7B", pct: 2.9, color: "#0C2788" },
{ label: "Other Taxes (income, sales, corp)", value: "$50.2B", pct: 39.5, color: "#FF6319" },
{ label: "Miscellaneous Revenue", value: "$8.1B", pct: 6.4, color: "#A7A9AC" },
{ label: "State Aid (Hochul package)", value: "$1.5B", pct: 1.2, color: "#00933C" }];


const inheritedItems = [
{ label: "Health Insurance Stabilization Fund", value: "$1.1B" },
{ label: "State class size law mandate", value: "$600M" },
{ label: "Early childhood education shortfall", value: "$380M" },
{ label: "Health insurance rate increase (GHI)", value: "$418M" },
{ label: "Shelter cost re-estimate", value: "$1.2B" },
{ label: "Rental assistance cliffs (FY26–27)", value: "$2.5B" }];


const newSpending = [
{ label: "Snow removal emergency (FY26)", amount: "$100M" },
{ label: "Community Food Connection (HRA)", amount: "$54M" },
{ label: "Bellevue CPEP expansion (capital)", amount: "$48.2M" },
{ label: "200 Law Dept attorneys", amount: "$38M" },
{ label: "Homeless outreach (SHOW units)", amount: "$31.1M" },
{ label: "50 DOF auditors (+$100M/yr revenue)", amount: "~$12M" }];


const gapReduction = [
{ label: "Tax revenue upward revision", value: "+$7.3B", pos: true },
{ label: "Agency savings (CSO program)", value: "+$1.77B", pos: true },
{ label: "State aid (Hochul package)", value: "+$1.5B", pos: true },
{ label: "Property tax hike (9.5%)", value: "$3.7B", pos: false },
{ label: "Rainy Day Fund drawdown", value: "$980M", pos: false }];


const capitalPlan = [
{ label: "Environmental Protection (DEP)", value: "$20.2B" },
{ label: "Schools (DOE)", value: "$18.1B" },
{ label: "Housing (HPD/HDC/NYCHA)", value: "$17.4B" },
{ label: "Transportation & Transit", value: "$16.4B" },
{ label: "Admin. of Justice / Correction", value: "$13.8B" },
{ label: "Parks", value: "$5.5B" }];


const outyearData = [
{ item: "Total Revenue ($B)", fy26: "$91.2", fy27: "$97.6", fy28: "$99.2", fy29: "$100.9", fy30: "$103.6" },
{ item: "Total Expenditure ($B)", fy26: "$91.2", fy27: "$97.6", fy28: "$105.9", fy29: "$107.7", fy30: "$110.7" },
{ item: "Gap to Close ($B)", fy26: "$0", fy27: "$0", fy28: "–$6.7", fy29: "–$6.8", fy30: "–$7.1", isGap: true }];


/* ── donut helpers ── */
const DONUT_R = 60;
const DONUT_C = 2 * Math.PI * DONUT_R;

function donutSegments(sources: typeof revenueSources) {
  const total = sources.reduce((s, r) => s + r.pct, 0);
  let offset = 0;
  return sources.map((s) => {
    const len = s.pct / total * DONUT_C;
    const seg = { ...s, dashArray: `${len} ${DONUT_C - len}`, dashOffset: -offset };
    offset += len;
    return seg;
  });
}

/* ── Section title matching /promises pattern ── */
function SectionTitle({ children, badge }: {children: React.ReactNode;badge?: {label: string;color: string;};}) {
  return (
    <div className="border-t-4 border-[#0C2788] pt-4 mb-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-black tracking-tight" style={{ fontSize: "24px" }}>
          {children}
        </h2>
        {badge &&
        <span
          className="text-white text-xs font-bold uppercase tracking-wide px-3 py-1"
          style={{ backgroundColor: badge.color }}>

            {badge.label}
          </span>
        }
      </div>
    </div>);

}

/* ── component ── */

export default function Budget() {
  const segments = donutSegments(revenueSources);

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-5 lg:px-6 py-5">
      <SEO
        title="FY2027 Preliminary Budget · Mamdani Tracker"
        description="Mayor Mamdani's first budget: $127 billion all-funds, $94 billion in agency spending. Analysis of inherited fiscal gaps, new investments, and outyear projections."
        keywords="Zohran Mamdani, NYC budget, FY2027, preliminary budget, NYC OMB, fiscal plan, agency spending" />


      {/* ── PAGE HEADER (matches /promises pattern) ── */}
      <div className="mb-5">
        <div className="border-t-4 border-[#0C2788] pt-4 mb-3">
          


          <h1 className="font-bold text-black tracking-tight" style={{ fontSize: "40px" }}>
            FY2027 Preliminary Budget
          </h1>
        </div>
        <p className="text-base max-w-3xl" style={{ color: "#374151" }}>
          Mayor Mamdani's first budget: $127 billion all-funds, $94 billion in agency spending.
          96% of new dollars went to plugging inherited gaps.
        </p>
      </div>

      {/* ── KPI STRIP ── */}
      <div className="border border-gray-300 p-4 md:p-8 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
          { label: "Total Budget", num: "$127B", note: "All funds FY2027 · up from $124.6B in FY2026", color: "#0C2788" },
          { label: "Agency Spending", num: "$94B", note: "Operating agencies · $33B to pensions & debt service", color: "#00933C" },
          { label: "New Investment", num: "$576M", note: "Only 4% of $14B in new spending was truly new", color: "#FF6319" },
          { label: "FY2028 Gap", num: "$6.7B", note: "Grows to $7.1B by FY2030 · structural deficit", color: "#EE352E" }].
          map((kpi, i) =>
          <div key={i}>
              <p className="text-sm font-bold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>{kpi.label}</p>
              <p className="text-5xl md:text-6xl font-bold leading-none mb-2" style={{ color: kpi.color }}>{kpi.num}</p>
              <p className="text-sm" style={{ color: "#374151" }}>{kpi.note}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Row 1: Agency Spending + Revenue ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Agency Spending Breakdown */}
        <div className="border border-gray-300 p-4 md:p-6">
          <SectionTitle badge={{ label: "$94B total", color: "#0C2788" }}>Agency Spending Breakdown</SectionTitle>
          <div className="flex flex-col gap-3">
            {agencies.map((a) =>
            <div key={a.name} className="flex items-center gap-2.5">
                <span className="w-2 h-2 flex-shrink-0" style={{ backgroundColor: a.color }} />
                <span className="text-sm font-medium flex-1 min-w-0 truncate">{a.name}</span>
                <div className="flex-[2] relative">
                  <div className="h-4 bg-gray-100 border border-gray-300 overflow-hidden">
                    <div className="h-full" style={{ width: `${a.value / maxAgency * 100}%`, backgroundColor: a.color }} />
                  </div>
                </div>
                <span className="text-xs font-bold w-[52px] text-right flex-shrink-0" style={{ color: "#374151" }}>${a.value}B</span>
              </div>
            )}
          </div>
        </div>

        {/* Revenue Sources */}
        <div className="border border-gray-300 p-4 md:p-6">
          <SectionTitle>Where the $127B Goes</SectionTitle>
          <div className="flex flex-col sm:flex-row items-center gap-7">
            <svg width="150" height="150" viewBox="0 0 150 150" className="flex-shrink-0">
              {segments.map((s, i) =>
              <circle
                key={i}
                cx="75" cy="75" r={DONUT_R}
                fill="none"
                stroke={s.color}
                strokeWidth="22"
                strokeDasharray={s.dashArray}
                strokeDashoffset={s.dashOffset}
                transform="rotate(-90 75 75)" />

              )}
            </svg>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Revenue Sources FY2027</p>
              {revenueSources.map((r) =>
              <div key={r.label} className="flex items-center gap-2 text-sm">
                  <span className="w-2.5 h-2.5 flex-shrink-0" style={{ backgroundColor: r.color }} />
                  <span className="flex-1">{r.label}</span>
                  <span className="text-xs font-bold" style={{ color: "#374151" }}>{r.value}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Inherited Crisis + New Spending ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* New Programmatic Spending + Gap Reduction (full width) */}

        {/* New Programmatic Spending + Gap Reduction */}
        <div className="border border-gray-300 p-4 md:p-6">
          <SectionTitle badge={{ label: "$576M", color: "#00933C" }}>New Programmatic Spending</SectionTitle>
          <div className="flex flex-col gap-3 mb-4">
            {newSpending.map((ns) =>
            <div key={ns.label} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 flex-shrink-0" style={{ backgroundColor: "#00933C" }} />
                <span className="text-sm flex-1">{ns.label}</span>
                <span className="text-sm font-bold" style={{ color: "#0C2788" }}>{ns.amount}</span>
              </div>
            )}
          </div>
          <div className="border-l-4 border-[#FCCC0A] bg-yellow-50 p-3 text-sm mb-6" style={{ color: "#374151" }}>
            96% of $14B in new city-funded spending went to filling gaps inherited from the Adams administration — not new programs.
          </div>

          {/* Gap Reduction */}
          <SectionTitle>Gap Reduction: How Mamdani Closed It</SectionTitle>
          {gapReduction.map((g) =>
          <div key={g.label} className="flex justify-between items-baseline py-2 border-b border-gray-200 last:border-b-0 gap-3">
              <span className="text-sm flex-1" style={{ color: "#374151" }}>{g.label}</span>
              <span className={`text-sm font-bold`} style={{ color: g.pos ? "#00933C" : "#EE352E" }}>{g.value}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Row 3: Campaign Pledges + Outyear ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Campaign Pledge Tracker + Capital Plan */}
        <div className="border border-gray-300 p-4 md:p-6">
          <SectionTitle badge={{ label: "Below target", color: "#EE352E" }}>Campaign Pledge Tracker</SectionTitle>

          {/* Parks */}
          <div className="mb-5">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Parks & Recreation — Pledged 1% of budget</span>
              <span className="font-bold" style={{ color: "#EE352E" }}>0.57% actual</span>
            </div>
            <div className="h-4 bg-gray-100 border-2 border-black overflow-hidden">
              <div className="h-full" style={{ width: "57%", backgroundColor: "#EE352E" }} />
            </div>
            <p className="text-xs mt-1" style={{ color: "#374151" }}>$710M actual vs. $1,270M pledged – <strong style={{ color: "#EE352E" }}>$560M shortfall</strong></p>
          </div>

          {/* Libraries */}
          <div className="mb-5">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Libraries (NYPL/BPL/QPL) — Pledged 0.5%</span>
              <span className="font-bold" style={{ color: "#FF6319" }}>0.39% actual</span>
            </div>
            <div className="h-4 bg-gray-100 border-2 border-black overflow-hidden">
              <div className="h-full" style={{ width: "78%", backgroundColor: "#FF6319" }} />
            </div>
            <p className="text-xs mt-1" style={{ color: "#374151" }}>$497M actual vs. $635M pledged – <strong style={{ color: "#EE352E" }}>$138M shortfall</strong></p>
          </div>

          <div className="border-l-4 border-[#EE352E] bg-red-50 p-3 text-sm mb-6" style={{ color: "#374151" }}>
            Both Parks and Libraries fall short of their pledged funding levels. Parks gap widens to –$767M by FY2030.
          </div>

          {/* 5-Year Capital Plan */}
          <SectionTitle>5-Year Capital Plan · $113B FY27–31</SectionTitle>
          {capitalPlan.map((c) =>
          <div key={c.label} className="flex justify-between items-baseline py-2 border-b border-gray-200 last:border-b-0 gap-3">
              <span className="text-sm flex-1" style={{ color: "#374151" }}>{c.label}</span>
              <span className="text-sm font-bold" style={{ color: "#0C2788" }}>{c.value}</span>
            </div>
          )}
        </div>

        {/* Outyear Financial Plan + Two Paths */}
        <div className="border border-gray-300 p-4 md:p-6">
          <SectionTitle badge={{ label: "Structural gap", color: "#EE352E" }}>Outyear Financial Plan</SectionTitle>

          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-[#0C2788] bg-gray-100">
                  <TableHead className="text-xs font-bold uppercase tracking-wide text-left" style={{ color: "#6B7280" }}>Item</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wide text-right" style={{ color: "#6B7280" }}>FY26</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wide text-right" style={{ color: "#6B7280" }}>FY27</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wide text-right" style={{ color: "#6B7280" }}>FY28</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wide text-right" style={{ color: "#6B7280" }}>FY29</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wide text-right" style={{ color: "#6B7280" }}>FY30</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outyearData.map((row) =>
                <TableRow key={row.item} className={row.isGap ? "font-bold border-t-2 border-[#0C2788] bg-gray-100" : ""}>
                    <TableCell className="text-sm font-medium text-left">{row.item}</TableCell>
                    <TableCell className={`text-sm text-right ${row.isGap && row.fy26.startsWith("–") ? "font-bold" : ""}`} style={row.isGap && row.fy26.startsWith("–") ? { color: "#EE352E" } : {}}>{row.fy26}</TableCell>
                    <TableCell className={`text-sm text-right ${row.isGap && row.fy27.startsWith("–") ? "font-bold" : ""}`} style={row.isGap && row.fy27.startsWith("–") ? { color: "#EE352E" } : {}}>{row.fy27}</TableCell>
                    <TableCell className={`text-sm text-right ${row.isGap && row.fy28.startsWith("–") ? "font-bold" : ""}`} style={row.isGap && row.fy28.startsWith("–") ? { color: "#EE352E" } : {}}>{row.fy28}</TableCell>
                    <TableCell className={`text-sm text-right ${row.isGap && row.fy29.startsWith("–") ? "font-bold" : ""}`} style={row.isGap && row.fy29.startsWith("–") ? { color: "#EE352E" } : {}}>{row.fy29}</TableCell>
                    <TableCell className={`text-sm text-right ${row.isGap && row.fy30.startsWith("–") ? "font-bold" : ""}`} style={row.isGap && row.fy30.startsWith("–") ? { color: "#EE352E" } : {}}>{row.fy30}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="border-l-4 border-[#0C2788] bg-blue-50 p-3 mt-4 text-sm" style={{ color: "#374151" }}>
            FY2028–2030 structural gaps of $6.7B–$7.1B remain unresolved. Closing them requires either new revenue authority (Mamdani's Path 1 — taxing high earners and corporations) or further property tax hikes and reserve drawdowns (Path 2).
          </div>

        </div>
      </div>

      {/* Source attribution */}
      <p className="text-xs text-center mt-4 uppercase font-bold tracking-wide" style={{ color: "#6B7280" }}>
        Data: NYC OMB FY2027 Preliminary Budget · The City NYC · NYC Council Finance Division · Feb 2026
      </p>
    </div>);

}