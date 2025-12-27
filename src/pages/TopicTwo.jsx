import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const StrafrechtHardQuiz = () => {
  const [gameState, setGameState] = useState('start');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [showFeedback, setShowFeedback] = useState(false);

  const QUESTIONS = useMemo(() => [
    {
      q: "In de delictsomschrijving van vernieling (art. 350 Sr) is 'wederrechtelijk' opgenomen als bestanddeel. Wat is het formele gevolg voor de einduitspraak als de rechter vaststelt dat de verdachte een geslaagd beroep kan doen op een rechtvaardigingsgrond?",
      options: [
        "Ontslag van alle rechtsvervolging (OVAR), omdat de wederrechtelijkheid als element ontbreekt.",
        "Vrijspraak, omdat het bestanddeel 'wederrechtelijk' niet bewezen kan worden.",
        "Vrijspraak, omdat de verwijtbaarheid ontbreekt.",
        "Veroordeling, maar zonder oplegging van straf (rechterlijk pardon)."
      ],
      correct: 1,
      exp: "Omdat 'wederrechtelijk' hier een bestanddeel is (in de delictsomschrijving staat), moet dit door de OvJ bewezen worden. Een rechtvaardigingsgrond neemt de wederrechtelijkheid weg, waardoor het bestanddeel niet bewezen is. Gevolg: Vrijspraak (en geen OVAR)."
    },
    {
      q: "In het Porsche-arrest oordeelde de Hoge Raad dat er sprake was van bewuste schuld en niet van voorwaardelijk opzet. Welke specifieke omstandigheid (contra-indicatie) speelde een doorslaggevende rol in deze afweging?",
      options: [
        "De verdachte was onder invloed van alcohol, waardoor hij de risico's niet kon overzien.",
        "De verdachte reed in een zeer veilige auto, waardoor hij zich onkwetsbaar waande.",
        "De verdachte had eerdere inhaalpogingen afgebroken toen er tegenliggers aankwamen.",
        "De verdachte had geen direct oogmerk om de slachtoffers te doden."
      ],
      correct: 2,
      exp: "De Hoge Raad stelde dat het afbreken van eerdere pogingen wees op het feit dat de verdachte het risico juist wilde vermijden (hij dacht: het gaat net goed), in plaats van het risico 'op de koop toe te nemen' (aanvaarden)."
    },
    {
      q: "Bij de straftoemeting kan sprake zijn van eendaadse samenloop (art. 55 lid 1 Sr). Wat houdt de regel voor het strafmaximum in bij eendaadse samenloop?",
      options: [
        "De strafmaxima van beide feiten worden bij elkaar opgeteld.",
        "Er mag slechts één strafbepaling worden toegepast, namelijk die met de zwaarste hoofdstraf.",
        "Het zwaarste strafmaximum mag met een derde worden verhoogd.",
        "De rechter heeft een vrije keuze welke van de twee bepalingen hij toepast."
      ],
      correct: 1,
      exp: "Bij eendaadse samenloop geldt het absorptiestelsel: er wordt slechts één strafbepaling toegepast, namelijk die met de zwaarste hoofdstraf (in tegenstelling tot meerdaadse samenloop waar cumulatie met beperking geldt)."
    },
    {
      q: "Welk leerstuk introduceerde de Hoge Raad in het arrest 'Letale Longembolie' om de causaliteit vast te stellen in complexe situaties met medische complicaties?",
      options: [
        "De leer van de adequatie (adequate veroorzaking).",
        "De Causa Proxima-leer.",
        "De leer van de redelijke toerekening.",
        "De leer van het uitsluiten van toeval."
      ],
      correct: 2,
      exp: "De Hoge Raad stapte af van de strikte voorzienbaarheid en introduceerde de 'redelijke toerekening': kan het gevolg redelijkerwijs aan de gedraging van de verdachte worden toegerekend, gezien de omstandigheden?"
    },
    {
      q: "Wat houdt een 'geobjectiveerd bestanddeel' in bij een opzetdelict?",
      options: [
        "Een bestanddeel dat objectief bewezen moet worden door camerabeelden.",
        "Een bestanddeel waarop het opzet van de verdachte niet gericht hoeft te zijn.",
        "Een bestanddeel dat de rechter ambtshalve moet aanvullen.",
        "Een bestanddeel dat altijd leidt tot een strafverzwaring."
      ],
      correct: 1,
      exp: "Hoewel het delict een opzetdelict is, hoeft het opzet van de verdachte niet gericht te zijn op het geobjectiveerde bestanddeel (bijv. 'in de rechtmatige uitoefening van zijn bediening' bij wederspannigheid)."
    },
    {
      q: "De rechter-commissaris overweegt voorlopige hechtenis. Aan alle eisen is voldaan, maar hij stuit op het 'anticipatiegebod' (art. 67a lid 3 Sv). Wat houdt dit gebod in?",
      options: [
        "De voorlopige hechtenis mag niet worden bevolen als verwacht wordt dat de straf korter zal zijn dan de duur van het voorarrest.",
        "De R-C moet anticiperen op de verdedigingsstrategie van de advocaat.",
        "De voorlopige hechtenis moet altijd worden afgetrokken van de uiteindelijke straf.",
        "Er mag geen voorlopige hechtenis worden toegepast bij 'first offenders'."
      ],
      correct: 0,
      exp: "Het anticipatiegebod verbiedt het bevelen (of voortduren) van voorlopige hechtenis als ernstig rekening moet worden gehouden met de mogelijkheid dat de verdachte langer vastzit dan de uiteindelijke onvoorwaardelijke vrijheidsstraf."
    },
    {
      q: "Kan de maatregel 'onttrekking aan het verkeer' (art. 36b Sr) worden opgelegd als de verdachte wordt vrijgesproken?",
      options: [
        "Nee, voor elke strafrechtelijke maatregel is een veroordeling vereist.",
        "Ja, onttrekking aan het verkeer kan ook bij vrijspraak of OVAR worden opgelegd.",
        "Alleen als de verdachte toestemming geeft voor de onttrekking.",
        "Nee, dan moet de Officier van Justitie een civiele procedure starten."
      ],
      correct: 1,
      exp: "Ja, dit kan. Als het bezit van het goed in strijd is met de wet of het algemeen belang (zoals drugs of verboden wapens), kan de rechter dit onttrekken aan het verkeer, ongeacht de uitkomst van de schuldvraag."
    },
    {
      q: "Sinds 2013 kent Nederland herziening ten nadele van de verdachte. Een van de gronden is een 'falsa'. Wat wordt hiermee bedoeld?",
      options: [
        "De rechter heeft de wet verkeerd geïnterpreteerd (foutieve rechtsopvatting).",
        "Er is nieuw DNA-bewijsmateriaal gevonden (technisch novum).",
        "Er is gebleken dat de verdachte of een getuige opzettelijk een onwaarheid heeft verteld die tot vrijspraak leidde.",
        "De officier van justitie heeft een vormverzuim begaan."
      ],
      correct: 2,
      exp: "Een 'falsa' verwijst naar een situatie waarin een onwaarheid (bijv. meinedige verklaring of vervalst bewijs) ten grondslag lag aan de vrijspraak of het ontslag van rechtsvervolging."
    },
    {
      q: "Wat is het procedurele verschil tussen 'schorsing' en 'onderbreking' van het onderzoek ter terechtzitting?",
      options: [
        "Schorsing vindt plaats voor beraadslaging in de raadkamer; onderbreking is voor onbepaalde tijd.",
        "Onderbreking is meestal kort (pauze) en de zitting gaat dezelfde dag verder; schorsing is voor langere tijd (onderzoek).",
        "Schorsing is alleen mogelijk op verzoek van de verdachte; onderbreking kan de rechter ambtshalve doen.",
        "Er is geen verschil; de termen worden door elkaar gebruikt."
      ],
      correct: 1,
      exp: "Onderbreking is voor korte duur (lunch, rust, beraadslaging) en de zitting wordt dezelfde dag hervat. Schorsing (aanhouding) is voor langere tijd (dagen/weken) in het belang van het onderzoek (bijv. getuigen oproepen)."
    },
    {
      q: "Het lex certa-beginsel eist dat strafbepalingen duidelijk zijn. Toch accepteerde de Hoge Raad in het arrest 'Onbehoorlijk gedrag' een vage norm. Waarom?",
      options: [
        "Omdat het een overtreding betrof en geen misdrijf; bij overtredingen geldt lex certa niet.",
        "Omdat de wetgever onmogelijk elke variant van wangedrag in detail kan uitschrijven; enige vaagheid is noodzakelijk voor de houdbaarheid.",
        "Omdat de verdachte had moeten begrijpen dat zijn gedrag moreel verwerpelijk was.",
        "Omdat de APV (Algemene Plaatselijke Verordening) niet gebonden is aan het Wetboek van Strafrecht."
      ],
      correct: 1,
      exp: "De Hoge Raad oordeelde dat wetgeving enige algemeenheid moet hebben om de tand des tijds te doorstaan en toepasbaar te blijven op diverse situaties. Volledige detaillering is onmogelijk."
    }
  ], []);

  // --- LOGICA ---
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
      confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 }, colors: ['#7f1d1d', '#1e293b'] }); // Donkerder kleurenpalet voor 'moeilijk'
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
  // Kleurenpalet aangepast naar iets serieuzer (Donkerblauw/Rood)
  const barColorClass = showFeedback ? (isCorrect ? 'bg-emerald-600' : 'bg-rose-600') : 'bg-slate-700';

  return (
    <div className="w-full min-h-screen bg-slate-50 font-serif antialiased pb-20">
      <nav className="h-20 bg-white border-b border-slate-200 px-10 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tighter text-slate-900">LAWBOOKS EXPERT</span>
          <span className="text-[9px] uppercase tracking-[0.4em] text-rose-700 font-black italic">Module Verdieping — Score: {currentScore} / {QUESTIONS.length}</span>
        </div>
        {gameState === 'quiz' && (
          <div className="w-48 bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <motion.div className={`h-full transition-colors duration-500 ${barColorClass}`} animate={{ width: `${progress}%` }} />
          </div>
        )}
      </nav>

      <main className="max-w-4xl mx-auto py-12 px-6">
        <AnimatePresence mode="wait">
          {gameState === 'start' && (
            <motion.div key="start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center space-y-12">
              <div className="relative inline-block mt-8">
                <div className="w-64 h-64 rounded-full border-[12px] border-white shadow-2xl overflow-hidden mx-auto bg-slate-100 flex items-center justify-center">
                    <span className="text-6xl">🎓</span>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-rose-700 text-white w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-xl rotate-12 border-4 border-white">
                    <span className="text-3xl font-bold">10</span>
                    <span className="text-[8px] uppercase font-black">Pro</span>
                </div>
              </div>
              <h1 className="text-7xl font-bold text-slate-900 leading-tight font-serif italic tracking-tight">Strafrecht Verdieping.</h1>
              <p className="text-slate-500 text-2xl italic font-light max-w-2xl mx-auto">Focus op dogmatiek, jurisprudentie en strafprocesrechtelijke nuances.</p>
              <button onClick={() => setGameState('quiz')} className="px-16 py-6 bg-slate-900 text-white rounded-full font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:scale-105 transition-all">Start Expert Toets</button>
            </motion.div>
          )}

          {gameState === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 transition-colors duration-500 ${barColorClass}`} />
                <div className="flex justify-between items-center mb-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Vraag {currentIdx + 1} van {QUESTIONS.length}</span>
                    {showFeedback && (
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {isCorrect ? 'Correct' : 'Fout'}
                        </span>
                    )}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 leading-snug mb-12 font-serif italic tracking-tight">{QUESTIONS[currentIdx].q}</h2>
                <div className="grid grid-cols-1 gap-4">
                  {QUESTIONS[currentIdx].options.map((opt, i) => {
                    const isCorrectOption = i === QUESTIONS[currentIdx].correct;
                    const isSelected = i === userAnswers[currentIdx];
                    let colorClasses = "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-900";
                    if (showFeedback) {
                      if (isCorrectOption) colorClasses = "!bg-emerald-600 !border-emerald-700 !text-white shadow-lg";
                      else if (isSelected) colorClasses = "!bg-rose-600 !border-rose-700 !text-white opacity-90";
                      else colorClasses = "bg-slate-50 border-slate-100 text-slate-300 opacity-40";
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
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-10 p-8 rounded-3xl border-l-8 ${isCorrect ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'}`}>
                      <h4 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-3 ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>Juridische Analyse</h4>
                      <p className="text-slate-700 italic text-lg leading-relaxed font-sans">{QUESTIONS[currentIdx].exp}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-between mt-12 pt-8 border-t border-slate-100">
                    <button onClick={handleBack} disabled={currentIdx === 0} className={`flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] transition-all ${currentIdx === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-900 hover:text-rose-600'}`}>← Vorige</button>
                    <button onClick={handleNext} disabled={!isAnswered} className={`px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-md ${!isAnswered ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-black'}`}>
                        {currentIdx === QUESTIONS.length - 1 ? "Resultaat" : "Volgende →"}
                    </button>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'results' && (
            <motion.div key="results" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
              <div className="bg-white p-24 rounded-[5rem] shadow-2xl border border-slate-100 inline-block w-full relative">
                <div className="absolute top-0 left-0 w-full h-4 bg-rose-700" />
                <h2 className="text-5xl font-bold text-slate-900 mb-4 font-serif italic tracking-tight">Eindresultaat</h2>
                <div className="text-[12rem] font-black leading-none text-slate-900 my-10">{currentScore}</div>
                <p className="text-4xl font-serif italic text-slate-600 mb-12">Beoordeling: {((currentScore/QUESTIONS.length)*9 + 1).toFixed(1)}</p>
                <button onClick={() => window.location.reload()} className="px-16 py-6 border-2 border-slate-900 text-slate-900 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:text-white transition-all shadow-lg">Opnieuw proberen</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default StrafrechtHardQuiz;