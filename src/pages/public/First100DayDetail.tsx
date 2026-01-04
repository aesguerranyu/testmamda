import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { SEO } from "@/components/SEO";
import { getPublishedDayByDate } from "@/lib/first100days-store";
import { First100Activity, First100Day, activityTypeColors } from "@/types/first100days";

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
        } else {
          setDayEntry(data);
        }
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
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 py-16">
          <h1 className="font-bold text-black" style={{ fontSize: "40px" }}>
            First 100 Days
          </h1>
          <div className="mt-6 border-t border-gray-200" />
          <p className="mt-6" style={{ color: "#4B5563" }}>
            Day not found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={`Day ${dayEntry.day} - ${dayEntry.date_display} | First 100 Days - Mamdani Tracker`}
        description={`Track Mayor Zohran Mamdani's actions on Day ${dayEntry.day} (${dayEntry.date_display}).`}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 py-10">
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

        {/* timeline */}
        <div className="mt-16" style={{ marginLeft: "88px" }}>
          <div className="border-l-2" style={{ borderColor: "#D1D5DB", paddingLeft: "48px" }}>
            <div className="flex flex-col" style={{ gap: "64px", paddingTop: "8px" }}>
              {dayEntry.activities.map((activity) => (
                <article key={activity.id} style={{ maxWidth: "820px" }}>
                  {/* Title row */}
                  <div className="flex items-baseline gap-4 flex-wrap">
                    <h3 className="font-bold text-black" style={{ fontSize: "36px", letterSpacing: "-0.01em" }}>
                      {activity.title || activity.type}
                    </h3>
                    {activity.type && (
                      <span
                        className="inline-flex items-center px-4 py-2 font-bold uppercase"
                        style={{
                          backgroundColor: activityTypeColors[activity.type] || "#0C2788",
                          color: "#FFFFFF",
                          fontSize: "14px",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {activity.type}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {activity.description && (
                    <p className="mt-5" style={{ fontSize: "20px", lineHeight: "1.7", color: "#1F2937" }}>
                      {activity.description}
                    </p>
                  )}

                  {/* Image */}
                  {activity.image_url && (
                    <div className="mt-10" style={{ maxWidth: "720px" }}>
                      <img
                        src={activity.image_url}
                        alt={activity.image_caption || activity.title || "First 100 Days activity image"}
                        className="w-full h-auto block object-cover"
                      />
                      {activity.image_caption && (
                        <p className="mt-3" style={{ color: "#6B7280", fontSize: "14px" }}>
                          {activity.image_caption}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Sources */}
                  {Array.isArray(activity.sources) && activity.sources.length > 0 && (
                    <div className="mt-8">
                      <div
                        className="mb-3 uppercase font-bold"
                        style={{ fontSize: "11px", letterSpacing: "0.06em", color: "#6B7280" }}
                      >
                        {activity.sources.length === 1 ? "Source" : "Sources"}
                      </div>
                      <div className="flex flex-col gap-2">
                        {(activity.sources as any[]).map((source: any, idx: number) => (
                          <a
                            key={idx}
                            href={source.url}
                            className="no-underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "16px", color: "#0C2788", wordBreak: "break-word" }}
                          >
                            → {source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
