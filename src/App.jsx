import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, ExternalLink, BookOpen, ShieldAlert, MessageSquare, ChevronRight, X, Mail, Send } from 'lucide-react';

// Pagina imports
import Dashboard from './pages/Dashboard';
import TopicOne from './pages/TopicOne';
import TopicTwo from './pages/TopicTwo';
import TopicTree from './pages/TopicTree';
import TopicFour from './pages/TopicFour';
import TopicFive from './pages/TopicFive';
import TopicSix from './pages/TopicSix';
import TopicSeven from './pages/TopicSeven';
import Support from './pages/Support';
import DonateButton from './pages/Button';
import StudyMusic from './pages/StudyMusic';

// ==========================================
// NEW: EMAIL POPUP COMPONENT
// ==========================================
const EmailPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check of de gebruiker de popup al eerder heeft gezien
    const hasSeen = localStorage.getItem('hasSeenEmailPopup');
    
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10000); // 10 seconden
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenEmailPopup', 'true');
  };

  const handleSubmit = (e) => {
    // We laten de browser de form submission doen naar de verborgen iframe
    setSubmitted(true);
    localStorage.setItem('hasSeenEmailPopup', 'true');
    setTimeout(() => setIsVisible(false), 3000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header met Oxford Blue */}
            <div className="bg-[#1A365D] p-8 text-center relative">
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <div className="w-16 h-16 bg-[#C5A059] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Mail className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-white italic">Toekomst van Leren</h2>
            </div>

            <div className="p-8 text-center">
              {!submitted ? (
                <>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Wil je meer <strong>interactieve leermethodes</strong> in de toekomst? Laat je mail achter en help ons bouwen aan de beste rechten-omgeving.
                  </p>
                  
                  {/* Google Forms Submission Logic */}
                  <form 
                    action="https://docs.google.com/forms/d/e/1FAIpQLSe-xEXNDDwXJeiwMe5v4bUOOfJ0MuZZjKoBefyVRQd0n1MrKQ/formResponse"
                    method="POST"
                    target="hidden_iframe"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <input 
                        type="email" 
                        name="entry.1504473130" // Jouw Google Form ID
                        required
                        placeholder="Je e-mailadres"
                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#C5A059] focus:outline-none transition-all text-[#1A365D]"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-[#1A365D] text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#152c4d] transition-all shadow-lg active:scale-[0.98]"
                    >
                      Verzenden <Send size={18} />
                    </button>
                  </form>
                  {/* Verborgen iframe om redirect van Google te voorkomen */}
                  <iframe name="hidden_iframe" id="hidden_iframe" style={{ display: 'none' }}></iframe>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="py-6"
                >
                  <div className="text-emerald-500 mb-2 font-bold text-xl text-center">Bedankt!</div>
                  <p className="text-gray-500">Je bent toegevoegd aan de lijst. We gaan snel verder!</p>
                </motion.div>
              )}
            </div>
            <div className="h-2 w-full bg-[#C5A059]" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ==========================================
// 1. Standalone Iframe Detectie
// ==========================================
const useIsEmbedded = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  return params.get('embed') === 'true';
};

const IframeGuard = () => {
  const [isAllowed, setIsAllowed] = useState(true);
  useEffect(() => {
    const inIframe = window.self !== window.top;
    const isLocalhost = window.location.hostname === 'localhost';
    if (inIframe || isLocalhost) setIsAllowed(true);
    else setIsAllowed(false);
  }, []);

  if (!isAllowed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border-t-8 border-red-600">
          <ShieldAlert size={48} className="text-red-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Beveiligde Omgeving</h1>
          <p className="text-gray-600 text-sm">Deze Module is in productie in samenwerking met lawbooks.</p>
        </div>
      </div>
    );
  }
  return <Outlet />;
};

// ==========================================
// 2. ULTRA-SLIM SIDEBAR
// ==========================================
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/SRI", label: "Strafrecht I", icon: "😔" },
    { path: "/SRII", label: "Strafrecht II", icon: "😭" },
    { path: "/SRIII", label: "Strafrecht III", icon: "👹" },
    { path: "/SRIV", label: "Extra", icon: "©️" },
    { path: "/IPR", label: "Miljoenen Jacht", icon: "💰" },
    { path: "/IPRII", label: "IPR Tentamen", icon: "🌍" },
    { path: "/IPRIII", label: "IPR A/B/C", icon: "🏛️" },
    { path: "/support", label: "Support", icon: "💬" },
  ];

  const sidebarVariants = {
    open: { width: "14rem", transition: { type: "spring", stiffness: 400, damping: 40 } },
    closed: { width: "4rem", transition: { type: "spring", stiffness: 400, damping: 40 } }
  };

  return (
    <motion.nav
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="h-screen bg-[#1A365D] text-white flex flex-col flex-shrink-0 shadow-xl z-50 overflow-hidden relative border-r border-white/5"
    >
      <div className="h-16 flex items-center px-4 border-b border-white/10 bg-[#152c4d]">
        <Scale size={24} className="text-[#C5A059] flex-shrink-0" />
        {isOpen && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-3 font-serif font-bold text-lg italic">
            Lawbooks
          </motion.span>
        )}
      </div>
      
      <div className="flex-grow py-4 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-4 py-3 transition-all duration-200 group
              ${isActive ? 'bg-[#C5A059] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}
            `}
          >
            <span className="text-xl w-6 flex justify-center">{item.icon}</span>
            {isOpen && (
              <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="ml-4 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap">
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-2 border-t border-white/10">
        <a href="https://lawbooks.nl/" target="_blank" rel="noopener noreferrer" className="flex items-center p-2 rounded-lg hover:bg-[#C5A059]/20 text-[#C5A059]">
          <BookOpen size={20} />
          {isOpen && <span className="ml-3 text-[10px] font-black uppercase">Lawbooks.nl</span>}
        </a>
      </div>
    </motion.nav>
  );
};

// ==========================================
// 3. MAIN LAYOUT
// ==========================================
const MainLayout = () => {
  const isEmbedded = useIsEmbedded();

  return (
    <div className="flex h-screen w-screen bg-[#FDFCFB] overflow-hidden relative">
      {!isEmbedded && <Sidebar />}
      
      <main className="flex-1 h-full overflow-y-auto relative">
        <div className={`min-h-full w-full ${isEmbedded ? 'p-0' : 'p-4 md:p-8'}`}>
          <Outlet />
        </div>
      </main>

      {/* Popup verschijnt alleen als NIET embedded (of pas dit aan naar wens) */}
      {!isEmbedded && <EmailPopup />}

      {!isEmbedded && (
        <>
          <StudyMusic />
          <DonateButton />
        </>
      )}
    </div>
  );
};

// ==========================================
// 4. APP COMPONENT
// ==========================================
const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/SRI" element={<TopicOne />} />
          <Route path="/SRII" element={<TopicTwo />} />
          <Route path="/SRIII" element={<TopicTree />} />
          <Route path="/IPR" element={<TopicFour />} />
          <Route path="/IPRIII" element={<TopicSix />} />
          <Route path="/support" element={<Support />} />
          <Route path="/IPRII" element={<TopicFive />} />

          <Route element={<IframeGuard />}>
             <Route path="/SRIV" element={<TopicSeven />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;