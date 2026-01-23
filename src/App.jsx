import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Outlet, useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Gavel, ArrowLeft, Award, BrainCircuit, Zap, Target, AlertTriangle, Heart, Maximize2 } from 'lucide-react';

// --- COMPONENT IMPORTS ---
import Zenmode from './Zenmode';
import VoortgangsToets from './pages/VoortgangsToets'; 
import TopicOne from './pages/TopicOne';      
import TopicEight from './pages/TopicTree';  
import TopicTen from './pages/TopicFour';      
import Support from './pages/Support';

// --- CONFIGURATIE: MASTER DATA ---
const masterData = {
  "EU-neo-2026": {
    title: "EU Recht",
    accent: "#6EE7B7",
    tag: "Lawbooks premium 2026",
  },
  "sr1-premium-k92": {
    title: "Grondslagen Recht",
    accent: "#6EE7B7",
    tag: "Lawbooks Premium 2026",
  },
  "bestuursrecht-x72": {
    title: "Bestuursrecht",
    accent: "#6EE7B7",
    tag: "Lawbooks Premium 2026",
  }
};

const genericCards = [
  { title: "Oefenvragen Matrix", desc: "Toets de stof op een flexibele manier.", icon: Gavel, to: "SRI" },
  { title: "Courtroom Rush", desc: "Maak beslissingen onder tijdsdruk.", icon: BrainCircuit, to: "courtroom-rush" },
  { title: "Het Tentamen", desc: "Ben je echt locked in...", icon: Award, to: "jurisprudentie" }
];

// --- SECURITY: IFRAME-ONLY PROTECTION ---
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
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center p-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md p-10 rounded-[3rem] border border-red-500/30 bg-red-500/5 backdrop-blur-xl">
          <AlertTriangle size={64} className="text-red-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-white font-black text-2xl uppercase tracking-tighter mb-4 italic">Toegang Geweigerd</h2>
          <p className="text-red-400 font-bold text-sm mb-6">Deze module is alleen toegankelijk via de geautoriseerde Lawbooks omgeving.</p>
          <div className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Protocol: SEC_IFRAME_ONLY</div>
        </motion.div>
      </div>
    );
  }
  return children;
};

// --- UI HELPERS ---
const TiltCard = ({ title, desc, icon: Icon, to, color }) => {
  const navigate = useNavigate();
  const { subjectSlug } = useParams();
  return (
    <motion.div
      onClick={() => navigate(`/course/${subjectSlug}/${to}`)}
      whileTap={{ scale: 0.98 }}
      className="relative group cursor-pointer w-full bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 flex items-center gap-6"
    >
      <div style={{ color: color, backgroundColor: `${color}1A` }} className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#469585] group-hover:text-white transition-all">
        <Icon size={32} />
      </div>
      <div className="flex-grow">
        <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">{title}</h3>
        <p className="text-slate-500 text-sm opacity-80">{desc}</p>
      </div>
      <div style={{ color: color }} className="hidden md:flex items-center text-[10px] font-black uppercase tracking-widest">Start <Zap size={14} className="ml-1 fill-current" /></div>
    </motion.div>
  );
};

// --- PAGINA COMPONENTEN ---
const Dashboard = () => {
  const { subjectSlug } = useParams();
  const data = masterData[subjectSlug];
  if (!data) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-12 px-8">
      <div className="text-left mb-12">
        <div className="flex items-center gap-2 mb-3" style={{ color: data.accent }}>
          <Target size={14} /> <span className="text-[9px] font-black uppercase tracking-[0.3em]">{data.tag}</span>
        </div>
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic">Kies je <span className="text-[#469585]">Oefenmodule</span></h1>
      </div>
      <div className="flex flex-col gap-6 max-w-3xl">
        {genericCards.map((card, idx) => <TiltCard key={idx} {...card} color={data.accent} />)}
      </div>
    </motion.div>
  );
};

// --- MAIN LAYOUT ---
const MainLayout = () => {
  const { subjectSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isZenActive, setIsZenActive] = useState(false);

  const isDashboard = location.pathname === `/course/${subjectSlug}`;
  const isVoortgang = location.pathname.includes('/voortgang');

  // Scroll-lock voor voortgangstoets
  useEffect(() => {
    if (isVoortgang) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    return () => { 
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isVoortgang]);

  return (
    <SecurityWrapper>
      <div className={`min-h-screen w-full bg-[#F9FAFB] text-slate-900 relative ${isVoortgang ? 'h-screen overflow-hidden' : ''}`}>
        <Zenmode isActive={isZenActive} onClose={() => setIsZenActive(false)} />
        
        {/* Navigatie: Verbergt Dashboard-knop als we in de voortgangstoets zitten */}
        {!isDashboard && !isVoortgang && (
          <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-3 flex items-center justify-between font-black uppercase">
            <button onClick={() => navigate(`/course/${subjectSlug}`)} className="flex items-center gap-2 text-[9px] tracking-widest">
              <ArrowLeft size={14} /> Dashboard
            </button>
            <div className="text-xs tracking-tighter italic flex items-center gap-1">
              <Scale size={16} className="text-[#469585]" /> Lawbooks
            </div>
          </nav>
        )}

        <main className={(!isDashboard && !isVoortgang) ? 'pt-20' : 'h-full'}>
          <Outlet />
        </main>

        {!isZenActive && !isVoortgang && (
          <button 
            onClick={() => setIsZenActive(true)} 
            className="fixed bottom-6 left-6 z-40 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-lg border border-slate-200/50 rounded-full shadow-sm"
          >
            <Maximize2 size={16} />
          </button>
        )}
      </div>
    </SecurityWrapper>
  );
};

// --- MAIN APP ROUTER ---
const App = () => (
  <Router>
    <Routes>
      <Route path="/course/:subjectSlug" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="voortgang" element={<VoortgangsToets />} />
        <Route path="SRI" element={<TopicOne />} />
        <Route path="courtroom-rush" element={<TopicEight />} />
        <Route path="jurisprudentie" element={<TopicTen />} />
        <Route path="support" element={<Support />} />
      </Route>
      <Route path="/" element={<Navigate to="/course/sr1-premium-k92" replace />} />
    </Routes>
  </Router>
);

export default App;