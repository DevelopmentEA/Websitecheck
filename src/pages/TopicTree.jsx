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
  const [timeLeft, setTimeLeft] = useState(22);
  const [lastResult, setLastResult] = useState(null); 
  const audioRef = useRef(null);

  // Verbeterde Randomization Functie
  const startGame = () => {
    if (!allQuestions || allQuestions.length === 0) return;
    
    // Volledige willekeurige sortering van de brondata
    const randomSelection = [...allQuestions]
      .sort(() => Math.random() - 0.5) 
      .slice(0, 20); 

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
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 }, colors: ['#6EE7B7', '#059669'] });
      }
    } else {
      setLives(prev => prev - 1);
      setLastResult('wrong');
    }

    setGameState('feedback');

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
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-slate-900 p-6 text-center bg-slate-50 font-sans">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="w-20 h-20 bg-[#6EE7B7]/10 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm text-[#059669]">
            <Gavel size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight text-slate-900">Courtroom Rush</h1>
          <p className="text-slate-500 max-w-lg mx-auto mb-10 text-lg leading-relaxed font-medium">
            Analyseer de verklaringen. Je hebt 22 seconden per casus en 10 seconden om de juridische analyse te bestuderen.
          </p>
          <button 
            onClick={startGame}
            className="px-10 py-4 bg-[#1F2937] text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            START DE ZITTING
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans relative min-h-screen bg-slate-50 text-slate-900">
      {/* Header met Statussen */}
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Heart key={i} size={24} fill={i < lives ? "#ef4444" : "none"} color={i < lives ? "#ef4444" : "#cbd5e1"} className="transition-all duration-300" />
          ))}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
          <p className="text-3xl font-bold text-[#059669] leading-none tabular-nums">{score.toLocaleString()}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'playing' && questions[currentIdx] && (
          <motion.div 
            key={`play-${currentIdx}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden relative">
              <div className="p-12 md:p-20 text-center min-h-[350px] flex flex-col justify-center items-center">
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold mb-8 uppercase tracking-wide">
                  Casus {currentIdx + 1} / 20
                </span>
                <h2 className="text-2xl md:text-4xl font-bold leading-tight text-slate-900 max-w-3xl">
                  "{questions[currentIdx].statement}"
                </h2>
              </div>
              
              {/* Progress Timer */}
              <div className="h-2 w-full bg-slate-100 relative">
                <motion.div 
                  className={`absolute top-0 left-0 bottom-0 ${timeLeft < 5 ? 'bg-rose-500' : 'bg-[#6EE7B7]'}`}
                  initial={{ width: "100%" }}
                  animate={{ width: `${(timeLeft / 22) * 100}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>
            </div>

            {/* Actie Knoppen */}
            <div className="grid grid-cols-2 gap-6">
              <button 
                onClick={() => handleAnswer(false)}
                className="group p-8 bg-white border border-slate-200 rounded-2xl hover:border-rose-500 hover:bg-rose-50 transition-all duration-200 flex flex-col items-center gap-3 shadow-sm hover:shadow-md"
              >
                <div className="p-3 bg-rose-100 rounded-full text-rose-600 group-hover:scale-110 transition-transform">
                    <AlertOctagon size={32} />
                </div>
                <span className="font-bold text-sm uppercase tracking-wider text-rose-600">Objection!</span>
              </button>

              <button 
                onClick={() => handleAnswer(true)}
                className="group p-8 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 flex flex-col items-center gap-3 shadow-sm hover:shadow-md"
              >
                <div className="p-3 bg-emerald-100 rounded-full text-emerald-600 group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={32} />
                </div>
                <span className="font-bold text-sm uppercase tracking-wider text-emerald-600">Proceed</span>
              </button>
            </div>
          </motion.div>
        )}

        {gameState === 'feedback' && (
          <motion.div 
            key="feedback"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10"
          >
            {lastResult === 'correct' ? (
              <div className="space-y-6">
                <motion.div 
                  animate={{ rotate: [0, -10, 0], scale: [1, 1.05, 1] }}
                  className="w-24 h-24 bg-[#6EE7B7]/20 rounded-full flex items-center justify-center mx-auto text-[#059669]"
                >
                  <Gavel size={48} strokeWidth={2} />
                </motion.div>
                <h3 className="text-4xl font-bold text-[#059669]">Sustained!</h3>
                <div className="bg-white p-8 rounded-2xl border-l-4 border-[#6EE7B7] text-left max-w-2xl mx-auto shadow-sm">
                   <p className="text-slate-700 text-lg leading-relaxed font-medium">"{questions[currentIdx]?.basis}"</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600">
                  <X size={48} strokeWidth={2} />
                </div>
                <h3 className="text-4xl font-bold text-rose-600">Overruled!</h3>
                <div className="bg-white p-8 rounded-2xl border-l-4 border-rose-500 text-left max-w-2xl mx-auto shadow-sm">
                  <p className="text-rose-600 font-bold mb-2 text-xs uppercase tracking-wider">
                    {timeLeft <= 0 ? "TIJD IS VERSTREKEN" : "ONJUISTE ANALYSE"}
                  </p>
                  <p className="text-slate-700 text-lg leading-relaxed">"{questions[currentIdx]?.basis}"</p>
                </div>
              </div>
            )}
            <div className="mt-10">
               <div className="h-1 w-32 bg-slate-200 mx-auto rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-slate-800"
                   initial={{ width: 0 }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 10, ease: "linear" }}
                 />
               </div>
               <p className="text-slate-400 mt-3 text-xs font-semibold uppercase tracking-wide">Volgend dossier wordt geladen...</p>
            </div>
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-200 relative overflow-hidden max-w-2xl mx-auto"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#6EE7B7]" />
            <h2 className="text-xl font-medium text-slate-500 mb-2">Het vonnis is geveld</h2>
            <h3 className="text-3xl font-bold text-slate-900 mb-10">{getRank()}</h3>
            
            <div className="text-8xl font-bold text-[#059669] mb-4 tracking-tight">
              {score}
            </div>
            <p className="text-slate-400 font-bold tracking-widest mb-12 uppercase text-xs">Totaalscore</p>

            <button 
              onClick={startGame}
              className="bg-[#1F2937] text-white px-12 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-black transition-all shadow-lg hover:-translate-y-1"
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