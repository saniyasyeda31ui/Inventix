import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Cpu } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navigate = useNavigate();

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Why Inventix", href: "#why-inventix" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (window.location.pathname !== "/") {
        setActiveSection("");
        return;
      }

      const scrollPos = window.scrollY + 120;
      for (const item of navItems) {
        const id = item.href.substring(1);
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(item.href);
            return;
          }
        }
      }
      if (window.scrollY < 100) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 150);
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleHomeClick = () => {
    if (window.location.pathname !== "/") {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${scrolled
          ? "bg-white/90 backdrop-blur-3xl border-b border-white/80 py-2.5 shadow-sm"
          : "bg-transparent py-6"
        }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Inventix Home"
            className="flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl"
            onClick={handleHomeClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleHomeClick();
              }
            }}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/20">
              <Cpu className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-white opacity-0 hover:opacity-20 transition-opacity" />
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-slate-900">
              Inventix
            </span>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-indigo-50 text-indigo-600 uppercase tracking-widest hidden sm:inline-block font-bold">
              SAAS V1.0
            </span>
          </div>

          {/* Desktop Navigation Links - Centered Absolutely */}
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className={`text-sm font-medium transition-colors duration-200 focus:outline-none ${isActive ? "text-indigo-600 font-bold" : "text-slate-500 hover:text-slate-900"
                    }`}
                >
                  {item.name}
                </a>
              );
            })}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              id="nav-btn-login"
              to="/login"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors duration-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
            >
              Sign In
            </Link>
            <Link
              id="nav-btn-register"
              to="/register-company"
              className="relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden text-sm font-bold rounded-full text-white bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] shadow-[0_10px_25px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:outline-none focus:ring-indigo-500 cursor-pointer"
            >
              Register Company
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-expanded={isOpen}
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-slate-200/60 bg-white/95 backdrop-blur-xl ${isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-3 sm:px-3">
          {navItems.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${isActive ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                  }`}
              >
                {item.name}
              </a>
            );
          })}
          <div className="h-px bg-slate-200/60 my-4" />
          <div className="grid grid-cols-2 gap-3 px-3">
            <Link
              id="mobile-nav-btn-login"
              to="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign In
            </Link>
            <Link
              id="mobile-nav-btn-register"
              to="/register-company"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}