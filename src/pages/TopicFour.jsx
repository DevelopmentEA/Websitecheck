import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, X, Trophy, AlertCircle, Scale, Zap, BookOpen, ChevronRight, Info, Play, Clock, Lock as LockIcon, Quote } from 'lucide-react';
import confetti from 'canvas-confetti';
import jurisprudenceData from './data.json';

// ==========================================
// 1. ROBUUSTE MATCHING MODULE
// ==========================================
const JurisMatchingModule = ({ pairs, onComplete }) => {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matches, setMatches] = useState([]);
  const [wrongPair, setWrongPair] = useState(null);

  // We shuffelen de items ALLEEN als de paren veranderen
  const leftItems = useMemo(() => [...pairs].sort(() => Math.random() - 0.5), [pairs]);
  const rightItems = useMemo(() => [...pairs].sort(() => Math.random() - 0.5), [pairs]);

  const handleLeftClick = (item) => {
    if (wrongPair || matches.includes(item.term)) return;
    // Als we al op deze hadden geklikt, deselecteer dan (toggle)
    if (selectedLeft?.term === item.term) setSelectedLeft(null);
    else setSelectedLeft(item);
  };

  const handleRightClick = (itemMatchName) => {
    if (wrongPair || matches.includes(itemMatchName)) return;
    // Toggle logica
    if (selectedRight === itemMatchName) setSelectedRight(null);
    else setSelectedRight(itemMatchName);
  };

  // Effect dat de match controleert zodra beide zijden geselecteerd zijn
  useEffect(() => {
    if (selectedLeft && selectedRight) {
      if (selectedLeft.match === selectedRight) {
        // MATCH: Groen flitsen via matches state
        const leftTerm = selectedLeft.term;
        const rightTerm = selectedRight;
        setMatches(prev => [...prev, leftTerm, rightTerm]);
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        // FOUT: Rood flitsen
        setWrongPair([selectedLeft.term, selectedRight]);
        setTimeout(() => {
          setWrongPair(null);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 600);
      }
    }
  }, [selectedLeft, selectedRight]);

  useEffect(() => {
    if (matches.length === pairs.length * 2) {
      setTimeout(onComplete, 800);
    }
  }, [matches, pairs.length, onComplete]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto mt-4 px-2">
      <div className="flex gap-4 sm:gap-10 relative">
        
        {/* KOLOM LINKS: RECHTSOVERWEGINGEN */}
        <div className="flex-1 flex flex-col gap-3 p-5 bg-slate-50/80 rounded-[2.5rem] border border-slate-200/60 shadow-inner">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Quote size={14} className="text-slate-400" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Rechtsoverweging</span>
          </div>
          {leftItems.map((item, i) => {
            const isMatched = matches.includes(item.term);
            const isSelected = selectedLeft?.term === item.term;
            const isWrong = wrongPair?.includes(item.term);

            return (
              <button
                key={`left-${i}`}
                onClick={() => handleLeftClick(item)}
                className={`w-full p-4 rounded-2xl border-4 text-[10px] sm:text-[12px] leading-tight font-bold text-left transition-all min-h-[100px] flex items-center shadow-sm
                  ${isMatched ? 'opacity-0 pointer-events-none scale-95' : 
                    isWrong ? 'border-red-500 bg-red-50 text-red-700 animate-shake shadow-none' : 
                    isSelected ? 'border-[#C5A059] bg-white text-[#1A365D] shadow-[0_0_20px_rgba(197,160,89,0.3)] scale-[1.03] z-10' : 
                    'border-transparent bg-white text-slate-600 hover:border-slate-300'}
                `}
              >
                {item.term}
              </button>
            );
          })}
        </div>

        {/* VISUELE SCHEIDING */}
        <div className="hidden md:flex flex-col justify-between py-10">
           <div className="w-px h-full bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
        </div>

        {/* KOLOM RECHTS: ARRESTEN */}
        <div className="flex-1 flex flex-col gap-3 p-5 bg-[#1A365D]/5 rounded-[2.5rem] border border-[#1A365D]/10 shadow-inner">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Scale size={14} className="text-[#1A365D]/30" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1A365D]/40">Arrestnaam</span>
          </div>
          {rightItems.map((item, i) => {
            const isMatched = matches.includes(item.match);
            const isSelected = selectedRight === item.match;
            const isWrong = wrongPair?.includes(item.match);

            return (
              <button
                key={`right-${i}`}
                onClick={() => handleRightClick(item.match)}
                className={`w-full p-4 rounded-2xl border-4 text-[11px] sm:text-[14px] font-black text-center transition-all min-h-[100px] flex items-center justify-center shadow-sm
                  ${isMatched ? 'opacity-0 pointer-events-none scale-95' : 
                    isWrong ? 'border-red-500 bg-red-50 text-red-700 animate-shake shadow-none' : 
                    isSelected ? 'border-[#C5A059] bg-white text-[#1A365D] shadow-[0_0_20px_rgba(197,160,89,0.3)] scale-[1.03] z-10' : 
                    'border-transparent bg-white text-slate-600 hover:border-slate-300'}
                `}
              >
                {item.match}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

// ==========================================
// 2. QUIZ OVERLAY
// ==========================================
const JurisQuizOverlay = ({ session, onClose, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [gameState, setGameState] = useState('intro');
  const [selected, setSelected] = useState(null);
  const [showTip, setShowTip] = useState(false);
  const [sessionPoints, setSessionPoints] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  const currentCase = session?.questions?.[currentIdx];

  // We memoizen de gameData per index zodat het NIET verandert tijdens het klikken in de matching module
  const gameData = useMemo(() => {
    if (gameState !== 'quiz' || !currentCase) return null;
    
    // We gebruiken de index om een voorspelbare maar random verdeling te krijgen
    const seed = (session.step.id * 10) + currentIdx;
    const rand = (Math.sin(seed) + 1) / 2; // Pseudo-random tussen 0 en 1
    
    if (rand < 0.45) {
      const others = [...jurisprudenceData]
        .filter(c => c.naam !== currentCase.naam)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      const matchingPairs = [currentCase, ...others].map(c => ({ 
        term: c.ro_punten[0], 
        match: c.naam 
      }));
      return { type: 'MATCHING', pairs: matchingPairs, prompt: "Koppel de r.o. aan het dossier" };
    } 
    else if (rand < 0.75) {
      const isCorrect = Math.random() > 0.5;
      const otherPurport = jurisprudenceData.find(c => c.naam !== currentCase.naam).purport;
      return { type: 'TF', prompt: `Betreft '${currentCase.naam}' dit oordeel?`, content: isCorrect ? currentCase.purport : otherPurport, correctValue: isCorrect };
    } 
    const options = [currentCase.quiz.correct, ...currentCase.quiz.distractors].sort(() => Math.random() - 0.5);
    return { type: 'MC', prompt: currentCase.quiz.vraag, options: options, correctValue: currentCase.quiz.correct };
  }, [currentIdx, gameState, currentCase, session.step.id]);

  const handleAnswer = (isCorrect) => {
    if (selected !== null) return;
    const bonus = Math.max(50, 400 - Math.floor((Date.now() - startTime) / 150));
    setSelected(isCorrect);
    if (isCorrect) setSessionPoints(p => p + bonus);
    setTimeout(() => setShowTip(true), 600);
  };

  const nextQuestion = () => {
    if (currentIdx < session.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setShowTip(false);
      setStartTime(Date.now());
    } else {
      setGameState('result');
    }
  };

  if (gameState === 'intro') {
    return (
      <div className="fixed inset-0 z-[100] bg-[#1A365D] text-white flex flex-col p-10 items-center justify-center text-center">
        <BookOpen size={64} className="text-[#C5A059] mb-6 animate-pulse" />
        <h2 className="text-4xl font-serif italic mb-8">Zitting Voorbereiden</h2>
        <div className="grid gap-3 w-full max-w-sm mb-12">
          {session.questions.map(q => (
            <div key={q.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-[#C5A059]" />
              <span className="font-bold text-sm">{q.naam}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setGameState('quiz'); setStartTime(Date.now()); }} className="bg-[#C5A059] text-[#1A365D] px-16 py-5 rounded-[2rem] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl">
          START DOSSIER <Play fill="currentColor" size={16}/>
        </button>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-10 text-center">
        <Trophy size={80} className="text-[#C5A059] mb-6" />
        <h2 className="text-5xl font-black text-[#1A365D] mb-2 uppercase">Dossier Afgerond</h2>
        <div className="text-7xl font-mono font-bold text-[#1A365D] mb-12">+{sessionPoints}</div>
        <button onClick={() => onComplete(sessionPoints)} className="bg-[#1A365D] text-white px-20 py-6 rounded-[2rem] font-black uppercase shadow-2xl">SLUITEN</button>
      </div>
    );
  }

  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[100] bg-white flex flex-col overflow-hidden">
      <div className="p-8 flex items-center gap-6 max-w-6xl mx-auto w-full">
        <X className="text-slate-300 cursor-pointer hover:text-slate-600 transition-colors" onClick={onClose} size={32} />
        <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden border">
          <motion.div className="h-full bg-[#C5A059]" animate={{ width: `${(currentIdx / session.questions.length) * 100}%` }} />
        </div>
        <div className="font-mono font-bold text-[#C5A059] flex items-center gap-2">
          <Zap size={16} fill="currentColor" /> {sessionPoints}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full px-8 overflow-y-auto pb-20 no-scrollbar">
        {gameData?.type === 'MATCHING' ? (
          <>
            <div className="text-center mb-4">
              <h2 className="text-2xl font-serif italic text-[#1A365D]">{gameData.prompt}</h2>
            </div>
            <JurisMatchingModule key={currentIdx} pairs={gameData.pairs} onComplete={() => handleAnswer(true)} />
          </>
        ) : gameData ? (
          <>
            <div className="text-center mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059] mb-4 block">{gameData.type === 'MC' ? 'Multiple Choice' : 'Oordeel'}</span>
              <h2 className="text-2xl md:text-4xl font-serif italic text-[#1A365D] leading-tight px-4 max-w-3xl mx-auto">{gameData.prompt}</h2>
            </div>
            {gameData.type === 'TF' ? (
              <div className="space-y-10 max-w-xl mx-auto w-full">
                <div className="p-10 bg-[#1A365D] rounded-[3rem] text-white text-center shadow-2xl border-t-[8px] border-[#C5A059]">
                  <p className="text-xl font-serif italic italic leading-relaxed">"{gameData.content}"</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <button onClick={() => handleAnswer(gameData.correctValue === true)} className="py-8 border-2 rounded-[2rem] font-black border-slate-100 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Waar</button>
                  <button onClick={() => handleAnswer(gameData.correctValue === false)} className="py-8 border-2 rounded-[2rem] font-black border-slate-100 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Onwaar</button>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 max-w-2xl mx-auto w-full">
                {gameData.options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(opt === gameData.correctValue)} className={`p-6 rounded-2xl border-2 text-left font-bold transition-all text-[13px] shadow-[0_4px_0_#f1f5f9] active:translate-y-1 active:shadow-none ${selected !== null ? (opt === gameData.correctValue ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-none' : 'bg-rose-50 border-rose-500 text-rose-700 shadow-none') : 'bg-white border-slate-100 hover:border-[#1A365D]'}`}>{opt}</button>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>

      <AnimatePresence>
        {showTip && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="absolute inset-0 bg-white z-[130] flex flex-col items-center justify-center p-12 text-center overflow-y-auto">
            <div className={`w-20 h-20 flex-shrink-0 ${selected ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'} rounded-full flex items-center justify-center mb-8 shadow-lg`}>
              {selected ? <Check size={40}/> : <X size={40}/>}
            </div>
            <div className="bg-rose-50 p-8 rounded-[2.5rem] border-2 border-rose-100 max-w-md mb-10 shadow-sm">
               <p className="text-rose-900 leading-relaxed font-medium mb-4 italic text-sm">"{currentCase?.purport}"</p>
               <div className="h-px bg-rose-200 mb-4 w-1/2 mx-auto" />
               <p className="text-rose-700 text-[9px] font-black uppercase tracking-widest">{currentCase?.tip}</p>
            </div>
            <button onClick={nextQuestion} className="bg-[#1A365D] flex-shrink-0 text-white px-16 py-5 rounded-[2rem] font-black flex items-center gap-3 shadow-[0_10px_0_#0f2038] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-[10px]">VERDER <ChevronRight size={14}/></button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
const JurisprudenceMastery = () => {
  const [progress, setProgress] = useState(1);
  const [score, setScore] = useState(0);
  const [activeQuiz, setActiveQuiz] = useState(null);

  useEffect(() => {
    const savedP = localStorage.getItem('juris_mastery_p');
    const savedS = localStorage.getItem('juris_mastery_s');
    if (savedP) setProgress(parseInt(savedP));
    if (savedS) setScore(parseInt(savedS));
  }, []);

  const startLevel = (step) => {
    if (step.id > progress) return;
    const sessionCases = [...jurisprudenceData].sort(() => Math.random() - 0.5).slice(0, 5);
    setActiveQuiz({ step, questions: sessionCases });
  };

  const STEPS = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    rank: i < 3 ? 'Stagiair' : i < 8 ? 'Pleiter' : 'Raadsheer'
  }));

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-[#1A365D]">
      <nav className="sticky top-0 z-50 bg-[#1A365D] border-b border-[#C5A059]/30 px-8 py-5 flex justify-between items-center shadow-xl text-white">
        <div className="flex items-center gap-3">
          <Scale className="text-[#C5A059]" size={24} />
          <span className="font-serif italic text-xl">Arresten Pad</span>
        </div>
        <div className="flex items-center gap-3 bg-white/10 px-5 py-2 rounded-2xl border border-white/20">
          <Trophy className="text-[#C5A059]" size={20} />
          <span className="font-black text-lg">{score.toLocaleString()}</span>
        </div>
      </nav>

      <div className="max-w-xl mx-auto pt-24 pb-48 relative flex flex-col-reverse items-center">
        <svg className="absolute inset-0 w-full h-full -z-10 opacity-10" preserveAspectRatio="none">
          <path d="M 250 2000 Q 400 1800 250 1600 T 250 1200 T 250 800 T 250 400 T 250 0" fill="none" stroke="#1A365D" strokeWidth="4" strokeDasharray="12" />
        </svg>

        {STEPS.map((step, index) => {
          const isLocked = step.id > progress;
          const isCompleted = step.id < progress;
          const xOffset = Math.sin(index * 1.4) * 85;

          return (
            <div key={step.id} className="relative w-full flex justify-center py-12">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{ x: xOffset }}>
                <button
                  onClick={() => startLevel(step)}
                  className={`relative w-28 h-28 rounded-[2.8rem] flex flex-col items-center justify-center transition-all duration-300 shadow-2xl
                    ${isLocked ? 'bg-slate-100 border-2 border-slate-200 opacity-40 cursor-not-allowed' : 
                      isCompleted ? 'bg-[#C5A059] shadow-[0_12px_0_#9a7d46]' : 
                      'bg-white border-4 border-[#1A365D] shadow-[0_12px_0_#1A365D]'}
                  `}
                >
                  {isLocked ? <LockIcon className="text-slate-300" /> : isCompleted ? <Check className="text-white" size={44} strokeWidth={4} /> : <BookOpen className="text-[#1A365D]" size={44} />}
                  <div className={`absolute -top-10 px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-lg ${isLocked ? 'bg-white text-slate-300' : 'bg-white text-[#1A365D] border-[#C5A059]'}`}>
                    {step.rank} Lvl {step.id}
                  </div>
                </button>
              </motion.div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {activeQuiz && (
          <JurisQuizOverlay 
            session={activeQuiz} 
            onClose={() => setActiveQuiz(null)}
            onComplete={(s) => {
              const nextP = progress + 1;
              const newScore = score + s;
              localStorage.setItem('juris_mastery_p', nextP);
              localStorage.setItem('juris_mastery_s', newScore);
              setProgress(nextP);
              setScore(newScore);
              setActiveQuiz(null);
              confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default JurisprudenceMastery;