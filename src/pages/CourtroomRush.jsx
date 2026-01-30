import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Clock, Shield, Zap, ChevronRight, Volume2, VolumeX, LogOut, Play, Gavel, Trophy } from 'lucide-react';

// --- HELPERS ---
const Heart8Bit = ({ filled }) => (
  <svg width="28" height="28" viewBox="0 0 8 8" className={`${filled ? 'fill-red-500' : 'fill-transparent stroke-gray-600'} transition-colors duration-300`}>
    <path d="M2 1h1v1h1V1h1v1h1v1H6v1H5v1H4v1H3V5H2V4H1V3h1V2h1V1z" />
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

const TypewriterText = ({ text, onDone, speed = 40, className = "" }) => {
  const [content, setContent] = useState("");
  const timerRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    // Reset status bij nieuwe tekst
    setContent("");
    indexRef.current = 0;
    
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      indexRef.current += 1;
      const currentText = text.slice(0, indexRef.current);
      setContent(currentText);

      if (indexRef.current >= text.length) {
        clearInterval(timerRef.current);
        if (onDone) setTimeout(onDone, 1000); // Korte pauze na voltooien
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed]); // Alleen herstarten als text of speed verandert

  return (
    <p className={className}>
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
    audio.play().catch(() => console.log("Audio interaction required"));
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
    setIntroFinished(false);
    setGameState('splash'); // Eerst de licentie-intro
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

  // Scoreboard benchmarks
  const elbertScore = Math.max(0, score - 250);
  const maartjeScore = Math.max(0, elbertScore - 1);

  if (!activeSubject) return <div className="arcade-mode flex items-center justify-center font-['Press_Start_2P']">ERROR: NO_CONFIG</div>;

  return (
    <div className="arcade-mode z-[999] fixed inset-0 flex items-center justify-center bg-black overflow-hidden select-none">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 opacity-50">
        <img src="/background.png" className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} alt="" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* Persistent UI Controls */}
      <div className="fixed top-6 left-6 right-6 flex justify-between z-[1000]">
        <button onClick={handleExit} className="bg-[#ff0044] border-[3px] border-white text-white px-4 py-2 font-sans font-black text-[12px] shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none uppercase">
          <LogOut size={14} className="inline mr-2" /> EXIT
        </button>
        {gameState !== 'start' && gameState !== 'splash' && (
          <button onClick={toggleMute} className="bg-black border-[3px] border-white text-white p-2">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 flex flex-col items-center w-full">
            <Gavel className="text-white mb-8 animate-bounce" size={80} />
            
            <h1 className="text-center mb-12 px-6">
              <span className="block text-2xl md:text-5xl font-['Press_Start_2P'] text-white leading-tight drop-shadow-[0_6px_0_#469585] uppercase">
                {activeSubject.title}
              </span>
              <span className="block text-yellow-400 font-['Press_Start_2P'] text-lg md:text-2xl mt-4 tracking-[0.2em] animate-pulse uppercase">
                THE VIDEOGAME
              </span>
            </h1>

            <button onClick={startGamePool} className="bg-white border-[6px] border-black p-10 shadow-[12px_12px_0_0_#469585] hover:scale-105 active:scale-95 transition-all mb-16">
              <span className="font-['Press_Start_2P'] text-black text-2xl block uppercase">INSERT COIN</span>
            </button>

            <div className="mt-8 flex flex-col items-center gap-2">
              <p className="font-['Press_Start_2P'] text-[8px] text-white/30 uppercase">© 2026 LAWBOOKS ENTERTAINMENT SYSTEM</p>
            </div>
          </motion.div>
        )}

        {gameState === 'splash' && (
          <motion.div key="splash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-20 fixed inset-0 bg-black flex flex-col items-center justify-center p-10">
            <div className="border-2 border-white/40 px-8 py-4">
              <TypewriterText 
                text="LICENSED BY LAWBOOKS" 
                className="font-['Press_Start_2P'] text-[14px] md:text-xl text-yellow-400 tracking-[0.2em] uppercase text-center"
                speed={80}
                onDone={() => setGameState('intro')}
              />
            </div>
          </motion.div>
        )}

        {gameState === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="z-10 max-w-2xl w-full px-6">
            <PixelBox className="p-10 space-y-8">
              <TypewriterText 
                text="Dossier geladen. Analyseer de feiten. Oordeel snel. Bij 3 hartjes verlies wordt de zitting gesloten. Gebruik je power-ups verstandig. Ben je klaar voor de Rush?" 
                onDone={() => setIntroFinished(true)} 
                className="font-sans font-black text-[18px] md:text-[20px] leading-relaxed text-black uppercase tracking-tight"
              />
              {introFinished && (
                <button onClick={() => setGameState('playing')} className="w-full bg-[#00e676] border-[4px] border-black p-5 font-sans font-black text-2xl text-black shadow-[4px_4px_0_0_#000] hover:bg-white transition-all flex items-center justify-center gap-4 uppercase">
                  <Play fill="currentColor" size={24} /> START ZITTING
                </button>
              )}
            </PixelBox>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div key="play" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-3xl px-4 space-y-6">
            <div className="flex justify-between items-center bg-black/90 border-[4px] border-white p-5">
              <div className="flex items-center gap-6">
                 <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <Heart8Bit key={i} filled={i < lives} />
                    ))}
                 </div>
                 <div className="hidden md:flex gap-4 border-l border-white/30 pl-6">
                    <div className={`flex items-center gap-2 ${powerUps.freeze > 0 ? 'text-blue-400' : 'text-white/20'}`}><Clock size={18}/> <span className="text-xs font-['Press_Start_2P']">{powerUps.freeze}</span></div>
                    <div className={`flex items-center gap-2 ${powerUps.shield > 0 ? 'text-orange-400' : 'text-white/20'}`}><Shield size={18}/> <span className="text-xs font-['Press_Start_2P']">{powerUps.shield}</span></div>
                    <div className={`flex items-center gap-2 ${powerUps.hint > 0 ? 'text-purple-400' : 'text-white/20'}`}><Zap size={18}/> <span className="text-xs font-['Press_Start_2P']">{powerUps.hint}</span></div>
                 </div>
              </div>
              
              <div className="text-right relative">
                <p className="text-[10px] text-[#6EE7B7] mb-1 font-['Press_Start_2P'] uppercase">SCORE</p>
                <p className="text-2xl font-['Press_Start_2P'] text-white">{score.toLocaleString()}</p>
                <AnimatePresence>
                  {combo >= 2 && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -bottom-6 right-0 text-yellow-400 font-black italic text-sm">
                      {combo}x COMBO!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <PixelBox className="p-10 min-h-[250px] flex items-center justify-center text-center relative">
               {isPaused && <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-md flex items-center justify-center z-20 font-sans font-black text-3xl text-white animate-pulse uppercase tracking-widest">TIJD BEVROREN</div>}
               <h2 className="text-black text-2xl md:text-3xl font-sans font-black leading-tight uppercase tracking-tight">
                 "{questions[currentIdx]?.statement}"
               </h2>
            </PixelBox>

            <div className="h-6 w-full bg-black border-[4px] border-white p-1">
              <motion.div className="h-full" animate={{ width: `${(timeLeft / 22) * 100}%` }} transition={{ duration: 0.1 }} style={{ backgroundColor: timeLeft < 6 ? '#ff0044' : accentColor }} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <button 
                onClick={() => handleAnswer(false)} 
                className={`bg-[#ff0044] border-[4px] border-black p-6 text-white text-2xl font-sans font-black shadow-[6px_6px_0_0_#000] active:translate-y-1 active:shadow-none uppercase tracking-widest ${hintActive && questions[currentIdx]?.isCorrect === false ? 'ring-8 ring-white animate-pulse' : ''}`}
              >
                Objection!
              </button>
              
              <button 
                onClick={() => handleAnswer(true)} 
                className={`bg-[#00e676] border-[4px] border-black p-6 text-white text-2xl font-sans font-black shadow-[6px_6px_0_0_#000] active:translate-y-1 active:shadow-none uppercase tracking-widest ${hintActive && questions[currentIdx]?.isCorrect === true ? 'ring-8 ring-white animate-pulse' : ''}`}
              >
                Proceed
              </button>
            </div>

            <div className="flex justify-center gap-10 pt-4">
               <PowerUpBtn icon={<Clock/>} label="Wait" count={powerUps.freeze} onClick={() => { if (powerUps.freeze > 0 && !isPaused) { setIsPaused(true); setPowerUps(p => ({...p, freeze: p.freeze - 1})); setTimeout(() => setIsPaused(false), 15000); } }} color="#3b82f6" active={isPaused} />
               <PowerUpBtn icon={<Shield/>} label="Safe" count={powerUps.shield} onClick={() => { if (powerUps.shield > 0) { setShieldActive(true); setPowerUps(p => ({...p, shield: p.shield - 1})); } }} color="#f59e0b" active={shieldActive} />
               <PowerUpBtn icon={<Zap/>} label="Tip" count={powerUps.hint} onClick={() => { if (powerUps.hint > 0) { setHintActive(true); setPowerUps(p => ({...p, hint: p.hint - 1})); } }} color="#8b5cf6" active={hintActive} />
            </div>
          </motion.div>
        )}

        {gameState === 'feedback' && (
          <motion.div key="feedback" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="z-10 w-full max-w-xl px-4">
            <PixelBox className="p-8 text-center space-y-6">
              <h3 className={`text-4xl font-sans font-black uppercase ${lastResult === 'correct' ? 'text-emerald-600' : 'text-red-600'}`}>
                {lastResult === 'correct' ? 'SUSTAINED!' : lastResult === 'shielded' ? 'SHIELDED!' : 'OVERRULED!'}
              </h3>
              <div className="bg-white/90 p-6 border-[3px] border-black/10 text-xl font-sans font-bold text-slate-800 leading-snug uppercase">
                "{questions[currentIdx]?.basis}"
              </div>
              <button onClick={() => { if (lives <= 0 || currentIdx >= questions.length - 1) setGameState('result'); else { setCurrentIdx(c => c + 1); setTimeLeft(22); setGameState('playing'); } }} className="w-full bg-black text-white p-6 font-sans font-black text-xl flex items-center justify-center gap-3 shadow-[4px_4px_0_0_#444] uppercase">
                VOLGENDE ZAAK <ChevronRight size={28} />
              </button>
            </PixelBox>
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-10 w-full max-w-xl px-4">
            <PixelBox variant="black" className="p-10 space-y-8 !bg-black border-white/20">
              <div className="space-y-2">
                <h2 className="text-center text-red-500 text-4xl font-['Press_Start_2P'] uppercase">Game Over</h2>
                <p className="text-center text-white/40 text-[10px] font-['Press_Start_2P'] uppercase">Session Terminated</p>
              </div>
              
              <div className="bg-white/5 border-[4px] border-white/10 p-6 space-y-4 font-['Press_Start_2P']">
                <div className="flex items-center gap-3 text-yellow-400 text-[12px] border-b border-white/20 pb-4 justify-center">
                  <Trophy size={20} /> <span className="uppercase">Hall of Fame</span>
                </div>
                
                <div className="space-y-4 text-[11px] pt-2">
                  <div className="flex justify-between items-center text-yellow-400">
                    <span className="flex gap-4"><span>1ST</span> <span>BOBBY</span></span>
                    <span>38.031</span>
                  </div>
                  
                  <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} className="flex justify-between items-center text-[#6EE7B7] bg-white/10 p-2 -mx-2 uppercase">
                    <span className="flex gap-4"><span>2ND</span> <span>YOU</span></span>
                    <span>{score.toLocaleString()}</span>
                  </motion.div>

                  <div className="flex justify-between items-center text-white/80 uppercase">
                    <span className="flex gap-4"><span>3RD</span> <span>ELBERT</span></span>
                    <span>{elbertScore.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-white/80 uppercase">
                    <span className="flex gap-4"><span>4TH</span> <span>MAARTJE</span></span>
                    <span>{maartjeScore.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-600 uppercase">
                    <span className="flex gap-4"><span>5TH</span> <span>BOB</span></span>
                    <span>000.000</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4 font-sans font-black uppercase">
                <button onClick={startGamePool} className="bg-[#00e676] text-black p-5 text-xl border-[4px] border-white shadow-[6px_6px_0_0_#fff] active:translate-x-1 active:translate-y-1 active:shadow-none">RETRY SESSION</button>
                <button onClick={handleExit} className="bg-white text-black p-5 text-xl border-[4px] border-black shadow-[6px_6px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none">EXIT TO MENU</button>
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
    <div className={`p-4 border-[3px] shadow-[3px_3px_0_0_rgba(0,0,0,0.5)] ${active ? 'bg-white text-black animate-bounce' : 'bg-black text-white'}`} style={{ borderColor: count > 0 && !active ? color : 'white' }}>
      {React.cloneElement(icon, { size: 22 })}
    </div>
    <span className="text-[10px] text-white font-sans font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default CourtroomRush;