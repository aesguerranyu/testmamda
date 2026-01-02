import { Link } from "react-router-dom";
import { SEO } from "../../components/SEO";
import { MagnifyingGlassIcon, ArrowPathIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export function Methodology() {
  return (
    <div className="min-h-screen">
      <SEO 
        title="About & Methodology - Mamdani Tracker | How We Track NYC Mayor"
        description="Learn about Mamdani Tracker's methodology for tracking campaign promises and mayoral actions. Independent, non-partisan research with transparent sourcing and verification processes."
        keywords="political accountability methodology, fact checking process, independent research, NYC political tracking, promise verification, source transparency, non-partisan tracker"
      />
      
      {/* Hero Section */}
      <div className="bg-[#0C2788] py-5 mb-5">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5">
          <h1 className="font-bold text-white tracking-tight mb-3" style={{ fontSize: '40px' }}>
            <span className="hidden md:inline" style={{ fontSize: '52px' }}>About & Methodology</span>
            <span className="md:hidden">About & Methodology</span>
          </h1>
          <p className="text-white text-lg max-w-3xl opacity-90">
            How we track promises and maintain accountability
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5 pb-5">
        {/* What is Mamdani Tracker */}
        <section className="mb-5">
          <div className="border-t-4 border-[#0C2788] pt-4 mb-4">
            <h2 className="font-bold text-black tracking-tight" style={{ fontSize: '28px' }}>
              <span className="hidden md:inline" style={{ fontSize: '32px' }}>What is Mamdani Tracker?</span>
              <span className="md:hidden">What is Mamdani Tracker?</span>
            </h2>
          </div>
          <div className="max-w-4xl">
            <p className="text-lg text-gray-600 leading-relaxed mb-3">
              Mayor Zohran Mamdani made bold promises to New Yorkers during his campaign. This independent public interest website tracks those promises in one accessible place.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              The site promotes civic transparency and accountability by documenting what was promised and what has happened since. It's designed to make civic information clearer and support informed public engagement with city government.
            </p>
          </div>
        </section>

        {/* The Team */}
        <section className="mb-5">
          <div className="border-t-4 border-[#0C2788] pt-4 mb-4">
            <h2 className="font-bold text-black tracking-tight" style={{ fontSize: '28px' }}>
              <span className="hidden md:inline" style={{ fontSize: '32px' }}>The Team</span>
              <span className="md:hidden">The Team</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            <div className="p-4">
              <h3 className="font-bold text-black text-lg mb-2">Anthony Esguerra</h3>
              <p className="text-gray-600 font-medium uppercase tracking-wide text-xs mb-2">Founder and Executive Editor</p>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-black text-lg mb-2">Angeli Juani</h3>
              <p className="text-gray-600 font-medium uppercase tracking-wide text-xs mb-2">Co-Founder and Research Editor</p>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-black text-lg mb-2">Cha Crisostomo</h3>
              <p className="text-gray-600 font-medium uppercase tracking-wide text-xs mb-2">Co-Founder and Data Lead</p>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-black text-lg mb-2">Erwin Daez</h3>
              <p className="text-gray-600 font-medium uppercase tracking-wide text-xs mb-2">Co-Founder and Technology Lead</p>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-4">
          {/* Definition Section */}
          <section className="bg-white border-2 border-gray-300">
            <div className="bg-[#0C2788] px-4 md:px-5 py-4 flex items-center gap-3">
              <MagnifyingGlassIcon style={{ width: '2rem', height: '2rem' }} className="text-white shrink-0" />
              <h2 className="font-bold text-white m-0" style={{ fontSize: '20px' }}>
                <span className="hidden md:inline" style={{ fontSize: '24px' }}>What Is a Promise?</span>
                <span className="md:hidden">What Is a Promise?</span>
              </h2>
            </div>
            <div className="p-4 md:p-5">
              <div className="bg-[#E9EDFB] border-l-[6px] border-[#0C2788] p-4 mb-4">
                <p className="text-lg leading-relaxed text-black m-0">
                  <strong className="font-bold">We define a promise as something Mayor Zohran Mamdani or his team said they would do.</strong>
                </p>
              </div>
              <p className="text-lg leading-relaxed text-gray-600 mb-4">
                More specifically, a promise is an observable and trackable policy commitment or goal that has been publicly stated through official and verifiable channels, including:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li className="text-base text-gray-600">Campaign platforms and written policy documents</li>
                <li className="text-base text-gray-600">Legislative proposals or formal co-sponsorships</li>
                <li className="text-base text-gray-600">Public statements during the campaign, at official events, or in media interviews</li>
                <li className="text-base text-gray-600">Written positions in official publications or verified social media accounts</li>
              </ul>
              <p className="text-lg leading-relaxed text-gray-600 mb-4">
                Some promises tracked on this site are broad goals. Others are more granular actions needed to carry out a larger commitment. In some cases, smaller actions support or build toward a bigger promise.
              </p>
              <p className="text-lg leading-relaxed text-gray-600 mb-4">
                Over time, we plan to improve the design to better show these relationships.
              </p>
              <div className="bg-[#E9EDFB] border-l-[6px] border-[#0C2788] p-4">
                <p className="text-lg leading-relaxed text-black m-0">
                  <strong className="font-bold">We do not track vague aspirations without a clear commitment.</strong>
                </p>
              </div>
            </div>
          </section>

          {/* Status Labels */}
          <section className="bg-white border-2 border-gray-300">
            <div className="bg-[#0C2788] px-4 md:px-5 py-4 flex items-center gap-3">
              <ArrowPathIcon style={{ width: '2rem', height: '2rem' }} className="text-white shrink-0" />
              <h2 className="font-bold text-white m-0" style={{ fontSize: '20px' }}>
                <span className="hidden md:inline" style={{ fontSize: '24px' }}>Status System</span>
                <span className="md:hidden">Status System</span>
              </h2>
            </div>
            <div className="p-4 md:p-5">
              <p className="text-lg text-gray-600 mb-4">
                Every promise gets one of four statuses based on <strong className="font-bold">publicly available evidence:</strong>
              </p>
              
              <div className="flex flex-col gap-3">
                {[
                  { status: "Not started", color: "#6B7280", desc: "No public action taken toward implementation" },
                  { status: "In progress", color: "#0039A6", desc: "Active steps underway (committee review, pilot programs, etc.)" },
                  { status: "Completed", color: "#00933C", desc: "Policy enacted through legislation, regulation, or program launch" },
                  { status: "Stalled", color: "#EE352E", desc: "Progress halted due to obstacles or lack of support" }
                ].map((item) => (
                  <div key={item.status} className="bg-white border-2 border-gray-300 p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span 
                        className="px-4 py-2 text-white font-bold uppercase tracking-wide text-sm shrink-0"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-base text-gray-600 m-0">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Evidence Standards */}
          <section className="bg-white border-2 border-gray-300">
            <div className="bg-[#0C2788] px-4 md:px-5 py-4 flex items-center gap-3">
              <ShieldCheckIcon style={{ width: '2rem', height: '2rem' }} className="text-white shrink-0" />
              <h2 className="font-bold text-white m-0" style={{ fontSize: '20px' }}>
                <span className="hidden md:inline" style={{ fontSize: '24px' }}>Our Sources</span>
                <span className="md:hidden">Our Sources</span>
              </h2>
            </div>
            <div className="p-4 md:p-5">
              <p className="text-lg text-gray-600 mb-4">
                <strong className="font-bold">Everything is sourced.</strong> No exceptions. We only use:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {[
                  "Official government documents",
                  "Verified official statements",
                  "Credible news reporting",
                  "Public records & agency data"
                ].map((source, idx) => (
                  <div key={idx}>
                    <div className="bg-[#0C2788] p-4">
                      <p className="text-white font-bold m-0 text-base">✓ {source}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#E9EDFB] border-l-[6px] border-[#0C2788] p-4">
                <p className="text-base text-black m-0 leading-relaxed">
                  When sources conflict, we present multiple perspectives with clear attribution. 
                  Every claim links directly to its source.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Methodology;
