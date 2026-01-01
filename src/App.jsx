import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, BookOpen, X, Mail, Send, ChevronDown, ChevronRight, Home, MessageSquare, Zap, Gavel, Layers } from 'lucide-react';

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
// 1. EMAIL POPUP
// ==========================================
const EmailPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenEmailPopup');
    if (!hasSeen) {
      const timer = setTimeout(() => setIsVisible(true), 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenEmailPopup', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A365D]/40 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/20"
          >
            <div className="bg-[#1A365D] p-8 text-center relative">
              {!submitted && (
                <button onClick={handleClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              )}
              <div className="w-14 h-14 bg-[#C5A059] rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-lg">
                <Mail className="text-white" size={28} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-white italic">Premium Leren</h2>
            </div>
            <div className="p-8 text-center">
              {!submitted ? (
                <form 
                  action="https://docs.google.com/forms/d/e/1FAIpQLSe-xEXNDDwXJeiwMe5v4bUOOfJ0MuZZjKoBefyVRQd0n1MrKQ/formResponse"
                  method="POST" target="hidden_iframe" onSubmit={() => setSubmitted(true)}
                  className="space-y-4"
                >
                  <p className="text-slate-500 text-sm mb-4">Wil je meer interactieve tools in de toekomst? Laat je mail achter.</p>
                  <input type="email" name="entry.1504473130" required placeholder="E-mailadres" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] outline-none transition-all" />
                  <button type="submit" className="w-full bg-[#1A365D] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-[#152c4d] transition-all">Verzenden <Send size={14}/></button>
                </form>
              ) : (
                <div className="py-6 text-emerald-600 font-bold tracking-tight">Bedankt! We nemen je mee op de lijst.</div>
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
// 2. ULTRA SLEEK SIDEBAR
// ==========================================
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({ strafrecht: false, ipr: false });

  const sidebarVariants = {
    open: { width: "16rem" },
    closed: { width: "4.5rem" }
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
        setOpenMenus({ strafrecht: false, ipr: false });
      }}
      className="h-screen bg-[#1A365D] text-white flex flex-col flex-shrink-0 z-50 overflow-hidden relative border-r border-white/5 shadow-2xl"
    >
      <div className="h-20 flex items-center px-6 bg-[#152c4d]/50">
        <Scale size={22} className="text-[#C5A059] flex-shrink-0" />
        <AnimatePresence>
          {isOpen && (
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="ml-4 font-serif font-bold text-lg italic tracking-tight"
            >
              Lawbooks
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-grow py-6 space-y-1 overflow-y-auto no-scrollbar">
        {/* Dashboard */}
        <NavLink to="/" className={({ isActive }) => `flex items-center px-6 py-3 relative group transition-colors ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
          <Home size={18} className="flex-shrink-0" />
          {isOpen && <span className="ml-4 text-[10px] uppercase tracking-[0.2em] font-medium">Dashboard</span>}
          <div className="absolute left-0 w-1 h-4 bg-[#C5A059] rounded-r-full opacity-0 group-[.active]:opacity-100 transition-opacity" />
        </NavLink>

        {/* Categorie: Strafrecht */}
        <div className="py-1 relative group">
          <button 
            onClick={() => setOpenMenus(p => ({ ...p, strafrecht: !p.strafrecht }))}
            className={`w-full flex items-center px-6 py-3 text-left transition-colors relative ${openMenus.strafrecht ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Scale size={18} className="flex-shrink-0" />
            {isOpen && (
              <div className="flex items-center justify-between flex-1 ml-4">
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Strafrecht</span>
                {openMenus.strafrecht ? <ChevronDown size={12} opacity={0.5} /> : <ChevronRight size={12} opacity={0.5} />}
              </div>
            )}
            <div className={`absolute left-0 w-1 h-4 bg-[#C5A059] rounded-r-full transition-opacity ${openMenus.strafrecht ? 'opacity-100' : 'opacity-0'}`} />
          </button>
          
          <AnimatePresence>
            {isOpen && openMenus.strafrecht && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pl-12 space-y-1 overflow-hidden bg-[#152c4d]/30">
                {[
                  { path: "/SRI", label: "Module I" },
                  { path: "/SRII", label: "Module II" },
                  { path: "/SRIII", label: "Module III" },
                  { path: "/IPR", label: "Miljoenenjacht", icon: "💰" },
                ].map(sub => (
                  <NavLink key={sub.path} to={sub.path} className={({ isActive }) => `block py-2 text-[9px] uppercase tracking-widest transition-colors ${isActive ? 'text-[#C5A059]' : 'text-slate-500 hover:text-slate-300'}`}>
                    {sub.icon && <span className="mr-2">{sub.icon}</span>}
                    {sub.label}
                  </NavLink>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Categorie: IPR */}
        <div className="py-1 relative group">
          <button 
            onClick={() => setOpenMenus(p => ({ ...p, ipr: !p.ipr }))}
            className={`w-full flex items-center px-6 py-3 text-left transition-colors relative ${openMenus.ipr ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <BookOpen size={18} className="flex-shrink-0" />
            {isOpen && (
              <div className="flex items-center justify-between flex-1 ml-4">
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">IPR</span>
                {openMenus.ipr ? <ChevronDown size={12} opacity={0.5} /> : <ChevronRight size={12} opacity={0.5} />}
              </div>
            )}
            <div className={`absolute left-0 w-1 h-4 bg-[#C5A059] rounded-r-full transition-opacity ${openMenus.ipr ? 'opacity-100' : 'opacity-0'}`} />
          </button>
          
          <AnimatePresence>
            {isOpen && openMenus.ipr && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pl-12 space-y-1 overflow-hidden bg-[#152c4d]/30">
                {[
                  { path: "/IPRII", label: "Tentamen Training" },
                  { path: "/IPRIII", label: "Oefenvragen A-D" },
                  { path: "/IPRIV", label: "Courtroom Rush" },
                ].map(sub => (
                  <NavLink key={sub.path} to={sub.path} className={({ isActive }) => `block py-2 text-[9px] uppercase tracking-widest transition-colors ${isActive ? 'text-[#C5A059]' : 'text-slate-500 hover:text-slate-300'}`}>
                    {sub.label}
                  </NavLink>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Standalone: Strafrecht Pad */}
        <NavLink to="/SRX" className={({ isActive }) => `flex items-center px-6 py-3 relative group transition-colors ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
          <Zap size={18} className="flex-shrink-0" />
          {isOpen && <span className="ml-4 text-[10px] uppercase tracking-[0.2em] font-medium">Strafrecht Pad</span>}
          <div className="absolute left-0 w-1 h-4 bg-[#C5A059] rounded-r-full opacity-0 group-[.active]:opacity-100 transition-opacity" />
        </NavLink>

        {/* Standalone: Jurisprudentie Toets */}
        <NavLink to="/JUR" className={({ isActive }) => `flex items-center px-6 py-3 relative group transition-colors ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
          <Gavel size={18} className="flex-shrink-0" />
          {isOpen && <span className="ml-4 text-[10px] uppercase tracking-[0.2em] font-medium">Jurisprudentie Toets</span>}
          <div className="absolute left-0 w-1 h-4 bg-[#C5A059] rounded-r-full opacity-0 group-[.active]:opacity-100 transition-opacity" />
        </NavLink>

        {/* Standalone: Extra Stof (LOS GEPLAATST) */}
        <NavLink to="/SRIV" className={({ isActive }) => `flex items-center px-6 py-3 relative group transition-colors ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
          <Layers size={18} className="flex-shrink-0" />
          {isOpen && <span className="ml-4 text-[10px] uppercase tracking-[0.2em] font-medium">Extra Stof</span>}
          <div className="absolute left-0 w-1 h-4 bg-[#C5A059] rounded-r-full opacity-0 group-[.active]:opacity-100 transition-opacity" />
        </NavLink>

        {/* Support */}
        <NavLink to="/support" className={({ isActive }) => `flex items-center px-6 py-3 relative group transition-colors ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
          <MessageSquare size={18} className="flex-shrink-0" />
          {isOpen && <span className="ml-4 text-[10px] uppercase tracking-[0.2em] font-medium">Support</span>}
          <div className="absolute left-0 w-1 h-4 bg-[#C5A059] rounded-r-full opacity-0 group-[.active]:opacity-100 transition-opacity" />
        </NavLink>
      </div>

      <div className="p-4 border-t border-white/5">
        <a href="https://lawbooks.nl/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-3 rounded-xl hover:bg-[#C5A059]/10 text-[#C5A059] transition-all">
          <BookOpen size={16} />
          {isOpen && <span className="ml-3 font-bold text-[9px] uppercase tracking-[0.2em]">Lawbooks.nl</span>}
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
  
  // Sidebar verbergen als de URL '/SRIV' (Extra Stof) is of als het een embed is
  const hideSidebar = isEmbedded || location.pathname === '/SRIV';

  return (
    <div className="flex h-screen w-screen bg-[#F8F9FA] overflow-hidden">
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 h-full overflow-y-auto relative">
        <div className={`min-h-full w-full ${hideSidebar ? 'p-0' : 'p-6 lg:p-10'}`}>
          <Outlet />
        </div>
      </main>
      {!hideSidebar && <EmailPopup />}
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