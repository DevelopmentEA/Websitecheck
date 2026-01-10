import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas'; 
import { 
  Share2, Trophy, Timer, Zap, Gavel, 
  CheckCircle2, AlertCircle, ArrowRight, RotateCcw 
} from 'lucide-react'; 

import allQuestions from './vragen.json'; 

const MONEY_LADDER = [
  "€ 500.000", "€ 1.000.000", "€ 2.000.000", "€ 4.000.000", "€ 8.000.000", 
  "€ 16.000.000", "€ 32.000.000", "€ 64.000.000", "€ 125.000.000", "€ 250.000.000", 
  "€ 500.000.000", "€ 1.000.000.000"
];

const COLORS = {
  mint: '#6EE7B7',
  mintDark: '#059669',
  dark: '#050505',
  bg: '#F9FAFB'
};

// --- PERFORMANCE CHECK ---
const usePerformanceMode = () => {
  const [isLowPower, setIsLowPower] = useState(false);
  useEffect(() => {
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    setIsLowPower(isMobile);
  }, []);
  return isLowPower;
};

// --- COMPACT TILT OPTION ---
const AnswerOption = ({ opt, i, selected, evaluation, onClick, disabled, index }) => {
  const isLowPower = usePerformanceMode();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const isSelected = selected === i;
  const isCorrect = evaluation === 'correct' && isSelected;
  const isWrong = evaluation === 'wrong' && isSelected;

  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 10 },
        enter: { opacity: 1, y: 0, transition: { delay: index * 0.05 } }
      }}
      style={{ rotateX: isLowPower ? 0 : rotateX, rotateY: isLowPower ? 0 : rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        if (isLowPower) return;
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="relative"
    >
      <motion.button
        disabled={disabled}
        onClick={() => onClick(i)}
        whileTap={{ scale: 0.98 }}
        className={`w-full p-4 md:p-5 rounded-2xl border-2 text-left flex items-center gap-4 transition-all duration-300 ${
          isCorrect ? 'bg-[#10B981] border-[#10B981] text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' :
          isWrong ? 'bg-[#EF4444] border-[#EF4444] text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' :
          isSelected ? 'bg-black border-[#6EE7B7] text-white shadow-[0_0_20px_rgba(110,231,183,0.2)]' :
          'bg-white border-slate-100 text-slate-800 hover:border-[#6EE7B7]/50 shadow-sm'
        } ${disabled && !isSelected ? 'opacity-40 grayscale-[50%]' : 'opacity-100'}`}
      >
        <span className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-black text-xs ${
          isSelected ? 'bg-[#6EE7B7] text-black' : 'bg-slate-100 text-slate-400'
        }`}>
          {String.fromCharCode(65 + i)}
        </span>
        <span className="font-bold text-sm md:text-base leading-tight">{opt}</span>
      </motion.button>
    </motion.div>
  );
};

const Miljardenjacht = () => {
  const [gameState, setGameState] = useState('start'); 
  const [questions, setQuestions] = useState([]); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [selected, setSelected] = useState(null);
  const [evaluation, setEvaluation] = useState(null); 
  const isLowPower = usePerformanceMode();
  
  const certificateRef = useRef(null);

  const startGame = () => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 12));
    setGameState('playing');
    setCurrentIdx(0);
    setTimeLeft(25);
    setSelected(null);
    setEvaluation(null);
  };

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0 && !evaluation) {
      timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 0.1)), 100);
    } else if (timeLeft <= 0 && gameState === 'playing' && !evaluation) {
      setGameState('lost');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, evaluation]);

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setEvaluation('thinking');
    
    const isCorrect = idx === questions[currentIdx].correct;

    setTimeout(() => {
      setEvaluation(isCorrect ? 'correct' : 'wrong');
      if (isCorrect) {
        confetti({ particleCount: 40, spread: 60, colors: [COLORS.mint, '#000000'] });
        setTimeout(() => {
          if (currentIdx === 11) setGameState('won');
          else {
            setGameState('transitioning');
            setTimeout(() => {
              setCurrentIdx(p => p + 1);
              setTimeLeft(25);
              setSelected(null);
              setEvaluation(null);
              setGameState('playing');
            }, 1400);
          }
        }, 1200);
      } else {
        setTimeout(() => setGameState('lost'), 1200);
      }
    }, 1000);
  };

  const handleShare = async () => {
    if (!certificateRef.current) return;
    const canvas = await html2canvas(certificateRef.current);
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = 'Lawbooks_Score.png';
    link.href = image;
    link.click();
  };

  // --- RENDERS ---

  if (gameState === 'start') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[#6EE7B7]/5 -z-10" />
        <motion.div whileHover={{ rotate: 12, scale: 1.1 }} className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
          <Trophy size={40} className="text-[#6EE7B7]" />
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-none uppercase italic">
          Miljarden<span className="text-[#059669]">jacht</span>
        </h1>
        <p className="text-slate-400 font-bold text-sm md:text-lg mb-10 max-w-sm">Win virtueel goud door je kennis van het recht te bewijzen.</p>
        <button 
          onClick={startGame}
          className="px-10 py-4 bg-black text-[#6EE7B7] rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl flex items-center gap-3"
        >
          Start Module <ArrowRight size={18} />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 py-2 md:py-6 relative">
      
      {/* LADDER SIDEBAR */}
      <div className="lg:col-span-3 order-2 lg:order-1">
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-5 shadow-sm sticky top-20">
          <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 mb-6 text-center italic">Status Ladder</h3>
          <div className="space-y-1.5 flex flex-col-reverse">
            {MONEY_LADDER.map((amount, i) => (
              <div 
                key={i}
                className={`flex justify-between items-center p-2.5 rounded-xl border transition-all duration-500 ${
                  i === currentIdx ? 'bg-black border-[#6EE7B7] text-[#6EE7B7] scale-105 shadow-md' :
                  i < currentIdx ? 'bg-[#6EE7B7]/10 border-transparent text-[#059669] opacity-60' :
                  'bg-slate-50 border-transparent text-slate-300'
                }`}
              >
                <span className="text-[9px] font-black italic">{i + 1}</span>
                <span className="text-xs font-black tracking-tight">{amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GAME ENGINE AREA */}
      <div className="lg:col-span-9 order-1 lg:order-2 flex flex-col gap-6">
        <AnimatePresence mode="wait">
          
          {/* 1. TRANSITION */}
          {gameState === 'transitioning' ? (
            <motion.div 
              key="trans" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center min-h-[350px] text-center"
            >
              <p className="text-[#059669] font-black uppercase tracking-widest text-[10px] mb-4">Mijlpaal Bereikt</p>
              <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter italic">{MONEY_LADDER[currentIdx]}</h2>
              <Zap size={40} className="text-[#6EE7B7] mt-6 animate-pulse" />
            </motion.div>

          /* 2. PLAYING */
          ) : gameState === 'playing' ? (
            <motion.div key="play" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 md:space-y-6">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50">
                  <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: `${(timeLeft / 25) * 100}%` }}
                    transition={{ duration: 0.1, ease: "linear" }}
                    className="h-full bg-[#6EE7B7] shadow-[0_0_15px_#6EE7B7]"
                  />
                </div>
                <div className="flex justify-between items-center mb-6 md:mb-10">
                  <span className="px-4 py-1.5 rounded-full bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                    Vraag {currentIdx + 1}
                  </span>
                  <div className="flex items-center gap-2 text-slate-900 font-black text-sm md:text-base italic">
                    <Timer size={18} className="text-[#6EE7B7]" /> {Math.ceil(timeLeft)}s
                  </div>
                </div>
                <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight leading-[1.15]">
                  {questions[currentIdx]?.q}
                </h2>
              </div>

              <motion.div initial="initial" animate="enter" className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {questions[currentIdx]?.options.map((opt, i) => (
                  <AnswerOption 
                    key={i} i={i} index={i} opt={opt} 
                    selected={selected} evaluation={evaluation}
                    onClick={handleAnswer} disabled={selected !== null}
                  />
                ))}
              </motion.div>
            </motion.div>

          /* 3. LOST WITH BENTO FEEDBACK */
          ) : gameState === 'lost' ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-2 bg-red-500" />
                <h2 className="text-4xl font-black text-red-500 mb-2 uppercase italic tracking-tighter">Helaas...</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-4">Eindscore</p>
                <div className="text-6xl font-black text-slate-900 tracking-tighter mb-8">
                  {currentIdx > 0 ? MONEY_LADDER[currentIdx-1] : "€ 0"}
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 text-left relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4 text-slate-400">
                    <AlertCircle size={18} className="text-red-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Legale Feedback</span>
                  </div>
                  <p className="text-slate-900 font-black text-sm mb-2 italic">Correct antwoord:</p>
                  <div className="bg-[#6EE7B7]/10 border border-[#6EE7B7]/30 p-4 rounded-xl mb-4">
                    <p className="text-[#059669] font-black text-base italic leading-tight">
                      {questions[currentIdx]?.options[questions[currentIdx].correct]}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-[#6EE7B7] mt-0.5 shrink-0" />
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">
                      <span className="text-slate-900 font-bold">Basis:</span> {questions[currentIdx]?.basis || "Zie relevante wetgeving en jurisprudentie voor de onderbouwing."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={handleShare} className="py-4 bg-[#6EE7B7] text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"><Share2 size={16} /> Deel</button>
                <button onClick={startGame} className="py-4 bg-black text-[#6EE7B7] rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"><RotateCcw size={16} /> Opnieuw</button>
              </div>
            </motion.div>

          /* 4. WON */
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-black text-white rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10"><Trophy size={180} /></div>
              <Trophy size={64} className="text-[#6EE7B7] mx-auto mb-6 animate-bounce" />
              <h2 className="text-5xl md:text-7xl font-black uppercase italic mb-2 tracking-tighter">Miljonair!</h2>
              <p className="text-[#6EE7B7] font-black uppercase tracking-widest text-[10px] mb-8 italic">Perfecte Score</p>
              <div className="text-7xl md:text-9xl font-black text-white mb-12 tracking-tighter">€ 1M</div>
              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={startGame} className="px-12 py-5 bg-[#6EE7B7] text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_30px_#6EE7B7]">Nieuwe Uitdaging</button>
                <button onClick={handleShare} className="px-12 py-5 bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs border border-white/10">Download Award</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Miljardenjacht;