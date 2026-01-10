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
// LET OP: Zorg dat deze spelling EXACT overeenkomt met je JSON keys!
// Als in je JSON "Extra Moeilijk" (1 L) staat, pas het dan hieronder aan.
const DIFFICULTIES = ["Oefenen", "Tentamen", "Extra Moeilijk"]; 
const MAX_QUESTIONS = 50; 

export default function IPRAdaptiveQuiz() {
  // --- STATE ---
  const [gameState, setGameState] = useState('intro'); 
  
  // Veilig de weken ophalen (voorkomt crash als json leeg is)
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
    // Veiligheidscheck
    if (!selectedWeeks || selectedWeeks.length === 0) return null;

    let mainPool = [];     // Vragen van het gekozen niveau
    let fallbackPool = []; // Vragen van andere niveaus (als backup)

    // Loop door alle geselecteerde weken heen
    selectedWeeks.forEach(week => {
      const weekData = questionDb[week];
      if (!weekData) return; // Sla over als week niet bestaat in JSON

      // 1. Probeer vragen van het gekozen niveau te vinden
      const questionsAtTargetLevel = weekData[targetDifficulty];
      
      // Check of het een array is (voorkomt crash bij typefouten in JSON)
      if (Array.isArray(questionsAtTargetLevel)) {
        questionsAtTargetLevel.forEach(q => {
          // Voeg alleen toe als hij nog niet in geschiedenis zit
          if (!currentHistory.some(h => h.q === q.q)) {
            mainPool.push({ ...q, week: week, level: targetDifficulty });
          }
        });
      }

      // 2. Bouw tegelijkertijd een fallback pool op (voor het geval mainPool leeg blijft)
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

    // KIES DE POOL:
    // Hebben we vragen op het gewenste niveau? Gebruik die.
    // Zo niet? (bijv. "Extra Moeillijk" is op of leeg), gebruik dan de rest.
    const finalPool = mainPool.length > 0 ? mainPool : fallbackPool;

    if (finalPool.length === 0) return null; // Echt alles is op

    // Kies willekeurige vraag
    const randomIndex = Math.floor(Math.random() * finalPool.length);
    return finalPool[randomIndex];
  };

  const startQuiz = () => {
    setScore(0);
    setHistory([]); 
    setGameState('quiz');
  };

  // --- LIVE UPDATE EFFECT ---
  // Dit zorgt dat de vraag direct verandert als je instellingen aanpast
  useEffect(() => {
    if (gameState === 'quiz' && !isFeedbackVisible) {
        loadNewQuestion();
    }
  }, [gameState, targetDifficulty, selectedWeeks]); 

  const loadNewQuestion = () => {
    // Stop als we 50 vragen hebben gehad
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
      // Als er geen vragen meer zijn (pool leeg), en we hebben nog niet de max bereikt:
      if (history.length > 0) {
          finishQuiz();
      }
    }
  };

  const handleAnswer = (index) => {
    setSelectedOption(index);
    setIsFeedbackVisible(true);
    
    // Voeg toe aan geschiedenis
    if(currentQ) {
        setHistory(prev => [...prev, currentQ]);
        if (index === currentQ.c) {
            setScore(prev => prev + 1);
            if (Math.random() > 0.3) confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#00E091', '#FFFFFF'] });
        }
    }
  };

  const handleNextClick = () => {
      // Zet tijdelijk op null om een 'refresh' gevoel te geven, effect laadt nieuwe vraag
      setCurrentQ(null); 
      setIsFeedbackVisible(false);
      // Omdat currentQ null wordt, en daarna loadNewQuestion wordt aangeroepen door logica of effect
      // roepen we hem hier direct aan voor snelheid:
      setTimeout(() => loadNewQuestion(), 50);
  }

  const finishQuiz = () => {
    setGameState('results');
    setCurrentQ(null);
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#00E091', '#000000', '#FFFFFF'] });
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

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111] font-sans selection:bg-[#00E091] selection:text-black overflow-x-hidden relative">
      
      {/* HEADER */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 z-40 h-20 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#111] rounded-xl flex items-center justify-center text-[#00E091] font-bold text-xl font-serif shadow-lg shadow-black/10">L</div>
            <div className="flex flex-col">
                <span className="font-serif font-bold text-lg tracking-tight leading-none">Elbert & Lawbooks</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Super Tentamen Oefening</span>
            </div>
        </div>
        
        {gameState === 'quiz' && (
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <Settings2 size={16} />
                <span className="hidden md:inline">Filter Weken</span>
              </button>

              <div className="h-8 w-[1px] bg-gray-200"></div>

              <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Score</span>
                  <div className="flex items-center gap-2">
                     <span className="font-serif font-bold text-lg text-[#00E091]">{score}</span>
                     <span className="text-gray-300 font-serif text-lg">/ {history.length}</span>
                  </div>
              </div>
           </div>
        )}
      </nav>

      {/* POPUP */}
      <AnimatePresence>
        {showSettings && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setShowSettings(false)}
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-serif font-bold">Kies je Weken</h2>
                        <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24}/></button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        {visibleWeeks.map(week => (
                            <button
                                key={week}
                                onClick={() => toggleWeek(week)}
                                className={`p-4 rounded-xl border-2 text-left font-bold transition-all flex justify-between items-center
                                ${selectedWeeks.includes(week) 
                                    ? 'border-[#111] bg-[#111] text-white' 
                                    : 'border-gray-100 text-gray-400 hover:border-[#00E091]'}`}
                            >
                                {week}
                                {selectedWeeks.includes(week) && <CheckCircle2 size={16} className="text-[#00E091]"/>}
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <button onClick={toggleSelectAll} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#111]">
                            {selectedWeeks.length === visibleWeeks.length ? "Alles Deselecteren" : "Alles Selecteren"}
                        </button>
                        <button 
                            onClick={() => setShowSettings(false)}
                            className="px-8 py-3 bg-[#00E091] text-[#111] font-bold rounded-xl hover:bg-[#00c982] transition-colors"
                        >
                            Klaar
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-32 pb-40 px-6 max-w-4xl mx-auto min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {gameState === 'intro' && (
            <motion.div 
                key="intro" 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} 
                className="text-center space-y-8"
            >
                <div className="inline-block p-6 rounded-3xl bg-white border border-gray-100 shadow-xl mb-4">
                    <div className="text-6xl">⚖️</div>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight text-[#111]">
                  Super Tentamen <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E091] to-emerald-600">Oefening.</span>
                </h1>
                
                <p className="text-xl text-gray-500 max-w-6xl mx-auto leading-relaxed">
                  Welkom bij de ultieme IPR training. Deze modus past zich op jouw keuzes aan.
                  Je kunt tijdens de toets de moeilijkheidsgraad aanpassen en specifieke weken filteren. Dit gebeurt direct.
                </p>

                <div className="flex justify-center gap-4 pt-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                        <CheckCircle2 size={16} className="text-[#00E091]" /> 50 Vragen
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                        <CheckCircle2 size={16} className="text-[#00E091]" /> Adaptief
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                        <CheckCircle2 size={16} className="text-[#00E091]" /> Instant Feedback
                    </div>
                </div>

                <div className="pt-8">
                    <button 
                        onClick={startQuiz}
                        className="px-12 py-5 bg-[#111] text-white text-lg font-bold rounded-full hover:bg-[#00E091] hover:text-[#111] transition-all shadow-2xl hover:scale-105 flex items-center gap-3 mx-auto"
                    >
                        Start Oefening <Play size={20} fill="currentColor" />
                    </button>
                </div>
            </motion.div>
          )}

          {gameState === 'quiz' && currentQ && (
            <motion.div 
                key="quiz" 
                initial={{ opacity: 0, x: 50 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -50 }} 
                className="w-full"
            >
              <div className="flex gap-3 mb-8">
                <span className="px-4 py-1.5 bg-white border border-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                  {currentQ.week}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm border
                   ${currentQ.level === 'Oefenen' ? 'bg-green-50 border-green-100 text-green-700' : 
                     currentQ.level === 'Tentamen' ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                  {currentQ.level}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-serif font-medium leading-[1.3] mb-12 text-[#111]">
                {currentQ.q}
              </h2>

              <div className="space-y-4">
                {currentQ.a.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrect = i === currentQ.c;
                  const showResult = isFeedbackVisible;

                  let cardClasses = "bg-white border-gray-100 text-gray-600 hover:border-[#00E091] hover:shadow-md";
                  let icon = <div className="w-5 h-5 rounded-full border-2 border-gray-200" />;

                  if (showResult) {
                     if (isCorrect) {
                         cardClasses = "bg-emerald-50 border-[#00E091] text-emerald-900 shadow-none";
                         icon = <CheckCircle2 className="text-[#00E091]" />;
                     } else if (isSelected && !isCorrect) {
                         cardClasses = "bg-red-50 border-red-200 text-red-900 shadow-none";
                         icon = <XCircle className="text-red-500" />;
                     } else {
                         cardClasses = "bg-gray-50 border-transparent text-gray-300 opacity-50";
                     }
                  } else if (isSelected) {
                     cardClasses = "bg-[#111] border-[#111] text-white shadow-lg";
                     icon = <div className="w-5 h-5 rounded-full border-2 border-[#00E091] bg-[#00E091]" />;
                  }

                  return (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.99 }}
                      disabled={isFeedbackVisible}
                      onClick={() => handleAnswer(i)}
                      className={`w-full p-6 text-left border rounded-2xl transition-all duration-200 text-lg font-medium flex justify-between items-center group ${cardClasses}`}
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
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-8 overflow-hidden"
                  >
                    <div className="p-8 bg-[#111] rounded-3xl shadow-2xl flex flex-col md:flex-row gap-8 items-start justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E091] opacity-5 blur-[80px] rounded-full pointer-events-none" />
                        <div className="relative z-10 flex-1">
                            <div className="flex items-center gap-2 text-[#00E091] font-bold uppercase text-[10px] tracking-[0.2em] mb-3">
                               <AlertCircle size={14} /> Juridische Toelichting
                            </div>
                            <p className="text-gray-300 text-lg leading-relaxed font-serif">
                                {currentQ.exp}
                            </p>
                        </div>
                        <button 
                            onClick={handleNextClick}
                            className="relative z-10 px-8 py-4 bg-white text-[#111] font-bold rounded-xl hover:bg-[#00E091] transition-colors whitespace-nowrap shadow-lg flex items-center gap-2"
                        >
                            Volgende <ChevronRight size={18} />
                        </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {gameState === 'results' && (
             <motion.div key="results" className="flex flex-col items-center justify-center text-center py-10">
                <div className="w-24 h-24 rounded-full bg-[#00E091]/10 flex items-center justify-center mb-8 border border-[#00E091]/20">
                    <BarChart3 size={48} className="text-[#00E091]" />
                </div>
                <h2 className="text-6xl font-serif font-bold text-[#111] mb-2">Sessie Voltooid.</h2>
                <p className="text-gray-500 text-xl mb-12">Hier is je prestatie overzicht.</p>
                <div className="grid grid-cols-2 gap-8 mb-16 w-full max-w-md">
                    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col items-center">
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Score</span>
                        <span className="text-5xl font-black text-[#111]">{score}</span>
                    </div>
                    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col items-center">
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Vragen</span>
                        <span className="text-5xl font-black text-gray-300">{Math.min(history.length, MAX_QUESTIONS)}</span>
                    </div>
                </div>
                <button 
                    onClick={() => setGameState('intro')} 
                    className="px-12 py-5 bg-[#111] text-white font-bold rounded-full hover:bg-[#00E091] hover:text-[#111] transition-colors shadow-xl"
                >
                    Terug naar Start
                </button>
             </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* CONTROLLER */}
      <AnimatePresence>
        {gameState === 'quiz' && !isFeedbackVisible && (
            <motion.div 
                initial={{ y: 100, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-10 left-0 w-full flex justify-center z-40 px-6 pointer-events-none"
            >
                <div className="pointer-events-auto flex gap-4">
                    {DIFFICULTIES.map((level) => {
                        const isActive = targetDifficulty === level;
                        // STYLES HARD INGESTELD VOOR DUIDELIJKHEID:
                        const activeStyle = "bg-[#00E091] border-[#00E091] text-[#111] scale-105 shadow-[0_0_20px_rgba(0,224,145,0.4)]";
                        const inactiveStyle = "bg-[#111] border-[#333] text-gray-400 hover:text-white hover:border-gray-500";

                        return (
                            <button
                                key={level}
                                onClick={() => setTargetDifficulty(level)}
                                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border-2 shadow-xl ${isActive ? activeStyle : inactiveStyle}`}
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