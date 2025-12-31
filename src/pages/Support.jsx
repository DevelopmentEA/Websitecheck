import React, { useState } from "react";

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
          console.error(err);
          setError("Er ging iets mis. Probeer het later opnieuw.");
      } finally {
          setLoading(false);
      }
  };

  if (submitted) {
      return (
          <div className="max-w-xl mx-auto mt-10 p-10 bg-white rounded-xl shadow-lg border border-slate-200 text-center">
              <div className="text-6xl mb-4">⚖️</div>
              <h3 className="text-2xl font-serif font-bold text-[#1A365D] mb-2">Bedankt!</h3>
              <p className="text-slate-500 mb-6">Jouw feedback is ontvangen en wordt verwerkt.</p>
              <button 
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 bg-[#1A365D] text-white rounded hover:bg-[#2a4a7f]"
              >
                  Nieuwe melding
              </button>
          </div>
      );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-6">
      <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-200">
        <div className="border-b-2 border-[#C5A059] pb-4 mb-6">
            <h2 className="text-2xl font-serif font-bold text-[#1A365D]">Support & Feedback</h2>
            <p className="text-slate-500 text-sm mt-1">Foutje gezien in de stof? Laat het ons weten.</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded border-l-4 border-red-800 mb-4 text-sm">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-[#1A365D] uppercase tracking-wider mb-2">Mail</label>
                <input 
                    type="text" 
                    name="naam"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors" 
                    placeholder="Jouw email-adres..."
                    value={formData.naam} 
                    onChange={handleChange} 
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-[#1A365D] uppercase tracking-wider mb-2">Opmerking / Correctie</label>
                <textarea 
                    name="bericht"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded h-32 focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors resize-y" 
                    placeholder="Omschrijf de fout of je vraag..."
                    value={formData.bericht} 
                    onChange={handleChange} 
                    required 
                />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-[#1A365D] text-white font-bold uppercase tracking-wider rounded hover:bg-[#2a4a7f] disabled:opacity-50 disabled:cursor-wait transition-colors"
            >
                {loading ? "Versturen..." : "Versturen"}
            </button>
        </form>
      </div>
    </div>
  );
}