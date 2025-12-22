import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ElbertsKennisbank = () => {
  const [gameState, setGameState] = useState('start'); // start, quiz, results
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // --- DATASET: 50 TENTAMENVRAGEN ---
  const QUESTIONS = useMemo(() => [
    {
      q: "Wat is het rechtsgevolg van een overdracht die louter tot zekerheid dient (art. 3:84 lid 3 BW)?",
      options: ["De overdracht is rechtsgeldig.", "Er ontstaat een stil pandrecht.", "De rechtshandeling mist goederenrechtelijke werking (nietig).", "De overdracht is vernietigbaar."],
      correct: 2,
      exp: "Het fiduciaverbod bepaalt dat een titel die slechts zekerheid beoogt zonder werkelijke overgang geen geldige titel is voor overdracht."
    },
    {
      q: "Charoe koopt een huis van Roemer. De titel tussen de vorige eigenaar Bucx en Roemer wordt achteraf vernietigd wegens misbruik van omstandigheden. Bucx was echter wel bevoegd. Wordt Charoe beschermd?",
      options: ["Nee, want Roemer was onbevoegd.", "Ja, op grond van art. 3:88 BW.", "Ja, op grond van art. 3:86 BW.", "Nee, want vernietiging heeft geen terugwerkende kracht."],
      correct: 1,
      exp: "Charoe wordt beschermd omdat de onbevoegdheid van Roemer voortvloeit uit een titelgebrek bij een vorige overdracht waarbij de vervreemder (Bucx) bevoegd was."
    },
    {
      q: "Wat is het peilmoment voor de omvang van de huwelijksgemeenschap bij een echtscheiding?",
      options: ["De datum van de huwelijksvoltrekking.", "De datum van de uitspraak door de rechter.", "De datum van indiening van het verzoekschrift.", "De datum van inschrijving in de registers."],
      correct: 2,
      exp: "Sinds 2012 bepaalt art. 1:99 lid 1 sub b BW dat de indiening van het verzoek de gemeenschap fixeert."
    },
    {
      q: "Welke parenteel wordt opgeroepen als er geen echtgenoot, kinderen, ouders of broers/zussen meer zijn?",
      options: ["De grootouders (derde parenteel).", "De overgrootouders (vierde parenteel).", "De neven en nichten.", "De Staat der Nederlanden."],
      correct: 0,
      exp: "Conform art. 4:10 BW is de derde parenteel die van de grootouders en hun afstammelingen."
    },
    {
        q: "Een vordering van een onterfde legitimaris is in de wettelijke verdeling opeisbaar wanneer:",
        options: ["Direct na overlijden.", "Zodra de legitieme portie is berekend.", "Wanneer de langstlevende echtgenoot failliet gaat.", "Nooit, het is een natuurlijke verbintenis."],
        correct: 2,
        exp: "Art. 4:13 lid 3 BW noemt faillissement en schuldsanering als uitzonderingen op de niet-opeisbaarheid."
    },
    {
        q: "Wat is het vereiste voor de vestiging van een vuistpandrecht?",
        options: ["Geregistreerde onderhandse akte.", "Notariële akte.", "Brengen van de zaak in de macht van de pandhouder.", "Mededeling aan de Belastingdienst."],
        correct: 2,
        exp: "Art. 3:236 lid 1 BW vereist machtsverschaffing voor de vestiging van een vuistpand."
    },
    {
        q: "Indien een garagehouder een auto niet afgeeft omdat de rekening niet betaald is, oefent hij welk recht uit?",
        options: ["Eigendomsvoorbehoud", "Pandrecht", "Retentierecht", "Vruchtgebruik"],
        correct: 2,
        exp: "Het retentierecht (3:290 BW) geeft de bevoegdheid de afgifte op te schorten tot de vordering is voldaan."
    },
    {
        q: "Wie is een separatist in een faillissement?",
        options: ["De curator", "De Belastingdienst", "De hypotheekhouder", "De werknemer"],
        correct: 2,
        exp: "Pand- en hypotheekhouders kunnen hun rechten uitoefenen alsof er geen faillissement is (art. 57 Fw)."
    },
    {
        q: "Wat houdt de 'reprise' in het huwelijksvermogensrecht in?",
        options: ["Samen de helft betalen.", "Vergoedingsrecht van een echtgenoot op de gemeenschap wegens privégeld.", "Het recht om opnieuw te trouwen.", "Een gift aan een stiefkind."],
        correct: 1,
        exp: "Reprise is het recht van een echtgenoot om privégeld dat in de gemeenschap is gevloeid terug te vorderen."
    },
    {
        q: "Hoe groot is de legitieme portie gewoonlijk?",
        options: ["100% van het erfdeel.", "75% van de waarde.", "De helft van de waarde van het wettelijk erfdeel.", "Gelijk aan een legaat."],
        correct: 2,
        exp: "Conform art. 4:64 BW bedraagt de legitieme de helft van hetgeen het kind bij versterf zou krijgen."
    },
    {
        q: "Wat is 'zaaksvervanging' bij een huwelijk na 2018?",
        options: ["Een goed is privé als het voor meer dan de helft met privégeld is betaald (1:95 BW).", "Ruilen van kleding.", "Het huis op naam van de kinderen zetten.", "Het verkopen van aandelen."],
        correct: 0,
        exp: "Bij de beperkte gemeenschap bepaalt de herkomst van de financiering (50%+ grens) de status van het goed."
    },
    {
        q: "Is een auto een registergoed in de zin van art. 3:10 BW?",
        options: ["Ja, wegens de RDW-inschrijving.", "Nee, want inschrijving is niet constitutief voor de overdracht.", "Ja, mits hij nieuw is.", "Alleen bij een zakelijke lease."],
        correct: 1,
        exp: "Auto's zijn roerende zaken. De RDW-registratie is voor de fiscus en politie, niet voor de eigendomsovergang."
    },
    {
        q: "Welk beginsel houdt in dat een ouder recht voorgaat op een jonger beperkt recht?",
        options: ["Individualiseringsbeginsel", "Causaliteitsbeginsel", "Prioriteitsbeginsel", "Eenheidsbeginsel"],
        correct: 2,
        exp: "Het prioriteitsbeginsel (prior tempore, potior iure) regeert de rangorde van beperkte rechten."
    },
    {
        q: "Wat is het gevolg van de terugwerkende kracht bij vernietiging van een titel (3:53 BW)?",
        options: ["De overdracht blijft geldig.", "De vervreemder wordt met terugwerkende kracht weer eigenaar.", "De notaris krijgt een boete.", "De koper moet het goed direct vernietigen."],
        correct: 1,
        exp: "Omdat de titel achteraf nooit heeft bestaan, faalt de overdracht wegens 3:84 lid 1 BW."
    },
    {
        q: "Wat houdt de 'saisine-regel' in (art. 4:182 BW)?",
        options: ["Erfgenamen volgen de overledene direct op in rechten en plichten.", "De Staat beheert de boedel.", "Het testament moet binnen 24 uur geopend worden.", "Schulden vervallen bij de dood."],
        correct: 0,
        exp: "Er is geen juridisch vacuüm: de erfgenaam treedt onmiddellijk in de schoenen van de erflater."
    },
    {
        q: "Wanneer is een echtgenoot hoofdelijk aansprakelijk voor schulden van de ander?",
        options: ["Voor alle schulden.", "Alleen voor zakelijke schulden.", "Voor schulden t.b.v. de gewone gang van de huishouding (1:85 BW).", "Nooit."],
        correct: 2,
        exp: "Art. 1:85 BW schept hoofdelijke aansprakelijkheid voor de dagelijkse kosten van het gezin."
    },
    {
        q: "Wat is een 'codicil'?",
        options: ["Een type hypotheek.", "Een zelfgeschreven document voor o.a. meubels en sieraden (4:97 BW).", "Een echtscheidingsconvenant.", "Een verzegelde envelop bij de bank."],
        correct: 1,
        exp: "In een codicil kun je specifieke roerende zaken vermaken zonder notaris."
    },
    {
        q: "Wat is het 'huurbeding' in een hypotheekakte?",
        options: ["Verplichting om te verhuren.", "Recht van de bank om onbevoegde verhuur te vernietigen bij executie.", "Korting op de rente.", "Recht van de huurder om er te blijven wonen."],
        correct: 1,
        exp: "Het huurbeding (3:264 BW) voorkomt dat de waarde van het onderpand daalt door verhuur."
    },
    {
        q: "Gaan speciale voorrechten voor algemene voorrechten?",
        options: ["Nee, algemeen gaat altijd voor.", "Ja, op grond van art. 3:280 BW.", "Ze hebben een gelijke rang.", "Het oudste recht gaat voor."],
        correct: 1,
        exp: "Speciale voorrechten op een specifiek goed gaan boven algemene voorrechten op de hele boedel."
    },
    {
        q: "Wanneer is een kind 'onwaardig' om te erven?",
        options: ["Als het kind onterfd is.", "Bij een onherroepelijke veroordeling wegens moord op de erflater.", "Als het kind minderjarig is.", "Als het kind in het buitenland woont."],
        correct: 1,
        exp: "Art. 4:3 BW somt gronden op (zoals geweld tegen de erflater) die leiden tot onwaardigheid."
    },
    {
        q: "Wat is 'levering per constitutum possessorium'?",
        options: ["Bezitter wordt houder voor de ander.", "Houder wordt bezitter.", "Derde gaat houden voor de ander.", "Fysieke overgave."],
        correct: 0,
        exp: "Bij CP-levering (3:115 sub a) houdt de verkoper het goed voortaan voor de koper."
    },
    {
        q: "Hoe wordt een hypotheekrecht gevestigd?",
        options: ["Mondelinge afspraak.", "Onderhandse akte.", "Notariële akte en inschrijving in de openbare registers.", "Registratie bij de RDW."],
        correct: 2,
        exp: "Voor registergoederen is publiciteit via een notariële akte en het Kadaster verplicht (3:260 BW)."
    },
    {
        q: "Wat is de 'legitimaire massa'?",
        options: ["De groep kinderen.", "Saldo nalatenschap + giften - schulden (behalve legaten).", "De totale schuld.", "Het gewicht van de kluis."],
        correct: 1,
        exp: "De massa is de rekenkundige basis voor de berekening van de legitieme portie (4:65 BW)."
    },
    {
        q: "Mag een executeur de nalatenschap verdelen?",
        options: ["Ja, hij is de enige bevoegde.", "Nee, hij beheert alleen de boedel en betaalt schulden.", "Alleen na toestemming van de Staat.", "Alleen bij een negatieve boedel."],
        correct: 1,
        exp: "De executeur maakt de boedel klaar voor verdeling, maar de verdeling zelf is aan de erfgenamen."
    },
    {
        q: "Wat is het 'individualiseringsbeginsel'?",
        options: ["Iedereen is uniek.", "Zakelijke rechten vereisen een uniek identificeerbaar object.", "Je mag maar één huis bezitten.", "Aansprakelijkheid voor eigen daden."],
        correct: 1,
        exp: "Voor een zakelijk recht moet duidelijk zijn op welke specifieke zaak het recht betrekking heeft."
    },
    {
        q: "Wat is het gevolg van beneficiaire aanvaarding?",
        options: ["Geen recht op de erfenis.", "Bescherming tegen privé-aansprakelijkheid voor schulden.", "Alle schulden worden kwijtgescholden.", "Directe uitbetaling."],
        correct: 1,
        exp: "Je bent alleen aansprakelijk voor schulden tot de waarde van de baten uit de erfenis."
    },
    {
        q: "Wat is een 'quasi-legaat'?",
        options: ["Een verboden testament.", "Handelingen die als schenking bij overlijden gelden.", "Een type auto.", "Een onjuiste inschrijving."],
        correct: 1,
        exp: "Dit zijn handelingen bij leven die door de wet gelijkgesteld worden aan legaten voor schuldberekening."
    },
    {
        q: "Wat is het peilmoment voor de waarde bij de legitieme portie?",
        options: ["Direct na overlijden.", "Bij de geboorte.", "Tien jaar voor de dood.", "Bij de uitspraak van de rechter."],
        correct: 0,
        exp: "De waarde van de goederen wordt bepaald naar het tijdstip onmiddellijk na overlijden."
    },
    {
        q: "Vallen pensioenrechten in de huwelijksgemeenschap?",
        options: ["Ja, altijd.", "Nee, deze zijn wettelijk uitgezonderd (art. 1:94 lid 2 sub b BW).", "Alleen bij een scheiding.", "Alleen als de partner niet werkt."],
        correct: 1,
        exp: "Pensioenrechten vallen buiten de gemeenschap, maar worden verevend via een speciale wet."
    },
    {
        q: "Wat is het verschil tussen onmiddellijk en middellijk bezit?",
        options: ["Geld op de bank vs contant.", "Zelf de macht uitoefenen vs iemand anders houdt voor jou.", "Eigendom vs huur.", "Notarieel vs onderhands."],
        correct: 1,
        exp: "Je bent middellijk bezitter als een ander (bijv. een huurder) het goed voor jou houdt."
    },
    {
        q: "Wat is 'natrekking' bij roerende zaken (5:14 BW)?",
        options: ["Bestanddeelvorming waarbij de eigenaar van de hoofdzaak eigenaar wordt.", "Diefstal van onderdelen.", "Het verhuren van een auto.", "Inruilen van een defecte motor."],
        correct: 0,
        exp: "Bij samengestelde zaken volgt het bestanddeel de eigendom van de hoofdzaak."
    },
    {
        q: "Mag een hypotheekhouder de woning direct verkopen bij wanbetaling?",
        options: ["Ja, via parate executie (3:268 BW).", "Nee, hij moet eerst beslag leggen.", "Alleen als de politie helpt.", "Ja, maar alleen via de marktplaats."],
        correct: 0,
        exp: "Zekerheidsrechten geven het recht van parate executie zonder executoriale titel."
    },
    {
        q: "Wat is de sanctie op het ontbreken van toestemming ex art. 1:88 BW?",
        options: ["Nietigheid van rechtswege.", "Vernietigbaarheid.", "Een boete van 500 euro.", "Gevangenisstraf."],
        correct: 1,
        exp: "De andere echtgenoot kan de handeling vernietigen (1:89 BW)."
    },
    {
        q: "Wat is het 'eenheidsbeginsel' in het goederenrecht?",
        options: ["Eén wet voor iedereen.", "De eigenaar van een zaak is eigenaar van alle bestanddelen.", "Eén koper per huis.", "Het huwelijk is één eenheid."],
        correct: 1,
        exp: "Juridisch wordt een hoofdzaak met al zijn bestanddelen als één object gezien (art. 5:3 BW)."
    },
    {
        q: "Wat is een 'wilsrecht' in het erfrecht?",
        options: ["Het recht om een testament te schrijven.", "Bescherming van kinderen tegen stiefoudergevaar.", "Het recht om de as te verstrooien.", "Vrije wil bij aanvaarding."],
        correct: 1,
        exp: "Wilsrechten (4:19-22 BW) stellen kinderen in staat goederen in eigendom te krijgen ter dekking van hun vordering."
    },
    {
        q: "Wat houdt het individualiseringsvereiste in bij registergoederen?",
        options: ["De akte moet de kadastrale gegevens bevatten.", "De koper moet zijn ID laten zien.", "Het huis moet een unieke kleur hebben.", "Er mag maar één koper zijn."],
        correct: 0,
        exp: "Inschrijving in het Kadaster vereist een exacte kadastrale aanduiding van het perceel."
    },
    {
        q: "Wat is 'zaaksvorming' (5:16 BW)?",
        options: ["Het bouwen van een huis.", "Ontstaan van een nieuwe zaak door menselijke arbeid uit andere stoffen.", "Het stelen van een zaak.", "Het huren van een zaak."],
        correct: 1,
        exp: "Wie voor zichzelf een nieuwe zaak vormt uit stoffen van een ander, wordt daarvan eigenaar."
    },
    {
        q: "Bestaat er een prioriteitsregel voor vorderingsrechten?",
        options: ["Ja, wie het eerst komt.", "Nee, vorderingsrechten zijn gelijkwaardig (paritas creditorum).", "Alleen voor banken.", "Alleen boven de 10.000 euro."],
        correct: 1,
        exp: "Gelijkheid van schuldeisers (3:277 BW) is de hoofdregel voor vorderingen."
    },
    {
        q: "Kan een pandrecht rusten op een toekomstig goed?",
        options: ["Ja, mits de rechtsverhouding al bestaat.", "Nee, nooit.", "Alleen bij een notaris.", "Ja, maar alleen op huizen."],
        correct: 0,
        exp: "Men kan een pandrecht vestigen op toekomstige goederen (bijv. voorraad) onder bepaalde voorwaarden."
    },
    {
        q: "Wat is het gevolg van een 'stille cessie' voor de debiteur?",
        options: ["He moet direct aan de nieuwe eigenaar betalen.", "Hij weet er niets van en mag bevrijdend betalen aan de oude schuldeiser.", "De schuld vervalt.", "Hij moet 10% extra betalen."],
        correct: 1,
        exp: "Bij een stille cessie (3:94 lid 3) blijft de debiteur beschermd zolang hem geen mededeling is gedaan."
    },
    {
        q: "Wat is 'res nullius'?",
        options: ["Een zaak zonder eigenaar.", "Een ongeldige titel.", "Een overleden erflater.", "Een geheim pandrecht."],
        correct: 0,
        exp: "Res nullius zijn zaken die aan niemand toebehoren en door inbezitneming verkregen kunnen worden."
    },
    {
        q: "Wat is het doel van de 'boedelbeschrijving'?",
        options: ["De inboedel verkopen.", "Vastleggen van de waarde voor vorderingen van kinderen.", "Het huis opruimen.", "Schenken aan een goed doel."],
        correct: 1,
        exp: "Zonder beschrijving is de hoogte van de vordering van de kinderen op de langstlevende onbekend."
    },
    {
        q: "Is een 'onroerende zaak' altijd een registergoed?",
        options: ["Nee.", "Ja, op grond van art. 3:10 BW.", "Alleen als het een huis is.", "Alleen in Leiden."],
        correct: 1,
        exp: "Onroerende zaken vereisen inschrijving in het Kadaster voor overdracht en zijn dus per definitie registergoederen."
    },
    {
        q: "Wat houdt 'inkorting' in het erfrecht in?",
        options: ["De erfenis kleiner maken.", "Waarde terughalen bij begiftigden om de legitieme te betalen.", "De begrafenis sober houden.", "Het testament korter schrijven."],
        correct: 1,
        exp: "Inkorting (4:87 BW) is de actie om de legitieme portie te realiseren uit legaten of giften."
    },
    {
        q: "Wanneer is sprake van 'interversie'?",
        options: ["Als een houder zichzelf tot bezitter maakt.", "Als een dief wordt gepakt.", "Als de bank het huis verkoopt.", "Als echtgenoten scheiden."],
        correct: 0,
        exp: "Interversie is verboden (3:111 BW): een houder blijft houder, tenzij de titel verandert met medewerking van de bezitter."
    },
    {
        q: "Wat is het 'causaal stelsel'?",
        options: ["Oorzaak en gevolg bij schade.", "Eigendomsoverdracht vereist een geldige titel.", "De oudste bank gaat voor.", "Kinderen erven alles."],
        correct: 1,
        exp: "Zonder geldige titel is de overdracht nietig (causaliteit tussen titel en levering)."
    },
    {
        q: "Wat is een 'legataris'?",
        options: ["De baas van de boedel.", "Iemand die een vorderingsrecht op een specifiek goed krijgt via het testament.", "Iemand die onterfd is.", "De notaris."],
        correct: 1,
        exp: "Een legataris is een schuldeiser van de nalatenschap voor een specifiek object of bedrag."
    },
    {
        q: "Wat is 'finaal verrekenbeding'?",
        options: ["Jaarlijks afrekenen.", "Afrekenen aan het einde alsof er gemeenschap van goederen was.", "Alle schulden direct betalen.", "Het testament definitief maken."],
        correct: 1,
        exp: "Dit beding in huwelijkse voorwaarden bootst de gemeenschap na bij overlijden of scheiding."
    },
    {
        q: "Wat is 'verticale natrekking'?",
        options: ["Gebouwen volgen de grond.", "De lift in een gebouw.", "Salarisverhoging.", "Schulden bij de bank."],
        correct: 0,
        exp: "Gebouwen en werken op de grond worden eigendom van de grondeigenaar (5:20 BW)."
    },
    {
        q: "Is de Staat een erfgenaam?",
        options: ["Ja, in de eerste parenteel.", "Nee, alleen als er tot in de zesde graad geen bloedverwanten zijn.", "Alleen bij belastingschulden.", "Alleen als er geen testament is."],
        correct: 1,
        exp: "De Staat is de 'ultieme' erfgenaam als er absoluut niemand anders meer is."
    }
  ], []);

  // --- LOGIC ---
  const handleAnswer = (idx) => {
    if (showFeedback) return;
    setSelectedOption(idx);
    setShowFeedback(true);
    if (idx === QUESTIONS[currentIdx].correct) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx(c => c + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setGameState('results');
    }
  };

  const progress = ((currentIdx + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-[#FCFBFA] text-[#1A1C1E] font-sans">
      {/* HEADER */}
      <nav className="p-6 border-b border-stone-200 bg-white shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tighter italic text-stone-800 font-serif">ELBERT'S KENNISBANK</span>
          <span className="text-[10px] uppercase tracking-widest bg-stone-100 px-2 py-1 rounded text-stone-500 font-black">Rechten Masterclass</span>
        </div>
        <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">
          Score: {score} / {QUESTIONS.length}
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          
          {/* START SCREEN */}
          {gameState === 'start' && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-center space-y-8"
            >
              {/* PLAATSHOUDER VOOR FOTO */}
              <div className="flex justify-center">
                <div className="w-40 h-40 bg-stone-200 rounded-full border-4 border-[#3E5C76] flex items-center justify-center overflow-hidden shadow-xl">
                    {/* Vervang de src door je eigen foto link of laat hem zo voor een minimalistisch icoon */}
                    <img 
                      src="https://www.universiteitleiden.nl/binaries/content/gallery/ul2012/locaties/rechten/kamerlingh-onnes-gebouw-kog.jpg" 
                      alt="Elbert's Motivatie" 
                      className="object-cover h-full"
                    />
                </div>
              </div>

              <h1 className="text-6xl font-bold font-serif leading-tight">De Grote 50 <br/><span className="text-stone-400 italic font-normal">Privaatrecht II Uitdaging.</span></h1>
              <p className="text-stone-600 text-lg max-w-lg mx-auto italic">
                "Zet hem op! De weg naar je meestertitel begint bij het beheersen van de details. Focus op 3:88, 4:13 en de rangorde."
              </p>
              
              <button 
                onClick={() => setGameState('quiz')}
                className="px-12 py-4 bg-[#3E5C76] text-white rounded-full font-bold hover:bg-[#2d4356] transition-all shadow-lg uppercase tracking-widest text-sm"
              >
                Begin de Training
              </button>
            </motion.div>
          )}

          {/* QUIZ SCREEN */}
          {gameState === 'quiz' && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-stone-400">
                  <span>Vraag {currentIdx + 1} / 50</span>
                  <span>{Math.round(progress)}% voltooid</span>
                </div>
                <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-[#3E5C76]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="bg-white p-10 rounded-[2rem] border border-stone-200 shadow-xl space-y-8">
                <h2 className="text-2xl font-bold font-serif text-stone-900 leading-snug">
                  {QUESTIONS[currentIdx].q}
                </h2>

                <div className="grid grid-cols-1 gap-3">
                  {QUESTIONS[currentIdx].options.map((opt, i) => {
                    const isCorrect = i === QUESTIONS[currentIdx].correct;
                    const isSelected = i === selectedOption;
                    let bgClass = "bg-white border-stone-200 hover:border-stone-400";
                    
                    if (showFeedback) {
                      if (isCorrect) bgClass = "bg-green-50 border-green-500 text-green-800 shadow-inner";
                      else if (isSelected) bgClass = "bg-red-50 border-red-500 text-red-800 opacity-60";
                      else bgClass = "bg-white border-stone-100 opacity-40";
                    }

                    return (
                      <button
                        key={i}
                        disabled={showFeedback}
                        onClick={() => handleAnswer(i)}
                        className={`p-5 text-left rounded-2xl border-2 font-medium transition-all ${bgClass}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {showFeedback && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      className="p-6 bg-stone-50 rounded-2xl border-l-4 border-[#3E5C76] text-sm text-stone-600 italic"
                    >
                      <span className="font-black uppercase text-[10px] block mb-2 tracking-widest text-[#3E5C76]">Ratio Legis:</span>
                      {QUESTIONS[currentIdx].exp}
                    </motion.div>
                  )}
                </AnimatePresence>

                {showFeedback && (
                  <button 
                    onClick={nextQuestion}
                    className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
                  >
                    {currentIdx === QUESTIONS.length - 1 ? "Bekijk Resultaten" : "Volgende Vraag"}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* RESULTS SCREEN */}
          {gameState === 'results' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-10"
            >
              <div className="p-16 bg-white rounded-[3rem] shadow-2xl border border-stone-200">
                <h2 className="text-4xl font-serif font-bold mb-4">Training Voltooid</h2>
                <div className="text-8xl font-black text-[#3E5C76] mb-4">{score}<span className="text-2xl text-stone-300">/50</span></div>
                <p className="text-stone-500 uppercase tracking-widest font-bold mb-8">
                  Voorlopig Cijfer: {((score / 50) * 9 + 1).toFixed(1)}
                </p>
                
                <div className="text-lg text-stone-600 max-w-sm mx-auto italic mb-10">
                  {score > 45 ? "Fenomenaal, Elbert! Je bent een absolute expert." : 
                   score > 35 ? "Sterk resultaat. Je staat er goed voor voor het tentamen." : 
                   "Niet slecht, maar loop de lastige onderwerpen van week 4 en 6 nog eens door."}
                </div>

                <button 
                  onClick={() => window.location.reload()}
                  className="px-12 py-4 border-2 border-stone-900 rounded-full font-bold hover:bg-stone-900 hover:text-white transition-all"
                >
                  Opnieuw Oefenen
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <footer className="mt-20 py-10 text-center border-t border-stone-100">
        <p className="text-[10px] font-black uppercase tracking-widest text-stone-300">© 2025 ELBERT'S KENNISBANK — MASTERCLASS BURGERLIJK RECHT II</p>
      </footer>
    </div>
  );
};

export default ElbertsKennisbank;