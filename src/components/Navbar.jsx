import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About Me", path: "/about" },
  { label: "Gallery", path: "/gallery" },
  { label: "News & Blogs", path: "/news" },
  { label: "Contact Me", path: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  useEffect(() => { setIsMobileMenuOpen(false); }, [location]);

  /* ── colour tokens for scrolled vs transparent state ── */
  const scrolledBg = "rgba(6, 10, 22, 0.92)";   /* deep navy, matches mobile menu */
  const scrolledBorder = "rgba(192, 132, 252, 0.15)"; /* faint accent line */
  const linkColor = scrolled
    ? "rgba(255,255,255,0.85)"           /* bright on dark bg */
    : "var(--color-heading)";
  const activeLinkColor = "var(--color-dark-yellow)";

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "py-4 shadow-[0_4px_24px_rgba(0,0,0,0.45)]" : "py-7 shadow-none bg-transparent"
          }`}
        style={
          scrolled
            ? {
              background: scrolledBg,
              borderBottom: `1px solid ${scrolledBorder}`,
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }
            : {}
        }
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-16 flex items-center justify-between">

          {/* LOGO */}
          <Link
            to="/"
            className="text-3xl lg:text-4xl font-black tracking-tight"
            style={{ color: scrolled ? "#fff" : "var(--color-span)" }}
          >
            Don
            <span
              style={{
                color: "var(--color-dark-yellow)",
                marginLeft: "6px" // adjust gap here
              }}
            >
              Director
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-10 lg:gap-14">
            {NAV_LINKS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className="relative text-base lg:text-lg font-semibold group transition-colors duration-200"
                  style={{ color: isActive ? activeLinkColor : linkColor }}
                >
                  {item.label}

                  {/* underline */}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    style={{ backgroundColor: "var(--color-accent-light)" }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center"
            aria-label="Toggle menu"
          >
            {[
              isMobileMenuOpen ? "rotate-45 translate-y-2" : "",
              isMobileMenuOpen ? "opacity-0" : "opacity-100",
              isMobileMenuOpen ? "-rotate-45 -translate-y-2" : "",
            ].map((cls, i) => (
              <span
                key={i}
                className={`h-0.5 rounded transition-all ${cls}`}
                style={{ backgroundColor: scrolled ? "#fff" : "var(--color-heading)" }}
              />
            ))}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center transition-all duration-500 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        style={{ backgroundColor: "var(--color-navy)" }}
      >
        <nav className="flex flex-col items-center gap-8">
          {NAV_LINKS.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className="text-xl font-bold uppercase tracking-widest transition-colors duration-200"
                style={{
                  color: isActive ? "var(--color-accent)" : "rgba(255,255,255,0.85)",
                  transitionDelay: `${index * 0.08}s`,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Navbar;