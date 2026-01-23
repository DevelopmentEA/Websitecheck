import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Zap, Check, PencilLine, User } from "lucide-react";
import confetti from 'canvas-confetti';

const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLScEQXP_l9zXJ4_OKXhJiiK_jMzsYWssU2grLHddKQnWShVyQA/formResponse";
const FIELD_IDS = { NAAM: "entry.634230514", BERICHT: "entry.272309703" };

export default function ProductXPopup({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ naam: "", bericht: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bericht.trim()) return;

    setLoading(true);
    try {
      const form = new FormData();
      // Naam is optioneel, bericht is de kern
      form.append(FIELD_IDS.NAAM, formData.naam || "Anoniem");
      form.append(FIELD_IDS.BERICHT, formData.bericht);
      
      await fetch(GOOGLE_FORM_ACTION_URL, { method: "POST", mode: "no-cors", body: form });
      
      setSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#7AF9BF', '#10b981', '#000000']
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
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-colors z-10">
              <X size={20} className="text-slate-400" />
            </button>

            <div className="p-8 md:p-12">
              {!submitted ? (
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4 text-[#10b981]">
                      <Sparkles size={16} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">The Naming Project</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                      Geef Product X <br />een nieuwe naam.
                    </h2>
                    <p className="mt-3 text-slate-500 text-sm font-medium">
                      Onze nieuwe module is bijna klaar. Hoe moeten we hem noemen?
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-4">
                      <div className="relative">
                        <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                          <PencilLine size={12} /> Jouw voorstel
                        </label>
                        <textarea 
                          required
                          className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-3xl focus:border-[#7AF9BF] focus:bg-white transition-all font-bold text-lg resize-none h-32 outline-none"
                          placeholder="Bijv. Lexicon, Juris, Flow..."
                          value={formData.bericht}
                          onChange={(e) => setFormData({...formData, bericht: e.target.value})}
                        />
                      </div>

                      <div className="relative">
                        <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                          <User size={12} /> Je naam (optioneel)
                        </label>
                        <input 
                          type="text"
                          className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-[#7AF9BF] focus:bg-white transition-all font-bold outline-none"
                          placeholder="Wie ben je?"
                          value={formData.naam}
                          onChange={(e) => setFormData({...formData, naam: e.target.value})}
                        />
                      </div>
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit" disabled={loading || !formData.bericht}
                      className="w-full py-5 bg-slate-900 text-[#7AF9BF] font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-lg flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale transition-all"
                    >
                      {loading ? "Verzenden..." : "Voorstel indienen"}
                      {!loading && <Send size={14} />}
                    </motion.button>
                  </form>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 text-center"
                >
                  <div className="w-16 h-16 bg-[#7AF9BF]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#059669]">
                    <Check size={32} strokeWidth={3} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Bedankt!</h3>
                  <p className="text-slate-500 font-medium mb-8 text-sm">
                    Je voorstel is ontvangen. We nemen alle suggesties mee in de definitieve keuze.
                  </p>
                  <button 
                    onClick={onClose} 
                    className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition-colors"
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