import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Gavel, AlertOctagon, CheckCircle2, Heart, Zap, X, ChevronRight } from 'lucide-react';

// Importeer de centrale masterData
import { masterData } from '../data/masterData';

const CourtroomRush = () => {
  const { subjectSlug } = useParams();
  
  // Zoek het actieve vak op
  const activeSubject = masterData[subjectSlug];
  const questionsDb = activeSubject?.db || {};
  const accentColor = activeSubject?.accent || "#059669";

  const [gameState, setGameState] = useState('start'); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(22);
  const [lastResult, setLastResult] = useState(null); 

  // --- DATA TRANSFORMATIE LOGICA ---
  const startGame = () => {
    if (!questionsDb) return;

    let pool = [];
    Object.keys(questionsDb).forEach(week => {
      const tfQuestions = questionsDb[week]?.TF;
      if (Array.isArray(tfQuestions)) {
        tfQuestions.forEach(q => {
          pool.push({
            statement: q.q,
            isCorrect: q.c === 0, 
            basis: q.exp,
            week: week
          });
        });
      }
    });

    if (pool.length === 0) {
      alert("Geen True/False vragen gevonden voor dit vak.");
      return;
    }

    const randomSelection = [...pool]
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
      confetti({ 
        particleCount: 40, 
        spread: 60, 
        origin: { y: 0.7 }, 
        colors: [accentColor, '#ffffff'] 
      });
    } else {
      setLives(prev => prev - 1);
      setLastResult('wrong');
    }

    setGameState('feedback');
  };

  // Nieuwe functie om handmatig door te gaan
  const proceedToNext = () => {
    // Check of het spel moet eindigen (geen levens meer of einde vragenlijst)
    if (lives <= 0) {
      setGameState('result');
    } else if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setGameState('playing');
      setLastResult(null);
      resetTimer();
    } else {
      setGameState('result');
    }
  };

  const getRank = () => {
    if (score > 15000) return "Raadsheer bij de Hoge Raad";
    if (score > 9000) return "Officier van Justitie";
    if (score > 4000) return "Advocaat-Stagiair";
    return "Rechtenstudent";
  };

  if (!activeSubject) return <div className="p-20 text-center font-black">Laden van dossier...</div>;

  if (gameState === 'start') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-slate-900 p-6 text-center bg-slate-50 font-sans">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm" style={{ color: accentColor }}>
            <Gavel size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight text-slate-900">{activeSubject.title} Rush</h1>
          <p className="text-slate-500 max-w-lg mx-auto mb-10 text-lg leading-relaxed font-medium">
            Analyseer de verklaringen. Je krijgt vragen uit alle weken. Je hebt 22 seconden per casus.
          </p>
          <button 
            onClick={startGame}
            className="px-10 py-4 text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            style={{ backgroundColor: '#1F2937' }}
          >
            START DE ZITTING
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans relative min-h-screen bg-slate-50 text-slate-900">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Heart key={i} size={24} fill={i < lives ? "#ef4444" : "none"} color={i < lives ? "#ef4444" : "#cbd5e1"} className="transition-all duration-300" />
          ))}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
          <p className="text-3xl font-bold leading-none tabular-nums" style={{ color: accentColor }}>{score.toLocaleString()}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'playing' && (
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
                  Dossier {currentIdx + 1} / {questions.length}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold leading-tight text-slate-900 max-w-3xl">
                  "{questions[currentIdx].statement}"
                </h2>
              </div>
              
              <div className="h-2 w-full bg-slate-100 relative">
                <motion.div 
                  className="absolute top-0 left-0 bottom-0"
                  style={{ backgroundColor: timeLeft < 5 ? '#ef4444' : accentColor }}
                  initial={{ width: "100%" }}
                  animate={{ width: `${(timeLeft / 22) * 100}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>
            </div>

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
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
                  style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                >
                  <Gavel size={48} strokeWidth={2} />
                </motion.div>
                <h3 className="text-4xl font-bold" style={{ color: accentColor }}>Sustained!</h3>
                <div className="bg-white p-8 rounded-2xl text-left max-w-2xl mx-auto shadow-sm border-l-4" style={{ borderColor: accentColor }}>
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
            
            <button 
              onClick={proceedToNext}
              className="mt-10 px-12 py-5 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center gap-3 mx-auto"
              style={{ backgroundColor: '#1F2937' }}
            >
              Volgende Vraag <ChevronRight size={18} />
            </button>
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-200 relative overflow-hidden max-w-2xl mx-auto"
          >
            <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: accentColor }} />
            <h2 className="text-xl font-medium text-slate-500 mb-2">Het vonnis is geveld</h2>
            <h3 className="text-3xl font-bold text-slate-900 mb-10">{getRank()}</h3>
            
            <div className="text-8xl font-bold mb-4 tracking-tight" style={{ color: accentColor }}>
              {score}
            </div>
            <p className="text-slate-400 font-bold tracking-widest mb-12 uppercase text-xs">Eindscore van de zitting</p>

            <button 
              onClick={startGame}
              className="bg-[#1F2937] text-white px-12 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-black transition-all shadow-lg hover:-translate-y-1"
            >
              NIEUW PROCES STARTEN
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourtroomRush;