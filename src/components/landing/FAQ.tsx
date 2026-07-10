import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, MessageSquareText, Sparkles, Search, FileText, ArrowRight } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "How long does it take to implement Inventix?",
      answer: "Most enterprise deployments are completed within 14-30 days. Because Inventix is built on modern API standards, connecting it to your existing data sources is plug-and-play."
    },
    {
      question: "Does Inventix integrate with our existing ERP?",
      answer: "Yes. Inventix serves as an intelligent operations layer that sits on top of your existing ERP (like SAP, Oracle, or Microsoft Dynamics). It pulls your data, optimizes it with AI, and syncs the results back to your ledger."
    },
    {
      question: "How secure is the AI sourcing data?",
      answer: "We use bank-grade AES-256 encryption. Your operational data is siloed and never used to train public models. Inventix is SOC 2 Type II certified."
    },
    {
      question: "What kind of ROI can we expect?",
      answer: "Our pilot customers typically see a 15-20% reduction in procurement costs and a 40% decrease in manual administrative hours within the first quarter of deployment."
    }
  ];

  return (
    <section id="faq" className="py-32 relative z-10 bg-transparent">
      
      {/* Subtle Mesh Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[0%] w-[50vw] h-[50vw] bg-pink-200/40 rounded-full blur-[140px] mix-blend-multiply"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], y: [0, -40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[5%] w-[55vw] h-[55vw] bg-sky-200/40 rounded-full blur-[130px] mix-blend-multiply"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left AI Support Center Panel */}
          <div className="lg:col-span-5 sticky top-32">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2rem] bg-white/60 backdrop-blur-3xl border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-sky-200/50 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-200/50 via-transparent to-transparent opacity-80" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                     <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <span className="font-mono text-xs font-bold text-indigo-600 uppercase tracking-widest">Support Center</span>
                </div>
                
                <h2 className="font-display font-bold text-4xl text-slate-900 mb-4 tracking-tight leading-tight">
                  Always Online.<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500">Enterprise AI Concierge</span>
                </h2>
                <p className="text-slate-500 text-sm mb-8 font-sans leading-relaxed max-w-sm">
                  Search our technical knowledge base or chat directly with our AI assistant for instant deployment answers.
                </p>

                {/* Search Component */}
                <div className="relative mb-8 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search API documentation..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/80 backdrop-blur border border-white shadow-[inset_0_2px_5px_rgba(0,0,0,0.02)] rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50">
                     <kbd className="font-mono text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">⌘</kbd>
                     <kbd className="font-mono text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">K</kbd>
                  </div>
                </div>
                
                {/* Floating Documentation Cards */}
                <div className="flex gap-3 mb-8">
                  <div className="flex-1 bg-white/70 backdrop-blur-sm border border-white p-3 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
                    <FileText className="w-4 h-4 text-indigo-500 mb-2" />
                    <div className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">API Reference</div>
                  </div>
                  <div className="flex-1 bg-white/70 backdrop-blur-sm border border-white p-3 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
                    <FileText className="w-4 h-4 text-sky-500 mb-2" />
                    <div className="text-xs font-bold text-slate-700 group-hover:text-sky-600 transition-colors">ERP Integration</div>
                  </div>
                </div>

                {/* Custom Animated AI Assistant Chat Bubble */}
                <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 relative group overflow-hidden shadow-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 relative">
                          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-50" />
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 font-display text-sm">Inventix AI</h4>
                          <p className="text-[10px] font-mono text-emerald-600 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Online
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="p-3 rounded-2xl rounded-tl-sm bg-white border border-slate-100 text-slate-600 text-sm leading-relaxed shadow-sm w-[90%]">
                        Hello! I can help you configure your Webhooks or pull SOC 2 compliance reports.
                      </div>
                      
                      {/* Animated Typing Indicator */}
                      <div className="p-3 rounded-2xl rounded-tl-sm bg-white border border-slate-100 shadow-sm w-max flex items-center gap-1.5">
                        <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      </div>
                    </div>

                    <button className="flex items-center justify-center w-full gap-2 py-2.5 px-6 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-600/30 transition-all duration-300">
                      <MessageSquareText className="w-4 h-4" />
                      Start Conversation
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right FAQ Accordions (Premium Glass) */}
          <div className="lg:col-span-7 space-y-4 pt-4 lg:pt-0 relative">
            <div className="absolute top-[20%] right-[-10%] w-32 h-32 bg-sky-400/20 blur-3xl rounded-full" />
            <div className="absolute bottom-[20%] left-[-10%] w-40 h-40 bg-pink-400/20 blur-3xl rounded-full" />
            
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-[1.5rem] backdrop-blur-2xl transition-all duration-500 overflow-hidden relative group ${
                    isOpen 
                      ? 'bg-white/80 border border-white shadow-[0_20px_40px_-15px_rgba(99,102,241,0.15)]' 
                      : 'bg-white/40 border border-white/50 hover:bg-white/70 hover:border-white hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] shadow-sm'
                  }`}
                >
                  {/* Subtle hover glow on closed items */}
                  {!isOpen && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:via-transparent group-hover:to-transparent transition-all duration-500 pointer-events-none" />}
                  
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-8 py-6 flex items-center justify-between focus:outline-none relative z-10"
                  >
                    <span className={`font-display font-bold text-lg text-left transition-colors duration-300 pr-4 ${isOpen ? 'text-indigo-600' : 'text-slate-900 group-hover:text-indigo-600'}`}>
                      {faq.question}
                    </span>
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border ${isOpen ? 'bg-indigo-600 border-indigo-600 shadow-[0_5px_15px_rgba(79,70,229,0.3)] rotate-180' : 'bg-white border-white shadow-sm group-hover:border-indigo-100 group-hover:bg-indigo-50'}`}>
                      <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${isOpen ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-8 pb-8 pt-0 text-slate-500 text-base leading-relaxed font-sans relative z-10 border-t border-slate-100/50 mt-2 pt-6">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}