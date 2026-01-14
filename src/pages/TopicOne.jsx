import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { BarChart3, CheckCircle2, XCircle, AlertCircle, Settings2, X, ChevronRight, Play, ListChecks, HelpCircle, ShieldQuestion } from 'lucide-react';

// ===========================================================================
// DATA IMPORTS
// ===========================================================================
import meerkeuzeDb from './Meerkeuze.json';
import trueFalseDb from './TrueFalse.json';
import openDb from './Openvragen.json';

const DB_MAP = {
  "Meerkeuze": meerkeuzeDb,
  "True / False": trueFalseDb,
  "Expert Quiz": openDb
};

const QUESTION_TYPES = ["Meerkeuze", "True / False", "Expert Quiz"]; 

const LIMITS = {
  "Meerkeuze": 30,
  "True / False": 30,
  "Expert Quiz": 10
};

export default function IPRAdaptiveQuiz() {
  const [gameState, setGameState] = useState('intro'); 
  const [targetType, setTargetType] = useState('Meerkeuze'); 
  const [showSettings, setShowSettings] = useState(false);
  
  const currentDb = DB_MAP[targetType] || {};
  const visibleWeeks = Object.keys(currentDb).slice(0, 8);
  
  const [selectedWeeks, setSelectedWeeks] = useState(visibleWeeks);
  const [history, setHistory] = useState([]); 
  const [currentQ, setCurrentQ] = useState(null); 
  const [score, setScore] = useState(0);
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);

  const currentMax = LIMITS[targetType] || 10;

  // FIX: Reset sessie bij het wisselen van type om foutieve "results" push te voorkomen
  useEffect(() => {
    setGameState('intro');
    setHistory([]);
    setScore(0);
    setCurrentQ(null);
    setIsFeedbackVisible(false);
    setSelectedWeeks(Object.keys(DB_MAP[targetType]).slice(0, 8));
  }, [targetType]);

  const getNextQuestion = (currentHistory) => {
    const activeDb = DB_MAP[targetType];
    if (!activeDb || !selectedWeeks.length) return null;

    let pool = [];
    selectedWeeks.forEach(week => {
      const questionsInWeek = activeDb[week];
      if (Array.isArray(questionsInWeek)) {
        questionsInWeek.forEach(q => {
          if (!currentHistory.some(h => h.question.q === q.q)) {
            pool.push({ ...q, week: week, type: targetType });
          }
        });
      }
    });

    if (pool.length === 0) return null; 
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  };

  const startQuiz = () => {
    setScore(0);
    setHistory([]); 
    setGameState('quiz');
  };

  useEffect(() => {
    if (gameState === 'quiz' && !isFeedbackVisible) {
        loadNewQuestion();
    }
  }, [gameState, targetType, selectedWeeks]); 

  const loadNewQuestion = () => {
    if (history.length >= currentMax) {
        finishQuiz();
        return;
    }
    const q = getNextQuestion(history);
    if (q) {
      setCurrentQ(q);
      setSelectedOption(null); 
      setIsFeedbackVisible(false); 
    } else {
      if (history.length > 0) finishQuiz();
    }
  };

  const handleAnswer = (index) => {
    setSelectedOption(index);
    setIsFeedbackVisible(true);
    if(currentQ) {
        setHistory(prev => [...prev, { question: currentQ, userChoice: index }]);
        if (index === currentQ.c) {
            setScore(prev => prev + 1);
            if (Math.random() > 0.3) confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#6EE7B7', '#FFFFFF'] });
        }
    }
  };

  const handleNextClick = () => {
      setCurrentQ(null); 
      setIsFeedbackVisible(false);
      setTimeout(() => loadNewQuestion(), 50);
  }

  const finishQuiz = () => {
    setGameState('results');
    setCurrentQ(null);
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#6EE7B7', '#059669', '#FFFFFF'] });
  };

  const toggleWeek = (week) => {
    setSelectedWeeks(prev => prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week]);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111] font-sans selection:bg-[#6EE7B7] selection:text-black overflow-x-hidden relative">
      
      <AnimatePresence>
        {showSettings && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border border-slate-100" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black tracking-tight italic uppercase text-slate-900">Filter Weken</h2>
                        <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} className="text-slate-400"/></button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        {visibleWeeks.map(week => (
                            <button key={week} onClick={() => toggleWeek(week)} className={`p-4 rounded-2xl border-2 text-left font-bold transition-all flex justify-between items-center ${selectedWeeks.includes(week) ? 'border-[#059669] bg-[#059669] text-white' : 'border-slate-100 text-slate-400 hover:border-[#6EE7B7]'}`}>
                                {week}
                                {selectedWeeks.includes(week) && <CheckCircle2 size={16} className="text-white"/>}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setShowSettings(false)} className="w-full px-8 py-4 bg-[#6EE7B7] text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg hover:bg-[#059669] transition-all">Opslaan</button>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-10 pb-40 px-6 max-w-4xl mx-auto min-h-screen flex flex-col">
        
        {gameState === 'quiz' && (
           <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-12 bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
              <button onClick={() => setShowSettings(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase hover:border-[#6EE7B7] hover:text-[#059669] transition-all">
                <Settings2 size={14} /> <span>Filters</span>
              </button>
              <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Voortgang</span>
                  <div className="flex items-center gap-2 font-black italic">
                    <span className="text-[#059669]">{history.length + (currentQ && !isFeedbackVisible ? 1 : 0)}</span>
                    <span className="text-gray-300">/ {currentMax}</span>
                  </div>
              </div>
           </motion.div>
        )}

        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <motion.div key="intro" className="text-center space-y-8 my-auto">
                <div className="inline-block p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl mb-4 text-6xl text-[#059669]">⚖️</div>
                <h1 className="text-5xl md:text-7xl font-black leading-[0.9] text-slate-900 tracking-tighter uppercase italic">Multi-Source <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-emerald-600">Training.</span></h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
                  {targetType === "Expert Quiz" ? "Focus op 10 diepgaande open vragen." : `Maak een sprint van ${currentMax} vragen om je kennis te testen.`} 
                  Kies onderin de gewenste vorm en start de sessie.
                </p>
                <button onClick={startQuiz} className="px-12 py-5 bg-[#059669] text-white text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-2xl hover:bg-[#6EE7B7] hover:scale-105 transition-all flex items-center gap-3 mx-auto">Start Sessie <Play size={18} fill="currentColor" /></button>
            </motion.div>
          )}

          {gameState === 'quiz' && currentQ && (
            <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
              <div className="flex gap-3 mb-8">
                <span className="px-4 py-1.5 bg-white border border-slate-100 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">{currentQ.week}</span>
                <span className="px-4 py-1.5 bg-[#6EE7B7]/10 text-[#059669] rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border border-[#6EE7B7]/20">{currentQ.type}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black leading-tight mb-12 text-slate-900 tracking-tight">{currentQ.q}</h2>
              <div className="space-y-4">
                {currentQ.a.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrect = i === currentQ.c;
                  const showResult = isFeedbackVisible;
                  let cardClasses = "bg-white border-slate-100 text-slate-600 hover:border-[#6EE7B7]";
                  let icon = <div className="w-5 h-5 rounded-full border-2 border-slate-100" />;
                  if (showResult) {
                     if (isCorrect) { cardClasses = "bg-emerald-50 border-[#6EE7B7] text-emerald-900 shadow-none"; icon = <CheckCircle2 className="text-[#059669]" />; }
                     else if (isSelected) { cardClasses = "bg-red-50 border-red-200 text-red-900 shadow-none"; icon = <XCircle className="text-red-500" />; }
                     else { cardClasses = "bg-gray-50 border-transparent text-slate-300 opacity-50"; }
                  } else if (isSelected) { cardClasses = "bg-[#059669] border-[#059669] text-white shadow-xl"; icon = <div className="w-5 h-5 rounded-full border-2 border-[#6EE7B7] bg-[#6EE7B7]" />; }
                  return (
                    <motion.button key={i} whileTap={{ scale: 0.995 }} disabled={isFeedbackVisible} onClick={() => handleAnswer(i)} className={`w-full p-6 text-left border rounded-2xl transition-all duration-300 text-base font-bold flex justify-between items-center ${cardClasses}`}>
                      <span className="leading-snug">{opt}</span>
                      <div className="ml-4 flex-shrink-0">{icon}</div>
                    </motion.button>
                  );
                })}
              </div>
              {isFeedbackVisible && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-8 bg-white border border-slate-100 rounded-[2rem] shadow-xl relative overflow-hidden text-slate-800">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-[#059669] font-black uppercase text-[9px] mb-3 italic"><AlertCircle size={14} /> Toelichting</div>
                        <p className="text-slate-600 text-base leading-relaxed mb-6 font-medium">{currentQ.exp}</p>
                        <button onClick={handleNextClick} className="px-8 py-4 bg-[#059669] text-white font-black uppercase text-[10px] rounded-xl hover:scale-105 transition-all flex items-center gap-2">Volgende Vraag <ChevronRight size={16} /></button>
                    </div>
                  </motion.div>
              )}
            </motion.div>
          )}

          {gameState === 'results' && (
             <motion.div key="results" className="w-full">
                <div className="text-center mb-16">
                    <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center mb-6 border-4 border-[#6EE7B7] shadow-xl mx-auto"><BarChart3 size={32} className="text-[#059669]" /></div>
                    <h2 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter uppercase italic">Sessie Resultaat</h2>
                    <p className="text-3xl font-black text-[#059669] mb-8">{score} / {currentMax} Correct</p>
                    <button onClick={() => setGameState('intro')} className="px-10 py-4 bg-[#059669] text-white font-black uppercase text-xs rounded-full hover:bg-[#6EE7B7] transition-all">Nieuwe Sessie</button>
                </div>
                <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-2">Overzicht van de {currentMax} vragen</h3>
                    {history.map((item, idx) => (
                        <div key={idx} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
                            <div className="flex justify-between mb-4">
                                <span className="text-[10px] font-black uppercase text-slate-300">Vraag {idx + 1} ({item.question.type})</span>
                                {item.userChoice === item.question.c ? <span className="text-[#059669] font-black text-[10px] uppercase flex items-center gap-1"><CheckCircle2 size={12}/> Correct</span> : <span className="text-red-500 font-black text-[10px] uppercase flex items-center gap-1"><XCircle size={12}/> Fout</span>}
                            </div>
                            <h4 className="text-lg font-bold mb-4 leading-tight text-slate-900">{item.question.q}</h4>
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-600">Jouw antwoord: {item.question.a[item.userChoice]}</div>
                            {item.userChoice !== item.question.c && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-sm font-bold text-[#059669] mt-2">Correct: {item.question.a[item.question.c]}</div>}
                        </div>
                    ))}
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FLOATING CONTROLLER */}
      <AnimatePresence>
        {gameState === 'quiz' && !isFeedbackVisible && (
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-10 left-0 w-full flex justify-center z-[50] px-6 pointer-events-none">
                <div className="pointer-events-auto flex gap-3 p-2 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-full shadow-2xl">
                    {QUESTION_TYPES.map((type) => {
                        const isActive = targetType === type;
                        return (
                            <button key={type} onClick={() => setTargetType(type)} className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 border-2 ${isActive ? "bg-[#059669] border-[#059669] text-white" : "bg-transparent border-transparent text-slate-400 hover:text-[#059669]"}`}>
                                {type === "Meerkeuze" && <ListChecks size={12} className="inline mr-1"/>}
                                {type === "True / False" && <HelpCircle size={12} className="inline mr-1"/>}
                                {type === "Expert Quiz" && <ShieldQuestion size={12} className="inline mr-1"/>}
                                {type}
                            </button>
                        )
                    })}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}