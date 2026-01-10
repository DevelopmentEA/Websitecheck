import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas'; 
import { Share2, Award, Trophy, Timer } from 'lucide-react'; 

// Pas dit pad aan naar waar jouw json bestand staat!
import allQuestions from './vragen.json'; 

// Ladder configuratie
const MONEY_LADDER = [
  "€ 500", "€ 1.000", "€ 2.000", "€ 4.000", "€ 8.000", 
  "€ 16.000", "€ 32.000", "€ 64.000", "€ 125.000", "€ 250.000", 
  "€ 500.000", "€ 1.000.000"
];

// Kleurenpalet (JS Variabelen voor in styles)
const COLORS = {
  dark: '#1F2937',   
  mint: '#6EE7B7',   
  mintDark: '#059669', 
  bg: '#F8FAFC',     
  success: '#10B981', 
  error: '#EF4444'    
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
    // Veiligheidscheck
    if (!allQuestions || allQuestions.length === 0) {
        alert("Geen vragen gevonden! Controleer src/data/vragen_ipr.json");
        return;
    }

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
    
    if (!questions[currentIdx]) return;

    const isCorrect = idx === questions[currentIdx].correct;

    setTimeout(() => {
      setEvaluation(isCorrect ? 'correct' : 'wrong');
      if (isCorrect) {
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
  // RENDER: START SCHERM
  // ------------------------------------------------------------------
  if (gameState === 'start') {
    return (
      <div 
        className="flex flex-col items-center justify-center h-full min-h-[80vh] w-full text-slate-900 p-6 text-center relative overflow-hidden rounded-3xl border border-slate-200"
        style={{ backgroundColor: COLORS.bg, fontFamily: "'Nunito', sans-serif" }}
      >
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');`}
        </style>
        <audio ref={audioRef} src="/spannend.mp3" loop />
        
        {/* Decoratieve achtergrond elementen */}
        <div 
            className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full blur-3xl" 
            style={{ backgroundColor: `${COLORS.mint}33` }} 
        />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-slate-200/50 rounded-full blur-3xl" />

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 max-w-2xl"
        >
          <div className="mb-6 flex justify-center">
             <div 
                className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl border-4 rotate-12"
                style={{ backgroundColor: COLORS.dark, borderColor: COLORS.mint }}
             >
                <Trophy size={40} style={{ color: COLORS.mint }} />
             </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight text-slate-900" 
              style={{ fontFamily: "'Fredoka', sans-serif", textShadow: `4px 4px 0px ${COLORS.mint}66` }}>
            Miljoenen<span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${COLORS.mintDark}, ${COLORS.mint})` }}>jacht</span>
          </h1>
          <p className="text-slate-500 font-bold text-xl mb-12" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Test je kennis van het SR & win virtueel goud.
          </p>
          <button 
            onClick={startGame} 
            className="px-12 py-5 rounded-xl font-bold text-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all flex items-center gap-3 mx-auto group"
            style={{ 
              backgroundColor: COLORS.dark, 
              color: COLORS.mint,  // MINT TEKST!
              fontFamily: "'Fredoka', sans-serif", 
              letterSpacing: '1px' 
            }}
          >
            Start de Strijd
            <Timer className="group-hover:rotate-12 transition-transform" style={{ color: COLORS.mint }} />
          </button>
        </motion.div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // RENDER: GAME & RESULTATEN
  // ------------------------------------------------------------------
  return (
    <div 
        className="w-full h-full min-h-[85vh] flex flex-col overflow-hidden rounded-3xl shadow-sm border border-slate-200 relative"
        style={{ backgroundColor: COLORS.bg, fontFamily: "'Nunito', sans-serif" }}
    >
      <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');`}
      </style>
      <audio ref={audioRef} src="/spannend.mp3" loop />
      
      {/* --- HIDDEN CERTIFICATE --- */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div 
          ref={certificateRef} 
          style={{ 
            width: '800px', 
            height: '600px', 
            background: COLORS.dark,
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '40px',
            border: `14px solid ${COLORS.mint}`,
            borderRadius: '0px',
            fontFamily: "'Fredoka', sans-serif",
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
          <h2 style={{ fontSize: '56px', fontWeight: '900', margin: '0' }}>SCORE: {currentIdx}/12</h2>
          <h2 style={{ color: COLORS.mint, fontSize: '80px', fontWeight: '900', margin: '10px 0' }}>{MONEY_LADDER[currentIdx - 1] || "€ 0"}</h2>
          <p style={{ fontSize: '24px', marginTop: '50px', fontWeight: '600', color: '#9CA3AF', fontFamily: "'Nunito', sans-serif" }}>SR Miljoenenjacht</p>
        </div>
      </div>

      {/* Progress Bar Top */}
      <div className="w-full h-1.5 bg-slate-200 relative z-20">
        <motion.div 
          className="h-full"
          style={{ backgroundColor: COLORS.mint }}
          initial={{ width: 0 }} 
          animate={{ width: `${progress}%` }} 
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative">
        
        {/* --- MAIN GAME AREA --- */}
        <div className="flex-1 flex flex-col items-center p-6 lg:p-10 relative z-10 overflow-y-auto">
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
                <p className="font-black uppercase tracking-widest text-sm mb-4" style={{ color: COLORS.mintDark, fontFamily: "'Fredoka', sans-serif" }}>Volgend Niveau</p>
                <motion.h2 
                  animate={{ scale: [1, 1.05, 1] }} 
                  transition={{ repeat: Infinity, duration: 1.5 }} 
                  className="text-7xl md:text-9xl font-black text-slate-900"
                  style={{ fontFamily: "'Fredoka', sans-serif", textShadow: `4px 4px 0px ${COLORS.mint}44` }}
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
                  {/* Timer Bar */}
                  <div className="h-1.5 w-full bg-slate-100 absolute top-0 left-0">
                    <motion.div 
                      className="h-full"
                      style={{ 
                          backgroundColor: evaluation === 'correct' ? COLORS.success : evaluation === 'wrong' ? COLORS.error : COLORS.mint 
                      }}
                      initial={{ width: "100%" }} 
                      animate={{ width: `${(timeLeft / 25) * 100}%` }} 
                      transition={{ duration: 0.1, ease: "linear" }} 
                    />
                  </div>
                  
                  <div className="p-8 md:p-12 text-center">
                    <div className="flex justify-between items-center mb-6">
                      <span className="px-3 py-1 rounded-md bg-slate-100 text-[11px] font-black text-slate-500 uppercase tracking-widest" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                        Vraag {currentIdx + 1} / 12
                      </span>
                      <div className="flex items-center gap-1 font-bold text-sm" style={{ color: COLORS.mintDark, fontFamily: "'Fredoka', sans-serif" }}>
                        <Timer size={16} style={{ color: COLORS.mint }} /> {Math.ceil(timeLeft)}s
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black leading-tight text-slate-900" style={{ fontFamily: "'Nunito', sans-serif" }}>
                      {questions[currentIdx].q}
                    </h2>
                  </div>
                </div>

                {/* ANTWOORDEN GRID */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions[currentIdx]?.options && questions[currentIdx].options.map((opt, i) => {
                    const isCorrect = i === questions[currentIdx].correct;
                    const isSelected = selected === i;
                    
                    let btnStyle = { 
                        backgroundColor: '#FFFFFF', 
                        borderColor: '#E2E8F0', 
                        color: '#1F293B', 
                        fontFamily: "'Nunito', sans-serif",
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    };
                    let badgeStyle = {
                        backgroundColor: '#F1F5F9', 
                        color: '#64748B', 
                        fontFamily: "'Fredoka', sans-serif"
                    };

                    if (isSelected && evaluation === 'thinking') {
                         btnStyle = { ...btnStyle, backgroundColor: COLORS.dark, borderColor: COLORS.mint, color: 'white', transform: 'scale(0.99)' };
                         badgeStyle = { backgroundColor: COLORS.mint, color: COLORS.dark };
                    }
                    if (evaluation === 'correct' && isCorrect) {
                        btnStyle = { ...btnStyle, backgroundColor: COLORS.success, borderColor: COLORS.success, color: 'white', transform: 'scale(1.02)' };
                        badgeStyle = { backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' };
                    }
                    if (evaluation === 'wrong' && isSelected && !isCorrect) {
                        btnStyle = { ...btnStyle, backgroundColor: COLORS.error, borderColor: COLORS.error, color: 'white' };
                        badgeStyle = { backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' };
                    }
                    if (selected !== null && !isSelected && !(evaluation === 'correct' && isCorrect)) {
                        btnStyle = { ...btnStyle, opacity: 0.4, filter: 'grayscale(100%)', pointerEvents: 'none', borderColor: 'transparent' };
                    }

                    return (
                      <motion.button 
                        key={i} 
                        disabled={selected !== null} 
                        onClick={() => handleAnswer(i)} 
                        whileHover={selected === null ? { y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' } : {}}
                        animate={evaluation === 'wrong' && isSelected ? { x: [-4, 4, -4, 4, 0] } : {}} 
                        className="p-5 rounded-xl border-2 transition-all text-left flex items-center gap-4"
                        style={btnStyle}
                      >
                        <span 
                            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg font-black text-sm transition-colors shadow-sm"
                            style={badgeStyle}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="font-bold text-lg leading-snug">{opt}</span>
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
                className="text-center w-full max-w-lg bg-white p-10 rounded-3xl shadow-xl border-t-8 my-auto"
                style={{ borderColor: COLORS.error }}
              >
                <h2 className="text-4xl mb-2 font-black" style={{ color: COLORS.error, fontFamily: "'Fredoka', sans-serif" }}>Helaas...</h2>
                <p className="text-slate-400 text-sm mb-6 uppercase tracking-widest font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  Je eindigt met
                </p>
                <div className="text-5xl font-black text-slate-900 mb-8" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  {currentIdx > 0 ? MONEY_LADDER[currentIdx-1] : "€ 0"}
                </div>
                
                {questions[currentIdx] && (
                  <div className="bg-slate-50 p-6 rounded-xl mb-8 text-left border-l-4" style={{ borderColor: COLORS.mintDark }}>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1" style={{ fontFamily: "'Fredoka', sans-serif" }}>Het juiste antwoord was:</p>
                    <p className="font-bold text-slate-900 mb-2">{questions[currentIdx].options[questions[currentIdx].correct]}</p>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">{questions[currentIdx]?.basis}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {currentIdx >= 4 && (
                    <button 
                        onClick={handleShare} 
                        className="w-full py-3 rounded-lg font-bold uppercase text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        style={{ backgroundColor: COLORS.mint, color: COLORS.dark, fontFamily: "'Fredoka', sans-serif" }}
                    >
                      <Share2 size={18} /> Deel resultaat
                    </button>
                  )}
                  {/* --- AANGEPASTE KNOP --- */}
                  <button 
                    onClick={startGame} 
                    className="w-full py-3 rounded-lg font-bold uppercase text-sm hover:bg-black transition-colors"
                    style={{ 
                      backgroundColor: COLORS.dark, 
                      color: COLORS.mint, // MINT TEKST!
                      fontFamily: "'Fredoka', sans-serif" 
                    }}
                  >
                    Nieuwe poging
                  </button>
                </div>
              </motion.div>

            /* 4. GEWONNEN SCHERM */
            ) : gameState === 'won' ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center my-auto">
                <div className="mb-6 inline-block p-6 rounded-full" style={{ backgroundColor: `${COLORS.mint}33` }}>
                  <Trophy size={64} style={{ color: COLORS.mintDark }} />
                </div>
                <h2 className="text-6xl md:text-8xl mb-4 text-slate-900 font-black tracking-tight" style={{ fontFamily: "'Fredoka', sans-serif", textShadow: `4px 4px 0px ${COLORS.mint}44` }}>MILJONAIR!</h2>
                <p className="text-xl mb-12 font-bold uppercase tracking-widest" style={{ color: COLORS.mintDark, fontFamily: "'Fredoka', sans-serif" }}>
                  Gefeliciteerd, alle vragen goed!
                </p>
                
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                   <button 
                        onClick={handleShare} 
                        className="px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
                        style={{ backgroundColor: COLORS.mint, color: COLORS.dark, fontFamily: "'Fredoka', sans-serif" }}
                    >
                      <Share2 size={20} /> Deel Winst
                   </button>
                   <button 
                        onClick={startGame} 
                        className="px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                        style={{ 
                          backgroundColor: COLORS.dark, 
                          color: COLORS.mint, // MINT TEKST!
                          fontFamily: "'Fredoka', sans-serif" 
                        }}
                    >
                      Opnieuw Spelen
                   </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
          
          {/* Spacer bottom */}
          <div className="flex-grow"></div>
        </div>

        {/* --- LADDER SIDEBAR --- */}
        <div className="w-64 bg-white border-l border-slate-200 hidden lg:flex flex-col-reverse justify-center py-8 px-6 gap-2 relative z-20">
          <div className="absolute top-0 left-0 right-0 bg-slate-50 py-4 text-center border-b border-slate-100">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400" style={{ fontFamily: "'Fredoka', sans-serif" }}>Ladder</span>
          </div>
          {MONEY_LADDER.map((amount, index) => {
            const isCurrent = index === currentIdx;
            const isDone = index < currentIdx;
            
            let divStyle = { color: '#CBD5E1', fontFamily: "'Fredoka', sans-serif" }; // Slate-300
            let numStyle = {};

            if (isDone) {
                divStyle = { ...divStyle, color: COLORS.mintDark, backgroundColor: `${COLORS.mint}1A` };
            }

            if (isCurrent) {
                divStyle = { ...divStyle, backgroundColor: COLORS.dark, color: 'white', fontWeight: 'bold', transform: 'scale(1.05)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' };
                numStyle = { color: COLORS.mint };
            }

            return (
              <motion.div 
                key={amount} 
                animate={isCurrent ? { x: 5 } : { x: 0 }} 
                className="flex justify-between items-center py-2.5 px-4 rounded-xl transition-all border-2 border-transparent"
                style={divStyle}
              >
                <span className="text-sm font-bold" style={numStyle}>{index + 1}</span>
                <span className="text-base font-bold tracking-wide">{amount}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Miljoenenjacht;