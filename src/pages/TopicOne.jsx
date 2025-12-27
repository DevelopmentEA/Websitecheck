import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const StrafrechtNormalQuiz = () => {
  const [gameState, setGameState] = useState('start');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [showFeedback, setShowFeedback] = useState(false);

  // 40 VRAGEN - NORMAAL NIVEAU - GEBASEERD OP WEEK 1 T/M 7
  const QUESTIONS = useMemo(() => [
    // WEEK 1: Introductie & Materieel Strafrecht
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
      q: "Uit welke vier componenten bestaat een strafbaar feit volgens de standaardopbouw (als wederrechtelijkheid geen bestanddeel is)?",
      options: [
        "Menselijke gedraging, Delictsomschrijving, Wederrechtelijkheid, Schuld.",
        "Daderschap, Opzet, Causaal verband, Straf.",
        "Aanhouding, Vervolging, Berechting, Tenuitvoerlegging.",
        "Wet, Bewijs, Overtuiging, Vonnis."
      ],
      correct: 0,
      exp: "De vier lagen zijn: 1. Menselijke gedraging, 2. Delictsomschrijving (wettelijk), 3. Wederrechtelijkheid (strijd met recht), 4. Schuld (verwijtbaarheid)."
    },
    {
      q: "Wat is een 'commissiedelict'?",
      options: [
        "Een delict waarbij je strafbaar bent omdat je iets nalaat (niet doen).",
        "Een delict dat door een commissie is vastgesteld.",
        "Een delict waarbij je strafbaar bent omdat je een verboden handeling verricht (doen).",
        "Een delict dat alleen door ambtenaren gepleegd kan worden."
      ],
      correct: 2,
      exp: "Een commissiedelict is een 'doen'-delict (bijv. stelen). Een omissiedelict is een 'nalaten'-delict."
    },
    {
      q: "Welke interpretatiemethode kijkt naar de bedoeling van de wetgever ten tijde van het maken van de wet?",
      options: [
        "Grammaticale interpretatie.",
        "Wetshistorische interpretatie.",
        "Teleologische interpretatie.",
        "Systematische interpretatie."
      ],
      correct: 1,
      exp: "De wetshistorische methode kijkt naar de parlementaire geschiedenis en de oorspronkelijke bedoeling van de wetgever."
    },
    {
      q: "Wanneer is 'wederrechtelijkheid' een bestanddeel in plaats van een element?",
      options: [
        "Altijd.",
        "Wanneer het woord 'wederrechtelijk' expliciet in de delictsomschrijving staat (zoals bij vernieling).",
        "Nooit, het is altijd een element.",
        "Alleen bij overtredingen."
      ],
      correct: 1,
      exp: "Als het in de wettekst staat (delictsomschrijving), is het een bestanddeel dat door de OvJ bewezen moet worden. Anders is het een element."
    },

    // WEEK 2: Opzet & Culpa
    {
      q: "Wat is de lichtste vorm van opzet?",
      options: [
        "Opzet met bedoeling.",
        "Noodzakelijkheidsbewustzijn.",
        "Voorwaardelijk opzet.",
        "Roekeloosheid."
      ],
      correct: 2,
      exp: "Voorwaardelijk opzet is de ondergrens van opzet: het bewust aanvaarden van de aanmerkelijke kans dat het gevolg intreedt."
    },
    {
      q: "Wat is het verschil tussen voorwaardelijk opzet en bewuste schuld?",
      options: [
        "Bij opzet weet je het zeker, bij schuld niet.",
        "Bij opzet aanvaard je de kans (op de koop toe nemen); bij bewuste schuld vertrouw je op een goede afloop.",
        "Voorwaardelijk opzet is straffeloos.",
        "Er is geen juridisch verschil."
      ],
      correct: 1,
      exp: "Het aanvaardings-element is cruciaal. Bij bewuste schuld (culpa) denkt de dader: 'het loopt wel los', bij opzet: 'als het gebeurt, dan is dat maar zo'."
    },
    {
      q: "Welke rol speelde het 'afbreken van inhaalpogingen' in het Porsche-arrest?",
      options: [
        "Het bewees dat de verdachte opzet had.",
        "Het was een contra-indicatie voor opzet (dus het wees op schuld).",
        "Het was niet relevant voor de uitspraak.",
        "Het bewees dat de verdachte nuchter was."
      ],
      correct: 1,
      exp: "De Hoge Raad zag dit als bewijs dat de verdachte het risico juist wilde vermijden (hij dacht dat het kon), en de kans dus niet 'aanvaardde'."
    },
    {
      q: "Wat is 'culpa'?",
      options: [
        "Willens en wetens handelen.",
        "Een verwijtbare aanmerkelijke onvoorzichtigheid.",
        "Het oogmerk om de wet te overtreden.",
        "Een strafuitsluitingsgrond."
      ],
      correct: 1,
      exp: "Culpa (schuld) betekent dat de dader 'anders had moeten en kunnen handelen'; hij is verwijtbaar onvoorzichtig geweest."
    },
    {
      q: "Wat is een 'geobjectiveerd bestanddeel'?",
      options: [
        "Een bestanddeel dat met camerabeelden bewezen moet worden.",
        "Een bestanddeel waar het opzet van de verdachte niet op gericht hoeft te zijn.",
        "Een bestanddeel dat door de rechter wordt toegevoegd.",
        "Een bestanddeel dat alleen bij overtredingen voorkomt."
      ],
      correct: 1,
      exp: "Bij geobjectiveerde bestanddelen (zoals 'in de rechtmatige uitoefening' bij art. 180 Sr) hoeft de dader geen opzet te hebben op dat specifieke stukje."
    },

    // WEEK 3: Formeel Strafrecht Intro
    {
      q: "Wie heeft in Nederland het vervolgingsmonopolie?",
      options: [
        "De politie.",
        "Het slachtoffer.",
        "Het Openbaar Ministerie (de Officier van Justitie).",
        "De rechter."
      ],
      correct: 2,
      exp: "Alleen het OM kan beslissen om een verdachte voor de strafrechter te brengen."
    },
    {
      q: "Wanneer ben je verdachte volgens het materiele criterium (art. 27 Sv)?",
      options: [
        "Als je bent aangehouden.",
        "Als er uit feiten of omstandigheden een redelijk vermoeden van schuld aan een strafbaar feit voortvloeit.",
        "Als de officier van justitie dat vindt.",
        "Als je in een politiecel zit."
      ],
      correct: 1,
      exp: "Er moet een objectief redelijk vermoeden zijn gebaseerd op feiten/omstandigheden."
    },
    {
      q: "Wat houdt de 'cautie' in (art. 29 lid 2 Sv)?",
      options: [
        "De plicht om de waarheid te spreken.",
        "De mededeling dat de verdachte niet tot antwoorden verplicht is (zwijgrecht).",
        "Het recht op een advocaat.",
        "Het recht op inzage in de stukken."
      ],
      correct: 1,
      exp: "Voor een verhoor moet de politie de verdachte vertellen dat hij mag zwijgen (nemo tenetur beginsel)."
    },
    {
      q: "Wat is het verschil tussen misdrijven en overtredingen qua wetboek?",
      options: [
        "Misdrijven staan in Boek 2, Overtredingen in Boek 3.",
        "Misdrijven staan in Boek 1, Overtredingen in Boek 2.",
        "Overtredingen staan niet in het wetboek.",
        "Er is geen verschil in vindplaats."
      ],
      correct: 0,
      exp: "Boek 1 = Algemeen deel, Boek 2 = Misdrijven (ernstig), Boek 3 = Overtredingen (minder ernstig)."
    },
    {
      q: "Wat is de taak van de Rechter-Commissaris (R-C) in het vooronderzoek?",
      options: [
        "Het veroordelen van de verdachte.",
        "Het houden van toezicht op het opsporingsonderzoek en beslissen over zware dwangmiddelen.",
        "Het verdedigen van de verdachte.",
        "Het leiden van de politie."
      ],
      correct: 1,
      exp: "De R-C is een onderzoeksrechter die toetst of dwangmiddelen (zoals bewaring of doorzoeking woning) rechtmatig zijn."
    },

    // WEEK 4: Dwangmiddelen
    {
      q: "Wie mag een verdachte aanhouden bij 'ontdekking op heterdaad' (art. 53 Sv)?",
      options: [
        "Alleen de politie.",
        "Ieder (dus ook burgers).",
        "Alleen de Officier van Justitie.",
        "Alleen de beveiliging."
      ],
      correct: 1,
      exp: "Bij heterdaad mag iedereen aanhouden. Buiten heterdaad (art. 54 Sv) mag alleen de opsporingsambtenaar dat op bevel van de OvJ."
    },
    {
      q: "Hoe lang mag de inverzekeringstelling maximaal duren (basis + verlenging)?",
      options: [
        "3 dagen + 3 dagen.",
        "6 uur + 6 uur.",
        "14 dagen.",
        "30 dagen."
      ],
      correct: 0,
      exp: "Inverzekeringstelling is 3 dagen, en kan bij dringende noodzaak eenmalig met 3 dagen worden verlengd (totaal 6)."
    },
    {
      q: "Voor voorlopige hechtenis is een 'geval' nodig. Wat is een typisch geval?",
      options: [
        "Elk strafbaar feit.",
        "Een misdrijf waarop 4 jaar of meer gevangenisstraf staat.",
        "Alleen moord en doodslag.",
        "Overtredingen."
      ],
      correct: 1,
      exp: "Art. 67 Sv: Voorlopige hechtenis mag bij misdrijven met een strafmaximum van 4 jaar of meer."
    },
    {
      q: "Wat houdt het 'anticipatiegebod' bij voorlopige hechtenis in?",
      options: [
        "De rechter moet de straf van tevoren aankondigen.",
        "Het voorarrest mag niet langer duren dan de te verwachten straf.",
        "De verdachte moet meewerken aan het onderzoek.",
        "De OvJ moet anticiperen op vrijspraak."
      ],
      correct: 1,
      exp: "Je mag iemand niet langer vasthouden in voorarrest dan de straf die hij waarschijnlijk gaat krijgen."
    },
    {
      q: "Wie is bevoegd tot het doorzoeken van een woning (zonder toestemming bewoner)?",
      options: [
        "Elke agent.",
        "De Officier van Justitie.",
        "De Rechter-Commissaris (R-C).",
        "De burgemeester."
      ],
      correct: 2,
      exp: "Het huisrecht is een grondrecht. Doorzoeking is voorbehouden aan de R-C (art. 110 Sv), behalve bij zeer specifieke spoeduitzonderingen."
    },

    // WEEK 5 & 6: Vervolging & Zitting
    {
      q: "Wat houdt het 'opportuniteitsbeginsel' in?",
      options: [
        "De OvJ moet elk strafbaar feit vervolgen.",
        "De OvJ mag zelf kiezen of hij vervolgt of seponeert (op gronden van algemeen belang).",
        "De verdachte krijgt altijd een kans.",
        "De rechter bepaalt wie vervolgd wordt."
      ],
      correct: 1,
      exp: "Het OM heeft de beleidsvrijheid om van vervolging af te zien (seponeren) als dat beter is voor de samenleving."
    },
    {
      q: "Wat is een 'technisch sepot'?",
      options: [
        "Niet vervolgen omdat het beleidsmatig niet wenselijk is.",
        "Niet vervolgen omdat er onvoldoende bewijs is of de dader onbekend is.",
        "Een sepot met voorwaarden.",
        "Een fout in de computer van het OM."
      ],
      correct: 1,
      exp: "Technisch sepot = vervolging is juridisch niet haalbaar (geen bewijs/geen dader). Beleidssepot = wel haalbaar, maar niet wenselijk."
    },
    {
      q: "Wat is de 'grondslagleer'?",
      options: [
        "De rechter mag zelf feiten toevoegen.",
        "De rechter is gebonden aan de tenlastelegging en mag daar niet buiten treden.",
        "De grondwet is de basis van elk vonnis.",
        "Het vonnis moet gebaseerd zijn op de waarheid, ongeacht de dagvaarding."
      ],
      correct: 1,
      exp: "De tenlastelegging in de dagvaarding bepaalt de grenzen van het proces. De rechter mag alleen oordelen over wat daar staat."
    },
    {
      q: "Wat zijn de 'voorvragen' van artikel 348 Sv?",
      options: [
        "Bewijs, Strafbaarheid feit, Strafbaarheid dader, Straf.",
        "Geldigheid dagvaarding, Bevoegdheid rechter, Ontvankelijkheid OM, Schorsing vervolging.",
        "Wie, Wat, Waar, Wanneer.",
        "Opzet, Schuld, Causaal verband, Wederrechtelijkheid."
      ],
      correct: 1,
      exp: "Art 348 Sv zijn de formele vragen. Art 350 Sv zijn de materiële (inhoudelijke) vragen."
    },
    {
      q: "Wanneer is het Openbaar Ministerie 'niet-ontvankelijk'?",
      options: [
        "Als er onvoldoende bewijs is.",
        "Als het recht tot strafvervolging is vervallen (bijv. verjaring).",
        "Als de dagvaarding onduidelijk is.",
        "Als de rechter onbevoegd is."
      ],
      correct: 1,
      exp: "Niet-ontvankelijkheid ziet op vervolgingsbeletselen zoals verjaring, overlijden verdachte of ne bis in idem."
    },

    // WEEK 7: Sancties & Uitspraken
    {
      q: "Wat is de volgorde van de vragen van artikel 350 Sv?",
      options: [
        "Bewezenverklaring -> Strafbaarheid feit -> Strafbaarheid dader -> Sanctie.",
        "Sanctie -> Bewijs -> Schuld -> Wederrechtelijkheid.",
        "Geldigheid dagvaarding -> Bewijs -> Straf.",
        "Strafbaarheid dader -> Strafbaarheid feit -> Bewijs -> Sanctie."
      ],
      correct: 0,
      exp: "Eerst moet het feit bewezen zijn. Dan wordt gekeken of het een strafbaar feit is (kwalificatie), dan of de dader strafbaar is, en tot slot de straf."
    },
    {
      q: "Wat volgt er als het feit wel bewezen is, maar niet strafbaar is (bijv. noodweer)?",
      options: [
        "Vrijspraak.",
        "Ontslag van alle rechtsvervolging (OVAR).",
        "Niet-ontvankelijkheid.",
        "Veroordeling zonder straf."
      ],
      correct: 1,
      exp: "Als de kwalificatie (strafbaar feit) of de strafbaarheid van de dader ontbreekt (door een strafuitsluitingsgrond), volgt OVAR."
    },
    {
      q: "Wanneer volgt Vrijspraak?",
      options: [
        "Als het tenlastegelegde niet wettig en overtuigend bewezen is.",
        "Als de verdachte ontoerekeningsvatbaar is.",
        "Als er sprake is van noodweer.",
        "Als de dagvaarding nietig is."
      ],
      correct: 0,
      exp: "Vrijspraak volgt uitsluitend bij de eerste vraag van 350 Sv: is het bewijs niet rond? Dan vrijspraak."
    },
    {
      q: "Welke van de volgende is een Hoofdstraf?",
      options: [
        "TBS.",
        "Verbeurdverklaring.",
        "Taakstraf.",
        "Onttrekking aan het verkeer."
      ],
      correct: 2,
      exp: "De 4 hoofdstraffen zijn: Gevangenisstraf, Hechtenis, Taakstraf en Geldboete."
    },
    {
      q: "Wat is de maximale duur van een tijdelijke gevangenisstraf?",
      options: [
        "20 jaar.",
        "25 jaar.",
        "30 jaar.",
        "Levenslang."
      ],
      correct: 2,
      exp: "De maximale tijdelijke straf is 30 jaar. Levenslang is een straf voor de rest van het leven (geen tijdelijke straf)."
    },
    {
      q: "Wat is het doel van een Maatregel (zoals TBS)?",
      options: [
        "Vergelding (leed toevoegen).",
        "De staatskas spekken.",
        "Beveiliging van de samenleving of herstel.",
        "Afschrikking van anderen."
      ],
      correct: 2,
      exp: "Straffen zijn voor vergelding. Maatregelen zijn er om de maatschappij te beschermen tegen gevaarlijke personen of situaties."
    },
    {
      q: "Wat houdt 'eendaadse samenloop' in?",
      options: [
        "Iemand pleegt meerdere feiten op verschillende momenten.",
        "Iemand pleegt één handeling die onder meerdere strafbepalingen valt.",
        "Iemand wordt twee keer gestraft voor hetzelfde feit.",
        "Iemand pleegt een feit samen met een ander."
      ],
      correct: 1,
      exp: "Eendaadse samenloop (concursus idealis): één gedraging levert meerdere delicten op. Er wordt dan één straf opgelegd (absorptiestelsel)."
    },
    {
      q: "Welk rechtsmiddel staat open tegen een vonnis van de rechtbank?",
      options: [
        "Cassatie.",
        "Hoger Beroep.",
        "Verzet.",
        "Herziening."
      ],
      correct: 1,
      exp: "Van de Rechtbank ga je in Hoger Beroep bij het Gerechtshof."
    },
    {
      q: "Wat doet de Hoge Raad in Cassatie?",
      options: [
        "De feiten opnieuw onderzoeken.",
        "Kijken of het recht en de vormvoorschriften juist zijn toegepast (geen nieuw feitenonderzoek).",
        "De straf altijd verlagen.",
        "Getuigen opnieuw horen."
      ],
      correct: 1,
      exp: "De Hoge Raad is een cassatierechter en oordeelt alleen over rechtsvragen, niet over de feiten (feitenrechter)."
    },
    {
      q: "Wat is een 'bijkomende straf'?",
      options: [
        "Geldboete.",
        "Ontzetting van bepaalde rechten (zoals kiesrecht of beroepsverbod).",
        "TBS.",
        "Schadevergoeding."
      ],
      correct: 1,
      exp: "Bijkomende straffen (art. 9 Sr) zijn o.a. ontzetting van rechten, verbeurdverklaring en openbaarmaking van de uitspraak."
    },
    {
      q: "Kan een maatregel (zoals onttrekking aan het verkeer) worden opgelegd bij vrijspraak?",
      options: [
        "Nee, nooit.",
        "Ja, als het voorwerp gevaarlijk of verboden is (bijv. drugs).",
        "Alleen als de verdachte het goedvindt.",
        "Alleen bij overtredingen."
      ],
      correct: 1,
      exp: "Ja, maatregelen kunnen losstaan van de schuldvraag. Gevaarlijke goederen (drugs/wapens) kunnen onttrokken worden ondanks vrijspraak."
    },
    {
      q: "Wat is 'voorwaardelijke invrijheidstelling' (VI)?",
      options: [
        "Je wordt vrijgesproken onder voorwaarden.",
        "Je komt eerder vrij (meestal na 2/3e van de straf) onder voorwaarden.",
        "Je hoeft niet naar de gevangenis als je een boete betaalt.",
        "Je krijgt gratie van de Koning."
      ],
      correct: 1,
      exp: "Bij langere straffen komt de veroordeelde vaak na 2/3e van de straf vrij, mits hij zich aan voorwaarden houdt."
    },
    {
      q: "Wie beslist over het instellen van 'herziening'?",
      options: [
        "De rechtbank.",
        "Het gerechtshof.",
        "De Hoge Raad.",
        "De minister."
      ],
      correct: 2,
      exp: "Herziening is een buitengewoon rechtsmiddel bij de Hoge Raad (bijv. bij een novum)."
    },
    {
      q: "Wat is het 'ne bis in idem' beginsel?",
      options: [
        "Je mag niet twee keer voor hetzelfde feit vervolgd worden.",
        "Je moet altijd twee keer gehoord worden.",
        "Iedereen is onschuldig tot het tegendeel bewezen is.",
        "Je mag niet zonder advocaat verhoord worden."
      ],
      correct: 0,
      exp: "Niemand mag voor de tweede keer worden vervolgd of gestraft voor een feit waarover de rechter al onherroepelijk heeft beslist."
    },
    {
      q: "Wat is een 'strafbeschikking'?",
      options: [
        "Een straf opgelegd door de rechter.",
        "Een straf (zoals een boete of taakstraf) opgelegd door het OM zonder tussenkomst van de rechter.",
        "Een vrijspraak door het OM.",
        "Een voorlopige hechtenis."
      ],
      correct: 1,
      exp: "Het OM mag zelf straffen opleggen (Wet OM-afdoening), behalve gevangenisstraf. Als je het er niet mee eens bent, moet je in verzet."
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
          <span className="text-xl font-bold tracking-tighter text-[#1A365D]">DE KENNISBANK</span>
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
              <p className="text-stone-500 text-2xl italic font-light max-w-2xl mx-auto">Week 1 t/m 7: Volledige Toets (40 Vragen).</p>
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