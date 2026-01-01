export default function Methodology() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-subway-blue mb-8">
          About & Methodology
        </h1>

        <div className="space-y-8">
          <section className="bg-white border-2 border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-subway-dark mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Mamdani Tracker is an independent, non-partisan public-interest project dedicated to
              holding Mayor Zohran Mamdani accountable by tracking his campaign promises, policy
              positions, and mayoral actions. We believe in transparency and providing New Yorkers
              with accurate, sourced information.
            </p>
          </section>

          <section className="bg-white border-2 border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-subway-dark mb-4">How We Track Promises</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-subway-blue font-bold text-lg">1.</span>
                <p className="text-gray-600 leading-relaxed">
                  <strong>Collection:</strong> We gather promises from official campaign materials,
                  speeches, debates, and public statements.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-subway-blue font-bold text-lg">2.</span>
                <p className="text-gray-600 leading-relaxed">
                  <strong>Verification:</strong> Each promise is verified with primary sources and
                  documented with links to original materials.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-subway-blue font-bold text-lg">3.</span>
                <p className="text-gray-600 leading-relaxed">
                  <strong>Status Updates:</strong> We monitor official actions, legislation, and
                  policy changes to update promise statuses.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-subway-blue font-bold text-lg">4.</span>
                <p className="text-gray-600 leading-relaxed">
                  <strong>Transparency:</strong> All sources are cited and publicly accessible.
                </p>
              </li>
            </ul>
          </section>

          <section className="bg-white border-2 border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-subway-dark mb-4">Status Definitions</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span
                  className="px-4 py-2 text-white font-bold uppercase tracking-wide text-xs"
                  style={{ backgroundColor: "#A7A9AC" }}
                >
                  Not Started
                </span>
                <p className="text-gray-600 text-sm">No action has been taken on this promise.</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className="px-4 py-2 text-white font-bold uppercase tracking-wide text-xs"
                  style={{ backgroundColor: "#0039A6" }}
                >
                  In Progress
                </span>
                <p className="text-gray-600 text-sm">Active steps are being taken toward this promise.</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className="px-4 py-2 text-white font-bold uppercase tracking-wide text-xs"
                  style={{ backgroundColor: "#00933C" }}
                >
                  Completed
                </span>
                <p className="text-gray-600 text-sm">This promise has been fully fulfilled.</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className="px-4 py-2 text-white font-bold uppercase tracking-wide text-xs"
                  style={{ backgroundColor: "#EE352E" }}
                >
                  Stalled
                </span>
                <p className="text-gray-600 text-sm">Progress has stopped or reversed on this promise.</p>
              </div>
            </div>
          </section>

          <section className="bg-white border-2 border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-subway-dark mb-4">Independence</h2>
            <p className="text-gray-600 leading-relaxed">
              Mamdani Tracker is not affiliated with any campaign, political party, or government
              office. We do not accept funding from political organizations. Our work is supported
              by our community members and independent donors who believe in transparent civic
              engagement.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
