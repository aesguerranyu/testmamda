import { useState } from "react";
import { Calendar, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";

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
    <div className="min-vh-100" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Hero Section */}
      <div 
        className="text-white py-4 py-md-5 px-3 px-md-4"
        style={{ backgroundColor: '#1E3A8A' }}
      >
        <div className="container">
          <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
            <Calendar style={{ width: '32px', height: '32px' }} className="d-none d-sm-block" />
            <Calendar style={{ width: '24px', height: '24px' }} className="d-sm-none" />
            <h1 
              className="fw-bold text-uppercase mb-0"
              style={{ 
                letterSpacing: '0.1em',
                fontSize: 'clamp(1.5rem, 4vw, 2.25rem)'
              }}
            >
              First 100 Days
            </h1>
          </div>
          <p className="text-center mb-0" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', opacity: 0.9 }}>
            January 1 – April 10, 2026
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-4 py-md-5">
        {/* Sort Controls */}
        <div className="d-flex justify-content-end mb-4">
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="d-inline-flex align-items-center gap-2 px-3 px-sm-4 py-2 bg-white border border-2 border-dark text-dark fw-bold text-uppercase tracking-wide transition-all btn"
            style={{ letterSpacing: '0.05em', fontSize: 'clamp(10px, 2.5vw, 12px)' }}
            aria-label={sortOrder === "desc" ? "Sort to show oldest first" : "Sort to show most recent first"}
          >
            {sortOrder === "desc" ? (
              <>
                <ArrowDown style={{ width: '16px', height: '16px' }} />
                <span className="d-none d-sm-inline">Most Recent First</span>
                <span className="d-sm-none">Newest</span>
              </>
            ) : (
              <>
                <ArrowUp style={{ width: '16px', height: '16px' }} />
                <span className="d-none d-sm-inline">Oldest First</span>
                <span className="d-sm-none">Oldest</span>
              </>
            )}
          </button>
        </div>

        {/* Timeline */}
        <div className="d-flex flex-column gap-4">
          {sortedData.map((entry) => (
            <div key={entry.day} className="bg-white border border-2" style={{ borderColor: '#E2E8F0' }}>
              {/* Day Header - Blue Line Style */}
              <div 
                className="px-3 px-md-4 py-3"
                style={{ backgroundColor: '#1E3A8A' }}
              >
                <h2 
                  className="text-white fw-bold text-uppercase mb-0"
                  style={{ letterSpacing: '0.05em', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}
                >
                  Day {entry.day} — {entry.date}
                </h2>
              </div>

              {/* Activities */}
              <div className="p-3 p-md-4 d-flex flex-column gap-4">
                {entry.activities.map((activity, index) => (
                  <div 
                    key={index} 
                    className="ps-3 py-2"
                    style={{ borderLeft: '4px solid #1E3A8A' }}
                  >
                    {/* Activity Title with Pill */}
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                      <h3 
                        className="fw-bold mb-0"
                        style={{ color: '#1E293B', fontSize: 'clamp(1rem, 3vw, 1.125rem)' }}
                      >
                        {activity.title}
                      </h3>
                      {activity.type && (
                        <span 
                          className="px-2 py-1 fw-bold text-uppercase"
                          style={{ 
                            backgroundColor: '#FBBF24', 
                            color: '#1E293B',
                            fontSize: '0.75rem',
                            letterSpacing: '0.05em'
                          }}
                        >
                          {activity.type}
                        </span>
                      )}
                    </div>
                    
                    {/* Activity Description */}
                    <p 
                      className="text-secondary mb-2"
                      style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', lineHeight: 1.6 }}
                    >
                      {activity.description}
                    </p>
                    
                    {/* Sources */}
                    {activity.sources && activity.sources.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {activity.sources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="d-inline-flex align-items-center gap-1 text-decoration-none fw-medium"
                            style={{ 
                              color: '#1E3A8A',
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#DC2626'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#1E3A8A'}
                          >
                            <span>→</span> {source.title}
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
          <div className="bg-white border border-2 p-5 text-center" style={{ borderColor: '#E2E8F0' }}>
            <p className="text-secondary mb-2" style={{ fontSize: '1.125rem' }}>
              First 100 Days tracking will begin once Mayor Mamdani takes office.
            </p>
            <p className="text-secondary mb-0" style={{ opacity: 0.7 }}>
              Check back soon for updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
