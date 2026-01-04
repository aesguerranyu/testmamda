import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { SEO } from "@/components/SEO";
import { getPublishedDayByDate } from "@/lib/first100days-store";
import type { First100Activity, First100Day } from "@/types/first100days";

export default function First100DayDetail() {
  const { year, month, day } = useParams<{ year: string; month: string; day: string }>();

  const dateIso = useMemo(() => {
    if (!year || !month || !day) return null;
    return `${year}-${month}-${day}`;
  }, [year, month, day]);

  const [dayEntry, setDayEntry] = useState<(First100Day & { activities: First100Activity[] }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!dateIso) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        const data = await getPublishedDayByDate(dateIso);
        if (!data) {
          setNotFound(true);
          setDayEntry(null);
          return;
        }
        setDayEntry(data);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [dateIso]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0C2788]" />
      </div>
    );
  }

  if (notFound || !dayEntry) {
    return (
      <div className="min-h-screen bg-white">
        <SEO title="Day not found - First 100 Days - Mamdani Tracker" description="The requested day could not be found." />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 py-10">
          <div className="mx-auto" style={{ maxWidth: "920px" }}>
            <div className="w-full" style={{ height: "8px", backgroundColor: "#0C2788" }} />
            <h1 className="mt-10 font-bold text-black" style={{ fontSize: "56px", letterSpacing: "-0.02em" }}>
              First 100 Days
            </h1>
            <div className="mt-12 border-t" style={{ borderColor: "#E5E7EB" }} />
            <p className="mt-10" style={{ color: "#4B5563", fontSize: "18px" }}>
              Day not found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={`Day ${dayEntry.day} - ${dayEntry.date_display} | First 100 Days - Mamdani Tracker`}
        description={`First 100 Days timeline for ${dayEntry.date_display}.`}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 py-10">
        <div className="mx-auto" style={{ maxWidth: "920px" }}>
          {/* top blue rule */}
          <div className="w-full" style={{ height: "8px", backgroundColor: "#0C2788" }} />

          {/* H1 */}
          <h1 className="mt-10 font-bold text-black" style={{ fontSize: "56px", letterSpacing: "-0.02em" }}>
            First 100 Days
          </h1>

          {/* divider */}
          <div className="mt-12 border-t" style={{ borderColor: "#E5E7EB" }} />

          {/* Day heading */}
          <h2 className="mt-12 font-bold text-black" style={{ fontSize: "48px", letterSpacing: "-0.02em" }}>
            Day {dayEntry.day} — {dayEntry.date_display}
          </h2>

          {/* meta */}
          <div className="mt-6 flex items-center gap-3" style={{ color: "#4B5563" }}>
            <CalendarIcon className="w-6 h-6" aria-hidden="true" />
            <span style={{ fontSize: "18px" }}>
              {dayEntry.activities.length} {dayEntry.activities.length === 1 ? "Activity" : "Activities"} documented
            </span>
          </div>

          {/* Activities (match main timeline page) */}
          <div className="mt-16 flex flex-col gap-4 ml-8 sm:ml-12">
            {dayEntry.activities?.map((activity) => (
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
                          loading="lazy"
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
                          loading="lazy"
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
      </div>
    </div>
  );
}
