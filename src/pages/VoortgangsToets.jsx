import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, XCircle, ChevronRight, ChevronLeft, RotateCcw, 
  BookOpen, Clock, AlertCircle, BarChart3, Award, Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function VoortgangsToets() {
  // Haal data en config uit de context
  const { db, config } = useOutletContext();
  
  // Theme settings op basis van het vak
  const THEME = {
    lawbooks: config?.accent || "#469585", 
    bg: "#FFFFFF",
  };

  const [step, setStep] = useState('start'); 
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minuten
  const [showConfirm, setShowConfirm] = useState(false);

  // --- TIMER LOGICA ---
  useEffect(() => {
    let timer;
    if (step === 'quiz' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && step === 'quiz') {
      finishQuiz();
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- QUIZ SETUP ---
  const initQuiz = () => {
    if (!db) return;

    // 1. Verzamel MK vragen
    const pool = [];
    Object.keys(db).forEach(weekKey => {
      const mkQuestions = db[weekKey]?.MK || [];
      mkQuestions.forEach(q => {
        pool.push({ 
          ...q, 
          subject: weekKey.replace(/_/g, ' ') 
        });
      });
    });

    if (pool.length === 0) return alert("Geen vragen beschikbaar.");

    // 2. Selecteer er 25
    const selection = pool.sort(() => Math.random() - 0.5).slice(0, 25);
    
    setQuestions(selection);
    setUserAnswers({});
    setCurrentIdx(0);
    setTimeLeft(3600);
    setStep('quiz');
    setShowReview(false);
    window.scrollTo(0,0);
  };

  const finishQuiz = () => {
    setShowConfirm(false);
    setStep('results');
    window.scrollTo(0,0);
    confetti({ 
      particleCount: 150, 
      spread: 70, 
      origin: { y: 0.6 }, 
      colors: [THEME.lawbooks, '#000000', '#ffffff'] 
    });
  };

  const totalScore = questions.filter((q, i) => userAnswers[i] === q.c).length;

  // --- ANALYSE ---
  const subjectAnalysis = useMemo(() => {
    if (step !== 'results') return [];
    const stats = {};
    
    questions.forEach((q, i) => {
      if (!stats[q.subject]) stats[q.subject] = { correct: 0, total: 0 };
      stats[q.subject].total++;
      if (userAnswers[i] === q.c) stats[q.subject].correct++;
    });

    return Object.entries(stats)
      .map(([name, data]) => ({
        name,
        ...data,
        percentage: Math.round((data.correct / data.total) * 100)
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [step, questions, userAnswers]);

  if (!config) return null;

  return (
    <div className="h-screen w-full flex flex-col font-sans antialiased text-slate-900 bg-white overflow-hidden">
      
      {/* HEADER: Geïsoleerd (Geen link terug) */}
      <header className="h-20 border-b border-slate-100 flex items-center px-6 md:px-10 justify-between shrink-0 bg-white z-10 select-none">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex flex-col">
             <span className="text-2xl md:text-3xl font-black italic tracking-tighter leading-none" style={{ color: THEME.lawbooks }}>LAWBOOKS</span>
          </div>
          <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{config.title}</span>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Voortgangsmonitor</span>
          </div>
        </div>
        
        {step === 'quiz' ? (
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full border font-mono font-bold transition-all ${timeLeft < 300 ? 'text-red-500 border-red-100 bg-red-50 animate-pulse' : 'text-slate-500 border-slate-100 bg-slate-50'}`}>
            <Clock size={16} /> {formatTime(timeLeft)}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-300 text-[10px] font-black uppercase tracking-widest">
            <Lock size={12} /> Secure Mode
          </div>
        )}
      </header>

      <main className="flex-grow flex flex-col items-center justify-start overflow-hidden relative bg-[#fcfcfc]">
        <AnimatePresence mode="wait">
          
          {/* --- STAP 1: START SCHERM --- */}
          {step === 'start' && (
            <motion.div key="start" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-xl text-center mt-20 md:mt-32 p-10">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-slate-100">
                <BarChart3 size={32} style={{ color: THEME.lawbooks }} />
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-slate-900">Klaar voor de start?</h1>
              <p className="text-slate-500 mb-10 leading-relaxed text-base md:text-lg">
                Deze monitor toetst je kennis van <strong>{config.title}</strong>. 
                Je krijgt 25 willekeurige vragen en hebt 60 minuten de tijd.
              </p>
              <button 
                onClick={initQuiz} 
                className="px-12 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black hover:scale-105 transition-all uppercase tracking-widest text-xs shadow-xl shadow-slate-200"
              >
                Start de monitor
              </button>
            </motion.div>
          )}

          {/* --- STAP 2: QUIZ --- */}
          {step === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-5xl flex flex-col h-full pt-4 md:pt-8 pb-8 px-4 md:px-6 overflow-hidden">
              
              {/* Navigatie Rondjes */}
              <div className="flex justify-center flex-wrap gap-1.5 md:gap-2 mb-6 md:mb-8 shrink-0">
                {questions.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentIdx(i)} 
                    className={`w-8 h-8 rounded-lg font-bold text-[10px] transition-all border ${
                      currentIdx === i ? 'bg-slate-900 text-white border-slate-900 scale-110 shadow-lg' : 
                      userAnswers[i] !== undefined ? 'text-white' : 'bg-white text-slate-300 border-slate-100 hover:border-slate-300'
                    }`}
                    style={userAnswers[i] !== undefined && currentIdx !== i ? { backgroundColor: THEME.lawbooks, borderColor: THEME.lawbooks } : {}}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {/* Vraagkaart */}
              <div className="bg-white border border-slate-100 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex-grow flex flex-col overflow-hidden">
                <div className="p-6 md:p-12 flex-grow overflow-y-auto custom-scrollbar">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 block" style={{ color: THEME.lawbooks }}>{questions[currentIdx].subject}</span>
                  <h2 className="text-xl md:text-2xl font-bold leading-snug mb-8 md:mb-10 text-slate-800">{questions[currentIdx].q}</h2>
                  
                  <div className="grid gap-3">
                    {questions[currentIdx].a.map((opt, i) => (
                      <button 
                        key={i} 
                        onClick={() => setUserAnswers({...userAnswers, [currentIdx]: i})} 
                        className={`group flex items-start gap-4 md:gap-5 p-4 md:p-6 rounded-2xl border-2 transition-all text-left ${
                          userAnswers[currentIdx] === i ? 'bg-slate-50' : 'border-slate-50 hover:border-slate-200 hover:bg-slate-50'
                        }`}
                        style={{ borderColor: userAnswers[currentIdx] === i ? THEME.lawbooks : '' }}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          userAnswers[currentIdx] === i ? '' : 'border-slate-300'
                        }`}
                        style={{ borderColor: userAnswers[currentIdx] === i ? THEME.lawbooks : '', backgroundColor: userAnswers[currentIdx] === i ? THEME.lawbooks : '' }}
                        >
                          {userAnswers[currentIdx] === i && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <span className={`text-sm md:text-base leading-relaxed ${userAnswers[currentIdx] === i ? 'font-bold text-slate-900' : 'text-slate-500'}`}>{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-6 md:px-12 py-6 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center shrink-0">
                  <button 
                    disabled={currentIdx === 0} 
                    onClick={() => setCurrentIdx(prev => prev - 1)} 
                    className="flex items-center gap-2 font-bold text-slate-400 hover:text-black disabled:opacity-0 transition-all uppercase text-[10px] tracking-widest"
                  >
                    <ChevronLeft size={14}/> Vorige
                  </button>
                  
                  {currentIdx === questions.length - 1 ? (
                    <button 
                      onClick={() => setShowConfirm(true)} 
                      className="px-8 md:px-12 py-3 md:py-4 bg-slate-900 text-white rounded-xl font-bold text-[10px] md:text-xs shadow-lg hover:bg-black transition-all uppercase tracking-widest"
                    >
                      Inleveren
                    </button>
                  ) : (
                    <button 
                      onClick={() => setCurrentIdx(prev => prev + 1)} 
                      className="flex items-center gap-2 font-bold text-slate-800 hover:gap-4 transition-all uppercase text-[10px] tracking-widest"
                    >
                      Volgende <ChevronRight size={14}/>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* --- STAP 3: RESULTATEN --- */}
          {step === 'results' && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl py-8 md:py-12 px-6 h-full overflow-y-auto custom-scrollbar">
              
              {/* Score Header */}
              <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white mb-8 flex flex-col md:flex-row justify-between items-center shadow-xl shadow-slate-200">
                <div className="mb-6 md:mb-0 text-center md:text-left">
                  <h2 className="text-5xl md:text-6xl font-black italic mb-2 tracking-tighter" style={{ color: THEME.lawbooks }}>{Math.round((totalScore/questions.length)*100)}%</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Totaalresultaat</p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-2xl md:text-3xl font-bold">{totalScore} / {questions.length}</p>
                  <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Correct Beantwoord</p>
                </div>
              </div>

              {/* Analyse Grid */}
              <div className="grid gap-6 mb-12">
                <div className="flex items-center gap-2 mb-2">
                   <BarChart3 size={18} style={{ color: THEME.lawbooks }} />
                   <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">Analyse per Rechtsgebied</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjectAnalysis.map((item, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
                      <div className="flex justify-between items-end mb-3">
                        <span className="font-bold text-slate-800 text-xs md:text-sm">{item.name}</span>
                        <span className="text-xs font-mono font-bold" style={{ color: THEME.lawbooks }}>{item.correct}/{item.total}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.percentage >= 55 ? THEME.lawbooks : '#ef4444' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Knoppen */}
              <div className="flex flex-col md:flex-row justify-center gap-4 mb-20">
                <button 
                  onClick={() => setShowReview(!showReview)} 
                  className="px-8 py-4 bg-white border border-slate-200 text-slate-800 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <BookOpen size={14} /> {showReview ? "Inzage sluiten" : "Antwoorden inzien"}
                </button>
                <button 
                  onClick={initQuiz} 
                  className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw size={14}/> Monitor herstarten
                </button>
              </div>

              {/* Review Sectie */}
              <AnimatePresence>
                {showReview && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 pb-20">
                    <div className="text-center mb-8">
                       <span className="font-black uppercase text-xs tracking-widest text-slate-300 pb-2 border-b-2 border-slate-100">Gedetailleerde Inzage</span>
                    </div>
                    {questions.map((q, idx) => {
                      const isCorrect = userAnswers[idx] === q.c;
                      return (
                        <div key={idx} className="bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-300">Vraag {idx + 1} • {q.subject}</span>
                            {isCorrect ? (
                              <div className="flex items-center gap-1 font-bold text-[10px] uppercase" style={{ color: THEME.lawbooks }}><CheckCircle2 size={14}/> Correct</div>
                            ) : (
                              <div className="flex items-center gap-1 text-red-400 font-bold text-[10px] uppercase"><XCircle size={14}/> Onjuist</div>
                            )}
                          </div>
                          <p className="font-bold text-slate-800 mb-6 text-base md:text-lg">{q.q}</p>
                          <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-100">
                             <div className="flex items-center gap-2 mb-2" style={{ color: THEME.lawbooks }}>
                               <Award size={14} />
                               <span className="text-[10px] font-black uppercase">Toelichting</span>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed italic">{q.exp}</p>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* CONFIRMATION POPUP */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white p-8 md:p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl">
              <AlertCircle size={40} className="mx-auto mb-6 text-orange-400" />
              <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Toets afronden?</h3>
              <p className="text-slate-400 text-sm mb-8 font-medium">
                Je hebt {Object.keys(userAnswers).length} van de {questions.length} vragen beantwoord.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={finishQuiz} 
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-colors shadow-lg"
                >
                  Ja, lever in
                </button>
                <button 
                  onClick={() => setShowConfirm(false)} 
                  className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-colors"
                >
                  Nog niet
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}