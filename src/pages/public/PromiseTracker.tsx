import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { SEO } from "../../components/SEO";
import { PromiseCard } from "../../components/public/PromiseCard";
import { supabase } from "@/integrations/supabase/client";
type PromiseStatus = "Not started" | "In progress" | "Completed" | "Stalled" | "Broken";
type PromiseCategory = "Affordability" | "Childcare" | "Climate" | "Education" | "Housing" | "Transportation";
interface PromiseData {
  id: string;
  headline: string;
  short_description: string;
  category: string;
  status: string;
  url_slugs: string;
}
export function PromiseTracker() {
  const [promises, setPromises] = useState<PromiseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<PromiseStatus | "All">("All");
  const [selectedCategory, setSelectedCategory] = useState<PromiseCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const fetchPromises = async () => {
      const {
        data,
        error
      } = await supabase.from("promises").select("id, headline, short_description, category, status, url_slugs").eq("editorial_state", "published");
      if (!error && data) {
        setPromises(data);
      }
      setIsLoading(false);
    };
    fetchPromises();
  }, []);
  const statuses: (PromiseStatus | "All")[] = ["All", "Not started", "In progress", "Completed", "Stalled", "Broken"];
  const categories: (PromiseCategory | "All")[] = ["All", "Affordability", "Childcare", "Climate", "Education", "Housing", "Transportation"];
  const filteredPromises = promises.filter(promise => {
    const matchesStatus = selectedStatus === "All" || promise.status === selectedStatus;
    const matchesCategory = selectedCategory === "All" || promise.category === selectedCategory;
    const matchesSearch = searchQuery === "" || promise.headline.toLowerCase().includes(searchQuery.toLowerCase()) || promise.short_description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Map database fields to PromiseCard expected format
  const mappedPromises = filteredPromises.map(p => ({
    id: p.id,
    headline: p.headline,
    shortDescription: p.short_description,
    category: p.category,
    status: p.status,
    slug: p.url_slugs
  }));
  if (isLoading) {
    return <div className="container mx-auto max-w-7xl px-4 sm:px-5 lg:px-6 py-5">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0C2788]"></div>
        </div>
      </div>;
  }
  return <div className="container mx-auto max-w-7xl px-4 sm:px-5 lg:px-6 py-5">
      <SEO title="Promise Tracker - Mamdani Tracker | NYC Mayor Campaign Promises" description="Track every campaign promise made by NYC Mayor Zohran Mamdani. Filter by status (in progress, completed, stalled) and category (housing, transportation, education, healthcare, and more). Every commitment tracked with verified sources." keywords="Zohran Mamdani promises, NYC mayor promises, campaign promises tracker, NYC housing policy, NYC transportation, mayoral accountability, political promise tracking" />
      <div className="mb-5">
        <div className="border-t-4 border-[#0C2788] pt-4 mb-3">
          <h1 className="font-bold text-black tracking-tight" style={{
          fontSize: '40px'
        }}>Promise Tracker</h1>
        </div>
        <p className="text-base max-w-3xl" style={{
        color: '#374151'
      }}>Here is what Mayor Zohran Mamdani and his team have said they will do, organized by policy area. Each entry notes the responsible city agency and whether state action or cooperation is required.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 mb-4">
        {/* Search Bar */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-black uppercase mb-2" style={{
          letterSpacing: '0.1em'
        }}>
            Search Promises
          </label>
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by headline or description..." className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-[#0C2788] transition-colors" style={{
          color: '#374151'
        }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-bold text-black uppercase mb-2" style={{
            letterSpacing: '0.1em'
          }}>
              Filter by Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statuses.map(status => <button key={status} onClick={() => setSelectedStatus(status)} className={`px-3 py-2 text-xs font-bold transition-all border-0 cursor-pointer ${selectedStatus === status ? "bg-[#0C2788] text-white" : "bg-gray-100 hover:bg-[#E9EDFB]"}`} style={selectedStatus !== status ? {
              color: '#374151'
            } : {}}>
                  {status}
                </button>)}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-black uppercase mb-2" style={{
            letterSpacing: '0.1em'
          }}>
              Filter by Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => <button key={category} onClick={() => setSelectedCategory(category)} className={`px-3 py-2 text-xs font-bold transition-all border-0 cursor-pointer ${selectedCategory === category ? "bg-[#0C2788] text-white" : "bg-gray-100 hover:bg-[#E9EDFB]"}`} style={selectedCategory !== category ? {
              color: '#374151'
            } : {}}>
                  {category}
                </button>)}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs font-medium mb-0" style={{
          color: '#374151'
        }}>
            Showing <span className="font-bold text-black">{filteredPromises.length}</span> of <span className="font-bold text-black">{promises.length}</span> promises
          </p>
        </div>
      </div>

      {/* Promise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mappedPromises.map(promise => <PromiseCard key={promise.id} promise={promise} />)}
      </div>

      {filteredPromises.length === 0 && <div className="text-center py-5 bg-white border-4 border-[#0C2788]">
          <p className="text-lg mb-3" style={{
        color: '#374151'
      }}>No promises match your filters.</p>
          <button onClick={() => {
        setSelectedStatus("All");
        setSelectedCategory("All");
        setSearchQuery("");
      }} className="px-4 py-2 bg-[#0C2788] text-white hover:bg-[#1436B3] transition-all font-bold uppercase tracking-wide border-0 cursor-pointer">
            Clear Filters
          </button>
        </div>}
    </div>;
}
export default PromiseTracker;