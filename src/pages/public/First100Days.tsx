import { useState } from "react";
import { Calendar, ArrowUp, ArrowDown } from "lucide-react";

// Mock data for First 100 Days - will be replaced with Supabase data later
const first100Days = [
  {
    day: 1,
    date: "January 1, 2026",
    activities: [
      {
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
        title: "Executive Order on Housing",
        type: "Executive Order",
        description: "Signs first executive order declaring a housing emergency and directing agencies to expedite affordable housing projects.",
        sources: [
          { title: "Mayor's Office Press Release", url: "#" }
        ]
      },
      {
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
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const sortedData = [...first100Days].sort((a, b) => {
    if (sortOrder === "desc") {
      return b.day - a.day;
    } else {
      return a.day - b.day;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: '#1E3A8A' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-8 h-8 sm:w-10 sm:h-10" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-wider">
              First 100 Days
            </h1>
          </div>
          <p className="text-lg sm:text-xl font-medium opacity-90">
            January 1 – April 10, 2026
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Sort Controls */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border-2 border-gray-900 text-gray-900 font-bold uppercase tracking-wide text-xs sm:text-sm transition-all hover:bg-[#1E3A8A] hover:text-white hover:border-[#1E3A8A]"
            aria-label={sortOrder === "desc" ? "Sort to show oldest first" : "Sort to show most recent first"}
          >
            {sortOrder === "desc" ? (
              <>
                <ArrowDown className="w-4 h-4" />
                <span className="hidden sm:inline">Most Recent First</span>
                <span className="sm:hidden">Newest</span>
              </>
            ) : (
              <>
                <ArrowUp className="w-4 h-4" />
                <span className="hidden sm:inline">Oldest First</span>
                <span className="sm:hidden">Oldest</span>
              </>
            )}
          </button>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {sortedData.map((entry) => (
            <div key={entry.day} className="bg-white border-2 border-gray-200">
              {/* Day Header - Blue Line Style */}
              <div 
                className="px-4 sm:px-6 py-3"
                style={{ backgroundColor: '#1E3A8A' }}
              >
                <h2 className="text-white font-bold uppercase tracking-wide text-sm sm:text-base">
                  Day {entry.day} — {entry.date}
                </h2>
              </div>

              {/* Activities */}
              <div className="p-4 sm:p-6 space-y-4">
                {entry.activities.map((activity, index) => (
                  <div 
                    key={index} 
                    className="pl-4 py-2"
                    style={{ borderLeft: '4px solid #1E3A8A' }}
                  >
                    {/* Activity Title with Pill */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                        {activity.title}
                      </h3>
                      {activity.type && (
                        <span 
                          className="px-2 py-1 font-bold uppercase text-xs tracking-wide"
                          style={{ backgroundColor: '#FBBF24', color: '#1E293B' }}
                        >
                          {activity.type}
                        </span>
                      )}
                    </div>
                    
                    {/* Activity Description */}
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-2">
                      {activity.description}
                    </p>
                    
                    {/* Sources */}
                    {activity.sources && activity.sources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {activity.sources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#1E3A8A] hover:text-red-600 text-xs sm:text-sm font-medium transition-colors"
                          >
                            → {source.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {first100Days.length === 0 && (
          <div className="bg-white border-2 border-gray-200 p-8 text-center">
            <p className="text-gray-600 text-lg">
              First 100 Days tracking will begin once Mayor Mamdani takes office.
            </p>
            <p className="text-gray-400 mt-2">
              Check back soon for updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
