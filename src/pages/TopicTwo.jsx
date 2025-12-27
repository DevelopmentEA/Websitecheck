import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const StrafrechtHardQuiz = () => {
  const [gameState, setGameState] = useState('start');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [showFeedback, setShowFeedback] = useState(false);

  // 30 VRAGEN - MOEILIJK/EXPERT NIVEAU
  const QUESTIONS = useMemo(() => [
    // WEEK 1: Dogmatiek & Legaliteit
    {
      q: "Wat is het formele gevolg voor de einduitspraak als 'wederrechtelijkheid' als bestanddeel in de delictsomschrijving staat, en de verdachte een geslaagd beroep doet op een rechtvaardigingsgrond?",
      options: [
        "Ontslag van alle rechtsvervolging (OVAR), omdat de wederrechtelijkheid als element ontbreekt.",
        "Vrijspraak, omdat het bestanddeel niet bewezen kan worden.",
        "Vrijspraak, omdat de verwijtbaarheid ontbreekt.",
        "Niet-ontvankelijkheid van het OM wegens gebrek aan grondslag."
      ],
      correct: 1,
      exp: "Omdat het in de tekst van de wet staat (bestanddeel), moet de OvJ het bewijzen. Een rechtvaardigingsgrond neemt de wederrechtelijkheid weg -> bestanddeel niet bewezen -> Vrijspraak."
    },
    {
      q: "Welke interpretatiemethode hanteert de rechter wanneer hij de betekenis van een bepaling afleidt uit de 'ratio' of het maatschappelijk doel van de wet?",
      options: [
        "De grammaticale interpretatiemethode.",
        "De teleologische interpretatiemethode.",
        "De wetshistorische interpretatiemethode.",
        "De wetssystematische interpretatiemethode."
      ],
      correct: 1,
      exp: "Teleologisch (telos = doel) kijkt naar de strekking en het doel van de bepaling in de huidige tijd."
    },
    {
      q: "Wat houdt het 'lex certa'-gebod in en hoe verhoudt dit zich tot het arrest 'Onbehoorlijk gedrag'?",
      options: [
        "De wet moet absoluut duidelijk zijn; de HR vernietigde de APV bepaling wegens vaagheid.",
        "De wet moet duidelijk zijn, maar enige vaagheid is onvermijdelijk om wetgeving toepasbaar te houden; de bepaling bleef in stand.",
        "Het geldt alleen voor misdrijven, niet voor overtredingen zoals in de APV.",
        "De wet mag met terugwerkende kracht worden toegepast als het in het voordeel van de verdachte is."
      ],
      correct: 1,
      exp: "De Hoge Raad oordeelde dat wetgeving niet elk detail kan regelen. Termen als 'onbehoorlijk' zijn aanvaardbaar als ze in de context duidelijk genoeg zijn."
    },
    {
      q: "Wanneer spreken we van een 'oneigenlijk omissiedelict'?",
      options: [
        "Wanneer iemand strafbaar is omdat hij nalaat te getuigen.",
        "Wanneer een commissiedelict (doen) wordt gepleegd door iets na te laten (niet-doen), zoals een moeder die haar kind niet voedt.",
        "Wanneer een overtreding per ongeluk wordt begaan.",
        "Wanneer de verdachte een ambtenaar in functie is."
      ],
      correct: 1,
      exp: "Oneigenlijk omissie: De wet omschrijft een handeling (doden), maar de dader verricht dit door niets te doen (verhongeren)."
    },

    // WEEK 2: Opzet, Schuld & Causaliteit
    {
      q: "Welk specifiek element was in het Porsche-arrest de doorslaggevende contra-indicatie om 'voorwaardelijk opzet' af te wijzen?",
      options: [
        "Het dronkenschap van de bestuurder.",
        "Het feit dat hij eerdere inhaalpogingen had afgebroken.",
        "De snelheid van het voertuig.",
        "Het ontbreken van een geldig rijbewijs."
      ],
      correct: 1,
      exp: "Het afbreken van eerdere pogingen wees erop dat hij het risico wilde vermijden (hij dacht dat het kon), en de kans dus niet 'aanvaardde'."
    },
    {
      q: "Wat is de definitie van 'roekeloosheid' in juridische zin (de zwaarste schuldvorm)?",
      options: [
        "Willens en wetens de kans aanvaarden (gelijk aan opzet).",
        "Het nemen van onaanvaardbare risico's waarbij men zeer lichtzinnig vertrouwt op een goede afloop.",
        "Een moment van onoplettendheid in het verkeer.",
        "Het plegen van een delict onder invloed van drugs."
      ],
      correct: 1,
      exp: "Roekeloosheid is de zwaarste vorm van culpa. De dader ziet het gevaar, neemt onverantwoorde risico's, maar 'hoopt/denkt' dat het goed komt (buwalbewustzijn)."
    },
    {
      q: "In het arrest 'Letale Longembolie' introduceerde de Hoge Raad een nieuwe causaliteitsleer. Welke?",
      options: [
        "De Causa Proxima leer.",
        "De leer van de adequate veroorzaking.",
        "De leer van de redelijke toerekening.",
        "De Conditio sine qua non leer."
      ],
      correct: 2,
      exp: "De vraag is of het gevolg redelijkerwijs aan de handeling van de verdachte kan worden toegerekend, gezien de aard van de gedraging en het gevolg."
    },
    {
      q: "Wat is een 'geobjectiveerd bestanddeel' in een opzetdelict?",
      options: [
        "Een bestanddeel dat objectief bewezen moet worden.",
        "Een bestanddeel waarop het opzet van de verdachte niet gericht hoeft te zijn.",
        "Een bestanddeel dat leidt tot strafvermindering.",
        "Een bestanddeel dat alleen voor medeplegers geldt."
      ],
      correct: 1,
      exp: "Bijv. art 180 Sr: het verzet moet opzettelijk zijn, maar de dader hoeft geen opzet te hebben op de 'rechtmatigheid' van de ambtshandeling."
    },

    // WEEK 3 & 4: Strafproces & Dwangmiddelen
    {
      q: "Art. 27 Sv noemt het materiële verdachtenbegrip. Welke drie elementen zijn vereist?",
      options: [
        "1. Aanhouding, 2. Verhoor, 3. Proces-verbaal.",
        "1. Redelijk vermoeden van schuld, 2. Aan een strafbaar feit, 3. Voortvloeiend uit feiten of omstandigheden.",
        "1. Betrapping op heterdaad, 2. Identificatie, 3. Voorgeleiding.",
        "1. Beschuldiging, 2. Dagvaarding, 3. Bewijs."
      ],
      correct: 1,
      exp: "Het vermoeden moet individualiseerbaar, concretiseerbaar en objectiveerbaar zijn (Caribian Nights)."
    },
    {
      q: "Wat is de maximale duur van het 'ophouden voor onderzoek' bij een feit waarvoor géén voorlopige hechtenis mogelijk is?",
      options: [
        "6 uur (plus eventueel 6 uur verlenging voor identificatie).",
        "9 uur.",
        "3 dagen.",
        "12 uur."
      ],
      correct: 0,
      exp: "Standaard 6 uur. Alleen bij misdrijven met voorlopige hechtenis is het 9 uur. De verlenging is alleen voor identificatie."
    },
    {
      q: "Het 'anticipatiegebod' (art. 67a lid 3 Sv) verbiedt voorlopige hechtenis als...",
      options: [
        "De verdachte geen vluchtgevaar heeft.",
        "Het ernstig waarschijnlijk is dat de verdachte niet langer vast zal zitten dan de uiteindelijke onvoorwaardelijke straf.",
        "De verdachte 'first offender' is.",
        "Het onderzoek nog niet is afgerond."
      ],
      correct: 1,
      exp: "Je mag iemand niet langer in voorarrest houden dan de straf die hij naar verwachting gaat krijgen."
    },
    {
      q: "Wie is exclusief bevoegd tot het doorzoeken van een woning ter inbeslagneming (behoudens art. 97 Sv spoed)?",
      options: [
        "De Hulpofficier van Justitie.",
        "De Officier van Justitie.",
        "De Rechter-Commissaris.",
        "De politiecommissaris."
      ],
      correct: 2,
      exp: "Huisrecht (art 12 Gw) weegt zwaar. Doorzoeking (kasten openen e.d.) in een woning is de exclusieve taak van de R-C (art 110 Sv)."
    },
    {
      q: "In het arrest 'Braak bij binnentreden' toetste de Hoge Raad het politieoptreden aan beginselen van behoorlijke procesorde. Welke?",
      options: [
        "Vertrouwensbeginsel en Gelijkheidsbeginsel.",
        "Proportionaliteit en Subsidiariteit.",
        "Zuiverheid van oogmerk.",
        "Nemo tenetur."
      ],
      correct: 1,
      exp: "De politie forceerde een voordeur voor een relatief licht feit. Dat was disproportioneel (niet in verhouding) en niet subsidiair (kan het lichter?)."
    },
    {
      q: "Wat is het verschil tussen 'infiltratie' en 'pseudo-koop'?",
      options: [
        "Bij infiltratie neemt de agent deel aan de criminele groep; bij pseudo-koop neemt hij slechts goederen/diensten af.",
        "Infiltratie mag zonder bevel OvJ, pseudo-koop niet.",
        "Pseudo-koop is voor drugs, infiltratie voor wapens.",
        "Er is geen verschil."
      ],
      correct: 0,
      exp: "Infiltratie gaat veel verder (deelnemen aan de organisatie) en is een zwaarder middel dan enkel eenmalig iets kopen (pseudo-koop)."
    },

    // WEEK 5 & 6: Vervolging & Zitting
    {
      q: "Wanneer is het OM niet-ontvankelijk in de vervolging?",
      options: [
        "Als het bewijs onvoldoende is (technisch sepot).",
        "Als er sprake is van een vormverzuim dat niet gerepareerd kan worden.",
        "Als het vervolgingsrecht is vervallen (bijv. verjaring, klachtdelict zonder klacht, ne bis in idem).",
        "Als de verdachte ontkent."
      ],
      correct: 2,
      exp: "Niet-ontvankelijkheid ziet op de *bevoegdheid* om te vervolgen. Als het recht is vervallen, mag het OM niet meer optreden."
    },
    {
      q: "Wat houdt de 'grondslagleer' strikt genomen in?",
      options: [
        "De rechter moet de materiele waarheid vinden, ongeacht het dossier.",
        "De beraadslaging van de rechter (348/350 Sv) is gebonden aan de tekst van de tenlastelegging.",
        "De grondwet vormt de basis van het strafproces.",
        "De rechter mag feiten toevoegen als ze ter zitting zijn bewezen."
      ],
      correct: 1,
      exp: "De tenlastelegging is het enige waarover geoordeeld mag worden. De 'papieren werkelijkheid' is leidend voor de omvang van het proces."
    },
    {
      q: "Welke procedure kan een slachtoffer starten als het OM besluit de zaak te seponeren?",
      options: [
        "Een civiele procedure tegen de OvJ.",
        "Een Artikel 12 Sv procedure bij het Gerechtshof (beklag tegen niet-vervolging).",
        "Een cassatieberoep bij de Hoge Raad.",
        "Een verzoekschrift bij de Koning."
      ],
      correct: 1,
      exp: "Via de Art. 12 Sv procedure kan een belanghebbende het Gerechtshof vragen om het OM alsnog te dwingen tot vervolging."
    },
    {
      q: "Wanneer is een dagvaarding 'nietig'?",
      options: [
        "Als er een spelfout in de naam van de verdachte staat.",
        "Als de dagvaarding niet voldoet aan de eisen van art. 261 Sv (bijv. onduidelijke opgave van het feit) waardoor de verdachte zich niet kan verdedigen.",
        "Als de verdachte niet is verschenen.",
        "Als het bewijs in het dossier ontbreekt."
      ],
      correct: 1,
      exp: "Nietigheid volgt als de functie van de dagvaarding (informeren/beschuldigen) fundamenteel faalt (obscuur libel)."
    },
    {
      q: "Wat is het verschil tussen 'onderbreking' en 'schorsing' van de zitting?",
      options: [
        "Schorsing is voor de lunch; onderbreking is voor beraadslaging.",
        "Onderbreking (art 277 Sv) is kort en zitting gaat zelfde dag verder; Schorsing (art 281 Sv) is voor onbepaalde/bepaalde tijd (dagen/weken).",
        "Schorsing betekent einde zaak; onderbreking is tijdelijk.",
        "Er is geen juridisch verschil."
      ],
      correct: 1,
      exp: "Schorsing (in de praktijk 'aanhouding' genoemd) wordt gebruikt als het onderzoek niet op één dag kan worden afgerond (bijv. getuigen oproepen)."
    },
    {
      q: "Wat gebeurt er als de rechter vaststelt dat het feit bewezen is, maar de dader een beroep kan doen op 'noodweerexces'?",
      options: [
        "Vrijspraak.",
        "Ontslag van alle rechtsvervolging (OVAR) wegens ontbreken strafbaarheid dader.",
        "OVAR wegens ontbreken strafbaarheid feit.",
        "Veroordeling zonder straf (rechterlijk pardon)."
      ],
      correct: 1,
      exp: "Noodweerexces is een schulduitsluitingsgrond. Het feit is strafbaar, maar de dader niet (verwijtbaarheid ontbreekt). Dus OVAR."
    },

    // WEEK 7: Sancties & Rechtsmiddelen
    {
      q: "Wat is het 'absorptiestelsel' bij eendaadse samenloop (art. 55 lid 1 Sr)?",
      options: [
        "De straffen worden bij elkaar opgeteld.",
        "Er wordt slechts één strafbepaling toegepast, namelijk die met de zwaarste hoofdstraf.",
        "De zwaarste straf wordt met 1/3 verhoogd.",
        "De rechter kiest willekeurig een van de bepalingen."
      ],
      correct: 1,
      exp: "Bij eendaadse samenloop (één handeling, meerdere feiten) 'absorbeert' de zwaarste bepaling de andere. Max straf = max van het zwaarste feit."
    },
    {
      q: "Kan de maatregel 'onttrekking aan het verkeer' worden opgelegd bij vrijspraak?",
      options: [
        "Nee, nooit.",
        "Ja, dit is een maatregel ter beveiliging en staat los van de veroordeling (bijv. bij verboden wapenbezit).",
        "Alleen als de verdachte instemt.",
        "Alleen door de Hoge Raad."
      ],
      correct: 1,
      exp: "Art. 36b Sr staat toe dat gevaarlijke/verboden goederen worden onttrokken, zelfs als de verdachte wordt vrijgesproken van het ten laste gelegde."
    },
    {
      q: "Wat is de maximale duur van de TBS-maatregel met dwangverpleging bij een geweldsmisdrijf?",
      options: [
        "Maximaal 4 jaar.",
        "Maximaal 2 jaar, eenmalig verlengbaar.",
        "In beginsel ongemaximeerd (elke 1 of 2 jaar verlengbaar door de rechter).",
        "Levenslang zonder toetsing."
      ],
      correct: 2,
      exp: "Bij misdrijven gericht tegen de lichamelijke integriteit (art. 38e Sr) kan TBS telkens verlengd worden en theoretisch levenslang duren."
    },
    {
      q: "Wat is een 'voorwaardelijke veroordeling' (art. 14a Sr)?",
      options: [
        "De straf wordt niet ten uitvoer gelegd zolang de veroordeelde zich gedurende de proeftijd aan de voorwaarden houdt.",
        "De verdachte wordt vrijgesproken onder voorwaarden.",
        "De straf is afhankelijk van de goedkeuring van de minister.",
        "Een straf die alleen geldt als het slachtoffer dat wil."
      ],
      correct: 0,
      exp: "Het is een 'stok achter de deur'. Ga je in de fout tijdens de proeftijd? Dan moet je alsnog zitten/betalen."
    },
    {
      q: "Welk rechtsmiddel is een 'buitengewoon rechtsmiddel' (tegen onherroepelijke vonnissen)?",
      options: [
        "Hoger Beroep.",
        "Cassatie.",
        "Herziening.",
        "Verzet."
      ],
      correct: 2,
      exp: "Hoger beroep en cassatie zijn gewone rechtsmiddelen. Herziening is buitengewoon en kan alleen bij een novum (nieuw feit)."
    },
    {
      q: "Sinds 2013 is 'herziening ten nadele' mogelijk. Wat is een 'falsa' in dit verband?",
      options: [
        "Een nieuwe DNA-match.",
        "Een bewijs dat de rechter de wet verkeerd heeft toegepast.",
        "Een gebleken onwaarheid (bijv. meineed of vervalst bewijs) die tot de vrijspraak heeft geleid.",
        "Een bekentenis van de verdachte na vrijspraak."
      ],
      correct: 2,
      exp: "Novum is een nieuw feit. Falsa is een 'leugen' (bedrog) in het oorspronkelijke proces."
    },
    {
      q: "Wat toetst de Hoge Raad in cassatie NIET?",
      options: [
        "De feiten (feitelijke toedracht).",
        "De toepassing van het recht.",
        "Of er vormverzuimen zijn geweest.",
        "Of de motivering van het vonnis begrijpelijk is."
      ],
      correct: 0,
      exp: "De Hoge Raad is geen feitenrechter. Ze oordelen alleen of het recht juist is toegepast op de feiten die door het Hof zijn vastgesteld."
    },
    {
      q: "Wat houdt het 'draagkrachtbeginsel' in bij geldboetes?",
      options: [
        "De boete moet hoog genoeg zijn om pijn te doen.",
        "Bij de bepaling van de hoogte van de boete moet rekening worden gehouden met de financiële situatie van de verdachte.",
        "De overheid draagt de kosten van het proces.",
        "Rijke mensen krijgen lagere straffen."
      ],
      correct: 1,
      exp: "Art. 24 Sr: De rechter houdt rekening met de draagkracht van de verdachte, zodat de straf relatief even zwaar voelt."
    },
    {
      q: "Wat is 'sprongcassatie' en mag dit in Nederland?",
      options: [
        "Direct van Rechtbank naar Hoge Raad; Ja, dat mag.",
        "Direct van Rechtbank naar Hoge Raad; Nee, dat mag niet.",
        "Van Hof naar EHRM; Ja.",
        "Van politie naar rechter; Nee."
      ],
      correct: 1,
      exp: "Nederland kent een gesloten stelsel. Je moet de hiërarchie volgen: Rechtbank -> Hof -> Hoge Raad. Sprongcassatie is niet toegestaan."
    },
    {
      q: "Wat is het verschil tussen hechtenis en gevangenisstraf?",
      options: [
        "Hechtenis is voor overtredingen (en vervangende straf), gevangenisstraf voor misdrijven.",
        "Hechtenis is altijd levenslang.",
        "Gevangenisstraf is in een cel, hechtenis is thuis.",
        "Er is geen verschil."
      ],
      correct: 0,
      exp: "Hechtenis is de vrijheidsstraf voor overtredingen (art. 18 Sr) of bij niet betalen boete. Gevangenisstraf is voor misdrijven."
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
      confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 }, colors: ['#047857', '#be123c'] }); 
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
  
  // Expert styling colors (Emerald/Rose/Slate)
  const barColorClass = showFeedback ? (isCorrect ? 'bg-emerald-600' : 'bg-rose-600') : 'bg-slate-700';

  return (
    <div className="w-full min-h-screen bg-slate-50 font-serif antialiased pb-20">
      <nav className="h-20 bg-white border-b border-slate-200 px-10 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tighter text-slate-900">Quiz EXPERT</span>
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
                    <span className="text-3xl font-bold">{QUESTIONS.length}</span>
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