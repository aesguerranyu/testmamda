import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "../../components/SEO";
import { IndicatorCard } from "../../components/public/IndicatorCard";
import { ChartBarIcon } from "@heroicons/react/24/solid";

interface Indicator {
  id: string;
  headline: string;
  description_paragraph: string;
  category: string;
  target: string;
  current: string;
  current_description: string;
  source: string;
}

export default function Indicators() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIndicators = async () => {
      const { data, error } = await supabase
        .from("indicators")
        .select("*")
        .eq("editorial_state", "published")
        .order("category", { ascending: true });

      if (!error && data) {
        setIndicators(data);
      }
      setIsLoading(false);
    };

    fetchIndicators();
  }, []);

  // Transform data for IndicatorCard component
  const transformedIndicators = indicators.map(ind => ({
    id: ind.id,
    headline: ind.headline,
    category: ind.category,
    current: ind.current,
    currentDescription: ind.current_description,
    target: ind.target,
    descriptionParagraph: ind.description_paragraph,
    source: ind.source,
    promise: null
  }));

  return (
    <div className="min-h-screen">
      <SEO 
        title="NYC Data Indicators - Mamdani Tracker | Real Numbers & Context"
        description="Track key NYC data indicators including housing, crime, unemployment, education, and public health metrics. Real numbers providing context for evaluating mayoral policy impact."
        keywords="NYC data, city metrics, NYC housing data, NYC crime statistics, NYC unemployment, NYC education metrics, NYC public health data, city indicators, NYC statistics"
      />
      
      {/* Hero Section */}
      <div className="bg-[#0C2788] py-5 mb-5">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5">
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4 flex-wrap">
            <ChartBarIcon style={{ width: '2.5rem', height: '2.5rem' }} className="text-white hidden sm:block" />
            <ChartBarIcon style={{ width: '2rem', height: '2rem' }} className="text-white sm:hidden" />
            <h1 className="font-bold text-white tracking-tight mb-0" style={{ fontSize: 'clamp(32px, 6vw, 56px)' }}>
              NYC Performance Indicators
            </h1>
          </div>
          <p className="text-white mb-0" style={{ fontSize: 'clamp(16px, 4vw, 20px)' }}>
            Key metrics and figures that help track how Mayor Zohran Mamdani's promises and policies are implemented.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5 pb-5">
        <div className="bg-[#E9EDFB] border-l-4 border-[#0C2788] p-3 md:p-4 mb-4 md:mb-5 max-w-4xl">
          <p className="m-0 leading-relaxed" style={{ fontSize: 'clamp(14px, 3vw, 16px)', lineHeight: '1.6', color: '#1F2937' }}>
            We will continue to refine and expand the KPIs to reflect the scholarly literature and best capture progress and outcomes related to Mamdani's agenda. These indicators provide context, not causation.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0C2788]"></div>
          </div>
        ) : transformedIndicators.length === 0 ? (
          <div className="text-center py-5 bg-white border-2 border-gray-300">
            <p className="text-lg text-gray-600 mb-0">No indicators defined yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {transformedIndicators.map((indicator) => (
              <div key={indicator.id}>
                <IndicatorCard indicator={indicator} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}