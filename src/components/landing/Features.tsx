import { motion } from "motion/react";
import { BrainCircuit, Globe, Settings, ArrowUpRight, Network } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "AI Sourcing Engine",
      description: "Our neural network analyzes historical supplier pricing, market volatility, and lead times to automatically negotiate optimal rates before stock runs low.",
      icon: BrainCircuit,
      glow: "from-pink-500/20 to-purple-500/20",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      illustration: (
        <div className="absolute -right-4 -bottom-4 w-40 h-40 opacity-10 pointer-events-none">
          <BrainCircuit className="w-full h-full text-purple-600" />
        </div>
      )
    },
    {
      title: "Real-Time Logistics",
      description: "Maintain 100% spatial awareness across all global warehouses. Inventix tracks pallets, alerts on cold-storage anomalies, and optimizes internal transfers instantly.",
      icon: Globe,
      glow: "from-cyan-500/20 to-sky-500/20",
      iconColor: "text-sky-600",
      iconBg: "bg-sky-100",
      illustration: (
        <div className="absolute -right-4 -bottom-4 w-40 h-40 opacity-10 pointer-events-none">
          <Globe className="w-full h-full text-sky-600" />
        </div>
      )
    },
    {
      title: "Automated Procurement",
      description: "Eliminate manual paperwork. Inventix auto-generates purchase orders, routes them through hierarchical financial approvals, and dispatches them via EDI seamlessly.",
      icon: Settings,
      glow: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
      illustration: (
        <div className="absolute -right-4 -bottom-4 w-40 h-40 opacity-10 pointer-events-none">
          <Settings className="w-full h-full text-emerald-600" />
        </div>
      )
    }
  ];

  return (
    <section id="features" className="pt-24 pb-8 relative z-10">
      
      {/* Features Specific Ambient Glows & 3D Bubbles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] right-[-5%] w-[40vw] h-[40vw] bg-fuchsia-300/30 rounded-full blur-[120px] mix-blend-multiply"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-cyan-300/30 rounded-full blur-[130px] mix-blend-multiply"
        />
        
        {/* Floating 3D Bubbles */}
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[8%] w-24 h-24 rounded-full bg-gradient-to-br from-white/60 via-purple-200/40 to-indigo-400/40 backdrop-blur-sm shadow-[inset_-10px_-10px_25px_rgba(139,92,246,0.3),_0_20px_40px_rgba(0,0,0,0.1)] border border-white/60 z-10"
        />
        <motion.div
          animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[20%] right-[10%] w-32 h-32 rounded-full bg-gradient-to-br from-white/60 via-cyan-200/40 to-blue-400/40 backdrop-blur-sm shadow-[inset_-10px_-10px_25px_rgba(6,182,212,0.3),_0_20px_40px_rgba(0,0,0,0.1)] border border-white/60 z-10"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-indigo-100 bg-white/60 backdrop-blur-md shadow-sm text-[11px] font-bold text-[#6D4CFF] uppercase tracking-widest mb-6"
          >
            <Network className="w-3.5 h-3.5" />
            AI-POWERED ENTERPRISE PLATFORM
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display font-extrabold text-4xl sm:text-5xl md:text-[54px] tracking-tight text-[#0A0F29] mb-6 leading-[1.15]"
          >
            Intelligent Infrastructure for <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#A855F7] to-[#3B82F6] bg-clip-text text-transparent pb-2">Modern Supply Chains</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-600 text-lg leading-relaxed font-sans"
          >
            Leave legacy ERP constraints behind. Inventix unites procurement, spatial warehousing, and financial reporting under one autonomous, AI-driven command center.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-slate-200 shadow-[0_8px_32px_0_rgba(31,38,135,0.04)] hover:shadow-xl transition-all duration-300 p-8 flex flex-col h-full"
              >
                {/* Accent Glow Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feat.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {feat.illustration}

                <div className={`w-14 h-14 rounded-2xl ${feat.iconBg} ${feat.iconColor} flex items-center justify-center mb-8 relative z-10 shadow-inner`}>
                  <Icon className="w-7 h-7" />
                </div>
                
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-4 relative z-10">
                  {feat.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed font-sans flex-grow relative z-10">
                  {feat.description}
                </p>


              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}