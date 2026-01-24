import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Clock, Shield, Zap, ChevronRight, Volume2, VolumeX, LogOut, Play, Gavel, Trophy } from 'lucide-react';

// --- HELPERS ---
const Heart8Bit = ({ filled }) => (
  <svg width="32" height="32" viewBox="0 0 8 8" className={`${filled ? 'fill-red-500' : 'fill-transparent stroke-gray-600'} transition-colors duration-300`}>
    <path d="M2 1h1v1h1V1h1v1h1v1H6v1H5v1H4v1H3V5H2V4H1V3h1V2h1V1z" />
    {!filled && <path d="M2 1h1v1h1V1h1v1h1v1H6v1H5v1H4v1H3V5H2V4H1V3h1V2h1V1z" fill="none" strokeWidth="0.5" />}
  </svg>
);

const PixelBox = ({ children, className = "", variant = "white" }) => {
  const bg = variant === "white" ? "bg-[#f0f0f0]" : "bg-[#000000]";
  const border = variant === "white" ? "border-black" : "border-white";
  return (
    <div className={`${bg} border-[4px] ${border} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${className} relative overflow-hidden`}>
      {children}
    </div>
  );
};

const TypewriterText = ({ text, onDone }) => {
  const [content, setContent] = useState("");
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setContent(text.slice(0, i)); i++;
      if (i > text.length) { clearInterval(timer); onDone(); }
    }, 30); 
    return () => clearInterval(timer);
  }, [text, onDone]);
  return (
    <p className="font-['Press_Start_2P'] text-[12px] md:text-[14px] leading-relaxed text-black uppercase">
      {content}<span className="animate-pulse">█</span>
    </p>
  );
};

// --- MAIN COMPONENT ---
const CourtroomRush = () => {
  const { subjectSlug } = useParams();
  const navigate = useNavigate();
  const { db, config } = useOutletContext();

  const activeSubject = config;
  const questionsDb = db || {};
  const accentColor = config?.accent || "#6EE7B7";

  // Game States
  const [gameState, setGameState] = useState('start'); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(22);
  const [lastResult, setLastResult] = useState(null);
  const [introFinished, setIntroFinished] = useState(false);
  const [combo, setCombo] = useState(0);
  
  // Power-ups
  const [powerUps, setPowerUps] = useState({ freeze: 1, shield: 1, hint: 1 });
  const [isPaused, setIsPaused] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [hintActive, setHintActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  const handleExit = () => {
    stopAudio();
    navigate(`/course/${subjectSlug}`);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const initAudio = () => {
    if (audioRef.current) return;
    const audio = new Audio('/courtroom.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    audio.play().catch(() => console.log("Audio interactie vereist"));
  };

  const startGamePool = () => {
    initAudio();
    const pool = [];
    Object.keys(questionsDb).forEach(weekKey => {
      const weekData = questionsDb[weekKey];
      const qList = weekData?.TrueFalse; 
      if (qList && Array.isArray(qList)) {
        qList.forEach(q => {
          pool.push({
            statement: q.q,
            isCorrect: q.c === 0, 
            basis: q.exp
          });
        });
      }
    });

    if (pool.length === 0) return;

    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 20);
    setQuestions(shuffled);
    setScore(0);
    setLives(3);
    setCombo(0);
    setCurrentIdx(0);
    setTimeLeft(22);
    setPowerUps({ freeze: 1, shield: 1, hint: 1 });
    setGameState('intro'); 
  };

  const handleAnswer = (val) => {
    if (gameState !== 'playing') return;
    const q = questions[currentIdx];
    const ok = (val === q.isCorrect);
    setHintActive(false);

    if (ok && val !== null) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      const points = 100 + Math.ceil((timeLeft / 22) * 900);
      setScore(s => s + points);
      setLastResult('correct');
      confetti({ particleCount: 30, spread: 60, colors: [accentColor, '#ffffff'] });
    } else {
      setCombo(0);
      if (shieldActive) { 
        setShieldActive(false); 
        setLastResult('shielded'); 
      } else { 
        setLives(l => l - 1); 
        setLastResult('wrong'); 
      }
    }
    setGameState('feedback');
  };

  useEffect(() => {
    let t;
    if (gameState === 'playing' && timeLeft > 0 && !isPaused) {
      t = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 0.1)), 100);
    } else if (timeLeft <= 0 && gameState === 'playing') {
      handleAnswer(null);
    }
    return () => clearInterval(t);
  }, [gameState, timeLeft, isPaused]);

  // Scoreboard berekeningen
  const elbertScore = Math.max(0, score - 250);
  const maartjeScore = Math.max(0, elbertScore - 1);

  if (!activeSubject) return <div className="arcade-mode flex items-center justify-center font-['Press_Start_2P']">ERROR: NO_CONFIG</div>;

  return (
    <div className="arcade-mode z-[999] fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <img src="/background.png" className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} alt="" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* Global UI */}
      <div className="fixed top-6 left-6 right-6 flex justify-between z-[1000]">
        <button onClick={handleExit} className="bg-[#ff0044] border-[3px] border-white text-white px-4 py-2 font-['Press_Start_2P'] text-[10px] shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2">
          <LogOut size={14} /> EXIT
        </button>
        {gameState !== 'start' && (
          <button onClick={toggleMute} className="bg-black border-[3px] border-white text-white p-2">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 flex flex-col items-center">
            <Gavel className="text-white mb-6 animate-bounce" size={64} />
            <h1 className="text-4xl md:text-6xl font-['Press_Start_2P'] text-white text-center leading-tight mb-12 drop-shadow-[0_6px_0_#469585]">
              {activeSubject.title}<br/>
              <span className="text-yellow-400 text-2xl mt-4 block tracking-widest animate-pulse">RUSH MODE</span>
            </h1>
            <button onClick={startGamePool} className="bg-white border-[6px] border-black p-10 shadow-[12px_12px_0_0_#469585] hover:scale-105 active:scale-95 transition-all group">
              <span className="font-['Press_Start_2P'] text-black text-2xl block animate-pulse">INSERT COIN</span>
            </button>
          </motion.div>
        )}

        {gameState === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="z-10 max-w-2xl w-full px-6">
            <PixelBox className="p-10 space-y-8">
              <TypewriterText text="Dossier geladen. Analyseer de feiten. Oordeel snel. 3 hartjes en de zitting wordt gesloten. Gebruik je power-ups om te overleven. Ben je klaar?" onDone={() => setIntroFinished(true)} />
              {introFinished && (
                <button onClick={() => setGameState('playing')} className="w-full bg-[#00e676] border-[4px] border-black p-5 font-['Press_Start_2P'] text-black text-sm shadow-[4px_4px_0_0_#000] hover:bg-white transition-all flex items-center justify-center gap-4">
                  <Play fill="currentColor" size={20} /> START ZITTING
                </button>
              )}
            </PixelBox>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div key="play" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-3xl px-4 space-y-6">
            <div className="flex justify-between items-center bg-black/90 border-[4px] border-white p-5 font-['Press_Start_2P'] text-white">
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <Heart8Bit key={i} filled={i < lives} />
                ))}
              </div>
              <div className="text-right relative">
                <p className="text-[10px] text-[#6EE7B7] mb-1">SCORE</p>
                <p className="text-2xl">{score.toLocaleString()}</p>
                {/* COMBO MULTIPLIER */}
                <AnimatePresence>
                  {combo >= 2 && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0, x: 20 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -bottom-6 right-0 text-yellow-400 font-bold text-[12px] italic tracking-tighter"
                    >
                      {combo}x COMBO!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <PixelBox className="p-10 min-h-[250px] flex items-center justify-center text-center relative">
               {isPaused && <div className="absolute inset-0 bg-blue-600/30 backdrop-blur-sm flex items-center justify-center z-20 font-['Press_Start_2P'] text-white animate-pulse">TIME FROZEN</div>}
               <h2 className="text-black text-2xl md:text-3xl font-sans font-bold leading-tight">
                 "{questions[currentIdx]?.statement}"
               </h2>
            </PixelBox>

            <div className="h-6 w-full bg-black border-[4px] border-white p-1">
              <motion.div className="h-full" animate={{ width: `${(timeLeft / 22) * 100}%` }} transition={{ duration: 0.1 }} style={{ backgroundColor: timeLeft < 6 ? '#ff0044' : accentColor }} />
            </div>

            <div className="grid grid-cols-2 gap-6 font-['Press_Start_2P']">
              <motion.button 
                onClick={() => handleAnswer(false)} 
                animate={hintActive && questions[currentIdx]?.isCorrect === false ? { x: [-3, 3, -3, 3, 0] } : {}}
                transition={hintActive ? { repeat: Infinity, duration: 0.2 } : {}}
                className="bg-[#ff0044] border-[4px] border-black p-6 text-white text-[10px] shadow-[6px_6px_0_0_#000] active:translate-y-1 active:shadow-none"
              >
                OBJECTION!
              </motion.button>
              
              <motion.button 
                onClick={() => handleAnswer(true)} 
                animate={hintActive && questions[currentIdx]?.isCorrect === true ? { x: [-3, 3, -3, 3, 0] } : {}}
                transition={hintActive ? { repeat: Infinity, duration: 0.2 } : {}}
                className="bg-[#00e676] border-[4px] border-black p-6 text-white text-[10px] shadow-[6px_6px_0_0_#000] active:translate-y-1 active:shadow-none"
              >
                PROCEED
              </motion.button>
            </div>

            <div className="flex justify-center gap-8 pt-4">
               <PowerUpBtn icon={<Clock/>} label="Wait" count={powerUps.freeze} onClick={() => { if (powerUps.freeze > 0 && !isPaused) { setIsPaused(true); setPowerUps(p => ({...p, freeze: p.freeze - 1})); setTimeout(() => setIsPaused(false), 15000); } }} color="#3b82f6" active={isPaused} />
               <PowerUpBtn icon={<Shield/>} label="Safe" count={powerUps.shield} onClick={() => { if (powerUps.shield > 0) { setShieldActive(true); setPowerUps(p => ({...p, shield: p.shield - 1})); } }} color="#f59e0b" active={shieldActive} />
               <PowerUpBtn icon={<Zap/>} label="Tip" count={powerUps.hint} onClick={() => { if (powerUps.hint > 0) { setHintActive(true); setPowerUps(p => ({...p, hint: p.hint - 1})); } }} color="#8b5cf6" active={hintActive} />
            </div>
          </motion.div>
        )}

        {gameState === 'feedback' && (
          <motion.div key="feedback" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="z-10 w-full max-w-xl px-4">
            <PixelBox className="p-8 text-center space-y-6">
              <h3 className={`text-3xl font-['Press_Start_2P'] ${lastResult === 'correct' ? 'text-emerald-600' : 'text-red-600'}`}>
                {lastResult === 'correct' ? 'SUSTAINED!' : lastResult === 'shielded' ? 'SHIELDED!' : 'OVERRULED!'}
              </h3>
              <div className="bg-white/80 p-6 border-[3px] border-black/10 italic text-lg text-slate-800 leading-snug">
                "{questions[currentIdx]?.basis}"
              </div>
              <button onClick={() => { if (lives <= 0 || currentIdx >= questions.length - 1) setGameState('result'); else { setCurrentIdx(c => c + 1); setTimeLeft(22); setGameState('playing'); } }} className="w-full bg-black text-white p-5 font-['Press_Start_2P'] text-[10px] flex items-center justify-center gap-3 shadow-[4px_4px_0_0_#444]">
                VOLGENDE ZAAK <ChevronRight size={18} />
              </button>
            </PixelBox>
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-10 w-full max-w-xl px-4">
            <PixelBox variant="black" className="p-10 space-y-8 !bg-black border-white/20 font-['Press_Start_2P']">
              <div className="space-y-2">
                <h2 className="text-center text-red-500 text-4xl uppercase tracking-tighter">Game Over</h2>
                <p className="text-center text-white/40 text-[8px]">SESSION TERMINATED</p>
              </div>
              
              <div className="bg-white/5 border-[4px] border-white/10 p-6 space-y-4">
                <div className="flex items-center gap-3 text-yellow-400 text-[12px] border-b border-white/20 pb-4 justify-center">
                  <Trophy size={20} /> <span className="tracking-widest">HALL OF FAME</span>
                </div>
                
                <div className="space-y-4 text-[11px] pt-2">
                  <div className="flex justify-between items-center text-yellow-400">
                    <span className="flex gap-4"><span>1ST</span> <span>BOBBY</span></span>
                    <span>999.999</span>
                  </div>
                  
                  <motion.div 
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.15, ease: "linear" }}
                    className="flex justify-between items-center text-[#6EE7B7] bg-white/10 p-2 -mx-2"
                  >
                    <span className="flex gap-4"><span>2ND</span> <span>YOU</span></span>
                    <span>{score.toLocaleString()}</span>
                  </motion.div>

                  <div className="flex justify-between items-center text-white/80">
                    <span className="flex gap-4"><span>3RD</span> <span>ELBERT</span></span>
                    <span>{elbertScore.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-white/80">
                    <span className="flex gap-4"><span>4TH</span> <span>MAARTJE</span></span>
                    <span>{maartjeScore.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-600">
                    <span className="flex gap-4"><span>5TH</span> <span>TIM</span></span>
                    <span>000.000</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <button onClick={startGamePool} className="bg-[#00e676] text-black p-5 text-[12px] border-[4px] border-white shadow-[6px_6px_0_0_#fff] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase">Try Again</button>
                <button onClick={handleExit} className="bg-white text-black p-5 text-[12px] border-[4px] border-black shadow-[6px_6px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase">Exit to Menu</button>
              </div>
            </PixelBox>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PowerUpBtn = ({ icon, label, count, onClick, color, active }) => (
  <button onClick={onClick} disabled={count === 0} className={`flex flex-col items-center gap-2 transition-all ${count === 0 ? 'opacity-20 grayscale' : 'hover:-translate-y-1'}`}>
    <div className={`p-3 border-[3px] shadow-[3px_3px_0_0_rgba(0,0,0,0.5)] ${active ? 'bg-white text-black animate-bounce' : 'bg-black text-white'}`} style={{ borderColor: count > 0 && !active ? color : 'white' }}>
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <span className="text-[7px] text-white font-['Press_Start_2P']">{label} x{count}</span>
  </button>
);

export default CourtroomRush;