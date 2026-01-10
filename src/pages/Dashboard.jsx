import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Globe, BookOpen, Gavel, ArrowRight, Anchor, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const weeks = [
    { id: 1, title: "Aard & Bronnen", desc: "Vrede van Westfalen, Art. 38 IGH-Statuut, Jus Cogens" },
    { id: 2, title: "Rechtssubjecten", desc: "Staten, Erkenning, IGO's, Bevrijdingsbewegingen" },
    { id: 3, title: "Verdragenrecht (WVV)", desc: "Totstandkoming, Voorbehoud, Interpretatie, Beëindiging" },
    { id: 4, title: "Staatsaansprakelijkheid", desc: "ARSIWA, Toerekening, Rechtvaardigingsgronden" },
    { id: 5, title: "Rechtsmacht & Immuniteit", desc: "Territorialiteit, Universaliteit, Staatsimmuniteit" },
    { id: 6, title: "Zeerecht & Ruimterecht", desc: "UNCLOS, Territoriale Zee, EEZ, Volle Zee" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-[#6EE7B7] selection:text-gray-900 pb-20">
      
      {/* --- TOP BAR --- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#6EE7B7]/10 p-2 rounded-xl text-[#059669]">
            <Globe size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none font-sans">
              Elbert & Lawbooks
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-0.5">
              Internationaal Publiekrecht
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
            <span className="w-2 h-2 rounded-full bg-[#6EE7B7] animate-pulse"></span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Online</span>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-100">
            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold">L</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >

          {/* --- LEFT COLUMN: HERO & ACTIONS (8 cols) --- */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* HERO CARD */}
            <motion.div 
              variants={itemVariants}
              className="relative overflow-hidden rounded-[2rem] bg-gray-900 text-white p-10 shadow-xl flex flex-col justify-between min-h-[340px]"
            >
              {/* Decoratieve Blob */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#6EE7B7] opacity-20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 flex items-center gap-2">
                    <BookOpen size={14} className="text-[#6EE7B7]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-200">International Law</span>
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6 max-w-lg tracking-tight">
                  Pacta sunt servanda.
                </h2>
                <p className="text-gray-400 max-w-md text-lg leading-relaxed font-light">
                  Verdragen binden de partijen en moeten te goeder trouw worden nagekomen. (Art. 26 Weens Verdragenverdrag)
                </p>
              </div>

              <div className="relative z-10 flex flex-wrap gap-4 mt-8">
                <NavLink to="/ipr-ultiem" className="flex items-center gap-3 px-8 py-4 bg-[#6EE7B7] text-gray-900 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#5EDCA8] transition-all shadow-lg shadow-[#6EE7B7]/20">
                  Oefen Tentamen
                  <ArrowRight size={16} />
                </NavLink>
                <NavLink to="/ipr-miljoenen" className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all backdrop-blur-sm">
                  Speel Miljoenenjacht
                </NavLink>
              </div>
            </motion.div>

            {/* FUNDAMENTEN GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Art 38 IGH Card */}
              <motion.div variants={itemVariants} className="bg-white p-8 rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 bg-[#6EE7B7]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#6EE7B7] transition-colors duration-300">
                  <Gavel className="text-[#059669] group-hover:text-white transition-colors" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Rechtsbronnen</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Art. 38 IGH-Statuut</p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  De basis van het internationale recht: verdragen, gewoonterecht en algemene rechtsbeginselen.
                </p>
              </motion.div>

              {/* Immuniteit & Soevereiniteit Card */}
              <motion.div variants={itemVariants} className="bg-white p-8 rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 bg-[#6EE7B7]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#6EE7B7] transition-colors duration-300">
                  <ShieldCheck className="text-[#059669] group-hover:text-white transition-colors" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Par in Parem</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Immuniteit</p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  "Par in parem non habet imperium": Gelijken hebben geen rechtsmacht over elkaar. (Soevereine Gelijkheid).
                </p>
              </motion.div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: CURRICULUM (4 cols) --- */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-8 h-full"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-gray-900">Curriculum</h3>
                <span className="text-[10px] font-black bg-[#6EE7B7]/10 text-[#059669] px-3 py-1 rounded-full uppercase tracking-widest">Week 1-6</span>
              </div>

              <div className="space-y-6 relative">
                {/* Vertical Line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-gray-100"></div>

                {weeks.map((week, i) => (
                  <div key={week.id} className="relative pl-10 group cursor-default">
                    {/* Dot */}
                    <div className="absolute left-0 top-1.5 w-8 h-8 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center z-10 group-hover:border-[#6EE7B7] transition-colors shadow-sm">
                      <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#059669] transition-colors">{week.id}</span>
                    </div>
                    
                    {/* Content */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#059669] transition-colors">
                        {week.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 font-medium leading-relaxed">
                        {week.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-6 border-t border-gray-100">
                <div className="bg-gray-50 p-4 rounded-xl flex items-start gap-3">
                  <div className="min-w-[3px] h-full bg-[#6EE7B7] rounded-full"></div>
                  <p className="text-xs text-gray-500 italic leading-relaxed">
                    "Onthoud: Zonder expliciete instemming heeft het Internationaal Gerechtshof (IGH) géén rechtsmacht."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;