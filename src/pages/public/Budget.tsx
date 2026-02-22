import { SEO } from "@/components/SEO";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

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
  { name: "All Other Agencies", value: 26.6, color: "#FCCC0A" },
];
const maxAgency = Math.max(...agencies.map((a) => a.value));

const revenueSources = [
  { label: "General Property Tax", value: "$36.6B", pct: 28.8, color: "#0039A6" },
  { label: "Property Tax Increase (9.5%)", value: "$3.7B", pct: 2.9, color: "#0C2788" },
  { label: "Other Taxes (income, sales, corp)", value: "$50.2B", pct: 39.5, color: "#FF6319" },
  { label: "Miscellaneous Revenue", value: "$8.1B", pct: 6.4, color: "#A7A9AC" },
  { label: "State Aid (Hochul package)", value: "$1.5B", pct: 1.2, color: "#00933C" },
];

const inheritedItems = [
  { label: "Health Insurance Stabilization Fund", value: "$1.1B" },
  { label: "State class size law mandate", value: "$600M" },
  { label: "Early childhood education shortfall", value: "$380M" },
  { label: "Health insurance rate increase (GHI)", value: "$418M" },
  { label: "Shelter cost re-estimate", value: "$1.2B" },
  { label: "Rental assistance cliffs (FY26–27)", value: "$2.5B" },
];

const newSpending = [
  { label: "Snow removal emergency (FY26)", amount: "$100M" },
  { label: "Community Food Connection (HRA)", amount: "$54M" },
  { label: "Bellevue CPEP expansion (capital)", amount: "$48.2M" },
  { label: "200 Law Dept attorneys", amount: "$38M" },
  { label: "Homeless outreach (SHOW units)", amount: "$31.1M" },
  { label: "50 DOF auditors (+$100M/yr revenue)", amount: "~$12M" },
];

const gapReduction = [
  { label: "Tax revenue upward revision", value: "+$7.3B", pos: true },
  { label: "Agency savings (CSO program)", value: "+$1.77B", pos: true },
  { label: "State aid (Hochul package)", value: "+$1.5B", pos: true },
  { label: "Property tax hike (9.5%)", value: "$3.7B", pos: false },
  { label: "Rainy Day Fund drawdown", value: "$980M", pos: false },
];

const capitalPlan = [
  { label: "Environmental Protection (DEP)", value: "$20.2B" },
  { label: "Schools (DOE)", value: "$18.1B" },
  { label: "Housing (HPD/HDC/NYCHA)", value: "$17.4B" },
  { label: "Transportation & Transit", value: "$16.4B" },
  { label: "Admin. of Justice / Correction", value: "$13.8B" },
  { label: "Parks", value: "$5.5B" },
];

const outyearData = [
  { item: "Total Revenue ($B)", fy26: "$91.2", fy27: "$97.6", fy28: "$99.2", fy29: "$100.9", fy30: "$103.6" },
  { item: "Total Expenditure ($B)", fy26: "$91.2", fy27: "$97.6", fy28: "$105.9", fy29: "$107.7", fy30: "$110.7" },
  { item: "Gap to Close ($B)", fy26: "$0", fy27: "$0", fy28: "–$6.7", fy29: "–$6.8", fy30: "–$7.1", isGap: true },
];

/* ── donut helpers ── */
const DONUT_R = 60;
const DONUT_C = 2 * Math.PI * DONUT_R;

function donutSegments(sources: typeof revenueSources) {
  const total = sources.reduce((s, r) => s + r.pct, 0);
  let offset = 0;
  return sources.map((s) => {
    const len = (s.pct / total) * DONUT_C;
    const seg = { ...s, dashArray: `${len} ${DONUT_C - len}`, dashOffset: -offset };
    offset += len;
    return seg;
  });
}

/* ── component ── */

export default function Budget() {
  const segments = donutSegments(revenueSources);

  return (
    <>
      <SEO
        title="FY2027 Preliminary Budget · Mamdani Tracker"
        description="Mayor Mamdani's first budget: $127 billion all-funds, $94 billion in agency spending. Analysis of inherited fiscal gaps, new investments, and outyear projections."
        keywords="Zohran Mamdani, NYC budget, FY2027, preliminary budget, NYC OMB, fiscal plan, agency spending"
      />

      {/* ── HERO ── */}
      <section style={{ backgroundColor: "#0C2788" }} className="border-t-4 border-[#FCCC0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
          <p className="text-[0.7rem] font-mono uppercase tracking-[0.12em] mb-3" style={{ color: "#FCCC0A" }}>
            Released February 18, 2026 · NYC OMB
          </p>
          <h1 className="text-white text-[clamp(2.2rem,5vw,3.5rem)] font-black leading-[1.05] tracking-tight mb-4 max-w-[640px]">
            FY2027 Preliminary Budget
          </h1>
          <p className="text-white/75 font-light text-[0.9375rem] leading-relaxed max-w-[560px]">
            Mayor Mamdani's first budget: $127 billion all-funds, $94 billion in agency spending. 96% of new dollars went to plugging inherited gaps.
          </p>
        </div>
      </section>

      {/* ── KPI STRIP ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 bg-white border-b border-[#D8DAE0]">
        {[
          { label: "Total Budget", num: "$127B", note: "All funds FY2027 · up from $124.6B in FY2026", color: "#0C2788" },
          { label: "Agency Spending", num: "$94B", note: "Operating agencies · $33B to pensions & debt service", color: "#00933C" },
          { label: "New Investment", num: "$576M", note: "Only 4% of $14B in new spending was truly new", color: "#FF6319" },
          { label: "FY2028 Gap", num: "$6.7B", note: "Grows to $7.1B by FY2030 · structural deficit", color: "#EE352E" },
        ].map((kpi, i) => (
          <div key={i} className="p-6 border-r border-b lg:border-b-0 border-[#D8DAE0] last:border-r-0">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-[#3D3D3D] mb-1">{kpi.label}</p>
            <p className="text-[2.4rem] font-black leading-none mb-1" style={{ color: kpi.color }}>{kpi.num}</p>
            <p className="text-[0.8125rem] text-[#3D3D3D] leading-snug">{kpi.note}</p>
          </div>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Row 1: Agency Spending + Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Agency Spending Breakdown */}
          <div className="bg-white border border-[#D8DAE0] p-6">
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.1em] mb-5 pb-2.5 border-b-2 border-[#E9EDFB] flex justify-between items-center" style={{ color: "#0C2788" }}>
              <span>Agency Spending Breakdown</span>
              <span className="text-white text-[0.6rem] px-2 py-0.5 tracking-[0.06em]" style={{ backgroundColor: "#0C2788" }}>$94B total</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {agencies.map((a) => (
                <div key={a.name} className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: a.color }} />
                  <span className="text-[0.8125rem] font-medium flex-1 min-w-0 truncate">{a.name}</span>
                  <div className="flex-[2] relative">
                    <div className="h-4 bg-[#F4F5F7] border border-[#D8DAE0] overflow-hidden">
                      <div className="h-full" style={{ width: `${(a.value / maxAgency) * 100}%`, backgroundColor: a.color }} />
                    </div>
                  </div>
                  <span className="font-mono text-[0.7rem] text-[#3D3D3D] w-[52px] text-right flex-shrink-0">${a.value}B</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Sources */}
          <div className="bg-white border border-[#D8DAE0] p-6">
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.1em] mb-5 pb-2.5 border-b-2 border-[#E9EDFB]" style={{ color: "#0C2788" }}>
              Where the $127B Goes
            </div>
            <div className="flex items-center gap-7">
              <svg width="150" height="150" viewBox="0 0 150 150" className="flex-shrink-0">
                {segments.map((s, i) => (
                  <circle
                    key={i}
                    cx="75" cy="75" r={DONUT_R}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="22"
                    strokeDasharray={s.dashArray}
                    strokeDashoffset={s.dashOffset}
                    transform="rotate(-90 75 75)"
                  />
                ))}
              </svg>
              <div className="flex flex-col gap-2">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-[#3D3D3D] mb-1">Revenue Sources FY2027</p>
                {revenueSources.map((r) => (
                  <div key={r.label} className="flex items-center gap-2 text-[0.8125rem]">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                    <span className="flex-1">{r.label}</span>
                    <span className="font-mono text-[0.7rem] text-[#3D3D3D]">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Inherited Crisis + New Spending */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Inherited Fiscal Crisis */}
          <div className="bg-white border border-[#D8DAE0] p-6">
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.1em] mb-5 pb-2.5 border-b-2 border-[#E9EDFB] flex justify-between items-center" style={{ color: "#0C2788" }}>
              <span>Inherited Fiscal Crisis</span>
              <span className="text-[0.6rem] px-2 py-0.5 tracking-[0.06em]" style={{ backgroundColor: "#EE352E", color: "#fff" }}>Adams legacy</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 mb-5">
              <div>
                <p className="text-[2rem] font-black leading-none mb-1" style={{ color: "#EE352E" }}>$12B+</p>
                <p className="text-[0.8125rem] text-[#3D3D3D] leading-snug">True FY26–27 gap — 3× what Adams published. Independently estimated by Comptrollers Lander, Levine, and DiNapoli.</p>
              </div>
              <div>
                <p className="text-[2rem] font-black leading-none mb-1" style={{ color: "#EE352E" }}>6.8%</p>
                <p className="text-[0.8125rem] text-[#3D3D3D] leading-snug">Gap as % of revenue — highest since 2009. Pre-COVID average was 3.5%.</p>
              </div>
            </div>
            {inheritedItems.map((it) => (
              <div key={it.label} className="flex justify-between items-baseline py-2 border-b border-[#D8DAE0] last:border-b-0 gap-3">
                <span className="text-[0.8125rem] text-[#3D3D3D] flex-1">{it.label}</span>
                <span className="font-mono text-[0.8125rem] font-medium" style={{ color: "#0C2788" }}>{it.value}</span>
              </div>
            ))}
            <div className="border-l-[3px] border-[#EE352E] bg-[#FEF2F2] p-3 mt-4 text-[0.8125rem] leading-snug text-[#3D3D3D]">
              <strong className="text-black">$7.54B</strong> in unbudgeted spending inherited across six major categories including cash assistance, shelter, due process cases, and MTA subsidies.
            </div>
          </div>

          {/* New Programmatic Spending + Gap Reduction */}
          <div className="bg-white border border-[#D8DAE0] p-6">
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.1em] mb-5 pb-2.5 border-b-2 border-[#E9EDFB] flex justify-between items-center" style={{ color: "#0C2788" }}>
              <span>New Programmatic Spending</span>
              <span className="text-white text-[0.6rem] px-2 py-0.5 tracking-[0.06em]" style={{ backgroundColor: "#00933C" }}>$576M</span>
            </div>
            <div className="flex flex-col gap-2.5 mb-4">
              {newSpending.map((ns) => (
                <div key={ns.label} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#00933C" }} />
                  <span className="text-[0.8125rem] flex-1">{ns.label}</span>
                  <span className="font-mono text-[0.8125rem] font-medium" style={{ color: "#0C2788" }}>{ns.amount}</span>
                </div>
              ))}
            </div>
            <div className="border-l-[3px] border-[#FCCC0A] bg-[#FFFBEB] p-3 text-[0.8125rem] leading-snug text-[#3D3D3D] mb-6">
              96% of $14B in new city-funded spending went to filling gaps inherited from the Adams administration — not new programs.
            </div>

            {/* Gap Reduction */}
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] mb-4 pb-2.5 border-b-2 border-[#E9EDFB]" style={{ color: "#0C2788" }}>
              Gap Reduction: How Mamdani Closed It
            </p>
            {gapReduction.map((g) => (
              <div key={g.label} className="flex justify-between items-baseline py-2 border-b border-[#D8DAE0] last:border-b-0 gap-3">
                <span className="text-[0.8125rem] text-[#3D3D3D] flex-1">{g.label}</span>
                <span className={`font-mono text-[0.8125rem] font-medium ${g.pos ? "text-[#00933C]" : "text-[#EE352E]"}`}>{g.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Campaign Pledges + Outyear */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Campaign Pledge Tracker + Capital Plan */}
          <div className="bg-white border border-[#D8DAE0] p-6">
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.1em] mb-5 pb-2.5 border-b-2 border-[#E9EDFB] flex justify-between items-center" style={{ color: "#0C2788" }}>
              <span>Campaign Pledge Tracker</span>
              <span className="text-[0.6rem] px-2 py-0.5 tracking-[0.06em]" style={{ backgroundColor: "#EE352E", color: "#fff" }}>Below target</span>
            </div>

            {/* Parks */}
            <div className="mb-4">
              <div className="flex justify-between text-[0.8125rem] mb-1">
                <span className="font-medium">Parks & Recreation — Pledged 1% of budget</span>
                <span className="font-mono text-[0.75rem]">0.57% actual</span>
              </div>
              <div className="h-1.5 bg-[#F4F5F7] border border-[#D8DAE0] overflow-hidden">
                <div className="h-full" style={{ width: "57%", backgroundColor: "#EE352E" }} />
              </div>
              <p className="text-[0.75rem] text-[#3D3D3D] mt-1">$710M actual vs. $1,270M pledged – <strong className="text-[#EE352E]">$560M shortfall</strong></p>
            </div>

            {/* Libraries */}
            <div className="mb-4">
              <div className="flex justify-between text-[0.8125rem] mb-1">
                <span className="font-medium">Libraries (NYPL/BPL/QPL) — Pledged 0.5%</span>
                <span className="font-mono text-[0.75rem]">0.39% actual</span>
              </div>
              <div className="h-1.5 bg-[#F4F5F7] border border-[#D8DAE0] overflow-hidden">
                <div className="h-full" style={{ width: "78%", backgroundColor: "#FF6319" }} />
              </div>
              <p className="text-[0.75rem] text-[#3D3D3D] mt-1">$497M actual vs. $635M pledged – <strong className="text-[#EE352E]">$138M shortfall</strong></p>
            </div>

            <div className="border-l-[3px] border-[#EE352E] bg-[#FEF2F2] p-3 text-[0.8125rem] leading-snug text-[#3D3D3D] mb-6">
              Both Parks and Libraries fall short of their pledged funding levels. Parks gap widens to –$767M by FY2030.
            </div>

            {/* 5-Year Capital Plan */}
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] mb-4 pb-2.5 border-b-2 border-[#E9EDFB]" style={{ color: "#0C2788" }}>
              5-Year Capital Plan · $113B FY27–31
            </p>
            {capitalPlan.map((c) => (
              <div key={c.label} className="flex justify-between items-baseline py-2 border-b border-[#D8DAE0] last:border-b-0 gap-3">
                <span className="text-[0.8125rem] text-[#3D3D3D] flex-1">{c.label}</span>
                <span className="font-mono text-[0.8125rem] font-medium" style={{ color: "#0C2788" }}>{c.value}</span>
              </div>
            ))}
          </div>

          {/* Outyear Financial Plan + Two Paths */}
          <div className="bg-white border border-[#D8DAE0] p-6">
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.1em] mb-5 pb-2.5 border-b-2 border-[#E9EDFB] flex justify-between items-center" style={{ color: "#0C2788" }}>
              <span>Outyear Financial Plan</span>
              <span className="text-[0.6rem] px-2 py-0.5 tracking-[0.06em]" style={{ backgroundColor: "#EE352E", color: "#fff" }}>Structural gap</span>
            </div>

            <div className="overflow-auto">
              <Table className="text-[0.8125rem]">
                <TableHeader>
                  <TableRow className="border-b-2 border-[#0C2788]" style={{ backgroundColor: "#E9EDFB" }}>
                    <TableHead className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[#3D3D3D] text-left">Item</TableHead>
                    <TableHead className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[#3D3D3D] text-right">FY26</TableHead>
                    <TableHead className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[#3D3D3D] text-right">FY27</TableHead>
                    <TableHead className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[#3D3D3D] text-right">FY28</TableHead>
                    <TableHead className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[#3D3D3D] text-right">FY29</TableHead>
                    <TableHead className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[#3D3D3D] text-right">FY30</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outyearData.map((row) => (
                    <TableRow key={row.item} className={row.isGap ? "font-bold border-t-2 border-[#0C2788]" : ""} style={row.isGap ? { backgroundColor: "#E9EDFB" } : {}}>
                      <TableCell className="font-medium text-left">{row.item}</TableCell>
                      <TableCell className={`text-right ${row.isGap && row.fy26.startsWith("–") ? "text-[#EE352E] font-semibold" : ""}`}>{row.fy26}</TableCell>
                      <TableCell className={`text-right ${row.isGap && row.fy27.startsWith("–") ? "text-[#EE352E] font-semibold" : ""}`}>{row.fy27}</TableCell>
                      <TableCell className={`text-right ${row.isGap && row.fy28.startsWith("–") ? "text-[#EE352E] font-semibold" : ""}`}>{row.fy28}</TableCell>
                      <TableCell className={`text-right ${row.isGap && row.fy29.startsWith("–") ? "text-[#EE352E] font-semibold" : ""}`}>{row.fy29}</TableCell>
                      <TableCell className={`text-right ${row.isGap && row.fy30.startsWith("–") ? "text-[#EE352E] font-semibold" : ""}`}>{row.fy30}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="border-l-[3px] border-[#0C2788] bg-[#E9EDFB] p-3 mt-4 text-[0.8125rem] leading-snug text-[#3D3D3D]">
              FY2028–2030 structural gaps of $6.7B–$7.1B remain unresolved. Closing them requires either new revenue authority (Mamdani's Path 1 — taxing high earners and corporations) or further property tax hikes and reserve drawdowns (Path 2).
            </div>

            {/* Two Paths */}
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] mt-6 mb-4 pb-2.5 border-b-2 border-[#E9EDFB]" style={{ color: "#0C2788" }}>
              Two Paths to Close the Gap
            </p>
            <div className="flex flex-col gap-4">
              <div className="border-l-[3px] border-[#00933C] bg-[#F0FDF4] p-3">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[0.8125rem] font-medium">Path 1 (Goal)</span>
                  <span className="font-mono text-[0.7rem]" style={{ color: "#00933C" }}>Tax authority</span>
                </div>
                <p className="text-[0.8125rem] text-[#3D3D3D] leading-snug">
                  Income tax on earners &gt;$1M · corporate tax · fix NYC/NYS fiscal imbalance (NYC sends 54.5% of state revenue, gets 40.5% back)
                </p>
              </div>
              <div className="border-l-[3px] border-[#EE352E] bg-[#FEF2F2] p-3">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[0.8125rem] font-medium">Path 2 (Last resort)</span>
                  <span className="font-mono text-[0.7rem]" style={{ color: "#EE352E" }}>Austerity tools</span>
                </div>
                <p className="text-[0.8125rem] text-[#3D3D3D] leading-snug">
                  Further property tax hikes · Rainy Day Fund · Retiree Health Trust drawdowns · affects 3M+ residential units
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Source attribution */}
        <p className="text-[0.75rem] text-[#A7A9AC] font-mono text-center mt-4">
          Data: NYC OMB FY2027 Preliminary Budget · The City NYC · NYC Council Finance Division · Feb 2026
        </p>
      </div>
    </>
  );
}
