import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const ElbertsKennisbank = () => {
  const [gameState, setGameState] = useState('start');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [showFeedback, setShowFeedback] = useState(false);

  const QUESTIONS = useMemo(() => [
    {
      q: "Wat is de goederenrechtelijke consequentie van het 'causale stelsel' bij een titelgebrek?",
      options: ["De overdracht blijft geldig ter bescherming van het verkeer.", "Het eigendomsrecht keert van rechtswege terug bij de vervreemder (art. 3:84 BW).", "De overdracht is slechts relatief nietig.", "De koper blijft eigenaar maar moet schadevergoeding betalen."],
      correct: 1,
      exp: "Causaliteit houdt in dat de levering afhankelijk is van een geldige titel. Ontbreekt deze (bijv. door vernietiging), dan is er nooit eigendom overgegaan."
    },
    {
      q: "Sander steelt een dure racefiets van Thomas en verkoopt deze aan de bona fide koper Jan. Thomas ontdekt de fiets 2 jaar later bij Jan. Kan Thomas de fiets revindiceren?",
      options: ["Nee, Jan wordt als derde te goeder trouw direct eigenaar.", "Ja, op grond van de diefstalregel van art. 3:86 lid 3 BW.", "Nee, de termijn voor revindicatie bij diefstal is 1 jaar.", "Alleen als Sander een professionele fietsenhandelaar is."],
      correct: 1,
      exp: "Bij diefstal kan de eigenaar het goed gedurende 3 jaar opeisen van iedere bezitter, ook als deze te goeder trouw is (tenzij gekocht door consument in een winkel)."
    },
    {
        q: "Welk vereiste stelt art. 3:84 lid 3 BW aan de strekking van een overdracht?",
        options: ["De overdracht moet openbaar zijn.", "Het goed moet daadwerkelijk in het vermogen van de verkrijger vallen (fiduciaverbod).", "Er moet altijd een notaris bij betrokken zijn.", "De koopprijs moet marktconform zijn."],
        correct: 1,
        exp: "Overdracht louter tot zekerheid is nietig. De wet dwingt partijen om dan het pand- of hypotheekrecht te gebruiken."
    },
    {
        q: "Is een te boek gesteld schip een registergoed?",
        options: ["Nee, het is een roerende zaak.", "Ja, op grond van art. 3:10 BW jo. Boek 8 BW.", "Alleen als het schip groter is dan 20 meter.", "Alleen als het in Nederlands bezit is."],
        correct: 1,
        exp: "Inschrijving in de openbare registers is constitutief voor de overdracht van te boek gestelde schepen."
    },
    {
        q: "Wat is het criterium voor 'bestanddeelvorming' op grond van de verkeersopvatting (Dépex/Curatoren)?",
        options: ["De fysieke hechte verbinding.", "Of de hoofdzaak als onvoltooid moet worden beschouwd zonder het onderdeel.", "De waarde van het onderdeel t.o.v. de hoofdzaak.", "De kleur van het onderdeel."],
        correct: 1,
        exp: "Volgens de Hoge Raad is een machine bestanddeel als gebouw en machine constructief op elkaar zijn afgestemd."
    },
    {
        q: "Wat is het fundamentele verschil tussen openbaar pand en stil pand op een vordering?",
        options: ["De akte moet notarieel zijn bij stil pand.", "Mededeling aan de debiteur is vereist voor vestiging van openbaar pand.", "Stil pand geeft geen recht op parate executie.", "Openbaar pand kan alleen op roerende zaken."],
        correct: 1,
        exp: "Art. 3:236 lid 2 vereist mededeling voor openbaar pand; art. 3:239 staat stil pand toe via een geregistreerde akte zonder mededeling."
    },
    {
        q: "Wat houdt het individualiseringsvereiste in bij overdracht?",
        options: ["De koper moet persoonlijk aanwezig zijn.", "Het goed moet in voldoende mate bepaald zijn om het te kunnen overdragen.", "Eén persoon mag slechts één goed per keer kopen.", "Het goed moet een uniek serienummer hebben."],
        correct: 1,
        exp: "Zonder individualisering kan niet worden vastgesteld welk specifiek vermogensbestanddeel uit het vermogen van de vervreemder gaat."
    },
    {
        q: "Kan een pandrecht rusten op een toekomstig goed?",
        options: ["Nee, nooit.", "Ja, mits het goed op het moment van vestiging al bestaat.", "Ja, maar het vestigt zich pas op het moment dat het goed ontstaat/wordt verkregen.", "Alleen als het een hypotheekrecht is."],
        correct: 2,
        exp: "Men kan bij voorbaat een pandrecht vestigen op goederen die men later zal verkrijgen (art. 3:98 jo. 3:97 BW)."
    },
    {
        q: "Wie is een 'separatist' in het faillissementsrecht?",
        options: ["De curator.", "De concurrente schuldeisers.", "De pand- en hypotheekhouder.", "De Belastingdienst."],
        correct: 2,
        exp: "Separatisten kunnen hun recht uitoefenen alsof er geen faillissement is (art. 57 Fw)."
    },
    {
        q: "Wat is 'natrekking' bij onroerende zaken (art. 5:20 BW)?",
        options: ["De huurder wordt eigenaar van de verbeteringen.", "De grondeigenaar wordt eigenaar van alles wat duurzaam met de grond is verenigd.", "De bank trekt de overwaarde naar zich toe.", "De staat wordt eigenaar van braakliggende grond."],
        correct: 1,
        exp: "Verticale natrekking zorgt ervoor dat gebouwen en planten eigendom worden van de grondeigenaar."
    },
    {
        q: "Is een bezitter te goeder trouw schadeplichtig jegens de eigenaar bij revindicatie?",
        options: ["Ja, voor het hele gebruik.", "Nee, in beginsel niet voor de periode vóór de dagvaarding (art. 3:120 BW).", "Ja, maar alleen als het goed gestolen was.", "Altijd."],
        correct: 1,
        exp: "De bezitter te goeder trouw geniet bescherming wat betreft vruchten en gebruik tot het moment van de claim."
    },
    {
        q: "Wat is het rechtsgevolg van 'interversie' (art. 3:111 BW)?",
        options: ["Een bezitter wordt houder.", "Een houder kan zichzelf niet eigenmachtig tot bezitter maken.", "Een dief wordt eigenaar door verloop van tijd.", "Een hypotheek verandert in een pandrecht."],
        correct: 1,
        exp: "Een houder blijft houden voor de ander, tenzij de titel verandert door een handeling van de bezitter of tegenspraak."
    },
    {
        q: "Welk artikel regelt de derdenbescherming bij registergoederen?",
        options: ["Art. 3:86 BW", "Art. 3:88 BW", "Art. 3:24 BW", "Art. 3:119 BW"],
        correct: 1,
        exp: "3:88 BW beschermt de verkrijger van registergoederen tegen onbevoegdheid voortvloeiend uit een eerdere overdracht."
    },
    {
        q: "Wat is de betekenis van 'nemo plus iuris'?",
        options: ["Men kan niet meer recht overdragen dan men zelf heeft.", "Wie het eerst komt, wie het eerst maalt.", "De koper moet altijd onderzoek doen.", "Eigendom is het meest omvattende recht."],
        correct: 0,
        exp: "Dit is het basisprincipe van beschikkingsbevoegdheid in het goederenrecht."
    },
    {
        q: "Wat is een 'anticipatoir' bezitloos pandrecht?",
        options: ["Een pandrecht op een toekomstige vordering.", "Een pandrecht dat alvast gevestigd wordt op goederen die nog geleverd moeten worden.", "Een pandrecht op de inventaris.", "Een pandrecht op aandelen."],
        correct: 1,
        exp: "Vestiging bij voorbaat op goederen die de pandgever nog moet verkrijgen."
    },
    {
        q: "Welke rangorde geldt tussen een speciaal voorrecht en een pandrecht op dezelfde zaak?",
        options: ["Het voorrecht gaat altijd voor.", "Het pandrecht gaat in beginsel voor (art. 3:279 BW).", "Zij hebben een gelijke rang.", "De curator kiest de rangorde."],
        correct: 1,
        exp: "Pand en hypotheek gaan boven voorrechten, tenzij de wet anders bepaalt (zoals bij kosten tot behoud)."
    },
    {
        q: "Wat is 'levering brevi manu'?",
        options: ["De bezitter wordt houder.", "De houder wordt bezitter (art. 3:115 sub b BW).", "Levering via een derde partij.", "Levering van een vordering."],
        correct: 1,
        exp: "De verkrijger hield de zaak al voor de vervreemder en wordt nu zelf bezitter."
    },
    {
        q: "Wat is het fixatiebeginsel in het faillissementsrecht?",
        options: ["De prijzen worden vastgezet.", "De rechtspositie van schuldeisers wordt onveranderlijk vastgesteld op het moment van de faillietverklaring.", "De curator moet binnen 10 dagen verkopen.", "De schuldenaar mag niet meer verhuizen."],
        correct: 1,
        exp: "Handelingen na de uitspraak kunnen de boedel niet meer binden ten nadele van schuldeisers."
    },
    {
        q: "Wat houdt 'zuiverende werking' in bij een hypotheekexecutie?",
        options: ["De woning wordt schoongemaakt.", "Alle ingeschreven beperkte rechten en beslagen gaan teniet na levering en betaling van de koopprijs.", "De schuldenaar is van al zijn schulden af.", "De koper hoeft geen overdrachtsbelasting te betalen."],
        correct: 1,
        exp: "Art. 3:273 BW zorgt dat de koper een 'schone' eigendom krijgt na de veiling."
    },
    {
        q: "Wanneer is een huwelijksgemeenschap 'ontbonden'?",
        options: ["Bij het indienen van het verzoekschrift tot echtscheiding (art. 1:99 BW).", "Zodra de partners niet meer samenwonen.", "Op de datum van de uitspraak van de rechter.", "Na de verdeling van de inboedel."],
        correct: 0,
        exp: "Sinds 2012 is het moment van indiening van het verzoekschrift bij de rechtbank het peilmoment voor de ontbinding."
    },
    {
        q: "Vallen erfenissen in de wettelijke beperkte gemeenschap van goederen (na 1-1-2018)?",
        options: ["Ja, altijd.", "Nee, tenzij in de uitsluitingsclausule anders staat.", "Nee, deze blijven privévermogen (art. 1:94 BW).", "Alleen als de erfenis groter is dan 10.000 euro."],
        correct: 2,
        exp: "In het nieuwe stelsel blijven erfenissen en giften buiten de gemeenschap, tenzij er een insluitingsclausule is."
    },
    {
        q: "Wat is de 'zaaksvervanging' regel in het huwelijksvermogensrecht (art. 1:95 BW)?",
        options: ["Een goed is privé als het voor meer dan de helft met privégeld is gefinancierd.", "Men mag kapotte spullen vervangen.", "Schulden gaan over op de andere partner.", "De inboedel wordt om de 5 jaar getaxeerd."],
        correct: 0,
        exp: "De 50%-regel bepaalt of een aangeschaft goed in de gemeenschap valt of privé blijft bij een gemengde financiering."
    },
    {
        q: "Is een echtgenoot aansprakelijk voor schulden van de andere echtgenoot aangegaan vóór het huwelijk (na 2018)?",
        options: ["Ja, voor 50%.", "Nee, voorhuwelijkse schulden blijven privé.", "Ja, volledig.", "Alleen als er een gemeenschappelijke bankrekening is."],
        correct: 1,
        exp: "Privé-schulden van vóór het huwelijk vallen niet in de gemeenschap en kunnen niet op het aandeel van de ander worden verhaald."
    },
    {
        q: "Wat is het rechtsgevolg van het ontbreken van toestemming ex art. 1:88 BW?",
        options: ["De handeling is nietig.", "De handeling is vernietigbaar door de andere echtgenoot (art. 1:89 BW).", "De handeling is gewoon geldig.", "Er volgt een boete van de overheid."],
        correct: 1,
        exp: "Gezinsbeschermende bepalingen geven de niet-handelende partner het recht de rechtshandeling te vernietigen."
    },
    {
        q: "Wat is een 'reprise'?",
        options: ["Een herhaling van de bruiloft.", "Het recht op vergoeding van privégeld dat in de gemeenschap is vloeid.", "Een type huwelijkse voorwaarde.", "Het recht om opnieuw te verdelen."],
        correct: 1,
        exp: "Wanneer privégeld is gebruikt om gemeenschapsgoederen te financieren, ontstaat een vergoedingsrecht (nominale leer of beleggingsleer)."
    },
    {
        q: "Wat houdt de 'saisine' regel in (art. 4:182 BW)?",
        options: ["De executeur beheert de boedel.", "De erfgenamen volgen de erflater van rechtswege op in zijn bezit en rechten.", "De Staat krijgt de erfenis als er geen testament is.", "Kinderen hebben recht op een legitieme portie."],
        correct: 1,
        exp: "Er is geen juridisch vacuüm: bij overlijden gaan alle rechten en plichten direct over op de erfgenamen."
    },
    {
        q: "Wie erft in de eerste parenteel?",
        options: ["De ouders en broers/zussen.", "De echtgenoot en de kinderen van de erflater.", "De grootouders.", "De Staat."],
        correct: 1,
        exp: "Art. 4:10 BW bepaalt de volgorde; de echtgenoot en afstammelingen staan bovenaan."
    },
    {
        q: "Wat is de 'wettelijke verdeling' (art. 4:13 BW)?",
        options: ["De Staat verdeelt de erfenis.", "De langstlevende echtgenoot krijgt alle goederen; de kinderen krijgen een geldvordering.", "Iedereen krijgt een gelijk deel van de spullen.", "De notaris wijst de goederen toe."],
        correct: 1,
        exp: "Dit systeem beschermt de langstlevende partner tegen aanspraken van de kinderen die het wooncomfort zouden schaden."
    },
    {
        q: "Wanneer is de geldvordering van een kind uit de wettelijke verdeling opeisbaar?",
        options: ["Direct na overlijden.", "Zodra het kind 21 jaar is.", "Bij faillissement of overlijden van de langstlevende ouder (art. 4:13 lid 3 BW).", "Na 5 jaar."],
        correct: 2,
        exp: "De vordering is in beginsel niet-opeisbaar om de verzorging van de langstlevende niet te doorkruisen."
    },
    {
        q: "Wat is de legitieme portie van een kind?",
        options: ["De helft van het wettelijk erfdeel (art. 4:64 BW).", "Het volledige wettelijk erfdeel.", "25% van de boedel.", "Dat wat in het testament staat."],
        correct: 0,
        exp: "Een kind kan onterfd worden, maar behoudt altijd recht op de helft van de waarde van het normale erfdeel in geld."
    },
    {
        q: "Is een legitimaris een erfgenaam?",
        options: ["Ja.", "Nee, hij is een schuldeiser van de nalatenschap (art. 4:63 BW).", "Alleen als er geen partner is.", "Alleen bij beneficiaire aanvaarding."],
        correct: 1,
        exp: "De legitimaris heeft geen recht op goederen, enkel op een bedrag in geld."
    },
    {
        q: "Wat is een 'legaat'?",
        options: ["Een schuld.", "Een uiterste wilsbeschikking waarin aan iemand een vorderingsrecht op een goed wordt toegekend.", "Het onterven van een kind.", "De belasting op erfenissen."],
        correct: 1,
        exp: "Een legataris is een schuldeiser van de nalatenschap voor een specifiek object of bedrag (bijv: 'ik legateer mijn auto aan mijn neef')."
    },
    {
        q: "Wat houdt 'inkorting' in (art. 4:87 BW)?",
        options: ["Het korter maken van het testament.", "Het terughalen van waarde bij legatarissen of begiftigden om de legitieme portie te kunnen betalen.", "Het verlagen van de notariskosten.", "Het weigeren van een erfenis."],
        correct: 1,
        exp: "Als de boedel leeg is, moet de legitimaris waarde 'inkorten' op andere giften of legaten."
    },
    {
        q: "Mag men een kind volledig onterven?",
        options: ["Nee.", "Ja, maar het kind behoudt recht op de legitieme portie in geld.", "Alleen als het kind een misdrijf heeft gepleegd.", "Alleen met toestemming van de rechter."],
        correct: 1,
        exp: "Testeervrijheid staat onterving toe, maar de wet beschermt de financiële positie van afstammelingen."
    },
    {
        q: "Wat is de 'legitimaire massa'?",
        options: ["De groep kinderen.", "De waarde van de nalatenschap + bepaalde giften - schulden (art. 4:65 BW).", "Het gewicht van de kluis.", "De totale waarde van de woningen."],
        correct: 1,
        exp: "De massa is het rekenkundig fundament waarop de 50% van de legitieme wordt berekend."
    },
    {
        q: "Wat is beneficiaire aanvaarding (art. 4:190 BW)?",
        options: ["Je accepteert alleen de cadeaus.", "Aanvaarding onder voorbehoud van een boedelbeschrijving om privé-aansprakelijkheid te voorkomen.", "Het weigeren van de erfenis.", "De erfenis direct weggeven aan een goed doel."],
        correct: 1,
        exp: "Dit voorkomt dat je met je eigen vermogen de schulden van de overledene moet betalen."
    },
    {
        q: "Wie is bevoegd tot de verdeling van de nalatenschap?",
        options: ["De executeur.", "De erfgenamen gezamenlijk.", "De notaris.", "De rechter (altijd)."],
        correct: 1,
        exp: "De executeur beheert, maar de erfgenamen moeten samen beslissen over de feitelijke verdeling."
    },
    {
        q: "Wat is een codicil (art. 4:97 BW)?",
        options: ["Een geheim testament.", "Een eigenhandig geschreven, gedateerd en ondertekend document voor specifieke inboedelgoederen.", "Een digitaal bestand met wachtwoorden.", "Een type pandrecht."],
        correct: 1,
        exp: "Voor sieraden en kleding is geen dure notariële akte nodig, een codicil volstaat."
    },
    {
        q: "Wat is de termijn voor het inroepen van de legitieme portie?",
        options: ["10 jaar.", "5 jaar (art. 4:85 BW).", "1 jaar.", "Onbeperkt."],
        correct: 1,
        exp: "Na vijf jaar vervalt de mogelijkheid om aanspraak te maken op de legitieme portie."
    },
    {
        q: "Kan een stiefkind erven bij versterf?",
        options: ["Ja, gelijk aan eigen kinderen.", "Nee, alleen als dit in een testament is vastgelegd.", "Alleen als de stiefouder geen eigen kinderen heeft.", "Ja, maar de helft."],
        correct: 1,
        exp: "Bloedverwantschap is leidend voor de wet; stiefkinderen moeten expliciet worden benoemd."
    },
    {
        q: "Wat is een 'wilsrecht' in het erfrecht (art. 4:19 e.v. BW)?",
        options: ["Het recht om een testament te wijzigen.", "Het recht van kinderen om goederen in eigendom te vragen ter betaling van hun vordering.", "Het recht op euthanasie.", "Het recht om een erfgenaam te weigeren."],
        correct: 1,
        exp: "Wilsrechten beschermen kinderen tegen het 'stiefoudergevaar' (overgang van familievermogen naar de nieuwe partner)."
    },
    {
        q: "Wat is het gevolg van 'onwaardigheid' (art. 4:3 BW)?",
        options: ["De erfgenaam krijgt minder.", "De erfgenaam wordt van rechtswege uitgesloten van de erfenis (bijv. na moord op erflater).", "De erfgenaam moet meer belasting betalen.", "Er is geen gevolg."],
        correct: 1,
        exp: "Iemand die de erflater ernstig heeft misdragen, verliest elk recht op de nalatenschap."
    },
    {
        q: "Wat is een executeur?",
        options: ["De persoon die de doodstraf uitvoert.", "Iemand die door de erflater is aangewezen om de nalatenschap te beheren en schulden te betalen.", "De advocaat van de tegenpartij.", "De rechter in een erfrechtzaak."],
        correct: 1,
        exp: "De executeur zorgt voor de afwikkeling van de nalatenschap tot aan de verdeling."
    },
    {
        q: "Welk recht heeft een onterfde echtgenoot?",
        options: ["Geen enkel recht.", "Het recht op vruchtgebruik van de woning en inboedel (art. 4:28/29 BW).", "Recht op de helft van het geld.", "Direct recht op de helft van de woning."],
        correct: 1,
        exp: "De wet geeft de langstlevende echtgenoot een 'passend verzorgingsniveau' via andere wettelijke rechten."
    },
    {
        q: "Is de legitieme portie opeisbaar bij hertrouwen van de langstlevende ouder?",
        options: ["Ja, standaard.", "Nee, tenzij dit in het testament is bepaald.", "Ja, maar alleen de helft.", "Alleen na 2 jaar."],
        correct: 1,
        exp: "Hertrouwen is geen wettelijke grond voor opeisbaarheid (art. 4:13 lid 3), maar wordt vaak wel in testamenten opgenomen."
    },
    {
        q: "Wat is 'vervulling' in het erfrecht?",
        options: ["Het vullen van de bankrekening.", "Het proces waarbij afstammelingen van een vooroverleden erfgenaam diens plaats innemen.", "Het uitvoeren van een wens.", "Het betalen van de erfbelasting."],
        correct: 1,
        exp: "Plaatsvervulling zorgt ervoor dat kleinkinderen erven als hun ouder al dood is."
    },
    {
        q: "Wat is een verblijvensbeding?",
        options: ["Een verbod om te verhuizen.", "Een afspraak dat gemeenschappelijke goederen bij overlijden naar de langstlevende gaan buiten de erfenis om.", "Een recht om in een hotel te blijven.", "Een type pandrecht."],
        correct: 1,
        exp: "Dit wordt vaak in samenlevingscontracten gebruikt om de partner te beschermen."
    },
    {
        q: "Wat is de rangorde van schulden (art. 4:7 BW)?",
        options: ["Geen rangorde.", "Begrafeniskosten en kosten van executele gaan voor op legaten.", "Legaten gaan voor op de legitieme portie.", "Alle schulden zijn gelijk."],
        correct: 1,
        exp: "De wet bepaalt precies welke schulden (zoals uitvaart) als eerste uit de pot betaald moeten worden."
    },
    {
        q: "Kan een erfgenaam nog verwerpen na beneficiaire aanvaarding?",
        options: ["Ja.", "Nee, een eenmaal gemaakte keuze is onherroepelijk (art. 4:190 lid 4 BW).", "Alleen na toestemming van de rechter.", "Alleen binnen 3 dagen."],
        correct: 1,
        exp: "Keuzevrijheid eindigt zodra men een formele keuze heeft uitgebracht of zich als zuiver aanvaard hebbend erfgenaam gedraagt."
    },
    { q: "Wat is de eindstand: Legitieme is 1/2 van...?", options: ["Testamentair deel.", "Wettelijk erfdeel (4:64).", "De hele boedel.", "De inboedel."], correct: 1, exp: "De berekening start altijd bij wat het kind zonder testament zou krijgen." }
  ], []);

  // --- LOGIC ---
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
      
      {/* HEADER MET REAL-TIME SCORE */}
      <nav className="h-20 bg-white border-b border-stone-200 px-10 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tighter text-[#1A365D]">ELBERT'S KENNISBANK</span>
          <span className="text-[9px] uppercase tracking-[0.4em] text-[#C5A059] font-black">Score: {currentScore} / {QUESTIONS.length}</span>
        </div>
        
        {gameState === 'quiz' && (
          <div className="w-48 bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <motion.div className={`h-full transition-colors duration-500 ${barColorClass}`} animate={{ width: `${progress}%` }} />
          </div>
        )}
      </nav>

      <main className="max-w-4xl mx-auto py-12 px-6">
        <AnimatePresence mode="wait">
          
          {/* START SCREEN */}
          {gameState === 'start' && (
            <motion.div key="start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center space-y-12">
              <div className="relative inline-block mt-8">
                <div className="w-64 h-64 rounded-full border-[12px] border-white shadow-2xl overflow-hidden mx-auto bg-stone-100">
                    <img src="/foto.jpg" alt="Meester Elbert" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-[#C5A059] text-white w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-xl rotate-12 border-4 border-white">
                    <span className="text-3xl font-bold">50</span>
                    <span className="text-[8px] uppercase font-black">Items</span>
                </div>
              </div>
              <h1 className="text-7xl font-bold text-[#1A365D] leading-tight">De Meesterproef.</h1>
              <p className="text-stone-500 text-2xl italic font-light max-w-2xl mx-auto">"Ius est ars boni et aequi."</p>
              <button onClick={() => setGameState('quiz')} className="px-16 py-6 bg-[#1A365D] text-white rounded-full font-bold uppercase tracking-[0.3em] text-xs shadow-2xl hover:scale-105 transition-all">Start de Training</button>
            </motion.div>
          )}

          {/* QUIZ MODULE */}
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

                <h2 className="text-4xl font-bold text-[#1A365D] leading-snug mb-12">{QUESTIONS[currentIdx].q}</h2>

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

                {/* NAVIGATIE BALK */}
                <div className="flex justify-between mt-12 pt-8 border-t border-stone-100">
                    <button onClick={handleBack} disabled={currentIdx === 0} className={`flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] transition-all ${currentIdx === 0 ? 'text-stone-200 cursor-not-allowed' : 'text-[#1A365D] hover:text-[#C5A059]'}`}>← Vorige</button>
                    <button onClick={handleNext} disabled={!isAnswered} className={`px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-md ${!isAnswered ? 'bg-stone-100 text-stone-300 cursor-not-allowed' : 'bg-[#1A365D] text-white hover:bg-black'}`}>
                        {currentIdx === QUESTIONS.length - 1 ? "Bekijk Resultaat" : "Volgende →"}
                    </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* RESULTS SCREEN */}
          {gameState === 'results' && (
            <motion.div key="results" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
              <div className="bg-white p-24 rounded-[5rem] shadow-2xl border border-stone-100 inline-block w-full relative">
                <div className="absolute top-0 left-0 w-full h-4 bg-[#C5A059]" />
                <h2 className="text-5xl font-bold text-[#1A365D] mb-4">Eindresultaat Training</h2>
                <div className="text-[12rem] font-black leading-none text-[#1A365D] my-10">{currentScore}</div>
                <p className="text-4xl font-serif italic text-stone-800 mb-12">Cijfer: {((currentScore/QUESTIONS.length)*9 + 1).toFixed(1)}</p>
                <button onClick={() => window.location.reload()} className="px-16 py-6 border-2 border-[#1A365D] text-[#1A365D] rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-[#1A365D] hover:text-white transition-all shadow-lg">Herstart de Meesterproef</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ElbertsKennisbank;