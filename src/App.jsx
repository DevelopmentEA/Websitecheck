import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, BookOpen, X, Mail, Send, ChevronDown, ChevronRight, Home, MessageSquare, Layers, Lock, GraduationCap, Gavel, Gamepad2 } from 'lucide-react';

// Pagina imports (Gefilterd op IPR)
import Dashboard from './pages/Dashboard';
import TopicOne from './pages/TopicOne';   // Nu: Ultiem IPR Tentamen
import TopicFour from './pages/TopicFour'; // Miljoenenjacht
import TopicSix from './pages/TopicSix';   // Oefenvragen A-D
import TopicEight from './pages/TopicEight'; // Courtroom Rush
import TopicTree from './pages/TopicTree'; // Jurisprudentie 
import Support from './pages/Support';
import DonateButton from './pages/Button';
import StudyMusic from './pages/StudyMusic';

// ==========================================
// 1. EMAIL POPUP
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
                {customText ? "Toegang Vereist" : "Lawbooks Premium"}
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
                    {customText || "Wil je toegang tot exclusieve IPR samenvattingen en tools? Laat je mail achter."}
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
// 2. SIDEBAR
// ==========================================
const Sidebar = ({ onLockClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  // We zetten het menu standaard open omdat er nu maar één hoofdcategorie is
  const [openMenus, setOpenMenus] = useState({ ipr: true }); 

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
      onMouseLeave={() => setIsOpen(false)}
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

        {/* Categorie: IPR (Internationaal Publiekrecht) */}
        <div className="relative group">
          <button 
            onClick={() => setOpenMenus(p => ({ ...p, ipr: !p.ipr }))}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all ${openMenus.ipr ? 'bg-slate-50 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <BookOpen size={20} className="flex-shrink-0" strokeWidth={2} />
            {isOpen && (
              <div className="flex items-center justify-between flex-1 ml-3">
                <span className="text-sm font-semibold">IPR Modules</span>
                {openMenus.ipr ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
              </div>
            )}
          </button>
          
          <AnimatePresence>
            {isOpen && openMenus.ipr && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pl-4 pr-2 space-y-1 overflow-hidden">
                
                {/* De Grote Modules */}
                <div className="pt-2 pb-1 pl-7 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Oefenen</div>
                
                <NavLink to="/ipr-ultiem" className={({ isActive }) => `flex items-center py-2 px-3 rounded-md text-xs font-medium transition-colors ${isActive ? 'text-[#059669] bg-[#6EE7B7]/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                   <GraduationCap size={14} className="mr-2 opacity-70" />
                   Ultiem IPR Tentamen
                </NavLink>

                <NavLink to="/ipr-vragen" className={({ isActive }) => `flex items-center py-2 px-3 rounded-md text-xs font-medium transition-colors ${isActive ? 'text-[#059669] bg-[#6EE7B7]/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                   <BookOpen size={14} className="mr-2 opacity-70" />
                   Oefenvragen A-D
                </NavLink>
		<NavLink to="/ipr-Jurisprudentie" className={({ isActive }) => `flex items-center py-2 px-3 rounded-md text-xs font-medium transition-colors ${isActive ? 'text-[#059669] bg-[#6EE7B7]/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                   <BookOpen size={14} className="mr-2 opacity-70" />
                   Jurisprudentie Gids
                </NavLink>

                <div className="pt-3 pb-1 pl-7 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Games</div>

                <NavLink to="/ipr-miljoenen" className={({ isActive }) => `flex items-center py-2 px-3 rounded-md text-xs font-medium transition-colors ${isActive ? 'text-[#059669] bg-[#6EE7B7]/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                  <span className="mr-2 text-sm">🔝</span> Miljoenenjacht
                </NavLink>
                
                <NavLink to="/ipr-courtroom" className={({ isActive }) => `flex items-center py-2 px-3 rounded-md text-xs font-medium transition-colors ${isActive ? 'text-[#059669] bg-[#6EE7B7]/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                  <Gavel size={14} className="mr-2 opacity-70" />
                  Courtroom Rush
                </NavLink>
                
                {/* LOCKED: Voorbeeld van een feature voor later */}
                <button 
                  onClick={onLockClick}
                  className="w-full text-left py-2 px-3 rounded-md text-xs font-medium text-slate-400 hover:text-slate-600 flex items-center justify-between group mt-2"
                >
                  <span className="flex items-center"><Gamepad2 size={14} className="mr-2 opacity-50"/> IPR Masterclass</span>
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
// 3. LAYOUT & APP CONFIGURATIE
// ==========================================
const useIsEmbedded = () => {
  const { search } = useLocation();
  return new URLSearchParams(search).get('embed') === 'true';
};

const MainLayout = () => {
  const isEmbedded = useIsEmbedded();
  const [showLockedPopup, setShowLockedPopup] = useState(false);

  // Verberg sidebar alleen in embed mode (geen specifieke routes meer nodig)
  const hideSidebar = isEmbedded;

  return (
    <div className="flex h-screen w-screen bg-[#F9FAFB] overflow-hidden text-slate-900">
      {!hideSidebar && <Sidebar onLockClick={() => setShowLockedPopup(true)} />}
      
      <main className="flex-1 h-full overflow-y-auto relative">
        <div className={`min-h-full w-full ${hideSidebar ? 'p-0' : 'p-6 lg:p-10'}`}>
          <Outlet />
        </div>
      </main>

      {!hideSidebar && <EmailPopup />} 
      
      <EmailPopup 
        forceShow={showLockedPopup} 
        onClose={() => setShowLockedPopup(false)} 
        customText="Deze IPR Masterclass is momenteel in ontwikkeling. Blijf op de hoogte!" 
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
        
        {/* IPR ROUTES */}
        {/* TopicOne was de oude SR module, nu omgebouwd naar Ultiem IPR */}
        <Route path="/ipr-ultiem" element={<TopicOne />} /> 
        
        {/* De Games & Oefeningen */}
        <Route path="/ipr-miljoenen" element={<TopicFour />} />
        <Route path="/ipr-vragen" element={<TopicSix />} />
        <Route path="/ipr-courtroom" element={<TopicEight />} />
        <Route path="/ipr-Jurisprudentie" element={<TopicTree />} />
        {/* Algemeen */}
        <Route path="/support" element={<Support />} />
      </Route>
    </Routes>
  </Router>
);

export default App;