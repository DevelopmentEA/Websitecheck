import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas'; // Vergeet niet: npm install html2canvas
import { Share2, Download } from 'lucide-react';
import allQuestions from './vragen.json';

const MONEY_LADDER = [
  "€ 500", "€ 1.000", "€ 2.000", "€ 4.000", "€ 8.000", 
  "€ 16.000", "€ 32.000", "€ 64.000", "€ 125.000", "€ 250.000", 
  "€ 500.000", "€ 1.000.000"
];

const Miljoenenjacht = () => {
  const [gameState, setGameState] = useState('start'); 
  const [questions, setQuestions] = useState([]); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [selected, setSelected] = useState(null);
  const [evaluation, setEvaluation] = useState(null); 
  const audioRef = useRef(null);
  const certificateRef = useRef(null); // Ref voor de screenshot

  const startGame = () => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 12));
    setGameState('playing');
    setCurrentIdx(0);
    setTimeLeft(25);
    setSelected(null);
    setEvaluation(null);
  };

  // Screenshot & Deel functie
  const handleShare = async () => {
    if (!certificateRef.current) return;
    
    // Maak een canvas van het (verborgen) certificaat
    const canvas = await html2canvas(certificateRef.current, {
      backgroundColor: '#1A365D',
      scale: 2, // Hogere kwaliteit
    });
    
    const image = canvas.toDataURL("image/png");
    
    // Check of mobiel delen mogelijk is
    if (navigator.share) {
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], "Lawbooks_Resultaat.png", { type: "image/png" });
      try {
        await navigator.share({
          title: 'Mijn Lawbooks Resultaat',
          text: `Ik heb ${MONEY_LADDER[currentIdx - 1] || "een mooi bedrag"} behaald bij Miljoenenjacht! Durf jij het ook aan?`,
          files: [file],
        });
      } catch (err) {
        console.log("Delen geannuleerd");
      }
    } else {
      // Fallback: Download de afbeelding op desktop
      const link = document.createElement('a');
      link.download = `Lawbooks_Miljoenenjacht_${MONEY_LADDER[currentIdx-1]}.png`;
      link.href = image;
      link.click();
    }
  };

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0 && evaluation === null) {
      timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 0.1)), 100);
    } else if (timeLeft <= 0 && gameState === 'playing' && evaluation === null) {
      setGameState('lost');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, evaluation]);

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

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setEvaluation('thinking');
    const isCorrect = idx === questions[currentIdx].correct;

    setTimeout(() => {
      setEvaluation(isCorrect ? 'correct' : 'wrong');
      if (isCorrect) {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.8 }, colors: ['#C5A059', '#10B981'] });
        setTimeout(() => {
          if (currentIdx === 11) {
            confetti({ particleCount: 500, spread: 150, origin: { y: 0.6 } });
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

  // Render Helper voor de Deel-knop
  const renderShareButton = () => {
    // Toon knop alleen als ze minstens bij vraag 5 (index 4) zijn gekomen
    if (currentIdx < 4) return null;

    return (
      <button 
        onClick={handleShare}
        className="mt-4 flex items-center justify-center gap-2 px-8 py-4 bg-[#C5A059] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#b08d4b] transition-all shadow-lg"
      >
        <Share2 size={20} /> Deel mijn resultaat!
      </button>
    );
  };

  if (gameState === 'start') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF9F6] text-[#1A365D] p-6 text-center">
        <audio ref={audioRef} src="/spannend.mp3" loop />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <h1 className="text-8xl font-serif italic mb-2 tracking-tighter">Miljoenenjacht</h1>
          <p className="text-[#C5A059] tracking-[0.5em] font-black text-sm mb-16 uppercase">Win jij een Miljoen?</p>
          <button onClick={startGame} className="px-20 py-8 bg-[#1A365D] text-white rounded-2xl font-black text-2xl shadow-xl transition-all">START DE STRIJD</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-sans text-[#1A365D] overflow-hidden">
      <audio ref={audioRef} src="/spannend.mp3" loop />
      
      {/* 1. VERBORGEN CERTIFICAAT VOOR SCREENSHOT */}
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <div ref={certificateRef} style={{ width: '600px', padding: '40px', background: '#1A365D', color: 'white', textAlign: 'center', borderRadius: '20px', border: '10px solid #C5A059' }}>
          <h1 style={{ fontSize: '40px', fontFamily: 'serif', fontStyle: 'italic', marginBottom: '10px' }}>Miljoenenjacht</h1>
          <div style={{ height: '2px', background: '#C5A059', width: '100px', margin: '0 auto 20px' }}></div>
          <p style={{ textTransform: 'uppercase', letterSpacing: '4px', fontSize: '12px' }}>Lawbooks Knowledge Base</p>
          <h2 style={{ fontSize: '60px', fontWeight: '900', margin: '40px 0' }}>{MONEY_LADDER[currentIdx - 1] || "SCORE"}</h2>
          <p style={{ opacity: '0.7' }}>Ik ben de juridische ladder beklommen!</p>
          <p style={{ marginTop: '40px', fontSize: '10px' }}>www.lawbooks.nl</p>
        </div>
      </div>

      <div className="w-full h-2 bg-slate-100 relative z-50">
        <motion.div className="h-full bg-gradient-to-r from-[#1A365D] to-[#C5A059]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
          <AnimatePresence mode="wait">
            {gameState === 'transitioning' ? (
              <motion.div key="trans" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }} className="text-center">
                <p className="text-[#C5A059] font-black uppercase tracking-[0.4em] text-sm mb-6">NIVEAU BEREIKT</p>
                <motion.h2 animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="text-[10rem] font-serif italic font-black text-[#1A365D]">
                  {MONEY_LADDER[currentIdx]}
                </motion.h2>
              </motion.div>
            ) : gameState === 'playing' && questions[currentIdx] ? (
              <motion.div key={currentIdx} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="w-full max-w-4xl">
                <div className="bg-white border-2 border-slate-100 rounded-[3rem] shadow-2xl overflow-hidden mb-12 relative">
                  <div className="p-12 md:p-16 text-center">
                    <span className="px-4 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 inline-block">Vraag {currentIdx + 1}</span>
                    <h2 className="text-4xl md:text-5xl font-serif leading-tight text-[#1A365D] font-medium italic">"{questions[currentIdx].q}"</h2>
                  </div>
                  <div className="h-3 w-full bg-slate-50 relative">
                    <motion.div className={`absolute top-0 left-0 bottom-0 ${evaluation === 'correct' ? 'bg-green-500' : evaluation === 'wrong' ? 'bg-red-500' : 'bg-[#C5A059]'}`} initial={{ width: "100%" }} animate={{ width: `${(timeLeft / 25) * 100}%` }} transition={{ duration: 0.1, ease: "linear" }} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {questions[currentIdx].options.map((opt, i) => {
                    const isCorrect = i === questions[currentIdx].correct;
                    const isSelected = selected === i;
                    let style = "bg-white border-slate-200 text-[#1A365D] hover:border-[#1A365D] hover:bg-slate-50 shadow-sm";
                    if (isSelected && evaluation === 'thinking') style = "bg-[#C5A059] border-[#C5A059] text-white shadow-xl scale-[0.98]";
                    if (evaluation === 'correct' && isCorrect) style = "bg-green-500 border-green-500 text-white shadow-2xl scale-[1.05]";
                    if (evaluation === 'wrong' && isSelected && !isCorrect) style = "bg-red-600 border-red-600 text-white";
                    if (selected !== null && !isSelected && !(evaluation === 'correct' && isCorrect)) style += " opacity-20 grayscale-[0.5] pointer-events-none";
                    return (
                      <motion.button key={i} disabled={selected !== null} onClick={() => handleAnswer(i)} animate={evaluation === 'wrong' && isSelected ? { x: [-5, 5, -5, 5, 0] } : {}} className={`p-8 rounded-[2rem] border-2 transition-all text-left flex items-center gap-6 ${style}`}>
                        <span className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-xs ${isSelected || (evaluation === 'correct' && isCorrect) ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>{String.fromCharCode(65 + i)}</span>
                        <span className="font-bold text-xl leading-tight">{opt}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : gameState === 'lost' ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-2xl bg-white p-16 rounded-[4rem] shadow-2xl border-t-[12px] border-red-500">
                <h2 className="text-6xl font-serif mb-4 font-bold text-red-600 italic">Helaas...</h2>
                <p className="text-slate-500 text-xl mb-6 uppercase tracking-widest">Je strandt op {currentIdx > 0 ? MONEY_LADDER[currentIdx-1] : "€ 0"}</p>
                {renderShareButton()}
                <div className="bg-slate-50 p-8 rounded-3xl my-8 text-left border-l-4 border-[#C5A059]">
                    <p className="italic text-slate-600 text-lg leading-relaxed">{questions[currentIdx]?.basis}</p>
                </div>
                <button onClick={startGame} className="px-16 py-6 bg-[#1A365D] text-white rounded-full font-black text-xl hover:scale-105 transition-all shadow-xl">NIEUWE POGING</button>
              </motion.div>
            ) : gameState === 'won' ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                <h2 className="text-9xl font-serif mb-6 text-[#C5A059] font-black italic">MILJONAIR!</h2>
                <p className="text-slate-500 text-2xl mb-12 font-bold uppercase tracking-widest text-white drop-shadow-lg">Je hebt de Miljoen gehaald!</p>
                <div className="flex flex-col gap-4 items-center">
                  {renderShareButton()}
                  <button onClick={startGame} className="px-16 py-6 bg-green-600 text-white rounded-full font-black text-xl shadow-2xl hover:scale-105 transition-all">SPEEL OPNIEUW</button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="w-80 bg-white border-l border-slate-100 p-12 hidden lg:flex flex-col-reverse justify-center gap-1">
          {MONEY_LADDER.map((amount, index) => {
            const isCurrent = index === currentIdx;
            const isDone = index < currentIdx;
            return (
              <motion.div key={amount} animate={isCurrent ? { x: 10 } : { x: 0 }} className={`flex justify-between items-center py-3 px-5 rounded-2xl transition-all border ${isCurrent ? 'bg-[#1A365D] text-white border-[#1A365D] shadow-xl scale-110 z-10' : isDone ? 'text-slate-200 border-transparent' : 'text-slate-400 border-transparent opacity-60'}`}>
                <span className={`text-[10px] font-black ${isCurrent ? 'text-[#C5A059]' : ''}`}>{index + 1}</span>
                <span className="text-base font-bold tracking-tighter">{amount}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Miljoenenjacht;