import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const ElbertsErfrechtQuiz = () => {
  const [gameState, setGameState] = useState('start');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [showFeedback, setShowFeedback] = useState(false);

  const QUESTIONS = useMemo(() => [
    {
      q: "Wat is het verschil tussen erfopvolging 'bij versterf' en 'bij uiterste wilsbeschikking'?",
      options: [
        "Bij versterf is via de notaris, uiterste wilsbeschikking is via de rechter.",
        "Bij versterf gaat op grond van de wet, uiterste wilsbeschikking op basis van een testament.",
        "Er is geen verschil; beide termen betekenen hetzelfde.",
        "Bij versterf geldt alleen voor schulden, uiterste wilsbeschikking voor bezittingen."
      ],
      correct: 1,
      exp: "Erfopvolging kan op twee manieren: op grond van de wet (bij versterf) of op basis van een testament (uiterste wilsbeschikking)."
    },
    {
      q: "Wie wordt in het erfrecht gelijkgesteld met een echtgenoot?",
      options: ["Samenwonende partners met een contract.", "Geregistreerde partners.", "Stiefouders.", "Huisgenoten."],
      correct: 1,
      exp: "Geregistreerde partners worden in het erfrecht gelijkgesteld met echtgenoten."
    },
    {
      q: "Welke groep erfgenamen behoort tot de tweede parenteel?",
      options: [
        "De echtgenoot en diens kinderen.",
        "De ouders en diens broers en zussen.",
        "De grootouders.",
        "De overgrootouders."
      ],
      correct: 1,
      exp: "De wet kent een vaste rangorde (parentele stelsel). De tweede groep bestaat uit de ouders, broers en zussen."
    },
    {
      q: "Wat houdt de 'wettelijke verdeling' (art. 4:13 BW) in voor de kinderen?",
      options: [
        "Zij krijgen direct hun deel van de inboedel.",
        "Zij krijgen een niet-opeisbare geldvordering op de langstlevende echtgenoot.",
        "Zij worden direct mede-eigenaar van de woning.",
        "Zij moeten de uitvaartkosten volledig zelf betalen."
      ],
      correct: 1,
      exp: "Bij de wettelijke verdeling krijgt de echtgenoot de hele nalatenschap en krijgen kinderen een vordering op de echtgenoot."
    },
    {
      q: "In welk geval is de vordering van een kind uit de wettelijke verdeling WEL direct opeisbaar?",
      options: [
        "Wanneer het kind gaat trouwen.",
        "Wanneer de echtgenoot failliet gaat of in de schuldsanering komt.",
        "Zodra het kind de leeftijd van 18 jaar bereikt.",
        "Wanneer de echtgenoot een nieuwe auto koopt."
      ],
      correct: 1,
      exp: "De vordering is pas opeisbaar bij faillissement, schuldsanering of overlijden van de echtgenoot."
    },
    {
      q: "Wat is het doel van 'wilsrechten' (art. 4:19 t/m 4:22 BW)?",
      options: [
        "Om te bepalen wie de uitvaart regelt.",
        "Om kinderen te beschermen tegen het risico dat vermogen bij een stiefouder terechtkomt.",
        "Om de notaris meer zeggenschap te geven.",
        "Om de legitieme portie te verhogen."
      ],
      correct: 1,
      exp: "Wilsrechten beschermen kinderen tegen het 'stiefoudergevaar' bij hertrouwen of overlijden van ouders."
    },
    {
      q: "Wanneer kan een kind voor het eerst een wilsrecht uitoefenen?",
      options: [
        "Zodra de ouder aangeeft te willen scheiden.",
        "Wanneer de langstlevende ouder aangifte doet van een voorgenomen nieuw huwelijk.",
        "Alleen na toestemming van de stiefouder.",
        "Zodra het testament geopend wordt."
      ],
      correct: 1,
      exp: "Een kind kan een wilsrecht uitoefenen wanneer de langstlevende ouder hertrouwt (art. 4:19 BW)."
    },
    {
      q: "Behoren stiefkinderen tot de wettelijke erfgenamen?",
      options: [
        "Ja, zij zijn gelijk aan eigen kinderen.",
        "Nee, zij staan niet in een familierechtelijke betrekking tot de erflater.",
        "Ja, maar zij erven altijd de helft.",
        "Alleen als zij langer dan 10 jaar in huis wonen."
      ],
      correct: 1,
      exp: "Stiefkinderen en aangetrouwde kinderen behoren niet tot de wettelijke erfgenamen."
    },
    {
      q: "Hoe kan een stiefkind toch worden betrokken in de wettelijke verdeling?",
      options: [
        "Door een mondelinge belofte van de erflater.",
        "Door hen in een testament gelijk te stellen met een eigen kind (art. 4:27 BW).",
        "Dat is wettelijk onmogelijk.",
        "Door een verzoek in te dienen bij de kantonrechter."
      ],
      correct: 1,
      exp: "Op grond van art. 4:27 BW kan in een testament een stiefkind worden gelijkgesteld met een eigen kind."
    },
    {
      q: "Wat moet de wettelijke vertegenwoordiger doen als een minderjarig kind erfgenaam is?",
      options: [
        "De erfenis direct opmaken.",
        "Binnen één jaar een boedelbeschrijving indienen bij de griffie van de rechtbank.",
        "De erfenis verplicht verwerpen.",
        "Niets, de notaris regelt alles automatisch."
      ],
      correct: 1,
      exp: "Voor minderjarige erfgenamen moet binnen een jaar een ondertekende boedelbeschrijving worden ingediend (art. 4:16 lid 2 BW)."
    },
    {
      q: "Welke schuld heeft de laagste rangorde volgens de wet?",
      options: [
        "Uitvaartkosten.",
        "Schulden van de erflater zelf (rekeningen).",
        "Schulden ter zake van de legitieme porties.",
        "Belastingschulden."
      ],
      correct: 2,
      exp: "De rangorde plaatst uitvaart en belastingen (a t/m e) boven wettelijke rechten en als laatste de legitieme porties."
    },
    {
      q: "Wat houdt het recht op 'vruchtgebruik van woning en inboedel' (art. 4:29 BW) in?",
      options: [
        "De echtgenoot moet de woning direct verkopen.",
        "De echtgenoot mag in de woning blijven wonen, ook als hij/zij geen eigenaar is.",
        "De kinderen mogen de huur opzeggen.",
        "De echtgenoot krijgt een zak geld om te verhuizen."
      ],
      correct: 1,
      exp: "De echtgenote kan aanspraak maken op vruchtgebruik van de woning en inboedel ter verzorging."
    },
    {
      q: "Mag een erflater in zijn testament bepalen dat zijn vrouw mag kiezen wie de erfgenamen worden?",
      options: [
        "Ja, dat is een vorm van keuzevrijheid.",
        "Nee, een uiterste wilsbeschikking is een hoogstpersoonlijke handeling.",
        "Alleen als ze in gemeenschap van goederen getrouwd zijn.",
        "Ja, mits de notaris akkoord gaat."
      ],
      correct: 1,
      exp: "Een testament is een hoogstpersoonlijke handeling; de erflater mag de aanwijzing van erfgenamen niet aan een ander overlaten."
    },
    {
      q: "Wat is een 'depottestament' (art. 4:95 BW)?",
      options: [
        "Een testament dat alleen over banktegoeden gaat.",
        "Een eigenhandig geschreven testament dat in bewaring wordt gegeven bij de notaris.",
        "Een testament dat pas na 10 jaar geopend mag worden.",
        "Een type codicil."
      ],
      correct: 1,
      exp: "Bij een depottestament geeft de erflater een eigen geschreven en ondertekend stuk in bewaring bij de notaris."
    },
    {
      q: "Welke zaken kunnen in een codicil (art. 4:97 BW) worden gelegateerd?",
      options: [
        "Geld en onroerend goed.",
        "Kleding, bepaalde sieraden en meubels.",
        "De aanwijzing van een erfgenaam.",
        "Aandelen en obligaties."
      ],
      correct: 1,
      exp: "Een codicil geldt alleen voor specifieke zaken zoals kleding, sieraden, meubels of boeken."
    },
    {
      q: "Wat is de juridische positie van een legataris?",
      options: [
        "Hij is mede-eigenaar van de hele boedel.",
        "Hij heeft een vorderingsrecht op de erfgenamen voor een specifiek goed of bedrag.",
        "Hij is verantwoordelijk voor alle schulden van de erflater.",
        "Hij is gelijk aan een executeur."
      ],
      correct: 1,
      exp: "De legataris is geen erfgenaam, maar heeft een vorderingsrecht op de erfgenamen."
    },
    {
      q: "Wat is een testamentaire 'last' (art. 4:130 BW)?",
      options: [
        "Een schuld die de erflater nalaat.",
        "Een verplichting zonder direct voordeel voor een ander (bijv. verzorging huisdier).",
        "Een type legaat van een geldbedrag.",
        "De plicht om de erfenis te weigeren."
      ],
      correct: 1,
      exp: "Een last is een taak of opdracht die moet worden uitgevoerd zonder dat daar een voordeel tegenover staat."
    },
    {
      q: "Hoe groot is de legitieme portie van een kind?",
      options: [
        "Precies hetzelfde als het wettelijk erfdeel.",
        "De helft van het wettelijk erfdeel.",
        "Een kwart van de totale nalatenschap.",
        "Dat bepaalt de notaris per geval."
      ],
      correct: 1,
      exp: "De legitieme portie bedraagt de helft van het wettelijk erfdeel dat men volgens de wet zou ontvangen."
    },
    {
      q: "Roger is onterfd door zijn vader. Er zijn in totaal drie kinderen. Hoe groot is Rogers legitieme portie?",
      options: ["1/3e deel.", "1/6e deel.", "De helft van de inboedel.", "Niets, hij is onterfd."],
      correct: 1,
      exp: "Zijn wettelijke erfdeel was 1/3e. De legitieme is de helft daarvan: 1/2 * 1/3 = 1/6e."
    },
    {
      q: "Wat gebeurt er bij 'zuivere aanvaarding' van een nalatenschap?",
      options: [
        "Je krijgt de erfenis zonder schulden.",
        "Je wordt ook privé aansprakelijk voor alle schulden van de erflater.",
        "Je moet de erfenis direct delen met de Staat.",
        "Je kunt later alsnog besluiten te verwerpen."
      ],
      correct: 1,
      exp: "Bij zuivere aanvaarding volgt opvolging zonder voorbehoud, inclusief privé-aansprakelijkheid voor schulden."
    },
    {
      q: "Wat is het voordeel van 'beneficiaire aanvaarding'?",
      options: [
        "Je hoeft geen erfbelasting te betalen.",
        "Schulden hoeven alleen betaald te worden voor zover de erfenis bezittingen (baten) bevat.",
        "Je krijgt de erfenis sneller uitgekeerd.",
        "De executeur wordt door de Staat betaald."
      ],
      correct: 1,
      exp: "Beneficiaire aanvaarding beschermt je privévermogen tegen tekorten in de nalatenschap."
    },
    {
      q: "Wat is het gevolg van het 'verwerpen' van een erfenis?",
      options: [
        "Je krijgt alleen het geld, niet de spullen.",
        "Je wordt geacht nooit erfgenaam te zijn geweest.",
        "Je moet alsnog de uitvaart betalen.",
        "Je kinderen kunnen niet meer in jouw plaats treden."
      ],
      correct: 1,
      exp: "Bij verwerping word je geacht nooit erfgenaam te zijn geweest; de volgende in de rangorde komt dan aan de beurt."
    },
    {
      q: "Willem overlijdt en laat grote gokschulden na die zijn zoons niet kenden. Zij hebben zuiver aanvaard. Wat nu?",
      options: [
        "De Staat scheldt de schulden kwijt.",
        "Zij moeten de restschuld met hun privévermogen betalen.",
        "Zij kunnen alsnog beneficiair aanvaarden.",
        "De goksite mag geen geld opeisen van erfgenamen."
      ],
      correct: 1,
      exp: "Door zuivere aanvaarding ben je privé aansprakelijk, ook voor schulden die je niet kende."
    },
    {
      q: "Mag een 12-jarig kind zelfstandig beslissen om een erfenis te verwerpen?",
      options: [
        "Ja, vanaf 12 jaar mag dat.",
        "Nee, de wettelijke vertegenwoordiger moet dit doen via de kantonrechter.",
        "Alleen als er meer schulden dan bezittingen zijn.",
        "Verwerpen is voor minderjarigen verboden."
      ],
      correct: 1,
      exp: "Voor minderjarigen moet de wettelijke vertegenwoordiger handelen, vaak via de kantonrechter om belangen te beschermen."
    },
    {
      q: "Wat is de termijn voor een echtgenoot om de wettelijke toedeling ongedaan te maken?",
      options: ["Binnen één maand.", "Binnen drie maanden na overlijden.", "Binnen één jaar.", "Er is geen termijn."],
      correct: 1,
      exp: "De echtgenoot kan de toedeling ongedaan maken binnen drie maanden na het overlijden (art. 4:18 lid 2 BW)."
    },
    {
      q: "Welke handeling kan leiden tot automatische 'zuivere aanvaarding'?",
      options: [
        "Het regelen van de uitvaart.",
        "Het verkopen of leeghalen van de woning en de opbrengst voor jezelf houden.",
        "Het inzien van het testament bij de notaris.",
        "Het opstellen van een boedelbeschrijving."
      ],
      correct: 1,
      exp: "Gedragingen waarbij je beschikt over goederen van de nalatenschap als een eigenaar kunnen leiden tot zuivere aanvaarding."
    },
    {
      q: "Wie zijn de 'legitimarissen'?",
      options: [
        "De echtgenoot en de ouders.",
        "De kinderen van de erflater (en bij plaatsvervulling hun kleinkinderen).",
        "Iedereen die in het testament staat.",
        "De broers en zussen van de overledene."
      ],
      correct: 1,
      exp: "Legitimarissen zijn uitsluitend de afstammelingen (kinderen/kleinkinderen)."
    },
    {
      q: "Wat houdt 'verzorgingsvruchtgebruik' (art. 4:30 BW) in?",
      options: [
        "De echtgenoot krijgt een verpleegster betaald uit de erfenis.",
        "Vruchtgebruik op andere goederen van de nalatenschap als de echtgenoot behoefte heeft aan verzorging.",
        "Het recht om alle bezittingen direct te verkopen.",
        "Een verplichte gift aan het verzorgingstehuis."
      ],
      correct: 1,
      exp: "Dit dwingende recht biedt extra verzorging aan de langstlevende indien daar behoefte aan is."
    },
    {
      q: "Wat is 'gerechtelijke vaststelling' van ouderschap (art. 1:207 BW)?",
      options: [
        "Een vorm van adoptie.",
        "Wanneer de rechter het ouderschap vaststelt als een ouder niet vrijwillig erkent.",
        "Een notariële akte voor erkenning.",
        "Het aanwijzen van een executeur door de rechter."
      ],
      correct: 1,
      exp: "Dit creëert een familierechtelijke betrekking met terugwerkende kracht tot de geboorte."
    },
    {
      q: "Wat gebeurt er als een erflater sterft zonder testament en zonder familie tot in de vierde parenteel?",
      options: [
        "De erfenis gaat naar de buren.",
        "De Staat der Nederlanden krijgt de nalatenschap (bij gebrek aan erfgenamen).",
        "De notaris mag het geld houden.",
        "Het geld wordt verbrand."
      ],
      correct: 1,
      exp: "Volgens het parentele systeem vervalt de erfenis uiteindelijk aan de Staat als er geen wettelijke erfgenamen zijn."
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
          <span className="text-xl font-bold tracking-tighter text-[#1A365D]">ELBERT'S KENNISBANK</span>
          <span className="text-[9px] uppercase tracking-[0.4em] text-[#C5A059] font-black italic">Editie Erfrecht — Score: {currentScore} / {QUESTIONS.length}</span>
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
                <div className="w-64 h-64 rounded-full border-[12px] border-white shadow-2xl overflow-hidden mx-auto bg-stone-100">
                    <img src="/foto.jpg" alt="Meester Elbert" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-[#C5A059] text-white w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-xl rotate-12 border-4 border-white">
                    <span className="text-3xl font-bold">30</span>
                    <span className="text-[8px] uppercase font-black">Vragen</span>
                </div>
              </div>
              <h1 className="text-7xl font-bold text-[#1A365D] leading-tight font-serif italic tracking-tight">Erfrecht Masterclass.</h1>
              <p className="text-stone-500 text-2xl italic font-light max-w-2xl mx-auto">Focus op Boek 4: Parentelen, Wettelijke Verdeling en Legitieme Portie.</p>
              <button onClick={() => setGameState('quiz')} className="px-16 py-6 bg-[#1A365D] text-white rounded-full font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:scale-105 transition-all">Begin de Training</button>
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
                      <h4 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-3 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>Ratio Legis</h4>
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
                <h2 className="text-5xl font-bold text-[#1A365D] mb-4 font-serif italic tracking-tight">Certificaat van Bekwaamheid</h2>
                <div className="text-[12rem] font-black leading-none text-[#1A365D] my-10">{currentScore}</div>
                <p className="text-4xl font-serif italic text-stone-800 mb-12">Cijfer: {((currentScore/QUESTIONS.length)*9 + 1).toFixed(1)}</p>
                <button onClick={() => window.location.reload()} className="px-16 py-6 border-2 border-[#1A365D] text-[#1A365D] rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-[#1A365D] hover:text-white transition-all shadow-lg">Herstart de Masterclass</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ElbertsErfrechtQuiz;