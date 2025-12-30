import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, ExternalLink, BookOpen, ShieldAlert } from 'lucide-react';

// Importeer je pagina's
import Dashboard from './pages/Dashboard';
import TopicOne from './pages/TopicOne';
import TopicTwo from './pages/TopicTwo';
import TopicTree from './pages/TopicTree';
import TopicFour from './pages/TopicFour';
import TopicFive from './pages/TopicFive';
import TopicSix from './pages/TopicSix';
import TopicSeven from './pages/TopicSeven';

// Importeer de knoppen
import DonateButton from './pages/Button';
import StudyMusic from './pages/StudyMusic';

// ==========================================
// 1. IFRAME GUARD (De Beveiliger)
// ==========================================
// Deze component checkt of we in een iframe zitten.
// Zo niet? Dan toont hij het rode schild.
// Zo wel? Dan toont hij de inhoud (<Outlet />).
const IframeGuard = () => {
  const [isAllowed, setIsAllowed] = useState(true); // Zet even op true om flikkering te voorkomen, of false voor strikt.

  useEffect(() => {
    // A. Check: Zitten we in een iframe?
    const inIframe = window.self !== window.top;

    // B. Check: Is het localhost? (Voor testen)
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';

    // C. Beslissing
    if (inIframe || isLocalhost) {
      setIsAllowed(true);
    } else {
      setIsAllowed(false);
    }
  }, []);

  // ⛔ TOEGANG GEWEIGERD SCHERM (Alleen voor dit onderdeel)
  if (!isAllowed) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full min-h-[80vh] bg-gray-50 text-[#1A365D] font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border-t-8 border-red-600">
          <div className="flex justify-center mb-6">
            <ShieldAlert size={64} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4 font-serif">Premium Content</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Dit specifieke onderdeel (Topic 7) is exclusief beschikbaar via de beveiligde leeromgeving.
          </p>
          <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">
            Iframe Only Access
          </div>
        </div>
      </div>
    );
  }

  // ✅ TOEGANG TOEGESTAAN: Render de onderliggende route
  return <Outlet />;
};

// ==========================================
// 2. SIDEBAR COMPONENT
// ==========================================
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "😎" },
    { path: "/SRI", label: "Strafrecht", icon: "😔" },
    { path: "/SRII", label: "Strafrecht Expert", icon: "😭" },
    { path: "/SRIII", label: "Strafrecht Extra", icon: "👹" },
    { path: "/SRIV", label: "Strafrecht Extra", icon: "🍾" }, // Deze wordt beveiligd
    { path: "/IPR", label: "Internationaal Publiek Recht", icon: "🇪🇺" },
    { path: "/IPRII", label: "IPR Tentamen", icon: "🌍" },
    { path: "/IPRIII", label: "IPR Tentamen A/B/C/D", icon: "🏛️" },
  ];

  const sidebarVariants = {
    open: { width: "20rem", transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { width: "5rem", transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  const textVariants = {
    open: { opacity: 1, display: "block", x: 0, transition: { delay: 0.1 } },
    closed: { opacity: 0, display: "none", x: -10 }
  };

  return (
    <motion.nav
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="h-screen bg-[#1A365D] text-white flex flex-col flex-shrink-0 shadow-2xl z-50 overflow-hidden relative"
    >
      <div className="p-0 h-24 flex items-center justify-center border-b border-white/10 bg-[#152c4d]">
        <div className="flex items-center gap-4 px-6 w-full">
          <div className="min-w-[24px] text-center">
             <Scale size={24} className="text-[#C5A059]" />
          </div>
          <motion.div variants={textVariants} className="whitespace-nowrap">
            <h1 className="text-2xl font-bold tracking-tighter font-serif italic">Lawbooks</h1>
            <p className="text-[8px] text-slate-400 uppercase tracking-[0.3em] font-black">Knowledge Base</p>
          </motion.div>
        </div>
      </div>
      
      <div className="flex-grow py-8 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-6 py-4 transition-all duration-300 group relative
              ${isActive ? 'bg-[#C5A059] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}
            `}
          >
            <div className="min-w-[20px] flex justify-center text-xl group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <motion.span variants={textVariants} className="font-bold tracking-wide text-xs uppercase ml-4 whitespace-nowrap">
              {item.label}
            </motion.span>
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-[#C5A059] ${!isOpen ? 'block' : 'hidden'} opacity-0 group-[.active]:opacity-100`} />
          </NavLink>
        ))}
        {/* Externe link sectie weggelaten voor beknoptheid, mag je laten staan */}
      </div>

      <div className="p-0 h-24 flex items-center border-t border-white/10 bg-black/10">
        <div className="px-6 flex items-center gap-4 w-full">
          <div className="min-w-[24px] h-8 w-8 rounded-full bg-slate-500/20 flex items-center justify-center text-xs font-bold border border-white/20">LB</div>
          <motion.div variants={textVariants} className="whitespace-nowrap">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight">
              User: Unknown<br/>
              <span className="text-[#C5A059]">Premium</span>
            </p>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

// ==========================================
// 3. MAIN LAYOUT
// ==========================================
const MainLayout = () => (
  <div className="flex h-screen w-screen bg-[#FDFCFB] overflow-hidden relative">
    <Sidebar />
    <main className="flex-1 h-full overflow-y-auto relative">
      <div className="min-h-full w-full">
        <Outlet />
      </div>
    </main>
    <StudyMusic />
    <DonateButton />
  </div>
);

// ==========================================
// 4. APP COMPONENT (Router Structuur)
// ==========================================
const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          
          {/* === OPENBARE ROUTES (Iedereen kan deze zien) === */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/SRI" element={<TopicOne />} />
          <Route path="/SRII" element={<TopicTwo />} />
          <Route path="/SRIII" element={<TopicTree />} />
          <Route path="/IPR" element={<TopicFour />} />
          <Route path="/IPRII" element={<TopicFive />} />
          <Route path="/IPRIII" element={<TopicSix />} />

          {/* === BEVEILIGDE ROUTES (Alleen via Iframe) === */}
          {/* We wrappen TopicSeven in de IframeGuard */}
          <Route element={<IframeGuard />}>
             <Route path="/SRIV" element={<TopicSeven />} />
          </Route>

        </Route>
      </Routes>
    </Router>
  );
};

export default App;