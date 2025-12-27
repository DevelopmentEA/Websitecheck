import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const StrafrechtQuiz = () => {
  const [gameState, setGameState] = useState('start');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({}); 
  const [showFeedback, setShowFeedback] = useState(false);

  const QUESTIONS = useMemo(() => [
    {
      q: "Wat is het gevolg voor de opbouw van het strafbare feit als 'wederrechtelijkheid' expliciet als bestanddeel in de delictsomschrijving is opgenomen (zoals bij vernieling)?",
      options: [
        "Er zijn dan vier lagen: gedraging, delictsomschrijving, wederrechtelijkheid en verwijtbaarheid.",
        "De wederrechtelijkheid verschuift van element naar bestanddeel; het strafbare feit bestaat dan uit drie lagen.",
        "De verdachte moet dan altijd een beroep doen op overmacht om strafbaarheid te ontlopen.",
        "De officier van justitie hoeft de wederrechtelijkheid dan niet meer te bewijzen."
      ],
      correct: 1,
      exp: "Als wederrechtelijkheid in de delictsomschrijving staat, is het een bestanddeel. Is de delictsomschrijving vervuld, dan staat de wederrechtelijkheid vast. Het feit bestaat dan uit: gedraging, delictsomschrijving en verwijtbaarheid."
    },
    {
      q: "Welke interpretatiemethode hanteert de rechter wanneer hij de betekenis van een bepaling afleidt uit de bedoeling die de wetgever had ten tijde van de totstandkoming?",
      options: [
        "De grammaticale interpretatiemethode.",
        "De teleologische interpretatiemethode.",
        "De wetshistorische interpretatiemethode.",
        "De wetssystematische interpretatiemethode."
      ],
      correct: 2,
      exp: "Bij de wetshistorische methode kijkt de rechter naar de parlementaire geschiedenis en de bedoeling van de wetgever bij het in het leven roepen van de bepaling."
    },
    {
      q: "In het Porsche-arrest oordeelde de Hoge Raad dat er sprake was van bewuste schuld (culpa) en niet van voorwaardelijk opzet. Wat was hierbij een doorslaggevende contra-indicatie?",
      options: [
        "De verdachte was dronken en kon daardoor niet logisch nadenken.",
        "De verdachte had eerdere inhaalpogingen afgebroken, wat wees op het niet aanvaarden van de kans op een ongeval.",
        "De verdachte reed in een dure auto die hij niet wilde beschadigen.",
        "De verdachte had de tegenliggers totaal niet gezien."
      ],
      correct: 1,
      exp: "De Hoge Raad stelde dat het afbreken van eerdere inhaalpogingen een contra-indicatie was: hij wilde het risico blijkbaar niet zomaar aanvaarden (objectiveren)."
    },
    {
      q: "Wat is het wezenlijke verschil tussen voorwaardelijk opzet en bewuste schuld?",
      options: [
        "Bij voorwaardelijk opzet is er geen sprake van weten, bij schuld wel.",
        "Bij voorwaardelijk opzet neemt de dader de kans op de koop toe; bij bewuste schuld vertrouwt hij (lichtvaardig) op een goede afloop.",
        "Voorwaardelijk opzet wordt gestraft als overtreding, bewuste schuld als misdrijf.",
        "Er is geen verschil; beide termen betekenen juridisch hetzelfde."
      ],
      correct: 1,
      exp: "De grens ligt bij de aanvaarding: 'het zal wel niet gebeuren' is bewuste schuld, 'en als het gebeurt, dan is dat maar zo' is voorwaardelijk opzet."
    },
    {
      q: "Wanneer is er sprake van een 'materieel' omschreven delict (gevolgsdelict)?",
      options: [
        "Wanneer de wet een specifieke handeling strafbaar stelt, ongeacht het gevolg.",
        "Wanneer het delict alleen door een ambtenaar gepleegd kan worden.",
        "Wanneer een bepaald resultaat of gevolg strafbaar is gesteld, ongeacht de wijze waarop dit is veroorzaakt.",
        "Wanneer het delict is opgenomen in het Wetboek van Strafvordering."
      ],
      correct: 2,
      exp: "Bij een materieel delict (zoals art. 287 Sr, doodslag) gaat het om het teweegbrengen van een gevolg (de dood), niet om de specifieke handeling."
    },
    {
      q: "Welke strafuitsluitingsgrond neemt de verwijtbaarheid (schuld) van de dader weg?",
      options: [
        "Noodweer.",
        "Bevoegd gegeven ambtelijk bevel.",
        "Wettelijk voorschrift.",
        "Ontoerekeningsvatbaarheid."
      ],
      correct: 3,
      exp: "Ontoerekeningsvatbaarheid is een schulduitsluitingsgrond. Noodweer is een rechtvaardigingsgrond (neemt wederrechtelijkheid weg)."
    },
    {
      q: "Volgens de leer van de redelijke toerekening (Letale longembolie) is causaliteit aanwezig wanneer...",
      options: [
        "Het gevolg redelijkerwijs aan het handelen van de verdachte kan worden toegerekend, gezien de omstandigheden.",
        "Het gevolg onmogelijk had kunnen intreden zonder de handeling (conditio sine qua non).",
        "De handeling de directe en enige oorzaak was van het gevolg.",
        "De verdachte het gevolg expliciet gewild heeft."
      ],
      correct: 0,
      exp: "De Hoge Raad hanteert de leer van de redelijke toerekening: het hangt af van de specifieke omstandigheden of toerekening redelijk is, zelfs als het gevolg niet direct medisch noodzakelijk was."
    },
    {
      q: "Wat houdt het 'materieel criterium' voor een verdachte in (art. 27 lid 1 Sv)?",
      options: [
        "Dat de persoon is aangehouden door een opsporingsambtenaar.",
        "Dat er een redelijk vermoeden van schuld aan een strafbaar feit bestaat, voortvloeiend uit feiten of omstandigheden.",
        "Dat de officier van justitie heeft besloten tot vervolging over te gaan.",
        "Dat de verdachte een bekentenis heeft afgelegd."
      ],
      correct: 1,
      exp: "Art. 27 lid 1 Sv definieert de verdachte als degene te wiens aanzien uit feiten of omstandigheden een redelijk vermoeden van schuld aan een strafbaar feit voortvloeit."
    },
    {
      q: "Welk beginsel van behoorlijke procesorde speelde een centrale rol in het arrest 'Braak bij binnentreden'?",
      options: [
        "Het gelijkheidsbeginsel.",
        "Het vertrouwensbeginsel.",
        "Het beginsel van zuiverheid van oogmerk (détournement de pouvoir).",
        "Het beginsel van redelijke en billijke belangenafweging (subsidiariteit/proportionaliteit)."
      ],
      correct: 3,
      exp: "In 'Braak bij binnentreden' ging het om de proportionaliteit en subsidiariteit: mag de politie zware schade aanrichten (deur forceren) voor een relatief licht feit?"
    },
    {
      q: "Voor voorlopige hechtenis moet worden voldaan aan vier voorwaarden. Welke hoort daar NIET bij?",
      options: [
        "Ernstige bezwaren tegen de verdachte.",
        "Een geval waarin voorlopige hechtenis is toegelaten (bijv. 4-jaars feit).",
        "De verdachte moet op heterdaad zijn betrapt.",
        "Een grond zoals vluchtgevaar of gewichtige redenen van maatschappelijke veiligheid."
      ],
      correct: 2,
      exp: "Heterdaad is geen vereiste voor voorlopige hechtenis. De vereisten zijn: geval (art 67), grond (art 67a), ernstige bezwaren en het anticipatiegebod."
    },
    {
      q: "Mag een burger een verdachte aanhouden?",
      options: [
        "Nee, dit is een exclusieve bevoegdheid van opsporingsambtenaren.",
        "Ja, maar alleen in geval van ontdekking op heterdaad (art. 53 Sv).",
        "Ja, mits de burger eerst toestemming vraagt aan de Officier van Justitie.",
        "Nee, tenzij het om een levensbedreigende situatie gaat."
      ],
      correct: 1,
      exp: "Bij ontdekking op heterdaad is 'ieder' bevoegd de verdachte aan te houden (art. 53 Sv), dus ook burgers."
    },
    {
      q: "Wat houdt de 'grondslagleer' in het strafprocesrecht in?",
      options: [
        "De rechter moet oordelen op basis van wat er werkelijk is gebeurd, ongeacht het dossier.",
        "De rechter is gebonden aan de tenlastelegging en mag alleen datgene beoordelen wat de OvJ ten laste heeft gelegd.",
        "De rechter mag zelf feiten toevoegen aan de tenlastelegging als hij dat nodig acht.",
        "De grondslag van het vonnis moet altijd gebaseerd zijn op het EVRM."
      ],
      correct: 1,
      exp: "De grondslagleer betekent dat de tenlastelegging het kader vormt: de rechter mag niet buiten de tenlastelegging treden (art. 348/350 Sv systematiek)."
    },
    {
      q: "Welke beslissing volgt als de rechter bij de vragen van art. 350 Sv vaststelt dat het feit wel bewezen is, maar niet kwalificeerbaar is als strafbaar feit?",
      options: [
        "Vrijspraak.",
        "Niet-ontvankelijkheid van het Openbaar Ministerie.",
        "Ontslag van alle rechtsvervolging (OVAR).",
        "Schorsing van de vervolging."
      ],
      correct: 2,
      exp: "Als het bewezenverklaarde geen strafbaar feit oplevert (kwalificatievraag), volgt ontslag van alle rechtsvervolging."
    },
    {
      q: "Wat is het gevolg van een geslaagd beroep op een rechtvaardigingsgrond (zoals noodweer) in het schema van 350 Sv?",
      options: [
        "Vrijspraak, want de wederrechtelijkheid ontbreekt.",
        "Ontslag van alle rechtsvervolging, want de wederrechtelijkheid ontbreekt.",
        "Ontslag van alle rechtsvervolging, want de verwijtbaarheid ontbreekt.",
        "Vrijspraak, want het feit is niet bewezen."
      ],
      correct: 1,
      exp: "Een rechtvaardigingsgrond neemt de wederrechtelijkheid weg. Als de wederrechtelijkheid geen bestanddeel in de tenlastelegging was, leidt dit tot OVAR."
    },
    {
      q: "Welke straf is een 'bijkomende straf' volgens art. 9 Sr?",
      options: [
        "Gevangenisstraf.",
        "Taakstraf.",
        "Ontzetting van bepaalde rechten.",
        "Plaatsing in een inrichting voor stelselmatige daders (ISD)."
      ],
      correct: 2,
      exp: "Gevangenisstraf, hechtenis, taakstraf en geldboete zijn hoofdstraffen. Ontzetting van rechten, verbeurdverklaring en openbaarmaking uitspraak zijn bijkomende straffen. ISD is een maatregel."
    },
    {
      q: "Wat is de maximale duur van een tijdelijke gevangenisstraf in Nederland?",
      options: [
        "20 jaar.",
        "25 jaar.",
        "30 jaar.",
        "Levenslang (dus geen tijdelijke limiet)."
      ],
      correct: 2,
      exp: "De maximale tijdelijke gevangenisstraf is 30 jaar (art. 10 lid 4 Sr). Levenslang is een aparte strafsoort."
    },
    {
      q: "Wanneer is het Openbaar Ministerie niet-ontvankelijk?",
      options: [
        "Wanneer het bewijs onvoldoende is.",
        "Wanneer het recht tot strafvervolging is vervallen (bijv. door verjaring of overlijden verdachte).",
        "Wanneer de dagvaarding nietig is verklaard.",
        "Wanneer de rechter onbevoegd is."
      ],
      correct: 1,
      exp: "Niet-ontvankelijkheid volgt als er een vervolgingsbeletsel is, zoals verjaring, klachtdelict zonder klacht, ne bis in idem of overlijden."
    },
    {
      q: "Wat houdt 'sprongcassatie' in en is dit toegestaan in het Nederlandse strafrecht?",
      options: [
        "Direct van de rechtbank naar de Hoge Raad; dit is toegestaan.",
        "Direct van de rechtbank naar de Hoge Raad; dit is NIET toegestaan.",
        "Van het gerechtshof naar het EHRM; dit is toegestaan.",
        "Een cassatieberoep zonder advocaat; dit is NIET toegestaan."
      ],
      correct: 1,
      exp: "Nederland kent een gesloten stelsel van rechtsmiddelen. Sprongcassatie (hoger beroep overslaan) is niet toegelaten (art. 78 lid 5 RO)."
    },
    {
      q: "Wat is het essentiële verschil tussen een straf en een maatregel?",
      options: [
        "Een straf wordt door de rechter opgelegd, een maatregel door de OvJ.",
        "Een straf is gericht op vergelding/leedtoevoeging, een maatregel op herstel of beveiliging van de samenleving.",
        "Een maatregel kan alleen aan minderjarigen worden opgelegd.",
        "Er is geen verschil, het zijn synoniemen."
      ],
      correct: 1,
      exp: "Straffen zien op vergelding (leed toevoegen). Maatregelen (zoals TBS of ontneming) zien op beveiliging van de maatschappij of herstel van de rechtmatige situatie."
    },
    {
      q: "Wanneer mag een doorzoeking ter inbeslagneming in een woning plaatsvinden zonder toestemming bewoner?",
      options: [
        "Dit mag nooit.",
        "Alleen door de Rechter-Commissaris (tenzij spoed/heterdaad uitzonderingen art. 97 Sv).",
        "Altijd door een hulpofficier van justitie.",
        "Door iedere burger bij heterdaad."
      ],
      correct: 1,
      exp: "Doorzoeking van een woning is voorbehouden aan de Rechter-Commissaris (art. 110 Sv), behoudens strikte uitzonderingen in art. 97 Sv."
    }
  ], []);

  // --- LOGICA ---
  const handleAnswer = (optionIdx: number) => {
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
                    {/* Placeholder image logic or text if no image available */}
                    <span className="text-6xl">⚖️</span>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-[#C5A059] text-white w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-xl rotate-12 border-4 border-white">
                    <span className="text-3xl font-bold">{QUESTIONS.length}</span>
                    <span className="text-[8px] uppercase font-black">Vragen</span>
                </div>
              </div>
              <h1 className="text-7xl font-bold text-[#1A365D] leading-tight font-serif italic tracking-tight">Inleiding Strafrecht.</h1>
              <p className="text-stone-500 text-2xl italic font-light max-w-2xl mx-auto">Week 1 t/m 7: Van materieel strafrecht tot het sanctiestelsel.</p>
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

export default StrafrechtQuiz;