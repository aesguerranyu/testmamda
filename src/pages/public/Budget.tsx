import { useState } from "react";
import { SEO } from "@/components/SEO";
import { ChartBarIcon, BanknotesIcon } from "@heroicons/react/24/solid";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table";

/* ── DATA (source of truth) ── */

const agencies = [
  { department: "Dept of Education (DOE)", amount: 31.2, percent: 33.2, color: "#0039A6" },
  { department: "Health + Hospitals (H+H)", amount: 11.4, percent: 12.1, color: "#EE352E" },
  { department: "Social Services (DSS/HRA)", amount: 10.8, percent: 11.5, color: "#FF6319" },
  { department: "Police (NYPD)", amount: 5.8, percent: 6.2, color: "#B933AD" },
  { department: "Correction (DOC)", amount: 2.8, percent: 3.0, color: "#A7A9AC" },
  { department: "Fire (FDNY)", amount: 2.6, percent: 2.8, color: "#EE352E" },
  { department: "Sanitation (DSNY)", amount: 2.1, percent: 2.2, color: "#00933C" },
  { department: "Parks & Recreation", amount: 0.71, percent: 0.76, color: "#6CBE45" },
  { department: "All Other Agencies", amount: 26.6, percent: 28.3, color: "#FCCC0A" },
];

const revenueSources = [
  { name: "General Property Tax", value: 36.6, percent: 28.8, color: "#0039A6" },
  { name: "Property Tax Increase (9.5%)", value: 3.7, percent: 2.9, color: "#0C2788" },
  { name: "Other Taxes (income, sales, corp)", value: 50.2, percent: 39.5, color: "#FF6319" },
  { name: "Miscellaneous Revenue", value: 8.1, percent: 6.4, color: "#A7A9AC" },
  { name: "State Aid (Hochul package)", value: 1.5, percent: 1.2, color: "#00933C" },
];

const newSpending = [
  { title: "Snow removal emergency (FY26)", amount: 0.1, description: "Emergency allocation for severe winter weather response", department: "DSNY", status: "New" },
  { title: "Community Food Connection (HRA)", amount: 0.054, description: "Expanding food access programs through HRA community partnerships", department: "Social Services", status: "New" },
  { title: "Bellevue CPEP expansion (capital)", amount: 0.0482, description: "Capital investment in psychiatric emergency capacity at Bellevue", department: "H+H", status: "Expanded" },
  { title: "200 Law Dept attorneys", amount: 0.038, description: "Hiring 200 new attorneys to strengthen city legal representation", department: "Law Dept", status: "New" },
  { title: "Homeless outreach (SHOW units)", amount: 0.0311, description: "New Street Homeless Outreach Worker units for direct engagement", department: "DSS", status: "Expanded" },
  { title: "50 DOF auditors (+$100M/yr revenue)", amount: 0.012, description: "Revenue-generating hire: 50 auditors projected to raise $100M annually", department: "DOF", status: "New" },
];

const outyearData = [
  { item: "Total Revenue ($B)", fy26: "$91.2", fy27: "$97.6", fy28: "$99.2", fy29: "$100.9", fy30: "$103.6" },
  { item: "Total Expenditure ($B)", fy26: "$91.2", fy27: "$97.6", fy28: "$105.9", fy29: "$107.7", fy30: "$110.7" },
  { item: "Gap to Close ($B)", fy26: "$0", fy27: "$0", fy28: "–$6.7", fy29: "–$6.8", fy30: "–$7.1", isGap: true },
];

const capitalPlan = [
  { name: "Environmental Protection (DEP)", value: 20.2, color: "#0039A6" },
  { name: "Schools (DOE)", value: 18.1, color: "#00933C" },
  { name: "Housing (HPD/HDC/NYCHA)", value: 17.4, color: "#FF6319" },
  { name: "Transportation & Transit", value: 16.4, color: "#FCCC0A" },
  { name: "Admin. of Justice / Correction", value: 13.8, color: "#B933AD" },
  { name: "Parks", value: 5.5, color: "#6CBE45" },
];

const historicalTrend = [
  { year: "FY 2024", budget: 112.4 },
  { year: "FY 2025", budget: 115.2 },
  { year: "FY 2026", budget: 124.6 },
  { year: "FY 2027", budget: 127.0 },
];

const PIE_COLORS = ["#0039A6", "#0C2788", "#FF6319", "#A7A9AC", "#00933C", "#EE352E", "#B933AD"];

/* ── Password Gate ── */
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (pw === "MamdaniBudget") {
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

/* ── Main Component ── */
export default function Budget() {
  const [unlocked, setUnlocked] = useState(false);
  const [selectedView, setSelectedView] = useState<"departments" | "revenue" | "capital">("departments");

  const formatBillion = (value: number) => `$${value.toFixed(1)}B`;

  if (!unlocked) {
    return (
      <>
        <SEO
          title="FY2027 Preliminary Budget · Mamdani Tracker"
          description="Mayor Mamdani's first budget: $127 billion all-funds, $94 billion in agency spending."
        />
        <PasswordGate onUnlock={() => setUnlocked(true)} />
      </>
    );
  }

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <SEO
        title="FY2027 Preliminary Budget · Mamdani Tracker"
        description="Mayor Mamdani's first budget: $127 billion all-funds, $94 billion in agency spending. Analysis of inherited fiscal gaps, new investments, and outyear projections."
        keywords="Zohran Mamdani, NYC budget, FY2027, preliminary budget, NYC OMB, fiscal plan, agency spending"
      />

      {/* Hero Section — uniform header */}
      <div style={{ borderTop: "6px solid #0C2788" }}>
        <div className="container mx-auto max-w-7xl px-4 sm:px-5 lg:px-6 py-8">
          <h1 className="font-bold tracking-tight text-3xl sm:text-4xl mb-2" style={{ color: "#111827" }}>
            FY 2027 Preliminary Budget
          </h1>
          <p className="text-sm sm:text-base" style={{ color: "#6B7280", maxWidth: "640px" }}>
            Mayor Mamdani's first budget: $127 billion all-funds, $94 billion in agency spending.
            96% of new dollars went to plugging inherited gaps.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-5 lg:px-6 py-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Budget", num: "$127B", note: "All funds FY2027 · up from $124.6B in FY2026", change: "+1.9%" },
            { label: "Agency Spending", num: "$94B", note: "Operating agencies · $33B to pensions & debt service" },
            { label: "New Investment", num: "$576M", note: "Only 4% of $14B in new spending was truly new" },
            { label: "FY2028 Gap", num: "$6.7B", note: "Grows to $7.1B by FY2030 · structural deficit" },
          ].map((kpi, i) => (
            <div
              key={i}
              className="bg-white p-5 border border-gray-200 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#6B7280" }}>
                {kpi.label}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold leading-none" style={{ color: "#111827" }}>
                  {kpi.num}
                </p>
                {kpi.change && (
                  <span
                    className="text-xs font-bold px-2 py-0.5"
                    style={{ backgroundColor: "#00933C", color: "#FFFFFF" }}
                  >
                    {kpi.change}
                  </span>
                )}
              </div>
              <p className="text-xs mt-2" style={{ color: "#374151" }}>{kpi.note}</p>
            </div>
          ))}
        </div>

        {/* Budget Growth Trend */}
        <div className="bg-white border border-gray-200 p-5 mb-8">
          <h2 className="font-bold text-lg mb-4" style={{ color: "#111827" }}>
            Budget Growth Trend
          </h2>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={historicalTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value}B`}
                />
                <Tooltip formatter={(value: number) => [`$${value.toFixed(1)}B`, "Budget"]} />
                <Line
                  type="monotone"
                  dataKey="budget"
                  stroke="#0C2788"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#0C2788" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Toggle View */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex border border-gray-300">
            {(["departments", "revenue", "capital"] as const).map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className="text-sm font-bold px-6 py-2.5 transition-colors"
                style={{
                  backgroundColor: selectedView === view ? "#0C2788" : "#FFFFFF",
                  color: selectedView === view ? "#FFFFFF" : "#374151",
                }}
              >
                {view === "departments" ? "By Agency" : view === "revenue" ? "Revenue Sources" : "Capital Plan"}
              </button>
            ))}
          </div>
        </div>

        {/* Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white border border-gray-200 p-5">
            <h2 className="font-bold text-lg mb-4" style={{ color: "#111827" }}>
              {selectedView === "departments" ? "Budget by Agency" : selectedView === "revenue" ? "Revenue Sources" : "5-Year Capital Plan · $113B"}
            </h2>
            <div style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer>
                {selectedView === "departments" ? (
                  <BarChart data={agencies} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis type="number" tickFormatter={(v) => `$${v}B`} tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="department"
                      width={180}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value: number) => [`$${value.toFixed(1)}B`, "Amount"]}
                    />
                    <Bar dataKey="amount" radius={[0, 2, 2, 0]}>
                      {agencies.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : selectedView === "revenue" ? (
                  <PieChart>
                    <Pie
                      data={revenueSources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name.split(" ")[0]} (${percent}%)`}
                      outerRadius={150}
                      dataKey="value"
                    >
                      {revenueSources.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`$${value.toFixed(1)}B`, "Revenue"]} />
                  </PieChart>
                ) : (
                  <BarChart data={capitalPlan} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis type="number" tickFormatter={(v) => `$${v}B`} tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={200}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value: number) => [`$${value.toFixed(1)}B`, "Amount"]}
                    />
                    <Bar dataKey="value" radius={[0, 2, 2, 0]}>
                      {capitalPlan.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side panel */}
          <div className="bg-white border border-gray-200 p-5">
            <h2 className="font-bold text-lg mb-4" style={{ color: "#111827" }}>
              {selectedView === "departments" ? "Top Agencies" : selectedView === "revenue" ? "Revenue Breakdown" : "Capital Breakdown"}
            </h2>
            <div className="flex flex-col gap-3">
              {(selectedView === "departments" ? agencies.slice(0, 6) : selectedView === "revenue" ? revenueSources : capitalPlan).map((item: any, index: number) => (
                <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium" style={{ color: "#111827" }}>
                        {item.department || item.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: "#0C2788" }}>
                      ${(item.amount || item.value).toFixed(1)}B
                    </span>
                  </div>
                  {"percent" in item && (
                    <p className="text-xs ml-5" style={{ color: "#6B7280" }}>
                      {item.percent}% of total
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Pledges */}
        <div className="bg-white border border-gray-200 p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg" style={{ color: "#111827" }}>
              Campaign Pledge Tracker
            </h2>
            <span
              className="text-xs font-bold uppercase tracking-wide px-3 py-1"
              style={{ backgroundColor: "#EE352E", color: "#FFFFFF" }}
            >
              Below target
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Parks */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Parks & Recreation — Pledged 1% of budget</span>
                <span className="font-bold" style={{ color: "#EE352E" }}>0.57% actual</span>
              </div>
              <div className="h-4 bg-gray-100 border border-gray-300 overflow-hidden">
                <div className="h-full" style={{ width: "57%", backgroundColor: "#EE352E" }} />
              </div>
              <p className="text-xs mt-1" style={{ color: "#374151" }}>
                $710M actual vs. $1,270M pledged – <strong style={{ color: "#EE352E" }}>$560M shortfall</strong>
              </p>
            </div>

            {/* Libraries */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Libraries (NYPL/BPL/QPL) — Pledged 0.5%</span>
                <span className="font-bold" style={{ color: "#FF6319" }}>0.39% actual</span>
              </div>
              <div className="h-4 bg-gray-100 border border-gray-300 overflow-hidden">
                <div className="h-full" style={{ width: "78%", backgroundColor: "#FF6319" }} />
              </div>
              <p className="text-xs mt-1" style={{ color: "#374151" }}>
                $497M actual vs. $635M pledged – <strong style={{ color: "#EE352E" }}>$138M shortfall</strong>
              </p>
            </div>
          </div>

          <div
            className="mt-4 p-3 text-sm"
            style={{ borderLeft: "4px solid #EE352E", backgroundColor: "#FEF2F2", color: "#374151" }}
          >
            Both Parks and Libraries fall short of their pledged funding levels. Parks gap widens to –$767M by FY2030.
          </div>
        </div>

        {/* Key Initiatives */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ChartBarIcon className="h-6 w-6" style={{ color: "#0C2788" }} />
            <h2 className="font-bold text-lg" style={{ color: "#111827" }}>
              Key Budget Initiatives
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newSpending.map((initiative, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 p-5 hover:shadow-md transition-shadow"
                style={{ borderLeft: "4px solid #00933C" }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-sm" style={{ color: "#111827" }}>
                    {initiative.title}
                  </h3>
                  <span
                    className="text-xs font-bold px-2 py-0.5 flex-shrink-0 ml-2"
                    style={{
                      backgroundColor: initiative.status === "New" ? "#00933C" : "#0C2788",
                      color: "#FFFFFF",
                    }}
                  >
                    {initiative.status}
                  </span>
                </div>
                <p className="text-xs mb-3" style={{ color: "#6B7280" }}>
                  {initiative.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-bold px-2 py-0.5"
                    style={{ backgroundColor: "#F3F4F6", color: "#374151" }}
                  >
                    {initiative.department}
                  </span>
                  <span className="text-sm font-bold" style={{ color: "#00933C" }}>
                    {formatBillion(initiative.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outyear Financial Plan */}
        <div className="bg-white border border-gray-200 p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg" style={{ color: "#111827" }}>
              Outyear Financial Plan
            </h2>
            <span
              className="text-xs font-bold uppercase tracking-wide px-3 py-1"
              style={{ backgroundColor: "#EE352E", color: "#FFFFFF" }}
            >
              Structural gap
            </span>
          </div>

          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ borderBottom: "2px solid #0C2788", backgroundColor: "#F9FAFB" }}>
                  <TableHead className="text-xs font-bold uppercase tracking-wide text-left" style={{ color: "#6B7280" }}>Item</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wide text-right" style={{ color: "#6B7280" }}>FY26</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wide text-right" style={{ color: "#6B7280" }}>FY27</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wide text-right" style={{ color: "#6B7280" }}>FY28</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wide text-right" style={{ color: "#6B7280" }}>FY29</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wide text-right" style={{ color: "#6B7280" }}>FY30</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outyearData.map((row) => (
                  <TableRow
                    key={row.item}
                    className={row.isGap ? "font-bold" : ""}
                    style={row.isGap ? { borderTop: "2px solid #0C2788", backgroundColor: "#F9FAFB" } : {}}
                  >
                    <TableCell className="text-sm font-medium text-left">{row.item}</TableCell>
                    <TableCell className="text-sm text-right" style={row.isGap && row.fy26.startsWith("–") ? { color: "#EE352E", fontWeight: 700 } : {}}>{row.fy26}</TableCell>
                    <TableCell className="text-sm text-right" style={row.isGap && row.fy27.startsWith("–") ? { color: "#EE352E", fontWeight: 700 } : {}}>{row.fy27}</TableCell>
                    <TableCell className="text-sm text-right" style={row.isGap && row.fy28.startsWith("–") ? { color: "#EE352E", fontWeight: 700 } : {}}>{row.fy28}</TableCell>
                    <TableCell className="text-sm text-right" style={row.isGap && row.fy29.startsWith("–") ? { color: "#EE352E", fontWeight: 700 } : {}}>{row.fy29}</TableCell>
                    <TableCell className="text-sm text-right" style={row.isGap && row.fy30.startsWith("–") ? { color: "#EE352E", fontWeight: 700 } : {}}>{row.fy30}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div
            className="mt-4 p-3 text-sm"
            style={{ borderLeft: "4px solid #0C2788", backgroundColor: "#EFF6FF", color: "#374151" }}
          >
            FY2028–2030 structural gaps of $6.7B–$7.1B remain unresolved. Closing them requires either new revenue authority (Mamdani's Path 1 — taxing high earners and corporations) or further property tax hikes and reserve drawdowns (Path 2).
          </div>
        </div>

        {/* Context Notice */}
        <div
          className="p-4 mb-6 text-sm"
          style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", color: "#6B7280" }}
        >
          ℹ️ <strong>About This Data:</strong> This budget visualization is based on publicly available information from
          NYC OMB, The City NYC, and NYC Council Finance Division (Feb 2026). All amounts are in billions of US dollars.
          Final budget numbers may change after City Council approval.
        </div>

        {/* Source */}
        <p className="text-xs text-center uppercase font-bold tracking-wide mb-4" style={{ color: "#6B7280" }}>
          Data: NYC OMB FY2027 Preliminary Budget · The City NYC · NYC Council Finance Division · Feb 2026
        </p>
      </div>
    </div>
  );
}
