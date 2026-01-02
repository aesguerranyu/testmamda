import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-[#0C2788] sticky top-0" style={{ zIndex: 1000, margin: 0, padding: 0 }} role="banner">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-5" style={{ margin: 0 }}>
        <div className="flex justify-between items-center py-3 md:py-4">
          <div>
            <Link to="/" className="no-underline" onClick={() => setMobileMenuOpen(false)} aria-label="Mamdani Tracker Home">
              <h1 className="m-0 text-white font-bold tracking-tight text-xl">
                Mamdani Tracker
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block" aria-label="Main navigation">
            <ul className="flex gap-4 lg:gap-5 list-none m-0 p-0">
              <li>
                <Link
                  to="/promises"
                  className={`no-underline font-bold tracking-wide text-sm transition-colors ${
                    isActive("/promises") ? "text-white border-t-4 border-white pt-1" : "text-white opacity-90 hover:text-blue-200"
                  }`}
                  style={isActive("/promises") ? {} : { opacity: 0.9 }}
                  aria-label="View all promises and agenda"
                  aria-current={isActive("/promises") ? "page" : undefined}
                >
                  Promises
                </Link>
              </li>
              <li>
                <Link
                  to="/first100days"
                  className={`no-underline font-bold tracking-wide text-sm transition-colors ${
                    isActive("/first100days") ? "text-white border-t-4 border-white pt-1" : "text-white opacity-90 hover:text-blue-200"
                  }`}
                  style={isActive("/first100days") ? {} : { opacity: 0.9 }}
                  aria-label="View first 100 days timeline"
                  aria-current={isActive("/first100days") ? "page" : undefined}
                >
                  First 100 Days
                </Link>
              </li>
              <li>
                <Link
                  to="/indicators"
                  className={`no-underline font-bold tracking-wide text-sm transition-colors ${
                    isActive("/indicators") ? "text-white border-t-4 border-white pt-1" : "text-white opacity-90 hover:text-blue-200"
                  }`}
                  style={isActive("/indicators") ? {} : { opacity: 0.9 }}
                  aria-label="View NYC data indicators"
                  aria-current={isActive("/indicators") ? "page" : undefined}
                >
                  Key Performance Indicators
                </Link>
              </li>
              <li>
                <Link
                  to="/methodology"
                  className={`no-underline font-bold tracking-wide text-sm transition-colors ${
                    isActive("/methodology") ? "text-white border-t-4 border-white pt-1" : "text-white opacity-90 hover:text-blue-200"
                  }`}
                  style={isActive("/methodology") ? {} : { opacity: 0.9 }}
                  aria-label="About Mamdani Tracker and our methodology"
                  aria-current={isActive("/methodology") ? "page" : undefined}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/membership"
                  className={`no-underline font-bold tracking-wide text-sm transition-colors ${
                    isActive("/membership") ? "text-white border-t-4 border-white pt-1" : "text-white opacity-90 hover:text-blue-200"
                  }`}
                  style={isActive("/membership") ? {} : { opacity: 0.9 }}
                  aria-label="Become a member of Mamdani Tracker"
                  aria-current={isActive("/membership") ? "page" : undefined}
                >
                  Membership
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 border-2 border-white bg-transparent"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? (
              <XMarkIcon style={{ width: '1.5rem', height: '1.5rem' }} aria-hidden="true" />
            ) : (
              <Bars3Icon style={{ width: '1.5rem', height: '1.5rem' }} aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t-2 border-white pt-4" aria-label="Mobile navigation" id="mobile-navigation">
            <ul className="flex flex-col gap-3 list-none m-0 p-0">
              <li>
                <Link
                  to="/promises"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block no-underline font-bold tracking-wide text-sm py-2 transition-colors ${
                    isActive("/promises") ? "text-white border-l-4 border-white pl-3" : "text-white pl-3"
                  }`}
                  style={isActive("/promises") ? { backgroundColor: 'rgba(255, 255, 255, 0.1)' } : { opacity: 0.9 }}
                  aria-label="View all promises and agenda"
                  aria-current={isActive("/promises") ? "page" : undefined}
                >
                  Promises
                </Link>
              </li>
              <li>
                <Link
                  to="/first100days"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block no-underline font-bold tracking-wide text-sm py-2 transition-colors ${
                    isActive("/first100days") ? "text-white border-l-4 border-white pl-3" : "text-white pl-3"
                  }`}
                  style={isActive("/first100days") ? { backgroundColor: 'rgba(255, 255, 255, 0.1)' } : { opacity: 0.9 }}
                  aria-label="View first 100 days timeline"
                  aria-current={isActive("/first100days") ? "page" : undefined}
                >
                  First 100 Days
                </Link>
              </li>
              <li>
                <Link
                  to="/indicators"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block no-underline font-bold tracking-wide text-sm py-2 transition-colors ${
                    isActive("/indicators") ? "text-white border-l-4 border-white pl-3" : "text-white pl-3"
                  }`}
                  style={isActive("/indicators") ? { backgroundColor: 'rgba(255, 255, 255, 0.1)' } : { opacity: 0.9 }}
                  aria-label="View NYC data indicators"
                  aria-current={isActive("/indicators") ? "page" : undefined}
                >
                  Key Performance Indicators
                </Link>
              </li>
              <li>
                <Link
                  to="/methodology"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block no-underline font-bold tracking-wide text-sm py-2 transition-colors ${
                    isActive("/methodology") ? "text-white border-l-4 border-white pl-3" : "text-white pl-3"
                  }`}
                  style={isActive("/methodology") ? { backgroundColor: 'rgba(255, 255, 255, 0.1)' } : { opacity: 0.9 }}
                  aria-label="About Mamdani Tracker and our methodology"
                  aria-current={isActive("/methodology") ? "page" : undefined}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/membership"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block no-underline font-bold tracking-wide text-sm py-2 transition-colors ${
                    isActive("/membership") ? "text-white border-l-4 border-white pl-3" : "text-white pl-3"
                  }`}
                  style={isActive("/membership") ? { backgroundColor: 'rgba(255, 255, 255, 0.1)' } : { opacity: 0.9 }}
                  aria-label="Become a member of Mamdani Tracker"
                  aria-current={isActive("/membership") ? "page" : undefined}
                >
                  Membership
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}