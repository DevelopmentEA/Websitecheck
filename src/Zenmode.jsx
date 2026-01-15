import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const Zenmode = ({ isActive, onClose }) => {
  const [phase, setPhase] = useState('intro'); 
  const [count, setCount] = useState(10);
  const [isMuted, setIsMuted] = useState(false);
  const [breathText, setBreathText] = useState('Adem in');
  
  // Verwijzing naar het bestand in de /public map
  const audioRef = useRef(new Audio("/audiozen.mp3"));

  // Achtergrond vierkanten data
  const squares = useRef([...Array(14)].map((_, i) => ({
    id: i,
    size: Math.random() * 40 + 20,
    top: `${Math.random() * 100}%`,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 10,
  })));

  // --- AUDIO BEHEER ---
  useEffect(() => {
    const audio = audioRef.current;
    
    if (isActive) {
      audio.loop = true;
      audio.volume = isMuted ? 0 : 0.3;
      
      // Alleen afspelen als we niet in de 'go' fase zitten
      if (phase !== 'go') {
        audio.play().catch(() => {
          console.log("Audio interactie vereist door browser");
        });
      }
    } else {
      // Harde reset bij sluiten
      audio.pause();
      audio.currentTime = 0;
      setPhase('intro');
      setCount(10);
    }

    return () => audio.pause();
  }, [isActive, isMuted]);

  // --- FASE LOGICA & VOLUME DYNAMIEK ---
  useEffect(() => {
    if (!isActive) return;
    const audio = audioRef.current;

    if (phase === 'intro') {
      setTimeout(() => setPhase('breathing'), 3000);
    } 
    else if (phase === 'breathing') {
      const textInterval = setInterval(() => {
        setBreathText(prev => prev === 'Adem in' ? 'Adem uit' : 'Adem in');
      }, 4000);
      
      const phaseTimeout = setTimeout(() => {
        clearInterval(textInterval);
        setPhase('countdown');
      }, 16000);
      
      return () => { clearInterval(textInterval); clearTimeout(phaseTimeout); };
    } 
    else if (phase === 'countdown') {
      // SPANNING OPBOUWEN: Volume gaat langzaam van 0.3 naar 0.7
      if (!isMuted) {
        const volumeStep = 0.3 + ((10 - count) * 0.04);
        audio.volume = Math.min(volumeStep, 0.7);
      }

      if (count > 0) {
        const timer = setInterval(() => setCount(prev => prev - 1), 1500); 
        return () => clearInterval(timer);
      } else {
        setPhase('go');
      }
    } 
    else if (phase === 'go') {
      // DE "SNAP": Audio stopt direct voor een fysieke ontlading bij de flits
      audio.pause();
      setTimeout(() => onClose(), 2500);
    }
  }, [isActive, phase, count, onClose, isMuted]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 w-screen h-screen bg-black z-[9999] flex items-center justify-center overflow-hidden"
        >
          {/* 1. DE WITTE FLITS */}
          <AnimatePresence>
            {phase === 'go' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-white z-[100] flex items-center justify-center"
              >
                <motion.h1 
                  initial={{ scale: 0.8, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  className="text-black font-black text-[10vw] italic"
                >
                  NU.
                </motion.h1>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2. ACHTERGROND LAAG */}
          <div className={`absolute inset-0 transition-opacity duration-1000 ${phase === 'go' ? 'opacity-0' : 'opacity-100'}`}>
            {/* KINETISCHE VIERKANTEN */}
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
              {squares.current.map((sq) => (
                <motion.div
                  key={sq.id}
                  className="absolute border border-white/20"
                  style={{ width: sq.size, height: sq.size, top: sq.top, left: '-10%' }}
                  animate={{ 
                    x: ['0vw', '110vw'],
                    rotate: 360,
                    opacity: [0, 0.15, 0.15, 0] 
                  }}
                  transition={{ duration: sq.duration, repeat: Infinity, delay: sq.delay, ease: "linear" }}
                >
                  <div className="absolute inset-1 border border-white/5 opacity-30" />
                </motion.div>
              ))}
            </div>

            {/* HERZ GOLVEN & GRID */}
            <div className="absolute inset-0 z-20 opacity-30 pointer-events-none">
              <svg width="100%" height="100%">
                {[...Array(12)].map((_, i) => (
                  <motion.line
                    key={`herz-${i}`}
                    x1="-10%" y1={`${10 + i * 8}%`} x2="110%" y2={`${10 + i * 8}%`}
                    stroke="white" strokeWidth="0.3"
                    strokeDasharray={i % 2 === 0 ? "5, 20" : "1, 10"}
                    animate={{ strokeDashoffset: [0, i % 2 === 0 ? -300 : 300] }}
                    transition={{ duration: 5 + i, repeat: Infinity, ease: "linear" }}
                  />
                ))}
              </svg>
            </div>

            {/* VIGNETTE */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_40%,_rgba(0,0,0,1)_100%)] z-40 pointer-events-none" />
          </div>

          {/* 3. CENTRALE CONTENT */}
          <div className="relative z-50 text-center">
            <AnimatePresence mode="wait">
              {phase === 'intro' && (
                <motion.p key="intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.7, y: 0 }} exit={{ opacity: 0 }} className="text-white font-light text-xl tracking-[1.2em] uppercase">
                  Brain Calibration
                </motion.p>
              )}

              {phase === 'breathing' && (
                <motion.div key="breathing" className="flex flex-col items-center gap-16">
                  <motion.div 
                    animate={{ 
                        scale: [1, 1.4, 1], 
                        borderColor: ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.7)", "rgba(255,255,255,0.1)"]
                    }}
                    transition={{ duration: 8, repeat: 1, ease: "easeInOut" }}
                    className="w-40 h-40 rounded-full border flex items-center justify-center backdrop-blur-sm"
                  >
                    <motion.div 
                        animate={{ opacity: [0.2, 1, 0.2] }} 
                        transition={{ duration: 4, repeat: 3 }}
                        className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]" 
                    />
                  </motion.div>
                  <motion.p key={breathText} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/80 text-[10px] font-black tracking-[0.8em] uppercase">
                    {breathText}
                  </motion.p>
                </motion.div>
              )}

              {phase === 'countdown' && (
                <motion.div key={count} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }}>
                  <span className="text-white font-black text-[15rem] tabular-nums leading-none tracking-tighter">
                    {count}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 4. CONTROLS */}
          {phase !== 'go' && (
            <div className="absolute bottom-10 right-10 flex items-center gap-8 z-[60] opacity-30 hover:opacity-100 transition-opacity">
               <button onClick={() => setIsMuted(!isMuted)} className="text-white p-2">
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
               </button>
               <button onClick={onClose} className="text-white text-[9px] font-black tracking-[0.4em] uppercase opacity-50 hover:opacity-100">
                Overslaan
               </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Zenmode;