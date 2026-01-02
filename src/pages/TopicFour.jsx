import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas'; 
import { Share2, Award, Trophy, Timer } from 'lucide-react'; 
import allQuestions from '../data/vragen_ipr.json'; // Pas pad aan indien nodig

// Ladder configuratie
const MONEY_LADDER = [
  "€ 500", "€ 1.000", "€ 2.000", "€ 4.000", "€ 8.000", 
  "€ 16.000", "€ 32.000", "€ 64.000", "€ 125.000", "€ 250.000", 
  "€ 500.000", "€ 1.000.000"
];

// Kleurenpalet
const COLORS = {
  dark: '#1F2937',   // Slate-900 achtige kleur voor tekst/buttons
  mint: '#6EE7B7',   // Lawbooks Mint accentkleur
  mintDark: '#059669', // Donkerdere mint voor tekst op lichte achtergrond
  bg: '#F8FAFC',     // Slate-50 achtergrond
  success: '#10B981', // Groen voor goed antwoord
  error: '#EF4444'    // Rood voor fout antwoord
};

const Miljoenenjacht = () => {
  const [gameState, setGameState] = useState('start'); 
  const [questions, setQuestions] = useState([]); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [selected, setSelected] = useState(null);
  const [evaluation, setEvaluation] = useState(null); 
  
  const audioRef = useRef(null);
  const certificateRef = useRef(null);

  // Start het spel
  const startGame = () => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 12));
    setGameState('playing');
    setCurrentIdx(0);
    setTimeLeft(25);
    setSelected(null);
    setEvaluation(null);
  };

  // Functie om resultaat te delen
  const handleShare = async () => {
    if (!certificateRef.current) return;
    
    const canvas = await html2canvas(certificateRef.current, {
      backgroundColor: COLORS.dark,
      scale: 3, 
      useCORS: true
    });
    
    const image = canvas.toDataURL("image/png");
    const amount = MONEY_LADDER[currentIdx - 1] || "€ 0";

    if (navigator.share) {
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], "Lawbooks_Miljoenenjacht.png", { type: "image/png" });
      try {
        await navigator.share({
          title: 'Lawbooks Miljoenenjacht',
          text: `Ik heb ${amount} behaald in de Lawbooks Miljoenenjacht! Kom jij even ver als ik? ⚖️💰`,
          files: [file],
        });
      } catch (err) { console.log("Delen gestopt"); }
    } else {
      const link = document.createElement('a');
      link.download = `Lawbooks_Resultaat_${amount}.png`;
      link.href = image;
      link.click();
    }
  };

  // Timer Logica
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0 && evaluation === null) {
      timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 0.1)), 100);
    } else if (timeLeft <= 0 && gameState === 'playing' && evaluation === null) {
      setGameState('lost');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, evaluation]);

  // Audio effecten
  useEffect(() => {
    if (gameState === 'playing' || gameState === 'transitioning') {
      audioRef.current?.play().catch(() => {});
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [gameState]);

  // Antwoord afhandeling
  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setEvaluation('thinking');
    const isCorrect = idx === questions[currentIdx].correct;

    setTimeout(() => {
      setEvaluation(isCorrect ? 'correct' : 'wrong');
      if (isCorrect) {
        // Confetti in nieuwe kleuren (Mint & Donker)
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.8 }, colors: [COLORS.mint, COLORS.dark] });
        setTimeout(() => {
          if (currentIdx === 11) {
            confetti({ particleCount: 500, spread: 150, origin: { y: 0.6 }, colors: [COLORS.mint, COLORS.dark, '#FFFFFF'] });
            setGameState('won');
          } else {
            setGameState('transitioning');
            setTimeout(() => {
              setCurrentIdx(prev => prev + 1);
              setTimeLeft(25);
              setSelected(null);
              setEvaluation(null);
              setGameState('playing');
            }, 1800);
          }
        }, 1500);
      } else {
        setTimeout(() => setGameState('lost'), 1500);
      }
    }, 1500);
  };

  const progress = ((currentIdx) / 12) * 100;

  // ------------------------------------------------------------------
  // RENDER: START SCHERM (Gerestyled)
  // ------------------------------------------------------------------
  if (gameState === 'start') {
    return (
      <div className={`flex flex-col items-center justify-center h-full min-h-[80vh] w-full bg-[${COLORS.bg}] text-slate-900 p-6 text-center relative overflow-hidden rounded-3xl border border-slate-200`}>
        <audio ref={audioRef} src="/spannend.mp3" loop />
        
        {/* Decoratieve achtergrond elementen in nieuwe kleuren */}
        <div className={`absolute top-[-10%] left-[-10%] w-96 h-96 bg-[${COLORS.mint}]/20 rounded-full blur-3xl`} />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-slate-200/50 rounded-full blur-3xl" />

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 max-w-2xl"
        >
          <div className="mb-6 flex justify-center">
             <div className={`w-24 h-24 bg-[${COLORS.dark}] rounded-2xl flex items-center justify-center shadow-xl border-4 border-[${COLORS.mint}] rotate-12`}>
                <Trophy size={40} className={`text-[${COLORS.mint}]`} />
             </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight text-slate-900">
            Miljoenen<span className={`text-transparent bg-clip-text bg-gradient-to-r from-[${COLORS.mintDark}] to-[${COLORS.mint}]`}>jacht</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg mb-12">
            Test je kennis van het IPR & win virtueel goud.
          </p>
          <button 
            onClick={startGame} 
            className={`px-12 py-5 bg-[${COLORS.dark}] text-white rounded-xl font-bold text-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all flex items-center gap-3 mx-auto group`}
          >
            Start de Strijd
            <Timer className={`text-[${COLORS.mint}] group-hover:rotate-12 transition-transform`} />
          </button>
        </motion.div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // RENDER: GAME & RESULTATEN (Gerestyled)
  // ------------------------------------------------------------------
  return (
    <div className={`w-full h-full min-h-[85vh] bg-[${COLORS.bg}] flex flex-col font-sans text-slate-900 overflow-hidden rounded-3xl shadow-sm border border-slate-200 relative`}>
      <audio ref={audioRef} src="/spannend.mp3" loop />
      
      {/* --- HIDDEN CERTIFICATE (Nieuwe Stijl) --- */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div 
          ref={certificateRef} 
          style={{ 
            width: '800px', 
            height: '600px', 
            background: COLORS.dark, // Donkere achtergrond
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '40px',
            border: `14px solid ${COLORS.mint}`, // Mint rand
            borderRadius: '0px',
            fontFamily: 'sans-serif',
            position: 'relative',
            color: 'white'
          }}
        >
          <div style={{ position: 'absolute', top: '40px' }}>
             <div style={{ backgroundColor: COLORS.mint, padding: '15px', borderRadius: '20px', border: `4px solid ${COLORS.dark}` }}>
                <Award size={50} color={COLORS.dark} />
             </div>
          </div>
          <div style={{ height: '4px', background: COLORS.mint, width: '120px', marginTop: '100px', marginBottom: '40px' }}></div>
          <p style={{ textTransform: 'uppercase', letterSpacing: '4px', fontSize: '20px', fontWeight: '800', marginBottom: '50px', color: COLORS.mint }}>LAWBOOKS PREMIUM</p>
          <h2 style={{ fontSize: '48px', fontWeight: '900', margin: '0' }}>SCORE: {currentIdx}/12</h2>
          <h2 style={{ color: COLORS.mint, fontSize: '72px', fontWeight: '900', margin: '10px 0' }}>{MONEY_LADDER[currentIdx - 1] || "€ 0"}</h2>
          <p style={{ fontSize: '24px', marginTop: '50px', fontWeight: '600', color: '#9CA3AF' }}>IPR Miljoenenjacht</p>
        </div>
      </div>

      {/* Progress Bar Top (Mint) */}
      <div className="w-full h-1.5 bg-slate-200 relative z-20">
        <motion.div 
          className={`h-full bg-[${COLORS.mint}]`} 
          initial={{ width: 0 }} 
          animate={{ width: `${progress}%` }} 
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative">
        
        {/* --- MAIN GAME AREA --- */}
        <div className="flex-1 flex flex-col items-center p-6 lg:p-10 relative z-10 overflow-y-auto">
          {/* Spacer */}
          <div className="flex-grow max-h-[8vh] lg:max-h-[12vh]"></div>

          <AnimatePresence mode="wait">
            
            {/* 1. TRANSITIE SCHERM */}
            {gameState === 'transitioning' ? (
              <motion.div 
                key="trans" 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 1.1, opacity: 0 }} 
                className="text-center my-auto"
              >
                <p className={`text-[${COLORS.mintDark}] font-black uppercase tracking-widest text-sm mb-4`}>Volgend Niveau</p>
                <motion.h2 
                  animate={{ scale: [1, 1.05, 1] }} 
                  transition={{ repeat: Infinity, duration: 1.5 }} 
                  className="text-7xl md:text-9xl font-black text-slate-900"
                >
                  {MONEY_LADDER[currentIdx]}
                </motion.h2>
              </motion.div>

            /* 2. SPEEL SCHERM (VRAAG) */
            ) : gameState === 'playing' && questions[currentIdx] ? (
              <motion.div 
                key={currentIdx} 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                exit={{ y: -20, opacity: 0 }} 
                className="w-full max-w-4xl flex flex-col items-center"
              >
                {/* VRAAG KAART */}
                <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden mb-8 relative">
                  {/* Timer Bar (Mint) */}
                  <div className="h-1.5 w-full bg-slate-100 absolute top-0 left-0">
                    <motion.div 
                      className={`h-full ${evaluation === 'correct' ? COLORS.success : evaluation === 'wrong' ? COLORS.error : COLORS.mint}`} 
                      initial={{ width: "100%" }} 
                      animate={{ width: `${(timeLeft / 25) * 100}%` }} 
                      transition={{ duration: 0.1, ease: "linear" }} 
                    />
                  </div>
                  
                  <div className="p-8 md:p-12 text-center">
                    <div className="flex justify-between items-center mb-6">
                      <span className="px-3 py-1 rounded-md bg-slate-100 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                        Vraag {currentIdx + 1} / 12
                      </span>
                      <div className={`flex items-center gap-1 text-[${COLORS.mintDark}] font-bold text-sm`}>
                        <Timer size={16} className={`text-[${COLORS.mint}]`} /> {Math.ceil(timeLeft)}s
                      </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold leading-snug text-slate-900">
                      {questions[currentIdx].q}
                    </h2>
                  </div>
                </div>

                {/* ANTWOORDEN GRID (Nieuwe Stijl) */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions[currentIdx].options.map((opt, i) => {
                    const isCorrect = i === questions[currentIdx].correct;
                    const isSelected = selected === i;
                    
                    // Standaard stijl
                    let style = "bg-white border-slate-200 text-slate-800 hover:border-[${COLORS.mint}] hover:bg-[${COLORS.mint}]/5 hover:shadow-md";
                    let letterStyle = "bg-slate-100 text-slate-500 group-hover:bg-[${COLORS.dark}] group-hover:text-[${COLORS.mint}]";
                    
                    // Geselecteerd (Thinking) -> Donker met mint rand
                    if (isSelected && evaluation === 'thinking') {
                         style = `bg-[${COLORS.dark}] border-[${COLORS.mint}] text-white shadow-lg scale-[0.99]`;
                         letterStyle = `bg-[${COLORS.mint}] text-[${COLORS.dark}]`;
                    }
                    // Correct -> Groen
                    if (evaluation === 'correct' && isCorrect) {
                        style = `bg-[${COLORS.success}] border-[${COLORS.success}] text-white shadow-lg scale-[1.02]`;
                        letterStyle = "bg-white/20 text-white";
                    }
                    // Fout -> Rood
                    if (evaluation === 'wrong' && isSelected && !isCorrect) {
                        style = `bg-[${COLORS.error}] border-[${COLORS.error}] text-white`;
                        letterStyle = "bg-white/20 text-white";
                    }
                    // Niet geselecteerd tijdens evaluatie -> Fade out
                    if (selected !== null && !isSelected && !(evaluation === 'correct' && isCorrect)) {
                        style += " opacity-40 grayscale pointer-events-none border-transparent shadow-none";
                    }

                    return (
                      <motion.button 
                        key={i} 
                        disabled={selected !== null} 
                        onClick={() => handleAnswer(i)} 
                        animate={evaluation === 'wrong' && isSelected ? { x: [-4, 4, -4, 4, 0] } : {}} 
                        className={`p-5 rounded-xl border-2 transition-all text-left flex items-center gap-4 group ${style}`}
                      >
                        <span className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg font-black text-xs transition-colors ${letterStyle}`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="font-bold text-base md:text-lg leading-snug">{opt}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

            /* 3. VERLOREN SCHERM */
            ) : gameState === 'lost' ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                className={`text-center w-full max-w-lg bg-white p-10 rounded-3xl shadow-xl border-t-8 border-[${COLORS.error}] my-auto`}
              >
                <h2 className={`text-4xl mb-2 font-black text-[${COLORS.error}]`}>Helaas...</h2>
                <p className="text-slate-400 text-sm mb-6 uppercase tracking-widest font-bold">
                  Je eindigt met
                </p>
                <div className="text-5xl font-black text-slate-900 mb-8">
                  {currentIdx > 0 ? MONEY_LADDER[currentIdx-1] : "€ 0"}
                </div>
                
                {/* Uitleg bij vraag */}
                {questions[currentIdx] && (
                  <div className={`bg-slate-50 p-6 rounded-xl mb-8 text-left border-l-4 border-[${COLORS.mintDark}]`}>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Het juiste antwoord was:</p>
                    <p className="font-bold text-slate-900 mb-2">{questions[currentIdx].options[questions[currentIdx].correct]}</p>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">{questions[currentIdx]?.basis}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {currentIdx >= 4 && (
                    <button onClick={handleShare} className={`w-full py-3 bg-[${COLORS.mint}] text-[${COLORS.dark}] rounded-lg font-bold uppercase text-sm hover:bg-[${COLORS.mintDark}] hover:text-white transition-colors flex items-center justify-center gap-2`}>
                      <Share2 size={18} /> Deel resultaat
                    </button>
                  )}
                  <button onClick={startGame} className={`w-full py-3 bg-[${COLORS.dark}] text-white rounded-lg font-bold uppercase text-sm hover:bg-black transition-colors`}>
                    Nieuwe poging
                  </button>
                </div>
              </motion.div>

            /* 4. GEWONNEN SCHERM */
            ) : gameState === 'won' ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center my-auto">
                <div className={`mb-6 inline-block p-6 rounded-full bg-[${COLORS.mint}]/20`}>
                  <Trophy size={64} className={`text-[${COLORS.mintDark}]`} />
                </div>
                <h2 className="text-6xl md:text-8xl mb-4 text-slate-900 font-black tracking-tight">MILJONAIR!</h2>
                <p className={`text-[${COLORS.mintDark}] text-xl mb-12 font-bold uppercase tracking-widest`}>
                  Gefeliciteerd, alle vragen goed!
                </p>
                
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                   <button onClick={handleShare} className={`px-8 py-4 bg-[${COLORS.mint}] text-[${COLORS.dark}] rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2`}>
                      <Share2 size={20} /> Deel Winst
                   </button>
                   <button onClick={startGame} className={`px-8 py-4 bg-[${COLORS.dark}] text-white rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg`}>
                      Opnieuw Spelen
                   </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
          
          {/* Spacer bottom */}
          <div className="flex-grow"></div>
        </div>

        {/* --- LADDER SIDEBAR (Desktop Only - Nieuwe Stijl) --- */}
        <div className="w-64 bg-white border-l border-slate-200 hidden lg:flex flex-col-reverse justify-center py-8 px-6 gap-2 relative z-20">
          <div className={`absolute top-0 left-0 right-0 bg-slate-50 py-4 text-center border-b border-slate-100`}>
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Ladder</span>
          </div>
          {MONEY_LADDER.map((amount, index) => {
            const isCurrent = index === currentIdx;
            const isDone = index < currentIdx;
            
            // Standaard stijl (toekomst)
            let itemStyle = "text-slate-300 border-transparent";
            let numStyle = "";

            // Voltooid stijl (groen/mint)
            if (isDone) {
                itemStyle = `text-[${COLORS.mintDark}] bg-[${COLORS.mint}]/10 border-transparent font-medium`;
            }

            // Huidige stijl (Donker met mint accent)
            if (isCurrent) {
                itemStyle = `bg-[${COLORS.dark}] text-white shadow-lg border-[${COLORS.dark}] font-bold scale-105`;
                numStyle = `text-[${COLORS.mint}]`;
            }

            return (
              <motion.div 
                key={amount} 
                animate={isCurrent ? { x: 5 } : { x: 0 }} 
                className={`flex justify-between items-center py-2.5 px-4 rounded-xl transition-all border-2 ${itemStyle}`}
              >
                <span className={`text-[10px] font-black ${numStyle}`}>{index + 1}</span>
                <span className="text-sm font-bold tracking-tight">{amount}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Miljoenenjacht;