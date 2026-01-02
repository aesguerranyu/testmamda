import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PromiseCard } from "@/components/public/PromiseCard";
import { SEO } from "@/components/SEO";

interface Promise {
  id: string;
  headline: string;
  short_description: string;
  category: string;
  status: string;
  url_slugs: string;
  seo_tags: string;
}

export default function PromisesByTag() {
  const { tag } = useParams<{ tag: string }>();
  const [promises, setPromises] = useState<Promise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const decodedTag = tag ? decodeURIComponent(tag) : "";

  useEffect(() => {
    const fetchPromises = async () => {
      if (!decodedTag) return;

      const { data, error } = await supabase
        .from("promises")
        .select("id, headline, short_description, category, status, url_slugs, seo_tags")
        .eq("editorial_state", "published");

      if (!error && data) {
        // Filter promises that contain this tag
        const filtered = data.filter((p) => {
          const tags = p.seo_tags
            ? p.seo_tags.split(",").map((t: string) => t.trim().toLowerCase())
            : [];
          return tags.includes(decodedTag.toLowerCase());
        });
        setPromises(filtered);
      }
      setIsLoading(false);
    };

    fetchPromises();
  }, [decodedTag]);

  return (
    <div className="bg-white min-h-screen">
      <SEO
        title={`Promises tagged "${decodedTag}" | Mamdani Tracker`}
        description={`View all mayoral promises tagged with "${decodedTag}".`}
      />

      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <Link
            to="/promises"
            className="inline-flex items-center gap-2 text-subway-dark hover:text-subway-blue transition-colors font-bold uppercase tracking-wide text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            All Promises
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-subway-blue text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Tag: {decodedTag}
          </h1>
          <p className="text-white/80">
            {promises.length} promise{promises.length !== 1 ? "s" : ""} tagged with "{decodedTag}"
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-subway-blue"></div>
          </div>
        ) : promises.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 border-2 border-gray-200">
            <p className="text-gray-500 text-lg">No promises found with this tag.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {promises.map((promise) => (
              <PromiseCard
                key={promise.id}
                id={promise.id}
                headline={promise.headline}
                shortDescription={promise.short_description}
                category={promise.category}
                status={promise.status}
                slug={promise.url_slugs}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
