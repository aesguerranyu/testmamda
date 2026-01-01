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
      {/* Hero Section */}
      <section className="bg-subway-blue min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Tracking big promises
            <br />
            to New Yorkers
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            An independent, public interest record tracking Mayor Zohran Mamdani's promises and
            agenda
          </p>
          <button
            onClick={scrollToPromises}
            className="inline-block px-8 py-4 bg-[#0c2788] text-white font-bold uppercase tracking-wider text-sm hover:bg-[#1436B3] hover:scale-105 transition-all"
          >
            Start Tracking
          </button>
        </div>
      </section>

      {/* Promises Section */}
      <section id="promises-section" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-subway-blue mb-4">
              Promises and Agenda
            </h2>
            <p className="text-gray-600 text-lg">
              Every promise tracked and verified with sources
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-subway-blue"></div>
            </div>
          ) : promises.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No published promises yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promises.map((promise) => (
                <PromiseCard
                  key={promise.id}
                  id={promise.id}
                  category={promise.category}
                  headline={promise.headline}
                  shortDescription={promise.short_description}
                  status={promise.status}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/promises"
              className="inline-flex items-center gap-2 text-subway-dark font-bold text-lg uppercase tracking-wide hover:text-subway-blue transition-colors group"
            >
              View All Promises
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Explore the Tracker Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-subway-blue">Explore the Tracker</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exploreCards.map((card) => (
              <Link
                key={card.to}
                to={card.to}
                className="block bg-white border-2 border-gray-200 p-6 hover:border-subway-blue transition-colors group"
              >
                <card.icon className="w-8 h-8 text-subway-blue mb-4" />
                <h3 className="text-lg font-bold text-subway-dark uppercase tracking-wide mb-2 group-hover:text-subway-blue transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm">{card.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-subway-blue mb-4">
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
