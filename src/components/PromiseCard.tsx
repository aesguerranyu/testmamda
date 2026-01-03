import { Link } from "react-router-dom";
import { getCategoryColor } from "@/lib/category-colors";

interface PromiseCardProps {
  promise: {
    id: string;
    headline: string;
    shortDescription: string;
    category: string;
    status: string;
  };
}

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

const getCategoryInitial = (category: string) => (category?.trim()?.[0] ?? "").toUpperCase();

export function PromiseCard({ promise }: PromiseCardProps) {
  const categoryColor = getCategoryColor(promise.category);
  const statusStyles = getStatusStyles(promise.status);

  return (
    <Link
      to={`/promise/${promise.id}`}
      onClick={() => window.scrollTo(0, 0)}
      className="group block h-full no-underline"
    >
      <div
        className="flex h-full min-h-[420px] flex-col bg-white transition-all hover:shadow-lg"
        style={{
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: "#E5E7EB",
        }}
      >
        {/* Top color bar */}
        <div className="h-2 w-full" style={{ backgroundColor: categoryColor }} />

        {/* Inner layout */}
        <div className="flex flex-1 flex-col p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Circle icon (matches Figma screenshots) */}
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                style={{ backgroundColor: categoryColor, color: "#111827" }}
              >
                {getCategoryInitial(promise.category)}
              </div>

              <span className="text-sm font-bold uppercase tracking-wide text-gray-700">{promise.category}</span>
            </div>

            <span
              className="px-4 py-3 text-xs font-bold uppercase tracking-wide"
              style={{
                backgroundColor: statusStyles.bg,
                color: statusStyles.text,
              }}
            >
              {promise.status}
            </span>
          </div>

          {/* Body */}
          <div className="pt-6">
            <h3 className="text-3xl font-extrabold leading-tight text-gray-900 transition-colors group-hover:text-blue-600">
              {promise.headline}
            </h3>

            <p className="mt-4 text-base leading-relaxed text-gray-600">{promise.shortDescription}</p>
          </div>

          {/* Footer pinned */}
          <div className="mt-auto pt-10">
            <div className="inline-flex items-center gap-3 bg-indigo-700 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white">
              Track this <span aria-hidden="true">→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
