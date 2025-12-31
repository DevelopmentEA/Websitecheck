import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Gavel, AlertOctagon, CheckCircle2, Heart, Zap, X } from 'lucide-react';
import allQuestions from './vragen2.json';

const CourtroomRush = () => {
  const [gameState, setGameState] = useState('start'); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(22); // VERHOOGD: 22 seconden denktijd
  const [lastResult, setLastResult] = useState(null); 
  const audioRef = useRef(null);

  // Verbeterde Randomization Functie
  const startGame = () => {
    if (!allQuestions || allQuestions.length === 0) return;
    
    // Volledige willekeurige sortering van de brondata
    const randomSelection = [...allQuestions]
      .sort(() => Math.random() - 0.5) // Echte willekeurige shuffle
      .slice(0, 20); // Pak 20 willekeurige vragen voor deze sessie

    setQuestions(randomSelection);
    setGameState('playing');
    setScore(0);
    setLives(3);
    setCurrentIdx(0);
    setTimeLeft(22);
  };

  const resetTimer = () => setTimeLeft(22);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 0.1)), 100);
    } else if (timeLeft <= 0 && gameState === 'playing') {
      handleAnswer(null); 
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleAnswer = (userSaysCorrect) => {
    if (gameState !== 'playing') return;

    const question = questions[currentIdx];
    if (!question) return;

    const isActuallyCorrect = question.isCorrect;
    const isRightDecision = (userSaysCorrect === isActuallyCorrect);

    if (isRightDecision && userSaysCorrect !== null) {
      setScore(prev => prev + Math.ceil(timeLeft * 100));
      setLastResult('correct');
      if (userSaysCorrect === false) {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 }, colors: ['#C5A059'] });
      }
    } else {
      setLives(prev => prev - 1);
      setLastResult('wrong');
    }

    setGameState('feedback');

    // VERHOOGD: 10 seconden om de juridische onderbouwing te bestuderen
    setTimeout(() => {
      if (lives <= 1 && !isRightDecision) {
        setGameState('result');
      } else if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setGameState('playing');
        setLastResult(null);
        resetTimer();
      } else {
        setGameState('result');
      }
    }, 10000); 
  };

  const getRank = () => {
    if (score > 15000) return "Raadsheer bij de Hoge Raad";
    if (score > 9000) return "Officier van Justitie";
    if (score > 4000) return "Advocaat-Stagiair";
    return "Rechtenstudent";
  };

  if (gameState === 'start') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-[#1A365D] p-6 text-center">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="w-24 h-24 bg-[#C5A059] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl text-white rotate-3">
            <Gavel size={48} />
          </div>
          <h1 className="text-7xl font-serif italic mb-6 tracking-tight">Courtroom Rush</h1>
          <p className="text-slate-500 max-w-lg mx-auto mb-12 text-lg leading-relaxed">
            Analyseer de verklaringen. Je hebt 22 seconden per casus en 10 seconden om de juridische analyse te bestuderen.
          </p>
          <button 
            onClick={startGame}
            className="px-16 py-6 bg-[#1A365D] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-[#152c4d] transition-all shadow-[0_20px_50px_rgba(26,54,93,0.3)] hover:translate-y-[-4px]"
          >
            START DE ZITTING
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 font-sans relative">
      {/* Header met Statussen */}
      <div className="flex justify-between items-center mb-10 bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex gap-3">
          {[...Array(3)].map((_, i) => (
            <Heart key={i} size={28} fill={i < lives ? "#be123c" : "none"} color={i < lives ? "#be123c" : "#e2e8f0"} className="transition-all duration-500" />
          ))}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Prestige Punten</p>
          <p className="text-4xl font-mono font-bold text-[#C5A059] leading-none">{score.toLocaleString()}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'playing' && questions[currentIdx] && (
          <motion.div 
            key={`play-${currentIdx}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-8"
          >
            <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl overflow-hidden relative">
              <div className="p-16 md:p-24 text-center min-h-[400px] flex flex-col justify-center">
                <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.4em] mb-12 block">Dossierstuk {currentIdx + 1} / 20</span>
                <h2 className="text-3xl md:text-5xl font-serif leading-[1.3] text-[#1A365D] italic px-4">
                  "{questions[currentIdx].statement}"
                </h2>
              </div>
              
              {/* Progress Timer */}
              <div className="h-2.5 w-full bg-slate-50 relative">
                <motion.div 
                  className={`absolute top-0 left-0 bottom-0 ${timeLeft < 5 ? 'bg-rose-500' : 'bg-[#C5A059]'}`}
                  initial={{ width: "100%" }}
                  animate={{ width: `${(timeLeft / 22) * 100}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>
            </div>

            {/* Actie Knoppen */}
            <div className="grid grid-cols-2 gap-8">
              <button 
                onClick={() => handleAnswer(false)}
                className="group p-10 bg-white border-2 border-rose-50 rounded-[2.5rem] hover:bg-rose-600 hover:border-rose-600 transition-all duration-300 flex flex-col items-center gap-4 shadow-lg hover:translate-y-[-5px]"
              >
                <AlertOctagon size={40} className="text-rose-500 group-hover:text-white transition-colors" />
                <span className="font-black text-sm uppercase tracking-widest text-rose-500 group-hover:text-white">Objection!</span>
              </button>

              <button 
                onClick={() => handleAnswer(true)}
                className="group p-10 bg-white border-2 border-emerald-50 rounded-[2.5rem] hover:bg-emerald-600 hover:border-emerald-600 transition-all duration-300 flex flex-col items-center gap-4 shadow-lg hover:translate-y-[-5px]"
              >
                <CheckCircle2 size={40} className="text-emerald-500 group-hover:text-white transition-colors" />
                <span className="font-black text-sm uppercase tracking-widest text-emerald-500 group-hover:text-white">Proceed</span>
              </button>
            </div>
          </motion.div>
        )}

        {gameState === 'feedback' && (
          <motion.div 
            key="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            {lastResult === 'correct' ? (
              <div className="space-y-8">
                <motion.div 
                  animate={{ rotate: [0, -25, 0], scale: [1, 1.1, 1] }}
                  className="w-32 h-32 bg-[#C5A059] rounded-full flex items-center justify-center mx-auto text-white shadow-[0_20px_40px_rgba(197,160,89,0.3)]"
                >
                  <Gavel size={64} />
                </motion.div>
                <h3 className="text-5xl font-serif italic text-emerald-600">Sustained!</h3>
                <div className="bg-white p-10 rounded-[2.5rem] border-l-[12px] border-[#C5A059] text-left max-w-2xl mx-auto shadow-xl">
                   <p className="text-slate-700 text-xl leading-relaxed font-medium italic">"{questions[currentIdx]?.basis}"</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="w-32 h-32 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600 shadow-inner">
                  <X size={64} />
                </div>
                <h3 className="text-5xl font-serif italic text-rose-600">Overruled!</h3>
                <div className="bg-white p-10 rounded-[2.5rem] border-l-[12px] border-rose-600 text-left max-w-2xl mx-auto shadow-xl">
                  <p className="text-rose-900 font-black mb-4 uppercase tracking-widest text-xs">
                    {timeLeft <= 0 ? "TIJD IS VERSTREKEN" : "ONJUISTE ANALYSE"}
                  </p>
                  <p className="text-slate-700 text-xl leading-relaxed italic">"{questions[currentIdx]?.basis}"</p>
                </div>
              </div>
            )}
            <div className="mt-12">
               <div className="h-1.5 w-48 bg-slate-100 mx-auto rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#1A365D]"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 10, ease: "linear" }}
                  />
               </div>
               <p className="text-slate-400 mt-4 text-[10px] font-bold uppercase tracking-widest animate-pulse">Griffie bereidt volgend dossier voor...</p>
            </div>
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[4rem] shadow-2xl p-20 text-center border border-slate-100 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-[#C5A059]" />
            <h2 className="text-2xl font-serif text-slate-400 mb-4 italic">Het vonnis is geveld</h2>
            <h3 className="text-5xl font-black text-[#1A365D] mb-12 uppercase tracking-tighter">{getRank()}</h3>
            
            <div className="text-[10rem] font-mono font-bold text-[#1A365D] leading-none mb-4 tracking-tighter">
              {score}
            </div>
            <p className="text-[#C5A059] font-black tracking-[0.6em] mb-16 uppercase text-sm">Totaalscore</p>

            <button 
              onClick={startGame}
              className="bg-[#1A365D] text-white px-20 py-8 rounded-3xl font-black text-sm uppercase tracking-[0.3em] hover:bg-[#C5A059] transition-all shadow-2xl"
            >
              NIEUWE ZAAK STARTEN
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourtroomRush;