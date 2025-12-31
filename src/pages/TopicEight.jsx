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
  const [timeLeft, setTimeLeft] = useState(15); // VERHOOGD: van 7 naar 15 seconden
  const [lastResult, setLastResult] = useState(null); 
  const audioRef = useRef(null);

  const startGame = () => {
    if (!allQuestions || allQuestions.length === 0) return;
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 20);
    setQuestions(shuffled);
    setGameState('playing');
    setScore(0);
    setLives(3);
    setCurrentIdx(0);
    resetTimer();
  };

  const resetTimer = () => setTimeLeft(15); // VERHOOGD naar 15

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
    const question = questions[currentIdx];
    const isActuallyCorrect = question.isCorrect;
    const isRightDecision = (userSaysCorrect === isActuallyCorrect);

    if (isRightDecision && userSaysCorrect !== null) {
      setScore(prev => prev + Math.ceil(timeLeft * 100));
      setLastResult('correct');
      if (userSaysCorrect === false) {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 }, colors: ['#C5A059'] });
      }
    } else {
      setLives(prev => prev - 1);
      setLastResult('wrong');
    }

    setGameState('feedback');

    // VERHOOGD: De feedback-tijd is nu 6 seconden (6000ms) in plaats van 2 seconden
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
    }, 6000); 
  };

  const getRank = () => {
    if (score > 10000) return "Raadsheer bij de Hoge Raad";
    if (score > 6000) return "Officier van Justitie";
    if (score > 3000) return "Advocaat-Stagiair";
    return "Rechtenstudent";
  };

  if (gameState === 'start') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-[#1A365D] p-6 text-center">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="w-20 h-20 bg-[#C5A059] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl text-white">
            <Gavel size={40} />
          </div>
          <h1 className="text-6xl font-serif italic mb-4">Courtroom Rush</h1>
          <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed">
            Spot de juridische fouten. Je hebt nu meer tijd om te oordelen en de motivatie te lezen.
          </p>
          <button 
            onClick={startGame}
            className="px-12 py-5 bg-[#1A365D] text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
          >
            BETREED DE ZAAL
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans relative">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Heart key={i} size={24} fill={i < lives ? "#be123c" : "none"} color={i < lives ? "#be123c" : "#e2e8f0"} />
          ))}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actuele Score</p>
          <p className="text-2xl font-mono font-bold text-[#C5A059]">{score}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'playing' && questions[currentIdx] && (
          <motion.div 
            key="play"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
              <div className="p-12 md:p-20 text-center min-h-[300px] flex flex-col justify-center">
                <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.3em] mb-8 block">De Rechtbank stelt:</span>
                <h2 className="text-3xl md:text-4xl font-serif leading-snug text-[#1A365D] italic">
                  "{questions[currentIdx].statement}"
                </h2>
              </div>
              <div className="h-2 w-full bg-slate-50 relative">
                <motion.div 
                  className="absolute top-0 left-0 bottom-0 bg-[#C5A059]"
                  initial={{ width: "100%" }}
                  animate={{ width: `${(timeLeft / 15) * 100}%` }} // Aangepast aan 15s
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <button 
                onClick={() => handleAnswer(false)}
                className="group p-8 bg-white border-2 border-rose-100 rounded-[2rem] hover:bg-rose-500 hover:border-rose-500 transition-all flex flex-col items-center gap-2"
              >
                <AlertOctagon size={32} className="text-rose-500 group-hover:text-white" />
                <span className="font-black text-xs uppercase tracking-widest text-rose-500 group-hover:text-white">Objection!</span>
              </button>

              <button 
                onClick={() => handleAnswer(true)}
                className="group p-8 bg-white border-2 border-emerald-100 rounded-[2rem] hover:bg-emerald-500 hover:border-emerald-500 transition-all flex flex-col items-center gap-2"
              >
                <CheckCircle2 size={32} className="text-emerald-500 group-hover:text-white" />
                <span className="font-black text-xs uppercase tracking-widest text-emerald-500 group-hover:text-white">Proceed</span>
              </button>
            </div>
          </motion.div>
        )}

        {gameState === 'feedback' && (
          <motion.div 
            key="feedback"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-20"
          >
            {lastResult === 'correct' ? (
              <div className="space-y-6">
                <motion.div 
                  animate={{ rotate: [0, -30, 0] }}
                  className="w-32 h-32 bg-[#C5A059] rounded-full flex items-center justify-center mx-auto text-white shadow-2xl"
                >
                  <Gavel size={64} />
                </motion.div>
                <h3 className="text-4xl font-serif italic text-emerald-600">Sustained! (Toegewezen)</h3>
                <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-[#C5A059] text-left max-w-xl mx-auto">
                   <p className="text-slate-600 leading-relaxed font-medium">{questions[currentIdx].basis}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-32 h-32 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600">
                  <X size={64} />
                </div>
                <h3 className="text-4xl font-serif italic text-rose-600">Overruled! (Afgewezen)</h3>
                <div className="bg-rose-50 p-6 rounded-2xl border-l-4 border-rose-600 text-left max-w-xl mx-auto">
                  <p className="text-rose-900 font-bold mb-2">
                    {timeLeft <= 0 ? "TIJD IS OM!" : "ONJUIST OORDEEL!"}
                  </p>
                  <p className="text-slate-600 leading-relaxed">{questions[currentIdx].basis}</p>
                </div>
              </div>
            )}
            <p className="text-slate-400 mt-8 animate-pulse text-sm">Volgende dossier wordt voorbereid...</p>
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-slate-100"
          >
            <h2 className="text-2xl font-serif text-slate-400 mb-2 italic">Eindoordeel</h2>
            <h3 className="text-4xl font-black text-[#1A365D] mb-8 uppercase tracking-tighter">{getRank()}</h3>
            <div className="text-7xl font-mono font-bold text-[#C5A059] mb-12">
              {score} PTS
            </div>
            <button 
              onClick={startGame}
              className="bg-[#1A365D] text-white px-16 py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
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