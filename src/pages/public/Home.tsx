import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  FlagIcon,
  ClockIcon,
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { MembershipForm } from "../../components/public/MembershipForm";
import { SEO } from "../../components/SEO";
import { StructuredData } from "../../components/StructuredData";
import { PromiseCard } from "../../components/public/PromiseCard";
import { supabase } from "@/integrations/supabase/client";

// 6-Car Subway Train SVG (same design as footer, but in subway blue)
const SubwayTrain = ({ color = "#0C2788" }: { color?: string }) => (
  <svg
    width="360"
    height="26"
    viewBox="0 0 360 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      opacity: 0.6,
      display: "block",
    }}
  >
    {/* Car 1 */}
    <g>
      <rect x="1" y="5" width="52" height="18" fill="none" stroke={color} strokeWidth="1" />
      <rect x="4" y="7" width="10" height="11" fill={color} opacity="0.3" />
      <rect x="17" y="7" width="14" height="11" fill={color} opacity="0.3" />
      <rect x="34" y="7" width="10" height="11" fill={color} opacity="0.3" />
      <circle cx="10" cy="24" r="1.5" fill={color} />
      <circle cx="44" cy="24" r="1.5" fill={color} />
    </g>

    {/* Car 2 */}
    <g>
      <rect x="55" y="5" width="52" height="18" fill="none" stroke={color} strokeWidth="1" />
      <rect x="58" y="7" width="10" height="11" fill={color} opacity="0.3" />
      <rect x="71" y="7" width="14" height="11" fill={color} opacity="0.3" />
      <rect x="88" y="7" width="10" height="11" fill={color} opacity="0.3" />
      <circle cx="64" cy="24" r="1.5" fill={color} />
      <circle cx="98" cy="24" r="1.5" fill={color} />
    </g>

    {/* Car 3 */}
    <g>
      <rect x="109" y="5" width="52" height="18" fill="none" stroke={color} strokeWidth="1" />
      <rect x="112" y="7" width="10" height="11" fill={color} opacity="0.3" />
      <rect x="125" y="7" width="14" height="11" fill={color} opacity="0.3" />
      <rect x="142" y="7" width="10" height="11" fill={color} opacity="0.3" />
      <circle cx="118" cy="24" r="1.5" fill={color} />
      <circle cx="152" cy="24" r="1.5" fill={color} />
    </g>

    {/* Car 4 */}
    <g>
      <rect x="163" y="5" width="52" height="18" fill="none" stroke={color} strokeWidth="1" />
      <rect x="166" y="7" width="10" height="11" fill={color} opacity="0.3" />
      <rect x="179" y="7" width="14" height="11" fill={color} opacity="0.3" />
      <rect x="196" y="7" width="10" height="11" fill={color} opacity="0.3" />
      <circle cx="172" cy="24" r="1.5" fill={color} />
      <circle cx="206" cy="24" r="1.5" fill={color} />
    </g>

    {/* Car 5 */}
    <g>
      <rect x="217" y="5" width="52" height="18" fill="none" stroke={color} strokeWidth="1" />
      <rect x="220" y="7" width="10" height="11" fill={color} opacity="0.3" />
      <rect x="233" y="7" width="14" height="11" fill={color} opacity="0.3" />
      <rect x="250" y="7" width="10" height="11" fill={color} opacity="0.3" />
      <circle cx="226" cy="24" r="1.5" fill={color} />
      <circle cx="260" cy="24" r="1.5" fill={color} />
    </g>

    {/* Car 6 */}
    <g>
      <rect x="271" y="5" width="52" height="18" fill="none" stroke={color} strokeWidth="1" />
      <rect x="274" y="7" width="10" height="11" fill={color} opacity="0.3" />
      <rect x="287" y="7" width="14" height="11" fill={color} opacity="0.3" />
      <rect x="304" y="7" width="10" height="11" fill={color} opacity="0.3" />
      <circle cx="280" cy="24" r="1.5" fill={color} />
      <circle cx="314" cy="24" r="1.5" fill={color} />
    </g>
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
        .eq("editorial_state", "published");
      if (!error && data) {
        // Shuffle promises randomly and take first 6
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setPromises(shuffled.slice(0, 6));
      }
      setIsLoading(false);
    };
    fetchPromises();
  }, []);

  // Train animation effect
  useEffect(() => {
    const triggerTrain = () => {
      setTrainFromLeft(Math.random() > 0.5);
      setTrainVisible(true);
      setTimeout(() => setTrainVisible(false), 8000);
    };

    // Initial delay before first train
    const initialDelay = setTimeout(() => {
      triggerTrain();
    }, 2000);

    // Random interval between trains (8-15 seconds)
    const interval = setInterval(
      () => {
        triggerTrain();
      },
      8000 + Math.random() * 7000,
    );
    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);
  const scrollToPromises = () => {
    const element = document.getElementById("promises-section");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
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

  // Map database fields to PromiseCard expected format
  const mappedPromises = promises.map((p) => ({
    id: p.id,
    headline: p.headline,
    shortDescription: p.short_description,
    category: p.category,
    status: p.status,
    slug: p.url_slugs,
  }));
  return (
    <div
      className="min-h-screen"
      style={{
        margin: 0,
        padding: 0,
      }}
    >
      <SEO
        title="Mamdani Tracker - Tracking NYC Mayor Zohran Mamdani's Promises & Actions"
        description="An independent public-interest website tracking New York City Mayor Zohran Mamdani's campaign promises, policy positions, mayoral actions, and appointments with verified sources."
        keywords="Zohran Mamdani, NYC Mayor, New York City, campaign promises, accountability, political tracker, mayoral actions, NYC politics, policy tracker, government transparency"
        canonical="https://mamdanitracker.nyc/"
      />
      <StructuredData type="website" />

      {/* Hero Section - Full screen */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: `
            linear-gradient(0deg, rgba(12,39,136,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(12,39,136,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "120px 60px",
          animation: "grid-flow 20s linear infinite",
          minHeight: "100vh",
          paddingBottom: "10vh",
          margin: 0,
          padding: 0,
          paddingTop: "0 !important",
        }}
        aria-label="Hero section"
      >
        <div
          className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5 relative"
          style={{
            zIndex: 10,
          }}
        >
          <div className="text-center">
            {/* Animated Subway Train */}
            <div
              className="relative overflow-hidden mb-6"
              style={{
                height: "32px",
              }}
            >
              <div
                className={`absolute ${trainVisible ? (trainFromLeft ? "animate-[train-left-to-right_8s_linear_forwards]" : "animate-[train-right-to-left_8s_linear_forwards]") : "opacity-0"}`}
                style={{
                  top: "0",
                  left: trainFromLeft ? "-360px" : "auto",
                  right: trainFromLeft ? "auto" : "-360px",
                  width: "360px",
                  transform: trainFromLeft ? "scaleX(1)" : "scaleX(-1)",
                }}
              >
                <SubwayTrain color="#0C2788" />
              </div>
            </div>

            <h1
              className="font-bold text-[#0C2788] mb-4 leading-tight tracking-tight"
              style={{
                fontSize: "clamp(40px, 6vw, 68px)",
                lineHeight: 1.2,
              }}
            >
              Tracking Big Promises
              <br /> to New Yorkers
            </h1>
            <p
              className="text-black mx-auto leading-relaxed mb-5 font-medium py-3 px-4"
              style={{
                maxWidth: "48rem",
                fontSize: "clamp(18px, 2.2vw, 22px)",
              }}
            >
              An independent, public-interest record tracking Mayor Zohran Mamdani's promises, actions, and progress,
              built with and for the people of New York City.
            </p>

            <div className="flex items-center justify-center gap-3">
              <Link
                to="/zohran-mamdani-first-100-days"
                className="px-4 md:px-5 py-3 bg-[#0C2788] text-white font-bold uppercase tracking-wide text-sm transition-all hover:bg-[#1436B3] hover:scale-105 border-0 cursor-pointer no-underline"
                style={{
                  letterSpacing: "0.15em",
                }}
              >
                First 100 Days
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promises Section */}
      <div
        id="promises-section"
        className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5 mb-5"
        style={{
          scrollMarginTop: "2rem",
        }}
      >
        <div className="mb-5">
          <div className="border-t-4 border-[#0C2788] pt-4 mb-3">
            <h2
              className="font-bold text-black tracking-tight"
              style={{
                fontSize: "clamp(32px, 4vw, 36px)",
              }}
            >
              Promises and Agenda
            </h2>
          </div>
          <p
            className="text-base max-w-3xl"
            style={{
              color: "#374151",
            }}
          >
            Let’s track what the Mamdani administration said it would do.
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5 items-stretch"
          style={{
            gridAutoRows: "1fr",
          }}
        >
          {mappedPromises.map((promise) => (
            <PromiseCard key={promise.id} promise={promise} />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/promises"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 text-black hover:text-blue-600 transition-colors font-bold text-lg no-underline group uppercase tracking-wide"
          >
            View All Promises
            <ArrowRightIcon
              style={{
                width: "1.25rem",
                height: "1.25rem",
              }}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>

      {/* Explore the Tracker Section */}
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5 mb-5">
        <div className="mb-4">
          <div className="border-t-4 border-[#0C2788] pt-4 mb-3">
            <h2
              className="font-bold text-black tracking-tight"
              style={{
                fontSize: "clamp(28px, 3.5vw, 32px)",
              }}
            >
              Explore the Tracker
            </h2>
          </div>
        </div>

        {/* Grid - same for all screen sizes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {exploreCards.map((card, index) => (
            <Link
              key={index}
              to={card.to}
              className="group block bg-white border-2 border hover:border-blue-600 transition-all p-4 md:p-5 no-underline h-full"
              style={{
                borderColor: "#7F97E6",
                color: "rgba(7,27,94,0.85)",
              }}
              onClick={() => window.scrollTo(0, 0)}
            >
              <div className="flex flex-col items-center text-center">
                <card.icon
                  style={{
                    width: "clamp(3.5rem, 8vw, 4rem)",
                    height: "clamp(3.5rem, 8vw, 4rem)",
                  }}
                  className="text-[#0C2788] mb-3"
                />
                <h3
                  className="font-bold text-black mb-2 tracking-tight"
                  style={{
                    fontSize: "clamp(16px, 2vw, 18px)",
                  }}
                >
                  {card.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Be a Member Section */}
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5 mb-5">
        <div className="mb-4">
          <div className="border-t-4 border-[#0C2788] pt-4 mb-3">
            <h2
              className="font-bold text-black tracking-tight"
              style={{
                fontSize: "clamp(28px, 3.5vw, 32px)",
              }}
            >
              Become a Member. It's free.
            </h2>
          </div>
          <p
            className="text-sm max-w-3xl mb-2"
            style={{
              color: "#374151",
            }}
          >
            Be part of a public-interest project tracking changes in New York City.
          </p>
        </div>

        <MembershipForm />
      </div>
    </div>
  );
}
