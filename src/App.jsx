import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Outlet, useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Scale, BookOpen, Gavel, ArrowLeft, Play, Award, BrainCircuit, Zap, Target, AlertTriangle, Heart, Maximize2 } from 'lucide-react';

// Focus Mode Import
import Zenmode from './Zenmode';

// Pagina imports
import TopicOne from './pages/TopicOne';      
import TopicEight from './pages/TopicTree';  
import TopicTen from './pages/TopicFour';      
import Support from './pages/Support';

// --- CONFIGURATIE: MASTER DATA PER VAK ---
const masterData = {
  "EU-neo-2026": {
    title: "EU Recht",
    accent: "#6EE7B7",
    tag: "Lawbooks premium 2026",
    path: "/course/EU-recht"
  },
  "sr1-premium-k92": {
    title: "Grondslagen Recht",
    accent: "#6EE7B7",
    tag: "Lawbooks Premium 2026",
    path: "/course/grondslagen"
  },
  "bestuursrecht-x72": {
    title: "Bestuursrecht",
    accent: "#6EE7B7",
    tag: "Lawbooks Premium 2026",
    path: "/course/bestuursrecht"
  }
};

// Generieke kaarten
const genericCards = [
  { title: "Oefenvragen Matrix", desc: "Toets de stof op een flexiebele manier.", icon: Gavel, to: "SRI" },
  { title: "Courtroom Rush", desc: "Maak beslissingen onder tijdsdruk.", icon: BrainCircuit, to: "courtroom-rush" },
  { title: "Het Tentamen", desc: "Ben je echt locked in...", icon: Award, to: "jurisprudentie" }
];

// --- STRIKTE SECURITY WRAPPER (IFRAME ONLY) ---
const SecurityWrapper = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(true);
  const { subjectSlug } = useParams();

  useEffect(() => {
    // 1. Omgeving checken
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
    
    // 2. Iframe check: Ben ik geladen in een ander venster?
    const isInIframe = window.self !== window.top;

    // 3. Referrer check: Komt het verzoek van een goedgekeurd domein?
    const referrer = document.referrer;
    const allowedDomains = ['lawbooks.online', 'testelbert.learnworlds.com'];
    const isAllowedReferrer = allowedDomains.some(domain => 
      referrer !== "" && referrer.includes(domain)
    );

    // 4. Data check: Is dit vak bekend?
    const isValidSlug = !!masterData[subjectSlug];

    // Handhaving: Alleen op productie-omgevingen
    if (!isLocal) {
      // We weigeren toegang als:
      // - Het vak niet bestaat
      // - OF de site NIET in een iframe zit
      // - OF de referrer niet klopt (bijv. directe link zonder herkomst)
      if (!isValidSlug || !isInIframe || !isAllowedReferrer) {
        setIsAuthorized(false);
      }
    }
  }, [subjectSlug]);

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="max-w-md p-10 rounded-[3rem] border border-red-500/30 bg-red-500/5 backdrop-blur-xl"
        >
          <AlertTriangle size={64} className="text-red-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-white font-black text-2xl uppercase tracking-tighter mb-4 italic">Toegang Geweigerd</h2>
          <p className="text-red-400 font-bold text-sm leading-relaxed mb-6">
            Deze module is uitsluitend toegankelijk via de geautoriseerde Lawbooks leeromgeving. Directe toegang is uitgeschakeld.
          </p>
          <div className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
            Protocol: SEC_IFRAME_ONLY <br />
            Status: Unauthorized_Environment
          </div>
        </motion.div>
      </div>
    );
  }
  return children;
};

// --- REST VAN DE COMPONENTEN ---

const MiniDonateButton = () => {
  const navigate = useNavigate();
  const { subjectSlug } = useParams();
  return (
    <motion.button
      // FIX: /module/ naar /course/
      onClick={() => navigate(`/course/${subjectSlug}/support`)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.6, scale: 1 }}
      whileHover={{ opacity: 1, scale: 1.1, backgroundColor: '#6EE7B7' }}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-lg border border-slate-200/50 rounded-full shadow-sm group transition-colors duration-300"
      title="Support Lawbooks"
    >
      <Heart size={16} className="text-slate-900 group-hover:fill-black group-hover:text-black transition-colors" />
      <span className="absolute right-12 px-2 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
        Support
      </span>
    </motion.button>
  );
};

const transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

const pageVariants = {
  initial: { opacity: 0, scale: 0.98, y: 10 },
  enter: { 
    opacity: 1, scale: 1, y: 0, 
    transition: { ...transition, when: "beforeChildren", staggerChildren: 0.05 } 
  },
  exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.3 } }
};

const usePerformanceMode = () => {
  const [isLowPower, setIsLowPower] = useState(false);
  useEffect(() => {
    setIsLowPower(window.matchMedia("(pointer: coarse)").matches);
  }, []);
  return isLowPower;
};

const BackgroundPulsator = ({ isLowPower, color }) => (
  <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isLowPower ? { opacity: 1, scale: 1 } : { opacity: 1, scale: [1, 1.02, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      style={{ backgroundColor: `${color}0D`, borderColor: `${color}1A` }}
      className="w-[98%] h-[80%] max-w-6xl border rounded-[3rem] md:rounded-[4rem]"
    />
  </div>
);

const TiltCard = ({ title, desc, icon: Icon, to, index, color }) => {
  const navigate = useNavigate();
  const { subjectSlug } = useParams();
  const isLowPower = usePerformanceMode();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  return (
    <motion.div
      variants={{ initial: { opacity: 0, y: 15 }, enter: { opacity: 1, y: 0, transition: { ...transition, delay: index * 0.05 } } }}
      onMouseMove={(e) => { if (!isLowPower) { const rect = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - rect.left) / rect.width - 0.5); y.set((e.clientY - rect.top) / rect.height - 0.5); }}}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: isLowPower ? 0 : rotateX, rotateY: isLowPower ? 0 : rotateY, transformStyle: "preserve-3d" }}
      // FIX: /module/ naar /course/
      onClick={() => navigate(`/course/${subjectSlug}/${to}`)}
      whileTap={{ scale: 0.98 }}
      className="relative group cursor-pointer w-full"
    >
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-[2.5rem] shadow-sm group-hover:shadow-xl transition-all duration-500 flex items-center gap-6">
        <div style={{ color: color, backgroundColor: `${color}1A` }} className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#6EE7B7] group-hover:text-white transition-all duration-300">
          <Icon size={32} strokeWidth={2} />
        </div>
        <div className="flex-grow">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-1 tracking-tight">{title}</h3>
          <p className="text-slate-500 text-sm opacity-80">{desc}</p>
        </div>
        <div style={{ color: color }} className="hidden md:flex items-center text-[10px] font-black uppercase tracking-widest shrink-0">
          Start <Zap size={14} className="ml-1 fill-current" />
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { subjectSlug } = useParams();
  const data = masterData[subjectSlug];
  const isLowPower = usePerformanceMode();

  if (!data) return null;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit" className="max-w-4xl mx-auto py-8 md:py-12 px-4 md:px-8 relative">
      <BackgroundPulsator isLowPower={isLowPower} color={data.accent} />
      <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
        <div className="text-left w-full">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-3" style={{ color: data.accent }}>
            <Target size={14} /> <span className="text-[9px] font-black uppercase tracking-[0.3em]">{data.tag}</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight italic">
            Kies je <span className="animate-gradient text-transparent bg-clip-text pr-2">Oefenmodule</span>
          </h1>
          <p className="mt-4 text-slate-500 text-sm md:text-base max-w-2xl">Kies een van de onderstaande tools om je vaardigheden te trainen.</p>
        </div>
        <motion.img whileHover={{ rotate: 5, scale: 1.1 }} src="/foto.jpg" alt="Logo" className="w-20 h-20 md:w-24 md:h-24 rounded-3xl border-2 border-white shadow-xl object-cover shrink-0" />
      </div>
      <div className="flex flex-col gap-4 md:gap-6 max-w-3xl">
        {genericCards.map((card, idx) => (
          <TiltCard key={idx} {...card} index={idx} color={data.accent} />
        ))}
      </div>
    </motion.div>
  );
};

const MainLayout = () => {
  const { subjectSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isZenActive, setIsZenActive] = useState(false);
  
  // FIX: /module/ naar /course/ voor correcte detectie
  const isDashboard = location.pathname === `/course/${subjectSlug}`;
  const data = masterData[subjectSlug];

  return (
    <SecurityWrapper>
      <div className="min-h-screen w-full bg-[#F9FAFB] text-slate-900 relative selection:bg-[#6EE7B7]/30">
        
        {/* ZEN MODE OVERLAY */}
        <Zenmode isActive={isZenActive} onClose={() => setIsZenActive(false)} />

        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ width: "0%" }} animate={{ width: "100%" }} exit={{ opacity: 0 }} className="fixed top-0 left-0 h-[2px] bg-[#6EE7B7] z-[60]" />
        </AnimatePresence>

        {!isDashboard && (
          <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-3 flex items-center justify-between">
            {/* FIX: /module/ naar /course/ */}
            <button onClick={() => navigate(`/course/${subjectSlug}`)} className="flex items-center gap-2 text-slate-900 font-black text-[9px] uppercase tracking-widest hover:text-[#059669] transition-colors">
              <ArrowLeft size={14} /> Terug naar Dashboard
            </button>
            <div className="flex items-center gap-2 font-black italic text-xs tracking-tighter uppercase"><Scale size={16} className="text-[#6EE7B7]" /> Lawbooks</div>
          </motion.nav>
        )}

        <main className={`relative ${!isDashboard ? 'pt-20' : ''}`}>
          <AnimatePresence mode="wait">
            <div key={location.pathname}><Outlet /></div>
          </AnimatePresence>
        </main>
        
        {/* FOCUS KNOP (LINKSONDER) */}
        {!isZenActive && (
          <motion.button
            onClick={() => setIsZenActive(true)}
            initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} whileHover={{ opacity: 1, scale: 1.1 }}
            className="fixed bottom-6 left-6 z-40 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-lg border border-slate-200/50 rounded-full shadow-sm group transition-all"
          >
            <Maximize2 size={16} />
            <span className="absolute left-12 px-2 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">Focus</span>
          </motion.button>
        )}

        <MiniDonateButton />
      </div>
    </SecurityWrapper>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/course/:subjectSlug" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="SRI" element={<TopicOne />} />
        <Route path="courtroom-rush" element={<TopicEight />} />
        <Route path="jurisprudentie" element={<TopicTen />} />
        <Route path="support" element={<Support />} />
      </Route>
      {/* FIX: Redirect aangepast naar een bestaande key in masterData om crash te voorkomen */}
      <Route path="/" element={<Navigate to="/course/sr1-premium-k92" replace />} />
    </Routes>
  </Router>
);

export default App;