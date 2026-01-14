import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare, Gavel, CheckCircle2, AlertCircle, ArrowLeft, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- CONFIGURATIE ---
const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLScEQXP_l9zXJ4_OKXhJiiK_jMzsYWssU2grLHddKQnWShVyQA/formResponse";

const FIELD_IDS = {
  NAAM: "entry.634230514",
  BERICHT: "entry.272309703",
};

export default function Support() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
      naam: "",
      bericht: ""
  });

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
          const form = new FormData();
          form.append(FIELD_IDS.NAAM, formData.naam);
          form.append(FIELD_IDS.BERICHT, formData.bericht);
          
          await fetch(GOOGLE_FORM_ACTION_URL, {
              method: "POST",
              mode: "no-cors", 
              body: form
          });

          setSubmitted(true);
          setFormData({ naam: "", bericht: "" });

      } catch (err) {
          setError("Er ging iets mis bij het versturen.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-6 relative overflow-hidden">
      
      {/* Subtiele Achtergrond Decoratie */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#6EE7B7]/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header Sectie */}
        <div className="mb-10 flex flex-col items-start">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[#059669] mb-4"
          >
            <Gavel size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Legal Intelligence Support</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
            Support & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#059669] to-[#6EE7B7]">Feedback</span>
          </h1>
          <p className="mt-4 text-slate-500 font-medium">Iets onduidelijk of een foutje gezien? Onze juridische redactie kijkt mee.</p>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-slate-100 p-12 rounded-[3rem] shadow-xl text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#6EE7B7]" />
              <div className="w-20 h-20 bg-[#6EE7B7]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-[#059669]">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Melding Ontvangen</h3>
              <p className="text-slate-500 mb-8 font-medium">Bedankt voor je scherpte. We gaan er direct mee aan de slag.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="px-8 py-4 bg-black text-[#6EE7B7] rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-lg"
              >
                Nieuwe Melding
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border border-slate-100 p-8 md:p-10 rounded-[3rem] shadow-xl relative"
            >
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 mb-6 text-sm font-bold border border-red-100">
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-6">
                  {/* Mail Input */}
                  <div className="relative group">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                      <Mail size={12} className="text-[#6EE7B7]" /> Jouw E-mail
                    </label>
                    <input 
                      type="email" 
                      name="naam"
                      required
                      className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl focus:outline-none focus:border-[#6EE7B7] focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300" 
                      placeholder="naam@student.nl"
                      value={formData.naam} 
                      onChange={handleChange} 
                    />
                  </div>

                  {/* Bericht Input */}
                  <div className="relative group">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                      <MessageSquare size={12} className="text-[#6EE7B7]" /> Opmerking / Correctie
                    </label>
                    <textarea 
                      name="bericht"
                      required
                      className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl h-40 focus:outline-none focus:border-[#6EE7B7] focus:bg-white transition-all font-medium text-slate-900 placeholder:text-slate-300 resize-none" 
                      placeholder="Omschrijf de fout of je vraag..."
                      value={formData.bericht} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>

                <motion.button 
                  type="submit" 
                  disabled={loading}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-5 bg-black text-[#6EE7B7] font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:shadow-[0_20px_40px_rgba(110,231,183,0.2)] disabled:opacity-50 disabled:cursor-wait transition-all flex items-center justify-center gap-3"
                >
                  {loading ? "Systeem Verwerkt..." : "Versturen naar Redactie"}
                  <Send size={16} className={loading ? "animate-pulse" : ""} />
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Link */}
        <motion.button 
          onClick={() => navigate("/")}
          className="mt-10 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mx-auto font-black uppercase text-[10px] tracking-widest"
        >
          <ArrowLeft size={14} /> Terug naar Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
}