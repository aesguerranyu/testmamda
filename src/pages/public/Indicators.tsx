import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    Housing: "#EE352E",
    Transportation: "#0039A6",
    Education: "#00933C",
    Healthcare: "#FF6319",
    Economy: "#FCCC0A",
    Environment: "#6CBE45",
    Safety: "#B933AD",
    "Economic Justice": "#FCCC0A",
    "Public Safety": "#B933AD",
    "Government Reform": "#A7A9AC",
  };
  return colorMap[category] || "#A7A9AC";
};

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

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-subway-blue mb-4">
            Key Performance Indicators
          </h1>
          <p className="text-gray-600 text-lg">
            NYC data and metrics that show real impact on New Yorkers
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-subway-blue"></div>
          </div>
        ) : indicators.length === 0 ? (
          <div className="bg-white border-2 border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-lg">
              Key Performance Indicators will be published soon.
            </p>
            <p className="text-gray-400 mt-2">Check back for data-driven insights.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {indicators.map((indicator) => (
              <div
                key={indicator.id}
                className="bg-white border-2 border-gray-200 p-6 hover:border-subway-blue transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: getCategoryColor(indicator.category) }}
                  >
                    <span className="text-white font-bold">
                      {indicator.category.charAt(0)}
                    </span>
                  </div>
                  <span className="text-gray-500 font-bold uppercase tracking-wide text-xs">
                    {indicator.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-subway-blue mb-3">{indicator.headline}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {indicator.description_paragraph}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                      Target
                    </div>
                    <div className="text-lg font-bold text-subway-green">
                      {indicator.target || "TBD"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                      Current
                    </div>
                    <div className="text-lg font-bold text-subway-blue">
                      {indicator.current || "TBD"}
                    </div>
                  </div>
                </div>

                {indicator.source && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-xs text-gray-400">Source: {indicator.source}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
