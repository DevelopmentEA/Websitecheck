import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Scale, BookOpen, Gavel, ArrowLeft, Play, Award, BrainCircuit, Zap, Target, AlertTriangle, Heart } from 'lucide-react';

// Pagina imports
import TopicOne from './pages/TopicOne';     
import TopicFour from './pages/TopicTwo';   
import TopicEight from './pages/TopicTree'; 
import TopicTen from './pages/TopicFour';     
import Support from './pages/Support';

// --- SUBTIELE NEO DONATE BUTTON ---
const MiniDonateButton = () => {
  const navigate = useNavigate();
  return (
    <motion.button
      onClick={() => navigate('/support')}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.6, scale: 1 }}
      whileHover={{ opacity: 1, scale: 1.1, backgroundColor: '#6EE7B7' }}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-lg border border-slate-200/50 rounded-full shadow-sm group transition-colors duration-300"
      title="Support Lawbooks"
    >
      <Heart size={16} className="text-slate-900 group-hover:fill-black group-hover:text-black transition-colors" />
      {/* Tooltip die verschijnt bij hover */}
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

const SecurityWrapper = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const referrer = document.referrer;
    const isIframe = window.self !== window.top;
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const allowedDomains = ['lawbooks.online', 'testelbert.learnworlds.com'];
    const isLawbooks = allowedDomains.some(domain => referrer.includes(domain));

    if (isIframe && !isLawbooks && !isLocal) {
      setIsAuthorized(false);
    }
  }, []);

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center p-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md p-10 rounded-[3rem] border border-red-500/30 bg-red-500/5 backdrop-blur-xl">
          <AlertTriangle size={64} className="text-red-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-white font-black text-2xl uppercase tracking-tighter mb-4 italic">Toegang Geweigerd</h2>
          <p className="text-red-400 font-bold text-sm leading-relaxed">Dit mag niet - Je IP adres wordt opgeslagen en wellicht onderzocht.</p>
        </motion.div>
      </div>
    );
  }
  return children;
};

const usePerformanceMode = () => {
  const [isLowPower, setIsLowPower] = useState(false);
  useEffect(() => {
    setIsLowPower(window.matchMedia("(pointer: coarse)").matches);
  }, []);
  return isLowPower;
};

const BackgroundPulsator = ({ isLowPower }) => (
  <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isLowPower ? { opacity: 1, scale: 1 } : { opacity: 1, scale: [1, 1.02, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="w-[98%] h-[80%] max-w-6xl bg-[#6EE7B7]/5 border border-[#6EE7B7]/10 rounded-[3rem] md:rounded-[4rem]"
    />
  </div>
);

const TiltCard = ({ title, desc, icon: Icon, to, index }) => {
  const navigate = useNavigate();
  const isLowPower = usePerformanceMode();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  return (
    <motion.div
      variants={{ initial: { opacity: 0, y: 15 }, enter: { opacity: 1, y: 0, transition: { ...transition, delay: index * 0.05 } } }}
      onMouseMove={(e) => { if (!isLowPower) { const rect = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - rect.left) / rect.width - 0.5); y.set((e.clientY - rect.top) / rect.height - 0.5); }}}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: isLowPower ? 0 : rotateX, rotateY: isLowPower ? 0 : rotateY, transformStyle: "preserve-3d" }}
      onClick={() => navigate(to)}
      whileTap={{ scale: 0.97 }}
      className="relative group cursor-pointer"
    >
      <div className="h-full bg-white border border-slate-100 p-5 md:p-6 rounded-[2rem] shadow-sm group-hover:shadow-lg transition-all duration-500">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#6EE7B7]/10 rounded-xl flex items-center justify-center mb-4 text-[#059669] group-hover:bg-[#6EE7B7] group-hover:text-white transition-all duration-300">
          <Icon size={24} strokeWidth={2} />
        </div>
        <h3 className="text-lg md:text-xl font-black text-slate-900 mb-1 tracking-tight">{title}</h3>
        <p className="text-slate-500 text-xs leading-snug mb-5 opacity-80">{desc}</p>
        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-[#059669]">Start Module <Zap size={12} className="ml-1 fill-current" /></div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const isLowPower = usePerformanceMode();
  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit" className="max-w-6xl mx-auto py-8 md:py-12 px-4 md:px-8 relative">
      <BackgroundPulsator isLowPower={isLowPower} />
      <div className="flex flex-col md:flex-row justify-between items-start mb-10 md:mb-14 gap-6">
        <div className="text-left w-full">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-[#059669] mb-3">
            <Target size={14} /> <span className="text-[9px] font-black uppercase tracking-[0.3em]">Lawbooks Neo 2026</span>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight italic">
            Kies je <span className="animate-gradient text-transparent bg-clip-text pr-2">Oefentool</span>
          </h1>
          <p className="mt-4 text-slate-500 text-sm md:text-base max-w-md">Kies een module om direct te starten met trainen.</p>
        </div>
        <motion.img whileHover={{ rotate: 5, scale: 1.1 }} src="/foto.jpg" alt="Logo" className="w-16 h-16 md:w-24 md:h-24 rounded-2xl border-2 border-white shadow-xl object-cover shrink-0" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <TiltCard index={0} title="Strafrecht: Basis" desc="Beheers de fundamenten van het recht." icon={Gavel} to="/SRI" />
        <TiltCard index={1} title="SR: Miljoenenjacht" desc="Interactieve game-show quiz over IPR." icon={BookOpen} to="/SR" />
        <TiltCard index={2} title="Courtroom Rush" desc="Maak beslissingen onder tijdsdruk." icon={BrainCircuit} to="/courtroom-rush" />
        <TiltCard index={3} title="Jurisprudentie" desc="Analyseer de belangrijkste arresten." icon={Award} to="/jurisprudentie" />
      </div>
    </motion.div>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/';

  return (
    <SecurityWrapper>
      <div className="min-h-screen w-full bg-[#F9FAFB] text-slate-900 relative selection:bg-[#6EE7B7]/30">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname + "-loader"} initial={{ width: "0%" }} animate={{ width: "100%" }} exit={{ opacity: 0 }} className="fixed top-0 left-0 h-[2px] bg-[#6EE7B7] z-[60]" />
        </AnimatePresence>

        {!isDashboard && (
          <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-3 flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-900 font-black text-[9px] uppercase tracking-widest hover:text-[#059669] transition-colors">
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
        
        {/* De nieuwe compacte button */}
        <MiniDonateButton />
      </div>
    </SecurityWrapper>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/SRI" element={<TopicOne />} />
        <Route path="/SR" element={<TopicFour />} />
        <Route path="/courtroom-rush" element={<TopicEight />} />
        <Route path="/jurisprudentie" element={<TopicTen />} />
        <Route path="/support" element={<Support />} />
      </Route>
    </Routes>
  </Router>
);

export default App;