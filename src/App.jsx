import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, ExternalLink, BookOpen, ShieldAlert, MessageSquare, ChevronRight } from 'lucide-react';

// Pagina imports (staan in jouw code)
import Dashboard from './pages/Dashboard';
import TopicOne from './pages/TopicOne';
import TopicTwo from './pages/TopicTwo';
import TopicTree from './pages/TopicTree';
import TopicFour from './pages/TopicFour';
import TopicFive from './pages/TopicFive';
import TopicSix from './pages/TopicSix';
import TopicSeven from './pages/TopicSeven';
import Support from './pages/Support';
import DonateButton from './pages/Button';
import StudyMusic from './pages/StudyMusic';

// ==========================================
// 1. Standalone Iframe Detectie
// ==========================================
// Deze functie kijkt of we in een Iframe zitten óf dat we "?embed=true" in de URL hebben.
const useIsEmbedded = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  return params.get('embed') === 'true';
};

const IframeGuard = () => {
  const [isAllowed, setIsAllowed] = useState(true);
  useEffect(() => {
    const inIframe = window.self !== window.top;
    const isLocalhost = window.location.hostname === 'localhost';
    if (inIframe || isLocalhost) setIsAllowed(true);
    else setIsAllowed(false);
  }, []);

  if (!isAllowed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border-t-8 border-red-600">
          <ShieldAlert size={48} className="text-red-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Beveiligde Omgeving</h1>
          <p className="text-gray-600 text-sm">Deze module is alleen toegankelijk via de officiële Lawbooks leeromgeving.</p>
        </div>
      </div>
    );
  }
  return <Outlet />;
};

// ==========================================
// 2. ULTRA-SLIM SIDEBAR
// ==========================================
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/SRI", label: "Strafrecht I", icon: "😔" },
    { path: "/SRII", label: "Strafrecht II", icon: "😭" },
    { path: "/SRIII", label: "Strafrecht III", icon: "👹" },
    { path: "/SRIV", label: "Extra", icon: "©️" },
    { path: "/IPR", label: "Miljoenen Jacht", icon: "💰" },
    { path: "/IPRII", label: "IPR Tentamen", icon: "🌍" },
    { path: "/IPRIII", label: "IPR A/B/C", icon: "🏛️" },
    { path: "/support", label: "Support", icon: "💬" },
  ];

  const sidebarVariants = {
    open: { width: "14rem", transition: { type: "spring", stiffness: 400, damping: 40 } },
    closed: { width: "4rem", transition: { type: "spring", stiffness: 400, damping: 40 } }
  };

  return (
    <motion.nav
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="h-screen bg-[#1A365D] text-white flex flex-col flex-shrink-0 shadow-xl z-50 overflow-hidden relative border-r border-white/5"
    >
      {/* Mini Logo Area */}
      <div className="h-16 flex items-center px-4 border-b border-white/10 bg-[#152c4d]">
        <Scale size={24} className="text-[#C5A059] flex-shrink-0" />
        {isOpen && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-3 font-serif font-bold text-lg italic">
            Lawbooks
          </motion.span>
        )}
      </div>
      
      {/* Scrollable Menu */}
      <div className="flex-grow py-4 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-4 py-3 transition-all duration-200 group
              ${isActive ? 'bg-[#C5A059] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}
            `}
          >
            <span className="text-xl w-6 flex justify-center">{item.icon}</span>
            {isOpen && (
              <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="ml-4 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap">
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Externe Link - Compact */}
      <div className="p-2 border-t border-white/10">
        <a href="https://lawbooks.nl/" target="_blank" rel="noopener noreferrer" className="flex items-center p-2 rounded-lg hover:bg-[#C5A059]/20 text-[#C5A059]">
          <BookOpen size={20} />
          {isOpen && <span className="ml-3 text-[10px] font-black uppercase">Lawbooks.nl</span>}
        </a>
      </div>
    </motion.nav>
  );
};

// ==========================================
// 3. MAIN LAYOUT (Met Iframe Logica)
// ==========================================
const MainLayout = () => {
  const isEmbedded = useIsEmbedded();

  return (
    <div className="flex h-screen w-screen bg-[#FDFCFB] overflow-hidden relative">
      {/* Verberg de sidebar volledig als "?embed=true" in de URL staat */}
      {!isEmbedded && <Sidebar />}
      
      <main className="flex-1 h-full overflow-y-auto relative">
        <div className={`min-h-full w-full ${isEmbedded ? 'p-0' : 'p-4 md:p-8'}`}>
          <Outlet />
        </div>
      </main>

      {/* Verberg extra knoppen in embedded modus voor een clean look in het LMS */}
      {!isEmbedded && (
        <>
          <StudyMusic />
          <DonateButton />
        </>
      )}
    </div>
  );
};

// ==========================================
// 4. APP COMPONENT
// ==========================================
const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/SRI" element={<TopicOne />} />
          <Route path="/SRII" element={<TopicTwo />} />
          <Route path="/SRIII" element={<TopicTree />} />
          <Route path="/IPR" element={<TopicFour />} />
          <Route path="/IPRIII" element={<TopicSix />} />
          <Route path="/support" element={<Support />} />
          <Route path="/IPRII" element={<TopicFive />} />

          <Route element={<IframeGuard />}>
             <Route path="/SRIV" element={<TopicSeven />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;