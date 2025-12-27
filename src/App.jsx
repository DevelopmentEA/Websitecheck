import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';

// Importeer je pagina's
import Dashboard from './pages/Dashboard';
import TopicOne from './pages/TopicOne';
import TopicTwo from './pages/TopicTwo';
import TopicTree from './pages/TopicTree';

// Importeer de knop vanuit de juiste map
import DonateButton from './pages/Button';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "😎" },
    { path: "/home1", label: "Strafrecht", icon: "😩" },
    { path: "/home2", label: "Strafrecht Expert", icon: "😭" },
    { path: "/home3", label: "Strafrecht Extra", icon: "👹" },
  ];

  // Animatie instellingen
  const sidebarVariants = {
    open: { 
      width: "20rem", // w-80
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: { 
      width: "5rem", // w-20
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
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
      {/* Header Section */}
      <div className="p-0 h-24 flex items-center justify-center border-b border-white/10 bg-[#152c4d]">
        <div className="flex items-center gap-4 px-6 w-full">
          {/* Logo Icoon blijft altijd zichtbaar */}
          <div className="min-w-[24px] text-center">
             <Scale size={24} className="text-[#C5A059]" />
          </div>
          
          {/* Titel tekst (verdwijnt bij inklappen) */}
          <motion.div variants={textVariants} className="whitespace-nowrap">
            <h1 className="text-2xl font-bold tracking-tighter font-serif italic">JUDICA</h1>
            <p className="text-[8px] text-slate-400 uppercase tracking-[0.3em] font-black">Knowledge Base</p>
          </motion.div>
        </div>
      </div>
      
      {/* Menu Items */}
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
            {/* Icoon gecentreerd in closed state, links in open state */}
            <div className="min-w-[20px] flex justify-center text-xl group-hover:scale-110 transition-transform">
              {item.icon}
            </div>

            {/* Label tekst */}
            <motion.span 
              variants={textVariants} 
              className="font-bold tracking-wide text-xs uppercase ml-4 whitespace-nowrap"
            >
              {item.label}
            </motion.span>

            {/* Active Indicator Strip (alleen zichtbaar als dicht) */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-[#C5A059] ${!isOpen ? 'block' : 'hidden'} opacity-0 group-[.active]:opacity-100`} />
          </NavLink>
        ))}
      </div>

      {/* Footer Section */}
      <div className="p-0 h-24 flex items-center border-t border-white/10 bg-black/10">
        <div className="px-6 flex items-center gap-4 w-full">
          <div className="min-w-[24px] h-8 w-8 rounded-full bg-slate-500/20 flex items-center justify-center text-xs font-bold border border-white/20">
            EJ
          </div>
          <motion.div variants={textVariants} className="whitespace-nowrap">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight">
              User: Elbert J.<br/>
              <span className="text-[#C5A059]">Premium</span>
            </p>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

// Layout met de DonateButton toegevoegd
const MainLayout = () => (
  <div className="flex h-screen w-screen bg-[#FDFCFB] overflow-hidden relative">
    <Sidebar />
    <main className="flex-1 h-full overflow-y-auto relative">
      <div className="min-h-full w-full">
        <Outlet />
      </div>
    </main>
    
    {/* Hier staat de knop, altijd zichtbaar rechtsonder */}
    <DonateButton />
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/home1" element={<TopicOne />} />
          <Route path="/home2" element={<TopicTwo />} />
          <Route path="/home3" element={<TopicTree />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;