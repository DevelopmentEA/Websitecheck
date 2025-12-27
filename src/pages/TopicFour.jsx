import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  // WEEK 1: RECHTSORDE
  {
    question: "In een puur dualistisch stelsel: wat is de vereiste stap voordat een burger een beroep kan doen op een internationaal verdrag?",
    options: ["Geen, het verdrag is automatisch geldig", "De wetgever moet de verdragsinhoud omzetten in nationaal recht", "De rechter moet toetsen aan de Grondwet", "Het verdrag moet simpelweg gepubliceerd zijn in de Staatscourant"],
    correct: 1
  },
  {
    question: "Wat is de kern van de 'gematigd monistische' benadering van Nederland volgens art. 94 Gw?",
    options: ["Alle verdragen gaan voor op de Grondwet", "Alleen eenieder verbindende verdragsbepalingen hebben voorrang op nationale wetten", "Internationaal recht is altijd ondergeschikt aan de Grondwet", "De rechter mag wetten in formele zin nooit toetsen aan verdragen"],
    correct: 1
  },
  {
    question: "Welke historische gebeurtenis wordt gezien als het fundament voor 'soevereine gelijkheid' tussen eenheden?",
    options: ["De oprichting van de VN in 1945", "Het Verdrag van Versailles", "De Vrede van Westfalen in 1648", "De ontdekking van Amerika"],
    correct: 2
  },
  {
    question: "Wat hield het 'Spoorwegstaking-arrest' in voor de Nederlandse rechtsorde?",
    options: ["Het verbood stakingen in de publieke sector", "Het definieerde wanneer een verdragsbepaling 'eenieder verbindend' is", "Het stelde dat het EVRM geen directe werking heeft", "Het gaf de koning de macht om verdragen te ontbinden"],
    correct: 1
  },
  {
    question: "Waarom is de term 'volkenrecht' tegenwoordig minder accuraat dan 'internationaal publiekrecht'?",
    options: ["Omdat volkeren geen rechten meer hebben", "Omdat het recht zich nu ook richt op organisaties en individuen, niet alleen staten", "Omdat alleen de VN recht mag maken", "Omdat staten niet langer soeverein zijn"],
    correct: 1
  },
  {
    question: "Wat gebeurt er in Nederland als een wet in strijd is met een verdragsbepaling die NIET rechtstreeks werkend is?",
    options: ["De wet moet buiten toepassing worden gelaten", "De verdragsbepaling krijgt alsnog voorrang", "De wet blijft geldig en de rechter past verdragsconforme interpretatie toe waar mogelijk", "De staat wordt direct ontbonden"],
    correct: 2
  },
  {
    question: "Welk concept verklaart dat staten vreedzaam naast elkaar bestaan zonder per se samen te werken?",
    options: ["Recht van integratie", "Recht van co-existentie", "Supranationalisme", "Monisme"],
    correct: 1
  },
  {
    question: "Welke invloed heeft de EU op de soevereiniteit van lidstaten?",
    options: ["Geen, lidstaten blijven volledig onafhankelijk", "Lidstaten dragen bevoegdheden over (integratie), maar behouden het recht om uit te treden", "De EU schaft nationale grondwetten af", "Lidstaten verliezen hun rechtssubjectiviteit"],
    correct: 1
  },

  // WEEK 2: SUBJECTEN
  {
    question: "Welke entiteit bezit 'volledige' rechtssubjectiviteit in de internationale rechtsorde?",
    options: ["De Verenigde Naties", "Multinationale ondernemingen", "Staten", "Het Rode Kruis"],
    correct: 2
  },
  {
    question: "Volgens het Montevideo-verdrag is voor staatvorming vereist:",
    options: ["Erkenning door de P5 van de Veiligheidsraad", "Een effectieve regering en een gedefinieerd grondgebied", "Lidmaatschap van de VN", "Een democratisch gekozen parlement"],
    correct: 1
  },
  {
    question: "Wat is de juridische betekenis van 'erkenning' van een nieuwe staat volgens de heersende leer?",
    options: ["Constitutief: zonder erkenning bestaat de staat niet", "Declaratoir: het bevestigt slechts een feitelijke situatie", "Het is een verplichting voor alle andere staten", "Het maakt de staat automatisch lid van de EU"],
    correct: 1
  },
  {
    question: "Wat is het verschil tussen IGO's en NGO's qua rechtssubjectiviteit?",
    options: ["NGO's zijn altijd subjecten, IGO's nooit", "IGO's worden door staten opgericht en hebben geattribueerde macht; NGO's zijn privaat", "IGO's hebben geen personeel, NGO's wel", "Er is geen verschil"],
    correct: 1
  },
  {
    question: "Wat werd besloten in het 'Reparation for Injuries' advies van het IGH?",
    options: ["Dat staten nooit aansprakelijk zijn voor VN-medewerkers", "Dat de VN objectieve rechtspersoonlijkheid bezit om claims in te dienen", "Dat alleen de VS de VN mag financieren", "Dat witte helmen verboden zijn"],
    correct: 1
  },
  {
    question: "Wanneer spreken we van een 'de facto-regime'?",
    options: ["Wanneer een groep effectief gezag uitoefent over een gebied zonder officiële staatsstatus", "Wanneer een staat failliet is", "Wanneer een multinational een land overneemt", "Wanneer de VN een land tijdelijk bestuurt"],
    correct: 0
  },
  {
    question: "Welke status heeft het Koninkrijk der Nederlanden in het internationaal recht ten opzichte van de afzonderlijke landen (Aruba, Curaçao etc.)?",
    options: ["Elk eiland is een aparte staat", "Alleen het Koninkrijk als geheel is het internationale rechtssubject", "Nederland is de baas over de andere subjecten", "De landen hebben elk een permanente zetel in de VN"],
    correct: 1
  },
  {
    question: "Kan een individu direct rechten ontlenen aan het internationaal recht?",
    options: ["Nee, alleen via de staat", "Ja, met name via mensenrechtenverdragen zoals het EVRM", "Alleen als de individu een diplomaat is", "Ja, maar alleen in oorlogstijd"],
    correct: 1
  },

  // WEEK 3: BRONNEN
  {
    question: "Welke bron staat niet expliciet in Artikel 38 van het IGH-statuut, maar is wel algemeen aanvaard?",
    options: ["Verdragen", "Besluiten van internationale organisaties", "Gewoonterecht", "Algemene rechtsbeginselen"],
    correct: 1
  },
  {
    question: "Wat zijn de twee cumulatieve vereisten voor het ontstaan van gewoonterecht?",
    options: ["Opinio juris en een geschreven tekst", "Statenpraktijk en opinio juris", "Een besluit van de VN en 10 jaar tijd", "Unanimiteit in de Algemene Vergadering"],
    correct: 1
  },
  {
    question: "Wat is een 'persistent objector'?",
    options: ["Een staat die altijd tegen elk verdrag stemt", "Een staat die zich tijdens de vorming van een gewoonterechtsregel consequent heeft verzet", "Een staat die de Veiligheidsraad blokkeert", "Een rebel die de regering niet erkent"],
    correct: 1
  },
  {
    question: "Wat is de status van 'jus cogens' normen?",
    options: ["Het zijn regels waarvan staten per verdrag mogen afwijken", "Het zijn dwingende normen waarvan geen afwijking is toegestaan", "Het zijn alleen regels voor de zee", "Het zijn aanbevelingen van de Algemene Vergadering"],
    correct: 1
  },
  {
    question: "Wanneer is het 'Weens Verdragenverdrag' (WVV) van toepassing?",
    options: ["Op alle mondelinge en schriftelijke afspraken", "Op schriftelijke verdragen tussen staten", "Alleen op vredesverdragen", "Op contracten tussen multinationals"],
    correct: 1
  },
  {
    question: "Wat houdt het principe 'pacta sunt servanda' in?",
    options: ["Staten mogen verdragen opzeggen wanneer ze willen", "Verdragen moeten te goeder trouw worden nageleefd", "Nieuwe staten zijn niet gebonden aan oude verdragen", "De wet gaat voor het verdrag"],
    correct: 1
  },
  {
    question: "Wat is een 'voorbehoud' bij een verdrag?",
    options: ["Een verklaring om de juridische werking van bepaalde bepalingen uit te sluiten of te wijzigen", "Een pauze tijdens de onderhandelingen", "Een geheime afspraak tussen twee landen", "De bekrachtiging door het parlement"],
    correct: 0
  },
  {
    question: "Hoe wordt gewoonterecht bewezen als er geen fysieke handelingen zijn?",
    options: ["Dat kan niet", "Door te kijken naar onthoudingen ondersteund door opinio juris", "Door de paus te raadplegen", "Door naar nationale kranten te kijken"],
    correct: 1
  },
  {
    question: "Welke regel geldt bij een conflict tussen twee verdragen over hetzelfde onderwerp (zonder specifieke bepaling)?",
    options: ["Het oudste verdrag gaat voor", "Het nieuwere verdrag gaat voor (lex posterior)", "Beide verdragen vervallen", "De VN beslist welk verdrag geldt"],
    correct: 1
  },

  // WEEK 4: GESCHILLEN
  {
    question: "Wat is het verschil tussen een 'retorsie' en een 'represaille'?",
    options: ["Retorsie is onrechtmatig, represaille is rechtmatig", "Retorsie is een onvriendelijke maar rechtmatige daad; represaille is een gerechtvaardigde onrechtmatige daad", "Er is geen verschil", "Retorsie geldt alleen voor oorlog"],
    correct: 1
  },
  {
    question: "Op welke rechtsgrondslag kan het IGH rechtsmacht krijgen voor een geschil?",
    options: ["Automatisch bij elk conflict tussen staten", "Alleen via instemming van de betrokken staten", "Door een bevel van de Amerikaanse president", "Door een verzoek van een burger"],
    correct: 1
  },
  {
    question: "Wat is een 'facultatieve verklaring' (art. 36 lid 2 IGH-statuut)?",
    options: ["Een verklaring dat een staat nooit voor het hof verschijnt", "Een voorafgaande aanvaarding van de rechtsmacht van het IGH voor toekomstige geschillen", "Een lijst met rechters die een staat niet leuk vindt", "Een weigering om contributie te betalen"],
    correct: 1
  },
  {
    question: "Zijn adviezen (advisory opinions) van het IGH bindend voor staten?",
    options: ["Ja, net als vonnissen", "Nee, ze zijn niet-bindend maar wel gezaghebbend", "Alleen als de Veiligheidsraad dat zegt", "Ja, maar alleen voor de verliezende partij"],
    correct: 1
  },
  {
    question: "Wat is het verschil tussen arbitrage en rechtspraak bij het IGH?",
    options: ["Arbitrage is gratis, het IGH is duur", "Bij arbitrage kiezen partijen zelf de rechters en procedure ad hoc", "Het IGH doet geen bindende uitspraken, arbiters wel", "Arbitrage is alleen voor bedrijven"],
    correct: 1
  },
  {
    question: "Wat is 'forum prorogatum'?",
    options: ["Rechtsmacht die ontstaat doordat een staat verschijnt en de procedure niet betwist", "Een verbod op het hof", "Een verlenging van de ambtstermijn van rechters", "Een verplaatsing van het hof naar New York"],
    correct: 0
  },
  {
    question: "Welke methode van diplomatieke geschillenbeslechting houdt in dat een derde partij zelf OPLOSSINGEN voorstelt?",
    options: ["Goede diensten", "Onderhandelingen", "Bemiddeling", "Feitenonderzoek"],
    correct: 2
  },
  {
    question: "Wanneer mag een staat 'tegenmaatregelen' nemen?",
    options: ["Wanneer hij zin heeft in wraak", "Als reactie op een eerdere onrechtmatige daad, om de andere staat tot naleving te dwingen", "Alleen als de VN toestemming geeft", "Nooit, tegenmaatregelen zijn verboden"],
    correct: 1
  },

  // WEEK 5: AANSPRAKELIJKHEID
  {
    question: "Wat zijn de twee voorwaarden voor een 'internationale onrechtmatige daad' van een staat?",
    options: ["Schuld en schade", "Schending van een verplichting en toerekenbaarheid aan de staat", "Opzet en een dodelijk slachtoffer", "Een bevel van de generaal en uitvoering door soldaten"],
    correct: 1
  },
  {
    question: "Wordt een 'ultra vires' handeling van een politieagent (buiten zijn boekje) toegerekend aan de staat?",
    options: ["Nee, de agent handelde prive", "Ja, zolang hij handelde in zijn officiële hoedanigheid", "Alleen als de minister ervan wist", "Alleen als er media-aandacht is"],
    correct: 1
  },
  {
    question: "Wat is de standaard voor toerekening van daden van particulieren (zoals rebellen) volgens de Nicaragua-zaak?",
    options: ["Overall control", "Effective control", "Financiële steun is genoeg", "Geen enkele controle is vereist"],
    correct: 1
  },
  {
    question: "Welke omstandigheid neemt de onrechtmatigheid weg bij een onvermijdelijke externe gebeurtenis?",
    options: ["Noodtoestand", "Overmacht (force majeure)", "Zelfverdediging", "Toestemming"],
    correct: 1
  },
  {
    question: "Wat is 'restitutie' in het aansprakelijkheidsrecht?",
    options: ["Het betalen van een boete", "Het herstellen van de situatie zoals die was voor de onrechtmatige daad", "Een spijtbetuiging via de krant", "Het ontslaan van de verantwoordelijke ambtenaar"],
    correct: 1
  },
  {
    question: "Wanneer kan een staat 'diplomatieke bescherming' uitoefenen voor een burger?",
    options: ["Altijd", "Als de burger de nationale nationaliteit heeft en nationale rechtsmiddelen heeft uitgeput", "Alleen als de burger rijk is", "Alleen in vakantietijd"],
    correct: 1
  },
  {
    question: "Kan een staat aansprakelijk zijn voor een 'nalaten' (omissie)?",
    options: ["Nee, alleen voor actieve handelingen", "Ja, als er een zorgplicht (due diligence) werd geschonden", "Alleen in het milieurecht", "Alleen als de VN dat besluit"],
    correct: 1
  },
  {
    question: "Wat is het doel van individuele aansprakelijkheid in het internationaal strafrecht?",
    options: ["De staat failliet laten gaan", "Bestraffing van de feitelijke dader naast/in plaats van de staat", "Het EVRM afschaffen", "Geld inzamelen voor de VN"],
    correct: 1
  },
  {
    question: "Wat is 'genoegdoening' (satisfaction)?",
    options: ["Geldelijke schadevergoeding", "Een niet-materiële vorm van herstel, zoals excuses of erkenning van de fout", "Het teruggeven van land", "Het bouwen van een monument"],
    correct: 1
  },

  // WEEK 6: RECHTSMACHT / IMMUNITEIT / ZEE
  {
    question: "Welk beginsel geeft een staat rechtsmacht over misdrijven gepleegd tegen zijn eigen onderdanen in het buitenland?",
    options: ["Actief nationaliteitsbeginsel", "Passief nationaliteitsbeginsel", "Subjectieve territorialiteit", "Beschermingsbeginsel"],
    correct: 1
  },
  {
    question: "Wat is 'universele rechtsmacht'?",
    options: ["Rechtsmacht over de hele ruimte", "Rechtsmacht van elke staat over zeer ernstige misdrijven (zoals piraterij), ongeacht de locatie of dader", "Rechtsmacht van de VN", "Rechtsmacht over alle verdragen"],
    correct: 1
  },
  {
    question: "Wat is het verschil tussen persoonlijke en functionele immuniteit?",
    options: ["Er is geen verschil", "Persoonlijke immuniteit geldt voor alle daden tijdens het ambt; functionele alleen voor officiële daden", "Functionele immuniteit vervalt direct na het ambt", "Persoonlijke immuniteit geldt voor alle burgers"],
    correct: 1
  },
  {
    question: "Geniet een voormalig Minister van Buitenlandse Zaken immuniteit voor privé-moorden gepleegd TIJDENS zijn ambt?",
    options: ["Ja, persoonlijke immuniteit blijft altijd", "Nee, na zijn ambt vervalt persoonlijke immuniteit; privé-daden worden niet beschermd door functionele immuniteit", "Ja, ministers zijn altijd immuun", "Alleen als hij in Nederland woont"],
    correct: 1
  },
  {
    question: "Tot hoeveel zeemijl strekt de 'territoriale zee' zich maximaal uit?",
    options: ["200 zeemijl", "24 zeemijl", "12 zeemijl", "Staten mogen dit zelf kiezen"],
    correct: 2
  },
  {
    question: "Wat mag een kuststaat in de Exclusieve Economische Zone (EEZ)?",
    options: ["De scheepvaart volledig verbieden", "Delfstoffen winnen en vissen reguleren", "Andere staten belasten voor doorvaart", "Buitenlandse oorlogsschepen tot zinken brengen"],
    correct: 1
  },
  {
    question: "Wie heeft rechtsmacht over een schip op de 'Volle Zee'?",
    options: ["De dichtstbijzijnde kuststaat", "De vlaggenstaat", "De Verenigde Naties", "Niemand, het is wetteloos gebied"],
    correct: 1
  },
  {
    question: "Wat is 'onschuldige doorvaart'?",
    options: ["Vliegen over een land zonder te landen", "Varen door de territoriale zee zonder de vrede of veiligheid van de kuststaat te schaden", "Vissen zonder vergunning", "Het smokkelen van goederen"],
    correct: 1
  }
];

const IPRQuiz = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (idx) => {
    if (isAnswered) return;
    setSelected(idx);
    setIsAnswered(true);
    if (idx === questions[currentIdx].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setShowResults(false);
    setSelected(null);
    setIsAnswered(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8">
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="quiz-card"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-black uppercase tracking-widest text-[#C5A059]">
                Vraag {currentIdx + 1} / {questions.length}
              </span>
              <span className="text-xs font-bold text-slate-400 italic font-serif">
                Judica Knowledge Base
              </span>
            </div>

            <h2 className="mb-8 leading-tight">{questions[currentIdx].question}</h2>

            <div className="space-y-3">
              {questions[currentIdx].options.map((opt, i) => {
                let statusClass = "border-soft hover:border-[#1A365D]";
                if (isAnswered) {
                  if (i === questions[currentIdx].correct) statusClass = "bg-green-100 border-green-500 text-green-800";
                  else if (i === selected) statusClass = "bg-red-100 border-red-500 text-red-800";
                  else statusClass = "opacity-50 border-soft";
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleOptionClick(i)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 ${statusClass}`}
                  >
                    <span className="font-bold opacity-30">{String.fromCharCode(65 + i)}.</span>
                    <span className="text-sm md:text-base">{opt}</span>
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="mt-8 flex justify-end"
              >
                <button 
                  onClick={nextQuestion}
                  className="bg-[#1A365D] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2c4e80] transition-colors"
                >
                  {currentIdx + 1 === questions.length ? "Bekijk Resultaat" : "Volgende Vraag →"}
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="quiz-card text-center"
          >
            <h1 className="text-[#C5A059] mb-4">Resultaten</h1>
            <div className="text-6xl font-bold text-[#1A365D] mb-4">{Math.round((score / questions.length) * 100)}%</div>
            <p className="prose-legal mb-8">
              Je hebt <strong>{score}</strong> van de <strong>{questions.length}</strong> vragen correct beantwoord.
              <br />
              {score > 40 ? "Uitmuntend! Je bent klaar voor het tentamen." : score > 25 ? "Voldoende, maar neem de details van week 5 en 6 nog eens door." : "Nog even flink studeren op de kernbegrippen!"}
            </p>
            <button 
              onClick={resetQuiz}
              className="border-2 border-[#1A365D] text-[#1A365D] px-10 py-4 rounded-full font-bold hover:bg-[#1A365D] hover:text-white transition-all"
            >
              Opnieuw Proberen
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IPRQuiz;