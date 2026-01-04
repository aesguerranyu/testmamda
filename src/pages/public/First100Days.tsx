import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { getPublishedDays } from "@/lib/first100days-store";
import { First100Day, First100Activity, activityTypeColors } from "@/types/first100days";
import { SEO } from "@/components/SEO";

interface DayWithActivities extends First100Day {
  activities: First100Activity[];
}

export default function First100Days() {
  const [days, setDays] = useState<DayWithActivities[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  useEffect(() => {
    async function loadDays() {
      try {
        const data = await getPublishedDays();
        setDays(data as DayWithActivities[]);
      } catch (error) {
        console.error("Failed to load days:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadDays();
  }, []);

  const sortedData = [...days].sort((a, b) => {
    if (sortOrder === "desc") {
      return b.day - a.day;
    } else {
      return a.day - b.day;
    }
  });

  return (
    <>
      <SEO
        title="First 100 Days - Mamdani Tracker"
        description="Track the first 100 days of Mayor Zohran Mamdani's administration."
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 py-5">
        {/* Hero Section */}
        <div className="mb-0">
          <div className="border-t-4 border-[#0C2788] pt-4 mb-3">
            <h1 className="font-bold text-black tracking-tight" style={{ fontSize: "40px" }}>
              First 100 Days
            </h1>
          </div>
          <p className="text-base max-w-3xl" style={{ color: "#374151" }}>
            A chronological timeline of Mayor Zohran Mamdani's actions, executive orders, appointments, and policy
            initiatives from January 1 to April 10, 2026.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="my-4 flex justify-end flex-wrap gap-3">
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border-2 border-black text-black font-bold uppercase tracking-wide transition-all hover:bg-gray-100"
            style={{ letterSpacing: "0.05em", fontSize: "clamp(10px, 2.5vw, 12px)" }}
          >
            {sortOrder === "desc" ? (
              <>
                <ArrowDownIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Most Recent First</span>
                <span className="sm:hidden">Newest</span>
              </>
            ) : (
              <>
                <ArrowUpIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Oldest First</span>
                <span className="sm:hidden">Oldest</span>
              </>
            )}
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && days.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No days published yet.</p>
          </div>
        )}

        {/* Timeline */}
        {!isLoading && days.length > 0 && (
          <div className="flex flex-col" style={{ gap: "4rem" }}>
            {sortedData.map((entry) => (
              <div key={entry.id}>
                {/* Day Header */}
                <Link
                  to={`/zohran-mamdani-first-100-days/${entry.day}`}
                  className="block no-underline group"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <div className="border-t-4 border-[#0C2788] pt-4 mb-5 transition-all group-hover:opacity-80">
                    <h2 className="font-bold text-black mb-0" style={{ fontSize: "clamp(20px, 4.5vw, 32px)" }}>
                      Day {entry.day} — {entry.date_display}
                    </h2>
                  </div>
                </Link>

                {/* Activities */}
                <div className="flex flex-col gap-4">
                  {entry.activities?.map((activity) => (
                    <article key={activity.id} className="pl-4 sm:pl-5 border-l-4 border-gray-200">
                      {activity.type === "Pull Quote" ? (
                        <>
                          {/* Pull Quote */}
                          <div className="mb-4" style={{ maxWidth: "700px" }}>
                            <div
                              style={{
                                backgroundColor: "#FAFBFC",
                                padding: "clamp(48px, 8vw, 96px) clamp(40px, 7vw, 80px)",
                              }}
                            >
                              <p
                                className="mb-4"
                                style={{
                                  fontSize: "clamp(28px, 6vw, 40px)",
                                  lineHeight: "1.5",
                                  color: "#0C2788",
                                  fontWeight: "900",
                                }}
                              >
                                "{activity.quote}"
                              </p>
                              {activity.quote_attribution && (
                                <p className="mb-0" style={{ fontSize: "clamp(12px, 2.5vw, 14px)", color: "#6B7280" }}>
                                  {activity.quote_attribution}
                                </p>
                              )}
                            </div>
                            {(activity.full_text_url || (activity.sources as any)?.[0]?.url) && (
                              <a
                                href={activity.full_text_url || (activity.sources as any)?.[0]?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="no-underline font-bold inline-block mt-3"
                                style={{ fontSize: "clamp(14px, 3vw, 16px)", color: "#0C2788" }}
                              >
                                → {activity.full_text_label || "Read full speech"}
                              </a>
                            )}
                          </div>

                          {activity.description && (
                            <p
                              className="mb-4"
                              style={{
                                lineHeight: "1.7",
                                maxWidth: "600px",
                                color: "#374151",
                                fontSize: "clamp(16px, 3.5vw, 18px)",
                              }}
                            >
                              {activity.description}
                            </p>
                          )}

                          {activity.image_url && (
                            <div className="mb-4" style={{ maxWidth: "500px" }}>
                              <img
                                src={activity.image_url}
                                alt={activity.image_caption || activity.title || ""}
                                className="w-full h-auto block object-cover"
                                style={{ aspectRatio: "16 / 9" }}
                              />
                              {activity.image_caption && (
                                <p className="mt-2 text-sm text-gray-500">{activity.image_caption}</p>
                              )}
                            </div>
                          )}

                          {/* Sources */}
                          {Array.isArray(activity.sources) && activity.sources.length > 0 && (
                            <div className="mt-4">
                              <div
                                className="mb-2 uppercase font-bold"
                                style={{ fontSize: "11px", letterSpacing: "0.05em", color: "#6B7280" }}
                              >
                                {activity.sources.length === 1 ? "Source" : "Sources"}
                              </div>
                              {(activity.sources as any[]).map((source: any, idx: number) => (
                                <div key={idx} className="mb-2">
                                  <a
                                    href={source.url}
                                    className="no-underline font-medium"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontSize: "clamp(14px, 3vw, 16px)", color: "#1E3A8A" }}
                                  >
                                    → {source.title}
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Regular Activity */}
                          <div className="flex items-center gap-2 sm:gap-3 mb-3 flex-wrap">
                            <h3 className="text-black mb-0" style={{ fontSize: "clamp(20px, 4vw, 28px)" }}>
                              {activity.title}
                            </h3>
                            {activity.type && (
                              <span
                                className="inline-block px-2 sm:px-3 py-1 text-white font-bold uppercase tracking-wide"
                                style={{
                                  backgroundColor: activityTypeColors[activity.type] || "#0C2788",
                                  letterSpacing: "0.05em",
                                  whiteSpace: "nowrap",
                                  fontSize: "clamp(10px, 2.5vw, 12px)",
                                }}
                              >
                                {activity.type}
                              </span>
                            )}
                          </div>

                          {activity.description && (
                            <p
                              className="mb-4"
                              style={{
                                lineHeight: "1.7",
                                maxWidth: "600px",
                                color: "#374151",
                                fontSize: "clamp(16px, 3.5vw, 18px)",
                              }}
                            >
                              {activity.description}
                            </p>
                          )}

                          {activity.image_url && (
                            <div className="mb-4" style={{ maxWidth: "500px" }}>
                              <img
                                src={activity.image_url}
                                alt={activity.image_caption || activity.title || ""}
                                className="w-full h-auto block object-cover"
                                style={{ aspectRatio: "16 / 9" }}
                              />
                              {activity.image_caption && (
                                <p className="mt-2 text-sm text-gray-500">{activity.image_caption}</p>
                              )}
                            </div>
                          )}

                          {/* Sources */}
                          {Array.isArray(activity.sources) && activity.sources.length > 0 && (
                            <div className="mt-4">
                              <div
                                className="mb-2 uppercase font-bold"
                                style={{ fontSize: "11px", letterSpacing: "0.05em", color: "#6B7280" }}
                              >
                                {activity.sources.length === 1 ? "Source" : "Sources"}
                              </div>
                              {(activity.sources as any[]).map((source: any, idx: number) => (
                                <div key={idx} className="mb-2">
                                  <a
                                    href={source.url}
                                    className="no-underline font-medium"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontSize: "clamp(14px, 3vw, 16px)", color: "#1E3A8A" }}
                                  >
                                    → {source.title}
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
