import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../../components/SEO";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { getPublishedDays } from "@/lib/first100days-store";
import { First100Day, First100Activity, activityTypeColors } from "@/types/first100days";

export default function First100Days() {
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [days, setDays] = useState<(First100Day & { activities: First100Activity[] })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await getPublishedDays();
      setDays(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const sortedData = [...days].sort((a, b) => {
    if (sortOrder === "desc") {
      return b.day - a.day;
    } else {
      return a.day - b.day;
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
      <div className="container mx-auto max-w-7xl px-4 sm:px-5 lg:px-6 py-5">
        <div className="border-t-4 border-[#0C2788] pt-4 mb-3">
          <h1 className="font-bold text-black tracking-tight" style={{ fontSize: '40px' }}>
            First 100 Days
          </h1>
        </div>
        <p className="text-base max-w-3xl" style={{ color: '#374151' }}>
          A chronological timeline of Mayor Zohran Mamdani's actions, executive orders, appointments, and policy initiatives from January 1 to April 10, 2026.
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5 pb-5">
        {/* Sort Controls */}
        <div className="mb-4 flex justify-end flex-wrap gap-3">
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border-2 border-black text-black font-bold uppercase tracking-wide transition-all cursor-pointer hover:bg-gray-100"
            style={{ letterSpacing: '0.05em', fontSize: 'clamp(10px, 2.5vw, 12px)' }}
            aria-label={sortOrder === "desc" ? "Sort to show oldest first" : "Sort to show most recent first"}
          >
            {sortOrder === "desc" ? (
              <>
                <ArrowDownIcon style={{ width: '1rem', height: '1rem' }} aria-hidden="true" />
                <span className="hidden sm:inline">Most Recent First</span>
                <span className="sm:hidden">Newest</span>
              </>
            ) : (
              <>
                <ArrowUpIcon style={{ width: '1rem', height: '1rem' }} aria-hidden="true" />
                <span className="hidden sm:inline">Oldest First</span>
                <span className="sm:hidden">Oldest</span>
              </>
            )}
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0C2788]"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && sortedData.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No days published yet.</p>
          </div>
        )}

        {/* Timeline */}
        {!isLoading && sortedData.length > 0 && (
          <div className="flex flex-col" style={{ gap: '4rem' }}>
            {sortedData.map((entry) => (
              <div key={entry.id}>
                {/* Day Header - Blue Line Style */}
                <Link 
                  to={`/first100days/${entry.day}`}
                  onClick={() => window.scrollTo(0, 0)}
                  className="block"
                >
                  <div className="border-t-4 border-[#0C2788] pt-4 mb-4 hover:opacity-80 transition-opacity">
                    <h2 className="font-bold text-black mb-0" style={{ fontSize: 'clamp(20px, 4vw, 28px)' }}>
                      Day {entry.day} — {entry.date_display}
                    </h2>
                  </div>
                </Link>

                {/* Activities */}
                <div className="flex flex-col gap-4 pl-3 md:pl-4">
                  {entry.activities.map((activity) => (
                    <article key={activity.id} className="border-l-2 pl-3 sm:pl-4" style={{ borderColor: '#E5E7EB' }}>
                      {/* Pull Quote Type - Special Formatting */}
                      {activity.type === "Pull Quote" ? (
                        <>
                          {/* Quote */}
                          <div className="mb-4">
                            <div className="border-l-4 pl-4 sm:pl-6 py-2" style={{ borderColor: '#0C2788' }}>
                              <blockquote 
                                className="font-semibold text-black italic"
                                style={{ fontSize: 'clamp(18px, 3.5vw, 24px)', lineHeight: '1.4' }}
                              >
                                "{activity.quote}"
                              </blockquote>
                              {activity.quote_attribution && (
                                <p 
                                  className="mt-2 font-medium"
                                  style={{ color: '#6B7280', fontSize: 'clamp(14px, 3vw, 16px)' }}
                                >
                                  {activity.quote_attribution}
                                </p>
                              )}
                            </div>
                            {(activity.full_text_url || activity.sources?.[0]?.url) && (
                              <a
                                href={activity.full_text_url || activity.sources[0]?.url}
                                className="inline-block mt-3 font-medium hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#1E3A8A', fontSize: 'clamp(13px, 2.8vw, 14px)' }}
                              >
                                → {activity.full_text_label || "Read full speech"}
                              </a>
                            )}
                          </div>

                          {/* Description */}
                          {activity.description && (
                            <p 
                              className="text-black mb-3"
                              style={{ lineHeight: '1.6', maxWidth: '48rem', color: '#374151', fontSize: 'clamp(14px, 3vw, 16px)' }}
                            >
                              {activity.description}
                            </p>
                          )}

                          {/* Sources */}
                          {activity.sources && activity.sources.length > 0 && (
                            <div className="mt-3">
                              <p 
                                className="font-bold uppercase mb-2"
                                style={{ color: '#6B7280', letterSpacing: '0.05em', fontSize: 'clamp(10px, 2.5vw, 11px)' }}
                              >
                                {activity.sources.length === 1 ? 'Source' : 'Sources'}
                              </p>
                              {activity.sources.map((source, idx) => (
                                <div key={idx} className="mb-2">
                                  <a
                                    href={source.url}
                                    className="no-underline font-medium transition-colors inline-block hover:text-blue-800"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontSize: 'clamp(13px, 2.8vw, 14px)', color: '#1E3A8A', wordBreak: 'break-word' }}
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
                          <div className="flex items-baseline gap-2 sm:gap-3 mb-3 flex-wrap">
                            <h3 className="text-black mb-0" style={{ fontSize: 'clamp(18px, 3.5vw, 24px)' }}>
                              {activity.title}
                            </h3>
                            {activity.type && (
                              <span 
                                className="inline-block px-2 sm:px-3 py-1 text-white font-bold uppercase tracking-wide"
                                style={{ 
                                  backgroundColor: activityTypeColors[activity.type] || '#808183', 
                                  letterSpacing: '0.05em', 
                                  whiteSpace: 'nowrap', 
                                  fontSize: 'clamp(10px, 2.5vw, 12px)' 
                                }}
                              >
                                {activity.type}
                              </span>
                            )}
                          </div>
                          
                          {/* Activity Description */}
                          {activity.description && (
                            <p 
                              className="text-black mb-3"
                              style={{ lineHeight: '1.6', maxWidth: '48rem', color: '#374151', fontSize: 'clamp(14px, 3vw, 16px)' }}
                            >
                              {activity.description}
                            </p>
                          )}
                          
                          {/* Sources */}
                          {activity.sources && activity.sources.length > 0 && (
                            <div className="mt-3">
                              <p 
                                className="font-bold uppercase mb-2"
                                style={{ color: '#6B7280', letterSpacing: '0.05em', fontSize: 'clamp(10px, 2.5vw, 11px)' }}
                              >
                                {activity.sources.length === 1 ? 'Source' : 'Sources'}
                              </p>
                              {activity.sources.map((source, idx) => (
                                <div key={idx} className="mb-2">
                                  <a
                                    href={source.url}
                                    className="no-underline font-medium transition-colors inline-block hover:text-blue-800"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontSize: 'clamp(13px, 2.8vw, 14px)', color: '#1E3A8A', wordBreak: 'break-word' }}
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
    </div>
  );
}
