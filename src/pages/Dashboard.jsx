import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Scale, BookOpen, Gavel, ArrowRight, ScrollText } from 'lucide-react';

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
    { id: 1, title: "Materieel Strafrecht & Legaliteit", desc: "Art. 1 Sr, Bestanddelen vs Elementen" },
    { id: 2, title: "Opzet (Dolus) & Schuld (Culpa)", desc: "Gradaties, Porsche-arrest, Roekeloosheid" },
    { id: 3, title: "Introductie Formeel Strafrecht", desc: "Procesdeelnemers & Beginselen" },
    { id: 4, title: "Dwangmiddelen & Opsporing", desc: "Inverzekeringstelling, Voorlopige Hechtenis" },
    { id: 5, title: "Vervolging & Sepot", desc: "Opportuniteitsbeginsel, Art. 12 Sv Procedure" },
    { id: 6, title: "Onderzoek ter Terechtzitting", desc: "Beslissingsmodel 348/350 Sv" },
    { id: 7, title: "Sancties & Rechtsmiddelen", desc: "Hoofdstraffen, Maatregelen, Cassatie" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-800 font-sans selection:bg-[#1A365D] selection:text-white pb-20">
      
      {/* --- TOP BAR --- */}
      <header className="sticky top-0 z-50 bg-[#FDFCFB]/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#1A365D] p-2 rounded-lg text-white">
            <Gavel size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1A365D] font-serif tracking-tight leading-none">
              Elbert & Lawbooks
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
              Kennisbank & Training
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-full border border-stone-200">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Systeem Operationeel</span>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
            <img src="/foto.jpg" alt="Profiel" className="w-full h-full object-cover" />
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
              className="relative overflow-hidden rounded-[2.5rem] bg-[#1A365D] text-white p-12 shadow-xl flex flex-col justify-between min-h-[340px]"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 opacity-80">
                  <BookOpen size={18} />
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">Bachelor Rechtsgeleerdheid</span>
                </div>
                <h2 className="text-5xl font-serif font-bold leading-tight mb-6 max-w-lg">
                  Nullum crimen, nulla poena sine lege.
                </h2>
                <p className="text-stone-300 max-w-md text-lg font-light leading-relaxed">
                  Geen feit is strafbaar dan uit kracht van een daaraan voorafgegane wettelijke strafbepaling. (Art. 1 Sr)
                </p>
              </div>

              <div className="relative z-10 flex gap-4 mt-8">
                <NavLink to="/SRI" className="flex items-center gap-3 px-8 py-4 bg-white text-[#1A365D] rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#C5A059] hover:text-white transition-all shadow-lg">
                  Start Training
                  <ArrowRight size={16} />
                </NavLink>
                <NavLink to="/SRII" className="flex items-center gap-3 px-8 py-4 bg-[#1A365D] border border-white/20 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#152C4E] transition-all">
                  Expert Modus
                </NavLink>
              </div>
            </motion.div>

            {/* FUNDAMENTEN GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Art 350 Sv Card */}
              <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1A365D] transition-colors duration-500">
                  <Scale className="text-[#1A365D] group-hover:text-white transition-colors" size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#1A365D] font-serif mb-2">Beslissingsmodel</h3>
                <p className="text-xs font-black uppercase tracking-widest text-[#C5A059] mb-4">Art. 348 & 350 Sv</p>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Het formele en materiële kader waarbinnen de rechter tot een vonnis komt. Van geldigheid dagvaarding tot sanctieoplegging.
                </p>
              </motion.div>

              {/* Materieel vs Formeel Card */}
              <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1A365D] transition-colors duration-500">
                  <ScrollText className="text-[#1A365D] group-hover:text-white transition-colors" size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#1A365D] font-serif mb-2">Materieel vs. Formeel</h3>
                <p className="text-xs font-black uppercase tracking-widest text-[#C5A059] mb-4">Sr & Sv</p>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Het onderscheid tussen de inhoudelijke strafbaarstelling (Boek I & II Sr) en de procedurele regels (Sv) om deze te handhaven.
                </p>
              </motion.div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: CURRICULUM (4 cols) --- */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-[2.5rem] border border-stone-100 shadow-lg p-8 h-full"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-[#1A365D] font-serif italic">Curriculum</h3>
                <span className="text-[10px] font-black bg-stone-100 px-3 py-1 rounded-full text-stone-500 uppercase tracking-widest">Week 1-7</span>
              </div>

              <div className="space-y-6 relative">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-stone-100"></div>

                {weeks.map((week, i) => (
                  <div key={week.id} className="relative pl-12 group cursor-default">
                    {/* Dot */}
                    <div className="absolute left-0 top-1 w-10 h-10 bg-white border-2 border-stone-100 rounded-full flex items-center justify-center z-10 group-hover:border-[#C5A059] transition-colors">
                      <span className="text-[10px] font-bold text-stone-400 group-hover:text-[#1A365D]">{week.id}</span>
                    </div>
                    
                    {/* Content */}
                    <div>
                      <h4 className="text-sm font-bold text-[#1A365D] group-hover:text-[#C5A059] transition-colors">
                        {week.title}
                      </h4>
                      <p className="text-xs text-stone-400 mt-1 font-medium leading-relaxed">
                        {week.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-6 border-t border-stone-100">
                <div className="bg-[#FAF9F6] p-4 rounded-xl flex items-start gap-3">
                  <div className="min-w-[4px] h-full bg-[#C5A059] rounded-full"></div>
                  <p className="text-xs text-stone-500 italic">
                    "Onthoud: De kwalificatievraag volgt pas nadat het feit wettig en overtuigend is bewezen."
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