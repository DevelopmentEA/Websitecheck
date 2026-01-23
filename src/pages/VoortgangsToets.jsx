import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, XCircle, ChevronRight, ChevronLeft, RotateCcw, 
  BookOpen, Clock, AlertCircle, Send, Award, BarChart3
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Importeer je data
import voortgangData from '../data/voortgang.json';

const THEME = {
  lawbooks: "#469585", 
  slate: "#1E293B",
  lightSlate: "#64748B",
  bg: "#FFFFFF",
  accent: "#f8fafc"
};

export default function VoortgangsToets() {
  const [step, setStep] = useState('start'); 
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 uur
  const [showConfirm, setShowConfirm] = useState(false);

  // Timer Logica
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

  const initQuiz = () => {
    const pool = [];
    Object.keys(voortgangData.onderwerpen).forEach(sub => {
      voortgangData.onderwerpen[sub].forEach(q => pool.push({ ...q, subject: sub }));
    });
    setQuestions(pool.sort(() => Math.random() - 0.5).slice(0, 20));
    setUserAnswers({});
    setCurrentIdx(0);
    setTimeLeft(3600);
    setStep('quiz');
    setShowReview(false);
  };

  const finishQuiz = () => {
    setShowConfirm(false); // SLUIT DE POP-UP DIRECT
    setStep('results');
    confetti({ 
      particleCount: 150, 
      spread: 70, 
      origin: { y: 0.6 }, 
      colors: [THEME.lawbooks, '#000000', '#ffffff'] 
    });
  };

  const totalScore = questions.filter((q, i) => userAnswers[i] === q.c).length;

  // ANALYSE PER ONDERWERP
  const subjectAnalysis = useMemo(() => {
    if (step !== 'results') return [];
    const stats = {};
    questions.forEach((q, i) => {
      if (!stats[q.subject]) stats[q.subject] = { correct: 0, total: 0 };
      stats[q.subject].total++;
      if (userAnswers[i] === q.c) stats[q.subject].correct++;
    });
    return Object.entries(stats).map(([name, data]) => ({
      name,
      ...data,
      percentage: Math.round((data.correct / data.total) * 100)
    }));
  }, [step, questions, userAnswers]);

  return (
    <div className="h-screen w-full flex flex-col font-sans antialiased text-slate-900 bg-white overflow-hidden">
      
      {/* HEADER */}
      <header className="h-20 border-b border-slate-100 flex items-center px-10 justify-between shrink-0 bg-white z-10">
        <div className="flex items-center gap-6">
          <span className="text-3xl font-black italic tracking-tighter" style={{ color: THEME.lawbooks }}>LAWBOOKS</span>
          <div className="h-8 w-[1px] bg-slate-200" />
          <span className="text-sm font-bold tracking-[0.3em] text-slate-400 uppercase">Voortgangsmonitor 2026</span>
        </div>
        
        {step === 'quiz' && (
          <div className={`flex items-center gap-3 px-5 py-2 rounded-full border font-mono font-bold transition-all ${timeLeft < 300 ? 'text-red-500 border-red-100 bg-red-50 animate-pulse' : 'text-slate-500 border-slate-100 bg-slate-50'}`}>
            <Clock size={18} /> {formatTime(timeLeft)}
          </div>
        )}
      </header>

      <main className="flex-grow flex flex-col items-center justify-start overflow-hidden relative bg-[#fcfcfc]">
        <AnimatePresence mode="wait">
          
          {/* START SCHERM */}
          {step === 'start' && (
            <motion.div key="start" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-xl text-center mt-32 p-10">
              <h1 className="text-4xl font-black mb-6 tracking-tight">Klaar voor de Toets?</h1>
              <p className="text-slate-500 mb-10 leading-relaxed text-lg italic">
                U krijgt 20 vragen over diverse rechtsgebieden. U heeft exact 60 minuten de tijd.
              </p>
              <button 
                onClick={initQuiz} 
                className="px-14 py-5 bg-black text-white font-bold rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-widest text-xs"
              >
                Start de monitor
              </button>
            </motion.div>
          )}

          {/* QUIZ OMGEVING */}
          {step === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-5xl flex flex-col h-full pt-8 pb-12 px-6 overflow-hidden">
              
              {/* Question Navigation Grid */}
              <div className="flex justify-center flex-wrap gap-2 mb-8 shrink-0">
                {questions.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentIdx(i)} 
                    className={`w-9 h-9 rounded-xl font-bold text-xs transition-all border ${
                      currentIdx === i ? 'bg-black text-white border-black scale-110 shadow-lg' : 
                      userAnswers[i] !== undefined ? 'bg-[#469585] text-white border-[#469585]' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {/* Vraag Content */}
              <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 flex-grow flex flex-col overflow-hidden">
                <div className="p-12 flex-grow overflow-y-auto">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#469585] mb-4 block">{questions[currentIdx].subject}</span>
                  <h2 className="text-2xl font-bold leading-snug mb-10 text-slate-800">{questions[currentIdx].q}</h2>
                  
                  <div className="grid gap-3">
                    {questions[currentIdx].a.map((opt, i) => (
                      <button 
                        key={i} 
                        onClick={() => setUserAnswers({...userAnswers, [currentIdx]: i})} 
                        className={`group flex items-center gap-5 p-6 rounded-2xl border-2 transition-all text-left ${
                          userAnswers[currentIdx] === i ? 'border-[#469585] bg-emerald-50/20' : 'border-slate-50 hover:border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          userAnswers[currentIdx] === i ? 'border-[#469585] bg-[#469585]' : 'border-slate-300'
                        }`}>
                          {userAnswers[currentIdx] === i && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <span className={`text-base ${userAnswers[currentIdx] === i ? 'font-bold text-slate-900' : 'text-slate-500'}`}>{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer Navigatie */}
                <div className="px-12 py-8 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center shrink-0">
                  <button 
                    disabled={currentIdx === 0} 
                    onClick={() => setCurrentIdx(prev => prev - 1)} 
                    className="flex items-center gap-2 font-bold text-slate-400 hover:text-black disabled:opacity-0 transition-all uppercase text-[10px] tracking-widest"
                  >
                    <ChevronLeft size={16}/> Vorige
                  </button>
                  
                  {currentIdx === 19 ? (
                    <button 
                      onClick={() => setShowConfirm(true)} 
                      className="px-12 py-4 bg-black text-white rounded-xl font-bold text-xs shadow-lg hover:bg-slate-800 transition-all uppercase tracking-widest"
                    >
                      Inleveren
                    </button>
                  ) : (
                    <button 
                      onClick={() => setCurrentIdx(prev => prev + 1)} 
                      className="flex items-center gap-2 font-bold text-slate-800 hover:gap-4 transition-all uppercase text-[10px] tracking-widest"
                    >
                      Volgende <ChevronRight size={16}/>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* RESULTATEN DASHBOARD */}
          {step === 'results' && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl py-12 px-6 h-full overflow-y-auto custom-scrollbar">
              
              {/* Hoofd Score Kaart */}
              <div className="bg-black rounded-[3rem] p-12 text-white mb-8 flex justify-between items-center shadow-xl shadow-slate-300">
                <div>
                  <h2 className="text-6xl font-black italic mb-2 tracking-tighter text-[#469585]">{Math.round((totalScore/20)*100)}%</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Totaalresultaat Monitor</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{totalScore} / 20</p>
                  <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Vragen goed beantwoord</p>
                </div>
              </div>

              {/* ANALYSE PER ONDERWERP SECTIE */}
              <div className="grid gap-6 mb-12">
                <div className="flex items-center gap-2 mb-2">
                   <BarChart3 size={18} className="text-[#469585]" />
                   <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">Analyse per Rechtsgebied</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjectAnalysis.map((item, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
                      <div className="flex justify-between items-end mb-3">
                        <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                        <span className="text-xs font-mono font-bold text-[#469585]">{item.correct}/{item.total}</span>
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

              {/* ACTIES */}
              <div className="flex justify-center gap-6 mb-20">
                <button 
                  onClick={() => setShowReview(!showReview)} 
                  className="px-8 py-4 bg-white border border-slate-200 text-slate-800 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
                >
                  <BookOpen size={14} /> {showReview ? "Inzage sluiten" : "Antwoorden inzien"}
                </button>
                <button 
                  onClick={initQuiz} 
                  className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:text-black transition-all flex items-center gap-2"
                >
                  <RotateCcw size={14}/> Opnieuw starten
                </button>
              </div>

              {/* GEDETAILLEERDE INZAGE */}
              <AnimatePresence>
                {showReview && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 pb-20">
                    <h3 className="font-black uppercase text-xs tracking-widest text-center text-slate-400 mb-8 underline decoration-[#469585] underline-offset-8">Gedetailleerde Inzage</h3>
                    {questions.map((q, idx) => {
                      const isCorrect = userAnswers[idx] === q.c;
                      return (
                        <div key={idx} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black uppercase text-slate-300">Vraag {idx + 1} • {q.subject}</span>
                            {isCorrect ? (
                              <div className="flex items-center gap-1 text-[#469585] font-bold text-[10px] uppercase"><CheckCircle2 size={16}/> Correct</div>
                            ) : (
                              <div className="flex items-center gap-1 text-red-400 font-bold text-[10px] uppercase"><XCircle size={16}/> Onjuist</div>
                            )}
                          </div>
                          <p className="font-bold text-slate-800 mb-6 text-lg">{q.q}</p>
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                             <div className="flex items-center gap-2 mb-2 text-[#469585]">
                               <Award size={14} />
                               <span className="text-[10px] font-black uppercase">Juridische Toelichting</span>
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

      {/* CONFIRM MODAL */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl">
              <AlertCircle size={40} className="mx-auto mb-6 text-orange-400" />
              <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Toets afronden?</h3>
              <p className="text-slate-400 text-sm mb-8 font-medium">Je hebt {Object.keys(userAnswers).length} van de 20 vragen beantwoord. Weet je het zeker?</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={finishQuiz} 
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#469585] transition-colors"
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