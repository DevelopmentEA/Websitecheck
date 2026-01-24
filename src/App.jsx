import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useNavigate, 
  useLocation, 
  Outlet, 
  useParams, 
  Navigate,
  useOutletContext
} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, 
  Gavel, 
  ArrowLeft, 
  Award, 
  BrainCircuit, 
  Zap, 
  Target, 
  AlertTriangle, 
  Maximize2,
  X 
} from 'lucide-react';

// --- UTILS (Logica uit vorige script) ---
import { getCourseConfig, getCourseQuestions } from './utils/courseLoader';

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
    title: "Oefenvragen", 
    desc: "Toets de stof op een flexibele manier.", 
    icon: Gavel, 
    to: "SRI" 
  },
  { 
    title: "Courtroom Rush", 
    desc: "Ben jij beter dan Bobby?", 
    icon: "rush-logo", // Speciale marker voor de afbeelding
    to: "courtroom-rush" 
  },
  { 
    title: "Tentamen simulator", 
    desc: "Hoe locked in ben je?", 
    icon: Award, 
    to: "jurisprudentie" 
  }
];

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
        className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden group-hover:bg-[#469585] transition-all duration-300"
      >
        {Icon === "rush-logo" ? (
          // HIER IS DE IMAGE LOGICA AANGEPAST VOOR JE NIEUWE LOGO
          <img 
            src="/rush.png" 
            alt="Rush" 
            className="w-full h-full object-cover" 
          />
        ) : (
          // DIT IS VOOR DE NORMALE ICOONTJES (Kleuren wit bij hover)
          <div className="group-hover:text-white transition-colors">
            <Icon size={30} />
          </div>
        )}
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
  const { config } = useOutletContext(); // Haalt data uit de layout context
  const [isRebrandOpen, setIsRebrandOpen] = useState(false);

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-16 px-8 relative">
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-4" style={{ color: config.accent }}>
            <Target size={14} /> 
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">{config.tag || "TRAINING"}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Kies je <span className="text-gradient">Oefenmodule</span>
          </h1>
        </div>
        <div className="grid gap-6">
          {genericCards.map((card, idx) => (
            <TiltCard key={idx} {...card} color={config.accent} />
          ))}
        </div>

        <button 
          onClick={() => setIsRebrandOpen(true)}
          className="fixed bottom-8 right-8 z-[150] w-14 h-14 flex items-center justify-center bg-white border border-slate-200 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95 group"
        >
          <X size={28} className="text-[#10b981] drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" strokeWidth={3} />
        </button>
      </motion.div>

      <Support isOpen={isRebrandOpen} onClose={() => setIsRebrandOpen(false)} />
    </>
  );
};

// --- MAIN LAYOUT ENGINE ---
const MainLayout = () => {
  const { subjectSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [db, setDb] = useState(null);
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState('loading');
  const [isZenActive, setIsZenActive] = useState(false);

  const isArcade = location.pathname.includes('/courtroom-rush');
  const isVoortgang = location.pathname.includes('/voortgang');
  const isSRI = location.pathname.includes('/SRI'); 
  const isDashboard = location.pathname.replace(/\/$/, "") === `/course/${subjectSlug}`.replace(/\/$/, "");

  const isFullPageModule = isArcade || isVoortgang || isSRI;

  useEffect(() => {
    const initCourse = async () => {
      setStatus('loading');
      
      // 1. Config ophalen (sync)
      const foundConfig = getCourseConfig(subjectSlug);
      if (!foundConfig) {
        setStatus('denied'); // Of error, wat je wilt. Vak bestaat niet.
        return;
      }

      // 2. Security Check (Strengere controle)
      const hostname = window.location.hostname;
      const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
      
      // In productie MOET het in een iframe zitten
      const isInIframe = window.self !== window.top;
      
      // De referrer check: komt het verzoek van lawbooks.online?
      // Let op: referrer kan leeg zijn bij direct bezoek of privacy settings, 
      // dus we checken of hij een toegestaan domein BEVAT.
      const referrer = document.referrer || "";
      const allowedDomains = ['lawbooks.online', 'testelbert.learnworlds.com'];
      const isAllowedReferrer = allowedDomains.some(domain => referrer.includes(domain));

      // DE CHECK:
      // Als we NIET lokaal zijn, EN (niet in iframe OF verkeerde referrer) -> Blokkeer.
      if (!isLocal) {
        if (!isInIframe || !isAllowedReferrer) {
           console.warn("Security Block: Not local, and failed iframe/referrer check.", { isInIframe, referrer });
           setStatus('denied');
           return;
        }
      }

      // 3. Data laden (alleen als security geslaagd is)
      const questions = await getCourseQuestions(subjectSlug);
      if (!questions) {
        setStatus('error');
        return;
      }

      setConfig(foundConfig);
      setDb(questions);
      setStatus('authorized');
    };

    initCourse();
  }, [subjectSlug]);

  if (status === 'denied') {
    return (
      <div className="h-screen w-full bg-[#F9FAFB] flex items-center justify-center p-6 text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md p-10 bg-white border border-slate-200 rounded-[2.5rem] shadow-xl">
          <AlertTriangle size={48} className="text-amber-500 mx-auto mb-6" />
          <h2 className="text-slate-900 font-bold text-xl mb-2">Toegang niet toegestaan</h2>
          <p className="text-slate-500 text-sm mb-6">Deze module is uitsluitend toegankelijk via de officiële Lawbooks leeromgeving.</p>
        </motion.div>
      </div>
    );
  }

  if (status === 'loading' || status === 'error') {
    return <div className="h-screen flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest">
      {status === 'loading' ? 'Dossier laden...' : 'Fout bij laden data'}
    </div>;
  }

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 ${isArcade ? 'arcade-mode' : 'bg-[#F9FAFB]'}`}>
      <Zenmode isActive={isZenActive} onClose={() => setIsZenActive(false)} />

      {!isFullPageModule && !isDashboard && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(`/course/${subjectSlug}`)} 
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#469585] transition-colors"
          >
            <ArrowLeft size={16} /> Terug
          </button>
          <div className="flex items-center gap-2">
            {isArcade ? (
              <img src="/rush.png" alt="Rush" className="w-[18px] h-[18px] object-contain" />
            ) : (
              <Scale size={18} style={{ color: config.accent }} />
            )}
            <div className="text-[10px] font-black uppercase tracking-[0.3em] italic" style={{ color: config.accent }}>
              Lawbooks
            </div>
          </div>
        </nav>
      )}

      <main className={`${(!isFullPageModule && !isDashboard) ? 'pt-24' : ''} h-full`}>
        {/* We geven db en config door aan alle onderliggende pagina's */}
        <Outlet context={{ db, config, subjectSlug }} />
      </main>

      {!isArcade && (
        <button 
          onClick={() => setIsZenActive(true)} 
          className="fixed bottom-8 left-8 z-[160] w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-full shadow-lg hover:bg-slate-50 transition-all active:scale-90"
        >
          <Maximize2 size={18} className="text-slate-600" />
        </button>
      )}
    </div>
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
        <Route path="support" element={<Support isOpen={true} onClose={() => window.history.back()} />} />
      </Route>
      <Route path="/" element={<div className="p-10">Selecteer een vak via de URL.</div>} />
    </Routes>
  </Router>
);

export default App;