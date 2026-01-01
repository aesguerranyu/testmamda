import { Link } from "react-router-dom";

export function PublicFooter() {
  return (
    <footer className="bg-subway-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Branding */}
          <div>
            <h3 className="text-2xl font-bold tracking-wide mb-4">Mamdani Tracker</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Tracking NYC Mayor Zohran Mamdani's promises and actions
            </p>
            <a
              href="mailto:hello@mamdanitracker.nyc"
              className="text-white font-bold text-sm tracking-wide hover:opacity-70 transition-opacity"
            >
              hello@mamdanitracker.nyc
            </a>
          </div>

          {/* Middle Column - Quick Links */}
          <div>
            <h4 className="text-lg font-bold tracking-wide uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: "/promises", label: "Promises & Agenda" },
                { to: "/first100days", label: "First 100 Days" },
                { to: "/indicators", label: "Key Performance Indicators" },
                { to: "/methodology", label: "About & Methodology" },
                { to: "/membership", label: "Become a Member" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/70 hover:text-white transition-opacity text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - About */}
          <div>
            <h4 className="text-lg font-bold tracking-wide uppercase mb-4">About This Project</h4>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Mamdani Tracker is an independent, non-partisan public-interest website that helps
              New Yorkers hold Mayor Zohran Mamdani accountable by tracking his campaign promises,
              policy positions, and mayoral actions.
            </p>
            <p className="text-white/50 text-xs">
              Not affiliated with any campaign, political party, or government office.
            </p>
          </div>
        </div>

        {/* Bottom Bar with Subway Train */}
        <div className="mt-12 pt-8 border-t border-white/20">
          {/* Subway Train Animation */}
          <div className="relative h-8 mb-6 overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30" />
            <div className="animate-subway-train flex gap-0.5">
              {[1, 2, 3, 4, 5, 6].map((car) => (
                <div
                  key={car}
                  className="w-12 h-6 bg-subway-blue rounded-sm flex items-center justify-center border border-white/30"
                >
                  <div className="flex gap-1">
                    <div className="w-1.5 h-2 bg-white/60 rounded-sm" />
                    <div className="w-1.5 h-2 bg-white/60 rounded-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-white/50 text-xs">
              © {new Date().getFullYear()} Mamdani Tracker. All rights reserved.
            </p>
            <p className="text-white/50 text-xs">Made for New Yorkers, by New Yorkers</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
