import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  BarChart3, CheckCircle2, XCircle, AlertCircle, Settings2, 
  X, ChevronRight, Play, Send, ChevronLeft, Check, Scale 
} from 'lucide-react';

// --- CONFIGURATIE ---
const QUESTION_TYPES = [
  { label: "Meerkeuze", key: "MK" },
  { label: "True / False", key: "TrueFalse" },
  { label: "Open Vraag", key: "Open" } 
];

const LIMITS = { "MK": 30, "TrueFalse": 30, "Open": 10 };

export default function UnifiedAdaptiveQuiz() {
  const navigate = useNavigate();
  
  // --- DATA UIT CONTEXT ---
  const { db, config } = useOutletContext();

  const questionsDb = db || {};
  const activeSubject = config; 
  const accentColor = config?.accent || "#059669";

  // States
  const [gameState, setGameState] = useState('intro'); 
  const [targetType, setTargetType] = useState('MK'); 
  const [pendingType, setPendingType] = useState(null); 
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const availableWeeks = useMemo(() => Object.keys(questionsDb), [questionsDb]);
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  
  const [history, setHistory] = useState([]); 
  const [currentQ, setCurrentQ] = useState(null); 
  const [score, setScore] = useState(0);
  const [userOpenAnswer, setUserOpenAnswer] = useState(""); 
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);

  const currentMax = LIMITS[targetType] || 10;

  // Sync weeks bij laden
  useEffect(() => {
    if (availableWeeks.length > 0 && selectedWeeks.length === 0) {
      setSelectedWeeks(availableWeeks);
    }
  }, [availableWeeks]);

  // Quiz resetten bij type wissel
  useEffect(() => {
    if (gameState === 'quiz') {
      resetForNewType();
      loadNewQuestion([]); 
    }
  }, [targetType]);

  const resetForNewType = () => {
    setHistory([]);
    setScore(0);
    setCurrentQ(null);
    setUserOpenAnswer("");
    setSelectedOption(null);
    setIsFeedbackVisible(false);
  };

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
    if (selectedWeeks.length === 0) return alert("Selecteer tenminste één categorie.");
    setGameState('quiz');
    resetForNewType();
    setTimeout(() => loadNewQuestion([]), 10);
  };

  const loadNewQuestion = (currentHistory = history) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentHistory.length >= currentMax) { finishQuiz(); return; }
    const q = getNextQuestion(currentHistory);
    if (q) {
      setCurrentQ(q);
      setSelectedOption(null); 
      setUserOpenAnswer("");
      setIsFeedbackVisible(false); 
    } else {
      if (currentHistory.length > 0) finishQuiz();
      else setGameState('intro');
    }
  };

  const requestTypeChange = (newKey) => {
    if (newKey === targetType) return;
    if (history.length > 0 && gameState === 'quiz') {
      setPendingType(newKey);
      setShowConfirmModal(true);
    } else {
      setTargetType(newKey);
      if (gameState !== 'quiz') setGameState('intro'); 
    }
  };

  const confirmTypeChange = () => {
    setShowConfirmModal(false);
    setTargetType(pendingType);
    setPendingType(null);
  };

  const handleChoiceAnswer = (index) => {
    if (isFeedbackVisible || !currentQ) return;
    setSelectedOption(index);
    setIsFeedbackVisible(true);
    const isCorrect = index === currentQ.c;
    setHistory(prev => [...prev, { question: currentQ, userChoice: index, correct: isCorrect }]);
    if (isCorrect) {
        setScore(prev => prev + 1);
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleOpenSubmit = () => {
    if (!userOpenAnswer.trim() || !currentQ) return;
    setIsFeedbackVisible(true);
    setHistory(prev => [...prev, { question: currentQ, userChoice: userOpenAnswer, isOpen: true }]);
    setScore(prev => prev + 1);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 }, colors: [accentColor] });
  };

  const finishQuiz = () => {
    setGameState('results');
    setCurrentQ(null);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  };

  if (!activeSubject) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1e293b] font-sans selection:bg-emerald-100 flex flex-col overflow-x-hidden">
      
      {/* --- NAVIGATIE --- */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-200 h-14">
        <div className="max-w-4xl mx-auto px-6 h-full flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors">
            <ChevronLeft size={14} strokeWidth={3} /> TERUG
          </button>
          
          <div className="flex items-center gap-2">
            <Scale size={18} style={{ color: accentColor }} />
            <div className="text-[10px] font-black uppercase tracking-[0.3em] italic" style={{ color: accentColor }}>
              Lawbooks
            </div>
          </div>

          <div className="w-8" /> {/* Spacer om balans te houden na verwijderen settings */}
        </div>
        {gameState === 'quiz' && (
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-100">
            <motion.div className="h-full" style={{ backgroundColor: accentColor }} animate={{ width: `${(history.length / currentMax) * 100}%` }} />
          </div>
        )}
      </nav>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-8 rounded-[2rem] max-w-sm w-full shadow-2xl text-center">
              <AlertCircle size={48} className="mx-auto mb-4 text-orange-500" />
              <h3 className="text-xl font-black uppercase italic mb-2 tracking-tight">Vorm Wisselen?</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">Je huidige voortgang wordt gewist als je nu overstapt naar {QUESTION_TYPES.find(t => t.key === pendingType)?.label}.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-xs uppercase tracking-widest">Blijf</button>
                <button onClick={confirmTypeChange} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-200">Wissel</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showSettings && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black uppercase text-sm tracking-widest">Filter Categorieën</h3>
                  <button onClick={() => setShowSettings(false)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100"><X size={20}/></button>
                </div>
                <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {availableWeeks.map(week => (
                    <button key={week} onClick={() => setSelectedWeeks(prev => prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week])}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedWeeks.includes(week) ? "bg-emerald-50 text-emerald-900" : "border-slate-100 bg-white text-slate-400"}`}
                      style={selectedWeeks.includes(week) ? { borderColor: accentColor, backgroundColor: `${accentColor}1A`, color: accentColor } : {}}
                    >
                      <span className="font-bold text-sm">{week.replace('_', ' ')}</span>
                      {selectedWeeks.includes(week) && <Check size={18} strokeWidth={3} />}
                    </button>
                  ))}
                </div>
                <button onClick={() => { setShowSettings(false); if(gameState === 'quiz') resetForNewType(); startQuiz(); }}
                  className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all"
                > Instellingen Opslaan </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CONTENT AREA --- */}
      <main className="flex-grow pt-20 pb-32 px-6 max-w-3xl mx-auto w-full">
        {gameState === 'intro' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-10 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl mb-6 border border-slate-200">⚖️</div>
            <h1 className="text-3xl md:text-5xl font-black uppercase italic mb-3 tracking-tight text-slate-900 leading-tight">{activeSubject.title}</h1>
            <p className="text-slate-400 font-bold mb-10 uppercase text-[10px] tracking-[0.3em]">Module: {QUESTION_TYPES.find(t => t.key === targetType).label}</p>
            <button onClick={startQuiz} className="group py-4 px-10 text-white font-black uppercase text-xs rounded-xl shadow-lg flex items-center gap-3 transition-all hover:scale-[1.02]" style={{ backgroundColor: accentColor }}>
              Start Training <Play size={14} fill="white" />
            </button>
          </motion.div>
        )}

        {gameState === 'quiz' && currentQ && (
          <motion.div key={currentQ.q} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-center mb-6">
                <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase text-slate-500 tracking-wider">
                  {currentQ.week?.replace('_', ' ')} • {history.length + 1}/{currentMax}
                </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold mb-8 text-slate-900 leading-snug text-center max-w-2xl mx-auto">
              {currentQ.q}
            </h2>

            <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
              {targetType !== 'Open' ? (
                (currentQ.a || ["Waar", "Niet waar"]).map((opt, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrect = i === currentQ.c;
                  return (
                    <button key={i} disabled={isFeedbackVisible} onClick={() => handleChoiceAnswer(i)} 
                      className={`w-full p-4 md:p-5 text-left border-2 rounded-2xl transition-all font-semibold flex justify-between items-center group
                        ${isFeedbackVisible ? (isCorrect ? "bg-emerald-50 border-emerald-400 text-emerald-900" : (isSelected ? "bg-red-50 border-red-200 text-red-900" : "opacity-40 grayscale")) : "bg-white border-white hover:border-slate-200 text-slate-700 shadow-sm"}`}
                    >
                      <span className="max-w-[90%] text-base md:text-lg leading-snug">{opt}</span>
                      {isFeedbackVisible && isCorrect && <CheckCircle2 size={22} className="text-emerald-600 shrink-0 ml-2" />}
                      {isFeedbackVisible && isSelected && !isCorrect && <XCircle size={22} className="text-red-500 shrink-0 ml-2" />}
                    </button>
                  );
                })
              ) : (
                <div className="space-y-4">
                  <textarea value={userOpenAnswer} onChange={(e) => setUserOpenAnswer(e.target.value)} disabled={isFeedbackVisible}
                    placeholder="Typ hier je juridische analyse..."
                    className="w-full h-48 p-6 rounded-3xl border-2 border-white outline-none font-medium text-lg resize-none bg-white focus:border-slate-200 transition-all shadow-sm"
                  />
                  {!isFeedbackVisible && (
                    <button onClick={handleOpenSubmit} className="w-full py-4 bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-3">
                      CONTROLEER ANTWOORD <Send size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <AnimatePresence>
              {isFeedbackVisible && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mt-8 max-w-2xl mx-auto">
                  <div className="p-6 md:p-8 bg-white border border-slate-200 rounded-[2rem] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: accentColor }} />
                    
                    {targetType === 'Open' && (
                      <div className="mb-6">
                        <p className="text-[9px] font-black uppercase mb-3 italic flex items-center gap-2" style={{ color: accentColor }}><CheckCircle2 size={12}/> Modelantwoord</p>
                        <p className="text-slate-800 text-base font-bold leading-relaxed mb-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">{currentQ.sample}</p>
                        <p className="text-[9px] font-black uppercase text-slate-400 mb-3 italic">Checklist punten</p>
                        <div className="grid gap-2 mb-6">
                          {currentQ.checklist?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-600">
                              <div className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0" style={{ color: accentColor }}>✓</div>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest flex items-center gap-2"><AlertCircle size={12}/> Toelichting</p>
                    <p className="text-slate-700 font-medium leading-relaxed mb-8 text-sm md:text-base">{currentQ.exp}</p>
                    <button onClick={() => loadNewQuestion()} className="w-full py-4 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2" style={{ backgroundColor: accentColor }}>
                      VOLGENDE VRAAG <ChevronRight size={16} strokeWidth={3}/>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {gameState === 'results' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ color: accentColor, backgroundColor: `${accentColor}1A` }}>
              <BarChart3 size={32}/>
            </div>
            <h2 className="text-3xl font-black uppercase italic mb-2 tracking-tight">Training Voltooid</h2>
            <p className="text-slate-400 font-bold mb-10 uppercase text-[10px]">Resultaat: <span style={{ color: accentColor }}>{score} / {currentMax}</span></p>
            <button onClick={() => setGameState('intro')} className="px-10 py-4 bg-slate-900 text-white font-black uppercase text-[10px] rounded-full shadow-xl">Terug naar Menu</button>
          </motion.div>
        )}
      </main>

      {/* --- BOTTOM NAV --- */}
      <div className="fixed bottom-6 left-0 w-full flex justify-center px-6 z-[150]">
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200 p-1.5 rounded-2xl shadow-xl flex items-center gap-1">
              {QUESTION_TYPES.map((type) => (
                  <button key={type.key} onClick={() => requestTypeChange(type.key)} 
                    className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all
                      ${targetType === type.key ? "text-white shadow-sm" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
                    style={targetType === type.key ? { backgroundColor: accentColor } : {}}
                  > {type.label} </button>
              ))}

              {/* Verticale Divider */}
              <div className="w-[1px] h-6 bg-slate-200 mx-1" />

              {/* Nieuwe Filter Knop */}
              <button 
                onClick={() => setShowSettings(true)}
                className="px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 flex items-center gap-2 transition-all"
              >
                <Settings2 size={14} className="text-slate-400" />
                Filter
              </button>
          </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        body { background: #F8FAFC; margin: 0; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}} />
    </div>
  );
}