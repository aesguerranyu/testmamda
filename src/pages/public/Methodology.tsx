import { Link } from "react-router-dom";
import { SEO } from "../../components/SEO";
import { MagnifyingGlassIcon, ArrowPathIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export function Methodology() {
  return (
    <div className="min-h-screen">
      <SEO
        title="About - Mamdani Tracker | How We Track NYC Mayor"
        description="Learn about Mamdani Tracker's methodology for tracking campaign promises and mayoral actions. Independent, non-partisan research with transparent sourcing and verification processes."
        keywords="political accountability methodology, fact checking process, independent research, NYC political tracking, promise verification, source transparency, non-partisan tracker"
      />

      <div className="container mx-auto max-w-5xl px-6 sm:px-8 lg:px-12 py-8">
        {/* What is Mamdani Tracker */}
        <section className="mb-8">
          <div className="border-t-4 border-[#0C2788] pt-5 mb-5">
            <h1 className="font-bold text-black tracking-tight" style={{ fontSize: "28px" }}>
              <span className="hidden md:inline" style={{ fontSize: "32px" }}>
                What is Mamdani Tracker?
              </span>
              <span className="md:hidden">What is Mamdani Tracker?</span>
            </h1>
          </div>
          <div className="max-w-4xl pl-4 md:pl-6">
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Mayor Zohran Mamdani made big promises to New Yorkers. His message on affordability and governance
              resonated not only across New York City, but around the world. Now, as he takes office, it is time for him
              and his team to deliver, in a complex political environment with real-world constraints and consequences.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Mamdani Tracker is a public-interest record that brings those promises together in one place and tracks
              what happens next. We document what was said, what actions follow, and how those commitments move forward
              over time, using publicly available sources.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              We aim to help New Yorkers understand what's happening around them and to hold the Mamdani administration
              accountable to its stated promises.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our goal is to build a definitive public record of changes in New York City. We invite New Yorkers from
              all backgrounds to take part in building this public good.
            </p>
          </div>
        </section>

        {/* The Team */}
        <section className="mb-8">
          <div className="border-t-4 border-[#0C2788] pt-5 mb-5">
            <h2 className="font-bold text-black tracking-tight" style={{ fontSize: "28px" }}>
              <span className="hidden md:inline" style={{ fontSize: "32px" }}>
                The Team
              </span>
              <span className="md:hidden">The Team</span>
            </h2>
          </div>
          <div className="flex flex-col gap-8 max-w-4xl pl-4 md:pl-6">
            {/* Anthony Esguerra */}
            <div>
              <h3 className="font-bold text-black text-lg mb-1">Anthony Esguerra</h3>
              <p className="text-gray-600 font-medium uppercase tracking-wide text-xs mb-3">
                Founder and Executive Editor
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-3">
                Anthony is a journalist and newsroom leader specializing in audience engagement, content strategy, and
                innovation. Most recently, he served as Head of Audience Engagement at BenarNews, part of Radio Free
                Asia, where he led audience strategy across Malaysia, Indonesia, Thailand, the Philippines, Bangladesh,
                and the Pacific region. As a multimedia journalist, he has reported on some of Southeast Asia's defining
                political and social issues, including as a reporter for VICE World News, and previously reported on TV
                at GMA News and as a multimedia reporter and social media editor at INQUIRER.net.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Anthony holds a master's degree in media innovation from New York University and lives in the city.
                Outside the newsroom, he loves Broadway, choral music, and long walks around the city. One long-term
                dream is to take his favorite Filipino choir to perform at Carnegie Hall.
              </p>
            </div>

            {/* Cha Crisostomo */}
            <div>
              <h3 className="font-bold text-black text-lg mb-1">Cha Crisostomo</h3>
              <p className="text-gray-600 font-medium uppercase tracking-wide text-xs mb-3">Co-Founder and Data Lead</p>
              <p className="text-lg text-gray-600 leading-relaxed mb-3">
                Cha is an economist focused on how technology, data, and policy intersect in real life. Her work looks
                at how tools like AI, green technologies, and digital platforms are adopted, and how they can be used to
                improve public decision-making and governance. She has worked on evaluating program effectiveness for
                international development institutions, including the Asian Development Bank and the Organisation for
                Economic Co-operation and Development. She has investigated program design and effectiveness in emerging
                markets. She holds a PhD in economics from the University of the Philippines.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                At Mamdani Tracker, Cha leads data research and methodology, helping shape how promises are defined,
                tracked, and measured over time. Outside of work, she likes to sing, bake while watching The Great
                British Baking Show, and spend weeknights thinking about better ways to measure whether policies are
                delivering what they claim.
              </p>
            </div>

            {/* Geli Juani */}
            <div>
              <h3 className="font-bold text-black text-lg mb-1">Geli Juani</h3>
              <p className="text-gray-600 font-medium uppercase tracking-wide text-xs mb-3">
                Co-Founder and Research Editor
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-3">
                Geli is a policy and quantitative analyst based in New York City. Her work sits at the intersection of
                technology and geoeconomics, with research spanning artificial intelligence and energy systems,
                cybersecurity, and global economic governance. She has experience tracking and analyzing
                competitiveness, investment climate, global value chains, and labor and poverty indicators, including
                through work on Arangkada Philippines and with multilateral institutions such as the Asian Development
                Bank and the World Bank. She holds a master's degree in economics from the University of the Philippines
                and a master's degree in global human development from Georgetown University.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Outside her day job, Geli helps build and maintain the Mamdani Tracker, contributing research,
                verification, and updates. In her spare time, she enjoys reading, creative writing, cooking, and long
                walks around the city.
              </p>
            </div>

            {/* Erwin Daez */}
            <div>
              <h3 className="font-bold text-black text-lg mb-1">Erwin Daez</h3>
              <p className="text-gray-600 font-medium uppercase tracking-wide text-xs mb-3">Co-Founder and Tech Lead</p>
              <p className="text-lg text-gray-600 leading-relaxed">[bio pending]</p>
            </div>
          </div>
        </section>

        {/* What Is a Promise */}
        <section className="mb-8">
          <div className="border-t-4 border-[#0C2788] pt-5 mb-5">
            <h2 className="font-bold text-black tracking-tight" style={{ fontSize: "28px" }}>
              <span className="hidden md:inline" style={{ fontSize: "32px" }}>
                What Is a Promise?
              </span>
              <span className="md:hidden">What Is a Promise?</span>
            </h2>
          </div>
          <div className="max-w-4xl pl-4 md:pl-6">
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              We define a promise as something Mayor Zohran Mamdani or his team said they would do.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              More specifically, a promise is an observable and trackable policy commitment or goal that has been
              publicly stated through official and verifiable channels, including:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li className="text-lg text-gray-600">Campaign platforms and written policy documents</li>
              <li className="text-lg text-gray-600">Legislative proposals or formal co-sponsorships</li>
              <li className="text-lg text-gray-600">
                Public statements during the campaign, at official events, or in media interviews
              </li>
              <li className="text-lg text-gray-600">
                Written positions in official publications or verified social media accounts
              </li>
            </ul>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Some promises tracked on this site are broad goals. Others are more granular actions needed to carry out a
              larger commitment. In some cases, smaller actions support or build toward a bigger promise.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Over time, we plan to improve the design to better show these relationships.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We do not track vague aspirations without a clear commitment.
            </p>
          </div>
        </section>

        {/* Promise Status System */}
        <section className="mb-8">
          <div className="border-t-4 border-[#0C2788] pt-5 mb-5">
            <h2 className="font-bold text-black tracking-tight" style={{ fontSize: "28px" }}>
              <span className="hidden md:inline" style={{ fontSize: "32px" }}>
                Promise Status System
              </span>
              <span className="md:hidden">Promise Status System</span>
            </h2>
          </div>
          <div className="max-w-4xl pl-4 md:pl-6">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Each promise is assigned one status based on publicly available evidence.
            </p>

            <div className="flex flex-col gap-4">
              {[
                {
                  status: "Not started",
                  color: "#6B7280",
                  desc: "No public action has been taken toward implementation.",
                },
                {
                  status: "In progress",
                  color: "#0039A6",
                  desc: "Public steps are underway, such as hearings, public consultations, pilot programs, or administrative action.",
                },
                {
                  status: "Completed",
                  color: "#00933C",
                  desc: "The policy has been carried out through legislation, regulation, or a program launch.",
                },
                {
                  status: "Stalled",
                  color: "#FCCC0A",
                  desc: "Progress has paused because of legal, political, or practical obstacles.",
                },
                {
                  status: "Not delivered",
                  color: "#EE352E",
                  desc: "The promise has not been fulfilled or appears to have been abandoned.",
                },
              ].map((item) => (
                <div key={item.status}>
                  <div className="flex items-start gap-4">
                    <span
                      className="px-4 py-2 text-white font-bold uppercase tracking-wide text-sm shrink-0"
                      style={{ backgroundColor: item.color, color: item.status === "Stalled" ? "#000" : "#fff" }}
                    >
                      {item.status}
                    </span>
                    <p className="text-lg text-gray-600 m-0 pt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Methodology;
