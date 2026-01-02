import { SEO } from "../../components/SEO";
import { actions } from "../../data/mockData";

export function Actions() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const sortedActions = [...actions].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-5 py-5" style={{ maxWidth: '56rem' }}>
      <SEO 
        title="Actions Timeline - Mamdani Tracker | NYC Mayor Legislative Actions"
        description="Chronological record of every legislative action, statement, and policy decision made by NYC Mayor Zohran Mamdani. Track executive orders, appointments, votes, and public statements with verified sources."
        keywords="Zohran Mamdani actions, NYC mayor executive orders, mayoral decisions, NYC legislative actions, policy timeline, mayoral statements, NYC government actions"
      />
      <div className="mb-5">
        <div className="border-t-4 border-[#0C2788] pt-4 mb-3">
          <h1 className="font-bold text-black tracking-tight" style={{ fontSize: '40px' }}>Actions Timeline</h1>
        </div>
        <p className="text-base max-w-3xl" style={{ color: '#374151' }}>
          Chronological record of every move, statement, and decision.
        </p>
      </div>

      {sortedActions.length === 0 ? (
        <div className="text-center py-5 bg-white shadow-sm border" style={{ borderColor: '#E5E7EB' }}>
          <p className="text-lg text-gray-600 mb-0">No actions recorded yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedActions.map((action) => (
            <div key={action.id} className="bg-white border-2 border-gray-300 p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-2 bg-[#0C2788] text-white font-bold uppercase tracking-wide text-xs">
                  {action.type}
                </span>
                <span className="text-sm text-gray-600 font-bold">
                  {formatDate(action.date)}
                </span>
              </div>
              <p className="text-base text-gray-600 leading-relaxed m-0">{action.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Actions;
