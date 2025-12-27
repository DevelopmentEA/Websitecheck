import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const Dashboard = () => {
  // Statistische animatie instellingen
  const cardTransition = { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      
      {/* HEADER BAR */}
      <header className="border-b border-stone-200/60 pb-8">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col"
        >
          <h1 className="text-4xl font-bold text-[#1A365D] tracking-tight font-serif italic">
            ELBERT'S KENNISBANK
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="h-px w-8 bg-[#C5A059]"></div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-stone-400 font-black">
              Masterclass Recht
            </p>
          </div>
        </motion.div>
      </header>

      {/* MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: DE MEESTERPROEF (Focus Area) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={cardTransition}
          className="lg:col-span-7 flex flex-col justify-center items-center text-center py-12 px-10 bg-white rounded-[4rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.02)] border border-stone-100"
        >
            <div className="relative inline-block mb-12">
                {/* Cirkel Afbeelding met Profiel-look */}
                <div className="w-72 h-72 rounded-full border-[12px] border-[#FAF9F6] shadow-2xl overflow-hidden mx-auto relative group">
                    <img 
                      src="/foto.jpg" 
                      alt="Meester Elbert" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-[#1A365D]/10 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
                
                {/* Gouden Badge met Glow */}
                <motion.div 
                  initial={{ rotate: -10, scale: 0 }}
                  animate={{ rotate: 12, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -bottom-2 -right-2 bg-[#C5A059] text-white w-24 h-24 rounded-[2rem] flex flex-col items-center justify-center shadow-[0_15px_30px_-5px_rgba(197,160,89,0.4)] border-4 border-white z-20"
                >
                    <span className="text-4xl font-bold leading-none">50</span>
                    <span className="text-[8px] uppercase font-black tracking-widest text-stone-100">Items</span>
                </motion.div>
            </div>

            <h2 className="text-6xl font-bold text-[#1A365D] mb-6 font-serif tracking-tight">DE MEESTERPROEF.</h2>
            <p className="text-xl text-stone-500 italic max-w-md mx-auto leading-relaxed font-light mb-12">
                "Het recht is niet het onthouden van artikelen, maar het begrijpen van de systematiek."
            </p>
            
            <NavLink to="/home1" className="group relative overflow-hidden px-14 py-5 bg-[#1A365D] text-white rounded-full font-bold uppercase tracking-widest text-[10px] transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(26,54,93,0.3)]">
                <span className="relative z-10">Hervat Training</span>
                <div className="absolute inset-0 bg-[#C5A059] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </NavLink>
        </motion.div>

        {/* RIGHT COLUMN: STATS & QUOTE */}
        <div className="lg:col-span-5 space-y-8">
            
            {/* STATS GRID */}
            <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: "📋", label: "Voltooid", val: "32/50", color: "#1A365D" },
                  { icon: "✔", label: "Precisie", val: "84%", color: "#C5A059" },
                  { icon: "🕒", label: "Sessie", val: "2.4u", color: "#1A365D" }
                ].map((s, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-stone-100 flex flex-col items-center text-center"
                  >
                    <span className="text-xl mb-2 opacity-80">{s.icon}</span>
                    <span className="text-[7px] font-black uppercase tracking-widest text-stone-400 mb-1">{s.label}</span>
                    <span className="text-lg font-bold" style={{ color: s.color }}>{s.val}</span>
                  </motion.div>
                ))}
            </div>

            {/* LUXE QUOTE CARD */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-[#1A365D] text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[300px]"
            >
                {/* Decoratief Element */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                
                <div className="absolute top-8 right-10 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></div>
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">Status: In Behandeling</span>
                </div>

                <div className="text-4xl opacity-20 mb-6 font-serif">“</div>
                <p className="text-3xl font-serif italic leading-tight mb-8 pr-4">
                  Ius est ars boni et aequi.
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-px w-8 bg-[#C5A059]"></div>
                  <span className="text-[9px] uppercase tracking-widest font-black text-stone-400">
                    Ulpianus — Digesta 1.1.1
                  </span>
                </div>
            </motion.div>

            {/* ACTIVITY FEEDER */}
            <div className="bg-[#FDFCFB] p-10 rounded-[3.5rem] border-2 border-dashed border-stone-200/60 flex items-center justify-center">
              <div className="flex flex-col items-center text-center">
                 <div className="w-2 h-2 rounded-full bg-stone-200 mb-4"></div>
                 <span className="text-[9px] font-black text-stone-300 uppercase tracking-[0.3em] mb-2 block">Dossier Update</span>
                 <p className="text-xs font-bold text-stone-400 italic font-serif">
                   Geen onvoltooide zaken in Bestuursrecht.
                 </p>
              </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;