import { Link } from "react-router-dom";
import { getLatestUpdates, promises } from "../../data/mockData";
import { ArrowRightIcon, FlagIcon, ClockIcon, ChartBarIcon, DocumentTextIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { StatusBadge } from "../../components/public/StatusBadge";
import { MembershipForm } from "../../components/public/MembershipForm";
import { SEO } from "../../components/SEO";
import { StructuredData } from "../../components/StructuredData";
import { PromiseCard } from "../../components/public/PromiseCard";

export default function Home() {
  const latestUpdates = getLatestUpdates(5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const scrollToPromises = () => {
    const element = document.getElementById('promises-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Map categories to subway line colors
  const getCategoryColor = (category: string): string => {
    const colorMap: { [key: string]: string } = {
      "Housing": "#EE352E",        // Red line (1,2,3)
      "Transportation": "#0039A6",  // Blue line (A,C,E)
      "Education": "#00933C",       // Green line (4,5,6)
      "Healthcare": "#FF6319",      // Orange line (B,D,F,M)
      "Economy": "#FCCC0A",         // Yellow line (N,Q,R,W)
      "Environment": "#6CBE45",     // Lime (G line)
      "Safety": "#B933AD",          // Purple (7 line)
      "Economic Justice": "#FCCC0A", // Yellow
      "Public Safety": "#B933AD",    // Purple
      "Government Reform": "#A7A9AC" // Gray
    };
    return colorMap[category] || "#A7A9AC";
  };

  const exploreCards = [
    {
      to: "/promises",
      icon: FlagIcon,
      title: "Promises",
      description: "Track every commitment with verified sources and status updates"
    },
    {
      to: "/first100days",
      icon: ClockIcon,
      title: "First 100 Days",
      description: "Monitor progress and priorities in the critical early period"
    },
    {
      to: "/indicators",
      icon: ChartBarIcon,
      title: "Key Performance Indicators",
      description: "NYC data and metrics that show real impact on New Yorkers"
    },
    {
      to: "/methodology",
      icon: DocumentTextIcon,
      title: "About",
      description: "How we verify, source, and maintain independence"
    },
    {
      to: "/membership",
      icon: UserGroupIcon,
      title: "Membership",
      description: "Join our community and support independent civic tracking"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Mamdani Tracker | Tracking Promises to New Yorkers"
        description="An independent, public interest record tracking Mayor Zohran Mamdani's promises and agenda"
      />
      <StructuredData type="WebSite" data={{ name: "Mamdani Tracker" }} />
      
      {/* Hero Section - Full screen */}
      <section className="min-h-[80vh] flex items-center justify-center bg-white border-b-4 border-black">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight tracking-tight">
              Tracking big promises <br /> to New Yorkers
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              An independent, public interest record tracking Mayor Zohran Mamdani's promises and agenda
            </p>
            
            <div className="flex justify-center">
              <button
                onClick={scrollToPromises}
                className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 font-bold text-lg uppercase tracking-wide hover:bg-gray-800 transition-colors"
              >
                Start Tracking
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Promises Section */}
      <section id="promises-section" className="py-16 bg-gray-50 border-b-4 border-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 uppercase tracking-wide">
              Promises and Agenda
            </h2>
            <p className="text-lg text-gray-600">
              Every promise tracked and verified with sources
            </p>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {promises.map((promise) => (
              <div key={promise.id}>
                <PromiseCard {...promise} />
              </div>
            ))}
          </div>
        
          <div className="text-center mt-12">
            <Link
              to="/promises"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center gap-2 text-black hover:text-blue-600 transition-colors font-bold text-lg no-underline group uppercase tracking-wide"
            >
              View All Promises 
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Explore the Tracker Section */}
      <section className="py-16 bg-white border-b-4 border-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 uppercase tracking-wide">
              Explore the Tracker
            </h2>
          </div>
        
          {/* Grid - same for all screen sizes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {exploreCards.map((card, index) => (
              <Link
                key={index}
                to={card.to}
                onClick={() => window.scrollTo(0, 0)}
              >
                <div className="bg-white border-2 border-black p-6 hover:bg-gray-50 transition-colors h-full">
                  <card.icon className="w-8 h-8 text-black mb-4" />
                  <h3 className="text-xl font-bold text-black mb-2 uppercase">
                    {card.title}
                  </h3>
                  <p className="text-gray-600">
                    {card.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Updates - Subway style */}
      <section className="py-16 bg-gray-50 border-b-4 border-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 uppercase tracking-wide">
              Latest Updates
            </h2>
          </div>
        
          <div className="max-w-3xl mx-auto space-y-4">
            {latestUpdates.map((item) => (
              <div key={item.id} className="bg-white border-2 border-black p-6">
                <div className="flex items-center gap-4 mb-3">
                  <span className="bg-black text-white px-3 py-1 text-sm font-bold uppercase">
                    {item.type === "promise" ? "Promise" : "Action"}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {formatDate(item.date)}
                  </span>
                </div>
                {item.type === "promise" ? (
                  <h3 className="text-lg font-bold text-black">
                    {item.headline}
                  </h3>
                ) : (
                  <p className="text-gray-700">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Be a Member Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 uppercase tracking-wide">
              Become a Member. It's free!
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Be part of the exciting public interest project tracking changes in NYC.
            </p>
          </div>

          <MembershipForm />
        </div>
      </section>
    </div>
  );
}
