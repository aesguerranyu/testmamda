import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { getCategoryColor, getCategoryTextColor } from "@/lib/category-colors";

interface PromiseCardProps {
  promise?: {
    id: string;
    headline: string;
    shortDescription: string;
    category: string;
    status: string;
    slug?: string;
  };
  id?: string;
  headline?: string;
  shortDescription?: string;
  category?: string;
  status?: string;
  slug?: string;
}
export function PromiseCard(props: PromiseCardProps) {
  // Support both passing a promise object or individual props
  const promise = props.promise || {
    id: props.id || "",
    headline: props.headline || "",
    shortDescription: props.shortDescription || "",
    category: props.category || "",
    status: props.status || "",
    slug: props.slug,
  };
  
  return (
    <Link
      to={`/promises/${promise.slug || promise.id}`}
      aria-label={`View details for promise: ${promise.headline}`}
      onClick={() => window.scrollTo(0, 0)}
      className="group flex flex-col justify-between h-full bg-white transition-all no-underline border border-[#071c5f]/[0.42] hover:shadow-lg aspect-square"
    >
      <div className="flex flex-col p-5 gap-3">
        {/* Header: Category + Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-full shrink-0"
              style={{
                width: "2.25rem",
                height: "2.25rem",
                backgroundColor: getCategoryColor(promise.category),
              }}
            >
              <span
                className="font-bold text-xs"
                style={{ color: getCategoryTextColor(promise.category) }}
              >
                {promise.category.charAt(0)}
              </span>
            </div>
            <span className="text-gray-600 font-bold uppercase tracking-wide text-xs">
              {promise.category}
            </span>
          </div>
          <div
            className="px-3 py-2 shrink-0"
            style={{
              backgroundColor:
                promise.status === "In progress"
                  ? "#0039A6"
                  : promise.status === "Completed"
                    ? "#00933C"
                    : promise.status === "Stalled"
                      ? "#EE352E"
                      : "#6B7280",
            }}
          >
            <span className="text-white font-bold uppercase tracking-wide text-xs">
              {promise.status}
            </span>
          </div>
        </div>

        {/* Headline */}
        <h2
          className="text-[#0C2788] font-bold leading-tight"
          style={{ fontSize: "clamp(18px, 2vw, 22px)" }}
        >
          {promise.headline}
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {promise.shortDescription}
        </p>
      </div>

      {/* Footer: CTA */}
      <div className="p-5 pt-0">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 text-white group-hover:bg-[#1436B3] transition-all font-bold text-xs uppercase tracking-wide"
          style={{ backgroundColor: "rgba(12,39,136,0.65)" }}
        >
          Track This
          <ArrowRightIcon
            style={{ width: "1rem", height: "1rem" }}
            className="transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}