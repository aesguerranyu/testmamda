import { SEO } from "../../components/SEO";

// Data will be populated via CMS in the future
const appointments: Array<{
  id: string;
  name: string;
  title: string;
  category: string;
  background: string[];
  dateAppointed: string;
  imageUrl?: string;
  sources: Array<{ title: string; url: string }>;
}> = [];

export function Appointments() {
  const formatDate = (dateString: string) => {
    if (dateString === "TBD" || dateString === "Pending") {
      return dateString;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5 py-5">
      <SEO 
        title="Key Appointments - Mamdani Tracker | NYC Mayor Cabinet & Administration"
        description="Track key appointments to NYC Mayor Zohran Mamdani's administration. See who's been appointed to cabinet positions, their backgrounds, qualifications, and what these choices signal about policy priorities."
        keywords="Zohran Mamdani appointments, NYC mayor cabinet, mayoral appointments, NYC administration, city hall appointments, commissioner appointments, NYC government officials"
      />
      {/* Header */}
      <div className="mb-5">
        <div className="border-t-4 border-[#0C2788] pt-4 mb-3">
          <h1 className="font-bold text-black tracking-tight" style={{ fontSize: '40px' }}>Key Appointments</h1>
        </div>
        <p className="text-base max-w-3xl" style={{ color: '#374151' }}>
          Tracking who's been appointed to key positions in the administration, their backgrounds, and what these choices signal about policy priorities.
        </p>
      </div>

      {appointments.length === 0 && (
        <div className="text-center py-5 bg-white border-2 border-gray-300">
          <p className="text-lg text-gray-600 mb-0">No appointments recorded yet.</p>
        </div>
      )}
    </div>
  );
}
