import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Star, Check, X, Trophy, AlertCircle, Scale, Zap, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import allQuestions from './vragen.json';

// Configuratie van het pad
const PATH_STEPS = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Niveau ${i + 1}`,
  rank: i < 3 ? 'Stagiair' : i < 7 ? 'Advocaat' : 'Raadsheer'
}));

const MasteryPath = () => {
  const [progress, setProgress] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [activeQuiz, setActiveQuiz] = useState(null);

  useEffect(() => {
    const savedProgress = localStorage.getItem('lb_mastery_progress');
    const savedScore = localStorage.getItem('lb_mastery_score');
    if (savedProgress) setProgress(parseInt(savedProgress));
    if (savedScore) setTotalScore(parseInt(savedScore));
  }, []);

  const saveState = (p, s) => {
    localStorage.setItem('lb_mastery_progress', p);
    localStorage.setItem('lb_mastery_score', s);
    setProgress(p);
    setTotalScore(s);
  };

  const startChallenge = (step) => {
    if (step.id > progress) return;
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setActiveQuiz({ step, questions: shuffled.slice(0, 5) });
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-[#1A365D] overflow-x-hidden">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <Trophy className="text-[#C5A059]" size={24} />
          <span className="font-black uppercase tracking-[0.2em] text-[10px]">Mastery Path</span>
        </div>
        <div className="flex items-center gap-3 bg-[#1A365D] px-5 py-2 rounded-2xl shadow-xl">
          <Zap fill="#C5A059" className="text-[#C5A059]" size={20} />
          <span className="font-black text-white text-lg">{totalScore}</span>
        </div>
      </nav>

      {/* Het Pad (Bottom-to-Top) */}
      <div className="max-w-xl mx-auto pt-24 pb-48 relative flex flex-col-reverse items-center">
        <svg className="absolute inset-0 w-full h-full -z-10 opacity-10" preserveAspectRatio="none">
          <path d="M 250 2000 Q 400 1800 250 1600 T 250 1200 T 250 800 T 250 400 T 250 0" fill="none" stroke="#1A365D" strokeWidth="4" strokeDasharray="12" />
        </svg>

        {PATH_STEPS.map((step, index) => {
          const isLocked = step.id > progress;
          const isCompleted = step.id < progress;
          const isCurrent = step.id === progress;
          const xOffset = Math.sin(index * 1.5) * 100;

          return (
            <div key={step.id} className="relative w-full flex justify-center py-14">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{ x: xOffset }}>
                <button
                  onClick={() => startChallenge(step)}
                  disabled={isLocked}
                  className={`
                    relative w-28 h-28 rounded-[2.5rem] flex flex-col items-center justify-center transition-all duration-300
                    ${isLocked ? 'bg-slate-100 border-2 border-slate-200 cursor-not-allowed' : 
                      isCompleted ? 'bg-[#C5A059] shadow-[0_10px_0_#9a7d46] hover:translate-y-[-2px]' : 
                      'bg-white border-4 border-[#1A365D] shadow-[0_12px_0_#1A365D] hover:translate-y-[-2px] active:translate-y-[6px] active:shadow-none'}
                  `}
                >
                  {isLocked ? <Lock className="text-slate-300" size={28} /> : 
                   isCompleted ? <Check className="text-white" size={44} strokeWidth={4} /> : 
                   <Star className="text-[#1A365D]" fill={isCurrent ? "#C5A059" : "none"} size={44} />}
                  <div className={`absolute -top-10 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${isLocked ? 'bg-white text-slate-300 border-slate-100' : 'bg-white text-[#1A365D] border-[#C5A059] shadow-lg'}`}>Lvl {step.id}</div>
                  {isCurrent && <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 rounded-[2.5rem] ring-[12px] ring-[#C5A059]/30 -z-10" />}
                </button>
              </motion.div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {activeQuiz && (
          <QuizOverlay 
            questions={activeQuiz.questions} 
            onWin={(sessionScore) => {
              saveState(progress + 1, totalScore + sessionScore);
              setActiveQuiz(null);
              confetti({ particleCount: 150, colors: ['#C5A059', '#1A365D'] });
            }}
            onLoss={() => {
              setActiveQuiz(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const QuizOverlay = ({ questions, onWin, onLoss }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showError, setShowError] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  const rawQ = questions[currentIdx];

  const gameData = useMemo(() => {
    if (!rawQ) return null;
    const mode = Math.random() > 0.5 ? 'TF' : 'MC';
    if (mode === 'TF') {
      const isCorrectScenario = Math.random() > 0.5;
      let displayOption = isCorrectScenario ? rawQ.options[rawQ.correct] : 
                          rawQ.options.filter((_, i) => i !== rawQ.correct)[Math.floor(Math.random() * (rawQ.options.length - 1))];
      return { type: 'TF', question: rawQ.q, statement: displayOption, correctValue: isCorrectScenario, basis: rawQ.basis };
    }
    return { type: 'MC', question: rawQ.q, options: rawQ.options, correctIdx: rawQ.correct, basis: rawQ.basis };
  }, [currentIdx, rawQ]);

  const handleAnswer = (val) => {
    if (selected !== null) return;
    
    const timeElapsed = (Date.now() - startTime) / 1000;
    setSelected(val);
    
    const isCorrect = gameData.type === 'MC' ? val === gameData.correctIdx : val === gameData.correctValue;
    
    setTimeout(() => {
      if (!isCorrect) {
        setShowError(true);
        setTimeout(onLoss, 3000);
      } else {
        // Puntenberekening: Basis 100, bonus voor snelheid (max 50), totaal max 150 per vraag
        const points = Math.max(50, Math.floor(150 - (timeElapsed * 5)));
        setSessionScore(prev => prev + points);

        if (currentIdx < questions.length - 1) {
          setCurrentIdx(currentIdx + 1);
          setSelected(null);
          setStartTime(Date.now()); // Reset timer voor volgende vraag
        } else {
          onWin(sessionScore + points);
        }
      }
    }, 800);
  };

  if (!gameData) return null;

  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[100] bg-white flex flex-col overflow-y-auto">
      <div className="sticky top-0 z-20 bg-white border-b border-slate-50 p-6 md:p-8 flex items-center gap-6">
        <button onClick={onLoss} className="p-2 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0">
          <X size={32} className="text-slate-300"/>
        </button>
        <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
          <motion.div className="h-full bg-[#C5A059]" animate={{ width: `${(currentIdx / questions.length) * 100}%` }} />
        </div>
        <div className="flex items-center gap-2 text-[#C5A059] font-bold min-w-[60px]">
          <Zap size={18} /> {sessionScore}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full px-6 py-10">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F8F9FA] px-5 py-2 rounded-full mb-6 border border-slate-100 shadow-sm">
            <Clock size={14} className="text-[#C5A059]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A365D]">
               Snelheid telt!
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-serif italic text-[#1A365D] leading-[1.3]">
            {gameData.question}
          </h2>
        </div>

        <div className="grid gap-4 w-full">
          {gameData.type === 'MC' ? (
            <div className="grid gap-4">
              {gameData.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-2 text-left font-bold transition-all text-base md:text-lg
                    ${selected === i ? (i === gameData.correctIdx ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-rose-50 border-rose-500 text-rose-700') 
                    : 'bg-white border-slate-100 hover:border-[#1A365D] hover:shadow-md'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-8 md:p-12 bg-[#1A365D] rounded-[2.5rem] md:rounded-[3.5rem] text-white text-center shadow-2xl relative border-t-[6px] border-[#C5A059]">
                <p className="opacity-40 text-[9px] uppercase tracking-[0.3em] mb-4 md:mb-6">Is deze stelling correct?</p>
                <p className="text-xl md:text-3xl font-serif italic leading-relaxed">"{gameData.statement}"</p>
              </motion.div>
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <button onClick={() => handleAnswer(true)} className="py-6 md:py-8 bg-white border-2 border-slate-100 rounded-[1.5rem] md:rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-[#F8F9FA] transition-all active:scale-95 shadow-sm">Waar</button>
                <button onClick={() => handleAnswer(false)} className="py-8 bg-white border-2 border-slate-100 rounded-[1.5rem] md:rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-[#F8F9FA] transition-all active:scale-95 shadow-sm">Onwaar</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-12 md:h-20 flex-shrink-0" />

      <AnimatePresence>
        {showError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-[#ef4444] flex flex-col items-center justify-center text-white text-center p-8 z-[120]">
            <AlertCircle size={80} className="mb-6" />
            <h3 className="text-3xl md:text-5xl font-serif italic mb-6">Foutief Oordeel</h3>
            <div className="bg-white/10 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-xl border border-white/20 max-w-lg">
               <p className="text-lg md:text-xl leading-relaxed italic">"{gameData.basis}"</p>
            </div>
            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">De zitting is gesloten...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MasteryPath;