import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { path: "/promises", label: "Promises" },
  { path: "/first100days", label: "First 100 Days" },
  { path: "/indicators", label: "Key Performance Indicators" },
  { path: "/about", label: "About" },
  { path: "/membership", label: "Membership" },
];

// Subway train SVG component
const SubwayTrain = () => (
  <svg viewBox="0 0 120 24" className="h-6 w-auto" fill="currentColor">
    <rect x="0" y="4" width="100" height="16" rx="2" />
    <rect x="5" y="7" width="12" height="8" rx="1" fill="#0039A6" />
    <rect x="20" y="7" width="12" height="8" rx="1" fill="#0039A6" />
    <rect x="35" y="7" width="12" height="8" rx="1" fill="#0039A6" />
    <rect x="50" y="7" width="12" height="8" rx="1" fill="#0039A6" />
    <rect x="65" y="7" width="12" height="8" rx="1" fill="#0039A6" />
    <rect x="80" y="7" width="12" height="8" rx="1" fill="#0039A6" />
    <circle cx="15" cy="22" r="3" />
    <circle cx="35" cy="22" r="3" />
    <circle cx="65" cy="22" r="3" />
    <circle cx="85" cy="22" r="3" />
    <polygon points="100,4 100,20 115,12" />
  </svg>
);

export function PublicHeader() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trainVisible, setTrainVisible] = useState(false);
  const [trainFromLeft, setTrainFromLeft] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const triggerTrain = () => {
      setTrainFromLeft(Math.random() > 0.5);
      setTrainVisible(true);
      setTimeout(() => setTrainVisible(false), 4000);
    };

    // Initial delay before first train
    const initialDelay = setTimeout(() => {
      triggerTrain();
    }, 2000);

    // Random interval between trains (8-15 seconds)
    const interval = setInterval(() => {
      triggerTrain();
    }, 8000 + Math.random() * 7000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="bg-subway-blue sticky top-0 z-50">
      {/* Train animation track */}
      <div className="relative h-6 overflow-hidden border-b border-white/20">
        <div 
          className={`absolute top-0 text-white transition-none ${
            trainVisible 
              ? trainFromLeft 
                ? 'animate-[train-left-to-right_4s_linear_forwards]' 
                : 'animate-[train-right-to-left_4s_linear_forwards]'
              : 'opacity-0'
          }`}
          style={{
            left: trainFromLeft ? '-120px' : 'auto',
            right: trainFromLeft ? 'auto' : '-120px',
          }}
        >
          <div style={{ transform: trainFromLeft ? 'scaleX(1)' : 'scaleX(-1)' }}>
            <SubwayTrain />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Mamdani Tracker Home"
              className="text-white font-bold text-lg uppercase tracking-wider hover:opacity-80 transition-opacity"
            >
              Mamdani Tracker
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
                  isActive(item.path)
                    ? "text-white bg-white/20"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2 border-2 border-white bg-transparent hover:bg-white/10 transition-colors"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-white/20">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 px-4 font-bold uppercase tracking-wide text-sm transition-colors ${
                    isActive(item.path)
                      ? "text-white bg-white/10 border-l-4 border-white"
                      : "text-white/90 hover:text-white hover:bg-white/10 pl-5"
                  }`}
                  aria-current={isActive(item.path) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
