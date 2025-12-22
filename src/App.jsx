import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import TopicOne from './pages/TopicOne';

const Sidebar = () => {
  const menuItems = [
    { path: "/", label: "Dashboard", icon: "🏛️" },
    { path: "/home1", label: "Privaatrecht II", icon: "⚖️" },
    { path: "/home2", label: "Bestuursrecht", icon: "📚", disabled: true },
  ];

  return (
    <nav className="w-80 h-screen bg-[#1A365D] text-white flex flex-col flex-shrink-0 shadow-2xl z-50">
      <div className="p-10 border-b border-white/10 bg-[#152c4d]">
        <h1 className="text-3xl font-bold tracking-tighter font-serif italic">JUDICA</h1>
        <p className="text-[9px] text-slate-400 uppercase tracking-[0.4em] font-black mt-2">Knowledge Base</p>
      </div>
      
      <div className="flex-grow py-8 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group
              ${isActive ? 'bg-[#C5A059] text-white shadow-xl scale-[1.02]' : 'text-slate-400 hover:text-white hover:bg-white/5'}
              ${item.disabled ? 'opacity-20 cursor-not-allowed' : ''}
            `}
            onClick={(e) => item.disabled && e.preventDefault()}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="font-bold tracking-wide text-xs uppercase">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-8 border-t border-white/10 bg-black/10">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose">
          User: Elbert J.<br/>
          Status: Premium
        </p>
      </div>
    </nav>
  );
};

// DIT IS DE FIX VOOR JE LAYOUT
const MainLayout = () => (
  <div className="flex h-screen w-screen bg-[#FAF9F6] overflow-hidden">
    <Sidebar />
    <main className="flex-1 h-full overflow-y-auto">
      <div className="min-h-full w-full">
        <Outlet />
      </div>
    </main>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/home1" element={<TopicOne />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;