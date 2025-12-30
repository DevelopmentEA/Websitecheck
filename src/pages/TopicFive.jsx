import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// 🧠 DATA & LOGICA (Regex Soepeler Gemaakt)
// ============================================================================

const QUESTIONS = [
  // --- RECHTSORDE ---
  {
    id: 1,
    category: "Rechtsorde",
    question: "Een rechter wil toetsen aan een verdrag, maar de bepaling is niet 'rechtstreeks werkend'. Welk grondwetsartikel verbiedt dit en waarom?",
    modelAntwoord: "Artikel 94 Gw. Dit artikel bepaalt dat nationale wetten alleen buiten toepassing blijven als ze botsen met 'eenieder verbindende' (rechtstreeks werkende) bepalingen.",
    checks: [
      {
        // Zoekt naar 94 (als los getal) OF "vierennegentig"
        regex: /(\b94\b|vierennegentig)/i,
        tip: "🔍 Je mist het artikelnummer. Welk artikel in de Grondwet regelt de voorrang (ergens in de 90)?",
      },
      {
        // Zoekt naar: eenieder, verbindend, rechtstreeks, direct, of werking
        regex: /(eenieder|verbindend|rechtstreeks|direct|werking)/i,
        tip: "💡 De kern is de status van de bepaling. De rechter mag alleen toetsen als de bepaling '... verbindend' is.",
      }
    ]
  },
  {
    id: 2,
    category: "Rechtsorde",
    question: "Wat leerde de Hoge Raad ons in het Spoorwegstaking-arrest over de vraag wanneer een verdragsbepaling rechtstreeks werkt?",
    modelAntwoord: "De rechter moet kijken naar de 'inhoud en strekking' van de bepaling. Is deze onvoorwaardelijk en nauwkeurig genoeg om als objectief recht te functioneren?",
    checks: [
      {
        // Inhoud OR Strekking OR Aard OR Context
        regex: /(inhoud|strekking|aard|context)/i,
        tip: "⚖️ Waar moet de rechter naar kijken volgens de HR? (De ... van de bepaling)",
      },
      {
        // Onvoorwaardelijk OR Nauwkeurig OR Duidelijk OR Concreet
        regex: /(onvoorwaardelijk|nauwkeurig|duidelijk|concreet|objectief)/i,
        tip: "💡 Het criterium is of de norm helder genoeg is. Gebruik woorden als 'onvoorwaardelijk' of 'nauwkeurig'.",
      }
    ]
  },
  {
    id: 3,
    category: "Rechtsorde",
    question: "Leg uit waarom de Vrede van Westfalen (1648) het begin markeert van het moderne volkenrecht. Welk structuurprincipe veranderde?",
    modelAntwoord: "De verticale hiërarchie (Paus/Keizer) werd vervangen door horizontale soevereine gelijkheid van staten (co-existentie).",
    checks: [
      {
        regex: /(soeverein|gelijk|baas)/i,
        tip: "👑 Het kernwoord van 1648 is dat elke staat de baas is in eigen huis. Hoe heet dat?",
      },
      {
        regex: /(horizontaal|co-?existentie|naast|onder)/i,
        tip: "💡 De structuur veranderde. Vroeger stond de Paus BOVEN de staat, nu staan staten ... elkaar?",
      }
    ]
  },
  
  // ... (Voeg hier de rest van je vragen toe, de regex logic is nu overal 'fuzzier' door de OR | tekens te gebruiken) ...
  
  {
    id: 4,
    category: "Subjecten",
    question: "Noem de vier criteria van staatvorming uit het Montevideo-verdrag.",
    modelAntwoord: "1. Permanente bevolking, 2. Afgebakend grondgebied, 3. Gezag/Regering, 4. Bekwaamheid tot betrekkingen met andere staten.",
    checks: [
      { regex: /(bevolking|inwoners|volk)/i, tip: "👥 Je mist het menselijke element (mensen)." },
      { regex: /(grondgebied|territoir|gebied|land)/i, tip: "🌍 Je mist het ruimtelijke element (de grond)." },
      { regex: /(gezag|regering|overheid|bestuur)/i, tip: "🏛️ Je mist het element van bestuur/controle." },
      { regex: /(betrekking|relatie|extern|buitenland)/i, tip: "🤝 Je mist het externe element (relaties met anderen)." }
    ]
  },
];

// ============================================================================
// 🎮 DE APP COMPONENT
// ============================================================================

export default function SmartLegalTrainer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  
  // States voor de logica
  const [feedback, setFeedback] = useState(null); // Lijst met tips
  const [hasChecked, setHasChecked] = useState(false); // Heeft de user al op 'check' gedrukt?
  const [showModelAnswer, setShowModelAnswer] = useState(false); // Mag het antwoord getoond worden?
  const [score, setScore] = useState(0);

  const currentQ = QUESTIONS[currentIndex];
  const isLastQuestion = currentIndex === QUESTIONS.length - 1;

  // 1. Check Functie (Toont tips, maar nog niet het antwoord als het fout is)
  const handleCheck = () => {
    if (!userInput.trim()) return;

    const missedTips = [];
    currentQ.checks.forEach(check => {
      if (!check.regex.test(userInput)) {
        missedTips.push(check.tip);
      }
    });

    setFeedback(missedTips);
    setHasChecked(true); // We hebben gecheckt!

    // Als alles goed is: Direct door naar succes-modus
    if (missedTips.length === 0) {
      setShowModelAnswer(true);
      setScore(s => s + 10); // Volle punten
    }
  };

  // 2. "Ik geef op" / "Toon antwoord" functie
  const handleShowAnswer = () => {
    setShowModelAnswer(true);
    // Geen punten (of minder) als je spiekt
  };

  // 3. Volgende vraag reset alles
  const handleNext = () => {
    setUserInput("");
    setFeedback(null);
    setHasChecked(false);
    setShowModelAnswer(false);
    
    if (!isLastQuestion) {
      setCurrentIndex(prev => prev + 1);
    } else {
      alert(`Training voltooid! Je score: ${score} punten.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-[#1A202C] font-sans py-10 px-4 flex flex-col items-center">
      
      {/* HEADER */}
      <div className="max-w-3xl w-full mb-8 flex justify-between items-end border-b-2 border-[#C5A059] pb-4">
        <div>
          <h1 className="text-3xl font-serif text-[#1A365D] italic font-bold">Smart Legal Trainer</h1>
          <p className="text-sm text-slate-500 uppercase tracking-widest mt-1">Oefenmodule</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#C5A059]">{currentIndex + 1} / {QUESTIONS.length}</div>
          <div className="text-xs text-slate-400">Score: {score}</div>
        </div>
      </div>

      {/* CARD */}
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100">
          <motion.div 
            className="h-full bg-[#1A365D]" 
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        <div className="p-8 md:p-12">
          <span className="inline-block px-3 py-1 bg-blue-50 text-[#1A365D] text-xs font-bold rounded-full mb-4 uppercase tracking-wide">
            {currentQ.category}
          </span>

          <h2 className="text-2xl font-serif text-[#1A365D] mb-6 leading-relaxed">
            {currentQ.question}
          </h2>

          <textarea
            className={`w-full p-4 border-2 rounded-xl text-lg min-h-[150px] resize-y transition-colors
              ${hasChecked && feedback?.length > 0 ? 'border-orange-300 bg-orange-50' : 'border-slate-200 focus:border-[#C5A059]'}
              ${showModelAnswer ? 'bg-gray-100 text-gray-500' : ''}
            `}
            placeholder="Typ hier jouw juridische analyse..."
            value={userInput}
            onChange={(e) => {
                setUserInput(e.target.value);
                // Als ze gaan typen nadat ze fout hadden, reset de 'checked' state zodat de knop weer 'Check' wordt
                if (hasChecked && !showModelAnswer) setHasChecked(false);
            }}
            disabled={showModelAnswer} // Blokkeer input als antwoord zichtbaar is
          />

          {/* KNOPPEN LOGICA */}
          <div className="mt-6 flex justify-end gap-3">
            
            {/* Situatie 1: Nog niet gecheckt (of aan het verbeteren) */}
            {!showModelAnswer && !hasChecked && (
              <button
                onClick={handleCheck}
                disabled={!userInput.trim()}
                className="bg-[#1A365D] text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#2a4a7f] transition-colors shadow-lg disabled:opacity-50"
              >
                Check Antwoord
              </button>
            )}

            {/* Situatie 2: Gecheckt, maar fouten gevonden (Tips zijn zichtbaar) */}
            {!showModelAnswer && hasChecked && (
              <>
                <button
                  onClick={handleCheck}
                  className="bg-[#1A365D] text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-[#2a4a7f] transition-colors shadow-lg"
                >
                  Check Opnieuw ↻
                </button>
                <button
                  onClick={handleShowAnswer}
                  className="bg-slate-200 text-slate-600 px-6 py-3 rounded-lg font-bold text-lg hover:bg-slate-300 transition-colors"
                >
                  Toon Antwoord 👀
                </button>
              </>
            )}

            {/* Situatie 3: Antwoord is zichtbaar (Goed of Opgegeven) */}
            {showModelAnswer && (
              <button
                onClick={handleNext}
                className="bg-[#C5A059] text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#b08d4a] transition-colors shadow-lg flex items-center gap-2 animate-bounce-short"
              >
                {isLastQuestion ? "Afronden" : "Volgende Vraag →"}
              </button>
            )}
          </div>
        </div>

        {/* FEEDBACK & ANTWOORD SECTIE */}
        <AnimatePresence>
          
          {/* A. DE TIPS (Alleen zichtbaar als gecheckt en nog niet opgelost) */}
          {!showModelAnswer && hasChecked && feedback && feedback.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-orange-50 border-t border-orange-100 p-6 md:p-8"
            >
              <h3 className="text-orange-800 font-bold mb-3 flex items-center gap-2">
                <span>⚠️</span> Nog niet helemaal volledig:
              </h3>
              <div className="space-y-2">
                {feedback.map((tip, i) => (
                  <motion.div 
                    key={i}
                    initial={{ x: -10 }}
                    animate={{ x: 0 }}
                    className="text-orange-700 text-sm pl-4 border-l-2 border-orange-300"
                  >
                    {tip}
                  </motion.div>
                ))}
              </div>
              <p className="text-orange-600/60 text-xs mt-4 italic">Pas je antwoord aan in het vak hierboven en klik op 'Check Opnieuw'.</p>
            </motion.div>
          )}

          {/* B. HET MODELANTWOORD (Alleen zichtbaar na succes of 'toon antwoord') */}
          {showModelAnswer && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="bg-slate-50 border-t border-slate-200"
            >
              <div className="p-8 md:p-12">
                {/* Als er geen feedback meer was (dus alles goed), toon succes */}
                {(!feedback || feedback.length === 0) && (
                   <div className="flex items-center gap-3 text-green-700 bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                      <span className="text-2xl">✨</span>
                      <span className="font-bold">Helemaal goed! Je hebt alle kernpunten geraakt.</span>
                   </div>
                )}

                <h3 className="text-sm font-bold uppercase text-slate-400 mb-2 tracking-wider">Het Modelantwoord</h3>
                <div className="bg-[#1A365D]/5 p-6 rounded-xl border border-[#1A365D]/10">
                  <p className="text-[#1A365D] text-lg leading-relaxed font-serif">
                    {currentQ.modelAntwoord}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}