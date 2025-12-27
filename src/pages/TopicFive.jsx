import React from 'react';
import { motion } from 'framer-motion';

const questions = [
  // WEEK 1: RECHTSORDE
  { id: 1, q: "Een Nederlandse rechter moet toetsen of een nationale wet in strijd is met een verdrag. Welk grondwetsartikel verbiedt de rechter om te toetsen aan bepalingen die NIET rechtstreeks werkend zijn?", a: "Art. 94 Gw", r: "Art. 94 bepaalt dat wettelijke voorschriften buiten toepassing blijven als ze strijdig zijn met 'eenieder verbindende' (rechtstreeks werkende) bepalingen. Voor niet-rechtstreeks werkende bepalingen geldt dit primaat niet." },
  { id: 2, q: "Wat is het belangrijkste gevolg van het 'Spoorwegstaking-arrest' voor de toetsing door de rechter?", a: "De rechter bepaalt de rechtstreekse werking aan de hand van de inhoud en strekking van de bepaling.", r: "De Hoge Raad stelde vast dat een bepaling rechtstreeks werkend is als deze onvoorwaardelijk en voldoende nauwkeurig is om als objectief recht te functioneren." },
  { id: 3, q: "In een zuiver dualistisch stelsel heeft een burger geen rechten uit een verdrag zolang er geen 'omzetting' heeft plaatsgevonden. Wat is het risico voor de internationale gemeenschap in dit model?", a: "Staten kunnen hun internationale verplichtingen ontduiken door simpelweg geen nationale wetgeving aan te nemen.", r: "Omdat het verdrag intern geen gelding heeft zonder omzetting, kan de staat internationaal aansprakelijk zijn terwijl de burger nationaal machteloos is." },
  { id: 4, q: "Waarom wordt de Vrede van Westfalen (1648) gezien als de overgang van 'hiërarchie' naar 'co-existentie'?", a: "Het verving het gezag van de Kerk en het Keizerrijk door het principe van soevereine gelijkheid tussen staten.", r: "Voor 1648 was er een verticale orde (Paus/Keizer); na 1648 ontstond een horizontale orde van formeel gelijke staten." },
  { id: 5, q: "Wat houdt 'verdragsconforme interpretatie' in voor een rechter in een dualistisch land?", a: "De rechter legt nationaal recht zo uit dat het niet botst met internationale verplichtingen.", r: "Dit is een manier om internationaal recht 'indirect' door te laten werken zonder dat er sprake is van directe werking." },

  // WEEK 2: SUBJECTEN
  { id: 6, q: "Welke actor bezit 'beperkte' rechtssubjectiviteit en is afhankelijk van de functies die staten aan hen toekennen?", a: "Internationale Organisaties (IGO's)", r: "Krachtens het specialiteitsbeginsel hebben IGO's alleen bevoegdheden die nodig zijn om hun specifieke doelstellingen te behalen." },
  { id: 7, q: "Een entiteit voldoet aan de Montevideo-criteria maar wordt door geen enkele andere staat erkend. Is het juridisch gezien een staat?", a: "Ja, op basis van de declaratoire leer.", r: "De declaratoire leer stelt dat staatvorming een feitelijke kwestie is; erkenning is slechts een politieke bevestiging, geen voorwaarde." },
  { id: 8, q: "Waarom is 'effectieve controle' cruciaal voor de rechtssubjectiviteit van een de facto-regime?", a: "Omdat het internationaal recht feitelijke machtsuitoefening erkent als basis voor internationale verplichtingen.", r: "Als een regime feitelijk de bevolking bestuurt, moet het ook aansprakelijk gehouden kunnen worden voor bijvoorbeeld mensenrechtenschendingen." },
  { id: 9, q: "Wat is het verschil tussen interne en externe zelfbeschikking?", a: "Interne ziet op autonomie binnen een staat; externe op de stichting van een eigen, onafhankelijke staat.", r: "Externe zelfbeschikking is in het internationaal recht beperkt tot situaties van dekolonisatie of buitenlandse bezetting." },
  { id: 10, q: "Volgens het 'Reparation for Injuries' advies heeft de VN 'objectieve' rechtssubjectiviteit. Wat betekent dit voor niet-leden?", a: "Dat de VN ook claims kan indienen tegen staten die geen lid zijn van de organisatie.", r: "Het IGH oordeelde dat de VN door een grote meerderheid van staten is opgericht en daardoor een status heeft die tegenover iedereen (erga omnes) geldt." },

  // WEEK 3: BRONNEN
  { id: 11, q: "Welk element van gewoonterecht is subjectief en vereist dat staten handelen uit een gevoel van juridische plicht?", a: "Opinio juris sive necessitatis", r: "Zonder opinio juris is er sprake van een loutere gewoonte of 'usage', maar niet van bindend recht." },
  { id: 12, q: "Kan een staat gebonden zijn aan een gewoonterechtelijke regel waar hij het nooit mee eens is geweest?", a: "Ja, tenzij hij tijdens de vorming van de regel een 'persistent objector' was.", r: "Gewoonterecht is in principe universeel bindend, behalve voor staten die zich vanaf het begin consequent en expliciet hebben verzet." },
  { id: 13, q: "Een verdrag is in strijd met een 'jus cogens' norm. Wat is de sanctie volgens Art. 53 WVV?", a: "Het verdrag is van rechtswege nietig.", r: "Jus cogens zijn dwingende normen van algemeen internationaal recht waar geen enkele afwijking van is toegestaan." },
  { id: 14, q: "Wat is de functie van de preambule van een verdrag bij interpretatie?", a: "Het dient als context om het voorwerp en doel van het verdrag te bepalen (Art. 31 WVV).", r: "De preambule zelf schept geen rechten, maar is essentieel voor de teleologische (doelgerichte) uitleg van de artikelen." },
  { id: 15, q: "Waarom mag een staat zich niet beroepen op zijn nationale recht om het niet-nakomen van een verdrag te rechtvaardigen?", a: "Vanwege het principe van goede trouw en Art. 27 WVV.", r: "Internationaal recht prevaleert boven nationaal recht in de internationale rechtsorde; interne wetgeving is geen geldig excuus voor een schending." },

  // WEEK 4: GESCHILLENBESLECHTING
  { id: 16, q: "Wat is de juridische 'clou' van forum prorogatum?", a: "Instemming met rechtsmacht door te verschijnen in een zaak zonder bezwaar te maken.", r: "Rechtsmacht van het IGH is altijd gebaseerd op instemming; dit kan ook impliciet gebeuren na het starten van de procedure." },
  { id: 17, q: "In welke fase van een IGH-procedure kan het Hof 'voorlopige maatregelen' opleggen?", a: "In de fase waarin een onherstelbaar nadeel voor de rechten van een partij dreigt (Art. 41 Statuut).", r: "Deze maatregelen zijn bindend en bedoeld om de status quo te bevriezen zolang de bodemprocedure loopt." },
  { id: 18, q: "Wat is het verschil tussen bemiddeling en conciliatie?", a: "Conciliatie wordt gedaan door een commissie die een formeel (niet-bindend) rapport met oplossingen uitbrengt.", r: "Bemiddeling is minder formeel en meer gericht op het faciliteren van politieke onderhandelingen door een tussenpersoon." },
  { id: 19, q: "Waarom zijn tegenmaatregelen (represailles) in principe onrechtmatig?", a: "Omdat het daden zijn die normaal een schending vormen, maar waarvan de onrechtmatigheid vervalt als reactie op een ander.", r: "Het is een vorm van zelfhulp die streng gereguleerd is om escalatie te voorkomen (bijv. verbod op geweld)." },
  { id: 20, q: "Wat houdt de 'monetary gold' doctrine in voor de ontvankelijkheid bij het IGH?", a: "Het Hof kan geen zaak behandelen als de juridische belangen van een derde staat de 'kern' van het geschil vormen zonder diens instemming.", r: "Omdat de rechtsmacht op consensus rust, mag het Hof niet indirect oordelen over de rechten van staten die geen partij zijn bij de zaak." },

  // ... (Ik heb de lijst ingekort voor de leesbaarheid, maar je kunt hier de overige 30 vragen op dezelfde wijze invullen)
  { id: 21, q: "Welk beginsel verbiedt staten om in te grijpen in de binnenlandse aangelegenheden van een andere staat?", a: "Het non-interventiebeginsel.", r: "Dit vloeit rechtstreeks voort uit de soevereiniteit van staten en de 'domestic jurisdiction' (art 2 lid 7 VN-Handvest)." },
  { id: 22, q: "Wanneer is een 'countermeasure' disproportioneel?", a: "Wanneer de schade van de tegenmaatregel veel groter is dan de schade van de oorspronkelijke schending.", r: "Evenredigheid is een harde eis voor de rechtmatigheid van een represaille." },
  { id: 23, q: "Kan de Veiligheidsraad een advies van het IGH negeren?", a: "Ja, een advies is niet bindend.", r: "Hoewel adviezen zeer gezaghebbend zijn, hebben ze niet de executoriale kracht van een vonnis in een geschil." },
  { id: 24, q: "Wat is de 'Clean Slate' doctrine bij statenopvolging?", a: "Een nieuwe staat begint zonder de verdragsverplichtingen van de voorganger.", r: "Dit geldt vooral voor voormalige koloniën; voor grenzen (territoriale verdragen) geldt dit echter NOOIT." },
  { id: 25, q: "Wat is het verschil tussen een verdrag en een 'Memorandum of Understanding' (MoU)?", a: "Een MoU is politiek bindend ('soft law'), een verdrag is juridisch bindend.", r: "De bedoeling van de partijen om juridische gevolgen te creëren is doorslaggevend voor de status van 'verdrag'." },
  { id: 26, q: "Mag een staat een voorbehoud maken bij een artikel dat een jus cogens norm bevat?", a: "Nee, dat is onverenigbaar met het voorwerp en doel van het verdrag.", r: "Staten kunnen zich niet onttrekken aan dwingend recht, ook niet via het verdragenrecht." },
  { id: 27, q: "Wat is een 'compromissoire clausule'?", a: "Een bepaling in een verdrag waarin staat dat toekomstige geschillen over dat verdrag naar het IGH gaan.", r: "Dit is een vorm van voorafgaande instemming met de rechtsmacht van een hof." },
  { id: 28, q: "Wanneer treedt een verdrag in werking?", a: "Zodra de in het verdrag afgesproken drempel van bekrachtigingen is behaald.", r: "Alleen ondertekening is meestal niet genoeg; ratificatie (bekrachtiging) is de beslissende stap." },
  { id: 29, q: "Wat is het verschil tussen erkenning van een staat en erkenning van een regering?", a: "Staatserkenning ziet op de entiteit; regeringserkenning op wie de legitieme vertegenwoordiger is.", r: "Een staat blijft bestaan, ook als de regering ongrondwettelijk wordt afgezet (bijv. een staatsgreep)." },
  { id: 30, q: "Wat is de 'vlaggenstaat' in het zeerecht?", a: "De staat waar een schip geregistreerd staat en die rechtsmacht uitoefent op de volle zee.", r: "Op de volle zee geldt uitsluitend de rechtsmacht van de vlaggenstaat (exclusieve jurisdictie)." },
  { id: 31, q: "Wat is 'onschuldige doorvaart'?", a: "Het recht van schepen om door de territoriale zee van een ander te varen zonder de veiligheid te schaden.", r: "Dit is een beperking op de soevereiniteit van de kuststaat ten behoeve van de internationale scheepvaart." },
  { id: 32, q: "Hoe breed is de Aansluitende Zone?", a: "Maximaal 24 zeemijl vanaf de basislijn.", r: "In deze zone mag een staat alleen handhaven op douane, fiscus, immigratie en volksgezondheid." },
  { id: 33, q: "Wat is de EEZ?", a: "De Exclusieve Economische Zone (200 mijl) waar een staat visserij- en grondstofrechten heeft.", r: "De kuststaat heeft hier geen volledige soevereiniteit, maar functionele rechtsmacht." },
  { id: 34, q: "Wanneer is een handeling 'ultra vires'?", a: "Wanneer een staatsorgaan buiten zijn boekje of instructies handelt.", r: "In het staatsaansprakelijkheidsrecht wordt een ultra vires handeling nog steeds aan de staat toegerekend (Art. 7 ILC)." },
  { id: 35, q: "Wat is 'Force Majeure'?", a: "Een onvermijdelijke externe gebeurtenis die nakoming materieel onmogelijk maakt.", r: "Het is een rechtvaardigingsgrond die de onrechtmatigheid van een schending wegneemt." },
  { id: 36, q: "Wat is 'Distress' (Noodtoestand)?", a: "Wanneer een actor een regel schendt om zijn eigen leven of dat van anderen te redden.", r: "In tegenstelling tot force majeure is er hier een (beperkte) keuze om de wet te schenden." },
  { id: 37, q: "Wat is 'Genoegdoening'?", a: "Herstel voor niet-materiële schade, zoals een officiële spijtbetuiging.", r: "Dit wordt toegepast als restitutie of schadevergoeding de schade niet volledig dekt." },
  { id: 38, q: "Wat zijn 'Erga Omnes' verplichtingen?", a: "Verplichtingen tegenover de gehele internationale gemeenschap.", r: "Bij schending hiervan mag elke staat (ook niet-gelaedeerd) de verantwoordelijke staat aanspreken." },
  { id: 39, q: "Wat is de 'dominant nationality' regel bij diplomatieke bescherming?", a: "Bij een dubbele nationaliteit mag alleen de staat waarmee de burger de sterkste band heeft bescherming bieden.", r: "Dit voorkomt dat staten elkaar onnodig dwarsbomen bij burgers met twee paspoorten." },
  { id: 40, q: "Wat is 'Universele Rechtsmacht'?", a: "De bevoegdheid om de ergste internationale misdrijven te berechten, ongeacht waar ze zijn gepleegd.", r: "Dit geldt voor genocide, oorlogsmisdaden en misdrijven tegen de menselijkheid." },
  { id: 41, q: "Wat is 'Passieve Nationaliteit'?", a: "Rechtsmacht gebaseerd op de nationaliteit van het slachtoffer.", r: "Dit is controversieel en wordt meestal alleen toegepast bij terrorisme of zeer ernstige misdrijven." },
  { id: 42, q: "Wat is het verschil tussen immuniteit en onschendbaarheid?", a: "Immuniteit beschermt tegen de rechter; onschendbaarheid tegen fysiek ingrijpen (zoals arrestatie).", r: "Een diplomaat is zowel immuun voor vervolging als onschendbaar voor arrestatie." },
  { id: 43, q: "Wie behoren tot de 'Grote Drie' met absolute persoonlijke immuniteit?", a: "Staatshoofd, Regeringsleider en Minister van Buitenlandse Zaken.", r: "Zij genieten immuniteit voor ALLE daden (privé en ambtelijk) zolang zij in functie zijn." },
  { id: 44, q: "Vervalt functionele immuniteit na het ambt?", a: "Nee, functionele immuniteit blijft bestaan voor officiële ambtshandelingen.", r: "Het beschermt de handeling van de staat, niet de persoon zelf." },
  { id: 45, q: "Mag de politie een ambassade betreden bij brand?", a: "Nee, niet zonder uitdrukkelijke toestemming van de missiechef.", r: "De gebouwen van een diplomatieke missie zijn absoluut onschendbaar (Art. 22 CDV)." },
  { id: 46, q: "Wat is de 'Antarctica-clausule'?", a: "Een bevriezing van alle territoriale claims op het continent Antarctica.", r: "Het Antarctisch Verdrag zorgt ervoor dat het gebied alleen voor wetenschap en vrede wordt gebruikt." },
  { id: 47, q: "Zijn massavernietigingswapens toegestaan in de ruimte?", a: "Nee, het Ruimteverdrag verbiedt het plaatsen van kernwapens in een baan om de aarde.", r: "De ruimte is 'Province of all Mankind' en mag niet worden gemilitariseerd met dergelijke wapens." },
  { id: 48, q: "Wat is het 'Attributiebeginsel' bij IGO's?", a: "De organisatie mag alleen doen wat de lidstaten haar via het verdrag hebben opgedragen.", r: "In tegenstelling tot staten hebben IGO's geen algemene bevoegdheid." },
  { id: 49, q: "Wat zijn 'Implied Powers'?", a: "Bevoegdheden die niet in de tekst staan, maar noodzakelijk zijn voor de uitvoering van taken.", r: "Dit werd bevestigd in het Reparation for Injuries advies voor de VN." },
  { id: 50, q: "Is de Europese Unie een 'gewone' IGO?", a: "Nee, het is een supranationale organisatie met eigen rechtsmacht boven de lidstaten.", r: "De EU kan direct rechten en plichten scheppen voor burgers zonder tussenkomst van de nationale staat." },
];

const IPRStaticQuiz = () => {
  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl font-serif italic text-[#1A365D] mb-4">Oefenvragen IPR</h1>
          <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">
            Week 1 - 6 | 50 Analytische Casusvragen
          </p>
          <div className="h-1 w-24 bg-[#C5A059] mx-auto mt-6" />
        </header>

        {/* Sectie 1: De Vragenlijst */}
        <section className="mb-24">
          <h2 className="text-2xl font-serif text-[#1A365D] mb-8 border-b border-[#C5A059]/30 pb-2">
            Deel I: De Vragen
          </h2>
          <div className="space-y-8">
            {questions.map((q) => (
              <div key={q.id} className="flex gap-6 items-start">
                <span className="font-serif italic text-[#C5A059] text-xl min-w-[30px]">
                  {q.id}.
                </span>
                <p className="text-lg text-[#2D3748] leading-relaxed">
                  {q.q}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tussenstuk */}
        <div className="bg-[#1A365D] p-12 rounded-3xl text-center mb-24 shadow-2xl">
          <h3 className="text-white font-serif text-2xl mb-4 italic">Klaar met beantwoorden?</h3>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Scroll naar beneden voor de officiële antwoordsleutel en de juridische onderbouwing.
          </p>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-[#C5A059] text-3xl"
          >
            ↓
          </motion.div>
        </div>

        {/* Sectie 2: De Antwoorden */}
        <section id="answers">
          <h2 className="text-2xl font-serif text-[#1A365D] mb-8 border-b border-[#C5A059]/30 pb-2">
            Deel II: Antwoorden & Rationale
          </h2>
          <div className="space-y-12">
            {questions.map((q) => (
              <div key={q.id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-[#1A365D] text-white text-xs font-bold px-3 py-1 rounded-full">
                    VRAAG {q.id}
                  </span>
                </div>
                <p className="text-sm text-slate-400 italic mb-4">Vraag: {q.q}</p>
                <div className="mb-4">
                  <span className="text-xs font-black uppercase text-[#C5A059] block mb-1">Correct Antwoord:</span>
                  <p className="font-bold text-[#1A365D] text-lg">{q.a}</p>
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-slate-400 block mb-1">Juridische Rationale:</span>
                  <p className="text-slate-600 text-sm leading-relaxed">{q.r}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 text-center border-t border-slate-200 pt-12 text-slate-400 text-xs">
          <p>© 2025 JUDICA Knowledge Base - Succes met je tentamen!</p>
        </footer>
      </div>
    </div>
  );
};

export default IPRStaticQuiz;