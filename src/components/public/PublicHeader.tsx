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

// 6-Car Subway Train SVG (same design as footer)
const SubwayTrain = ({ color = "#fff" }: { color?: string }) => (
  <svg width="360" height="26" viewBox="0 0 360 26" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.6, display: 'block' }}>
    {/* Car 1 */}
    <g>
      <rect x="1" y="5" width="52" height="18" fill="none" stroke={color} strokeWidth="1"/>
      <rect x="4" y="7" width="10" height="11" fill={color} opacity="0.3"/>
      <rect x="17" y="7" width="14" height="11" fill={color} opacity="0.3"/>
      <rect x="34" y="7" width="10" height="11" fill={color} opacity="0.3"/>
      <circle cx="10" cy="24" r="1.5" fill={color}/>
      <circle cx="44" cy="24" r="1.5" fill={color}/>
    </g>
    
    {/* Car 2 */}
    <g>
      <rect x="55" y="5" width="52" height="18" fill="none" stroke={color} strokeWidth="1"/>
      <rect x="58" y="7" width="10" height="11" fill={color} opacity="0.3"/>
      <rect x="71" y="7" width="14" height="11" fill={color} opacity="0.3"/>
      <rect x="88" y="7" width="10" height="11" fill={color} opacity="0.3"/>
      <circle cx="64" cy="24" r="1.5" fill={color}/>
      <circle cx="98" cy="24" r="1.5" fill={color}/>
    </g>
    
    {/* Car 3 */}
    <g>
      <rect x="109" y="5" width="52" height="18" fill="none" stroke={color} strokeWidth="1"/>
      <rect x="112" y="7" width="10" height="11" fill={color} opacity="0.3"/>
      <rect x="125" y="7" width="14" height="11" fill={color} opacity="0.3"/>
      <rect x="142" y="7" width="10" height="11" fill={color} opacity="0.3"/>
      <circle cx="118" cy="24" r="1.5" fill={color}/>
      <circle cx="152" cy="24" r="1.5" fill={color}/>
    </g>
    
    {/* Car 4 */}
    <g>
      <rect x="163" y="5" width="52" height="18" fill="none" stroke={color} strokeWidth="1"/>
      <rect x="166" y="7" width="10" height="11" fill={color} opacity="0.3"/>
      <rect x="179" y="7" width="14" height="11" fill={color} opacity="0.3"/>
      <rect x="196" y="7" width="10" height="11" fill={color} opacity="0.3"/>
      <circle cx="172" cy="24" r="1.5" fill={color}/>
      <circle cx="206" cy="24" r="1.5" fill={color}/>
    </g>
    
    {/* Car 5 */}
    <g>
      <rect x="217" y="5" width="52" height="18" fill="none" stroke={color} strokeWidth="1"/>
      <rect x="220" y="7" width="10" height="11" fill={color} opacity="0.3"/>
      <rect x="233" y="7" width="14" height="11" fill={color} opacity="0.3"/>
      <rect x="250" y="7" width="10" height="11" fill={color} opacity="0.3"/>
      <circle cx="226" cy="24" r="1.5" fill={color}/>
      <circle cx="260" cy="24" r="1.5" fill={color}/>
    </g>
    
    {/* Car 6 */}
    <g>
      <rect x="271" y="5" width="52" height="18" fill="none" stroke={color} strokeWidth="1"/>
      <rect x="274" y="7" width="10" height="11" fill={color} opacity="0.3"/>
      <rect x="287" y="7" width="14" height="11" fill={color} opacity="0.3"/>
      <rect x="304" y="7" width="10" height="11" fill={color} opacity="0.3"/>
      <circle cx="280" cy="24" r="1.5" fill={color}/>
      <circle cx="314" cy="24" r="1.5" fill={color}/>
    </g>
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
      <div className="relative overflow-hidden" style={{ minHeight: '32px' }}>
        {/* Track Line */}
        <div 
          className="absolute left-0 w-full"
          style={{
            top: '28px',
            height: '1px',
            background: 'rgba(255, 255, 255, 0.3)',
            zIndex: 1
          }}
        />
        
        {/* Animated Train */}
        <div 
          className={`absolute ${
            trainVisible 
              ? trainFromLeft 
                ? 'animate-[train-left-to-right_4s_linear_forwards]' 
                : 'animate-[train-right-to-left_4s_linear_forwards]'
              : 'opacity-0'
          }`}
          style={{
            top: '5px',
            left: trainFromLeft ? '-360px' : 'auto',
            right: trainFromLeft ? 'auto' : '-360px',
            width: '360px',
            zIndex: 2,
            transform: trainFromLeft ? 'scaleX(1)' : 'scaleX(-1)',
          }}
        >
          <SubwayTrain color="#fff" />
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
