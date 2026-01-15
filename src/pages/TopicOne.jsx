import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { BarChart3, CheckCircle2, XCircle, AlertCircle, Settings2, X, ChevronRight, Play, ListChecks, HelpCircle, ShieldQuestion, Send } from 'lucide-react';

// Importeer de centrale masterData
import { masterData } from '../data/masterData'; 

const QUESTION_TYPES = [
  { label: "Meerkeuze", key: "MK" },
  { label: "True / False", key: "TF" },
  { label: "Expert Quiz", key: "Open" }
];

const LIMITS = { "MK": 30, "TF": 30, "Open": 10 };

export default function IPRAdaptiveQuiz() {
  const { subjectSlug } = useParams();
  
  const activeSubject = masterData[subjectSlug];
  const questionsDb = activeSubject?.db || {};
  const accentColor = activeSubject?.accent || "#059669";

  const [gameState, setGameState] = useState('intro'); 
  const [targetType, setTargetType] = useState('MK'); 
  const [pendingType, setPendingType] = useState(null); // Voor de bevestigings-popup
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userOpenAnswer, setUserOpenAnswer] = useState(""); 
  
  const availableWeeks = useMemo(() => Object.keys(questionsDb), [questionsDb]);
  const [selectedWeeks, setSelectedWeeks] = useState(availableWeeks);
  
  const [history, setHistory] = useState([]); 
  const [currentQ, setCurrentQ] = useState(null); 
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);

  const currentMax = LIMITS[targetType] || 10;

  // Effect: Als de weken worden aangepast tijdens de quiz, laad direct een nieuwe vraag
  useEffect(() => {
    if (gameState === 'quiz' && !isFeedbackVisible) {
      loadNewQuestion();
    }
  }, [selectedWeeks]);

  // Reset bij verandering van type (bevestigd)
  useEffect(() => {
    setGameState('intro');
    setHistory([]);
    setScore(0);
    setCurrentQ(null);
    setUserOpenAnswer("");
    setIsFeedbackVisible(false);
    setSelectedWeeks(Object.keys(questionsDb));
  }, [targetType, subjectSlug, questionsDb]);

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

  // Beveiliging bij wisselen van vorm
  const requestTypeChange = (newKey) => {
    if (newKey === targetType) return;
    if (history.length > 0 && gameState === 'quiz') {
      setPendingType(newKey);
      setShowConfirmModal(true);
    } else {
      setTargetType(newKey);
    }
  };

  const confirmTypeChange = () => {
    setTargetType(pendingType);
    setShowConfirmModal(false);
    setPendingType(null);
  };

  const handleChoiceAnswer = (index) => {
    if (isFeedbackVisible) return;
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
    setScore(prev => prev + 1);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 }, colors: [accentColor] });
  };

  const finishQuiz = () => {
    setGameState('results');
    setCurrentQ(null);
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
  };

  if (!activeSubject) return <div className="p-20 text-center font-black">Laden van module data...</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111] font-sans selection:bg-[#6EE7B7]">
      
      {/* CONFIRMATION POPUP */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-8 rounded-[2rem] max-w-sm w-full shadow-2xl text-center">
              <AlertCircle size={48} className="mx-auto mb-4 text-orange-500" />
              <h3 className="text-xl font-black uppercase italic mb-2">Weet je het zeker?</h3>
              <p className="text-slate-500 text-sm mb-6">Als je nu van vorm wisselt, verlies je al je voortgang in deze sessie.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-xs uppercase tracking-widest">Annuleren</button>
                <button onClick={confirmTypeChange} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest">Wissel van vorm</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border border-slate-100" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-2xl font-black italic uppercase mb-6" style={{ color: accentColor }}>Weken Filter</h2>
                    <div className="grid grid-cols-2 gap-3 mb-8 text-sm">
                        {availableWeeks.map(week => (
                            <button key={week} onClick={() => setSelectedWeeks(prev => prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week])} 
                              className={`p-4 rounded-2xl border-2 text-left font-bold transition-all ${selectedWeeks.includes(week) ? 'text-white' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                              style={selectedWeeks.includes(week) ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
                            >
                                {week.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setShowSettings(false)} className="w-full py-4 bg-black text-white font-black uppercase rounded-xl tracking-widest text-xs">Opslaan</button>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-10 pb-40 px-6 max-w-4xl mx-auto min-h-screen">
        {gameState === 'quiz' && currentQ && (
          <div className="w-full">
            <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{currentQ.week.replace('_', ' ')} — {history.length + 1}/{currentMax}</span>
                <button onClick={() => setShowSettings(true)} className="p-2 bg-white border rounded-lg text-slate-400 transition-colors"><Settings2 size={16}/></button>
            </div>

            <h2 className="text-2xl md:text-3xl font-black mb-10 leading-tight tracking-tight text-slate-900">{currentQ.q}</h2>

            {targetType !== 'Open' ? (
              <div className="space-y-4">
                {currentQ.a.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrect = i === currentQ.c;
                  return (
                    <button key={i} disabled={isFeedbackVisible} onClick={() => handleChoiceAnswer(i)} 
                      className={`w-full p-6 text-left border-2 rounded-2xl transition-all font-bold flex justify-between items-center ${isFeedbackVisible ? (isCorrect ? "bg-emerald-50 border-emerald-400 text-emerald-900" : (isSelected ? "bg-red-50 border-red-200 text-red-900" : "opacity-40 grayscale")) : "bg-white border-slate-100 hover:border-slate-300 text-slate-700"}`}
                      style={!isFeedbackVisible && isSelected ? { backgroundColor: accentColor, borderColor: accentColor, color: 'white' } : {}}
                    >
                      <span className="max-w-[90%]">{opt}</span>
                      {isFeedbackVisible && isCorrect && <CheckCircle2 className="text-emerald-600 shrink-0"/>}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                <textarea 
                  value={userOpenAnswer}
                  onChange={(e) => setUserOpenAnswer(e.target.value)}
                  disabled={isFeedbackVisible}
                  placeholder="Typ hier je juridische onderbouwing..."
                  className="w-full h-48 p-6 rounded-3xl border-2 border-slate-100 outline-none transition-all font-medium text-lg resize-none shadow-sm"
                  style={{ borderFocusColor: accentColor }}
                />
                {!isFeedbackVisible && (
                  <button onClick={handleOpenSubmit} className="w-full py-5 bg-black text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl flex items-center justify-center gap-3 hover:opacity-80 transition-opacity shadow-xl">
                    Antwoord Controleren <Send size={18}/>
                  </button>
                )}
              </div>
            )}

            <AnimatePresence>
              {isFeedbackVisible && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10 p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: accentColor }} />
                  
                  {targetType === 'Open' && (
                    <div className="mb-8">
                      <p className="text-[10px] font-black uppercase mb-4 tracking-widest italic flex items-center gap-2" style={{ color: accentColor }}><CheckCircle2 size={14}/> Voorbeeld Antwoord</p>
                      <p className="text-slate-800 text-lg font-bold leading-relaxed mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">{currentQ.sample}</p>
                      
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest italic">Checklist: Belangrijke kernpunten</p>
                      <div className="grid gap-2 mb-8">
                          {currentQ.checklist.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600">
                                  <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm" style={{ color: accentColor }}>✓</div>
                                  {item}
                              </div>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2 italic tracking-widest flex items-center gap-2"><AlertCircle size={14}/> Juridische Toelichting</p>
                  <p className="text-slate-600 font-medium leading-relaxed mb-10 text-base">{currentQ.exp}</p>
                  
                  <button onClick={() => loadNewQuestion()} className="w-full py-5 text-white font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg" style={{ backgroundColor: accentColor }}>
                    Volgende Vraag <ChevronRight size={20}/>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {gameState === 'intro' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 flex flex-col items-center">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-5xl mb-10 border border-slate-100">⚖️</div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase mb-4 text-slate-900 leading-none">{activeSubject.title} Training <br/><span style={{ color: accentColor }}>2026</span></h1>
                <p className="text-slate-400 font-bold mb-12 max-w-sm mx-auto uppercase text-[10px] tracking-[0.3em]">Selecteer een vraagvorm om te starten</p>
                <button onClick={startQuiz} className="px-16 py-6 text-white font-black uppercase tracking-[0.2em] text-xs rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-4" style={{ backgroundColor: accentColor }}>
                  Start Sessie <Play size={16} fill="white"/>
                </button>
            </motion.div>
        )}

        {gameState === 'results' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ color: accentColor, backgroundColor: `${accentColor}1A` }}>
                    <BarChart3 size={40}/>
                </div>
                <h2 className="text-4xl font-black uppercase italic mb-2 tracking-tighter">Sessie Voltooid</h2>
                <p className="text-slate-400 font-bold mb-10 uppercase text-xs tracking-widest">Je resultaat: <span style={{ color: accentColor }}>{score} / {currentMax}</span></p>
                <button onClick={() => setGameState('intro')} className="px-12 py-4 bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-full hover:opacity-80 transition-opacity">Terug naar Menu</button>
            </motion.div>
        )}
      </main>

      <div className="fixed bottom-10 left-0 w-full flex justify-center px-6 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200 p-2 rounded-full shadow-2xl flex gap-1 pointer-events-auto ring-4 ring-black/5">
              {QUESTION_TYPES.map((type) => (
                  <button 
                    key={type.key} 
                    onClick={() => requestTypeChange(type.key)} 
                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${targetType === type.key ? "text-white shadow-lg" : "text-slate-400 hover:text-slate-900"}`}
                    style={targetType === type.key ? { backgroundColor: accentColor } : {}}
                  >
                      {type.label}
                  </button>
              ))}
          </div>
      </div>
    </div>
  );
}