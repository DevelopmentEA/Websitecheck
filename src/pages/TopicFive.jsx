import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// 🧠 DE "BRAIN" VAN DE QUIZ (DATA & LOGICA)
// ============================================================================

// We gebruiken RegEx (Regular Expressions) om slim te zoeken.
// /b = woordgrens, zodat "wet" niet gevonden wordt in "wetenschap".
// (?=.*woord) is een lookahead om te zorgen dat combinaties gevonden worden.

const QUESTIONS = [
  // --- RECHTSORDE ---
  {
    id: 1,
    category: "Rechtsorde",
    question: "Een rechter wil toetsen aan een verdrag, maar de bepaling is niet 'rechtstreeks werkend'. Welk grondwetsartikel verbiedt dit en waarom?",
    modelAntwoord: "Artikel 94 Gw. Dit artikel bepaalt dat nationale wetten alleen buiten toepassing blijven als ze botsen met 'eenieder verbindende' (rechtstreeks werkende) bepalingen.",
    checks: [
      {
        regex: /(art\.?|artikel)\s*94/i,
        tip: "🔍 Je mist het specifieke grondwetsartikel. Welk artikel regelt de voorrang?",
      },
      {
        regex: /(eenieder verbindend|rechtstreeks werkend)/i,
        tip: "💡 De kern is de status van de bepaling. Hoe noemt de Grondwet bepalingen die directe werking hebben ('eenieder...')?",
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
        regex: /(inhoud|strekking|context)/i,
        tip: "⚖️ Waar moet de rechter naar kijken volgens de HR? (De aard van de bepaling...)",
      },
      {
        regex: /(onvoorwaardelijk|nauwkeurig|objectief)/i,
        tip: "💡 Het criterium is of de norm duidelijk genoeg is om zonder extra wetgeving te functioneren. Welke woorden horen daarbij?",
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
        regex: /(soeverein|gelijkheid)/i,
        tip: "👑 Het kernwoord van 1648 is dat elke staat de baas is in eigen huis. Hoe heet dat?",
      },
      {
        regex: /(horizontaal|co-?existentie)/i,
        tip: "💡 De structuur veranderde van 'boven naar beneden' (Paus) naar 'naast elkaar'. Welke term hoort daarbij?",
      }
    ]
  },

  // --- SUBJECTEN ---
  {
    id: 4,
    category: "Subjecten",
    question: "Noem de vier criteria van staatvorming uit het Montevideo-verdrag.",
    modelAntwoord: "1. Permanente bevolking, 2. Afgebakend grondgebied, 3. Gezag/Regering, 4. Bekwaamheid tot betrekkingen met andere staten.",
    checks: [
      { regex: /bevolking/i, tip: "👥 Je mist het menselijke element." },
      { regex: /(grondgebied|territoir)/i, tip: "🌍 Je mist het ruimtelijke element." },
      { regex: /(gezag|regering|overheid)/i, tip: "🏛️ Je mist het element van bestuur/controle." },
      { regex: /(betrekking|relatie)/i, tip: "🤝 Je mist het externe element (relaties met anderen)." }
    ]
  },
  {
    id: 5,
    category: "Subjecten",
    question: "IO's hebben 'beperkte functionele subjectiviteit'. Wat betekent het 'specialiteitsbeginsel' in dit kader?",
    modelAntwoord: "Een IO heeft alleen die bevoegdheden die door de staten zijn overgedragen om hun specifieke doelen te bereiken (attributie).",
    checks: [
      {
        regex: /(doel|functie|taak)/i,
        tip: "🎯 Waar is de macht van een IO aan gebonden? (Denk aan waarom ze zijn opgericht).",
      },
      {
        regex: /(overgedragen|toegekend|attributie)/i,
        tip: "💡 Hebben ze die macht van zichzelf? Of krijgen ze die van staten?",
      }
    ]
  },

  // --- BRONNEN ---
  {
    id: 6,
    category: "Bronnen",
    question: "Om gewoonterecht te vormen heb je 'usus' nodig en 'opinio juris'. Wat houdt 'opinio juris' in?",
    modelAntwoord: "De rechtsovertuiging dat de handeling verplicht is. Het subjectieve element (psychological element).",
    checks: [
      {
        regex: /(plicht|verplicht|gebonden)/i,
        tip: "⚖️ Het gaat niet alleen om gewoonte, maar om het gevoel dat het MOET. Gebruik woorden als 'plicht'.",
      },
      {
        regex: /(juridisch|rechts)/i,
        tip: "💡 Het is geen morele plicht, maar een ... plicht?",
      }
    ]
  },
  {
    id: 7,
    category: "Bronnen",
    question: "Een verdrag is in strijd met een 'Jus Cogens' norm. Wat is de consequentie volgens art. 53 WVV?",
    modelAntwoord: "Het verdrag is nietig (void ab initio). Jus cogens is dwingend recht waar niet van afgeweken mag worden.",
    checks: [
      {
        regex: /(nietig|ongeldig)/i,
        tip: "🚫 Wat gebeurt er met het verdrag? Is het vernietigbaar of direct ...?",
      },
      {
        regex: /(dwingend|afwijking)/i,
        tip: "🔒 Waarom is Jus Cogens zo speciaal? Mag je er van afwijken?",
      }
    ]
  },

  // --- AANSPRAKELIJKHEID ---
  {
    id: 8,
    category: "Aansprakelijkheid",
    question: "Wat houdt de 'Ultra Vires' regel in bij staatsaansprakelijkheid (Art. 7 ILC)?",
    modelAntwoord: "Handelingen van staatsorganen worden aan de staat toegerekend, ZELFS als ze hun bevoegdheden of instructies te buiten gingen.",
    checks: [
      {
        regex: /(toegerekend|aansprakelijk|verantwoordelijk)/i,
        tip: "👉 Wie is er uiteindelijk de klos als een ambtenaar zijn boekje te buiten gaat?",
      },
      {
        regex: /(bevoegdheid|instructie|boekje)/i,
        tip: "📚 Waar gaat ultra vires over? Iemand die buiten zijn ... handelt.",
      }
    ]
  },
  {
    id: 9,
    category: "Aansprakelijkheid",
    question: "Wat is het verschil tussen 'Force Majeure' en 'Distress' (Noodtoestand)?",
    modelAntwoord: "Bij Force Majeure is nakoming materieel onmogelijk (geen keuze). Bij Distress is er een theoretische keuze, maar handelt men om levens te redden.",
    checks: [
      {
        regex: /(onmogelijk|machteloos)/i,
        tip: "🌪️ Wat is kenmerkend voor Force Majeure (overmacht)? Kun je er iets aan doen?",
      },
      {
        regex: /(leven|redden)/i,
        tip: "🆘 Waar draait Distress (noodtoestand) meestal om? Wat probeert men te beschermen?",
      }
    ]
  },
  {
    id: 10,
    category: "Geschillen",
    question: "In de 'Monetary Gold' zaak weigerde het IGH recht te spreken. Waarom?",
    modelAntwoord: "Het Hof kan niet oordelen over de rechten van een derde staat die geen partij is, als die belangen de kern van de zaak vormen (consensus-beginsel).",
    checks: [
      {
        regex: /(derde|partij)/i,
        tip: "👥 Het ging over een land dat NIET bij de zaak aanwezig was. Hoe noemen we zo'n staat?",
      },
      {
        regex: /(instemming|consensus|wil)/i,
        tip: "⚖️ Waarop is de rechtsmacht van het IGH gebaseerd? (Het fundamentele beginsel).",
      }
    ]
  },

  // --- ZEERECHT & RUIMTE ---
  {
    id: 11,
    category: "Zeerecht",
    question: "Wat is het concept van 'Vlaggenstaatjurisdictie' op de volle zee?",
    modelAntwoord: "Op de volle zee heeft alleen de staat waar het schip geregistreerd staat (de vlaggenstaat) rechtsmacht (exclusieve jurisdictie).",
    checks: [
      {
        regex: /(vlag|registratie)/i,
        tip: "🚩 Welk land is de baas op het schip? Het land van de ...?",
      },
      {
        regex: /(exclusief|alleen)/i,
        tip: "💡 Mag een ander land zomaar ingrijpen? Nee, de jurisdictie is ...?",
      }
    ]
  },
  {
    id: 12,
    category: "Zeerecht",
    question: "Schepen hebben recht op 'onschuldige doorvaart' in de territoriale zee. Wanneer is doorvaart NIET onschuldig?",
    modelAntwoord: "Als het de vrede, orde of veiligheid van de kuststaat in gevaar brengt (bijv. vissen, spioneren, wapenoefeningen).",
    checks: [
      {
        regex: /(vrede|orde|veiligheid)/i,
        tip: "🛡️ Wat zijn de drie kernwaarden die niet geschonden mogen worden? (V..., O..., V...).",
      },
      {
        regex: /(gevaar|schaden)/i,
        tip: "🚫 De doorvaart is niet onschuldig als het de kuststaat ...?",
      }
    ]
  },

  // --- IMMUNITEIT ---
  {
    id: 13,
    category: "Immuniteit",
    question: "Welke drie functionarissen ('De Grote Drie') genieten absolute personele immuniteit zolang ze in functie zijn?",
    modelAntwoord: "Staatshoofd, Regeringsleider en Minister van Buitenlandse Zaken.",
    checks: [
      { regex: /staatshoofd/i, tip: "👑 Je mist de hoogste persoon van het land." },
      { regex: /regeringsleider/i, tip: "💼 Je mist de baas van het kabinet (Premier). " },
      { regex: /(buitenlandse|buza)/i, tip: "🌍 Je mist de minister die over de grenzen gaat." }
    ]
  },
  {
    id: 14,
    category: "Immuniteit",
    question: "Wat is het verschil tussen immuniteit en onschendbaarheid bij diplomaten?",
    modelAntwoord: "Immuniteit betekent dat de rechter geen macht over je heeft (procesrechtelijk). Onschendbaarheid betekent dat de politie je niet mag aanraken/arresteren (fysiek).",
    checks: [
      {
        regex: /(rechter|proces|vervolging)/i,
        tip: "⚖️ Immuniteit beschermt je tegen een specifieke macht. Welke?",
      },
      {
        regex: /(arrestatie|aanhouden|fysiek)/i,
        tip: "👮 Onschendbaarheid beschermt je lichaam/vrijheid. Waar mag de politie niet toe overgaan?",
      }
    ]
  },
  {
    id: 15,
    category: "Geschillen",
    question: "Wat is 'Forum Prorogatum' bij het IGH?",
    modelAntwoord: "Stilzwijgende instemming met de rechtsmacht van het Hof door te verschijnen in het proces en te pleiten, zonder bezwaar te maken.",
    checks: [
      {
        regex: /(instemming|accepteren)/i,
        tip: "👍 Wat doe je feitelijk als je komt opdagen? Je geeft ...?",
      },
      {
        regex: /(verschijnen|pleiten|meedoen)/i,
        tip: "🏛️ Hoe geef je die instemming? Niet via een brief, maar door te ...?",
      }
    ]
  }
];

// ============================================================================
// 🎮 DE APP COMPONENT
// ============================================================================

export default function SmartLegalTrainer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState(null); // null = nog niet gecheckt, [] = goed, [tips] = fouten
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = QUESTIONS[currentIndex];
  const isLastQuestion = currentIndex === QUESTIONS.length - 1;

  // De "AI" Logic
  const handleCheck = () => {
    if (!userInput.trim()) return;

    const missedTips = [];
    let passedChecks = 0;

    currentQ.checks.forEach(check => {
      if (check.regex.test(userInput)) {
        passedChecks++;
      } else {
        missedTips.push(check.tip);
      }
    });

    setFeedback(missedTips);
    
    // Simpele scoring: als je 0 tips krijgt, of meer dan de helft van de keywords hebt
    if (missedTips.length === 0) {
      setScore(s => s + 10);
    } else if (missedTips.length < currentQ.checks.length) {
      setScore(s => s + 5); // Halve punten voor "bijna goed"
    }

    // Toon altijd het modelantwoord na checken
    setShowModelAnswer(true);
  };

  const handleNext = () => {
    setUserInput("");
    setFeedback(null);
    setShowModelAnswer(false);
    
    if (!isLastQuestion) {
      setCurrentIndex(prev => prev + 1);
    } else {
      alert(`Training voltooid! Je score: ${score} punten.`);
      // Reset of redirect hier
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-[#1A202C] font-sans py-10 px-4 flex flex-col items-center">
      
      {/* HEADER */}
      <div className="max-w-3xl w-full mb-8 flex justify-between items-end border-b-2 border-[#C5A059] pb-4">
        <div>
          <h1 className="text-3xl font-serif text-[#1A365D] italic font-bold">Smart Legal Trainer</h1>
          <p className="text-sm text-slate-500 uppercase tracking-widest mt-1">International Public Law • IPR</p>
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
          {/* Categorie Tag */}
          <span className="inline-block px-3 py-1 bg-blue-50 text-[#1A365D] text-xs font-bold rounded-full mb-4 uppercase tracking-wide">
            {currentQ.category}
          </span>

          {/* De Vraag */}
          <h2 className="text-2xl font-serif text-[#1A365D] mb-6 leading-relaxed">
            {currentQ.question}
          </h2>

          {/* Input Gebied */}
          <textarea
            className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-[#C5A059] focus:ring-0 transition-colors text-lg min-h-[150px] resize-y"
            placeholder="Typ hier jouw juridische analyse..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={showModelAnswer}
          />

          {/* Knoppen */}
          <div className="mt-6 flex justify-end">
            {!showModelAnswer ? (
              <button
                onClick={handleCheck}
                disabled={!userInput.trim()}
                className="bg-[#1A365D] text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#2a4a7f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Check Antwoord
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-[#C5A059] text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#b08d4a] transition-colors shadow-lg flex items-center gap-2"
              >
                {isLastQuestion ? "Afronden" : "Volgende Vraag →"}
              </button>
            )}
          </div>
        </div>

        {/* FEEDBACK AREA (Verschijnt na check) */}
        <AnimatePresence>
          {showModelAnswer && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-slate-50 border-t border-slate-200"
            >
              <div className="p-8 md:p-12">
                
                {/* 1. De AI Feedback */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 tracking-wider">Analyse van jouw antwoord</h3>
                  
                  {feedback && feedback.length === 0 ? (
                    <div className="flex items-center gap-3 text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">
                      <span className="text-2xl">✨</span>
                      <span className="font-bold">Uitstekend! Je hebt alle kernconcepten benoemd.</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-[#1A365D] font-medium mb-2">Je zit in de goede richting, maar let hier op:</p>
                      {feedback.map((tip, i) => (
                        <motion.div 
                          key={i}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3 bg-white p-3 rounded-lg border-l-4 border-orange-400 shadow-sm"
                        >
                          <span className="text-orange-500 mt-1">💡</span>
                          <span className="text-slate-700 text-sm">{tip}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Het Modelantwoord */}
                <div>
                  <h3 className="text-sm font-bold uppercase text-slate-400 mb-2 tracking-wider">Het Modelantwoord</h3>
                  <div className="bg-[#1A365D]/5 p-6 rounded-xl border border-[#1A365D]/10">
                    <p className="text-[#1A365D] text-lg leading-relaxed font-serif">
                      {currentQ.modelAntwoord}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 text-slate-400 text-xs text-center">
        Gebouwd voor Elbert Knowledge Base • Powered by Frontend RegEx Logic
      </div>
    </div>
  );
}