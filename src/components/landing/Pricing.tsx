import { useState } from "react";
import { Check, HelpCircle, Shield, Building, Hammer } from "lucide-react";

export default function Pricing({ onNavigate }: { onNavigate?: (route: string) => void }) {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers = [
    {
      name: "Starter",
      description: "Ideal for growing plants and single-site operations modernizing their logs.",
      monthlyPrice: 199,
      annualPrice: 159,
      icon: Hammer,
      features: [
        "Up to 2 Warehouses",
        "5,000 Active SKUs",
        "Basic low-stock alerts",
        "Multi-user role grouping (Max 5)",
        "Email & basic community support",
        "Standard Excel/CSV data exports"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      description: "Best for multi-site companies looking to automate procurement flows.",
      monthlyPrice: 599,
      annualPrice: 479,
      icon: Building,
      features: [
        "Up to 10 Warehouses",
        "50,000 Active SKUs",
        "AI Low-Stock Forecasting triggers",
        "Unlimited purchase requests",
        "EDI automated supplier dispatching",
        "Full manager approval hierarchies",
        "Priority 24/7 technical hotline"
      ],
      cta: "Start 14-Day Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      description: "Designed for massive multi-national factories requiring SAP/Oracle linkups.",
      monthlyPrice: 1499,
      annualPrice: 1199,
      icon: Shield,
      features: [
        "Unlimited Warehouses",
        "Unlimited SKUs & Assets",
        "Custom private AI models",
        "Direct SAP / Oracle ERP integrations",
        "Dedicated Technical Account Director",
        "Custom SLA guarantees (99.99%)",
        "SOC 2 Type II direct compliance audits"
      ],
      cta: "Talk to Sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-[#02050c]/50 relative z-10 border-t border-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white mb-4">
            Predictive Pricing Built for Your Operational Scale
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            No complex variable fees. Choose a transparent flat pricing tier that fits your enterprise capacity constraints.
          </p>

          {/* Toggle button */}
          <div className="inline-flex items-center gap-3 p-1 rounded-full border border-slate-800 bg-slate-950/60">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                !isAnnual ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                isAnnual ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold tracking-wider">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => {
            const TierIcon = tier.icon;
            const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;
            return (
              <div
                key={tier.name}
                className={`p-6 sm:p-8 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative ${
                  tier.popular
                    ? "bg-slate-900/60 border-indigo-500/60 shadow-xl shadow-indigo-950/20"
                    : "bg-slate-950/40 border-slate-900 hover:border-slate-800"
                }`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-indigo-950">
                    Most Popular
                  </span>
                )}

                {/* Top Part */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-indigo-400">
                        <TierIcon className="w-5 h-5" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-white">{tier.name}</h3>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6 h-12">{tier.description}</p>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-bold text-white font-display">${price}</span>
                    <span className="text-xs text-slate-500 font-mono">/ Month (Billed {isAnnual ? "annually" : "monthly"})</span>
                  </div>

                  <div className="h-px bg-slate-900 mb-8" />

                  {/* Feature Checklist */}
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA */}
                <button
                  id={`pricing-btn-${tier.name.toLowerCase()}`}
                  onClick={() => onNavigate?.("register")}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                    tier.popular
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                      : "bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Enterprise Bottom Callout */}
        <div className="mt-12 p-6 rounded-2xl border border-slate-900 bg-slate-950/20 text-center max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-semibold text-sm text-white">Need custom regulatory structures or volume-based pricing?</h4>
            <p className="text-xs text-slate-400 mt-1">Our procurement architects can formulate custom multi-tenant setups matching SOC 2 mandates.</p>
          </div>
          <button
            id="pricing-btn-sales"
            onClick={() => onNavigate?.("register")}
            className="px-6 py-2.5 rounded-xl border border-slate-800 hover:border-slate-750 bg-slate-900/60 text-slate-200 hover:text-white text-xs font-semibold transition-all shrink-0 cursor-pointer"
          >
            Inquire Custom Plan
          </button>
        </div>
      </div>
    </section>
  );
}
