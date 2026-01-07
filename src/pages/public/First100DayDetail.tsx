import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { getPublishedDayByDate } from "@/lib/first100days-store";
import { First100Day, First100Activity, activityTypeColors } from "@/types/first100days";
export default function First100DayDetail() {
  const {
    year,
    month,
    day
  } = useParams<{
    year: string;
    month: string;
    day: string;
  }>();
  const dateIso = `${year}-${month}-${day}`;
  const [dayEntry, setDayEntry] = useState<(First100Day & {
    activities: First100Activity[];
  }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    const loadData = async () => {
      if (!year || !month || !day) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }
      const data = await getPublishedDayByDate(dateIso);
      if (data) {
        setDayEntry(data);
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    };
    loadData();
  }, [dateIso, year, month, day]);
  if (isLoading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0C2788]"></div>
      </div>;
  }
  if (notFound || !dayEntry) {
    return <div className="min-h-screen bg-white">
        <SEO title="Day not found - First 100 Days - Mamdani Tracker" description="The requested day could not be found." />
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Day not found</h1>
          <Link to="/zohran-mamdani-first-100-days" className="inline-flex items-center gap-2 text-[#1E3A8A] font-medium hover:underline">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to First 100 Days
          </Link>
        </div>
      </div>;
  }
  const canonicalUrl = `https://mamdanitracker.nyc/zohran-mamdani-first-100-days/${year}/${month}/${day}`;
  const pageTitle = `Day ${dayEntry.day} - ${dayEntry.date_display} | First 100 Days | Mamdani Tracker`;
  const pageDescription = `Track Mayor Zohran Mamdani's actions on Day ${dayEntry.day} (${dayEntry.date_display}). View executive orders, policy announcements, and appointments from the first 100 days.`;

  return <div className="min-h-screen bg-white">
      <SEO 
        title={pageTitle} 
        description={pageDescription}
        canonical={canonicalUrl}
        ogType="article"
        keywords={`Zohran Mamdani Day ${dayEntry.day}, first 100 days, NYC mayor actions, ${dayEntry.date_display}`}
      />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 py-5">
        {/* Hero Section - matches First 100 Days listing page */}
        <div className="mb-0">
          <div className="border-t-4 border-[#0C2788] pt-4 mb-3">
            <h1 className="font-bold text-black tracking-tight" style={{
            fontSize: "40px"
          }}>
              First 100 Days
            </h1>
          </div>
          <p className="text-base max-w-3xl" style={{
          color: "#374151"
        }}>Track Mayor Zohran Mamdani's daily key actions and activities.</p>
        </div>

        {/* Day Header */}
        <div className="border-t-4 border-[#0C2788] pt-4 mb-5 mt-8">
          <h2 className="font-bold text-black mb-0" style={{
          fontSize: "clamp(20px, 4.5vw, 32px)"
        }}>
            Day {dayEntry.day} — {dayEntry.date_display}
          </h2>
        </div>

        {/* Activities - matches listing page exactly */}
        <div className="flex flex-col gap-4 ml-8 sm:ml-12">
          {dayEntry.activities?.map(activity => <article key={activity.id} className="pl-4 sm:pl-5 border-l-4 border-gray-200">
              {activity.type === "Pull Quote" ? <>
                  {/* Pull Quote */}
                  <div className="mb-4" style={{
              maxWidth: "700px"
            }}>
                    <div style={{
                backgroundColor: "#FAFBFC",
                padding: "clamp(48px, 8vw, 96px) clamp(40px, 7vw, 80px)"
              }}>
                      <p className="mb-4" style={{
                  fontSize: "clamp(28px, 6vw, 40px)",
                  lineHeight: "1.5",
                  color: "#0C2788",
                  fontWeight: "900"
                }}>
                        "{activity.quote}"
                      </p>
                      {activity.quote_attribution && <p className="mb-0" style={{
                  fontSize: "clamp(12px, 2.5vw, 14px)",
                  color: "#6B7280"
                }}>
                          {activity.quote_attribution}
                        </p>}
                    </div>
                    {(activity.full_text_url || (activity.sources as any)?.[0]?.url) && <a href={activity.full_text_url || (activity.sources as any)?.[0]?.url} target="_blank" rel="noopener noreferrer" className="no-underline font-bold inline-block mt-3" style={{
                fontSize: "clamp(14px, 3vw, 16px)",
                color: "#0C2788"
              }}>
                        → {activity.full_text_label || "Read full speech"}
                      </a>}
                  </div>

                  {activity.description && <p className="mb-4" style={{
              lineHeight: "1.7",
              maxWidth: "600px",
              color: "#374151",
              fontSize: "clamp(16px, 3.5vw, 18px)"
            }}>
                      {activity.description}
                    </p>}

                  {activity.image_url && <div className="mb-4" style={{
              maxWidth: "500px"
            }}>
                      <img src={activity.image_url} alt={activity.image_caption || activity.title || ""} className="w-full h-auto block object-cover" style={{
                aspectRatio: "16 / 9"
              }} />
                      {activity.image_caption && <p className="mt-2 text-sm text-gray-500">{activity.image_caption}</p>}
                    </div>}

                  {/* Sources */}
                  {Array.isArray(activity.sources) && activity.sources.length > 0 && <div className="mt-4">
                      <div className="mb-2 uppercase font-bold" style={{
                fontSize: "11px",
                letterSpacing: "0.05em",
                color: "#6B7280"
              }}>
                        {activity.sources.length === 1 ? "Source" : "Sources"}
                      </div>
                      {(activity.sources as any[]).map((source: any, idx: number) => <div key={idx} className="mb-2">
                          <a href={source.url} className="no-underline font-medium" target="_blank" rel="noopener noreferrer" style={{
                  fontSize: "clamp(14px, 3vw, 16px)",
                  color: "#1E3A8A"
                }}>
                            → {source.title}
                          </a>
                        </div>)}
                    </div>}
                </> : <>
                  {/* Regular Activity */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 flex-wrap">
                    <h3 className="text-black mb-0" style={{
                fontSize: "clamp(20px, 4vw, 28px)"
              }}>
                      {activity.title}
                    </h3>
                    {activity.type && <span className="inline-block px-2 sm:px-3 py-1 text-white font-bold uppercase tracking-wide" style={{
                backgroundColor: activityTypeColors[activity.type] || "#0C2788",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
                fontSize: "clamp(10px, 2.5vw, 12px)"
              }}>
                        {activity.type}
                      </span>}
                  </div>

                  {activity.description && <p className="mb-4" style={{
              lineHeight: "1.7",
              maxWidth: "600px",
              color: "#374151",
              fontSize: "clamp(16px, 3.5vw, 18px)"
            }}>
                      {activity.description}
                    </p>}

                  {activity.image_url && <div className="mb-4" style={{
              maxWidth: "500px"
            }}>
                      <img src={activity.image_url} alt={activity.image_caption || activity.title || ""} className="w-full h-auto block object-cover" style={{
                aspectRatio: "16 / 9"
              }} />
                      {activity.image_caption && <p className="mt-2 text-sm text-gray-500">{activity.image_caption}</p>}
                    </div>}

                  {/* Sources */}
                  {Array.isArray(activity.sources) && activity.sources.length > 0 && <div className="mt-4">
                      <div className="mb-2 uppercase font-bold" style={{
                fontSize: "11px",
                letterSpacing: "0.05em",
                color: "#6B7280"
              }}>
                        {activity.sources.length === 1 ? "Source" : "Sources"}
                      </div>
                      {(activity.sources as any[]).map((source: any, idx: number) => <div key={idx} className="mb-2">
                          <a href={source.url} className="no-underline font-medium" target="_blank" rel="noopener noreferrer" style={{
                  fontSize: "clamp(14px, 3vw, 16px)",
                  color: "#1E3A8A"
                }}>
                            → {source.title}
                          </a>
                        </div>)}
                    </div>}
                </>}
            </article>)}
        </div>

        {/* Back link at bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link to="/zohran-mamdani-first-100-days" className="inline-flex items-center gap-2 text-[#1E3A8A] font-medium hover:underline">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to First 100 Days
          </Link>
        </div>
      </div>
    </div>;
}