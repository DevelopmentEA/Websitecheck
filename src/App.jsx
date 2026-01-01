import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, BookOpen, X, Mail, Send, ChevronDown, ChevronRight, Home, MessageSquare, Gavel, Layers, Lock } from 'lucide-react';

// Pagina imports
import Dashboard from './pages/Dashboard';
import TopicOne from './pages/TopicOne';
import TopicTwo from './pages/TopicTwo';
import TopicTree from './pages/TopicTree';
import TopicFour from './pages/TopicFour';
import TopicFive from './pages/TopicFive';
import TopicSix from './pages/TopicSix';
import TopicEight from './pages/TopicEight';
import TopicSeven from './pages/TopicSeven';
import TopicNine from './pages/TopicNine'; 
import TopicTen from './pages/TopicTen';
import Support from './pages/Support';
import DonateButton from './pages/Button';
import StudyMusic from './pages/StudyMusic';

// ==========================================
// 1. EMAIL POPUP (Aangepaste Stijl & Trigger)
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
        const timer = setTimeout(() => setIsVisible(true), 15000); // Iets later (15s)
        return () => clearTimeout(timer);
      }
    }
  }, [forceShow]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose(); // Reset parent state if needed
    if (!forceShow) localStorage.setItem('hasSeenEmailPopup', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="bg-[#6EE7B7] p-8 text-center relative">
              <button onClick={handleClose} className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-sm">
                <Mail className="text-[#6EE7B7]" size={28} />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {customText ? "Toegang Vereist" : "Premium Leren"}
              </h2>
            </div>
            <div className="p-8 text-center">
              {!submitted ? (
                <form 
                  action="https://docs.google.com/forms/d/e/1FAIpQLSe-xEXNDDwXJeiwMe5v4bUOOfJ0MuZZjKoBefyVRQd0n1MrKQ/formResponse"
                  method="POST" target="hidden_iframe" onSubmit={() => setSubmitted(true)}
                  className="space-y-4"
                >
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed font-medium">
                    {customText || "Wil je meer interactieve tools in de toekomst? Laat je mail achter."}
                  </p>
                  <input type="email" name="entry.1504473130" required placeholder="E-mailadres" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#6EE7B7] focus:border-[#6EE7B7] outline-none transition-all text-sm" />
                  <button type="submit" className="w-full bg-[#1F2937] text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md hover:shadow-lg">Verzenden <Send size={14}/></button>
                </form>
              ) : (
                <div className="py-6 text-emerald-600 font-bold tracking-tight">Bedankt! We houden je op de hoogte.</div>
              )}
            </div>
            <iframe name="hidden_iframe" style={{ display: 'none' }}></iframe>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ==========================================
// 2. SIDEBAR (Gereorganiseerd)
// ==========================================
const Sidebar = ({ onLockClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({ strafrecht: true, ipr: false }); // Strafrecht standaard open

  const sidebarVariants = {
    open: { width: "17rem" },
    closed: { width: "5rem" }
  };

  return (
    <motion.nav
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      transition={{ type: "spring", stiffness: 300, damping: 35 }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false);
        // We laten de menu's open staan voor betere UX, of resetten ze hier indien gewenst
      }}
      className="h-screen bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-50 overflow-hidden relative shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
    >
      {/* Header Sidebar */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100">
        <div className="w-10 h-10 bg-[#6EE7B7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Scale size={20} className="text-[#6EE7B7]" />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="ml-3 font-bold text-lg tracking-tight text-slate-800"
            >
              Lawbooks
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-grow py-6 space-y-1 overflow-y-auto no-scrollbar px-3">
        {/* Dashboard */}
        <NavLink to="/" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg relative group transition-all ${isActive ? 'bg-[#6EE7B7]/10 text-[#059669]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
          <Home size={20} className="flex-shrink-0" strokeWidth={2} />
          {isOpen && <span className="ml-3 text-sm font-semibold">Dashboard</span>}
        </NavLink>

        {/* Categorie: Strafrecht (Alles hieronder) */}
        <div className="relative group">
          <button 
            onClick={() => setOpenMenus(p => ({ ...p, strafrecht: !p.strafrecht }))}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all ${openMenus.strafrecht ? 'bg-slate-50 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Gavel size={20} className="flex-shrink-0" strokeWidth={2} />
            {isOpen && (
              <div className="flex items-center justify-between flex-1 ml-3">
                <span className="text-sm font-semibold">Strafrecht</span>
                {openMenus.strafrecht ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
              </div>
            )}
          </button>
          
          <AnimatePresence>
            {isOpen && openMenus.strafrecht && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pl-11 pr-2 space-y-1 overflow-hidden">
                <NavLink to="/SRI" className={({ isActive }) => `block py-2 px-2 rounded-md text-xs font-medium transition-colors ${isActive ? 'text-[#059669] bg-[#6EE7B7]/10' : 'text-slate-500 hover:text-slate-900'}`}>Module I: Basis</NavLink>
                <NavLink to="/SRII" className={({ isActive }) => `block py-2 px-2 rounded-md text-xs font-medium transition-colors ${isActive ? 'text-[#059669] bg-[#6EE7B7]/10' : 'text-slate-500 hover:text-slate-900'}`}>Module II: Expert</NavLink>
                <NavLink to="/SRIII" className={({ isActive }) => `block py-2 px-2 rounded-md text-xs font-medium transition-colors ${isActive ? 'text-[#059669] bg-[#6EE7B7]/10' : 'text-slate-500 hover:text-slate-900'}`}>Module III: Casus</NavLink>
                
                {/* Jurisprudentie & Pad nu hier */}
                <NavLink to="/JUR" className={({ isActive }) => `block py-2 px-2 rounded-md text-xs font-medium transition-colors ${isActive ? 'text-[#059669] bg-[#6EE7B7]/10' : 'text-slate-500 hover:text-slate-900'}`}>Jurisprudentie</NavLink>
                <NavLink to="/SRX" className={({ isActive }) => `block py-2 px-2 rounded-md text-xs font-medium transition-colors ${isActive ? 'text-[#059669] bg-[#6EE7B7]/10' : 'text-slate-500 hover:text-slate-900'}`}>Strafrecht Pad</NavLink>
                <NavLink to="/SRIV" className={({ isActive }) => `block py-2 px-2 rounded-md text-xs font-medium transition-colors ${isActive ? 'text-[#059669] bg-[#6EE7B7]/10' : 'text-slate-500 hover:text-slate-900'}`}>Extra Stof</NavLink>

                {/* LOCKED: Oefententamen */}
                <button 
                  onClick={onLockClick}
                  className="w-full text-left py-2 px-2 rounded-md text-xs font-medium text-slate-400 hover:text-slate-600 flex items-center justify-between group"
                >
                  <span>Oefententamen</span>
                  <Lock size={12} className="text-slate-300 group-hover:text-[#6EE7B7]" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Categorie: IPR */}
        <div className="relative group">
          <button 
            onClick={() => setOpenMenus(p => ({ ...p, ipr: !p.ipr }))}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all ${openMenus.ipr ? 'bg-slate-50 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <BookOpen size={20} className="flex-shrink-0" strokeWidth={2} />
            {isOpen && (
              <div className="flex items-center justify-between flex-1 ml-3">
                <span className="text-sm font-semibold">IPR</span>
                {openMenus.ipr ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
              </div>
            )}
          </button>
          
          <AnimatePresence>
            {isOpen && openMenus.ipr && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pl-11 pr-2 space-y-1 overflow-hidden">
                <NavLink to="/IPR" className={({ isActive }) => `block py-2 px-2 rounded-md text-xs font-medium transition-colors ${isActive ? 'text-[#059669] bg-[#6EE7B7]/10' : 'text-slate-500 hover:text-slate-900'}`}>
                  <span className="mr-2">💰</span> Miljoenenjacht
                </NavLink>
                <NavLink to="/IPRIII" className={({ isActive }) => `block py-2 px-2 rounded-md text-xs font-medium transition-colors ${isActive ? 'text-[#059669] bg-[#6EE7B7]/10' : 'text-slate-500 hover:text-slate-900'}`}>Oefenvragen A-D</NavLink>
                <NavLink to="/IPRIV" className={({ isActive }) => `block py-2 px-2 rounded-md text-xs font-medium transition-colors ${isActive ? 'text-[#059669] bg-[#6EE7B7]/10' : 'text-slate-500 hover:text-slate-900'}`}>Courtroom Rush</NavLink>
                
                {/* LOCKED: Oefententamen */}
                <button 
                  onClick={onLockClick}
                  className="w-full text-left py-2 px-2 rounded-md text-xs font-medium text-slate-400 hover:text-slate-600 flex items-center justify-between group"
                >
                  <span>Tentamen Training</span>
                  <Lock size={12} className="text-slate-300 group-hover:text-[#6EE7B7]" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Los: Support */}
        <NavLink to="/support" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg relative group transition-all ${isActive ? 'bg-[#6EE7B7]/10 text-[#059669]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
          <MessageSquare size={20} className="flex-shrink-0" strokeWidth={2} />
          {isOpen && <span className="ml-3 text-sm font-semibold">Support</span>}
        </NavLink>
      </div>

      <div className="p-4 border-t border-slate-100">
        <a href="https://lawbooks.nl/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-3 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all">
          <Layers size={18} />
          {isOpen && <span className="ml-3 text-xs font-bold uppercase tracking-widest">Lawbooks.nl</span>}
        </a>
      </div>
    </motion.nav>
  );
};

// ==========================================
// 3. LAYOUT & APP
// ==========================================
const useIsEmbedded = () => {
  const { search } = useLocation();
  return new URLSearchParams(search).get('embed') === 'true';
};

const MainLayout = () => {
  const isEmbedded = useIsEmbedded();
  const location = useLocation();
  
  // State voor de locked popup
  const [showLockedPopup, setShowLockedPopup] = useState(false);

  const hideSidebar = isEmbedded || location.pathname === '/SRIV' || location.pathname === '/IPRIV';

  return (
    <div className="flex h-screen w-screen bg-[#F9FAFB] overflow-hidden text-slate-900">
      {!hideSidebar && <Sidebar onLockClick={() => setShowLockedPopup(true)} />}
      
      <main className="flex-1 h-full overflow-y-auto relative">
        <div className={`min-h-full w-full ${hideSidebar ? 'p-0' : 'p-6 lg:p-10'}`}>
          <Outlet />
        </div>
      </main>

      {/* Normale Timer Popup */}
      {!hideSidebar && <EmailPopup />} 
      
      {/* Locked Feature Popup (Geforceerd) */}
      <EmailPopup 
        forceShow={showLockedPopup} 
        onClose={() => setShowLockedPopup(false)} 
        customText="Wil je meer oefententamens? Vul je mail hier in!" 
      />

      {!hideSidebar && <><StudyMusic /><DonateButton /></>}
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/SRI" element={<TopicOne />} />
        <Route path="/SRII" element={<TopicTwo />} />
        <Route path="/SRIII" element={<TopicTree />} />
        <Route path="/SRX" element={<TopicNine />} />
        <Route path="/JUR" element={<TopicTen />} />
        <Route path="/IPR" element={<TopicFour />} />
        <Route path="/IPRII" element={<TopicFive />} />
        <Route path="/IPRIII" element={<TopicSix />} />
        <Route path="/IPRIV" element={<TopicEight />} />
        <Route path="/support" element={<Support />} />
        <Route path="/SRIV" element={<TopicSeven />} />
      </Route>
    </Routes>
  </Router>
);

export default App;