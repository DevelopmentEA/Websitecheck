import React from 'react';
import { motion } from 'framer-motion';

const DonateButton = () => {
  // ⚠️ BELANGRIJK: Plak hier je echte Tikkie link (voor bijv. €3,00)
  const TIKKIE_LINK = "https://tikkie.me/pay/309jtsv0kdiupd01mrbg"; 

  return (
    <motion.a
      href={TIKKIE_LINK}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
      whileHover={{ scale: 1.05, y: -5, boxShadow: "0px 10px 20px rgba(197, 160, 89, 0.4)" }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-3 bg-[#C5A059] text-white rounded-full shadow-2xl border border-white/20 cursor-pointer group hover:bg-[#b08d4b] transition-colors"
    >
      <span className="text-xl group-hover:rotate-12 transition-transform duration-300">🍺</span>
      
      <div className="flex flex-col items-start">
        <span className="text-[8px] font-black uppercase tracking-widest leading-none text-white/80 mb-0.5">
          Waardeer je dit?
        </span>
        <span className="text-xs font-bold font-serif italic text-white">
          Doneer een biertje
        </span>
      </div>

      <div className="ml-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-bold">
        €3
      </div>
    </motion.a>
  );
};

export default DonateButton;