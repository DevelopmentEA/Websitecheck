import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Scale, BookOpen, Gavel, ArrowLeft, Play, Award, BrainCircuit, Zap, Target
} from 'lucide-react';

// Pagina imports
import TopicOne from './pages/TopicOne';     
import TopicFour from './pages/TopicTwo';   
import TopicEight from './pages/TopicTree'; 
import TopicTen from './pages/TopicFour';     
=======
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
>>>>>>> 1d6bd31885c81de89a4c63b93a83452b7f65ebe3
import Support from './pages/Support';
import DonateButton from './pages/Button';

<<<<<<< HEAD
// --- ANIMATIE CONSTANTEN ---
const transition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] };
=======
// ==========================================
// 1. EMAIL POPUP
// ==========================================
const EmailPopup = ({ forceShow, onClose, customText }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
>>>>>>> 1d6bd31885c81de89a4c63b93a83452b7f65ebe3

const pageVariants = {
  initial: { opacity: 0, scale: 0.98, y: 10 },
  enter: { opacity: 1, scale: 1, y: 0, transition },
  exit: { opacity: 0, scale: 1.02, y: -10, transition: { duration: 0.4 } }
};

// --- PERFORMANCE CHECK ---
const usePerformanceMode = () => {
  const [isLowPower, setIsLowPower] = useState(false);
  useEffect(() => {
<<<<<<< HEAD
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    setIsLowPower(isMobile);
  }, []);
  return isLowPower;
};

// --- ACHTERGROND: PULSEREND VIERKANT ---
const BackgroundPulsator = ({ isLowPower }) => (
  <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isLowPower ? { scale: 1, opacity: 1 } : { scale: [1, 1.03, 1], opacity: 1 }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="w-[95%] h-[85%] max-w-6xl bg-[#6EE7B7]/5 border border-[#6EE7B7]/10 rounded-[3rem] md:rounded-[5rem]"
    />
  </div>
);

// --- TILT CARD (Met verfijnde klik-animatie) ---
const TiltCard = ({ title, desc, icon: Icon, to, index }) => {
  const navigate = useNavigate();
  const isLowPower = usePerformanceMode();
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e) => {
    if (isLowPower) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
=======
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
>>>>>>> 1d6bd31885c81de89a4c63b93a83452b7f65ebe3

  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 20 },
        enter: { opacity: 1, y: 0, transition: { ...transition, delay: index * 0.1 } }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ 
        rotateX: isLowPower ? 0 : rotateX, 
        rotateY: isLowPower ? 0 : rotateY, 
        transformStyle: "preserve-3d" 
      }}
      onClick={() => navigate(to)}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer"
    >
      <div 
        style={{ transform: isLowPower ? "none" : "translateZ(30px)" }}
        className="h-full bg-white border border-slate-100 p-6 md:p-10 rounded-[2.5rem] shadow-sm group-hover:shadow-xl group-hover:border-[#6EE7B7]/30 transition-all duration-500"
      >
        <div className="w-12 h-12 md:w-16 md:h-16 bg-[#6EE7B7]/10 rounded-2xl flex items-center justify-center mb-8 text-[#059669] group-hover:bg-[#6EE7B7] group-hover:text-white transition-all duration-500">
          <Icon size={30} strokeWidth={2} />
        </div>
        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 tracking-tight">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-8 opacity-80">{desc}</p>
        <div className="flex items-center text-sm font-black uppercase tracking-widest text-[#059669]">
          Start Tool <Zap size={14} className="ml-2 fill-current" />
        </div>
      </div>
    </motion.div>
  );
};

<<<<<<< HEAD
// --- DASHBOARD ---
const Dashboard = () => {
  const isLowPower = usePerformanceMode();

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="max-w-6xl mx-auto py-12 md:py-24 px-4 md:px-8 relative"
    >
      <BackgroundPulsator isLowPower={isLowPower} />

      <div className="flex flex-col md:flex-row justify-between items-start mb-16 md:mb-24 gap-8">
        <div className="text-left w-full">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[#059669] mb-6"
          >
            <Target size={14} /> 
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Lawbooks Intelligence 2026</span>
          </motion.div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]">
            Kies je <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#059669] via-[#6EE7B7] to-[#059669] bg-[length:200%_auto] animate-gradient">Oefentool</span>
          </h1>
        </div>
        
        <motion.div 
          whileHover={{ rotate: 5, scale: 1.1 }}
          className="relative shrink-0"
        >
          <img src="/foto.jpg" alt="Profile" className="w-20 h-20 md:w-32 md:h-32 rounded-[2rem] border-4 border-white shadow-2xl object-cover" />
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#6EE7B7] rounded-full border-4 border-white flex items-center justify-center shadow-lg">
            <Zap size={18} className="text-white fill-current" />
          </div>
        </motion.div>
      </div>

      <motion.div 
        variants={{ enter: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10"
      >
        <TiltCard index={0} title="Strafrecht: Basis" desc="Beheers de fundamenten van het materiële strafrecht." icon={Gavel} to="/SRI" />
        <TiltCard index={1} title="SR: Miljoenenjacht" desc="Strijd voor de hoofdprijs in deze IPR-quiz." icon={BookOpen} to="/SR" />
        <TiltCard index={2} title="Courtroom Rush" desc="Maak juridische beslissingen onder tijdsdruk." icon={BrainCircuit} to="/courtroom-rush" />
        <TiltCard index={3} title="Jurisprudentie" desc="Analyseer de meest invloedrijke arresten." icon={Award} to="/jurisprudentie" />
      </motion.div>
    </motion.div>
  );
};

// --- MAIN LAYOUT ---
const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/';

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] text-slate-900 relative selection:bg-[#6EE7B7]/30">
      {/* Subtiele Loading Line */}
      <motion.div 
        key={location.pathname + "-loader"}
        initial={{ width: "0%", opacity: 1 }}
        animate={{ width: "100%", opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed top-0 left-0 h-[3px] bg-[#6EE7B7] z-[60] shadow-[0_0_10px_#6EE7B7]"
=======
      {!hideSidebar && <EmailPopup />} 
      
      <EmailPopup 
        forceShow={showLockedPopup} 
        onClose={() => setShowLockedPopup(false)} 
        customText="Deze IPR Masterclass is momenteel in ontwikkeling. Blijf op de hoogte!" 
>>>>>>> 1d6bd31885c81de89a4c63b93a83452b7f65ebe3
      />

      {!isDashboard && (
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between"
        >
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-slate-900 font-black text-[10px] uppercase tracking-widest hover:text-[#059669] transition-colors"
          >
            <ArrowLeft size={16} /> Terug naar Dashboard
          </button>
          <div className="flex items-center gap-2 font-black italic text-sm tracking-tighter">
             <Scale size={18} className="text-[#6EE7B7]" /> LAWBOOKS
          </div>
        </motion.div>
      )}

      <main className={`relative ${!isDashboard ? 'pt-24' : ''}`}>
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      
      <DonateButton />
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
<<<<<<< HEAD
        <Route path="/SRI" element={<TopicOne />} />
        <Route path="/SR" element={<TopicFour />} />
        <Route path="/courtroom-rush" element={<TopicEight />} />
        <Route path="/jurisprudentie" element={<TopicTen />} />
=======
        
        {/* IPR ROUTES */}
        {/* TopicOne was de oude SR module, nu omgebouwd naar Ultiem IPR */}
        <Route path="/ipr-ultiem" element={<TopicOne />} /> 
        
        {/* De Games & Oefeningen */}
        <Route path="/ipr-miljoenen" element={<TopicFour />} />
        <Route path="/ipr-vragen" element={<TopicSix />} />
        <Route path="/ipr-courtroom" element={<TopicEight />} />
        <Route path="/ipr-Jurisprudentie" element={<TopicTree />} />
        {/* Algemeen */}
>>>>>>> 1d6bd31885c81de89a4c63b93a83452b7f65ebe3
        <Route path="/support" element={<Support />} />
      </Route>
    </Routes>
  </Router>
);

export default App;