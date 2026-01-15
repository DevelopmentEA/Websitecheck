import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  FileText, CheckCircle2, XCircle, AlertCircle, 
  Send, ChevronRight, ChevronLeft, Play, Award, 
  Clock, Info, RotateCcw, Eye, EyeOff
} from 'lucide-react';

import { masterData } from '../data/masterData';

export default function TentamenSimulator() {
  const { subjectSlug } = useParams();
  const navigate = useNavigate();
  
  const activeSubject = masterData[subjectSlug];
  const questionsDb = activeSubject?.db || {};
  const accentColor = activeSubject?.accent || "#059669";

  // --- STATES ---
  const [gameState, setGameState] = useState('intro'); // intro, exam, eval_open, results
  const [questions, setQuestions] = useState({ mk: [], open: null });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); 
  const [openAnswer, setOpenAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60); 
  const [openGrade, setOpenGrade] = useState(5); 
  const [showReview, setShowReview] = useState(false);

  const storageKey = `exam_session_${subjectSlug}`;

  // --- PERSISTENCE & INITIALISATIE ---
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setQuestions(parsed.questions);
      setAnswers(parsed.answers);
      setOpenAnswer(parsed.openAnswer);
      setTimeLeft(parsed.timeLeft);
      setGameState(parsed.gameState);
      setCurrentIdx(parsed.currentIdx);
    }
  }, [subjectSlug, storageKey]);

  useEffect(() => {
    if (gameState === 'exam') {
      const sessionData = { questions, answers, openAnswer, timeLeft, gameState, currentIdx };
      localStorage.setItem(storageKey, JSON.stringify(sessionData));
    }
  }, [answers, openAnswer, timeLeft, gameState, currentIdx, questions, storageKey]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (gameState === 'exam') {
        e.preventDefault();
        e.returnValue = 'Je voortgang gaat verloren als je de pagina nu verlaat.';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [gameState]);

  useEffect(() => {
    let timer;
    if (gameState === 'exam' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft <= 0 && gameState === 'exam') {
      submitExam();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // --- LOGICA ---
  const startNewExam = () => {
    let mkPool = [];
    let openPool = [];
    Object.keys(questionsDb).forEach(week => {
      if (questionsDb[week].MK) mkPool.push(...questionsDb[week].MK.map(q => ({...q, week})));
      if (questionsDb[week].Open) openPool.push(...questionsDb[week].Open.map(q => ({...q, week})));
    });

    if (mkPool.length < 30) return alert("Onvoldoende vragen in database.");

    const selectedMK = mkPool.sort(() => Math.random() - 0.5).slice(0, 30);
    const selectedOpen = openPool.sort(() => Math.random() - 0.5)[0];

    setQuestions({ mk: selectedMK, open: selectedOpen });
    setAnswers({});
    setOpenAnswer("");
    setTimeLeft(3 * 60 * 60);
    setGameState('exam');
  };

  const submitExam = () => {
    if (window.confirm("Wil je het tentamen definitief inleveren? De antwoorden kunnen niet meer worden gewijzigd.")) {
      setGameState('eval_open');
      window.scrollTo(0, 0);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- ACADEMISCHE SCORE BEREKENING ---
  const calculateResult = () => {
    const N = 30; // Totaal aantal vragen
    const k = 4;  // Aantal keuzemogelijkheden
    const G = N / k; // Gokbasis (7.5)
    const CesuurX = G + 0.5 * (N - G); // Punt voor een 6.0 (18.75)
    
    let rawScore = 0;
    questions.mk.forEach((q, idx) => {
      if (answers[idx] === q.c) rawScore++;
    });

    // Berekening MK cijfer op basis van cesuur
    let mkGrade = 1;
    if (rawScore <= G) {
      mkGrade = 1.0;
    } else if (rawScore > G && rawScore <= CesuurX) {
      mkGrade = 1 + 5 * (rawScore - G) / (CesuurX - G);
    } else {
      mkGrade = 6 + 4 * (rawScore - CesuurX) / (N - CesuurX);
    }

    // Totaalcijfer: 80% MK + 20% Open
    const finalGrade = (mkGrade * 0.8) + (openGrade * 0.2);
    
    return { 
      rawScore, 
      mkGrade: mkGrade.toFixed(2), 
      finalGrade: Math.max(1, Math.min(10, finalGrade)).toFixed(1) 
    };
  };

  if (!activeSubject) return null;

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-slate-900 font-sans pb-20">
      
      {/* EXAMEN HEADER */}
      {gameState === 'exam' && (
        <div className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-black uppercase text-[9px] tracking-widest text-slate-400">Examen Modus</span>
          </div>
          <div className={`px-6 py-2 rounded-full font-mono text-xl font-black ${timeLeft < 600 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-700'}`}>
             {formatTime(timeLeft)}
          </div>
          <button onClick={submitExam} className="bg-black text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">Inleveren</button>
        </div>
      )}

      <main className={`max-w-4xl mx-auto px-6 ${gameState === 'exam' ? 'pt-28' : 'pt-12'}`}>
        
        {/* 1. INTRO */}
        {gameState === 'intro' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-4xl border border-slate-100">🎓</div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">{activeSubject.title}</h1>
            <h2 className="text-xl font-bold text-slate-400 mb-12">Officieel Oefententamen Simulator</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <FileText className="mb-3 text-slate-400" />
                <p className="font-black text-[9px] uppercase text-slate-400">Onderdelen</p>
                <p className="font-bold text-sm">30 MK (80%) + Casus (20%)</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <AlertCircle className="mb-3 text-orange-400" />
                <p className="font-black text-[9px] uppercase text-slate-400">Gokcorrectie</p>
                <p className="font-bold text-sm">Actief (Cesuur bij 18.75)</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <Clock className="mb-3 text-slate-400" />
                <p className="font-black text-[9px] uppercase text-slate-400">Beschikbare Tijd</p>
                <p className="font-bold text-sm">180 minuten</p>
              </div>
            </div>

            <button onClick={startNewExam} className="w-full py-6 rounded-2xl text-white font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.01] transition-all" style={{ backgroundColor: accentColor }}>
              Start de Simulatie
            </button>
          </motion.div>
        )}

        {/* 2. EXAMEN LOOP */}
        {gameState === 'exam' && (
          <div className="space-y-10">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {[...Array(30)].map((_, i) => (
                <button key={i} onClick={() => setCurrentIdx(i)} className={`w-9 h-9 rounded-lg text-[10px] font-black transition-all border-2 ${currentIdx === i ? 'scale-110' : ''} ${answers[i] !== undefined ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-400'}`} style={currentIdx === i ? { borderColor: accentColor } : {}}>{i + 1}</button>
              ))}
              <button onClick={() => setCurrentIdx(30)} className={`px-4 h-9 rounded-lg text-[9px] font-black uppercase tracking-widest border-2 ${currentIdx === 30 ? 'scale-110' : ''} ${openAnswer.length > 50 ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-400'}`} style={currentIdx === 30 ? { borderColor: accentColor } : {}}>Casus</button>
            </div>

            {currentIdx < 30 ? (
              <motion.div key={currentIdx} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-10 rounded-[3rem] shadow-lg border border-slate-100">
                <span className="text-[10px] font-black uppercase text-slate-300 mb-4 block">Vraag {currentIdx + 1}</span>
                <h2 className="text-2xl font-black leading-tight mb-10 text-slate-800">{questions.mk[currentIdx].q}</h2>
                <div className="grid gap-3">
                  {questions.mk[currentIdx].a.map((opt, i) => (
                    <button key={i} onClick={() => setAnswers({...answers, [currentIdx]: i})} className={`w-full p-6 text-left border-2 rounded-2xl font-bold transition-all flex justify-between items-center ${answers[currentIdx] === i ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                      {opt} {answers[currentIdx] === i && <CheckCircle2 size={18} className="text-[#6EE7B7]" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-10 rounded-[3rem] shadow-lg border border-slate-100">
                <h2 className="text-2xl font-black leading-tight mb-8">{questions.open.q}</h2>
                <textarea value={openAnswer} onChange={(e) => setOpenAnswer(e.target.value)} placeholder="Schrijf je antwoord hier..." className="w-full h-96 p-8 rounded-3xl border-2 border-slate-100 focus:border-slate-300 outline-none transition-all font-medium text-lg resize-none shadow-inner bg-slate-50/50" />
              </motion.div>
            )}
            
            <div className="flex justify-between mt-6">
              <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(prev => prev - 1)} className="px-6 py-3 font-black text-[10px] uppercase text-slate-400 disabled:opacity-0">Vorige</button>
              <button disabled={currentIdx === 30} onClick={() => setCurrentIdx(prev => prev + 1)} className="px-6 py-3 font-black text-[10px] uppercase text-slate-800 disabled:opacity-0">Volgende</button>
            </div>
          </div>
        )}

        {/* 3. EVALUATIE OPEN VRAAG */}
        {gameState === 'eval_open' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
            <h2 className="text-3xl font-black mb-10 italic uppercase tracking-tighter">Zelf-beoordeling</h2>
            <div className="grid md:grid-cols-2 gap-10 mb-12">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 mb-3">Jouw uitwerking</p>
                <div className="p-6 bg-slate-50 rounded-2xl text-slate-600 text-sm italic h-64 overflow-y-auto border border-slate-100">{openAnswer || "Geen antwoord ingevuld."}</div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-[#059669] mb-3">Modelantwoord</p>
                <div className="p-6 bg-emerald-50 rounded-2xl text-emerald-900 font-bold text-sm h-64 overflow-y-auto border border-emerald-100">{questions.open.sample}</div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl mb-12 border border-slate-100">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-4 text-center tracking-widest">Checklist Kernpunten</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {questions.open.checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl text-xs font-bold border border-slate-100 shadow-sm">
                    <div className="w-5 h-5 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">✓</div> {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <p className="font-black uppercase text-xs mb-6">Ken jezelf een score toe voor de casus (0-10)</p>
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {[...Array(11)].map((_, i) => (
                  <button key={i} onClick={() => setOpenGrade(i)} className={`w-10 h-10 rounded-lg font-black text-sm transition-all ${openGrade === i ? 'bg-black text-white scale-110 shadow-lg' : 'bg-slate-100 text-slate-400'}`}>{i}</button>
                ))}
              </div>
              <button onClick={() => { setGameState('results'); localStorage.removeItem(storageKey); confetti({ particleCount: 200, spread: 100 }); }} className="w-full py-5 text-white font-black uppercase rounded-2xl shadow-xl hover:scale-[1.01] transition-all" style={{ backgroundColor: accentColor }}>Bekijk Resultaten</button>
            </div>
          </motion.div>
        )}

        {/* 4. RESULTATEN & INZAGE */}
        {gameState === 'results' && (
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-3" style={{ backgroundColor: accentColor }} />
               <h1 className="text-6xl font-black tracking-tighter uppercase italic mb-10">Resultaat</h1>
               <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-12">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Eindcijfer</p>
                    <div className="text-9xl font-black tracking-tighter italic" style={{ color: accentColor }}>{calculateResult().finalGrade}</div>
                  </div>
                  <div className="text-left bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest text-center">Specificaties</p>
                    <div className="space-y-4">
                      <div className="flex justify-between gap-10"><span>MK Punten</span><span className="font-black text-slate-900">{calculateResult().rawScore} / 30</span></div>
                      <div className="flex justify-between gap-10"><span>MK Cijfer (80%)</span><span className="font-black text-slate-900">{calculateResult().mkGrade} / 10</span></div>
                      <div className="flex justify-between gap-10"><span>Casus Cijfer (20%)</span><span className="font-black text-slate-900">{openGrade}.0 / 10</span></div>
                    </div>
                  </div>
               </div>
               <div className="flex flex-col md:flex-row gap-4">
                 <button onClick={() => setShowReview(!showReview)} className="flex-1 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-2">
                   {showReview ? <EyeOff size={16}/> : <Eye size={16}/>} {showReview ? "Inzage Sluiten" : "Inzage MK Vragen"}
                 </button>
                 <button onClick={() => { setGameState('intro'); window.scrollTo(0,0); }} className="flex-1 py-5 bg-white border-2 border-slate-100 font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-2"><RotateCcw size={16}/> Nieuw Tentamen</button>
               </div>
            </motion.div>

            {/* INZAGE SECTIE */}
            <AnimatePresence>
              {showReview && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="space-y-6">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter ml-4">Inzage Meerkeuze</h3>
                  {questions.mk.map((q, idx) => {
                    const isCorrect = answers[idx] === q.c;
                    return (
                      <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="flex justify-between mb-4">
                          <span className="text-[10px] font-black uppercase text-slate-400">Vraag {idx + 1}</span>
                          {isCorrect ? <span className="text-emerald-500 font-black text-[10px] flex items-center gap-1"><CheckCircle2 size={12}/> CORRECT</span> : <span className="text-red-500 font-black text-[10px] flex items-center gap-1"><XCircle size={12}/> INCORRECT</span>}
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 mb-6">{q.q}</h4>
                        <div className="grid gap-2 mb-6">
                          {q.a.map((opt, i) => (
                            <div key={i} className={`p-4 rounded-xl text-sm font-medium border ${i === q.c ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold' : i === answers[idx] ? 'bg-red-50 border-red-200 text-red-900' : 'bg-slate-50 border-transparent text-slate-400'}`}>
                              {opt}
                            </div>
                          ))}
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border-l-4 border-slate-800">
                          <p className="text-[10px] font-black uppercase text-slate-400 mb-1 italic">Analyse</p>
                          <p className="text-sm text-slate-600 font-medium leading-relaxed">{q.exp}</p>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}