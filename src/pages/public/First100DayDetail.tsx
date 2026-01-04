import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { getPublishedDayByDate } from "@/lib/first100days-store";
import { First100Day, First100Activity, activityTypeColors } from "@/types/first100days";

export default function First100DayDetail() {
  const { year, month, day } = useParams<{ year: string; month: string; day: string }>();
  const dateIso = `${year}-${month}-${day}`;

  const [dayEntry, setDayEntry] = useState<(First100Day & { activities: First100Activity[] }) | null>(null);
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
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0C2788]"></div>
      </div>
    );
  }

  if (notFound || !dayEntry) {
    return (
      <div className="min-h-screen bg-white">
        <SEO 
          title="Day not found - First 100 Days - Mamdani Tracker"
          description="The requested day could not be found."
        />
        <div className="container mx-auto max-w-7xl px-4 sm:px-5 lg:px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Day not found</h1>
          <Link 
            to="/zohran-mamdani-first-100-days"
            className="inline-flex items-center gap-2 text-[#1E3A8A] font-medium hover:underline"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to First 100 Days
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={`Day ${dayEntry.day} - ${dayEntry.date_display} | First 100 Days - Mamdani Tracker`}
        description={`Track Mayor Zohran Mamdani's actions on Day ${dayEntry.day} (${dayEntry.date_display}). ${dayEntry.activities.length} ${dayEntry.activities.length === 1 ? 'activity' : 'activities'} documented.`}
        keywords={`Mamdani Day ${dayEntry.day}, ${dayEntry.date_display}, first 100 days, NYC mayor timeline, mayoral actions`}
      />
      
      {/* Header Section */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-5 lg:px-6 py-5">
        <div className="mb-4">
          <Link 
            to="/zohran-mamdani-first-100-days"
            className="inline-flex items-center gap-2 text-[#1E3A8A] font-medium hover:underline text-sm"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            First 100 Days
          </Link>
        </div>
        
        {/* Day Header */}
        <div className="border-t-4 border-[#0C2788] pt-4 mb-3">
          <h1 className="font-bold text-black mb-0" style={{ fontSize: 'clamp(28px, 5vw, 40px)' }}>
            Day {dayEntry.day} — {dayEntry.date_display}
          </h1>
        </div>
        
        <p className="text-sm" style={{ color: '#6B7280' }}>
          {dayEntry.activities.length} {dayEntry.activities.length === 1 ? 'Activity' : 'Activities'} documented
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5 pb-8">
        {/* Activities */}
        <div className="flex flex-col gap-8 pl-3 md:pl-4">
          {dayEntry.activities.map((activity) => (
            <article key={activity.id} className="border-l-2 pl-3 sm:pl-4 py-2" style={{ borderColor: '#E5E7EB' }}>
              {activity.type === "Pull Quote" ? (
                <>
                  <div className="mb-4">
                    <div className="border-l-4 pl-4 sm:pl-6 py-2" style={{ borderColor: '#0C2788' }}>
                      <blockquote 
                        className="font-semibold text-black italic"
                        style={{ fontSize: 'clamp(20px, 4vw, 28px)', lineHeight: '1.4' }}
                      >
                        "{activity.quote}"
                      </blockquote>
                      {activity.quote_attribution && (
                        <p 
                          className="mt-3 font-medium"
                          style={{ color: '#6B7280', fontSize: 'clamp(14px, 3vw, 16px)' }}
                        >
                          {activity.quote_attribution}
                        </p>
                      )}
                    </div>
                    {(activity.full_text_url || (activity.sources as any)?.[0]?.url) && (
                      <a
                        href={activity.full_text_url || (activity.sources as any)[0]?.url}
                        className="inline-block mt-3 font-medium hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#1E3A8A', fontSize: 'clamp(13px, 2.8vw, 14px)' }}
                      >
                        → {activity.full_text_label || "Read full speech"}
                      </a>
                    )}
                  </div>

                  {activity.description && (
                    <p 
                      className="text-black mb-4"
                      style={{ lineHeight: '1.7', maxWidth: '48rem', color: '#374151', fontSize: 'clamp(15px, 3vw, 17px)' }}
                    >
                      {activity.description}
                    </p>
                  )}

                  {Array.isArray(activity.sources) && activity.sources.length > 0 && (
                    <div className="mt-4">
                      <p 
                        className="font-bold uppercase mb-2"
                        style={{ color: '#6B7280', letterSpacing: '0.05em', fontSize: 'clamp(10px, 2.5vw, 11px)' }}
                      >
                        {activity.sources.length === 1 ? 'Source' : 'Sources'}
                      </p>
                      {(activity.sources as any[]).map((source: any, idx: number) => (
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
                  <div className="flex items-baseline gap-2 sm:gap-3 mb-3 flex-wrap">
                    <h2 className="text-black mb-0 font-bold" style={{ fontSize: 'clamp(20px, 4vw, 28px)' }}>
                      {activity.title}
                    </h2>
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
                  
                  {activity.description && (
                    <p 
                      className="text-black mb-4"
                      style={{ lineHeight: '1.7', maxWidth: '48rem', color: '#374151', fontSize: 'clamp(15px, 3vw, 17px)' }}
                    >
                      {activity.description}
                    </p>
                  )}
                  
                  {Array.isArray(activity.sources) && activity.sources.length > 0 && (
                    <div className="mt-4">
                      <p 
                        className="font-bold uppercase mb-2"
                        style={{ color: '#6B7280', letterSpacing: '0.05em', fontSize: 'clamp(10px, 2.5vw, 11px)' }}
                      >
                        {activity.sources.length === 1 ? 'Source' : 'Sources'}
                      </p>
                      {(activity.sources as any[]).map((source: any, idx: number) => (
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

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link 
            to="/zohran-mamdani-first-100-days"
            className="inline-flex items-center gap-2 text-[#1E3A8A] font-medium hover:underline"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to First 100 Days
          </Link>
        </div>
      </div>
    </div>
  );
}
