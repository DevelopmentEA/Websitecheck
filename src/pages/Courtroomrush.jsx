import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Clock, Shield, Zap, ChevronRight, Volume2, VolumeX, LogOut, Play } from 'lucide-react';
import { masterData } from '../data/masterData';

// --- HELPERS ---
const PixelBox = ({ children, className = "", variant = "white" }) => {
  const bg = variant === "white" ? "bg-[#f0f0f0]" : "bg-[#000000]";
  const border = variant === "white" ? "border-[#000000]" : "border-[#ffffff]";
  const shadow = variant === "white" 
    ? "shadow-[4px_4px_0px_0px_rgba(0,0,0,1),8px_8px_0px_0px_rgba(0,0,0,0.2)]" 
    : "shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]";
  
  return (
    <div className={`${bg} border-[4px] ${border} ${shadow} ${className} relative overflow-hidden`}>
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
      if (i > text.length) { 
        clearInterval(timer); 
        onDone(); 
      }
    }, 40); 
    return () => clearInterval(timer);
  }, [text, onDone]);
  
  return (
    <p className="font-['Press_Start_2P'] text-[12px] md:text-[14px] leading-relaxed text-black uppercase">
      {content}<span className="animate-block-cursor">█</span>
    </p>
  );
};

// --- MAIN COMPONENT ---
const CourtroomRush = () => {
  const { subjectSlug } = useParams();
  const navigate = useNavigate();
  const activeSubject = masterData[subjectSlug];
  const questionsDb = activeSubject?.db || {};
  const accentColor = activeSubject?.accent || "#6EE7B7";

  const [gameState, setGameState] = useState('start'); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(22);
  const [lastResult, setLastResult] = useState(null);
  const [introFinished, setIntroFinished] = useState(false);
  
  const [powerUps, setPowerUps] = useState({ freeze: 1, shield: 1, hint: 1 });
  const [isPaused, setIsPaused] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [hintActive, setHintActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  // --- AUDIO CLEANUP LOGIC ---
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset naar begin
      audioRef.current = null;
    }
  };

  // Stopt muziek bij verlaten van de pagina (unmount)
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
    if (audioRef.current) {
      if (audioRef.current.paused) audioRef.current.play();
      return;
    }
    const audio = new Audio('/courtroom.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    audio.play().catch(() => console.log("Audio interactie vereist"));
  };

  const startGamePool = () => {
    initAudio();
    const pool = [];
    Object.keys(questionsDb).forEach(w => {
      const qList = questionsDb[w]?.TF;
      if (qList) qList.forEach(q => pool.push({ statement: q.q, isCorrect: q.c === 0, basis: q.exp }));
    });
    if (!pool.length) return;
    setQuestions([...pool].sort(() => 0.5 - Math.random()).slice(0, 20));
    setGameState('intro'); 
    setLives(3); setScore(0); setCurrentIdx(0); setTimeLeft(22);
    setPowerUps({ freeze: 1, shield: 1, hint: 1 });
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

  const handleAnswer = (val) => {
    if (gameState !== 'playing') return;
    const q = questions[currentIdx];
    const ok = (val === q.isCorrect);
    setHintActive(false);

    if (ok && val !== null) {
      setScore(s => s + Math.ceil(timeLeft * 150));
      setLastResult('correct');
      confetti({ particleCount: 30, spread: 60, colors: [accentColor, '#ffffff'] });
    } else {
      if (shieldActive) { setShieldActive(false); setLastResult('shielded'); }
      else { setLives(l => l - 1); setLastResult('wrong'); }
    }
    setGameState('feedback');
  };

  // Scoreboard berekeningen
  const elbertScore = Math.floor(score * 0.7);
  const maartjeScore = Math.max(0, elbertScore - 1);

  if (!activeSubject) return <div className="h-screen bg-black text-white font-['Press_Start_2P'] flex items-center justify-center text-xs">ERROR: DOSSIER_NOT_FOUND</div>;

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden bg-[#050505]">
      
      <div className="absolute inset-0 z-40 pointer-events-none opacity-[0.08] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%]" />
      
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <img 
          src="/background.png" 
          className="w-full h-full object-cover opacity-30 blur-[1px]" 
          style={{ imageRendering: 'pixelated' }}
          alt="" 
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="fixed top-4 left-0 right-0 px-6 flex justify-between z-50">
        <button 
          onClick={handleExit}
          className="group flex items-center gap-2 px-3 py-2 bg-[#ff0044] border-[3px] border-black text-white font-['Press_Start_2P'] text-[9px] shadow-[3px_3px_0_0_#000] active:shadow-none active:translate-y-1 transition-all"
        >
          <LogOut size={12} /> EXIT
        </button>

        {gameState !== 'start' && (
          <button 
            onClick={toggleMute}
            className="p-2 bg-black border-[3px] border-white text-white shadow-[3px_3px_0_0_rgba(255,255,255,0.2)] active:shadow-none active:translate-y-1 transition-all"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-10 text-center">
            <h1 className="text-4xl md:text-7xl font-['Press_Start_2P'] mb-10 leading-tight text-white drop-shadow-[4px_4px_0_#469585]">
              {activeSubject.title}<br/><span className="text-yellow-400">RUSH</span>
            </h1>
            <button onClick={startGamePool} className="font-['Press_Start_2P'] bg-white border-[4px] border-black px-10 py-5 shadow-[6px_6px_0_0_#469585] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all uppercase text-md">Insert Coin</button>
          </motion.div>
        )}

        {gameState === 'intro' && (
          <motion.div key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-10 max-w-2xl w-full">
            <PixelBox className="p-10 space-y-8">
              <TypewriterText 
                text="Dossier geladen. Analyseer de feiten. Oordeel snel. 3 strikes en je bent uit. Gebruik je power-ups wijs. Ben je klaar voor de zitting?" 
                onDone={() => setIntroFinished(true)} 
              />
              {introFinished && (
                <motion.button 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setGameState('playing')}
                  className="w-full flex items-center justify-center gap-3 bg-[#00e676] border-[4px] border-black p-4 font-['Press_Start_2P'] text-sm shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:shadow-none transition-all"
                >
                  <Play size={20} fill="currentColor" /> START MISSION
                </motion.button>
              )}
            </PixelBox>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div key="p" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-3xl space-y-6">
            <div className="flex justify-between items-end bg-black/90 border-[4px] border-white p-5 text-white font-['Press_Start_2P']">
              <div className="w-40">
                <div className="text-[8px] mb-2 uppercase text-gray-400 tracking-tighter">Integrity</div>
                <div className="h-4 w-full bg-gray-900 border-2 border-white flex gap-1 p-0.5">
                  {[...Array(3)].map((_, i) => <div key={i} className={`h-full flex-1 transition-all ${i < lives ? 'bg-red-500 shadow-[0_0_8px_#ff0000]' : 'bg-transparent'}`} />)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[8px] text-[#6EE7B7] mb-1">SCORE</div>
                <div className="text-2xl">{score.toLocaleString()}</div>
              </div>
            </div>

            <PixelBox className="p-8 min-h-[220px] flex items-center justify-center text-center">
              {isPaused && <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center text-white font-['Press_Start_2P'] text-[10px] z-20 animate-pulse">TIME_FROZEN (15s)</div>}
              <h2 className="text-black text-lg md:text-xl font-sans font-bold leading-relaxed uppercase tracking-tight">"{questions[currentIdx]?.statement}"</h2>
            </PixelBox>

            <div className="h-4 w-full bg-black border-[3px] border-white overflow-hidden">
              <motion.div className="h-full" animate={{ width: `${(timeLeft / 22) * 100}%` }} style={{ backgroundColor: timeLeft < 6 ? '#ff0044' : accentColor }} />
            </div>

            <div className="grid grid-cols-2 gap-6 font-['Press_Start_2P']">
              <motion.button 
                animate={hintActive && questions[currentIdx]?.isCorrect === false ? { rotate: 360 } : {}}
                transition={hintActive ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
                onClick={() => handleAnswer(false)} 
                className="p-6 border-[4px] border-black bg-[#ff0044] text-white shadow-[5px_5px_0_0_#000] active:shadow-none active:translate-y-1 text-xs"
              >
                OBJECTION!
              </motion.button>
              
              <motion.button 
                animate={hintActive && questions[currentIdx]?.isCorrect === true ? { rotate: 360 } : {}}
                transition={hintActive ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
                onClick={() => handleAnswer(true)} 
                className="p-6 border-[4px] border-black bg-[#00e676] text-white shadow-[5px_5px_0_0_#000] active:shadow-none active:translate-y-1 text-xs"
              >
                PROCEED
              </motion.button>
            </div>

            <div className="flex justify-center gap-8">
              <PowerUpBtn icon={<Clock/>} label="Wait" count={powerUps.freeze} onClick={() => { if (powerUps.freeze > 0 && !isPaused) { setIsPaused(true); setPowerUps(p => ({...p, freeze: p.freeze - 1})); setTimeout(() => setIsPaused(false), 15000); } }} color="#3b82f6" active={isPaused} />
              <PowerUpBtn icon={<Shield/>} label="Safe" count={powerUps.shield} onClick={() => { if (powerUps.shield > 0) { setShieldActive(true); setPowerUps(p => ({...p, shield: p.shield - 1})); } }} color="#f59e0b" active={shieldActive} />
              <PowerUpBtn icon={<Zap/>} label="Tip" count={powerUps.hint} onClick={() => { if (powerUps.hint > 0) { setHintActive(true); setPowerUps(p => ({...p, hint: p.hint - 1})); } }} color="#8b5cf6" active={hintActive} />
            </div>
          </motion.div>
        )}

        {gameState === 'feedback' && (
          <motion.div key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-10 w-full max-w-xl">
            <PixelBox className="p-8 text-center space-y-6">
              <h3 className={`text-2xl font-['Press_Start_2P'] ${lastResult === 'correct' ? 'text-emerald-600' : 'text-red-600'}`}>{lastResult === 'correct' ? 'SUSTAINED!' : lastResult === 'shielded' ? 'SHIELDED!' : 'OVERRULED!'}</h3>
              <div className="bg-white/50 p-6 border-2 border-black/10">
                <p className="font-sans text-lg text-slate-800 italic leading-snug">"{questions[currentIdx]?.basis}"</p>
              </div>
              <button onClick={() => { if (lives <= 0 || currentIdx >= questions.length - 1) setGameState('result'); else { setCurrentIdx(c => c + 1); setTimeLeft(22); setGameState('playing'); } }} className="w-full bg-black text-white p-4 font-['Press_Start_2P'] text-[10px] flex items-center justify-center gap-2 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]">NEXT CASE <ChevronRight size={16}/></button>
            </PixelBox>
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div key="r" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="z-10 w-full max-w-xl font-['Press_Start_2P']">
            <PixelBox variant="black" className="p-10 space-y-8 !bg-black border-[#333]">
              <h2 className="text-center text-red-600 text-3xl animate-pulse tracking-tighter">GAME OVER</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-[8px] text-gray-600 border-b-2 border-gray-900 pb-2">
                  <span>RANK</span><span>NAME</span><span>SCORE</span>
                </div>
                <div className="flex justify-between text-yellow-500 text-sm">
                  <span>1ST</span><span>BOBBY</span><span>999.999</span>
                </div>
                <motion.div animate={{ opacity: [1, 0.5, 1] }} className="flex justify-between text-[#6EE7B7] text-sm">
                  <span>2ND</span><span>YOU</span><span>{score.toLocaleString()}</span>
                </motion.div>
                <div className="flex justify-between text-white/50 text-sm">
                  <span>3RD</span><span>ELBERT</span><span>{elbertScore.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/30 text-sm">
                  <span>4TH</span><span>MAARTJE</span><span>{maartjeScore.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-900/40 text-sm">
                  <span>5TH</span><span>TIM</span><span>0</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <button onClick={startGamePool} className="bg-[#00e676] text-black p-4 text-[10px] border-[4px] border-white shadow-[4px_4px_0_0_#fff] active:shadow-none transition-all uppercase">Try Again</button>
                <button onClick={handleExit} className="bg-white text-black p-4 text-[10px] border-[4px] border-black shadow-[4px_4px_0_0_#000] active:shadow-none transition-all uppercase">Exit to Menu</button>
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
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <span className="text-[7px] text-white font-['Press_Start_2P']">{label} x{count}</span>
  </button>
);

export default CourtroomRush;