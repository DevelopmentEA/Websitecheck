import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, User, Check, Zap, BookOpen, BrainCircuit } from "lucide-react";
import confetti from 'canvas-confetti';

const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLScEQXP_l9zXJ4_OKXhJiiK_jMzsYWssU2grLHddKQnWShVyQA/formResponse";
const FIELD_IDS = { NAAM: "entry.634230514", BERICHT: "entry.272309703" };

// Opties met iconen en kleuren voor betere visuele herkenning
const NAMING_OPTIONS = [
  { 
    id: 'optie_1', 
    label: 'OefenPakket', 
    description: '',
    icon: <BookOpen size={24} />,
    color: 'from-blue-500/20 to-blue-600/5'
  },
  { 
    id: 'optie_2', 
    label: 'TentamenBooster', 
    description: '',
    icon: <Zap size={24} />,
    color: 'from-amber-500/20 to-amber-600/5'
  },
  { 
    id: 'optie_3', 
    label: 'SlimLeren', 
    description: '',
    icon: <BrainCircuit size={24} />,
    color: 'from-purple-500/20 to-purple-600/5'
  }
];

export default function ProductXPopup({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userName, setUserName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOption) return;

    setLoading(true);
    try {
      const form = new FormData();
      form.append(FIELD_IDS.NAAM, userName || "Anoniem");
      form.append(FIELD_IDS.BERICHT, selectedOption);
      
      await fetch(GOOGLE_FORM_ACTION_URL, { method: "POST", mode: "no-cors", body: form });
      
      setSubmitted(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#7AF9BF', '#10b981', '#0f172a']
      });
    } catch (err) {
      alert("Er ging iets mis. Probeer het later nog eens.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Close Button */}
            <button 
              onClick={onClose} 
              className="absolute top-5 right-5 p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors z-20 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-10 overflow-y-auto">
              {!submitted ? (
                <div className="space-y-8">
                  
                  {/* Header */}
                  <div className="text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 mb-4 border border-emerald-100">
                      <Sparkles size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">The Naming Project</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                      Kies de toekomst van<br className="hidden md:block" /> Product X.
                    </h2>
                    <p className="mt-3 text-slate-500 text-base max-w-lg">
                      We hebben drie kanshebbers, maar we missen nog één ding: jouw mening.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* OPTIES GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {NAMING_OPTIONS.map((option) => {
                        const isSelected = selectedOption === option.label;
                        return (
                          <motion.div
                            key={option.id}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedOption(option.label)}
                            className={`
                              relative cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center h-full justify-between
                              ${isSelected 
                                ? 'border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-500/10' 
                                : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'}
                            `}
                          >
                            {/* Selection Radio Circle */}
                            <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200'}`}>
                                {isSelected && <Check size={12} className="text-white" strokeWidth={4} />}
                            </div>

                            <div className={`
                              mb-4 p-3 rounded-xl bg-gradient-to-br 
                              ${isSelected ? 'from-emerald-100 to-emerald-50 text-emerald-600' : 'from-slate-100 to-slate-50 text-slate-500'}
                            `}>
                              {option.icon}
                            </div>

                            <div>
                              <h3 className={`font-bold text-lg mb-1 leading-snug ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                                {option.label}
                              </h3>
                              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                                {option.description}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Footer Section: Name + Button */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                      
                      <div className="w-full relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <User size={16} />
                        </div>
                        <input 
                          type="text"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all font-medium outline-none text-slate-900 placeholder:text-slate-400"
                          placeholder="Eigen idee? (optioneel)"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        disabled={loading || !selectedOption}
                        className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> 
                            Laden...
                          </span>
                        ) : (
                          <>
                            Stemmen <Send size={16} className="text-emerald-400" />
                          </>
                        )}
                      </motion.button>
                    </div>

                  </form>
                </div>
              ) : (
                /* SUCCESS STATE */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600 ring-8 ring-emerald-50">
                    <Check size={40} strokeWidth={3} />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-3">Stem ontvangen!</h3>
                  <p className="text-slate-500 font-medium mb-8 max-w-xs mx-auto leading-relaxed">
                    Bedankt! We hebben genoteerd dat jij voor <strong className="text-slate-900">{selectedOption}</strong> kiest.
                  </p>
                  <button 
                    onClick={onClose} 
                    className="px-10 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                  >
                    Sluiten
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}