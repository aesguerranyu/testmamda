import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer 
      className="text-white mt-auto border-t-4 border-white" 
      style={{ backgroundColor: '#394674' }}
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5 py-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* Left Column - Branding */}
          <div>
            <h2 className="font-bold mb-3 text-white" style={{ fontSize: '28px' }}>Mamdani Tracker</h2>
            <p className="text-white mb-3 leading-relaxed text-sm">
              Tracking Mayor Zohran Mamdani's promises and actions in New York City.
            </p>
            <a 
              href="mailto:hello@mamdanitracker.nyc" 
              className="text-white no-underline text-sm font-bold tracking-wide inline-block hover:opacity-70 transition-opacity"
              aria-label="Contact us via email at hello@mamdanitracker.nyc"
            >
              hello@mamdanitracker.nyc
            </a>
          </div>

          {/* Middle Column - Quick Links */}
          <div>
            <nav aria-label="Footer navigation">
              <h3 className="font-bold mb-3 text-lg text-white">Quick Links</h3>
              <ul className="list-none p-0 m-0">
                <li className="mb-2">
                  <Link 
                    to="/promises" 
                    className="text-white no-underline text-sm block hover:opacity-70 transition-opacity"
                  >
                    Promises and Agenda
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/first100days" 
                    className="text-white no-underline text-sm block hover:opacity-70 transition-opacity"
                  >
                    First 100 Days
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/indicators" 
                    className="text-white no-underline text-sm block hover:opacity-70 transition-opacity"
                  >
                    NYC Performance Indicators
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/methodology" 
                    className="text-white no-underline text-sm block hover:opacity-70 transition-opacity"
                  >
                    About
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/membership" 
                    className="text-white no-underline text-sm block hover:opacity-70 transition-opacity"
                  >
                    Become a Member
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Right Column - About */}
          <div>
            <h3 className="font-bold mb-3 text-lg text-white">About This Project</h3>
            <p className="text-white leading-relaxed m-0 text-sm mb-3">
              Mamdani Tracker is an independent, nonpartisan public-interest journalism project built to help New Yorkers follow how the city is governed.
            </p>
            <p className="text-white leading-relaxed m-0 text-sm">
              We are not affiliated with any campaign, political party, or government office. All information is sourced from publicly available records and documents.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-4 md:mt-5 pt-4" style={{ paddingBottom: '20px' }}>
          {/* Train Container with overflow visible */}
          <div className="relative" style={{ overflow: 'visible', minHeight: '40px', marginBottom: '20px' }}>
            {/* Animated Subway Train - ABOVE THE LINE */}
            <div 
              className="subway-train"
              style={{
                position: 'absolute',
                top: '5px',
                left: 0,
                zIndex: 2,
                width: '360px',
                animation: 'train-move 30s linear infinite'
              }}
            >
              {/* 6-Car Subway Train */}
              <svg width="360" height="26" viewBox="0 0 360 26" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.6, display: 'block' }}>
                {/* Car 1 */}
                <g>
                  <rect x="1" y="5" width="52" height="18" fill="none" stroke="#fff" strokeWidth="1"/>
                  <rect x="4" y="7" width="10" height="11" fill="#fff" opacity="0.3"/>
                  <rect x="17" y="7" width="14" height="11" fill="#fff" opacity="0.3"/>
                  <rect x="34" y="7" width="10" height="11" fill="#fff" opacity="0.3"/>
                  <circle cx="10" cy="24" r="1.5" fill="#fff"/>
                  <circle cx="44" cy="24" r="1.5" fill="#fff"/>
                </g>
                
                {/* Car 2 */}
                <g>
                  <rect x="55" y="5" width="52" height="18" fill="none" stroke="#fff" strokeWidth="1"/>
                  <rect x="58" y="7" width="10" height="11" fill="#fff" opacity="0.3"/>
                  <rect x="71" y="7" width="14" height="11" fill="#fff" opacity="0.3"/>
                  <rect x="88" y="7" width="10" height="11" fill="#fff" opacity="0.3"/>
                  <circle cx="64" cy="24" r="1.5" fill="#fff"/>
                  <circle cx="98" cy="24" r="1.5" fill="#fff"/>
                </g>
                
                {/* Car 3 */}
                <g>
                  <rect x="109" y="5" width="52" height="18" fill="none" stroke="#fff" strokeWidth="1"/>
                  <rect x="112" y="7" width="10" height="11" fill="#fff" opacity="0.3"/>
                  <rect x="125" y="7" width="14" height="11" fill="#fff" opacity="0.3"/>
                  <rect x="142" y="7" width="10" height="11" fill="#fff" opacity="0.3"/>
                  <circle cx="118" cy="24" r="1.5" fill="#fff"/>
                  <circle cx="152" cy="24" r="1.5" fill="#fff"/>
                </g>
                
                {/* Car 4 */}
                <g>
                  <rect x="163" y="5" width="52" height="18" fill="none" stroke="#fff" strokeWidth="1"/>
                  <rect x="166" y="7" width="10" height="11" fill="#fff" opacity="0.3"/>
                  <rect x="179" y="7" width="14" height="11" fill="#fff" opacity="0.3"/>
                  <rect x="196" y="7" width="10" height="11" fill="#fff" opacity="0.3"/>
                  <circle cx="172" cy="24" r="1.5" fill="#fff"/>
                  <circle cx="206" cy="24" r="1.5" fill="#fff"/>
                </g>
                
                {/* Car 5 */}
                <g>
                  <rect x="217" y="5" width="52" height="18" fill="none" stroke="#fff" strokeWidth="1"/>
                  <rect x="220" y="7" width="10" height="11" fill="#fff" opacity="0.3"/>
                  <rect x="233" y="7" width="14" height="11" fill="#fff" opacity="0.3"/>
                  <rect x="250" y="7" width="10" height="11" fill="#fff" opacity="0.3"/>
                  <circle cx="226" cy="24" r="1.5" fill="#fff"/>
                  <circle cx="260" cy="24" r="1.5" fill="#fff"/>
                </g>
                
                {/* Car 6 */}
                <g>
                  <rect x="271" y="5" width="52" height="18" fill="none" stroke="#fff" strokeWidth="1"/>
                  <rect x="274" y="7" width="10" height="11" fill="#fff" opacity="0.3"/>
                  <rect x="287" y="7" width="14" height="11" fill="#fff" opacity="0.3"/>
                  <rect x="304" y="7" width="10" height="11" fill="#fff" opacity="0.3"/>
                  <circle cx="280" cy="24" r="1.5" fill="#fff"/>
                  <circle cx="314" cy="24" r="1.5" fill="#fff"/>
                </g>
              </svg>
            </div>
            
            {/* Track Line - BELOW THE TRAIN */}
            <div 
              style={{
                position: 'absolute',
                top: '28px',
                left: 0,
                width: '100%',
                height: '1px',
                background: 'rgba(255, 255, 255, 0.3)',
                zIndex: 1
              }}
            />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-white">
            <p className="m-0">
              © {new Date().getFullYear()} Mamdani Tracker. All rights reserved.
            </p>
            <p className="m-0">
              Made for New Yorkers, by and with New Yorkers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
