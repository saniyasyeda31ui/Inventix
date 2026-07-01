import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cpu, Mail, Globe, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: "smooth"
          });
        }
      }, 150);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
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
    <footer className="bg-[#02050b] border-t border-slate-900 text-slate-400 relative z-10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleHomeClick}>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow shadow-indigo-500/20">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-white">Inventix</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Inventix is the leading enterprise-grade Procurement & Inventory Management platform designed specifically for global manufacturers, physical warehouses, and modern supply networks.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Continuous SOC 2 Audit Pipeline</span>
            </div>
          </div>

          {/* Column 2 - Platform */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#features" onClick={(e) => handleLinkClick(e, "features")} className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" onClick={(e) => handleLinkClick(e, "how-it-works")} className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#why-inventix" onClick={(e) => handleLinkClick(e, "why-inventix")} className="hover:text-white transition-colors">Why Inventix</a></li>
            </ul>
          </div>

          {/* Column 3 - Enterprise */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Integrations</h4>
            <ul className="space-y-2.5 text-xs">
              <li><span className="text-slate-600 cursor-default">SAP ERP Connector</span></li>
              <li><span className="text-slate-600 cursor-default">Oracle NetSuite Sync</span></li>
              <li><span className="text-slate-600 cursor-default">EDI Gateways</span></li>
              <li><span className="text-slate-600 cursor-default">Custom Webhooks</span></li>
            </ul>
          </div>

          {/* Column 4 - Contact / Newsletter */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Stay Updated</h4>
            <p className="text-xs text-slate-400">Receive strategic manufacturing supply briefings monthly.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="corporate@domain.com"
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900/40 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="h-px bg-slate-900 my-8" />

        {/* Bottom part */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} Inventix Technologies Inc. All rights reserved.</p>
          <div className="flex gap-6 text-slate-500">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Charter</span>
            <span className="hover:text-slate-400 cursor-pointer">Trust & Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
