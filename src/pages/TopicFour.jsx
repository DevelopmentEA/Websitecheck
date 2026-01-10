import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, X, Trophy, AlertCircle, Scale, Zap, BookOpen, ChevronRight, Info, Play, Clock, Lock as LockIcon, Quote } from 'lucide-react';
import confetti from 'canvas-confetti';
<<<<<<< HEAD
import jurisprudenceData from './data.json';
=======
import html2canvas from 'html2canvas'; 
import { Share2, Award } from 'lucide-react'; 
import allQuestions from './vragen.json';
>>>>>>> 1d6bd31885c81de89a4c63b93a83452b7f65ebe3

// ==========================================
// 1. ROBUUSTE MATCHING MODULE
// ==========================================
const JurisMatchingModule = ({ pairs, onComplete }) => {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matches, setMatches] = useState([]);
  const [wrongPair, setWrongPair] = useState(null);

<<<<<<< HEAD
  // We shuffelen de items ALLEEN als de paren veranderen
  const leftItems = useMemo(() => [...pairs].sort(() => Math.random() - 0.5), [pairs]);
  const rightItems = useMemo(() => [...pairs].sort(() => Math.random() - 0.5), [pairs]);
=======
// LAWBOOKS KLEUREN:
// Mintgroen: #00E091
// Zwart: #111111
// Wit/Achtergrond: #FAFAFA

const Miljoenenjacht = () => {
  const [gameState, setGameState] = useState('start'); 
  const [questions, setQuestions] = useState([]); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [selected, setSelected] = useState(null);
  const [evaluation, setEvaluation] = useState(null); 
  const audioRef = useRef(null);
  const certificateRef = useRef(null);
>>>>>>> 1d6bd31885c81de89a4c63b93a83452b7f65ebe3

  const handleLeftClick = (item) => {
    if (wrongPair || matches.includes(item.term)) return;
    // Als we al op deze hadden geklikt, deselecteer dan (toggle)
    if (selectedLeft?.term === item.term) setSelectedLeft(null);
    else setSelectedLeft(item);
  };

<<<<<<< HEAD
  const handleRightClick = (itemMatchName) => {
    if (wrongPair || matches.includes(itemMatchName)) return;
    // Toggle logica
    if (selectedRight === itemMatchName) setSelectedRight(null);
    else setSelectedRight(itemMatchName);
=======
  const handleShare = async () => {
    if (!certificateRef.current) return;
    
    const canvas = await html2canvas(certificateRef.current, {
      backgroundColor: '#111111',
      scale: 3, 
      useCORS: true
    });
    
    const image = canvas.toDataURL("image/png");
    const amount = MONEY_LADDER[currentIdx - 1] || "€ 0";

    if (navigator.share) {
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], "Lawbooks_Miljoenenjacht.png", { type: "image/png" });
      try {
        await navigator.share({
          title: 'Lawbooks Miljoenenjacht',
          text: `Ik heb ${amount} behaald in de Lawbooks Miljoenenjacht! Kom jij even ver als ik? ⚖️💰`,
          files: [file],
        });
      } catch (err) { console.log("Delen gestopt"); }
    } else {
      const link = document.createElement('a');
      link.download = `Lawbooks_Resultaat_${amount}.png`;
      link.href = image;
      link.click();
    }
>>>>>>> 1d6bd31885c81de89a4c63b93a83452b7f65ebe3
  };

  // Effect dat de match controleert zodra beide zijden geselecteerd zijn
  useEffect(() => {
<<<<<<< HEAD
    if (selectedLeft && selectedRight) {
      if (selectedLeft.match === selectedRight) {
        // MATCH: Groen flitsen via matches state
        const leftTerm = selectedLeft.term;
        const rightTerm = selectedRight;
        setMatches(prev => [...prev, leftTerm, rightTerm]);
        setSelectedLeft(null);
        setSelectedRight(null);
=======
    let timer;
    if (gameState === 'playing' && timeLeft > 0 && evaluation === null) {
      timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 0.1)), 100);
    } else if (timeLeft <= 0 && gameState === 'playing' && evaluation === null) {
      setGameState('lost');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, evaluation]);

  useEffect(() => {
    if (gameState === 'playing' || gameState === 'transitioning') {
      audioRef.current?.play().catch(() => {});
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [gameState]);

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setEvaluation('thinking');
    const isCorrect = idx === questions[currentIdx].correct;

    setTimeout(() => {
      setEvaluation(isCorrect ? 'correct' : 'wrong');
      if (isCorrect) {
        // Lawbooks confetti: Mintgroen, Zwart, Wit
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.8 }, colors: ['#00E091', '#111111', '#FFFFFF'] });
        setTimeout(() => {
          if (currentIdx === 11) {
            confetti({ particleCount: 500, spread: 150, origin: { y: 0.6 }, colors: ['#00E091', '#111111'] });
            setGameState('won');
          } else {
            setGameState('transitioning');
            setTimeout(() => {
              setCurrentIdx(prev => prev + 1);
              setTimeLeft(25);
              setSelected(null);
              setEvaluation(null);
              setGameState('playing');
            }, 1800);
          }
        }, 1500);
>>>>>>> 1d6bd31885c81de89a4c63b93a83452b7f65ebe3
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

<<<<<<< HEAD
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
=======
  const progress = ((currentIdx) / 12) * 100;

  if (gameState === 'start') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA] text-[#111111] p-6 text-center">
        <audio ref={audioRef} src="/spannend.mp3" loop />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <h1 className="text-8xl font-serif italic mb-2 tracking-tighter">Miljoenenjacht</h1>
          <p className="text-[#00E091] tracking-[0.5em] font-black text-sm mb-16 uppercase">Win jij een Miljoen?</p>
          <button onClick={startGame} className="px-20 py-8 bg-[#111111] text-white rounded-2xl font-black text-2xl shadow-xl transition-all hover:bg-[#00E091] hover:text-[#111111]">START DE STRIJD</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-[#111111] overflow-hidden">
      <audio ref={audioRef} src="/spannend.mp3" loop />
      
      {/* -------------------------------------------------------------
          LAWBOOKS CERTIFICAAT (ZWART / MINT)
      ---------------------------------------------------------------- */}
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <div 
          ref={certificateRef} 
          style={{ 
            width: '800px', 
            height: '600px', 
            background: '#111111', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '40px',
            border: '14px solid #00E091',
            borderRadius: '24px',
            fontFamily: 'serif',
            position: 'relative'
          }}
        >
          {/* Badge */}
          <div style={{ position: 'absolute', top: '40px' }}>
             <div style={{ backgroundColor: '#00E091', padding: '15px', borderRadius: '50%', border: '4px solid white', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>
                <Award size={50} color="#111111" />
             </div>
>>>>>>> 1d6bd31885c81de89a4c63b93a83452b7f65ebe3
          </div>
          {leftItems.map((item, i) => {
            const isMatched = matches.includes(item.term);
            const isSelected = selectedLeft?.term === item.term;
            const isWrong = wrongPair?.includes(item.term);

<<<<<<< HEAD
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
=======
          <div style={{ height: '3px', background: '#00E091', width: '120px', marginTop: '100px', marginBottom: '40px' }}></div>
          
          <p style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '6px', fontSize: '18px', fontWeight: '900', marginBottom: '50px' }}>
            LAWBOOKS KNOWLEDGE BASE
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ color: '#00E091', fontSize: '56px', fontWeight: '900', margin: '0', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              SCORE: {currentIdx}/12
            </h2>
            <h2 style={{ color: '#00E091', fontSize: '64px', fontWeight: '900', margin: '0', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              BEDRAG: {MONEY_LADDER[currentIdx - 1] || "€ 0"}
            </h2>
          </div>

          <p style={{ color: 'white', fontSize: '26px', marginTop: '60px', fontStyle: 'italic', opacity: '0.9' }}>
            Kom jij even ver als ik?
          </p>

          <p style={{ color: 'white', marginTop: '50px', fontSize: '14px', opacity: '0.5', letterSpacing: '2px' }}>
            www.lawbooks.nl
          </p>
        </div>
      </div>

      {/* Progress Bar (Zwart naar Mint) */}
      <div className="w-full h-2 bg-slate-100 relative z-50">
        <motion.div className="h-full bg-gradient-to-r from-[#111111] to-[#00E091]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
          <AnimatePresence mode="wait">
            {gameState === 'transitioning' ? (
              <motion.div key="trans" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }} className="text-center">
                <p className="text-[#00E091] font-black uppercase tracking-[0.4em] text-sm mb-6">NIVEAU BEREIKT</p>
                <motion.h2 animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="text-[10rem] font-serif italic font-black text-[#111111]">
                  {MONEY_LADDER[currentIdx]}
                </motion.h2>
              </motion.div>
            ) : gameState === 'playing' && questions[currentIdx] ? (
              <motion.div key={currentIdx} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="w-full max-w-4xl">
                <div className="bg-white border-2 border-slate-100 rounded-[3rem] shadow-2xl overflow-hidden mb-12 relative">
                  <div className="p-12 md:p-16 text-center">
                    <span className="px-4 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 inline-block">Vraag {currentIdx + 1}</span>
                    <h2 className="text-4xl md:text-5xl font-serif leading-tight text-[#111111] font-medium italic">"{questions[currentIdx].q}"</h2>
                  </div>
                  <div className="h-3 w-full bg-slate-50 relative">
                    <motion.div className={`absolute top-0 left-0 bottom-0 ${evaluation === 'correct' ? 'bg-[#00E091]' : evaluation === 'wrong' ? 'bg-red-500' : 'bg-[#111111]'}`} initial={{ width: "100%" }} animate={{ width: `${(timeLeft / 25) * 100}%` }} transition={{ duration: 0.1, ease: "linear" }} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {questions[currentIdx].options.map((opt, i) => {
                    const isCorrect = i === questions[currentIdx].correct;
                    const isSelected = selected === i;
                    // Lawbooks styling voor knoppen
                    let style = "bg-white border-slate-200 text-[#111111] hover:border-[#00E091] hover:shadow-md shadow-sm";
                    
                    if (isSelected && evaluation === 'thinking') style = "bg-[#111111] border-[#111111] text-white shadow-xl scale-[0.98]";
                    if (evaluation === 'correct' && isCorrect) style = "bg-[#00E091] border-[#00E091] text-[#111111] shadow-2xl scale-[1.05]";
                    if (evaluation === 'wrong' && isSelected && !isCorrect) style = "bg-red-600 border-red-600 text-white";
                    if (selected !== null && !isSelected && !(evaluation === 'correct' && isCorrect)) style += " opacity-20 grayscale-[0.5] pointer-events-none";
                    
                    return (
                      <motion.button key={i} disabled={selected !== null} onClick={() => handleAnswer(i)} animate={evaluation === 'wrong' && isSelected ? { x: [-5, 5, -5, 5, 0] } : {}} className={`p-8 rounded-[2rem] border-2 transition-all text-left flex items-center gap-6 ${style}`}>
                        <span className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-xs ${isSelected ? 'bg-white/20' : (evaluation === 'correct' && isCorrect) ? 'bg-[#111111]/20' : 'bg-slate-100 text-slate-400'}`}>{String.fromCharCode(65 + i)}</span>
                        <span className="font-bold text-xl leading-tight">{opt}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : gameState === 'lost' ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-2xl bg-white p-16 rounded-[4rem] shadow-2xl border-t-[12px] border-red-500">
                <h2 className="text-6xl font-serif mb-4 font-bold text-red-600 italic">Helaas...</h2>
                <p className="text-slate-500 text-xl mb-6 uppercase tracking-widest">Je strandt op {currentIdx > 0 ? MONEY_LADDER[currentIdx-1] : "€ 0"}</p>
                
                {/* Deelknop in Mintgroen */}
                {currentIdx >= 4 && (
                  <button onClick={handleShare} className="mb-8 flex items-center justify-center gap-2 w-full py-4 bg-[#00E091] text-[#111111] rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                    <Share2 size={20} /> Deel mijn resultaat!
                  </button>
                )}

                <div className="bg-slate-50 p-8 rounded-3xl my-8 text-left border-l-4 border-[#00E091]">
                    <p className="italic text-slate-600 text-lg leading-relaxed">{questions[currentIdx]?.basis}</p>
                </div>
                <button onClick={startGame} className="px-16 py-6 bg-[#111111] text-white rounded-full font-black text-xl hover:scale-105 transition-all shadow-xl">NIEUWE POGING</button>
              </motion.div>
            ) : gameState === 'won' ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                <h2 className="text-9xl font-serif mb-6 text-[#00E091] font-black italic">MILJONAIR!</h2>
                
                <button onClick={handleShare} className="mb-8 flex items-center justify-center gap-2 px-12 py-5 bg-[#00E091] text-[#111111] rounded-2xl font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                    <Share2 size={24} /> Deel mijn Overwinning!
                </button>

                <p className="text-slate-500 text-2xl mb-12 font-bold uppercase tracking-widest text-white drop-shadow-lg">Je hebt de Miljoen gehaald!</p>
                <button onClick={startGame} className="px-16 py-6 bg-[#111111] text-white rounded-full font-black text-xl shadow-2xl hover:scale-105 transition-all">SPEEL OPNIEUW</button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="w-80 bg-white border-l border-slate-100 p-12 hidden lg:flex flex-col-reverse justify-center gap-1">
          {MONEY_LADDER.map((amount, index) => {
            const isCurrent = index === currentIdx;
            const isDone = index < currentIdx;
            return (
              <motion.div key={amount} animate={isCurrent ? { x: 10 } : { x: 0 }} className={`flex justify-between items-center py-3 px-5 rounded-2xl transition-all border ${isCurrent ? 'bg-[#111111] text-white border-[#111111] shadow-xl scale-110 z-10' : isDone ? 'text-slate-200 border-transparent' : 'text-slate-400 border-transparent opacity-60'}`}>
                <span className={`text-[10px] font-black ${isCurrent ? 'text-[#00E091]' : ''}`}>{index + 1}</span>
                <span className="text-base font-bold tracking-tighter">{amount}</span>
              </motion.div>
>>>>>>> 1d6bd31885c81de89a4c63b93a83452b7f65ebe3
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