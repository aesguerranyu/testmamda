import { MembershipForm } from "@/components/public/MembershipForm";
import { SEO } from "@/components/SEO";
import { StructuredData } from "@/components/StructuredData";

export default function Membership() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Membership - Mamdani Tracker"
        description="Join Mamdani Tracker for updates on NYC Mayor Zohran Mamdani's promises and actions. Membership is free."
        keywords="Mamdani Tracker membership, Zohran Mamdani, NYC politics, government transparency"
      />
      <StructuredData type="website" />

      {/* Hero Section */}
      <header className="container mx-auto max-w-7xl px-4 sm:px-5 lg:px-6 py-5">
        <div className="border-t-4 border-[#0C2788] pt-4 mb-3">
          <h1 className="font-bold text-black tracking-tight" style={{ fontSize: "40px" }}>
            Become a Member
          </h1>
        </div>
        <p className="text-base max-w-3xl" style={{ color: "#374151" }}>
          Be part of the exciting public interest project tracking changes in NYC.
          Membership is free and focused on transparency.
        </p>
      </header>

      <main>
        {/* Why Join Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Join?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-start gap-3 p-4 bg-white border-2 border-gray-200">
              <span className="text-gray-600 text-sm">
                Track the mayor's commitments and agenda items in one place
              </span>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white border-2 border-gray-200">
              <span className="text-gray-600 text-sm">
                See what has changed and what evidence supports it
              </span>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white border-2 border-gray-200">
              <span className="text-gray-600 text-sm">
                Membership is free and focused on transparency
              </span>
            </div>
          </div>

          {/* Form */}
          <div id="membership-form">
            <MembershipForm />
          </div>
        </section>
      </main>
    </div>
  );
}

