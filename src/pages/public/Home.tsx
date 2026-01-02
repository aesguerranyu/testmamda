import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Flag, Clock, BarChart3, FileText, Users } from "lucide-react";
import { PromiseCard } from "@/components/public/PromiseCard";
import { MembershipForm } from "@/components/public/MembershipForm";
import { supabase } from "@/integrations/supabase/client";

interface PublicPromise {
  id: string;
  headline: string;
  short_description: string;
  category: string;
  status: string;
  updated_at: string;
}

// Map categories to subway line colors
const getCategoryColor = (category: string): string => {
  const colorMap: { [key: string]: string } = {
    "Housing": "#EE352E",
    "Transportation": "#0039A6",
    "Education": "#00933C",
    "Healthcare": "#FF6319",
    "Economy": "#FCCC0A",
    "Environment": "#6CBE45",
    "Safety": "#B933AD",
    "Economic Justice": "#FCCC0A",
    "Public Safety": "#B933AD",
    "Government Reform": "#A7A9AC"
  };
  return colorMap[category] || "#A7A9AC";
};

const exploreCards = [
  {
    to: "/promises",
    icon: Flag,
    title: "Promises",
    description: "Track every commitment with verified sources and status updates",
  },
  {
    to: "/first100days",
    icon: Clock,
    title: "First 100 Days",
    description: "Monitor progress and priorities in the critical early period",
  },
  {
    to: "/indicators",
    icon: BarChart3,
    title: "Key Performance Indicators",
    description: "NYC data and metrics that show real impact on New Yorkers",
  },
  {
    to: "/methodology",
    icon: FileText,
    title: "About",
    description: "How we verify, source, and maintain independence",
  },
  {
    to: "/membership",
    icon: Users,
    title: "Membership",
    description: "Join our community and support independent civic tracking",
  },
];

export default function PublicHome() {
  const [promises, setPromises] = useState<PublicPromise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPromises = async () => {
      const { data, error } = await supabase
        .from("promises")
        .select("id, headline, short_description, category, status, updated_at")
        .eq("editorial_state", "published")
        .order("updated_at", { ascending: false })
        .limit(6);

      if (!error && data) {
        setPromises(data);
      }
      setIsLoading(false);
    };

    fetchPromises();
  }, []);

  const scrollToPromises = () => {
    const element = document.getElementById("promises-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section - Full screen with background image */}
      <section 
        className="min-h-screen flex items-center justify-center relative bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(30, 58, 138, 0.85), rgba(30, 58, 138, 0.95)), url('https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1920&q=80')`
        }}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
              Tracking big promises <br />to New Yorkers
            </h1>
            
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
              An independent, public interest record tracking Mayor Zohran Mamdani's promises and agenda
            </p>
            
            <div className="pt-4">
              <button
                onClick={scrollToPromises}
                className="inline-block px-8 py-4 bg-[#0c2788] text-white font-bold uppercase tracking-widest text-sm hover:bg-[#1436B3] hover:scale-105 transition-all duration-200 border-2 border-white/20"
              >
                Start Tracking
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Promises Section */}
      <section id="promises-section" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mb-4 tracking-tight">
              Promises and Agenda
            </h2>
            <p className="text-gray-600 text-lg">
              Every promise tracked and verified with sources
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1E3A8A]"></div>
            </div>
          ) : promises.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No published promises yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promises.map((promise) => (
                <div key={promise.id} className="h-full">
                  <PromiseCard
                    id={promise.id}
                    category={promise.category}
                    headline={promise.headline}
                    shortDescription={promise.short_description}
                    status={promise.status}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/promises"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center gap-2 text-black hover:text-blue-600 transition-colors font-bold text-lg no-underline group uppercase tracking-wide"
            >
              View All Promises 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Explore the Tracker Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] tracking-tight">
              Explore the Tracker
            </h2>
          </div>

          {/* Grid - same for all screen sizes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exploreCards.map((card) => (
              <Link
                key={card.to}
                to={card.to}
                onClick={() => window.scrollTo(0, 0)}
                className="block bg-white border-2 border-gray-200 p-6 hover:border-[#1E3A8A] hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex flex-col h-full">
                  <card.icon className="w-10 h-10 text-[#1E3A8A] mb-4" strokeWidth={1.5} />
                  <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-2 group-hover:text-[#1E3A8A] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Be a Member Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E3A8A] mb-4 tracking-tight">
              Become a Member. It's free!
            </h2>
            <p className="text-gray-600 text-lg">
              Be part of the exciting public interest project tracking changes in NYC.
            </p>
          </div>

          <MembershipForm />
        </div>
      </section>
    </div>
  );
}
