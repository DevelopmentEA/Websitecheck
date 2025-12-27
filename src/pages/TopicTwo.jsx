import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const StrafrechtNormalQuiz = () => {
  const [gameState, setGameState] = useState('start');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [showFeedback, setShowFeedback] = useState(false);

  // VRAGEN VAN NORMAAL NIVEAU (GEBASEERD OP DE SAMENVATTING)
  const QUESTIONS = useMemo(() => [
    {
      q: "Wie is de enige partij die een verdachte voor de strafrechter kan brengen (vervolgingsmonopolie)?",
      options: [
        "De politie.",
        "Het slachtoffer.",
        "Het Openbaar Ministerie (de Officier van Justitie).",
        "De Rechter-Commissaris."
      ],
      correct: 2,
      exp: "In het strafrecht kan alleen de Officier van Justitie (namens het OM) beslissen om een verdachte te vervolgen en te dagvaarden. Burgers kunnen dit niet zelf."
    },
    {
      q: "Wat houdt het 'lex scripta'-gebod van het legaliteitsbeginsel in?",
      options: [
        "De wet moet duidelijk en begrijpelijk zijn.",
        "Strafbaarheid mag alleen gebaseerd zijn op een geschreven wet (geen gewoonterecht).",
        "De rechter mag de wet niet met terugwerkende kracht toepassen.",
        "De rechter mag de wet niet analoog interpreteren."
      ],
      correct: 1,
      exp: "Lex scripta betekent letterlijk 'geschreven wet'. Het verbiedt strafbaarheid op basis van ongeschreven gewoonterecht."
    },
    {
      q: "Uit welke vier componenten bestaat een strafbaar feit volgens de gebruikelijke opbouw (als wederrechtelijkheid geen bestanddeel is)?",
      options: [
        "Menselijke gedraging, Delictsomschrijving, Wederrechtelijkheid, Schuld.",
        "Daderschap, Opzet, Causaal verband, Straf.",
        "Aanhouding, Vervolging, Berechting, Tenuitvoerlegging.",
        "Wet, Bewijs, Overtuiging, Vonnis."
      ],
      correct: 0,
      exp: "Het strafbare feit bestaat uit: 1. Menselijke gedraging, 2. Delictsomschrijving (wettelijk), 3. Wederrechtelijkheid (strijd met recht), 4. Schuld (verwijtbaarheid)."
    },
    {
      q: "Wat is het kenmerkende verschil tussen 'voorwaardelijk opzet' en 'bewuste schuld'?",
      options: [
        "Bij voorwaardelijk opzet weet de dader het zeker, bij schuld niet.",
        "Bij voorwaardelijk opzet aanvaardt de dader de kans (op de koop toe nemen); bij bewuste schuld hoopt hij dat het goed gaat.",
        "Voorwaardelijk opzet is een overtreding, bewuste schuld is een misdrijf.",
        "Er is geen verschil, het zijn synoniemen."
      ],
      correct: 1,
      exp: "De grens ligt bij de aanvaarding. Bij bewuste schuld (culpa) ziet de dader het gevaar wel, maar vertrouwt hij (lichtvaardig) op een goede afloop. Bij voorwaardelijk opzet neemt hij het risico voor lief."
    },
    {
      q: "Wie is volgens artikel 53 Sv bevoegd een verdachte aan te houden bij 'ontdekking op heterdaad'?",
      options: [
        "Alleen de Officier van Justitie.",
        "Alleen opsporingsambtenaren (politie).",
        "Iedereen (dus ook burgers).",
        "Alleen de rechter."
      ],
      correct: 2,
      exp: "In geval van heterdaad is 'ieder' bevoegd, dus ook de 'gewone' burger mag de verdachte aanhouden in afwachting van de politie."
    },
    {
      q: "Welke vraag komt aan de orde bij de 'kwalificatievraag' in het schema van artikel 350 Sv?",
      options: [
        "Is het tenlastegelegde feit wettig en overtuigend bewezen?",
        "Levert het bewezenverklaarde feit een strafbaar feit op volgens de wet?",
        "Is de verdachte strafbaar (zijn er schulduitsluitingsgronden)?",
        "Welke straf moet worden opgelegd?"
      ],
      correct: 1,
      exp: "De tweede vraag van 350 Sv is de kwalificatie: valt het gedrag dat bewezen is onder een wettelijke strafbepaling? Zo nee, dan volgt ontslag van alle rechtsvervolging."
    },
    {
      q: "Welk rechtsmiddel kan worden ingesteld tegen een vonnis van de rechtbank?",
      options: [
        "Cassatie bij de Hoge Raad.",
        "Hoger beroep bij het Gerechtshof.",
        "Verzet bij de Kantonrechter.",
        "Herziening bij de Minister."
      ],
      correct: 1,
      exp: "Tegen een vonnis van de rechtbank staat hoger beroep open bij het gerechtshof. Pas daarna volgt eventueel cassatie."
    },
    {
      q: "Wat is volgens artikel 9 Sr een 'hoofdstraf'?",
      options: [
        "Verbeurdverklaring.",
        "Ontzetting van rechten.",
        "Taakstraf.",
        "TBS (Terbeschikkingstelling)."
      ],
      correct: 2,
      exp: "De hoofdstraffen zijn: gevangenisstraf, hechtenis, taakstraf en geldboete. TBS is een maatregel, en verbeurdverklaring is een bijkomende straf."
    },
    {
      q: "Wanneer is iemand 'verdachte' in de zin van artikel 27 Sv?",
      options: [
        "Zodra de politie hem aanspreekt op straat.",
        "Als er een redelijk vermoeden van schuld is aan een strafbaar feit, gebaseerd op feiten of omstandigheden.",
        "Pas als de rechter hem heeft veroordeeld.",
        "Alleen als hij op heterdaad betrapt is."
      ],
      correct: 1,
      exp: "Er moet sprake zijn van een 'redelijk vermoeden van schuld' dat objectiveerbaar is (gebaseerd op feiten/omstandigheden)."
    },
    {
      q: "Wat houdt de 'grondslagleer' in?",
      options: [
        "De rechter mag zelf feiten toevoegen als hij dat nodig vindt.",
        "De rechter moet zijn oordeel baseren op de Grondwet.",
        "De rechter is gebonden aan de tenlastelegging (wat de OvJ heeft opgeschreven) en mag daar niet buiten treden.",
        "De rechter mag de verdachte veroordelen voor feiten die niet in de dagvaarding staan."
      ],
      correct: 2,
      exp: "De tenlastelegging vormt de grondslag van het onderzoek. De rechter mag alleen oordelen over datgene wat de officier van justitie ten laste heeft gelegd."
    }
  ], []);

  // --- LOGICA (STANDAARD) ---
  const handleAnswer = (optionIdx) => {
    const newAnswers = { ...userAnswers, [currentIdx]: optionIdx };
    setUserAnswers(newAnswers);
    setShowFeedback(true);
  };

  const calculateScore = () => {
    return QUESTIONS.reduce((acc, q, idx) => {
      return acc + (userAnswers[idx] === q.correct ? 1 : 0);
    }, 0);
  };

  const handleNext = () => {
    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1);
      setShowFeedback(userAnswers[currentIdx + 1] !== undefined);
    } else {
      setGameState('results');
      confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 }, colors: ['#1A365D', '#C5A059'] });
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setShowFeedback(true); 
    }
  };

  const currentScore = calculateScore();
  const progress = ((currentIdx + 1) / QUESTIONS.length) * 100;
  const isAnswered = userAnswers[currentIdx] !== undefined;
  const isCorrect = userAnswers[currentIdx] === QUESTIONS[currentIdx].correct;
  const barColorClass = showFeedback ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-[#C5A059]';

  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] font-serif antialiased pb-20">
      <nav className="h-20 bg-white border-b border-stone-200 px-10 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tighter text-[#1A365D]">LAWBOOKS KENNISBANK</span>
          <span className="text-[9px] uppercase tracking-[0.4em] text-[#C5A059] font-black italic">Editie Strafrecht — Score: {currentScore} / {QUESTIONS.length}</span>
        </div>
        {gameState === 'quiz' && (
          <div className="w-48 bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <motion.div className={`h-full transition-colors duration-500 ${barColorClass}`} animate={{ width: `${progress}%` }} />
          </div>
        )}
      </nav>

      <main className="max-w-4xl mx-auto py-12 px-6">
        <AnimatePresence mode="wait">
          {gameState === 'start' && (
            <motion.div key="start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center space-y-12">
              <div className="relative inline-block mt-8">
                <div className="w-64 h-64 rounded-full border-[12px] border-white shadow-2xl overflow-hidden mx-auto bg-stone-100 flex items-center justify-center">
                    <span className="text-6xl">⚖️</span>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-[#C5A059] text-white w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-xl rotate-12 border-4 border-white">
                    <span className="text-3xl font-bold">{QUESTIONS.length}</span>
                    <span className="text-[8px] uppercase font-black">Vragen</span>
                </div>
              </div>
              <h1 className="text-7xl font-bold text-[#1A365D] leading-tight font-serif italic tracking-tight">Inleiding Strafrecht.</h1>
              <p className="text-stone-500 text-2xl italic font-light max-w-2xl mx-auto">Week 1 t/m 7: Basisbegrippen en Kernstof.</p>
              <button onClick={() => setGameState('quiz')} className="px-16 py-6 bg-[#1A365D] text-white rounded-full font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:scale-105 transition-all">Start Toets</button>
            </motion.div>
          )}

          {gameState === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-stone-100 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 transition-colors duration-500 ${barColorClass}`} />
                <div className="flex justify-between items-center mb-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-300">Vraag {currentIdx + 1} van {QUESTIONS.length}</span>
                    {showFeedback && (
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {isCorrect ? 'Correct' : 'Onjuist'}
                        </span>
                    )}
                </div>
                <h2 className="text-4xl font-bold text-[#1A365D] leading-snug mb-12 font-serif italic tracking-tight">{QUESTIONS[currentIdx].q}</h2>
                <div className="grid grid-cols-1 gap-4">
                  {QUESTIONS[currentIdx].options.map((opt, i) => {
                    const isCorrectOption = i === QUESTIONS[currentIdx].correct;
                    const isSelected = i === userAnswers[currentIdx];
                    let colorClasses = "bg-stone-50 border-stone-200 text-stone-700 hover:border-[#1A365D]";
                    if (showFeedback) {
                      if (isCorrectOption) colorClasses = "!bg-green-500 !border-green-600 !text-white shadow-lg";
                      else if (isSelected) colorClasses = "!bg-red-500 !border-red-600 !text-white opacity-90";
                      else colorClasses = "bg-stone-50 border-stone-100 text-stone-300 opacity-40";
                    }
                    return (
                      <button key={i} disabled={showFeedback} onClick={() => handleAnswer(i)} className={`p-6 text-left rounded-2xl border-2 font-semibold transition-all duration-300 flex justify-between items-center ${colorClasses}`}>
                        <span className="text-lg font-sans">{opt}</span>
                        {showFeedback && isCorrectOption && <span>⚖️</span>}
                      </button>
                    );
                  })}
                </div>
                <AnimatePresence>
                  {showFeedback && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-10 p-8 rounded-3xl border-l-8 ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                      <h4 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-3 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>Toelichting</h4>
                      <p className="text-stone-700 italic text-lg leading-relaxed font-sans">{QUESTIONS[currentIdx].exp}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-between mt-12 pt-8 border-t border-stone-100">
                    <button onClick={handleBack} disabled={currentIdx === 0} className={`flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] transition-all ${currentIdx === 0 ? 'text-stone-200 cursor-not-allowed' : 'text-[#1A365D] hover:text-[#C5A059]'}`}>← Vorige</button>
                    <button onClick={handleNext} disabled={!isAnswered} className={`px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-md ${!isAnswered ? 'bg-stone-100 text-stone-300 cursor-not-allowed' : 'bg-[#1A365D] text-white hover:bg-black'}`}>
                        {currentIdx === QUESTIONS.length - 1 ? "Resultaat" : "Volgende →"}
                    </button>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'results' && (
            <motion.div key="results" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
              <div className="bg-white p-24 rounded-[5rem] shadow-2xl border border-stone-100 inline-block w-full relative">
                <div className="absolute top-0 left-0 w-full h-4 bg-[#C5A059]" />
                <h2 className="text-5xl font-bold text-[#1A365D] mb-4 font-serif italic tracking-tight">Resultaat</h2>
                <div className="text-[12rem] font-black leading-none text-[#1A365D] my-10">{currentScore}</div>
                <p className="text-4xl font-serif italic text-stone-800 mb-12">Cijfer: {((currentScore/QUESTIONS.length)*9 + 1).toFixed(1)}</p>
                <button onClick={() => window.location.reload()} className="px-16 py-6 border-2 border-[#1A365D] text-[#1A365D] rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-[#1A365D] hover:text-white transition-all shadow-lg">Herstart de Toets</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default StrafrechtNormalQuiz;