import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { BarChart3, CheckCircle2, XCircle, AlertCircle, Settings2, X, ChevronRight, Play } from 'lucide-react';

// ===========================================================================
// DATA IMPORT
// ===========================================================================
import questionDb from './IPRvragen.json'; 

// ===========================================================================
// CONFIGURATIE
// ===========================================================================
const DIFFICULTIES = ["Oefenen", "Tentamen", "Extra Moeilijk"]; 
const MAX_QUESTIONS = 50; 

export default function IPRAdaptiveQuiz() {
  // --- STATE ---
  const [gameState, setGameState] = useState('intro'); 
  
  const visibleWeeks = questionDb ? Object.keys(questionDb).slice(0, 6) : [];
  
  const [selectedWeeks, setSelectedWeeks] = useState(visibleWeeks);
  const [targetDifficulty, setTargetDifficulty] = useState('Tentamen'); 
  const [showSettings, setShowSettings] = useState(false);
  
  const [history, setHistory] = useState([]); 
  const [currentQ, setCurrentQ] = useState(null); 
  const [score, setScore] = useState(0);
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);

  // --- LOGICA ---
  const getNextQuestion = (currentHistory) => {
    if (!selectedWeeks || selectedWeeks.length === 0) return null;
    let mainPool = []; 
    let fallbackPool = []; 

    selectedWeeks.forEach(week => {
      const weekData = questionDb[week];
      if (!weekData) return; 

      const questionsAtTargetLevel = weekData[targetDifficulty];
      if (Array.isArray(questionsAtTargetLevel)) {
        questionsAtTargetLevel.forEach(q => {
          if (!currentHistory.some(h => h.q === q.q)) {
            mainPool.push({ ...q, week: week, level: targetDifficulty });
          }
        });
      }

      DIFFICULTIES.forEach(diff => {
        if (diff !== targetDifficulty && Array.isArray(weekData[diff])) {
           weekData[diff].forEach(q => {
             if (!currentHistory.some(h => h.q === q.q)) {
                fallbackPool.push({ ...q, week: week, level: diff });
             }
           });
        }
      });
    });

    const finalPool = mainPool.length > 0 ? mainPool : fallbackPool;
    if (finalPool.length === 0) return null; 
    const randomIndex = Math.floor(Math.random() * finalPool.length);
    return finalPool[randomIndex];
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
  }, [gameState, targetDifficulty, selectedWeeks]); 

  const loadNewQuestion = () => {
    if (history.length >= MAX_QUESTIONS) {
        finishQuiz();
        return;
    }
    const q = getNextQuestion(history);
    if (q) {
      setCurrentQ(q);
      setSelectedOption(null); 
      setIsFeedbackVisible(false); 
    } else {
      if (history.length > 0) {
          finishQuiz();
      }
    }
  };

  const handleAnswer = (index) => {
    setSelectedOption(index);
    setIsFeedbackVisible(true);
    if(currentQ) {
        setHistory(prev => [...prev, currentQ]);
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
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#6EE7B7', '#000000', '#FFFFFF'] });
  };

  const toggleWeek = (week) => {
    if (selectedWeeks.includes(week)) {
      setSelectedWeeks(prev => prev.filter(w => w !== week));
    } else {
      setSelectedWeeks(prev => [...prev, week]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedWeeks.length === visibleWeeks.length) {
      setSelectedWeeks([]); 
    } else {
      setSelectedWeeks(visibleWeeks); 
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111] font-sans selection:bg-[#6EE7B7] selection:text-black overflow-x-hidden relative">
      
      {/* DE HEADER IS VERWIJDERD EN VERVANGEN DOOR EEN 'STATUS BAR' 
          BINNEN DE MAIN CONTENT OM OVERLAP TE VOORKOMEN 
      */}

      {/* MODAL / SETTINGS POPUP */}
      <AnimatePresence>
        {showSettings && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setShowSettings(false)}
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black tracking-tight italic uppercase">Kies je Weken</h2>
                        <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24}/></button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        {visibleWeeks.map(week => (
                            <button
                                key={week}
                                onClick={() => toggleWeek(week)}
                                className={`p-4 rounded-2xl border-2 text-left font-bold transition-all flex justify-between items-center
                                ${selectedWeeks.includes(week) 
                                    ? 'border-black bg-black text-white' 
                                    : 'border-gray-100 text-gray-400 hover:border-[#6EE7B7]'}`}
                            >
                                {week}
                                {selectedWeeks.includes(week) && <CheckCircle2 size={16} className="text-[#6EE7B7]"/>}
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <button onClick={toggleSelectAll} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                            {selectedWeeks.length === visibleWeeks.length ? "Alles Deselecteren" : "Alles Selecteren"}
                        </button>
                        <button 
                            onClick={() => setShowSettings(false)}
                            className="px-8 py-3 bg-[#6EE7B7] text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-[#5cd6a8] transition-all shadow-lg"
                        >
                            Klaar
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-10 pb-40 px-6 max-w-4xl mx-auto min-h-screen flex flex-col">
        
        {/* NIEUWE COMPACTE STATUS BAR (Vervangt de oude header) */}
        {gameState === 'quiz' && (
           <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-12 bg-white/50 border border-gray-100 p-4 rounded-3xl"
           >
              <button 
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#6EE7B7] hover:text-black transition-all shadow-sm"
              >
                <Settings2 size={14} />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">Voortgang</span>
                  <div className="flex items-center gap-2 font-black italic">
                    <span className="text-[#6EE7B7]">{score}</span>
                    <span className="text-gray-300">/ {history.length}</span>
                  </div>
                </div>
              </div>
           </motion.div>
        )}

        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <motion.div 
                key="intro" 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} 
                className="text-center space-y-8 my-auto"
            >
                <div className="inline-block p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl mb-4">
                    <div className="text-6xl">⚖️</div>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black leading-[0.9] text-[#111] tracking-tighter uppercase italic">
                  Super Tentamen <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6EE7B7] to-emerald-600">Oefening.</span>
                </h1>
                
                <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
                  De ultieme IPR training. Deze modus past zich op jouw keuzes aan.
                  Filter weken en pas moeilijkheid aan tijdens de sessie.
                </p>

                <div className="flex justify-center gap-6 pt-4 flex-wrap">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <CheckCircle2 size={14} className="text-[#6EE7B7]" /> 50 Vragen
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <CheckCircle2 size={14} className="text-[#6EE7B7]" /> Adaptief
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <CheckCircle2 size={14} className="text-[#6EE7B7]" /> Instant Feedback
                    </div>
                </div>

                <div className="pt-8">
                    <button 
                        onClick={startQuiz}
                        className="px-12 py-5 bg-black text-[#6EE7B7] text-xs font-black uppercase tracking-[0.2em] rounded-full hover:bg-[#6EE7B7] hover:text-black transition-all shadow-2xl hover:scale-105 flex items-center gap-3 mx-auto"
                    >
                        Start Oefening <Play size={18} fill="currentColor" />
                    </button>
                </div>
            </motion.div>
          )}

          {gameState === 'quiz' && currentQ && (
            <motion.div 
                key="quiz" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }} 
                className="w-full"
            >
              <div className="flex gap-3 mb-8">
                <span className="px-4 py-1.5 bg-white border border-gray-100 text-gray-500 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                  {currentQ.week}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border
                   ${currentQ.level === 'Oefenen' ? 'bg-green-50 border-green-100 text-green-700' : 
                     currentQ.level === 'Tentamen' ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                  {currentQ.level}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black leading-tight mb-12 text-[#111] tracking-tight">
                {currentQ.q}
              </h2>

              <div className="space-y-4">
                {currentQ.a.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrect = i === currentQ.c;
                  const showResult = isFeedbackVisible;

                  let cardClasses = "bg-white border-gray-100 text-gray-600 hover:border-[#6EE7B7] hover:shadow-lg";
                  let icon = <div className="w-5 h-5 rounded-full border-2 border-gray-200" />;

                  if (showResult) {
                     if (isCorrect) {
                         cardClasses = "bg-emerald-50 border-[#6EE7B7] text-emerald-900 shadow-none";
                         icon = <CheckCircle2 className="text-[#6EE7B7]" />;
                     } else if (isSelected && !isCorrect) {
                         cardClasses = "bg-red-50 border-red-200 text-red-900 shadow-none";
                         icon = <XCircle className="text-red-500" />;
                     } else {
                         cardClasses = "bg-gray-50 border-transparent text-gray-300 opacity-50";
                     }
                  } else if (isSelected) {
                     cardClasses = "bg-black border-black text-white shadow-xl";
                     icon = <div className="w-5 h-5 rounded-full border-2 border-[#6EE7B7] bg-[#6EE7B7]" />;
                  }

                  return (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.995 }}
                      disabled={isFeedbackVisible}
                      onClick={() => handleAnswer(i)}
                      className={`w-full p-6 text-left border rounded-2xl transition-all duration-300 text-base font-bold flex justify-between items-center group ${cardClasses}`}
                    >
                      <span className="leading-snug">{opt}</span>
                      <div className="ml-4 flex-shrink-0">
                          {icon}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {isFeedbackVisible && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 overflow-hidden"
                  >
                    <div className="p-8 bg-black rounded-[2rem] shadow-2xl flex flex-col md:flex-row gap-8 items-start justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6EE7B7] opacity-5 blur-[80px] rounded-full pointer-events-none" />
                        <div className="relative z-10 flex-1">
                            <div className="flex items-center gap-2 text-[#6EE7B7] font-black uppercase text-[9px] tracking-[0.2em] mb-3 italic">
                               <AlertCircle size={14} /> Juridische Toelichting
                            </div>
                            <p className="text-gray-300 text-base leading-relaxed font-medium">
                                {currentQ.exp}
                            </p>
                        </div>
                        <button 
                            onClick={handleNextClick}
                            className="relative z-10 px-8 py-4 bg-[#6EE7B7] text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 transition-all whitespace-nowrap shadow-lg flex items-center gap-2"
                        >
                            Volgende <ChevronRight size={16} />
                        </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {gameState === 'results' && (
             <motion.div key="results" className="flex flex-col items-center justify-center text-center py-10 my-auto">
                <div className="w-24 h-24 rounded-[2rem] bg-black flex items-center justify-center mb-8 border-4 border-[#6EE7B7] shadow-xl">
                    <BarChart3 size={48} className="text-[#6EE7B7]" />
                </div>
                <h2 className="text-5xl font-black text-black mb-2 tracking-tighter uppercase italic">Sessie Voltooid.</h2>
                <p className="text-gray-500 font-bold mb-12">Hier is je prestatie overzicht.</p>
                <div className="grid grid-cols-2 gap-6 mb-16 w-full max-w-md">
                    <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Score</span>
                        <span className="text-5xl font-black text-[#6EE7B7] italic">{score}</span>
                    </div>
                    <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Vragen</span>
                        <span className="text-5xl font-black text-gray-200 italic">{Math.min(history.length, MAX_QUESTIONS)}</span>
                    </div>
                </div>
                <button 
                    onClick={() => setGameState('intro')} 
                    className="px-12 py-5 bg-black text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-[#6EE7B7] hover:text-black transition-all shadow-xl"
                >
                    Terug naar Start
                </button>
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FLOATING DIFFICULTY CONTROLLER */}
      <AnimatePresence>
        {gameState === 'quiz' && !isFeedbackVisible && (
            <motion.div 
                initial={{ y: 100, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-10 left-0 w-full flex justify-center z-[50] px-6 pointer-events-none"
            >
                <div className="pointer-events-auto flex gap-3 p-2 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-full shadow-2xl">
                    {DIFFICULTIES.map((level) => {
                        const isActive = targetDifficulty === level;
                        return (
                            <button
                                key={level}
                                onClick={() => setTargetDifficulty(level)}
                                className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 border-2
                                ${isActive 
                                    ? "bg-black border-black text-[#6EE7B7] shadow-xl" 
                                    : "bg-transparent border-transparent text-gray-400 hover:text-black"}`}
                            >
                                {level}
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