import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useNavigate, 
  useLocation, 
  Outlet, 
  useParams, 
  Navigate 
} from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Scale, 
  Gavel, 
  ArrowLeft, 
  Award, 
  BrainCircuit, 
  Zap, 
  Target, 
  AlertTriangle, 
  Maximize2 
} from 'lucide-react';

// --- DATA ---
import { masterData } from './data/masterData';

// --- PAGES ---
import Zenmode from './Zenmode';
import VoortgangsToets from './pages/VoortgangsToets'; 
import TopicOne from './pages/TopicOne';      
import CourtroomRush from './pages/CourtroomRush'; 
import TopicTen from './pages/TopicFour';      
import Support from './pages/Support';

// --- DASHBOARD CONFIG ---
const genericCards = [
  { 
    title: "Oefenvragen Matrix", 
    desc: "Toets de stof op een flexibele manier.", 
    icon: Gavel, 
    to: "SRI" 
  },
  { 
    title: "Courtroom Rush", 
    desc: "Arcade-style beslissingen onder tijdsdruk.", 
    icon: BrainCircuit, 
    to: "courtroom-rush" 
  },
  { 
    title: "Het Tentamen", 
    desc: "Ben je echt locked in voor het echte werk?", 
    icon: Award, 
    to: "jurisprudentie" 
  }
];

// --- SECURITY ---
const SecurityWrapper = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(true);
  const { subjectSlug } = useParams();

  useEffect(() => {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
    const isInIframe = window.self !== window.top;
    const allowedDomains = ['lawbooks.online', 'testelbert.learnworlds.com'];
    const isAllowedReferrer = allowedDomains.some(domain => 
      document.referrer !== "" && document.referrer.includes(domain)
    );
    const isValidSlug = !!masterData[subjectSlug];

    if (!isLocal) {
      if (!isValidSlug || !isInIframe || !isAllowedReferrer) {
        setIsAuthorized(false);
      }
    }
  }, [subjectSlug]);

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center p-6 text-center arcade-mode">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md p-10 border-4 border-red-500 shadow-[8px_8px_0_0_#ff000033]">
          <AlertTriangle size={64} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-white font-black text-xl mb-4">ACCESS_DENIED</h2>
          <p className="text-red-400 text-xs mb-6 uppercase">Module uitsluitend toegankelijk via geautoriseerde Lawbooks omgeving.</p>
          <div className="text-[10px] text-white/30 font-mono italic">SEC_PROTOCOL_IFRAME_ONLY</div>
        </motion.div>
      </div>
    );
  }
  return children;
};

// --- MODERN CARD COMPONENT ---
const TiltCard = ({ title, desc, icon: Icon, to, color }) => {
  const navigate = useNavigate();
  const { subjectSlug } = useParams();

  return (
    <motion.div
      onClick={() => navigate(`/course/${subjectSlug}/${to}`)}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer w-full bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300 flex items-center gap-6"
    >
      <div 
        style={{ color: color, backgroundColor: `${color}15` }} 
        className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#469585] group-hover:text-white transition-all duration-300"
      >
        <Icon size={30} />
      </div>
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight">{title}</h3>
        <p className="text-slate-500 text-sm leading-snug">{desc}</p>
      </div>
      <div style={{ color: color }} className="hidden md:flex items-center text-[10px] font-black uppercase tracking-[0.2em] gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
        Start <Zap size={14} fill="currentColor" />
      </div>
    </motion.div>
  );
};

// --- MODERN DASHBOARD ---
const Dashboard = () => {
  const { subjectSlug } = useParams();
  const data = masterData[subjectSlug];

  if (!data) return <div className="h-screen flex items-center justify-center font-bold uppercase tracking-widest text-slate-400">Loading Dossier...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-16 px-8">
      <div className="mb-14">
        <div className="flex items-center gap-2 mb-4" style={{ color: data.accent }}>
          <Target size={14} /> 
          <span className="text-[10px] font-bold uppercase tracking-[0.4em]">{data.tag}</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Kies je <span className="text-gradient">Oefenmodule</span>
        </h1>
      </div>
      <div className="grid gap-6">
        {genericCards.map((card, idx) => (
          <TiltCard key={idx} {...card} color={data.accent} />
        ))}
      </div>
    </motion.div>
  );
};

// --- MAIN LAYOUT ENGINE ---
const MainLayout = () => {
  const { subjectSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isZenActive, setIsZenActive] = useState(false);

  // Checks voor de 'Arcade' vs 'Modern' splitsing
  const isArcade = location.pathname.includes('/courtroom-rush');
  const isVoortgang = location.pathname.includes('/voortgang');
  const isDashboard = location.pathname === `/course/${subjectSlug}`;

  return (
    <SecurityWrapper>
      {/* Dynamic Class: 'arcade-mode' activeert de 8-bit CSS scope */}
      <div className={`min-h-screen w-full transition-colors duration-500 ${isArcade ? 'arcade-mode' : 'bg-[#F9FAFB]'}`}>
        
        <Zenmode isActive={isZenActive} onClose={() => setIsZenActive(false)} />
        
        {/* Navigatie: Verbergen in Arcade & Voortgang voor maximale immersie */}
        {!isArcade && !isVoortgang && !isDashboard && (
          <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between">
            <button 
              onClick={() => navigate(`/course/${subjectSlug}`)} 
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#469585] transition-colors"
            >
              <ArrowLeft size={16} /> Terug
            </button>
            <div className="text-sm font-black italic flex items-center gap-1 text-slate-900">
              <Scale size={18} className="text-[#469585]" /> Lawbooks
            </div>
          </nav>
        )}

        {/* Padding-top alleen nodig bij modern-style pagina's met een nav-balk */}
        <main className={`${(!isDashboard && !isVoortgang && !isArcade) ? 'pt-24' : ''} h-full`}>
          <Outlet />
        </main>

        {/* Zenmode Switcher: Alleen in de moderne Hub */}
        {!isArcade && !isVoortgang && (
          <button 
            onClick={() => setIsZenActive(true)} 
            className="fixed bottom-8 left-8 z-40 w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-full shadow-lg hover:bg-slate-50 transition-all active:scale-90"
          >
            <Maximize2 size={18} className="text-slate-600" />
          </button>
        )}
      </div>
    </SecurityWrapper>
  );
};

// --- APP ---
const App = () => (
  <Router>
    <Routes>
      <Route path="/course/:subjectSlug" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="voortgang" element={<VoortgangsToets />} />
        <Route path="SRI" element={<TopicOne />} />
        <Route path="courtroom-rush" element={<CourtroomRush />} />
        <Route path="jurisprudentie" element={<TopicTen />} />
        <Route path="support" element={<Support />} />
      </Route>
      <Route path="/" element={<Navigate to="/course/sr1-premium-k92" replace />} />
    </Routes>
  </Router>
);

export default App;