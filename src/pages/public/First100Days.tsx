import { SEO } from "../../components/SEO";
import { CalendarIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

// Mock data for First 100 Days
const first100Days = [
  {
    day: 1,
    date: "January 1, 2026",
    activities: [
      {
        id: "a1",
        title: "Inauguration Ceremony",
        type: "Event",
        description: "Zohran Mamdani is sworn in as the 111th Mayor of New York City at City Hall.",
        sources: [
          { title: "NYC Official Announcement", url: "#" }
        ]
      }
    ]
  },
  {
    day: 2,
    date: "January 2, 2026",
    activities: [
      {
        id: "a2",
        title: "Executive Order on Housing",
        type: "Executive Order",
        description: "Signs first executive order declaring a housing emergency and directing agencies to expedite affordable housing projects.",
        sources: [
          { title: "Mayor's Office Press Release", url: "#" }
        ]
      },
      {
        id: "a3",
        title: "Cabinet Appointments",
        type: "Appointment",
        description: "Announces first wave of cabinet appointments including Deputy Mayor for Housing.",
        sources: []
      }
    ]
  },
  {
    day: 5,
    date: "January 5, 2026",
    activities: [
      {
        id: "a4",
        title: "MTA Coordination Meeting",
        type: "Meeting",
        description: "First meeting with MTA leadership to discuss transit improvements and fare policy.",
        sources: [
          { title: "NY1 Coverage", url: "#" }
        ]
      }
    ]
  }
];

export default function First100Days() {
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
      <div className="bg-[#0C2788] py-5 mb-5">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5">
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4 flex-wrap">
            <CalendarIcon style={{ width: '2.5rem', height: '2.5rem' }} className="text-white hidden sm:block" />
            <CalendarIcon style={{ width: '2rem', height: '2rem' }} className="text-white sm:hidden" />
            <h1 className="font-bold text-white tracking-tight mb-0" style={{ fontSize: 'clamp(32px, 6vw, 56px)' }}>
              First 100 Days
            </h1>
          </div>
          <p className="text-white mb-0" style={{ fontSize: 'clamp(16px, 4vw, 20px)' }}>
            January 1 – April 10, 2026
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5 pb-5">
        {/* Sort Controls */}
        <div className="mb-4 flex justify-end flex-wrap gap-3">
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border-2 border-black text-black font-bold uppercase tracking-wide transition-all cursor-pointer"
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

        {/* Timeline */}
        <div className="flex flex-col" style={{ gap: '4rem' }}>
          {sortedData.map((entry) => (
            <div key={entry.day}>
              {/* Day Header - Blue Line Style */}
              <div className="border-t-4 border-[#0C2788] pt-4 mb-4">
                <h2 className="font-bold text-black mb-0" style={{ fontSize: 'clamp(20px, 4vw, 28px)' }}>
                  Day {entry.day} — {entry.date}
                </h2>
              </div>

              {/* Activities */}
              <div className="flex flex-col gap-4 pl-3 md:pl-4">
                {entry.activities.map((activity) => (
                  <article key={activity.id} className="border-l-2 pl-3 sm:pl-4" style={{ borderColor: '#E5E7EB' }}>
                    {/* Activity Title with Pill */}
                    <div className="flex items-baseline gap-2 sm:gap-3 mb-3 flex-wrap">
                      <h3 className="text-black mb-0" style={{ fontSize: 'clamp(18px, 3.5vw, 24px)' }}>
                        {activity.title}
                      </h3>
                      {activity.type && (
                        <span 
                          className="inline-block px-2 sm:px-3 py-1 text-white font-bold uppercase tracking-wide"
                          style={{ backgroundColor: '#0C2788', letterSpacing: '0.05em', whiteSpace: 'nowrap', fontSize: 'clamp(10px, 2.5vw, 12px)' }}
                        >
                          {activity.type}
                        </span>
                      )}
                    </div>
                    
                    {/* Activity Description */}
                    <p className="text-black mb-3" style={{ lineHeight: '1.6', maxWidth: '48rem', color: '#374151', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                      {activity.description}
                    </p>
                    
                    {/* Sources */}
                    {activity.sources && activity.sources.length > 0 && (
                      <div className="mt-3">
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