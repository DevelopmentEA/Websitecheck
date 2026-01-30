import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Calculator, FileText, MessageSquare, 
  Menu, Settings, ChevronLeft, ChevronRight, AlertCircle,
  RotateCcw, Eye, EyeOff, CheckCircle2, XCircle, Info, Check, LogOut, Home, Quote, ShieldAlert, Scale
} from 'lucide-react';

export default function LawbooksTentamenSimulator() {
  const { subjectSlug } = useParams();
  const navigate = useNavigate();
  // STAD toegevoegd aan de context destructurering voor de navigatie-fix
  const { db, config, stad } = useOutletContext();

  const activeSubject = config;
  const questionsDb = db || {};
  
  const lbBlue = "#002C5B"; 
  const lbOrange = "#F39200";

  // --- 1. DYNAMISCHE CONFIGURATIE ---
  const examSettings = useMemo(() => ({
    durationMinutes: activeSubject?.examConfig?.durationMinutes || 180,
    mkCount: activeSubject?.examConfig?.mkCount ?? 30,
    openCount: activeSubject?.examConfig?.openCount ?? 1,
    mkWeight: activeSubject?.examConfig?.mkWeight ?? 0.8,
    openWeight: activeSubject?.examConfig?.openWeight ?? 0.2,
    cesuurFactor: activeSubject?.examConfig?.cesuurFactor ?? 0.5,
    scopes: activeSubject?.examConfig?.scopes || null,
  }), [activeSubject]);

  // --- 2. STATES ---
  const [gameState, setGameState] = useState('disclaimer'); 
  const [questions, setQuestions] = useState({ mk: [], open: [] });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); 
  const [openAnswers, setOpenAnswers] = useState({}); 
  const [timeLeft, setTimeLeft] = useState(examSettings.durationMinutes * 60); 
  const [openMarkers, setOpenMarkers] = useState({}); 
  const [showReview, setShowReview] = useState(false);
  const [iconFeedback, setIconFeedback] = useState(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);

  const [selectedScope, setSelectedScope] = useState(
    examSettings.scopes ? Object.keys(examSettings.scopes)[0] : 'Volledig'
  );

  const storageKey = `exam_session_v4_${subjectSlug}`;

  // --- 3. PERSISTENCE ---
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setQuestions(parsed.questions);
      setAnswers(parsed.answers);
      setOpenAnswers(parsed.openAnswers || {});
      setTimeLeft(parsed.timeLeft);
      setGameState(parsed.gameState);
      setCurrentIdx(parsed.currentIdx);
      setOpenMarkers(parsed.openMarkers || {});
    }
  }, [subjectSlug, storageKey]);

  useEffect(() => {
    if (gameState === 'exam') {
      const sessionData = { questions, answers, openAnswers, timeLeft, gameState, currentIdx, openMarkers };
      localStorage.setItem(storageKey, JSON.stringify(sessionData));
    }
  }, [answers, openAnswers, timeLeft, gameState, currentIdx, questions, openMarkers, storageKey]);

  useEffect(() => {
    let timer;
    if (gameState === 'exam' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft <= 0 && gameState === 'exam') {
      confirmSubmit();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // --- 4. CORE LOGICA ---
  const startNewExam = () => {
    let mkPool = [];
    let openPool = [];

    const foldersToInclude = examSettings.scopes 
      ? examSettings.scopes[selectedScope] 
      : Object.keys(questionsDb);

    foldersToInclude.forEach(folderName => {
      const folderData = questionsDb[folderName];
      if (folderData) {
        if (folderData.MK) mkPool.push(...folderData.MK.map(q => ({...q, week: folderName})));
        if (folderData.Open) openPool.push(...folderData.Open.map(q => ({...q, week: folderName})));
      }
    });

    if (mkPool.length < examSettings.mkCount || openPool.length < examSettings.openCount) {
      return alert(`Onvoldoende vragen in de geselecteerde modules. Nodig: ${examSettings.mkCount}MK, gevonden: ${mkPool.length}.`);
    }

    const selectedMK = mkPool.sort(() => Math.random() - 0.5).slice(0, examSettings.mkCount);
    const selectedOpen = openPool.sort(() => Math.random() - 0.5).slice(0, examSettings.openCount);

    setQuestions({ mk: selectedMK, open: selectedOpen });
    setAnswers({});
    setOpenAnswers({});
    setOpenMarkers({});
    setTimeLeft(examSettings.durationMinutes * 60);
    setGameState('exam');
    setCurrentIdx(0);
  };

  const confirmSubmit = () => {
    setShowSubmitConfirm(false);
    setGameState(examSettings.openCount > 0 ? 'eval_open' : 'results');
    window.scrollTo(0, 0);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const calculateResult = () => {
    const { mkCount, openCount, mkWeight, openWeight, cesuurFactor } = examSettings;
    let mkGrade = 1.0;
    let rawScore = 0;
    if (mkCount > 0) {
      questions.mk.forEach((q, idx) => { if (answers[idx] === q.c) rawScore++; });
      const G = mkCount / 4; 
      const CesuurX = G + cesuurFactor * (mkCount - G);
      if (rawScore <= G) mkGrade = 1.0;
      else if (rawScore <= CesuurX) mkGrade = 1 + 5 * (rawScore - G) / (CesuurX - G);
      else mkGrade = 6 + 4 * (rawScore - CesuurX) / (mkCount - CesuurX);
    }
    let openGrade = 1.0;
    if (openCount > 0) {
      const totalPossibleMarkers = openCount * 4;
      const positiveMarkers = Object.values(openMarkers).filter(v => v === true).length;
      openGrade = (positiveMarkers / totalPossibleMarkers) * 9 + 1;
    }
    const weightedGrade = (mkCount > 0 && openCount > 0) 
      ? (mkGrade * mkWeight) + (openGrade * openWeight)
      : (mkCount > 0 ? mkGrade : openGrade);
    return { 
      rawScore, 
      mkGrade: mkGrade.toFixed(2), 
      openGrade: openGrade.toFixed(2),
      finalGrade: Math.max(1, Math.min(10, weightedGrade)).toFixed(2)
    };
  };

  const getPhilosophicalFeedback = (grade) => {
    const g = parseFloat(grade);
    if (g < 3) return { title: "Oei, een juridisch drama...", msg: "Zelfs de natuurtoestand van Hobbes was minder chaotisch dan dit.", quote: "The life of man, solitary, poor, nasty, brutish, and short.", author: "Thomas Hobbes" };
    if (g < 5.5) return { title: "Bijna, maar toch niet.", msg: "Dura lex, sed lex. De wet is hard, maar dit cijfer is harder. Pak die Lawbooks er nog eens bij.", quote: "Onrechtvaardigheid is het gebrek aan rechtvaardigheid in de toepassing van de wet.", author: "Gustav Radbruch" };
    if (g < 8) return { title: "De 'Redelijke Man'", msg: "Gefeliciteerd! Je bent precies de 'Redelijke Persoon' waar de Hoge Raad het over heeft.", quote: "Justice is the first virtue of social institutions.", author: "John Rawls" };
    return { title: "Cum Laude Materiaal!", msg: "Hugo de Groot zou trots op je zijn. Je hebt het recht beheerst.", quote: "He who knows not the reason of the law, knows not the law.", author: "Sir Edward Coke" };
  };

  const handleIconClick = (type) => {
    const feedbacks = {
      calc: "Het is rechten hè, geen wiskunde. Leg die calculator maar snel weg.",
      notes: "Een goed jurist heeft een fotografisch geheugen (of een heel goede samenvatting van Lawbooks).",
      chat: "Niet spieken! De tuchtcommissie kijkt mee via de webcam...",
      menu: "Zoek je de uitgang? Die vind je pas als de wetbundel uit je hoofd is geleerd.",
      settings: "Je kunt de moeilijkheidsgraad niet aanpassen. Helaas."
    };
    setIconFeedback(feedbacks[type]);
    setTimeout(() => setIconFeedback(null), 3000);
  };

  const isExamComplete = useMemo(() => {
    const mkDone = Object.keys(answers).length === examSettings.mkCount;
    // TRIGGER: Nu veranderd van > 5 naar > 0 tekens
    const openDone = Object.keys(openAnswers).length === examSettings.openCount && 
                     Object.values(openAnswers).every(v => v.trim().length > 0);
    return mkDone && openDone;
  }, [answers, openAnswers, examSettings]);

  if (!activeSubject) return null;

  return (
    <div className="min-h-screen bg-white text-[#333] font-sans selection:bg-orange-100">
      <style>{` ::-webkit-scrollbar { display: none !important; } * { -ms-overflow-style: none !important; scrollbar-width: none !important; } `}</style>
      
      <header style={{ backgroundColor: lbBlue }} className="h-[64px] flex items-center justify-between px-6 text-white fixed top-0 w-full z-[100] shadow-lg">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="opacity-70">Digital assignment</span> 
          <ChevronRight size={14} className="opacity-40" />
          <span className="font-semibold tracking-tight">{activeSubject.title}</span>
          <span className="ml-4 opacity-50 text-[11px] font-mono">LB-REV-2026</span>
        </div>
        {gameState === 'exam' && (
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/20 border border-white/10 px-5 py-1.5 rounded-full font-mono font-black text-sm">
            <div className={`w-2.5 h-2.5 rounded-full ${timeLeft < 600 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span className={timeLeft < 600 ? 'text-red-400' : 'text-white'}>{formatTime(timeLeft)}</span>
          </div>
        )}
        <div className="flex items-center gap-6">
          <AnimatePresence>
            {iconFeedback && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="absolute top-20 right-6 bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xl border-2 border-white">
                {iconFeedback}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex gap-4 opacity-70">
            <Calculator onClick={() => handleIconClick('calc')} size={19} className="cursor-pointer hover:opacity-100 transition-opacity" />
            <FileText onClick={() => handleIconClick('notes')} size={19} className="cursor-pointer hover:opacity-100 transition-opacity" />
            <MessageSquare onClick={() => handleIconClick('chat')} size={19} className="cursor-pointer hover:opacity-100 transition-opacity" />
            <Menu onClick={() => handleIconClick('menu')} size={19} className="cursor-pointer hover:opacity-100 transition-opacity" />
            <Settings onClick={() => handleIconClick('settings')} size={19} className="cursor-pointer hover:opacity-100 transition-opacity" />
          </div>
          {gameState === 'exam' && (
            <button onClick={() => isExamComplete ? setShowSubmitConfirm(true) : setShowEmptyConfirm(true)} className={`${isExamComplete ? 'bg-[#FFCC99] text-[#002C5B]' : 'bg-white/10 text-white border border-white/20'} px-6 py-1.5 rounded-md font-bold text-sm transition-all active:scale-95`}>
              {isExamComplete ? 'Inleveren' : 'Exit'}
            </button>
          )}
        </div>
      </header>

      <div className="h-[48px] border-b border-slate-200 bg-white flex items-center justify-center fixed top-[64px] w-full z-[90]">
        <span className="text-[#5D2EDD] font-bold text-[13px] uppercase tracking-wider" style={{ color: lbBlue }}>Digital test simulation</span>
      </div>

      <main className="pt-[140px] pb-[120px] max-w-5xl mx-auto px-12">
        
        {/* DISCLAIMER SECTIE */}
        {gameState === 'disclaimer' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto py-10">
            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: lbOrange }} />
              <div className="flex justify-center mb-8"><div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-[#002C5B]"><ShieldAlert size={40} /></div></div>
              <h2 className="text-3xl font-black text-center mb-6 tracking-tight" style={{ color: lbBlue }}>Belangrijke Informatie</h2>
              <div className="space-y-6 text-slate-600 leading-relaxed mb-10">
                <div className="flex gap-4"><div className="mt-1 text-orange-500"><AlertCircle size={20} /></div><p className="text-sm">Volg altijd de instructies en richtlijnen van je <strong>universiteit.</strong> Toetsregels, aanwijzingen en beoordelingscriteria van jouw opleiding zijn te allen tijde leidend.</p></div>
                <div className="flex gap-4"><div className="mt-1 text-orange-500"><AlertCircle size={20} /></div><p className="text-sm">De vragen zijn gebaseerd op eigen <strong> Lawbooks-content.</strong> We hebben daarbij gestreefd naar een zo natuurgetrouw mogelijke weergave van een echt tentamen, maar inhoud en vraagstelling van universitaire tentamens kunnen jaarlijks wijzigen.</p></div>
                <div className="flex gap-4"><div className="mt-1 text-orange-500"><AlertCircle size={20} /></div><p className="text-sm">Deze oefentool is geen vervanging of exacte kopie van een echt tentamen. Gebruik de simulator uitsluitend om te oefenen en je tijdmanagement te verbeteren.</p></div>
              </div>
              <button onClick={() => setGameState('intro')} className="w-full py-4 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:brightness-110 transition-all" style={{ backgroundColor: lbBlue }}>Ik begrijp het, ga verder</button>
            </div>
          </motion.div>
        )}

        {/* INTRO SCREEN */}
        {gameState === 'intro' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="inline-block px-4 py-1 rounded-full bg-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">Exam Simulator v2.5</div>
            <h1 className="text-5xl font-black mb-4 tracking-tighter" style={{ color: lbBlue }}>{activeSubject.title}</h1>
            {examSettings.scopes && (
              <div className="flex justify-center items-center gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit mx-auto border border-slate-200">
                {Object.keys(examSettings.scopes).map((scope) => (
                  <button key={scope} onClick={() => setSelectedScope(scope)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedScope === scope ? 'bg-white text-[#002C5B] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{scope}</button>
                ))}
              </div>
            )}
            <p className="text-slate-400 mb-12 text-lg">Dit tentamen bestaat uit <strong>{examSettings.mkCount} meerkeuzevragen</strong> en <strong>{examSettings.openCount} open casusvragen</strong>.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left max-w-3xl mx-auto">
              <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50"><Info size={20} className="mb-3 text-blue-500" /><h4 className="font-bold text-sm mb-1">Gokkanscorrectie</h4><p className="text-xs text-slate-500">Volledige ICLON-methode.</p></div>
              <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50"><CheckCircle2 size={20} className="mb-3 text-emerald-500" /><h4 className="font-bold text-sm mb-1">Weging</h4><p className="text-xs text-slate-500">MK: {examSettings.mkWeight * 100}% | Casus: {examSettings.openWeight * 100}%</p></div>
              <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50"><RotateCcw size={20} className="mb-3 text-orange-500" /><h4 className="font-bold text-sm mb-1">Precisie</h4><p className="text-xs text-slate-500">Nauwkeurige zelf-evaluatie.</p></div>
            </div>
            <button onClick={startNewExam} className="text-white px-16 py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-[1.02] transition-all" style={{ backgroundColor: lbBlue }}>Start de simulatie</button>
          </motion.div>
        )}

        {/* EXAM SCREEN */}
        {gameState === 'exam' && (
          <div className="animate-fadeIn">
            <div className="mb-8">
                {currentIdx < examSettings.mkCount ? (
                  <motion.div key={currentIdx} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="relative flex group">
                    <div className="w-16 pt-1 text-[14px] text-slate-400 font-bold">1.0p</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-8"><h3 className="text-[17px] font-bold leading-relaxed text-slate-800"><span className="mr-3">{currentIdx + 1}</span>{questions.mk[currentIdx]?.q}</h3></div>
                      <div className="space-y-4 ml-1">
                        {questions.mk[currentIdx]?.a.map((opt, i) => (
                          <div key={i} onClick={() => setAnswers({...answers, [currentIdx]: i})} className="flex items-center gap-4 cursor-pointer group/opt">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${answers[currentIdx] === i ? 'border-[#002C5B] shadow-inner' : 'border-slate-200'}`} style={answers[currentIdx] === i ? {borderColor: lbBlue} : {}}>{answers[currentIdx] === i && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lbBlue }} />}</div>
                            <span className={`text-[16px] ${answers[currentIdx] === i ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>{opt}</span>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setCurrentIdx(prev => prev + 1)} className="mt-12 bg-[#002C5B] text-white px-10 py-3 rounded-xl font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2">{currentIdx === examSettings.mkCount - 1 ? "Naar de Casus" : "Volgende vraag"} <ChevronRight size={16} /></button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pl-16">
                    <div className="flex items-center gap-3 mb-6"><div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center"><FileText size={18}/></div><h3 className="text-xl font-black">Casusvraag {currentIdx - examSettings.mkCount + 1}</h3></div>
                    <p className="mb-8 text-slate-700 text-lg leading-relaxed font-serif p-8 bg-slate-50 rounded-2xl border border-slate-100">{questions.open[currentIdx - examSettings.mkCount]?.q}</p>
                    <textarea value={openAnswers[currentIdx - examSettings.mkCount] || ""} onChange={(e) => setOpenAnswers({...openAnswers, [currentIdx - examSettings.mkCount]: e.target.value})} className="w-full h-96 p-8 border-2 border-slate-100 rounded-3xl focus:border-slate-200 outline-none font-serif text-xl leading-relaxed bg-white" placeholder="Typ hier je volledige juridische analyse..." />
                  </motion.div>
                )}
            </div>
          </div>
        )}

        {/* EVAL OPEN SCREEN */}
        {gameState === 'eval_open' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-6">
             <h2 className="text-3xl font-black mb-8 tracking-tighter" style={{ color: lbBlue }}>Zelf-beoordeling Casus</h2>
             {questions.open.map((q, qIdx) => (
               <div key={qIdx} className="mb-16 border-b border-slate-100 pb-12">
                 <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100"><h4 className="text-[10px] uppercase font-bold text-slate-400 mb-3 tracking-widest">Jouw antwoord</h4><div className="text-sm text-slate-600 font-serif leading-relaxed h-48 overflow-y-auto italic">"{openAnswers[qIdx] || "Geen antwoord."}"</div></div>
                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100"><h4 className="text-[10px] uppercase font-bold text-emerald-600 mb-3 tracking-widest">Modelantwoord</h4><div className="text-sm text-emerald-900 font-bold leading-relaxed h-48 overflow-y-auto">{q.sample}</div></div>
                 </div>
                 <div className="bg-white border-2 border-slate-100 p-10 rounded-[2.5rem] shadow-sm">
                   <h3 className="text-center font-bold text-lg mb-8">Elementen verwerkt?</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {q.checklist?.slice(0, 4).map((item, mIdx) => {
                       const markerKey = `${qIdx}_${mIdx}`;
                       return (
                         <button key={mIdx} onClick={() => setOpenMarkers(p => ({...p, [markerKey]: !p[markerKey]}))} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${openMarkers[markerKey] ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white'}`}>
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openMarkers[markerKey] ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300'}`}>{openMarkers[markerKey] ? <Check size={18} strokeWidth={3} /> : mIdx + 1}</div>
                           <div><div className={`text-sm font-bold ${openMarkers[markerKey] ? 'text-emerald-900' : 'text-slate-600'}`}>{item}</div><div className="text-[10px] font-bold text-slate-400 uppercase mt-1">+5 Punten</div></div>
                         </button>
                       );
                     })}
                   </div>
                 </div>
               </div>
             ))}
             <button onClick={() => { setGameState('results'); localStorage.removeItem(storageKey); confetti({ particleCount: 150, spread: 70 }); }} className="w-full py-5 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:brightness-110 transition-all" style={{ backgroundColor: lbBlue }}>Bekijk mijn resultaat</button>
          </motion.div>
        )}

        {/* RESULTS SCREEN */}
        {gameState === 'results' && (
          <div className="space-y-8 max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border-2 border-slate-100 rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-3" style={{ backgroundColor: lbOrange }} />
                <h1 className="text-2xl font-black uppercase tracking-widest text-slate-400 mb-8">Eindresultaat</h1>
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12">
                  <div className="relative"><div className="text-[130px] font-black tracking-tighter leading-none" style={{ color: lbBlue }}>{calculateResult().finalGrade}</div><div className={`absolute -top-4 -right-8 text-white px-3 py-1 rounded-full text-xs font-black uppercase ${parseFloat(calculateResult().finalGrade) >= 5.5 ? 'bg-emerald-500' : 'bg-red-500'}`}>{parseFloat(calculateResult().finalGrade) >= 5.5 ? 'Geslaagd' : 'Onvoldoende'}</div></div>
                  <div className="text-left space-y-4 bg-slate-50 p-8 rounded-3xl border border-slate-100 w-full md:w-auto">
                    <div className="flex justify-between gap-12 text-sm"><span className="text-slate-500 font-medium">MK Score ({examSettings.mkWeight * 100}%)</span><span className="font-black text-slate-900">{calculateResult().mkGrade}</span></div>
                    <div className="flex justify-between gap-12 text-sm border-b border-slate-200 pb-4"><span className="text-slate-500 font-medium">Casus Score ({examSettings.openWeight * 100}%)</span><span className="font-black text-slate-900">{calculateResult().openGrade}</span></div>
                    <div className="flex justify-between gap-12 text-xs"><span className="text-slate-400 italic">MK Goed</span><span className="font-bold text-slate-600">{calculateResult().rawScore} / {examSettings.mkCount}</span></div>
                  </div>
                </div>
                <div className="mb-12 p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 text-left relative">
                  <Quote className="absolute top-4 right-6 text-blue-200" size={40} />
                  <h4 className="text-blue-900 font-black text-xl mb-2">{getPhilosophicalFeedback(calculateResult().finalGrade).title}</h4>
                  <p className="text-blue-800 text-sm mb-6 leading-relaxed">{getPhilosophicalFeedback(calculateResult().finalGrade).msg}</p>
                  <div className="border-t border-blue-100 pt-4 italic text-blue-600 text-sm">"{getPhilosophicalFeedback(calculateResult().finalGrade).quote}"<span className="block mt-1 font-bold not-italic text-[10px] uppercase">— {getPhilosophicalFeedback(calculateResult().finalGrade).author}</span></div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <button onClick={() => setShowReview(!showReview)} className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-colors">{showReview ? <EyeOff size={18}/> : <Eye size={18}/>} Inzage MK</button>
                  <button onClick={() => { setGameState('intro'); window.scrollTo(0,0); }} className="flex-1 py-4 bg-white border-2 border-slate-200 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"><RotateCcw size={18}/> Nieuw Tentamen</button>
                </div>
                <button onClick={() => navigate(`/course/${stad}/${subjectSlug}`)} className="w-full py-4 bg-red-50 text-red-600 border-2 border-red-100 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"><LogOut size={18}/> Afsluiten</button>
            </motion.div>
            {showReview && examSettings.mkCount > 0 && (
              <div className="space-y-6">
                {questions.mk.map((q, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between mb-4"><div className="flex flex-col"><span className="text-[11px] font-black text-slate-300 uppercase">Vraag {idx + 1}</span><span className="text-[9px] font-bold text-slate-400 uppercase">{q.week?.replace(/_/g, ' ')}</span></div>{answers[idx] === q.c ? <span className="text-emerald-500 font-black text-[10px] flex items-center gap-1"><CheckCircle2 size={12}/> CORRECT</span> : <span className="text-red-500 font-black text-[10px] flex items-center gap-1"><XCircle size={12}/> INCORRECT</span>}</div>
                    <h4 className="text-lg font-bold text-slate-800 mb-6">{q.q}</h4>
                    <div className="grid gap-2 mb-6">{q.a.map((opt, i) => (<div key={i} className={`p-4 rounded-xl text-sm font-medium border-2 ${i === q.c ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold' : i === answers[idx] ? 'bg-red-50 border-red-200 text-red-900 font-bold' : 'bg-white border-slate-50 text-slate-400'}`}>{opt}</div>))}</div>
                    <div className="p-5 bg-slate-50 rounded-2xl border-l-4 border-[#002C5B]"><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Analyse</p><p className="text-sm text-slate-600 font-medium leading-relaxed">{q.exp}</p></div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      {gameState === 'exam' && (
        <footer className="fixed bottom-0 w-full h-[90px] bg-[#F8F9FA] border-t border-slate-200 flex items-center justify-between px-10 z-[100] shadow-2xl">
          <div className="flex gap-1 overflow-x-auto pb-2 max-w-[80%] no-scrollbar">
              {[...Array(examSettings.mkCount)].map((_, i) => (<button key={i} onClick={() => setCurrentIdx(i)} className={`min-w-[42px] h-[42px] border-2 flex items-center justify-center text-[13px] font-bold transition-all rounded-md ${currentIdx === i ? 'text-white border-[#002C5B]' : answers[i] !== undefined ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white text-slate-400 border-slate-100'}`} style={currentIdx === i ? { backgroundColor: lbBlue } : {}}>{i + 1}</button>))}
              {[...Array(examSettings.openCount)].map((_, i) => (<button key={examSettings.mkCount + i} onClick={() => setCurrentIdx(examSettings.mkCount + i)} className={`min-w-[80px] h-[42px] border-2 flex items-center justify-center text-[11px] font-black uppercase tracking-widest ml-4 rounded-md transition-all ${currentIdx === (examSettings.mkCount + i) ? 'text-white border-[#002C5B]' : (openAnswers[i]?.length > 0) ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white text-slate-400 border-slate-100'}`} style={currentIdx === (examSettings.mkCount + i) ? { backgroundColor: lbBlue } : {}}>Casus {i+1}</button>))}
          </div>
          <div className="flex gap-4">
            <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(p => p - 1)} className="w-10 h-10 border-2 border-slate-200 bg-white rounded-xl flex items-center justify-center disabled:opacity-20"><ChevronLeft size={20} /></button>
            <button disabled={currentIdx === (examSettings.mkCount + examSettings.openCount - 1)} onClick={() => setCurrentIdx(p => p + 1)} className="w-10 h-10 border-2 border-slate-200 bg-white rounded-xl flex items-center justify-center disabled:opacity-20"><ChevronRight size={20} /></button>
          </div>
        </footer>
      )}

      {/* MODALS */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-[#002C5B]/40 backdrop-blur-md p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white p-10 rounded-[2.5rem] max-w-md w-full shadow-2xl text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><AlertCircle size={32} /></div>
              <h3 className="text-2xl font-black mb-2 tracking-tight">Inleveren?</h3>
              <p className="text-slate-500 text-sm mb-10">Na inleveren start de zelf-beoordeling.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowSubmitConfirm(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold text-slate-400">Annuleren</button>
                <button onClick={confirmSubmit} className="flex-1 py-4 text-white rounded-2xl font-black uppercase text-xs shadow-lg" style={{ backgroundColor: lbBlue }}>Ja, Inleveren</button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {showEmptyConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[210] flex items-center justify-center bg-[#002C5B]/60 backdrop-blur-xl p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] max-w-md w-full shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><Home size={32} /></div>
              <h3 className="text-2xl font-black mb-2 tracking-tight">Stoppen?</h3>
              <div className="flex flex-col gap-3">
                <button onClick={() => { localStorage.removeItem(storageKey); navigate(`/course/${stad}/${subjectSlug}`); }} className="w-full py-4 text-white rounded-2xl font-black uppercase text-xs" style={{ backgroundColor: lbBlue }}>Terug naar vakoverzicht</button>
                <button onClick={() => setShowEmptyConfirm(false)} className="w-full py-4 bg-slate-100 rounded-2xl font-bold text-slate-400">Verdergaan</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}