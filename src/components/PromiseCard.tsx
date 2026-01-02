import { Link } from "react-router-dom";

interface PromiseCardProps {
  promise: {
    id: string;
    headline: string;
    shortDescription: string;
    category: string;
    status: string;
  };
}

const getCategoryColor = (category: string): string => {
  const colorMap: { [key: string]: string } = {
    Housing: "#EE352E",
    Transportation: "#0039A6",
    Education: "#00933C",
    Healthcare: "#FF6319",
    Economy: "#FCCC0A",
    Environment: "#6CBE45",
    Safety: "#B933AD",
    "Economic Justice": "#FCCC0A",
    "Public Safety": "#B933AD",
    "Government Reform": "#A7A9AC",
  };
  return colorMap[category] || "#A7A9AC";
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Completed":
      return { bg: "#22C55E", text: "#FFFFFF" };
    case "In Progress":
      return { bg: "#3B82F6", text: "#FFFFFF" };
    case "Stalled":
      return { bg: "#F97316", text: "#FFFFFF" };
    case "Broken":
      return { bg: "#EF4444", text: "#FFFFFF" };
    default:
      return { bg: "#9CA3AF", text: "#FFFFFF" };
  }
};

export function PromiseCard({ promise }: PromiseCardProps) {
  const categoryColor = getCategoryColor(promise.category);
  const statusStyles = getStatusStyles(promise.status);

  return (
    <Link
      to={`/promise/${promise.id}`}
      onClick={() => window.scrollTo(0, 0)}
      className="group block h-full bg-white no-underline transition-all hover:shadow-lg"
      style={{
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "#E5E7EB",
      }}
    >
      {/* Category bar */}
      <div
        className="h-2 w-full"
        style={{ backgroundColor: categoryColor }}
      />

      <div className="p-5">
        {/* Category & Status */}
        <div className="mb-3 flex items-center justify-between">
          <span
            className="text-xs font-bold uppercase tracking-wide"
            style={{ color: categoryColor }}
          >
            {promise.category}
          </span>
          <span
            className="px-2 py-1 text-xs font-bold uppercase tracking-wide"
            style={{
              backgroundColor: statusStyles.bg,
              color: statusStyles.text,
            }}
          >
            {promise.status}
          </span>
        </div>

        {/* Headline */}
        <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">
          {promise.headline}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed text-gray-600">
          {promise.shortDescription}
        </p>
      </div>
    </Link>
  );
}
