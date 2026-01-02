import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Building2, Clock, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PromiseDetail {
  id: string;
  headline: string;
  short_description: string;
  description: string;
  category: string;
  status: string;
  date_promised: string;
  owner_agency: string;
  requires_state_action: string;
  source_text: string;
  source_url: string;
  updates: string;
  seo_tags: string;
  last_updated: string;
  updated_at: string;
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

const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    "Not started": "#A7A9AC",
    "In progress": "#0039A6",
    Completed: "#00933C",
    Stalled: "#EE352E",
  };
  return colorMap[status] || "#6B7280";
};

const formatDate = (dateString: string) => {
  if (!dateString) return "Not specified";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

export default function PromiseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [promise, setPromise] = useState<PromiseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatesExpanded, setUpdatesExpanded] = useState(false);

  useEffect(() => {
    const fetchPromise = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from("promises")
        .select("*")
        .eq("url_slugs", slug)
        .eq("editorial_state", "published")
        .maybeSingle();

      if (!error && data) {
        setPromise(data);
      }
      setIsLoading(false);
    };

    fetchPromise();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-subway-blue"></div>
      </div>
    );
  }

  if (!promise) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center bg-white border-2 border-gray-200 p-12">
          <h1 className="text-3xl font-bold text-subway-blue mb-4">Promise Not Found</h1>
          <p className="text-gray-600 mb-8">This promise doesn't exist in our tracker.</p>
          <Link
            to="/promises"
            className="inline-flex items-center gap-2 px-6 py-3 bg-subway-blue text-white font-bold uppercase tracking-wide hover:bg-subway-blue/90 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Tracker
          </Link>
        </div>
      </div>
    );
  }

  // Parse updates if they exist
  const updates = promise.updates ? promise.updates.split("\n").filter((u) => u.trim()) : [];
  
  // Parse description into bullet points
  const descriptionPoints = promise.description
    ? promise.description.split("\n").filter((p) => p.trim())
    : [];

  // Parse SEO tags
  const tags = promise.seo_tags ? promise.seo_tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <div className="bg-white min-h-screen">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link
            to="/promises"
            className="inline-flex items-center gap-2 text-subway-dark hover:text-subway-blue transition-colors font-bold uppercase tracking-wide text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            All Promises
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header Card */}
        <header className="bg-white border-2 border-gray-200 p-6 sm:p-8 mb-6">
          {/* Status badge at top right */}
          <div className="flex justify-end mb-4">
            <span
              className="px-4 py-2 text-white font-bold uppercase tracking-wide text-xs"
              style={{ backgroundColor: getStatusColor(promise.status) }}
            >
              {promise.status}
            </span>
          </div>

          {/* Category with circle */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: getCategoryColor(promise.category) }}
            >
              <span className="text-white font-bold text-xl">{promise.category.charAt(0)}</span>
            </div>
            <span className="text-gray-500 font-bold uppercase tracking-wide text-sm">
              {promise.category}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl font-bold text-subway-blue leading-tight mb-4">
            {promise.headline}
          </h1>

          {/* Short Description */}
          <p className="text-gray-600 leading-relaxed mb-6">{promise.short_description}</p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t-2 border-gray-200">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-subway-blue flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Date Promised
                </div>
                <div className="text-sm font-bold text-subway-dark">
                  {formatDate(promise.date_promised)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-subway-blue flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Owner Agency
                </div>
                <div className="text-sm font-bold text-subway-dark">
                  {promise.owner_agency || "To be determined"}
                </div>
              </div>
            </div>

            {promise.requires_state_action && (
              <div className="flex items-start gap-3 sm:col-span-2">
                <Building2 className="w-5 h-5 text-subway-blue flex-shrink-0 mt-1" />
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Requires State Action
                  </div>
                  <span
                    className="inline-block mt-1 px-3 py-1 text-white font-bold uppercase tracking-wide text-xs"
                    style={{
                      backgroundColor:
                        promise.requires_state_action === "Yes"
                          ? "#EE352E"
                          : promise.requires_state_action === "No"
                          ? "#00933C"
                          : "#6B7280",
                    }}
                  >
                    {promise.requires_state_action}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 pt-4">
            <Clock className="w-4 h-4" />
            <span>Last updated: {formatDate(promise.updated_at)}</span>
          </div>
        </header>

        {/* Description */}
        {descriptionPoints.length > 0 && (
          <section className="bg-white border-2 border-gray-200 p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-bold text-subway-dark mb-4">Overview</h2>
            <ul className="space-y-3">
              {descriptionPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-subway-blue font-bold text-lg flex-shrink-0">•</span>
                  <p className="text-gray-600 leading-relaxed">{point}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Updates Section */}
        <section className="bg-white border-2 border-gray-200 p-6 sm:p-8 mb-6">
          <button
            onClick={() => setUpdatesExpanded(!updatesExpanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-xl font-bold text-subway-dark">Recent Updates</h2>
            {updatesExpanded ? (
              <ChevronUp className="w-6 h-6 text-subway-blue" />
            ) : (
              <ChevronDown className="w-6 h-6 text-subway-blue" />
            )}
          </button>

          {updatesExpanded && (
            <div className="mt-4">
              {updates.length > 0 ? (
                <div className="space-y-3">
                  {updates.map((update, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-subway-blue p-4 bg-gray-50"
                    >
                      <p className="text-gray-600 leading-relaxed">{update}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-gray-50 border-2 border-gray-200">
                  <p className="text-gray-500">No updates yet</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Sources */}
        {(promise.source_text || promise.source_url) && (
          <section className="bg-white border-2 border-gray-200 p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-bold text-subway-dark mb-4">Sources</h2>
            <div className="border-l-4 border-gray-300 pl-4 py-2 hover:border-subway-blue transition-colors">
              {promise.source_url ? (
                <a
                  href={promise.source_url}
                  className="flex items-start gap-2 group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mt-1 text-subway-blue flex-shrink-0" />
                  <span className="text-subway-blue font-bold group-hover:underline">
                    {promise.source_text || promise.source_url}
                  </span>
                </a>
              ) : (
                <p className="text-gray-600">{promise.source_text}</p>
              )}
            </div>
          </section>
        )}

        {/* SEO Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, index) => (
              <Link
                key={index}
                to={`/promises/tag/${encodeURIComponent(tag)}`}
                className="px-3 py-2 font-bold uppercase tracking-wide text-xs hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "#EBF5FF", color: "#0039A6" }}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
