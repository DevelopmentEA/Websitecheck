import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowUpRight } from 'lucide-react';

const DonateButton = () => {
  return (
    <motion.a
      href="https://lawbooks.nl"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
      whileHover={{ scale: 1.05, y: -5, boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)" }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 pl-2 pr-5 py-2 bg-[#1F2937] text-white rounded-full shadow-2xl border border-slate-700 cursor-pointer group hover:bg-black transition-colors"
    >
      {/* Icon Circle */}
      <div className="w-10 h-10 rounded-full bg-[#6EE7B7] text-slate-900 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
        <ShoppingBag size={18} strokeWidth={2.5} />
      </div>
      
      {/* Tekst Gedeelte */}
      <div className="flex flex-col items-start">
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#6EE7B7] mb-0.5">
          Tentamen halen?
        </span>
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-white leading-none">
            Bekijk de Shop
          </span>
          <ArrowUpRight size={12} className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      </div>
    </motion.a>
  );
};

export default DonateButton;