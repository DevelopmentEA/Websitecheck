import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'; // <--- AANGEPAST
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Calculator, FileText, MessageSquare, 
  Menu, Settings, ChevronLeft, ChevronRight, AlertCircle,
  RotateCcw, Eye, EyeOff, CheckCircle2, XCircle, Info, Check, LogOut, Home
} from 'lucide-react';

// masterData import is VERWIJDERD

export default function LawbooksTentamenSimulator() {
  const { subjectSlug } = useParams();
  const navigate = useNavigate();
  
  // --- AANGEPAST DEEL START ---
  // Haal data uit de context van App.jsx
  const { db, config } = useOutletContext();

  // Map de variabelen zodat de rest van je script ongewijzigd blijft
  const activeSubject = config;
  const questionsDb = db || {};
  // --- AANGEPAST DEEL EIND ---
  
  const lbBlue = "#002C5B"; 
  const lbOrange = "#F39200";

  // --- STATES ---
  const [gameState, setGameState] = useState('intro');
  const [questions, setQuestions] = useState({ mk: [], open: null });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); 
  const [openAnswer, setOpenAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60); 
  const [openMarkers, setOpenMarkers] = useState([false, false, false, false]);
  const [showReview, setShowReview] = useState(false);
  
  // Modals
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);

  const storageKey = `exam_session_${subjectSlug}`;

  // --- PERSISTENCE ---
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
    let timer;
    if (gameState === 'exam' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft <= 0 && gameState === 'exam') {
      confirmSubmit();
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
    setOpenMarkers([false, false, false, false]);
    setTimeLeft(3 * 60 * 60);
    setGameState('exam');
  };

  const confirmSubmit = () => {
    setShowSubmitConfirm(false);
    
    // Check of er iets is ingevuld
    const hasAnswers = Object.keys(answers).length > 0 || openAnswer.trim().length > 0;
    
    if (!hasAnswers) {
      setShowEmptyConfirm(true);
    } else {
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

  const toggleMarker = (index) => {
    const newMarkers = [...openMarkers];
    newMarkers[index] = !newMarkers[index];
    setOpenMarkers(newMarkers);
  };

  const calculateResult = () => {
    const N = 30; 
    const k = 4;  
    const G = N / k; 
    const CesuurX = G + 0.5 * (N - G); 
    
    let rawScore = 0;
    questions.mk.forEach((q, idx) => {
      if (answers[idx] === q.c) rawScore++;
    });

    let mkGrade = 1;
    if (rawScore <= G) {
      mkGrade = 1.0;
    } else if (rawScore > G && rawScore <= CesuurX) {
      mkGrade = 1 + 5 * (rawScore - G) / (CesuurX - G);
    } else {
      mkGrade = 6 + 4 * (rawScore - CesuurX) / (N - CesuurX);
    }

    const openPoints = openMarkers.filter(m => m === true).length * 5;
    const openGrade = (openPoints / 20) * 9 + 1;
    const finalGrade = (mkGrade * 0.8) + (openGrade * 0.2);
    
    return { 
      rawScore, 
      mkGrade: mkGrade.toFixed(2), 
      openPoints,
      openGrade: openGrade.toFixed(1),
      finalGrade: Math.max(1, Math.min(10, finalGrade)).toFixed(1) 
    };
  };

  if (!activeSubject) return null;

  return (
    <div className="min-h-screen bg-white text-[#333] font-sans selection:bg-orange-100">
      <style>{`
        ::-webkit-scrollbar { display: none !important; }
        * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}</style>
      
      {/* HEADER */}
      <header style={{ backgroundColor: lbBlue }} className="h-[64px] flex items-center justify-between px-6 text-white fixed top-0 w-full z-[100] shadow-lg">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="opacity-70">Digital assignment</span> 
          <ChevronRight size={14} className="opacity-40" />
          <span className="font-semibold tracking-tight">{activeSubject.title}</span>
          <span className="ml-4 opacity-50 text-[11px] font-mono">LB-REV-2026</span>
        </div>
        
        <div className="flex items-center gap-6">
          <span className="text-sm opacity-90 hidden md:block">{new Date().toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          <div className="flex gap-4 opacity-70">
            <Calculator size={19} className="cursor-pointer hover:opacity-100 transition-opacity" />
            <FileText size={19} className="cursor-pointer hover:opacity-100 transition-opacity" />
            <MessageSquare size={19} className="cursor-pointer hover:opacity-100 transition-opacity" />
            <Menu size={19} className="cursor-pointer hover:opacity-100 transition-opacity" />
            <Settings size={19} className="cursor-pointer hover:opacity-100 transition-opacity" />
          </div>
          <button onClick={() => setShowSubmitConfirm(true)} className="bg-[#FFCC99] text-[#002C5B] px-6 py-1.5 rounded-md font-bold text-sm hover:brightness-110 transition-all active:scale-95">Submit</button>
        </div>
      </header>

      <div className="h-[48px] border-b border-slate-200 bg-white flex items-center justify-center fixed top-[64px] w-full z-[90]">
        <span className="text-[#5D2EDD] font-bold text-[13px] uppercase tracking-wider" style={{ color: lbBlue }}>Digital test</span>
      </div>

      <main className="pt-[140px] pb-[120px] max-w-5xl mx-auto px-12">
        {gameState === 'intro' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="inline-block px-4 py-1 rounded-full bg-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">Exam Simulator v2.4</div>
            <h1 className="text-5xl font-black mb-4 tracking-tighter" style={{ color: lbBlue }}>{activeSubject.title}</h1>
            <p className="text-slate-400 mb-12 text-lg">Dit tentamen bestaat uit <strong>30 meerkeuzevragen</strong> en <strong>1 open casusvraag</strong>.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left max-w-3xl mx-auto">
              <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50">
                <Info size={20} className="mb-3 text-blue-500" />
                <h4 className="font-bold text-sm mb-1">Gokkanscorrectie</h4>
                <p className="text-xs text-slate-500">Correctie toegepast bij MK. Cesuur ligt op 18.75 punten voor een 6.0.</p>
              </div>
              <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50">
                <CheckCircle2 size={20} className="mb-3 text-emerald-500" />
                <h4 className="font-bold text-sm mb-1">Weging</h4>
                <p className="text-xs text-slate-500">Meerkeuze telt voor 80%, de open casus voor 20% van het eindcijfer.</p>
              </div>
              <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50">
                <RotateCcw size={20} className="mb-3 text-orange-500" />
                <h4 className="font-bold text-sm mb-1">Self-Grading</h4>
                <p className="text-xs text-slate-500">Beoordeel de open vraag zelf aan de hand van 4 essentiële markers.</p>
              </div>
            </div>
            <button onClick={startNewExam} className="text-white px-16 py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-[1.02] transition-all active:scale-95" style={{ backgroundColor: lbBlue }}>Start de simulatie</button>
          </motion.div>
        )}

        {gameState === 'exam' && (
          <div className="animate-fadeIn">
            <div className="mb-8">
               {currentIdx < 30 ? (
                 <motion.div key={currentIdx} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="relative flex group">
                    <div className="w-16 pt-1 text-[14px] text-slate-400 font-bold">1.0p</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-8">
                        <h3 className="text-[17px] font-bold leading-relaxed text-slate-800">
                          <span className="mr-3">{currentIdx + 1}</span> 
                          {questions.mk[currentIdx]?.q}
                        </h3>
                      </div>
                      <div className="space-y-4 ml-1">
                        {questions.mk[currentIdx]?.a.map((opt, i) => (
                          <div key={i} onClick={() => setAnswers({...answers, [currentIdx]: i})} className="flex items-center gap-4 cursor-pointer group/opt">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${answers[currentIdx] === i ? 'border-[#002C5B] shadow-inner' : 'border-slate-200 group-hover/opt:border-slate-300'}`} style={answers[currentIdx] === i ? {borderColor: lbBlue} : {}}>
                              {answers[currentIdx] === i && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lbBlue }} />}
                            </div>
                            <span className={`text-[16px] transition-colors ${answers[currentIdx] === i ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>{opt}</span>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setCurrentIdx(prev => prev + 1)} className="mt-12 bg-[#002C5B] text-white px-10 py-3 rounded-xl font-bold text-sm hover:brightness-110 transition-all active:scale-95 flex items-center gap-2">Volgende vraag <ChevronRight size={16} /></button>
                    </div>
                 </motion.div>
               ) : (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pl-16">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center"><FileText size={18}/></div>
                      <h3 className="text-xl font-black tracking-tight">Casusvraag</h3>
                    </div>
                    <p className="mb-8 text-slate-700 text-lg leading-relaxed font-serif p-8 bg-slate-50 rounded-2xl border border-slate-100">{questions.open?.q}</p>
                    <textarea value={openAnswer} onChange={(e) => setOpenAnswer(e.target.value)} className="w-full h-96 p-8 border-2 border-slate-100 rounded-3xl focus:border-slate-200 outline-none font-serif text-xl leading-relaxed shadow-inner bg-white" placeholder="Typ hier je volledige juridische analyse..." />
                 </motion.div>
               )}
            </div>
          </div>
        )}

        {gameState === 'eval_open' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-6">
             <h2 className="text-3xl font-black mb-8 tracking-tighter" style={{ color: lbBlue }}>Zelf-beoordeling Casus</h2>
             <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-3 tracking-widest">Jouw antwoord</h4>
                  <div className="text-sm text-slate-600 font-serif leading-relaxed h-48 overflow-y-auto italic">"{openAnswer || "Geen antwoord ingevuld."}"</div>
                </div>
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <h4 className="text-[10px] uppercase font-bold text-emerald-600 mb-3 tracking-widest">Modelantwoord</h4>
                  <div className="text-sm text-emerald-900 font-bold leading-relaxed h-48 overflow-y-auto">{questions.open?.sample}</div>
                </div>
             </div>
             <div className="bg-white border-2 border-slate-100 p-10 rounded-[2.5rem] shadow-sm mb-12">
               <h3 className="text-center font-bold text-lg mb-8">Welke elementen heb je verwerkt?</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {questions.open?.checklist?.slice(0, 4).map((item, i) => (
                   <button key={i} onClick={() => toggleMarker(i)} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${openMarkers[i] ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openMarkers[i] ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300'}`}>{openMarkers[i] ? <Check size={18} strokeWidth={3} /> : i + 1}</div>
                     <div>
                        <div className={`text-sm font-bold ${openMarkers[i] ? 'text-emerald-900' : 'text-slate-600'}`}>{item}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">+5 Punten</div>
                     </div>
                   </button>
                 ))}
               </div>
               <div className="mt-10 text-center">
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Totaalscore Casus</div>
                 <div className="text-4xl font-black">{openMarkers.filter(m => m).length * 5} <span className="text-slate-300">/ 20</span></div>
               </div>
             </div>
             <button onClick={() => { setGameState('results'); localStorage.removeItem(storageKey); confetti({ particleCount: 150, spread: 70 }); }} className="w-full py-5 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:brightness-110 transition-all active:scale-[0.98]" style={{ backgroundColor: lbBlue }}>Bekijk mijn resultaat</button>
          </motion.div>
        )}

        {gameState === 'results' && (
          <div className="space-y-8 max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border-2 border-slate-100 rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-3" style={{ backgroundColor: lbOrange }} />
                <h1 className="text-2xl font-black uppercase tracking-widest text-slate-400 mb-8">Eindresultaat</h1>
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12">
                  <div className="relative">
                    <div className="text-[130px] font-black tracking-tighter leading-none" style={{ color: lbBlue }}>{calculateResult().finalGrade}</div>
                    <div className="absolute -top-4 -right-8 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-black uppercase">{parseFloat(calculateResult().finalGrade) >= 5.5 ? 'Geslaagd' : 'Onvoldoende'}</div>
                  </div>
                  <div className="text-left space-y-4 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                    <div className="flex justify-between gap-12 text-sm">
                      <span className="text-slate-500 font-medium">MK Score (80%)</span>
                      <span className="font-black text-slate-900">{calculateResult().mkGrade}</span>
                    </div>
                    <div className="flex justify-between gap-12 text-sm border-b border-slate-200 pb-4">
                      <span className="text-slate-500 font-medium">Casus Score (20%)</span>
                      <span className="font-black text-slate-900">{calculateResult().openGrade}</span>
                    </div>
                    <div className="flex justify-between gap-12 text-xs">
                      <span className="text-slate-400 italic">MK Goed beantwoord</span>
                      <span className="font-bold text-slate-600">{calculateResult().rawScore} / 30</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <button onClick={() => setShowReview(!showReview)} className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-colors">{showReview ? <EyeOff size={18}/> : <Eye size={18}/>} Inzage MK Vragen</button>
                  <button onClick={() => { setGameState('intro'); window.scrollTo(0,0); }} className="flex-1 py-4 bg-white border-2 border-slate-200 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"><RotateCcw size={18}/> Nieuw Tentamen</button>
                </div>
                <button onClick={() => navigate('/')} className="w-full py-4 bg-red-50 text-red-600 border-2 border-red-100 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"><LogOut size={18}/> Afsluiten & Terug naar overzicht</button>
            </motion.div>
            {showReview && (
              <div className="space-y-6">
                <h3 className="text-xl font-black ml-4">Gedetailleerde Inzage</h3>
                {questions.mk.map((q, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between mb-4">
                      <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Vraag {idx + 1}</span>
                      {answers[idx] === q.c ? <span className="text-emerald-500 font-black text-[10px] flex items-center gap-1"><CheckCircle2 size={12}/> CORRECT</span> : <span className="text-red-500 font-black text-[10px] flex items-center gap-1"><XCircle size={12}/> INCORRECT</span>}
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mb-6">{q.q}</h4>
                    <div className="grid gap-2 mb-6">
                      {q.a.map((opt, i) => (
                        <div key={i} className={`p-4 rounded-xl text-sm font-medium border-2 ${i === q.c ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold' : i === answers[idx] ? 'bg-red-50 border-red-200 text-red-900 font-bold' : 'bg-white border-slate-50 text-slate-400'}`}>{opt}</div>
                      ))}
                    </div>
                    <div className="p-5 bg-slate-50 rounded-2xl border-l-4 border-[#002C5B]">
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Analyse</p>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{q.exp}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {gameState === 'exam' && (
        <footer className="fixed bottom-0 w-full h-[90px] bg-[#F8F9FA] border-t border-slate-200 flex items-center justify-between px-10 z-[100] shadow-2xl">
          <div className="flex gap-1 overflow-x-auto pb-2 max-w-[80%] no-scrollbar">
              {[...Array(30)].map((_, i) => (
                <button key={i} onClick={() => setCurrentIdx(i)} className={`min-w-[42px] h-[42px] border-2 flex items-center justify-center text-[13px] font-bold transition-all rounded-md ${currentIdx === i ? 'text-white border-[#002C5B]' : answers[i] !== undefined ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white text-slate-400 border-slate-100'}`} style={currentIdx === i ? { backgroundColor: lbBlue } : {}}>{i + 1}</button>
              ))}
              <button onClick={() => setCurrentIdx(30)} className={`min-w-[80px] h-[42px] border-2 flex items-center justify-center text-[11px] font-black uppercase tracking-widest ml-4 rounded-md transition-all ${currentIdx === 30 ? 'text-white border-[#002C5B]' : openAnswer.length > 20 ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white text-slate-400 border-slate-100'}`} style={currentIdx === 30 ? { backgroundColor: lbBlue } : {}}>Casus</button>
          </div>
          <div className="flex gap-4">
            <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(p => p - 1)} className="w-10 h-10 border-2 border-slate-200 bg-white rounded-xl flex items-center justify-center hover:bg-slate-50 disabled:opacity-20 transition-all"><ChevronLeft size={20} /></button>
            <button disabled={currentIdx === 30} onClick={() => setCurrentIdx(p => p + 1)} className="w-10 h-10 border-2 border-slate-200 bg-white rounded-xl flex items-center justify-center hover:bg-slate-50 disabled:opacity-20 transition-all"><ChevronRight size={20} /></button>
          </div>
        </footer>
      )}

      {/* --- MODALS --- */}
      <AnimatePresence>
        {/* STANDAARD SUBMIT MODAL */}
        {showSubmitConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-[#002C5B]/40 backdrop-blur-md p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white p-10 rounded-[2.5rem] max-w-md w-full shadow-2xl text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><AlertCircle size={32} /></div>
              <h3 className="text-2xl font-black mb-2 tracking-tight">Tentamen inleveren?</h3>
              <p className="text-slate-500 text-sm mb-10 leading-relaxed">Je hebt nog <strong>{formatTime(timeLeft)}</strong> over. Na inleveren kun je de MK-antwoorden niet meer wijzigen.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowSubmitConfirm(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-200 transition-colors">Annuleren</button>
                <button onClick={confirmSubmit} className="flex-1 py-4 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:brightness-110 transition-all" style={{ backgroundColor: lbBlue }}>Ja, Inleveren</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* LEEG FORMULIER MODAL (WIL JE NAAR HOME?) */}
        {showEmptyConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[210] flex items-center justify-center bg-[#002C5B]/60 backdrop-blur-xl p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] max-w-md w-full shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><Home size={32} /></div>
              <h3 className="text-2xl font-black mb-2 tracking-tight">Leeg tentamen?</h3>
              <p className="text-slate-500 text-sm mb-10 leading-relaxed">Je hebt nog geen vragen beantwoord. Wil je stoppen en terugkeren naar de homepage?</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => { localStorage.removeItem(storageKey); navigate('/'); }} className="w-full py-4 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:brightness-110 transition-all" style={{ backgroundColor: lbBlue }}>Ja, terug naar home</button>
                <button onClick={() => setShowEmptyConfirm(false)} className="w-full py-4 bg-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-200 transition-colors">Nee, ik wil verder gaan</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {gameState === 'exam' && (
        <div className="fixed top-[74px] right-8 z-[100] bg-white border-2 border-slate-100 shadow-xl px-5 py-2 rounded-full font-mono font-black text-sm flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${timeLeft < 600 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
          <span className={timeLeft < 600 ? 'text-red-600' : 'text-slate-700'}>{formatTime(timeLeft)}</span>
        </div>
      )}
    </div>
  );
}