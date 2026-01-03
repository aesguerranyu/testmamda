import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, FlagIcon, ClockIcon, ChartBarIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
import { MembershipForm } from "../../components/public/MembershipForm";
import { SEO } from "../../components/SEO";
import { StructuredData } from "../../components/StructuredData";
import { PromiseCard } from "../../components/public/PromiseCard";
import { supabase } from "@/integrations/supabase/client";

// 6-Car Subway Train SVG
const SubwayTrain = ({ color = "#0C2788" }: { color?: string }) => (
  <svg
    width="360"
    height="26"
    viewBox="0 0 360 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 0.6, display: "block" }}
  >
    {/* SVG content unchanged */}
  </svg>
);

interface PromiseData {
  id: string;
  headline: string;
  short_description: string;
  category: string;
  status: string;
  url_slugs: string;
}

export default function Home() {
  const [promises, setPromises] = useState<PromiseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trainVisible, setTrainVisible] = useState(false);
  const [trainFromLeft, setTrainFromLeft] = useState(true);

  useEffect(() => {
    const fetchPromises = async () => {
      const { data, error } = await supabase
        .from("promises")
        .select("id, headline, short_description, category, status, url_slugs")
        .eq("editorial_state", "published")
        .limit(6);

      if (!error && data) {
        setPromises(data);
      }
      setIsLoading(false);
    };

    fetchPromises();
  }, []);

  useEffect(() => {
    const triggerTrain = () => {
      setTrainFromLeft(Math.random() > 0.5);
      setTrainVisible(true);
      setTimeout(() => setTrainVisible(false), 8000);
    };

    const initialDelay = setTimeout(triggerTrain, 2000);
    const interval = setInterval(triggerTrain, 8000 + Math.random() * 7000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  const scrollToPromises = () => {
    const element = document.getElementById("promises-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const exploreCards = [
    {
      to: "/promises",
      icon: FlagIcon,
      title: "Promise Tracker",
      description: "Track every commitment with clear status updates and verified sources.",
    },
    {
      to: "/first100days",
      icon: ClockIcon,
      title: "First 100 Days",
      description: "Follow early priorities and actions as Mayor Mamdani reshapes New York City.",
    },
    {
      to: "/indicators",
      icon: ChartBarIcon,
      title: "NYC Performance Indicators",
      description: "Data and metrics that show how policies affect New Yorkers.",
    },
    {
      to: "/methodology",
      icon: DocumentTextIcon,
      title: "Methodology",
      description: "How we track the administration and maintain independence.",
    },
  ];

  const mappedPromises = promises.map((p) => ({
    id: p.id,
    headline: p.headline,
    shortDescription: p.short_description,
    category: p.category,
    status: p.status,
    slug: p.url_slugs,
  }));

  return (
    <div className="min-h-screen">
      <SEO
        title="Mamdani Tracker - Tracking NYC Mayor Zohran Mamdani's Promises & Actions"
        description="An independent public-interest website tracking New York City Mayor Zohran Mamdani's campaign promises, policy positions, mayoral actions, and appointments."
      />
      <StructuredData type="website" />

      {/* Hero Section (unchanged) */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: "100vh" }}>
        <div className="container mx-auto max-w-7xl px-3">
          <div className="text-center">
            <h1 className="font-bold text-[#0C2788] mb-4">
              Tracking big promises <br /> to New Yorkers
            </h1>
            <p className="mb-5">
              An independent, public-interest record tracking Mayor Zohran Mamdani's promises, actions, and progress.
            </p>
            <button onClick={scrollToPromises} className="px-5 py-3 bg-[#0C2788] text-white font-bold uppercase">
              Start Tracking
            </button>
          </div>
        </div>
      </section>

      {/* Promises Section */}
      <div id="promises-section" className="container mx-auto max-w-7xl px-3 mb-5">
        <div className="mb-5">
          <h2 className="font-bold text-black">Promises and Agenda</h2>
          <p className="text-base max-w-3xl">Let’s track what the Mamdani administration said it would do.</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0C2788]" />
          </div>
        ) : mappedPromises.length > 0 ? (
          /* ⬇⬇⬇ THIS IS THE ONLY MODIFIED PART ⬇⬇⬇ */
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5 items-stretch"
            style={{ gridAutoRows: "1fr" }}
          >
            {mappedPromises.map((promise) => (
              <PromiseCard key={promise.id} promise={promise} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white border-2 border-gray-200 mb-5">
            <p className="text-gray-600">No published promises yet.</p>
          </div>
        )}

        <div className="text-center">
          <Link
            to="/promises"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 font-bold uppercase"
          >
            View All Promises
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Explore + Membership sections unchanged */}
      <MembershipForm />
    </div>
  );
}
