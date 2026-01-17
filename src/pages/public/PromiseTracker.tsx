import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { SEO } from "../../components/SEO";
import { PromiseCard } from "../../components/public/PromiseCard";
import { supabase } from "@/integrations/supabase/client";

type PromiseStatus = "Not started" | "In progress" | "Completed" | "Stalled" | "Broken";

// Status colors matching NYC Subway aesthetic
const STATUS_COLORS: Record<PromiseStatus, string> = {
  "Completed": "#00933C",     // Green (4/5/6)
  "In progress": "#0039A6",   // Blue (A/C/E)
  "Stalled": "#EE352E",       // Red (1/2/3)
  "Not started": "#A7A9AC",   // Gray (L/S)
  "Broken": "#996633",        // Brown (J/Z)
};
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
        // Shuffle promises randomly for variety on each visit
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setPromises(shuffled);
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

  // Calculate status stats from ALL promises (not filtered)
  const statusStats = useMemo(() => {
    const stats: Record<PromiseStatus, number> = {
      "Not started": 0,
      "In progress": 0,
      "Completed": 0,
      "Stalled": 0,
      "Broken": 0,
    };
    
    promises.forEach(p => {
      const status = p.status as PromiseStatus;
      if (stats.hasOwnProperty(status)) {
        stats[status]++;
      }
    });
    
    return stats;
  }, [promises]);

  const totalPromises = promises.length;

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
      <SEO 
        title="Campaign Promises Tracker | Mamdani Tracker" 
        description="Track all of Mayor Zohran Mamdani's campaign promises. Filter by status and category to see which commitments are in progress, completed, or stalled. Every promise documented with verified sources." 
        keywords="Zohran Mamdani promises, NYC mayor promises, campaign promises tracker, NYC housing policy, NYC transportation, mayoral accountability"
        canonical="https://mamdanitracker.nyc/promises"
      />
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

      {/* Stats Dashboard */}
      {/* Gray bordered box with total left, squares right */}
      <div className="border border-gray-300 p-8 mb-6">
        <div className="flex items-center justify-between">
          {/* Left: Total Count */}
          <div>
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: '#6B7280' }}>
              Total Promises Tracked
            </p>
            <p className="text-9xl font-bold leading-none" style={{ color: '#0C2788' }}>
              {totalPromises}
            </p>
          </div>

          {/* Right: Status Squares - all 5 statuses */}
          <div className="flex gap-4">
            {(["Completed", "In progress", "Stalled", "Broken", "Not started"] as PromiseStatus[]).map(status => {
              const count = statusStats[status];
              const percentage = totalPromises > 0 ? Math.round((count / totalPromises) * 100) : 0;
              return (
                <div key={status} className="text-center">
                  <div 
                    className="w-24 h-24 flex items-center justify-center"
                    style={{ backgroundColor: STATUS_COLORS[status] }}
                  >
                    <span className="text-5xl font-bold text-white">{count}</span>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wide mt-2 text-black">
                    {status}
                  </p>
                  <p className="text-lg font-bold" style={{ color: STATUS_COLORS[status] }}>
                    {percentage}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Bar - separate, full width */}
      <div className="h-16 flex border-2 border-black overflow-hidden mb-6">
        {(["Completed", "In progress", "Stalled", "Broken", "Not started"] as PromiseStatus[]).map(status => {
          const count = statusStats[status];
          const percentage = totalPromises > 0 ? (count / totalPromises) * 100 : 0;
          if (percentage === 0) return null;
          return (
            <div
              key={status}
              className="h-full flex items-center justify-center"
              style={{ 
                backgroundColor: STATUS_COLORS[status],
                width: `${percentage}%`
              }}
            >
              <span className="text-sm font-bold uppercase tracking-wide text-white whitespace-nowrap">
                {status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Thick black divider line */}
      <div className="h-1 bg-black mb-8"></div>

      {/* Filters */}
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-bold text-black uppercase mb-3" style={{
            letterSpacing: '0.05em'
          }}>
              Filter by Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statuses.map(status => <button key={status} onClick={() => setSelectedStatus(status)} className={`px-4 py-2 text-sm font-medium transition-all border cursor-pointer uppercase ${selectedStatus === status ? "bg-[#0C2788] text-white border-[#0C2788]" : "bg-gray-100 border-gray-200 hover:bg-gray-200"}`} style={selectedStatus !== status ? {
              color: '#374151'
            } : {}}>
                  {status}
                </button>)}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-bold text-black uppercase mb-3" style={{
            letterSpacing: '0.05em'
          }}>
              Filter by Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 text-sm font-medium transition-all border cursor-pointer uppercase ${selectedCategory === category ? "bg-[#0C2788] text-white border-[#0C2788]" : "bg-gray-100 border-gray-200 hover:bg-gray-200"}`} style={selectedCategory !== category ? {
              color: '#374151'
            } : {}}>
                  {category}
                </button>)}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <label className="block text-sm font-bold text-black uppercase mb-3" style={{
          letterSpacing: '0.05em'
        }}>
            Search Promises
          </label>
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by headline or description..." className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-[#0C2788] transition-colors" style={{
          color: '#374151'
        }} />
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