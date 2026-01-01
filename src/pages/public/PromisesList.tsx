import { useEffect, useState } from "react";
import { PromiseCard } from "@/components/public/PromiseCard";
import { supabase } from "@/integrations/supabase/client";

interface PublicPromise {
  id: string;
  headline: string;
  short_description: string;
  category: string;
  status: string;
  updated_at: string;
}

type PromiseStatus = "All" | "Not started" | "In progress" | "Completed" | "Stalled" | "Broken";
type PromiseCategory = "All" | "Housing" | "Transportation" | "Education" | "Healthcare" | "Environment" | "Economic Justice" | "Public Safety" | "Government Reform";

export default function PromisesList() {
  const [promises, setPromises] = useState<PublicPromise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<PromiseStatus>("All");
  const [selectedCategory, setSelectedCategory] = useState<PromiseCategory>("All");

  const statuses: PromiseStatus[] = ["All", "Not started", "In progress", "Completed", "Stalled"];
  const categories: PromiseCategory[] = [
    "All",
    "Housing",
    "Transportation",
    "Education",
    "Healthcare",
    "Environment",
    "Economic Justice",
    "Public Safety",
    "Government Reform"
  ];

  useEffect(() => {
    const fetchPromises = async () => {
      const { data, error } = await supabase
        .from("promises")
        .select("id, headline, short_description, category, status, updated_at")
        .eq("editorial_state", "published")
        .order("updated_at", { ascending: false });

      if (!error && data) {
        setPromises(data);
      }
      setIsLoading(false);
    };

    fetchPromises();
  }, []);

  const filteredPromises = promises.filter((p) => {
    const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesStatus && matchesCategory;
  });

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-subway-blue text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            Promise Tracker
          </h1>
          <p className="text-lg text-white/90 font-medium">
            Every commitment. Every detail. Every source. No spin.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card border-2 border-border p-6 mb-8">
          {/* Status Filter */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Filter by Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
                    selectedStatus === status
                      ? "bg-subway-blue text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Filter by Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
                    selectedCategory === category
                      ? "bg-subway-blue text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground font-medium">
              Showing {filteredPromises.length} of {promises.length} promises
            </p>
          </div>
        </div>

        {/* Promises Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-subway-blue"></div>
          </div>
        ) : filteredPromises.length === 0 ? (
          <div className="text-center py-12 bg-card border-2 border-border">
            <p className="text-lg font-bold text-foreground mb-4">
              No promises match your filters.
            </p>
            <button
              onClick={() => {
                setSelectedStatus("All");
                setSelectedCategory("All");
              }}
              className="px-4 py-2 bg-subway-blue text-white hover:bg-subway-blue/90 transition-all font-bold uppercase tracking-wide text-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromises.map((promise) => (
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
      </div>
    </div>
  );
}
