import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
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

export default function PromisesList() {
  const [promises, setPromises] = useState<PublicPromise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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

  // Get unique categories and statuses
  const categories = [...new Set(promises.map((p) => p.category).filter(Boolean))];
  const statuses = [...new Set(promises.map((p) => p.status).filter(Boolean))];

  // Filter promises
  const filteredPromises = promises.filter((p) => {
    const matchesSearch =
      !search ||
      p.headline.toLowerCase().includes(search.toLowerCase()) ||
      p.short_description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const hasFilters = search || categoryFilter || statusFilter;

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setStatusFilter("");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-subway-blue mb-4">
            Promises & Agenda
          </h1>
          <p className="text-gray-600 text-lg">
            {filteredPromises.length} promise{filteredPromises.length !== 1 ? "s" : ""} tracked
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border-2 border-gray-200 p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search promises..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 border-2 border-gray-300"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-12 px-4 border-2 border-gray-300 bg-white text-sm min-w-[160px]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 px-4 border-2 border-gray-300 bg-white text-sm min-w-[140px]"
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="h-12 px-4 border-2 border-gray-300 bg-white hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Promises Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-subway-blue"></div>
          </div>
        ) : filteredPromises.length === 0 ? (
          <div className="text-center py-12 bg-white border-2 border-gray-200">
            <p className="text-gray-500">
              {promises.length === 0
                ? "No published promises yet."
                : "No promises match your filters."}
            </p>
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
