import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { path: "/promises", label: "Promises" },
  { path: "/promises/rankings", label: "Rankings" },
  // TEMPORARILY HIDDEN: { path: "/zohran-mamdani-first-100-days", label: "First 100 Days" },
  { path: "/zohran-mamdani-appointment-tracker", label: "Appointments" },
  { path: "/indicators", label: "Key Performance Indicators" },
  { path: "/about", label: "About" },
  { path: "/membership", label: "Membership" },
];

export function PublicHeader() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: '#0C2788' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Mamdani Tracker Home"
              className="text-white font-bold text-xl tracking-wide hover:opacity-80 transition-opacity"
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
                className={`px-3 py-2 text-sm font-semibold tracking-wide transition-all ${
                  isActive(item.path)
                    ? "text-white bg-white/20"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Auth */}
            <div className="ml-2 pl-2 border-l border-white/20 flex items-center gap-1">
              {user ? (
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-all"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Sign in
                </Link>
              )}
            </div>
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
                  className={`block py-3 px-4 font-semibold tracking-wide text-sm transition-colors ${
                    isActive(item.path)
                      ? "text-white bg-white/10 border-l-4 border-white"
                      : "text-white/90 hover:text-white hover:bg-white/10 pl-5"
                  }`}
                  aria-current={isActive(item.path) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-white/20 mt-2 pt-2">
                {user ? (
                  <button
                    onClick={() => { signOut(); setMobileMenuOpen(false); }}
                    className="w-full text-left flex items-center gap-2 py-3 px-4 font-semibold tracking-wide text-sm text-white/90 hover:text-white hover:bg-white/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-3 px-4 font-semibold tracking-wide text-sm text-white/90 hover:text-white hover:bg-white/10"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
