import { motion } from "motion/react";

export default function TrustedBy() {
  const partners = [
    { name: "Acme Corp", logo: "ACME" },
    { name: "Global Industries", logo: "GLOBAL" },
    { name: "TechFlow", logo: "TECHFLOW" },
    { name: "Nexus", logo: "NEXUS" },
    { name: "Stark Logistics", logo: "STARK" },
    { name: "OmniCorp", logo: "OMNI" }
  ];

  return (
    <section className="py-12 border-b border-slate-200 bg-[#fafbfc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-slate-500 mb-8 uppercase tracking-wider">
          Trusted by innovative teams worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-xl md:text-2xl font-bold font-display text-slate-400 select-none hover:text-slate-600 transition-colors cursor-default"
            >
              {partner.logo}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}