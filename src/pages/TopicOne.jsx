import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { BarChart3, CheckCircle2, XCircle, AlertCircle, Settings2, X, ChevronRight, Play, ListChecks, HelpCircle, ShieldQuestion, Send } from 'lucide-react';
import { questionsDb } from './data/index';

const QUESTION_TYPES = [
  { label: "Meerkeuze", key: "MK" },
  { label: "True / False", key: "TF" },
  { label: "Open Vragen", key: "Open" }
];

const LIMITS = { "MK": 30, "TF": 30, "Open": 10 };

export default function IPRAdaptiveQuiz() {
  const [gameState, setGameState] = useState('intro'); 
  const [targetType, setTargetType] = useState('MK'); 
  const [showSettings, setShowSettings] = useState(false);
  const [userOpenAnswer, setUserOpenAnswer] = useState(""); // Voor open vragen
  
  const availableWeeks = useMemo(() => Object.keys(questionsDb), []);
  const [selectedWeeks, setSelectedWeeks] = useState(availableWeeks);
  
  const [history, setHistory] = useState([]); 
  const [currentQ, setCurrentQ] = useState(null); 
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);

  const currentMax = LIMITS[targetType] || 10;

  useEffect(() => {
    setGameState('intro');
    setHistory([]);
    setScore(0);
    setCurrentQ(null);
    setUserOpenAnswer("");
  }, [targetType]);

  const getNextQuestion = (currentHistory) => {
    let pool = [];
    selectedWeeks.forEach(week => {
      const questionsInFile = questionsDb[week]?.[targetType];
      if (Array.isArray(questionsInFile)) {
        questionsInFile.forEach(q => {
          if (!currentHistory.some(h => h.question.q === q.q)) {
            pool.push({ ...q, week, typeLabel: QUESTION_TYPES.find(t => t.key === targetType).label });
          }
        });
      }
    });
    return pool.length === 0 ? null : pool[Math.floor(Math.random() * pool.length)];
  };

  const startQuiz = () => {
    setScore(0);
    setHistory([]); 
    setGameState('quiz');
    setTimeout(() => loadNewQuestion([]), 10);
  };

  const loadNewQuestion = (currentHistory = history) => {
    if (currentHistory.length >= currentMax) { finishQuiz(); return; }
    const q = getNextQuestion(currentHistory);
    if (q) {
      setCurrentQ(q);
      setSelectedOption(null); 
      setUserOpenAnswer("");
      setIsFeedbackVisible(false); 
    } else {
      if (currentHistory.length > 0) finishQuiz();
    }
  };

  const handleChoiceAnswer = (index) => {
    setSelectedOption(index);
    setIsFeedbackVisible(true);
    const isCorrect = index === currentQ.c;
    setHistory(prev => [...prev, { question: currentQ, userChoice: index, correct: isCorrect }]);
    if (isCorrect) {
        setScore(prev => prev + 1);
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    }
  };

  const handleOpenSubmit = () => {
    if (!userOpenAnswer.trim()) return;
    setIsFeedbackVisible(true);
    setHistory(prev => [...prev, { question: currentQ, userChoice: userOpenAnswer, isOpen: true }]);
    setScore(prev => prev + 1); // Open vragen tellen we als 'voltooid'
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 }, colors: ['#6EE7B7'] });
  };

  const finishQuiz = () => {
    setGameState('results');
    setCurrentQ(null);
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111] font-sans selection:bg-[#6EE7B7]">
      
      {/* SETTINGS MODAL (Gelijk aan vorige) */}
      <AnimatePresence>
        {showSettings && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border border-slate-100" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-2xl font-black italic uppercase mb-6">Weken Filter</h2>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        {availableWeeks.map(week => (
                            <button key={week} onClick={() => setSelectedWeeks(prev => prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week])} className={`p-4 rounded-2xl border-2 text-left font-bold transition-all ${selectedWeeks.includes(week) ? 'border-[#059669] bg-[#059669] text-white' : 'border-slate-100 text-slate-400'}`}>
                                {week.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setShowSettings(false)} className="w-full py-4 bg-black text-white font-black uppercase rounded-xl">Opslaan</button>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-10 pb-40 px-6 max-w-4xl mx-auto min-h-screen">
        {gameState === 'quiz' && currentQ && (
          <div className="w-full">
            {/* Progress Bar */}
            <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{currentQ.week.replace('_', ' ')} — {history.length + 1}/{currentMax}</span>
                <button onClick={() => setShowSettings(true)} className="p-2 bg-white border rounded-lg"><Settings2 size={16}/></button>
            </div>

            <h2 className="text-2xl md:text-3xl font-black mb-10 leading-tight">{currentQ.q}</h2>

            {/* INTERACTIE: MEERKEUZE OF OPEN */}
            {targetType !== 'Open' ? (
              <div className="space-y-4">
                {currentQ.a.map((opt, i) => (
                  <button key={i} disabled={isFeedbackVisible} onClick={() => handleChoiceAnswer(i)} className={`w-full p-6 text-left border-2 rounded-2xl transition-all font-bold flex justify-between items-center ${isFeedbackVisible ? (i === currentQ.c ? "bg-emerald-50 border-[#6EE7B7]" : (selectedOption === i ? "bg-red-50 border-red-200" : "opacity-40")) : "bg-white border-slate-100 hover:border-[#6EE7B7]"}`}>
                    {opt}
                    {isFeedbackVisible && i === currentQ.c && <CheckCircle2 className="text-[#059669]"/>}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <textarea 
                  value={userOpenAnswer}
                  onChange={(e) => setUserOpenAnswer(e.target.value)}
                  disabled={isFeedbackVisible}
                  placeholder="Typ hier je juridische onderbouwing..."
                  className="w-full h-48 p-6 rounded-3xl border-2 border-slate-100 focus:border-[#6EE7B7] outline-none transition-all font-medium text-lg resize-none"
                />
                {!isFeedbackVisible && (
                  <button onClick={handleOpenSubmit} className="w-full py-5 bg-black text-white font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3">
                    Antwoord Controleren <Send size={18}/>
                  </button>
                )}
              </div>
            )}

            {/* FEEDBACK SECTIE */}
            {isFeedbackVisible && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10 p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl">
                {targetType === 'Open' && (
                  <div className="mb-8">
                    <p className="text-[10px] font-black uppercase text-[#059669] mb-4 tracking-widest italic">Voorbeeld Antwoord</p>
                    <p className="text-slate-800 text-lg font-bold leading-relaxed mb-6">{currentQ.sample}</p>
                    
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest italic">Checklist: Heb je dit benoemd?</p>
                    <div className="grid gap-2">
                        {currentQ.checklist.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-600">
                                <div className="w-5 h-5 rounded-md border-2 border-[#6EE7B7] flex items-center justify-center text-[#059669]">✓</div>
                                {item}
                            </div>
                        ))}
                    </div>
                  </div>
                )}
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2 italic">Toelichting</p>
                <p className="text-slate-600 font-medium leading-relaxed mb-8">{currentQ.exp}</p>
                <button onClick={() => loadNewQuestion()} className="w-full py-4 bg-[#059669] text-white font-black uppercase rounded-xl flex items-center justify-center gap-2">
                  Volgende Vraag <ChevronRight size={18}/>
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* Intro & Results blijven grotendeels gelijk */}
        {gameState === 'intro' && (
            <div className="text-center py-20">
                <h1 className="text-6xl font-black tracking-tighter italic uppercase mb-4">IPR Training</h1>
                <p className="text-slate-400 font-bold mb-10">Kies je module onderin om te starten.</p>
                <button onClick={startQuiz} className="px-12 py-5 bg-[#059669] text-white font-black uppercase rounded-full shadow-xl">Start Sessie</button>
            </div>
        )}
      </main>

      {/* FOOTER CONTROLLER */}
      <div className="fixed bottom-10 left-0 w-full flex justify-center px-6">
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200 p-1.5 rounded-full shadow-2xl flex gap-1">
              {QUESTION_TYPES.map((type) => (
                  <button key={type.key} onClick={() => setTargetType(type.key)} className={`px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${targetType === type.key ? "bg-[#059669] text-white" : "text-slate-400"}`}>
                      {type.label}
                  </button>
              ))}
          </div>
      </div>
    </div>
  );
}