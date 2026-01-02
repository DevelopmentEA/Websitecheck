import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, BookOpen, X, Mail, Send, Gavel, 
  ArrowLeft, Play, Award, BrainCircuit, Heart 
} from 'lucide-react';

// Pagina imports (Zorg dat deze bestanden bestaan)
import TopicOne from './pages/TopicOne';       // 1. Strafrecht Basis
import TopicFour from './pages/TopicFour';     // 2. IPR Miljoenenjacht
import TopicEight from './pages/TopicEight';   // 3. Courtroom Rush
import TopicTen from './pages/TopicTen';       // 4. Jurisprudentie
import Support from './pages/Support';
import DonateButton from './pages/Button';
import StudyMusic from './pages/StudyMusic';

// ==========================================
// 1. EMAIL POPUP (Ongewijzigd, alleen styling update)
// ==========================================
const EmailPopup = ({ forceShow, onClose, customText }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (forceShow) {
      setIsVisible(true);
    } else {
      const hasSeen = localStorage.getItem('hasSeenEmailPopup');
      if (!hasSeen) {
        const timer = setTimeout(() => setIsVisible(true), 15000); 
        return () => clearTimeout(timer);
      }
    }
  }, [forceShow]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose(); 
    if (!forceShow) localStorage.setItem('hasSeenEmailPopup', 'true');
  };

  const handleSubmit = () => {
    setTimeout(() => {
      setSubmitted(true);
    }, 150);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="bg-[#1F2937] p-8 text-center relative">
              <button onClick={handleClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
              <div className="w-14 h-14 bg-[#6EE7B7] rounded-xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-lg text-black">
                <Mail size={28} />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {customText ? "Toegang Vereist" : "Premium Leren"}
              </h2>
            </div>
            
            <div className="p-8 text-center">
              {!submitted ? (
                <form 
                  action="https://docs.google.com/forms/d/e/1FAIpQLSe-xEXNDDwXJeiwMe5v4bUOOfJ0MuZZjKoBefyVRQd0n1MrKQ/formResponse"
                  method="POST" 
                  target="hidden_iframe" 
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed font-medium">
                    {customText || "Wil je toegang tot exclusieve samenvattingen en tools? Laat je mail achter."}
                  </p>
                  <input type="email" name="entry.1504473130" required placeholder="Jouw e-mailadres" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#6EE7B7] focus:border-[#6EE7B7] outline-none transition-all text-sm" />
                  <button type="submit" className="w-full bg-[#6EE7B7] text-slate-900 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#5CD6A8] transition-all shadow-md">Verzenden <Send size={14}/></button>
                </form>
              ) : (
                <div className="py-6 text-[#059669] font-bold tracking-tight">Bedankt! We houden je op de hoogte.</div>
              )}
            </div>
            <iframe name="hidden_iframe" style={{ display: 'none' }} title="hidden_frame"></iframe>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ==========================================
// 2. NIEUW DASHBOARD COMPONENT
// ==========================================
const DashboardCard = ({ title, desc, icon: Icon, to, color = "bg-white" }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(to)}
      className={`relative cursor-pointer group overflow-hidden rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 ${color}`}
    >
      <div className="p-8 h-full flex flex-col justify-between relative z-10">
        <div>
          <div className="w-12 h-12 bg-[#6EE7B7]/20 rounded-xl flex items-center justify-center mb-6 text-[#059669] group-hover:bg-[#6EE7B7] group-hover:text-slate-900 transition-colors duration-300">
            <Icon size={24} strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
        </div>
        
        <div className="mt-8 flex items-center text-sm font-bold text-[#059669] group-hover:translate-x-2 transition-transform duration-300">
          Start Module <Play size={14} className="ml-2 fill-current" />
        </div>
      </div>
      
      {/* Decoratieve achtergrond cirkel */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#6EE7B7]/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
    </motion.div>
  );
};

const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#6EE7B7]/10 text-[#059669] rounded-full text-xs font-bold uppercase tracking-wider"
        >
          <Scale size={14} /> Lawbooks Premium
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
        >
          Kies je <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#059669] to-[#6EE7B7]">Oefenmodule</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 max-w-lg mx-auto"
        >
          Selecteer hieronder een onderdeel om direct te starten met oefenen. Geen account nodig, direct toegang.
        </motion.p>
      </div>

      {/* Grid met 4 Kaarten */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <DashboardCard 
          title="Strafrecht: De Basis"
          desc="Module I: Beheers de fundamenten van het strafrecht. Ideaal voor beginnende studenten."
          icon={Gavel}
          to="/SRI"
        />
        <DashboardCard 
          title="SR: Miljoenenjacht"
          desc="Een interactieve game-show stijl quiz over Internationaal Privaatrecht. Speel voor de winst!"
          icon={BookOpen}
          to="/SR"
        />
        <DashboardCard 
          title="Courtroom Rush"
          desc="Snelle beslissingen maken in de rechtszaal. Test je parate kennis onder tijdsdruk."
          icon={BrainCircuit}
          to="/courtroom-rush"
        />
        <DashboardCard 
          title="Jurisprudentie Meester"
          desc="Diepgaande analyse van de belangrijkste arresten. Weet jij welk arrest van toepassing is?"
          icon={Award}
          to="/jurisprudentie"
        />
      </div>

      {/* Footer link */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-20 text-center"
      >
        <a href="https://lawbooks.nl" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-800 text-sm font-semibold transition-colors">
          © 2024 Lawbooks Education
        </a>
      </motion.div>
    </div>
  );
};

// ==========================================
// 3. LAYOUT (Zonder Sidebar, Met Terug-knop)
// ==========================================
const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/';

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] text-slate-900 relative">
      
      {/* Navigatie Bar (Alleen zichtbaar als NIET op dashboard) */}
      {!isDashboard && (
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between"
        >
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-[#059669] hover:bg-[#6EE7B7]/10 px-4 py-2 rounded-lg transition-all font-bold text-sm"
          >
            <ArrowLeft size={18} />
            Terug naar Dashboard
          </button>

          <div className="font-bold text-lg tracking-tight flex items-center gap-2">
             <Scale size={20} className="text-[#6EE7B7]" /> Lawbooks
          </div>
        </motion.div>
      )}

      {/* Main Content Area */}
      <main className={`w-full min-h-screen ${!isDashboard ? 'pt-24 px-6 md:px-12 pb-12' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Elements */}
      <EmailPopup /> 
      <StudyMusic />
      <DonateButton />
    </div>
  );
};

// ==========================================
// 4. APP ROUTING
// ==========================================
const App = () => (
  <Router>
    <Routes>
      <Route element={<MainLayout />}>
        {/* Het Dashboard is nu de Homepage */}
        <Route path="/" element={<Dashboard />} />
        
        {/* De 4 Geselecteerde Pagina's */}
        <Route path="/SRI" element={<TopicOne />} />
        <Route path="/SR" element={<TopicFour />} />
        <Route path="/courtroom-rush" element={<TopicEight />} />
        <Route path="/jurisprudentie" element={<TopicTen />} />
        
        {/* Extra pagina voor support */}
        <Route path="/support" element={<Support />} />
      </Route>
    </Routes>
  </Router>
);

export default App;