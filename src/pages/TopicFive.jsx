import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IPR_QUIZ_DATA = [
  // WEEK 1: RECHTSORDE
  {
    q: "Nederland wordt aangemerkt als 'gematigd monistisch'. Wat is hiervan de belangrijkste constitutionele consequentie volgens Art. 94 Gw?",
    options: [
      "Alle internationale regels hebben automatisch voorrang op de Grondwet.",
      "Alleen eenieder verbindende verdragsbepalingen hebben voorrang op nationale wettelijke voorschriften.",
      "Internationaal recht moet altijd eerst worden omgezet in een wet in formele zin.",
      "De rechter mag wetten in formele zin nooit toetsen aan verdragen."
    ],
    correct: 1,
    basis: "Art. 94 Gw bepaalt dat wettelijke voorschriften buiten toepassing blijven als ze strijdig zijn met 'eenieder verbindende' verdragsbepalingen."
  },
  {
    q: "Wat was de kernwaarde van de Vrede van Westfalen (1648) voor de moderne internationale rechtsorde?",
    options: [
      "De oprichting van de eerste internationale organisatie.",
      "Het ontstaan van een systeem van co-existentie tussen soevereine staten.",
      "Het verbod op het gebruik van geweld in de internationale betrekkingen.",
      "De verplichting voor staten om democratisch te zijn."
    ],
    correct: 1,
    basis: "Westfalen markeert de overgang naar soevereine staten die formeel gelijkwaardig zijn en vreedzaam naast elkaar leven (co-existentie)."
  },
  {
    q: "In het dualistische model wordt de geldigheid van internationaal recht in de nationale rechtsorde bepaald door:",
    options: [
      "De automatische werking van het VN-Handvest.",
      "Het principe van pacta sunt servanda.",
      "Omzetting (transformatie) door de nationale wetgever.",
      "De uitspraak van een internationaal tribunaal."
    ],
    correct: 2,
    basis: "In het dualisme zijn internationaal en nationaal recht gescheiden; internationaal recht geldt pas nationaal na uitdrukkelijke opname door de wetgever."
  },
  {
    q: "Wat houdt 'verdragsconforme interpretatie' in?",
    options: [
      "Het direct toepassen van een verdrag in plaats van de wet.",
      "Het uitleggen van nationaal recht in het licht van internationale verplichtingen.",
      "Het wijzigen van de Grondwet om een verdrag te laten passen.",
      "Het weigeren van een verdrag omdat het botst met de wet."
    ],
    correct: 1,
    basis: "De rechter probeert de nationale wet zo uit te leggen dat er geen conflict ontstaat met internationaal recht (indirecte doorwerking)."
  },

  // WEEK 2: SUBJECTEN
  {
    q: "Welke criteria hanteert het Montevideo-verdrag (1933) voor het bestaan van een staat?",
    options: [
      "Grondgebied, Bevolking, Regering en Erkenning door de VN.",
      "Grondgebied, Bevolking, Regering en het Vermogen om betrekkingen aan te gaan.",
      "Leger, Belastingstelsel, Grondwet en een Staatshoofd.",
      "Democratie, Rechtsstaat en een eigen valuta."
    ],
    correct: 1,
    basis: "Artikel 1 Montevideo-verdrag noemt: permanent population, defined territory, government, and capacity to enter into relations."
  },
  {
    q: "Wat is het verschil tussen de declaratoire en de constitutieve leer bij de erkenning van staten?",
    options: [
      "In de constitutieve leer is erkenning een juridische voorwaarde voor het ontstaan van de staat.",
      "In de declaratoire leer kan een staat niet bestaan zonder erkenning.",
      "De constitutieve leer stelt dat erkenning slechts een politiek feit is.",
      "Er is geen verschil; beide termen zijn synoniemen."
    ],
    correct: 0,
    basis: "Bij de constitutieve leer schept erkenning de staat; bij de declaratoire leer bevestigt erkenning slechts de feitelijke situatie."
  },
  {
    q: "Wat houdt het specialiteitsbeginsel in voor internationale organisaties?",
    options: [
      "Zij genieten een speciale status bij de belastingdienst.",
      "Hun bevoegdheden zijn beperkt tot de doelen waarvoor zij zijn opgericht.",
      "Zij mogen alleen verdragen sluiten met staten, niet met andere organisaties.",
      "Zij hebben volledige soevereiniteit gelijk aan die van staten."
    ],
    correct: 1,
    basis: "In tegenstelling tot staten hebben organisaties geen algemene bevoegdheid, maar functionele bevoegdheden (geattribueerd door lidstaten)."
  },
  {
    q: "Wat is een kenmerk van de facto-regimes?",
    options: [
      "Zij hebben altijd volledige rechtssubjectiviteit.",
      "Zij oefenen feitelijk effectief gezag uit over een deel van een grondgebied.",
      "Zij zijn altijd lid van de Verenigde Naties.",
      "Zij mogen geen geweld gebruiken om hun doel te bereiken."
    ],
    correct: 1,
    basis: "De facto-regimes zijn groepen (zoals ISIS of rebellen) die feitelijk macht uitoefenen zonder als staat erkend te zijn."
  },

  // WEEK 3: BRONNEN
  {
    q: "Wat zijn de twee vereisten voor het ontstaan van internationaal gewoonterecht?",
    options: [
      "Een verdrag en een handtekening.",
      "Algemene praktijk (statenpraktijk) en rechtsovertuiging (opinio juris).",
      "Toestemming van de Veiligheidsraad en publicatie in de krant.",
      "Unanimiteit en een schriftelijke verklaring."
    ],
    correct: 1,
    basis: "Gewoonterecht ontstaat door een consistente praktijk van staten die zij uitvoeren omdat zij zich daartoe juridisch verplicht voelen."
  },
  {
    q: "Wanneer kan een staat als 'persistent objector' worden aangemerkt?",
    options: [
      "Als hij na de vorming van een regel weigert deze na te leven.",
      "Als hij consequent bezwaar maakt tijdens het vormingsproces van een gewoonterechtelijke regel.",
      "Als hij uit een internationale organisatie treedt.",
      "Als hij de rechtsmacht van het IGH niet erkent."
    ],
    correct: 1,
    basis: "Een persistent objector is niet gebonden aan een nieuwe gewoonterechtsregel mits hij tijdens de vorming steeds protesteerde."
  },
  {
    q: "Wat is 'jus cogens'?",
    options: [
      "Recht dat alleen voor rechters geldt.",
      "Dwingend recht waarvan niet mag worden afgeweken (zoals verbod op genocide).",
      "Recht dat nog in ontwikkeling is (soft law).",
      "Het recht van de sterkste staat."
    ],
    correct: 1,
    basis: "Jus cogens normen staan bovenaan de hiërarchie; verdragen die hiermee strijden zijn nietig (Art. 53 WVV)."
  },
  {
    q: "Wie is volgens Art. 7 WVV bevoegd een verdrag te sluiten zonder volmacht?",
    options: [
      "Iedere ambtenaar van het Ministerie van Buitenlandse Zaken.",
      "Het Staatshoofd, de Regeringsleider en de Minister van Buitenlandse Zaken.",
      "De ambassadeur voor ieder verdrag ter wereld.",
      "De voorzitter van de Tweede Kamer."
    ],
    correct: 1,
    basis: "De 'Big Three' worden geacht hun staat te vertegenwoordigen zonder dat zij een aparte volmacht hoeven te tonen."
  },
  {
    q: "Wat is het rechtsgevolg van het ondertekenen van een verdrag (als bekrachtiging nog moet volgen)?",
    options: [
      "De staat is direct volledig gebonden aan alle artikelen.",
      "De staat moet zich onthouden van handelingen die het voorwerp en doel van het verdrag ontnemen.",
      "De staat mag het verdrag direct wijzigen.",
      "Ondertekening heeft geen enkel juridisch effect."
    ],
    correct: 1,
    basis: "Art. 18 WVV verplicht staten om tussen ondertekening en bekrachtiging het verdrag niet te ondermijnen."
  },

  // WEEK 4: GESCHILLENBESLECHTING
  {
    q: "Wat is het verschil tussen 'goede diensten' en 'bemiddeling'?",
    options: [
      "Bij bemiddeling stelt de derde partij zelf ook oplossingen voor.",
      "Goede diensten zijn alleen voor de VN bedoeld.",
      "Bemiddeling is juridisch bindend, goede diensten niet.",
      "Er is technisch geen enkel verschil."
    ],
    correct: 0,
    basis: "Bij goede diensten faciliteert de derde alleen de communicatie; een bemiddelaar mengt zich inhoudelijk in het gesprek."
  },
  {
    q: "Wat is een 'represaille' (tegenmaatregel) in het IPR?",
    options: [
      "Een onvriendelijke maar legale handeling.",
      "Een op zichzelf onrechtmatige handeling die gerechtvaardigd wordt als reactie op een eerdere schending.",
      "Het gebruik van militair geweld tegen een agressor.",
      "Een sanctie opgelegd door de Wereldbank."
    ],
    correct: 1,
    basis: "Represailles (countermeasures) zijn bedoeld om een andere staat te dwingen weer aan zijn verplichtingen te voldoen."
  },
  {
    q: "Heeft een particulier toegang tot de contentieuze procedure van het IGH?",
    options: [
      "Ja, bij mensenrechtenschendingen.",
      "Nee, alleen staten hebben toegang (Art. 34 Statuut).",
      "Alleen als de staat van nationaliteit toestemming geeft.",
      "Alleen als hij werkt voor de Verenigde Naties."
    ],
    correct: 1,
    basis: "Het IGH is een hof voor staten. Particulieren moeten naar andere hoven zoals het EHRM."
  },
  {
    q: "Wat houdt 'forum prorogatum' in?",
    options: [
      "De rechtsmacht van het hof vervalt na 10 jaar.",
      "Instemming met rechtsmacht door een staat nádat de zaak al is aangebracht.",
      "De verplichting om eerst bij een nationale rechter te procederen.",
      "Het recht om een rechter te wraken."
    ],
    correct: 1,
    basis: "Zelfs als een staat de rechtsmacht niet vooraf erkende, kan hij deze accepteren door inhoudelijk op de zaak in te gaan."
  },

  // WEEK 5: AANSPRAKELIJKHEID
  {
    q: "Wanneer is een handeling van een staatsorgaan toerekenbaar aan de staat volgens de ILCA?",
    options: [
      "Alleen als de handeling binnen de officiële bevoegdheden viel.",
      "Altijd, ook als het orgaan zijn bevoegdheden overschreed (ultra vires).",
      "Alleen als het Staatshoofd persoonlijk opdracht gaf.",
      "Alleen als het leger erbij betrokken was."
    ],
    correct: 1,
    basis: "Art. 7 ILCA stelt dat ultra vires handelingen toerekenbaar zijn, zolang het orgaan in die hoedanigheid handelde."
  },
  {
    q: "Welk toerekeningscriterium hanteerde het IGH in de Nicaragua-zaak voor rebellengroepen?",
    options: [
      "Overall control.",
      "Effective control.",
      "Financial dependency.",
      "Inspirational leadership."
    ],
    correct: 1,
    basis: "Financiering en training is niet genoeg; de staat moet 'effective control' hebben over de specifieke operatie."
  },
  {
    q: "Wat is 'restitutie' in het kader van rechtsherstel?",
    options: [
      "Het betalen van een schadevergoeding.",
      "Het herstellen van de situatie zoals die was vóór de onrechtmatige daad.",
      "Een officiële spijtbetuiging.",
      "Het vervolgen van de verantwoordelijke soldaten."
    ],
    correct: 1,
    basis: "Restitutie is de primaire vorm van herstel. Pas als dat niet kan, volgt schadevergoeding (compensation)."
  },
  {
    q: "Wat is een 'erga omnes' verplichting?",
    options: [
      "Een verplichting die alleen voor de P5 geldt.",
      "Een verplichting tegenover de internationale gemeenschap als geheel.",
      "Een verplichting om belasting te betalen aan de VN.",
      "Een verplichting die voortvloeit uit een bilateraal verdrag."
    ],
    correct: 1,
    basis: "Bij schending van erga omnes normen (zoals verbod op slavernij) mag elke staat de daderstaat aanspreken (Barcelona Traction)."
  },

  // WEEK 6: RECHTSMACHT & IMMUNITEIT
  {
    q: "Wat houdt het 'objectieve territorialiteitsbeginsel' in?",
    options: [
      "Rechtsmacht op basis van de nationaliteit van de dader.",
      "Rechtsmacht over feiten die buiten het territorium zijn begonnen maar effect hebben binnen het territorium.",
      "Het recht om overal ter wereld mensen aan te houden.",
      "Rechtsmacht over schepen op volle zee."
    ],
    correct: 1,
    basis: "Denk aan een kogel die over de grens wordt geschoten: de staat waar de kogel landt heeft objectieve territoriale rechtsmacht."
  },
  {
    q: "Wanneer geniet een Minister van Buitenlandse Zaken persoonlijke immuniteit (ratione personae)?",
    options: [
      "Alleen tijdens officiële staatsbezoeken.",
      "Gedurende de gehele ambtstermijn voor alle handelingen (privé en officieel).",
      "Nooit, alleen het Staatshoofd geniet dit.",
      "Alleen voor officiële ambtshandelingen."
    ],
    correct: 1,
    basis: "De Arrest Warrant-zaak bevestigt dat de 'Big Three' volledige immuniteit hebben zolang zij in functie zijn."
  },
  {
    q: "Wat gebeurt er met de immuniteit van een gezagsdrager na afloop van zijn ambt?",
    options: [
      "Alle immuniteit vervalt direct.",
      "Persoonlijke immuniteit vervalt, maar functionele immuniteit voor officiële daden blijft bestaan.",
      "Hij blijft voor de rest van zijn leven volledig immuun.",
      "De immuniteit wordt omgezet in diplomatieke onschendbaarheid."
    ],
    correct: 1,
    basis: "Men kan na het ambt nog wel vervolgd worden voor privédaden van vroeger, maar niet voor officiële staatstaken."
  },
  {
    q: "Mag de diplomatieke tas (diplomatic bag) geopend worden door de douane?",
    options: [
      "Ja, als er een vermoeden van drugs is.",
      "Nee, de tas mag nooit worden geopend of vastgehouden (Art. 27 CDV).",
      "Alleen met toestemming van de ambassadeur.",
      "Alleen door honden, niet door mensen."
    ],
    correct: 1,
    basis: "De onschendbaarheid van de tas is absoluut in het CDV om vrije communicatie te waarborgen."
  },
  {
    q: "Wat is de maximale breedte van de territoriale zee?",
    options: [
      "24 zeemijl.",
      "12 zeemijl.",
      "200 zeemijl.",
      "Onbeperkt, tot aan de EEZ."
    ],
    correct: 1,
    basis: "Artikel 3 van het VN-Zeeverdrag stelt de grens op maximaal 12 zeemijl vanaf de basislijn."
  },
  {
    q: "Wat mag een kuststaat in de 'Aansluitende Zone' (Contiguous Zone)?",
    options: [
      "Vissen en olie winnen.",
      "Optreden tegen inbreuken op douane-, fiscale, immigratie- en volksgezondheidswetten.",
      "De onschuldige doorvaart blokkeren.",
      "Buitenlandse oorlogsschepen in beslag nemen."
    ],
    correct: 1,
    basis: "De aansluitende zone (tot 24 mijl) is een bufferzone voor handhaving van specifieke administratieve wetten."
  },
  {
    q: "Wie heeft de rechtsmacht op de 'Volle Zee'?",
    options: [
      "De Verenigde Naties.",
      "De dichtstbijzijnde kuststaat.",
      "De vlaggenstaat (staat van registratie van het schip).",
      "Geen enkele staat (anarchie)."
    ],
    correct: 2,
    basis: "Op de volle zee geldt het principe van de vlaggenstaat: het recht van het land waar het schip geregistreerd staat."
  },
  {
    q: "Wat is de breedte van de Exclusieve Economische Zone (EEZ)?",
    options: [
      "12 zeemijl.",
      "24 zeemijl.",
      "200 zeemijl.",
      "Tot aan het einde van de oceaan."
    ],
    correct: 2,
    basis: "In de EEZ (tot 200 mijl) heeft de kuststaat soevereine rechten over de grondstoffen (visserij, olie, gas)."
  },
  {
    q: "Wat houdt 'onschuldige doorvaart' in?",
    options: [
      "Varen zonder wapens aan boord.",
      "Doorvaart die de vrede, orde of veiligheid van de kuststaat niet schaadt.",
      "Varen met de vlag van de VN.",
      "Varen zonder te stoppen voor de douane."
    ],
    correct: 1,
    basis: "Schepen mogen door de territoriale zee van een ander varen, mits ze geen verboden handelingen (zoals vissen of spioneren) verrichten."
  },
  {
    q: "Mogen onderzeeboten in de territoriale zee onder water varen?",
    options: [
      "Ja, dat is hun functie.",
      "Nee, zij moeten aan de oppervlakte varen en hun vlag tonen (Art. 20 VN-Zeeverdrag).",
      "Alleen als ze geen torpedo's bij zich hebben.",
      "Alleen in de EEZ."
    ],
    correct: 1,
    basis: "Om 'onschuldig' te zijn, moeten onderzeeboten zichtbaar zijn voor de kuststaat."
  },
  {
    q: "Wat is 'The Area' in het zeerecht?",
    options: [
      "De havens van een staat.",
      "De diepzeebodem buiten nationale jurisdictie.",
      "Het luchtruim boven de EEZ.",
      "Een gebied waar piraterij verboden is."
    ],
    correct: 1,
    basis: "The Area is 'common heritage of mankind' en wordt beheerd door een speciale autoriteit."
  },
  {
    q: "Wat is het 'beschermingsbeginsel' bij jurisdictie?",
    options: [
      "Het beschermen van diplomaten.",
      "Rechtsmacht over feiten buiten het territorium die vitale belangen van de staat schaden (zoals valsmunterij).",
      "Het recht om een buurland binnen te vallen.",
      "De plicht om vluchtelingen op te vangen."
    ],
    correct: 1,
    basis: "Dit beginsel staat los van de nationaliteit van de dader en richt zich op de veiligheid van de staat zelf."
  },
  {
    q: "Wat is 'universele rechtsmacht'?",
    options: [
      "Rechtsmacht van de VS over de hele wereld.",
      "Rechtsmacht van elke staat over zeer ernstige misdrijven zoals genocide, ongeacht waar ze gepleegd zijn.",
      "Het recht van de VN om overal belasting te heffen.",
      "De rechtsmacht van het IGH."
    ],
    correct: 1,
    basis: "Misdrijven als piraterij en genocide schaden de hele wereldorde, daarom mag elke staat de dader vervolgen."
  },
  {
    q: "Mag een staat geweld gebruiken om een staatshoofd in het buitenland te arresteren?",
    options: [
      "Ja, als hij een oorlogsmisdadiger is.",
      "Nee, dat schendt de soevereiniteit en het geweldsverbod (Art. 2 lid 4 VN-Handvest).",
      "Alleen als de VN-Veiligheidsraad geen bezwaar maakt.",
      "Alleen als er geen onschuldige burgers bij betrokken zijn."
    ],
    correct: 1,
    basis: "Handhaving in het buitenland is in beginsel verboden zonder toestemming van die staat."
  },
  {
    q: "Wat houdt het 'pacta sunt servanda' beginsel in?",
    options: [
      "Staten zijn vrij om verdragen op te zeggen wanneer ze willen.",
      "Verdragen moeten te goeder trouw worden nagekomen door de partijen.",
      "Oude verdragen vervallen automatisch na 50 jaar.",
      "Alleen geschreven verdragen zijn geldig."
    ],
    correct: 1,
    basis: "Dit is de hoeksteen van het verdragenrecht (Art. 26 WVV)."
  },
  {
    q: "Wat is een 'compromis'?",
    options: [
      "Een verdrag waarin beide staten een beetje toegeven.",
      "Een specifieke overeenkomst om een béstaand geschil voor te leggen aan een tribunaal.",
      "Een clausule in een verdrag over toekomstige ruzies.",
      "Een politieke deal tussen de P5."
    ],
    correct: 1,
    basis: "Een compromis wordt gesloten *nadat* het conflict is ontstaan om de rechter bevoegd te maken."
  },
  {
    q: "Heeft het IGH een hiërarchische verhouding tot nationale rechters?",
    options: [
      "Ja, het IGH is de hoogste rechterlijke instantie voor burgers.",
      "Nee, de internationale en nationale rechtsorde zijn formeel gescheiden.",
      "Alleen in EU-lidstaten.",
      "Alleen als het gaat om strafrecht."
    ],
    correct: 1,
    basis: "Er is geen 'hoger beroep' mogelijk van een nationale rechter naar het IGH."
  },
  {
    q: "Wat is de status van Antarctica volgens het Verdrag van 1959?",
    options: [
      "Het is eigendom van de Verenigde Naties.",
      "Territoriale claims zijn bevroren; het gebied is voor vreedzaam wetenschappelijk gebruik.",
      "Het is verdeeld tussen 7 staten.",
      "Het is een nieuwe staat geworden."
    ],
    correct: 1,
    basis: "Het verdrag verbiedt militaire activiteiten en nieuwe claims op Antarctica."
  },
  {
    q: "Welk beginsel verbiedt het IPR om te interveniëren in de interne zaken van een andere staat?",
    options: [
      "Het gelijkheidsbeginsel.",
      "Het non-interventiebeginsel.",
      "Het legaliteitsbeginsel.",
      "Het specialiteitsbeginsel."
    ],
    correct: 1,
    basis: "Staten mogen geen druk uitoefenen (coercion) op de politieke keuzes van een andere soevereine staat."
  }
];

const IPRQuiz = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = IPR_QUIZ_DATA[currentIdx];

  const handleOptionClick = (idx) => {
    if (isAnswered) return;
    setSelected(idx);
    setIsAnswered(true);
    if (idx === currentQuestion.correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < IPR_QUIZ_DATA.length) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  if (!currentQuestion && !showResults) return <div className="text-[#1A365D]">Laden...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 font-sans antialiased">
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200"
          >
            {/* VRAAG HEADER - GEFORCEERD WIT */}
            <div 
              className="p-8 md:p-12 relative" 
              style={{ backgroundColor: '#1A365D', zIndex: 10 }}
            >
              <div className="flex justify-between items-center mb-6">
                <span className="font-black uppercase tracking-[0.2em] text-[10px]" style={{ color: '#C5A059' }}>
                  IPR Masterclass Challenge
                </span>
                <span className="text-white/40 text-[10px] font-black">
                  Vraag {currentIdx + 1} / {IPR_QUIZ_DATA.length}
                </span>
              </div>
              
              <div className="relative">
                <h2 
                  className="text-2xl md:text-3xl font-serif italic leading-tight"
                  style={{ 
                    color: '#FFFFFF', 
                    fontWeight: '600',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  "{currentQuestion.q}"
                </h2>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="h-1.5 w-full bg-slate-100 relative">
              <motion.div 
                className="h-full bg-[#C5A059] absolute top-0 left-0"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIdx + 1) / IPR_QUIZ_DATA.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 50 }}
              />
            </div>

            {/* OPTIES */}
            <div className="p-6 md:p-10 space-y-3">
              {currentQuestion.options.map((option, i) => {
                let style = "border-slate-200 hover:border-[#1A365D] hover:bg-slate-50 text-[#1A365D]";
                if (isAnswered) {
                  if (i === currentQuestion.correct) style = "bg-emerald-50 border-emerald-500 text-emerald-900 z-10 scale-[1.02]";
                  else if (i === selected) style = "bg-rose-50 border-rose-500 text-rose-900 opacity-80";
                  else style = "opacity-30 border-slate-100 grayscale";
                }

                return (
                  <button
                    key={i}
                    disabled={isAnswered}
                    onClick={() => handleOptionClick(i)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 flex items-start gap-5 group ${style}`}
                  >
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-black text-xs transition-colors
                      ${isAnswered && i === currentQuestion.correct ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 text-[#C5A059] group-hover:border-[#C5A059]'}
                    `}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="font-bold text-base md:text-lg leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* FEEDBACK & VOLGENDE KNOP */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-6 md:px-10 pb-10"
                >
                  <div className="bg-slate-50 p-6 rounded-2xl border-l-8 border-[#C5A059] mb-8 shadow-inner">
                    <span className="text-[10px] font-black uppercase text-[#C5A059] block mb-3 tracking-widest">
                      Juridische Analyse
                    </span>
                    <p className="text-slate-700 italic text-sm md:text-base leading-relaxed">
                      {currentQuestion.basis}
                    </p>
                  </div>
                  <button 
                    onClick={handleNext}
                    className="w-full bg-[#1A365D] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#2c4e80] transition-all shadow-xl hover:translate-y-[-2px] active:translate-y-[1px]"
                  >
                    {currentIdx + 1 === IPR_QUIZ_DATA.length ? "Bekijk Eindscore" : "Volgende Vraag →"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-slate-200"
          >
            <h2 className="text-4xl font-serif italic text-[#1A365D] mb-4">Resultaat behaald</h2>
            <div className="text-9xl font-black text-[#C5A059] mb-6 tracking-tighter">
              {Math.round((score / IPR_QUIZ_DATA.length) * 100)}%
            </div>
            <p className="text-slate-500 mb-10 text-xl max-w-sm mx-auto">
              Je hebt <strong>{score}</strong> van de <strong>{IPR_QUIZ_DATA.length}</strong> casusposities correct geanalyseerd.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#1A365D] text-white px-16 py-6 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl"
            >
              Opnieuw Starten
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IPRQuiz;