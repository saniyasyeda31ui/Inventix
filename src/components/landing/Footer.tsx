import React from 'react';
import { Rocket, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative w-full z-10 py-16 px-4 lg:px-8">
      {/* Container for CTA Card */}
      <div className="max-w-[1200px] mx-auto mb-16 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full bg-gradient-to-br from-white/70 via-white/50 to-indigo-50/40 backdrop-blur-3xl rounded-[2.5rem] border border-indigo-100 shadow-[0_20px_60px_-15px_rgba(99,102,241,0.15),0_0_0_1px_rgba(255,255,255,0.6)_inset] overflow-hidden relative"
        >
          {/* Ambient Backgrounds inside Card */}
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-pink-200/40 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-200/40 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="p-10 lg:p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 relative z-10">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-white shadow-sm mb-6">
                <Rocket className="w-4 h-4 text-indigo-600" />
                <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase">Ready to get started?</span>
              </div>
              
              <h2 className="text-4xl lg:text-[3.5rem] font-display font-black text-slate-900 tracking-tight mb-4 leading-tight">
                Start your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Inventix</span> journey.
              </h2>
              
              <p className="text-slate-600 text-lg leading-relaxed max-w-xl font-medium">
                Join forward-thinking teams who are already transforming their procurement, inventory, and operations with Inventix.
              </p>
            </div>

            {/* Right Button */}
            <div className="shrink-0 lg:mr-8">
              <Link to="/login" className="flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-slate-50 text-indigo-600 font-bold text-lg rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.08),_0_0_0_1px_rgba(255,255,255,1)_inset] transition-all hover:scale-105 active:scale-95 group">
                <ArrowRight className="w-5 h-5 text-indigo-600 transition-transform group-hover:translate-x-1" />
                Go to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Very Simple Footer */}
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center px-8">
        <span className="text-[13px] font-semibold text-slate-500 mb-2 md:mb-0">Inventix ERP</span>
        <span className="text-[13px] font-semibold text-slate-500">AI-Powered Enterprise Operations</span>
      </div>
    </footer>
  );
}