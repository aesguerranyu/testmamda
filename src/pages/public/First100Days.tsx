import { first100Days } from "../data/mockData";
import { SEO } from "../components/SEO";
import { CalendarIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { SocialEmbed } from "../components/SocialEmbed";

// Subway line colors for activity types
const activityTypeColors: Record<string, string> = {
  "Executive Order": "#0039A6", // Blue (A,C,E) - happens often
  Legislation: "#FF6319", // Orange (B,D,F,M)
  Ceremony: "#B933AD", // Purple (7)
  Announcement: "#EE352E", // Red (1,2,3)
  Appointment: "#00933C", // Green (4,5,6)
  Testimony: "#FCCC0A", // Yellow (N,Q,R,W)
  Budget: "#996633", // Brown (J,Z)
  Event: "#0099D8", // Light Blue (L)
  Meeting: "#808183", // Gray (S)
  "Pull Quote": "#0C2788", // Brand Blue
};

export function First100Days() {
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc"); // desc = newest first (Day 100 -> 1)

  // Sort the data based on current sort order
  const sortedData = [...first100Days].sort((a, b) => {
    if (sortOrder === "desc") {
      return b.day - a.day; // Day 100 first
    } else {
      return a.day - b.day; // Day 1 first
    }
  });

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="First 100 Days - Mamdani Tracker | Timeline & Milestones"
        description="Track the first 100 days of Mayor Zohran Mamdani's administration. A comprehensive timeline of actions, executive orders, appointments, and policy initiatives from January 1 to April 10, 2026."
        keywords="Mamdani first 100 days, NYC mayor timeline, mayoral actions, executive orders, policy milestones, administration tracker, NYC government timeline"
      />

      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 py-5">
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
      </div>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 pb-5">
        {/* Sort Controls */}
        <div className="mb-4 flex justify-end flex-wrap gap-3">
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border-2 border-black text-black font-bold uppercase tracking-wide transition-all hover:bg-gray-100"
            style={{ letterSpacing: "0.05em", fontSize: "clamp(10px, 2.5vw, 12px)" }}
            aria-label={sortOrder === "desc" ? "Sort to show oldest first" : "Sort to show most recent first"}
          >
            {sortOrder === "desc" ? (
              <>
                <ArrowDownIcon style={{ width: "1rem", height: "1rem" }} aria-hidden="true" />
                <span className="hidden sm:inline">Most Recent First</span>
                <span className="sm:hidden">Newest</span>
              </>
            ) : (
              <>
                <ArrowUpIcon style={{ width: "1rem", height: "1rem" }} aria-hidden="true" />
                <span className="hidden sm:inline">Oldest First</span>
                <span className="sm:hidden">Oldest</span>
              </>
            )}
          </button>
        </div>

        {/* Timeline */}
        <div className="flex flex-col" style={{ gap: "4rem" }}>
          {sortedData.map((entry) => (
            <div key={entry.day}>
              {/* Day Header - Blue Line Style */}
              <Link
                to={`/first100days/${entry.day}`}
                className="block no-underline group"
                onClick={() => window.scrollTo(0, 0)}
              >
                <div className="border-t-4 border-[#0C2788] pt-4 mb-5 transition-all group-hover:opacity-80">
                  <h2 className="font-bold text-black mb-0" style={{ fontSize: "clamp(20px, 4.5vw, 32px)" }}>
                    Day {entry.day} — {entry.date}
                  </h2>
                </div>
              </Link>

              {/* Activities */}
              <div className="flex flex-col gap-4">
                {entry.activities.map((activity) => (
                  <article key={activity.id} className="pl-4 sm:pl-5 border-l-4 border-gray-200">
                    {/* Pull Quote Type - Special Formatting */}
                    {activity.type === "Pull Quote" ? (
                      <>
                        {/* Quote */}
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
                            {activity.quoteAttribution && (
                              <p className="mb-0" style={{ fontSize: "clamp(12px, 2.5vw, 14px)", color: "#6B7280" }}>
                                {activity.quoteAttribution}
                              </p>
                            )}
                          </div>
                          {(activity.fullTextUrl || activity.sources?.[0]?.url) && (
                            <a
                              href={activity.fullTextUrl || activity.sources?.[0]?.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="no-underline font-bold inline-block mt-3"
                              style={{ fontSize: "clamp(14px, 3vw, 16px)", color: "#0C2788" }}
                            >
                              → {activity.fullTextLabel || "Read full speech"}
                            </a>
                          )}
                        </div>

                        {/* Description */}
                        {activity.description && (
                          <p
                            className="text-black mb-4"
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

                        {/* Activity Image */}
                        {activity.imageUrl && (
                          <div className="mb-4">
                            <div className="overflow-hidden" style={{ maxWidth: "500px" }}>
                              <ImageWithFallback
                                src={activity.imageUrl}
                                alt={activity.imageCaption || activity.title}
                                style={{
                                  width: "100%",
                                  height: "auto",
                                  display: "block",
                                  aspectRatio: "16 / 9",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                            {activity.imageCaption && (
                              <div className="mt-2 px-2" style={{ maxWidth: "500px" }}>
                                <p
                                  className="m-0 font-medium"
                                  style={{ fontSize: "clamp(13px, 2.5vw, 15px)", color: "#6B7280" }}
                                >
                                  {activity.imageCaption}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Social Media Embed */}
                        {activity.embedUrl && (
                          <div className="mb-4">
                            <SocialEmbed url={activity.embedUrl} />
                          </div>
                        )}

                        {/* Sources */}
                        {activity.sources && activity.sources.length > 0 && (
                          <div className="mt-4" style={{ maxWidth: "900px" }}>
                            <div
                              className="mb-2 uppercase font-bold"
                              style={{ fontSize: "11px", letterSpacing: "0.05em", color: "#6B7280" }}
                            >
                              {activity.sources.length === 1 ? "Source" : "Sources"}
                            </div>
                            {activity.sources.map((source, idx) => (
                              <div key={idx} className="mb-2">
                                <a
                                  href={source.url}
                                  className="no-underline font-medium transition-colors inline-block"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    fontSize: "clamp(14px, 3vw, 16px)",
                                    color: "#1E3A8A",
                                    wordBreak: "break-word",
                                  }}
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
                        {/* Regular Activity Type - Standard Formatting */}
                        {/* Activity Title with Pill */}
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

                        {/* Activity Description */}
                        <p
                          className="text-black mb-4"
                          style={{
                            lineHeight: "1.7",
                            maxWidth: "600px",
                            color: "#374151",
                            fontSize: "clamp(16px, 3.5vw, 18px)",
                          }}
                        >
                          {activity.description}
                        </p>

                        {/* Activity Image */}
                        {activity.imageUrl && (
                          <div className="mb-4">
                            <div className="overflow-hidden" style={{ maxWidth: "500px" }}>
                              <ImageWithFallback
                                src={activity.imageUrl}
                                alt={activity.imageCaption || activity.title}
                                style={{
                                  width: "100%",
                                  height: "auto",
                                  display: "block",
                                  aspectRatio: "16 / 9",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                            {activity.imageCaption && (
                              <div className="mt-2 px-2" style={{ maxWidth: "500px" }}>
                                <p
                                  className="m-0 font-medium"
                                  style={{ fontSize: "clamp(13px, 2.5vw, 15px)", color: "#6B7280" }}
                                >
                                  {activity.imageCaption}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Social Media Embed */}
                        {activity.embedUrl && (
                          <div className="mb-4">
                            <SocialEmbed url={activity.embedUrl} />
                          </div>
                        )}

                        {/* Sources */}
                        {activity.sources && activity.sources.length > 0 && (
                          <div className="mt-4" style={{ maxWidth: "900px" }}>
                            <div
                              className="mb-2 uppercase font-bold"
                              style={{ fontSize: "11px", letterSpacing: "0.05em", color: "#6B7280" }}
                            >
                              {activity.sources.length === 1 ? "Source" : "Sources"}
                            </div>
                            {activity.sources.map((source, idx) => (
                              <div key={idx} className="mb-2">
                                <a
                                  href={source.url}
                                  className="no-underline font-medium transition-colors inline-block"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    fontSize: "clamp(14px, 3vw, 16px)",
                                    color: "#1E3A8A",
                                    wordBreak: "break-word",
                                  }}
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
      </div>
    </div>
  );
}
