import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

const budgetItems = [
  {
    title: "FY2027 Preliminary Budget",
    description:
      "Mayor Mamdani's first budget: $127 billion all-funds, $94 billion in agency spending. 96% of new dollars went to plugging inherited gaps.",
    link: "/budget/FY2027",
    badge: "FY2027",
    badgeColor: "#0C2788",
  },
  {
    title: "Build Your Own Budget",
    description:
      "Allocate $94 billion across city agencies and see how your priorities compare to the Mayor's plan.",
    link: "/build-your-budget",
    badge: "Interactive",
    badgeColor: "#00933C",
  },
];

export default function BudgetLanding() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-5 lg:px-6 py-5">
      <SEO
        title="Budget · Mamdani Tracker"
        description="Track Mayor Mamdani's NYC budget proposals, fiscal plans, and spending priorities."
        keywords="Zohran Mamdani, NYC budget, fiscal plan, city spending, budget tracker"
      />

      <div className="mb-6">
        <div className="border-t-4 border-[#0C2788] pt-4 mb-3">
          <h1
            className="font-bold text-black tracking-tight"
            style={{ fontSize: "40px" }}
          >
            Budget
          </h1>
        </div>
        <p className="text-base max-w-3xl" style={{ color: "#374151" }}>
          Track Mayor Mamdani's NYC budget proposals, fiscal plans, and spending
          priorities across fiscal years.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgetItems.map((item) => (
          <Link
            key={item.link}
            to={item.link}
            className="border-2 border-black p-6 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-white text-xs font-bold uppercase tracking-wide px-3 py-1"
                style={{ backgroundColor: item.badgeColor }}
              >
                {item.badge}
              </span>
              <span
                className="text-sm font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: "#0C2788" }}
              >
                View →
              </span>
            </div>
            <h2
              className="text-xl font-bold mb-2"
              style={{ color: "#0C2788" }}
            >
              {item.title}
            </h2>
            <p className="text-sm" style={{ color: "#374151" }}>
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
