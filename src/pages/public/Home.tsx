import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon,
  FlagIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { getLatestUpdates, promises } from "../../data/mockData";
import { MembershipForm } from "../../components/MembershipForm";
import { PromiseCard } from "../../components/PromiseCard";
import { SEO } from "../../components/SEO";
import { StructuredData } from "../../components/StructuredData";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function PageContainer({ children }: { children: React.ReactNode }) {
  // Use a single consistent container everywhere. Adjust max width and padding to match Figma.
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10 text-center">
      <div className="mb-2">
        <h2
          className="inline text-3xl font-black uppercase tracking-wide sm:text-4xl"
          style={{ color: "#071B5E" }}
        >
          {title}
        </h2>
      </div>
      {subtitle ? (
        <p className="text-base text-gray-600 sm:text-lg">{subtitle}</p>
      ) : null}
    </div>
  );
}

const exploreCards = [
  {
    to: "/promises",
    icon: FlagIcon,
    title: "Promises",
    description: "Track every commitment with verified sources and status updates",
  },
  {
    to: "/first100days",
    icon: ClockIcon,
    title: "First 100 Days",
    description: "Monitor progress and priorities in the critical early period",
  },
  {
    to: "/indicators",
    icon: ChartBarIcon,
    title: "Key Performance Indicators",
    description: "NYC data and metrics that show real impact on New Yorkers",
  },
  {
    to: "/methodology",
    icon: DocumentTextIcon,
    title: "About",
    description: "How we verify, source, and maintain independence",
  },
  {
    to: "/membership",
    icon: UserGroupIcon,
    title: "Membership",
    description: "Join our community and support independent civic tracking",
  },
];

export default function Home() {
  const latestUpdates = getLatestUpdates(5);

  return (
    <div className="bg-white">
      <SEO
        title="Mamdani Tracker | Tracking Promises to New Yorkers"
        description="An independent, public interest record tracking Mayor Zohran Mamdani's promises and agenda"
      />
      <StructuredData type="WebSite" data={{ name: "Mamdani Tracker" }} />

      {/* Hero */}
      <section
        className="flex min-h-screen items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(7,27,94,0.85), rgba(7,27,94,0.95)), url('https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1920&q=80')`,
        }}
      >
        <PageContainer>
          <div className="py-20 text-center">
            <h1
              className="mb-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ lineHeight: 1.1 }}
            >
              Tracking big promises <br />to New Yorkers
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80 sm:text-xl">
              An independent, public interest record tracking Mayor Zohran
              Mamdani's promises and agenda
            </p>

            <div>
              <button
                onClick={() => scrollToId("promises-section")}
                className="cursor-pointer border-0 bg-[#0C2788] px-5 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white transition-all hover:scale-105 hover:bg-[#1436B3]"
              >
                Start Tracking
              </button>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Promises */}
      <section id="promises-section" className="bg-gray-50 py-16 sm:py-20">
        <PageContainer>
          <SectionTitle
            title="Promises and Agenda"
            subtitle="Every promise tracked and verified with sources"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {promises.map((promise) => (
              <PromiseCard key={promise.id} promise={promise} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/promises"
              onClick={() => window.scrollTo(0, 0)}
              className="group inline-flex items-center gap-2 text-lg font-bold uppercase tracking-wide text-black no-underline transition-colors hover:text-blue-600"
            >
              View All Promises
              <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Explore */}
      <section className="bg-white py-16 sm:py-20">
        <PageContainer>
          <SectionTitle title="Explore the Tracker" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exploreCards.map((card, index) => (
              <Link
                key={index}
                to={card.to}
                onClick={() => window.scrollTo(0, 0)}
                className="group block h-full bg-white p-5 no-underline transition-all hover:border-blue-600"
                style={{
                  borderWidth: 2,
                  borderStyle: "solid",
                  borderColor: "#7F97E6",
                  color: "rgba(7,27,94,0.85)",
                }}
              >
                <div className="flex h-full flex-col">
                  <card.icon className="mb-4 h-10 w-10 text-[#1E3A8A]" />
                  <h3 className="mb-2 text-lg font-bold uppercase tracking-wide transition-colors group-hover:text-blue-600">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {card.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Latest Updates */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <PageContainer>
          <SectionTitle title="Latest Updates" />

          <div className="mx-auto max-w-3xl space-y-4">
            {latestUpdates.map((item) => (
              <div
                key={item.id}
                className="border-l-4 border-[#1E3A8A] bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center gap-3">
                  <span
                    className="px-2 py-1 text-xs font-bold uppercase tracking-wide text-white"
                    style={{
                      backgroundColor:
                        item.type === "promise" ? "#1E3A8A" : "#22C55E",
                    }}
                  >
                    {item.type === "promise" ? "Promise" : "Action"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(item.date)}
                  </span>
                </div>

                {item.type === "promise" ? (
                  <p className="font-bold text-gray-900">{item.headline}</p>
                ) : (
                  <p className="text-gray-700">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Membership */}
      <section className="bg-white py-16 sm:py-20">
        <PageContainer>
          <SectionTitle
            title="Become a Member. It's free!"
            subtitle="Be part of the exciting public interest project tracking changes in NYC."
          />
          <MembershipForm />
        </PageContainer>
      </section>
    </div>
  );
}
