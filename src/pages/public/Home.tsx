import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, FlagIcon, ClockIcon, ChartBarIcon, DocumentTextIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { MembershipForm } from "../../components/public/MembershipForm";
import { SEO } from "../../components/SEO";
import { StructuredData } from "../../components/StructuredData";
import { PromiseCard } from "../../components/public/PromiseCard";
import { supabase } from "@/integrations/supabase/client";
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
  useEffect(() => {
    const fetchPromises = async () => {
      const {
        data,
        error
      } = await supabase.from("promises").select("id, headline, short_description, category, status, url_slugs").eq("editorial_state", "published").limit(6);
      if (!error && data) {
        setPromises(data);
      }
      setIsLoading(false);
    };
    fetchPromises();
  }, []);
  const scrollToPromises = () => {
    const element = document.getElementById('promises-section');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  const exploreCards = [{
    to: "/promises",
    icon: FlagIcon,
    title: "Promise Tracker",
    description: "Track every commitment with clear status updates and verified sources."
  }, {
    to: "/first100days",
    icon: ClockIcon,
    title: "First 100 Days",
    description: "Follow early priorities and actions as Mayor Mamdani reshapes New York City."
  }, {
    to: "/indicators",
    icon: ChartBarIcon,
    title: "NYC Performance Indicators",
    description: "Data and metrics that show how policies affect New Yorkers."
  }, {
    to: "/methodology",
    icon: DocumentTextIcon,
    title: "Methodology",
    description: "How we track the administration and maintain independence."
  }];

  // Map database fields to PromiseCard expected format
  const mappedPromises = promises.map(p => ({
    id: p.id,
    headline: p.headline,
    shortDescription: p.short_description,
    category: p.category,
    status: p.status,
    slug: p.url_slugs
  }));
  return <div className="min-h-screen" style={{
    margin: 0,
    padding: 0
  }}>
      <SEO title="Mamdani Tracker - Tracking NYC Mayor Zohran Mamdani's Promises & Actions" description="An independent public-interest website tracking New York City Mayor Zohran Mamdani's campaign promises, policy positions, mayoral actions, and appointments with verified sources." keywords="Zohran Mamdani, NYC Mayor, New York City, campaign promises, accountability, political tracker, mayoral actions, NYC politics, policy tracker, government transparency" />
      <StructuredData type="website" />
      
      {/* Hero Section - Full screen */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{
      backgroundColor: '#ffffff',
      backgroundImage: `
            linear-gradient(0deg, rgba(12,39,136,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(12,39,136,0.06) 1px, transparent 1px)
          `,
      backgroundSize: '120px 60px',
      animation: 'grid-flow 20s linear infinite',
      minHeight: '100vh',
      paddingBottom: '10vh',
      margin: 0,
      padding: 0,
      paddingTop: '0 !important'
    }} aria-label="Hero section">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5 relative" style={{
        zIndex: 10
      }}>
          <div className="text-center">
            <h1 className="font-bold text-[#0C2788] mb-4 leading-tight tracking-tight" style={{
            fontSize: 'clamp(40px, 6vw, 68px)',
            lineHeight: 1.2
          }}>
              Tracking big promises <br /> to New Yorkers
            </h1>
            <p className="text-black mx-auto leading-relaxed mb-5 font-medium py-3 px-4" style={{
            maxWidth: '48rem',
            fontSize: 'clamp(18px, 2.2vw, 22px)'
          }}>
              An independent, public-interest record tracking Mayor Zohran Mamdani's promises, actions, and progress, built with and for the people of New York City.
            </p>
            
            <div className="flex items-center justify-center gap-3">
              <button onClick={scrollToPromises} className="px-4 md:px-5 py-3 bg-[#0C2788] text-white font-bold uppercase tracking-wide text-sm transition-all hover:bg-[#1436B3] hover:scale-105 border-0 cursor-pointer" style={{
              letterSpacing: '0.15em'
            }}>
                Start Tracking
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Promises Section */}
      <div id="promises-section" className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5 mb-5" style={{
      scrollMarginTop: '2rem'
    }}>
        <div className="mb-5">
          <div className="border-t-4 border-[#0C2788] pt-4 mb-3">
            <h2 className="font-bold text-black tracking-tight" style={{
            fontSize: 'clamp(32px, 4vw, 36px)'
          }}>Promises and Agenda</h2>
          </div>
          <p className="text-base max-w-3xl" style={{
          color: '#374151'
        }}>Let’s track what the Mamdani administration said it would do.</p>
        </div>
        
        {isLoading ? <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0C2788]"></div>
          </div> : mappedPromises.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            {mappedPromises.map(promise => <PromiseCard key={promise.id} promise={promise} />)}
          </div> : <div className="text-center py-8 bg-white border-2 border-gray-200 mb-5">
            <p className="text-gray-600">No published promises yet.</p>
          </div>}
        
        <div className="text-center">
          <Link to="/promises" onClick={() => window.scrollTo(0, 0)} className="inline-flex items-center gap-2 text-black hover:text-blue-600 transition-colors font-bold text-lg no-underline group uppercase tracking-wide">
            View All Promises 
            <ArrowRightIcon style={{
            width: '1.25rem',
            height: '1.25rem'
          }} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Explore the Tracker Section */}
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5 mb-5">
        <div className="mb-4">
          <div className="border-t-4 border-[#0C2788] pt-4 mb-3">
            <h2 className="font-bold text-black tracking-tight" style={{
            fontSize: 'clamp(28px, 3.5vw, 32px)'
          }}>Explore the Tracker</h2>
          </div>
        </div>
        
        {/* Grid - same for all screen sizes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {exploreCards.map((card, index) => <Link key={index} to={card.to} className="group block bg-white border-2 border hover:border-blue-600 transition-all p-4 md:p-5 no-underline h-full" style={{
          borderColor: '#7F97E6',
          color: 'rgba(7,27,94,0.85)'
        }} onClick={() => window.scrollTo(0, 0)}>
              <div className="flex flex-col items-center text-center">
                <card.icon style={{
              width: 'clamp(3.5rem, 8vw, 4rem)',
              height: 'clamp(3.5rem, 8vw, 4rem)'
            }} className="text-[#0C2788] mb-3" />
                <h3 className="font-bold text-black mb-2 tracking-tight" style={{
              fontSize: 'clamp(16px, 2vw, 18px)'
            }}>
                  {card.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {card.description}
                </p>
              </div>
            </Link>)}
        </div>
      </div>

      {/* Be a Member Section */}
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5 mb-5">
        <div className="mb-4">
          <div className="border-t-4 border-[#0C2788] pt-4 mb-3">
            <h2 className="font-bold text-black tracking-tight" style={{
            fontSize: 'clamp(28px, 3.5vw, 32px)'
          }}>Become a Member.  It's free.</h2>
          </div>
          <p className="text-sm max-w-3xl mb-2" style={{
          color: '#374151'
        }}>
            Be part of a public-interest project tracking changes in New York City.
          </p>
          <p className="text-sm max-w-3xl" style={{
          color: '#374151'
        }}>
            You'll hear from us every now and then. No spam. No information selling. We promise.
          </p>
        </div>

        <MembershipForm />
      </div>
    </div>;
}