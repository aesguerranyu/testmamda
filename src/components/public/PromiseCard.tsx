import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface PromiseCardProps {
  id: string;
  category: string;
  headline: string;
  shortDescription: string;
  status: string;
}

const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
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

const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    "Not started": "#A7A9AC",
    "In progress": "#0039A6",
    Completed: "#00933C",
    Stalled: "#EE352E",
  };
  return colorMap[status] || "#6B7280";
};

export function PromiseCard({ id, category, headline, shortDescription, status }: PromiseCardProps) {
  return (
    <Link
      to={`/promises/${id}`}
      className="block bg-white border-2 border-gray-200 p-5 hover:border-subway-blue transition-colors group no-underline h-full flex flex-col"
    >
      {/* Top row: Circle + Category left, Status badge right */}
      <div className="flex items-center justify-between gap-3 mb-4">
        {/* Category with circle */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: getCategoryColor(category) }}
          >
            <span className="text-white font-bold text-lg">{category.charAt(0)}</span>
          </div>
          <span className="text-gray-500 font-bold uppercase tracking-wide text-xs">
            {category}
          </span>
        </div>

        {/* Status badge */}
        <div
          className="px-3 py-1.5 flex-shrink-0"
          style={{ backgroundColor: getStatusColor(status) }}
        >
          <span className="text-white font-bold uppercase tracking-wide text-xs">
            {status}
          </span>
        </div>
      </div>

      {/* Headline */}
      <h3 className="text-lg font-bold text-subway-blue leading-tight mb-3 group-hover:text-subway-blue/80 transition-colors">
        {headline}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
        {shortDescription}
      </p>

      {/* Track This button */}
      <div className="flex items-center gap-2 text-subway-blue font-bold uppercase tracking-wide text-sm group-hover:gap-3 transition-all">
        Track This
        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
}
