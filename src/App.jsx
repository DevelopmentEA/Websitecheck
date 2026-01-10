import React, { useState, useEffect } from 'react';
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
import Support from './pages/Support';
import DonateButton from './pages/Button';

// --- ANIMATIE CONSTANTEN ---
const transition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] };

const pageVariants = {
  initial: { opacity: 0, scale: 0.98, y: 10 },
  enter: { opacity: 1, scale: 1, y: 0, transition },
  exit: { opacity: 0, scale: 1.02, y: -10, transition: { duration: 0.4 } }
};

// --- PERFORMANCE CHECK ---
const usePerformanceMode = () => {
  const [isLowPower, setIsLowPower] = useState(false);
  useEffect(() => {
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