import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Can we migrate our existing stock records directly from SAP or Oracle NetSuite?",
      a: "Yes. Inventix provides dedicated, compliant API ingest pipelines and pre-mapped CSV templates. You can migrate hundreds of thousands of active SKUs, supplier contact portfolios, and historic purchase records in less than a day with full checksum verification."
    },
    {
      q: "How does the AI-powered replenishment automation prevent accidental over-ordering?",
      a: "Our AI systems operate under strict human-defined guardrails. The system does not dispatch POs directly to vendors without checking your predetermined budget ceilings and manager approval configurations. Low-stock triggers compile a 'Draft Request' first, notifying corresponding operational roles."
    },
    {
      q: "Is Inventix SOC 2 compliant? Where is our warehouse data persisted?",
      a: "Security is our highest priority. Inventix architecture enforces absolute tenant database isolation on enterprise plans, backed by TLS 1.3 in-transit encryption and AES-256 resting encryption. We are fully SOC 2 Type II certified and run under high-availability multi-region Cloud standards."
    },
    {
      q: "Can we set up custom manager approval hierarchies by spending threshold?",
      a: "Absolutely. Through the Company & Settings panel, admins can establish granular corporate authorization charts. For example, you can set rules so that any Purchase Request under $5,000 auto-approves, while requests above $50,000 require dual signature codes from both the Department Supervisor and CFO."
    },
    {
      q: "Do you support offline barcode scanners and hardware integrations?",
      a: "Yes. The Inventix mobile warehouse client features progressive offline caching. It stores scanning scans in an encrypted local database when your operators are deep in steel-shielded loading bays, and automatically synchronizes them back to the cloud the moment a stable Wi-Fi signal is re-established."
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#030712] relative z-10 border-t border-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Find answers to standard compliance, ERP migration, AI safety, and system scalability questions below.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen ? "bg-slate-900/60 border-indigo-500/30" : "bg-slate-950/40 border-slate-900 hover:border-slate-800"
                }`}
              >
                <button
                  id={`faq-toggle-${index}`}
                  onClick={() => handleToggle(index)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-semibold text-sm sm:text-base text-white">{faq.q}</span>
                  <div className={`p-1.5 rounded-lg shrink-0 ${isOpen ? "bg-indigo-600/10 text-indigo-400" : "bg-slate-900 text-slate-500"}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <p className="px-6 pb-6 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-900/40 pt-4">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
