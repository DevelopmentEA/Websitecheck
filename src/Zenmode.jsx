import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const Zenmode = ({ isActive, onClose }) => {
  const [phase, setPhase] = useState('intro');
  const [count, setCount] = useState(10);
  const [isMuted, setIsMuted] = useState(false);
  const [breathText, setBreathText] = useState('Adem in');
  
  const audioRef = useRef(new Audio("/audiozen.mp3"));

  // --- UITGEBREIDE VISUELE DATA ---
  const squares = useRef([...Array(30)].map((_, i) => ({
    id: i,
    size: Math.random() * 30 + 10,
    top: `${Math.random() * 100}%`,
    duration: Math.random() * 20 + 30,
    delay: Math.random() * -20,
  })));

  const dust = useRef([...Array(80)].map((_, i) => ({ // Meer stofdeeltjes
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1, // Iets groter
    duration: Math.random() * 15 + 15,
  })));

  // Nieuw effect: Diagonale lichtstrepen
  const lightStreaks = useRef([...Array(5)].map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
  })));

  // --- AUDIO BEHEER ---
  useEffect(() => {
    const audio = audioRef.current;
    if (isActive) {
      audio.loop = true;
      audio.volume = isMuted ? 0 : 0.3;
      if (phase !== 'go') {
        audio.play().catch(() => console.log("Audio interactie vereist"));
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
      setPhase('intro');
      setCount(10);
      setBreathText('Adem in');
    }
    return () => audio.pause();
  }, [isActive, isMuted]);

  // --- FASE LOGICA & ADEM SYNCHRONISATIE ---
  useEffect(() => {
    if (!isActive) return;
    const audio = audioRef.current;

    if (phase === 'intro') {
      setTimeout(() => setPhase('breathing'), 3000);
    }
    else if (phase === 'breathing') {
      // Synchroniseer tekst exact met de 8s durende adem-animatie (4s in, 4s uit)
      // Start direct met 'Adem in', na 4s 'Adem uit', en herhaal.
      setBreathText('Adem in'); // Reset voor zekerheid
      
      const textInterval = setInterval(() => {
        setBreathText(prev => prev === 'Adem in' ? 'Adem uit' : 'Adem in');
      }, 4000);

      const phaseTimeout = setTimeout(() => {
        clearInterval(textInterval);
        setPhase('countdown');
      }, 16000); // 2 volledige ademhalingscycli
      
      return () => { clearInterval(textInterval); clearTimeout(phaseTimeout); };
    }
    else if (phase === 'countdown') {
      if (!isMuted) {
        audio.volume = Math.min(0.3 + ((10 - count) * 0.05), 0.8);
      }
      if (count > 0) {
        const timer = setInterval(() => setCount(prev => prev - 1), 1500);
        return () => clearInterval(timer);
      } else {
        setPhase('go');
      }
    }
    else if (phase === 'go') {
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
          // VIGNETTE VERWIJDERD: Geen donkere randen meer, puur zwart
          className="fixed inset-0 w-screen h-screen bg-black z-[9999] flex items-center justify-center overflow-hidden"
        >
          {/* 1. DE WITTE FLITS */}
          <AnimatePresence>
            {phase === 'go' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-white z-[100] flex items-center justify-center">
                <motion.h1 initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-black font-black text-[10vw] italic">NU.</motion.h1>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2. ACHTERGROND COMPLEXITEIT */}
          <div className={`absolute inset-0 transition-opacity duration-2000 ${phase === 'go' ? 'opacity-0' : 'opacity-100'}`}>

            {/* QUANTUM DUST (Feller en meer aanwezig) */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              {dust.current.map((d) => (
                <motion.div
                  key={d.id}
                  className="absolute bg-white/80 rounded-full shadow-[0_0_5px_white]" // Meer glow
                  style={{ width: d.size, height: d.size, left: d.left, top: d.top }}
                  animate={{
                    y: [0, -60, 0], // Grotere beweging
                    opacity: [0.2, 0.6, 0.2],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: d.duration, repeat: Infinity, ease: "linear" }}
                />
              ))}
            </div>

            {/* NIEUW EFFECT: DIAGONAAL LICHTSTREPEN */}
            <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
                {lightStreaks.current.map((s) => (
                    <motion.div
                        key={s.id}
                        className="absolute h-[2px] w-[150%] bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        style={{ top: s.top, left: '-25%', transform: 'rotate(-45deg)' }}
                        animate={{ x: ['-50%', '50%'], opacity: [0, 0.4, 0] }}
                        transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'linear' }}
                    />
                ))}
            </div>

            {/* KINETISCHE VIERKANTEN (Trager) */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {squares.current.map((sq) => (
                <motion.div
                  key={sq.id}
                  className="absolute border border-white/20" // Iets feller
                  style={{ width: sq.size, height: sq.size, top: sq.top, left: '-5%' }}
                  animate={{ x: ['0vw', '110vw'], rotate: 360, opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: sq.duration, repeat: Infinity, delay: sq.delay, ease: "linear" }}
                />
              ))}
            </div>

            {/* GOLVEN DIRECT ZICHTBAAR & MEER GEVARIEERD */}
            {phase !== 'go' && ( // Altijd zichtbaar behalve bij de flits
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 pointer-events-none">
                  <svg width="100%" height="100%">
                    {[...Array(8)].map((_, i) => {
                      // Meer variatie in de golfvormen
                      const amplitude = 50 + i * 30;
                      const yOffset = 100 + i * 80;
                      const pathData = `M -200 ${yOffset} Q 300 ${yOffset - amplitude} 800 ${yOffset} T 1800 ${yOffset}`;
                      
                      return (
                        <motion.path
                          key={`wave-${i}`}
                          d={pathData}
                          fill="transparent"
                          stroke="white"
                          strokeWidth={0.5 + (i * 0.4)}
                          // Gloed wordt feller tijdens countdown
                          style={{ filter: `blur(${i * 0.5}px) drop-shadow(0 0 ${phase === 'countdown' ? 15 - count : 5}px rgba(255,255,255,0.6))` }}
                          animate={{
                            x: [-500, 0],
                            opacity: [0.1, 0.5, 0.1]
                          }}
                          transition={{
                            x: { duration: 30 + (i * 8), repeat: Infinity, ease: "linear" }, // Zeer traag en gevarieerd
                            opacity: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" }
                          }}
                        />
                      );
                    })}
                  </svg>
                </motion.div>
            )}

            {/* ADEMEND GRID (Iets feller) */}
            <div className="absolute inset-0 z-5 pointer-events-none">
              <svg width="100%" height="100%">
                {[...Array(25)].map((_, i) => ( // Meer lijnen
                  <motion.line
                    key={`grid-${i}`}
                    x1="-10%" y1={`${i * 4}%`} x2="110%" y2={`${i * 4}%`}
                    stroke="white" strokeWidth="0.15"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 6, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* 3. CENTRALE CONTENT (Scherpere Ademhaling) */}
          <div className="relative z-50 text-center">
            <AnimatePresence mode="wait">
              {phase === 'intro' && (
                <motion.p key="intro" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} className="text-white font-thin text-lg tracking-[2em] uppercase">
                  Syncing
                </motion.p>
              )}

              {phase === 'breathing' && (
                <motion.div key="breathing" className="flex flex-col items-center gap-12">
                  {/* SCHERPERE, GESYNCHRONISEERDE ADEM-ANIMATIE */}
                  <motion.div
                    // De animatie duurt precies 8s (4s in, 4s uit), synchroon met de tekstwissel
                    animate={{
                        scale: [1, 1.6, 1],
                        borderColor: ["rgba(255,255,255,0.2)", "rgba(255,255,255,1)", "rgba(255,255,255,0.2)"],
                        boxShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 30px rgba(255,255,255,0.6)", "0 0 0px rgba(255,255,255,0)"]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="w-56 h-56 rounded-full border-2 flex items-center justify-center backdrop-blur-md"
                  >
                    <motion.div
                        animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="w-3 h-3 bg-white rounded-full shadow-[0_0_25px_rgba(255,255,255,1)]"
                    />
                  </motion.div>
                  
                  {/* PULSERENDE TEKST DIE MEEGAAT MET DE ADEMHALING */}
                  <motion.p
                    key={breathText}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 1 }}
                    className="text-white text-sm font-black tracking-[0.8em] uppercase"
                  >
                    {breathText}
                  </motion.p>
                </motion.div>
              )}

              {phase === 'countdown' && (
                <motion.div key={count} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}>
                  <span className="text-white font-black text-[18rem] tabular-nums leading-none tracking-tighter opacity-90">
                    {count}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 4. CONTROLS */}
          {phase !== 'go' && (
            <div className="absolute bottom-10 right-10 flex items-center gap-8 z-[60] opacity-30 hover:opacity-100 transition-opacity duration-500">
               <button onClick={() => setIsMuted(!isMuted)} className="text-white p-2">
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
               </button>
               <button onClick={onClose} className="text-white text-[9px] font-black tracking-[0.6em] uppercase">
                Stop
               </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Zenmode;