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
  promise_reference: string;
}

interface Promise {
  id: string;
  headline: string;
  category: string;
  url_slugs: string;
}

export default function Indicators() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [promises, setPromises] = useState<Promise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [indicatorsRes, promisesRes] = await Promise.all([
        supabase
          .from("indicators")
          .select("*")
          .eq("editorial_state", "published")
          .order("category", { ascending: true }),
        supabase
          .from("promises")
          .select("id, headline, category, url_slugs")
          .eq("editorial_state", "published")
      ]);

      if (!indicatorsRes.error && indicatorsRes.data) {
        setIndicators(indicatorsRes.data);
      }
      if (!promisesRes.error && promisesRes.data) {
        setPromises(promisesRes.data);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Find up to 2 related promises for an indicator
  const findRelatedPromises = (indicator: Indicator): Promise[] => {
    const related: Promise[] = [];
    
    // First, check if there's a direct promise_reference match
    if (indicator.promise_reference) {
      const directMatch = promises.find(p => 
        p.headline.toLowerCase() === indicator.promise_reference.toLowerCase() ||
        p.id === indicator.promise_reference
      );
      if (directMatch) {
        related.push(directMatch);
      }
    }
    
    // Then, find promises in the same category
    const categoryMatches = promises.filter(p => 
      p.category.toLowerCase() === indicator.category.toLowerCase() &&
      !related.some(r => r.id === p.id)
    );
    
    // Add category matches until we have 2 promises
    for (const match of categoryMatches) {
      if (related.length >= 2) break;
      related.push(match);
    }
    
    return related.slice(0, 2);
  };

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
    relatedPromises: findRelatedPromises(ind)
  }));

  return (
    <div className="min-h-screen">
      <SEO 
        title="Policy Indicators Dashboard | Mamdani Tracker"
        description="Track key NYC performance indicators measuring the impact of Mayor Zohran Mamdani's policies. Data on housing, education, transportation, and more with verified sources."
        keywords="NYC data, city metrics, NYC housing data, NYC performance indicators, NYC policy metrics, Mamdani administration"
        canonical="https://mamdanitracker.nyc/indicators"
      />
      
      {/* Hero Section */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-5 lg:px-6 py-5">
        <div className="border-t-4 border-[#0C2788] pt-4 mb-3">
          <h1 className="font-bold text-black tracking-tight" style={{ fontSize: '40px' }}>
            NYC Performance Indicators
          </h1>
        </div>
        <p className="text-base max-w-3xl" style={{ color: '#374151' }}>
          Key metrics and figures that help track how Mayor Zohran Mamdani's promises and policies are implemented.
        </p>
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