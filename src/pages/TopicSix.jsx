import React from 'react';
import { motion } from 'framer-motion';

const questions = [
  // WEEK 1: RECHTSORDE & NEDERLAND
  { 
    id: 1, 
    q: "Waarom kiezen veel voormalige koloniën voor een dualistisch stelsel?", 
    options: ["Om de invloed van internationaal recht op hun pas verkregen soevereiniteit te beperken.", "Omdat monisme alleen bedoeld is voor Europese grootmachten.", "Omdat zij geen lid mogen worden van de Verenigde Naties.", "Om de rechter meer macht te geven over het parlement."],
    a: "A", 
    r: "Dualisme stelt de soevereine staat centraal; internationaal recht geldt pas na uitdrukkelijke omzetting door de eigen wetgever." 
  },
  { 
    id: 2, 
    q: "Wat gebeurt er volgens de pluralistische benadering in het internationaal recht?", 
    options: ["Internationaal recht staat altijd boven nationaal recht.", "Nationaal recht staat altijd boven internationaal recht.", "Er bestaan meerdere rechtsordes naast elkaar zonder strikte hiërarchie.", "Alle rechtsordes vloeien samen tot één wereldstaat."],
    a: "C", 
    r: "Pluralisme erkent de complexiteit van verschillende actoren (staten, organisaties) die elk hun eigen rechtsmacht claimen." 
  },
  { 
    id: 3, 
    q: "Een burger wil zich beroepen op een verdrag voor de Nederlandse rechter. Aan welke cumulatieve eisen van Art. 93 Gw moet zijn voldaan?", 
    options: ["Het verdrag moet getransformeerd zijn en de koning moet akkoord zijn.", "De bepaling moet naar haar inhoud eenieder kunnen verbinden en zijn bekendgemaakt.", "De bepaling moet door de VN zijn goedgekeurd en vertaald naar het Nederlands.", "Het verdrag moet ouder zijn dan de nationale wet in kwestie."],
    a: "B", 
    r: "Art. 93 Gw stelt bekendmaking en de inhoudelijke eis van 'eenieder verbindendheid' (rechtstreekse werking) centraal." 
  },
  { 
    id: 4, 
    q: "Wat is het gevolg van het arrest Costa v. ENEL voor de Nederlandse rechtsorde?", 
    options: ["Nederland moest de Grondwet afschaffen.", "Europees recht heeft voorrang op strijdig nationaal recht, ongeacht de nationale status.", "De rechter mag geen verdragen meer toetsen.", "Alleen strafrecht heeft nog voorrang op Europees recht."],
    a: "B", 
    r: "Het HvJEU bepaalde in dit arrest het absolute primaat van het recht van de Europese Unie boven nationaal recht." 
  },
  { 
    id: 5, 
    q: "Welke term wordt gebruikt voor het doel van internationaal recht om staten simpelweg vreedzaam naast elkaar te laten leven?", 
    options: ["Integratie", "Coöperatie", "Co-existentie", "Federalisme"],
    a: "C", 
    r: "Het recht van co-existentie was de klassieke vorm van IPR, gericht op territoriale integriteit en wederzijds respect." 
  },

  // WEEK 2: SUBJECTEN
  { 
    id: 6, 
    q: "Wat is een cruciaal verschil tussen een bevrijdingsbeweging en een de facto-regime?", 
    options: ["Bevrijdingsbewegingen hebben nooit een territorium.", "Aan bevrijdingsbewegingen wordt vaker subjectiviteit toegekend vanwege het recht op zelfbeschikking.", "De facto-regimes zijn altijd illegaal volgens de VN.", "Bevrijdingsbewegingen zijn commerciële organisaties."],
    a: "B", 
    r: "IPR kent vaak meer status toe aan groepen die vechten tegen koloniale overheersing of bezetting (externe zelfbeschikking)." 
  },
  { 
    id: 7, 
    q: "Waarom hebben IGO's slechts 'beperkte' rechtssubjectiviteit?", 
    options: ["Omdat zij geen leger hebben.", "Omdat hun bevoegdheden beperkt zijn tot wat staten hen hebben toegekend (attributie).", "Omdat zij geen belastingen mogen heffen.", "Omdat zij alleen in New York gevestigd mogen zijn."],
    a: "B", 
    r: "Het attributie- en specialiteitsbeginsel dicteren dat een IGO alleen bevoegdheden heeft voor haar specifieke doel." 
  },
  { 
    id: 8, 
    q: "Welk element hoort NIET bij de staat-criteria van het Montevideo-verdrag?", 
    options: ["Permanente bevolking", "Gedefinieerd grondgebied", "Lidmaatschap van de VN", "Bekwaamheid om betrekkingen aan te gaan"],
    a: "C", 
    r: "Lidmaatschap van de VN is een politieke keuze en geen juridische vereiste om als staat te worden beschouwd." 
  },
  { 
    id: 9, 
    q: "Wat houdt 'interne zelfbeschikking' in?", 
    options: ["Het recht om een eigen staat te stichten.", "Het recht van een volk om binnen de grenzen van een staat zijn eigen ontwikkeling te bepalen.", "Het recht om een andere staat binnen te vallen.", "Het recht om internationale verdragen op te zeggen."],
    a: "B", 
    r: "Interne zelfbeschikking gaat over politieke en culturele autonomie binnen een bestaande staatsstructuur." 
  },
  { 
    id: 10, 
    q: "Hoe wordt 'impliciete erkenning' van een staat vaak geconcretiseerd?", 
    options: ["Door een brief te sturen naar de koning.", "Door het sluiten van een bilateraal verdrag of het vestigen van een diplomatieke post.", "Door het land te bezoeken als toerist.", "Door een tweet van de Minister van Buitenlandse Zaken."],
    a: "B", 
    r: "Handelingen die uitgaan van de juridische gelijkwaardigheid van de andere entiteit impliceren erkenning." 
  },

  // WEEK 3: BRONNEN & VERDRAGEN
  { 
    id: 11, 
    q: "Wat is de functie van 'opinio juris' bij het ontstaan van gewoonterecht?", 
    options: ["Het bewijst dat een staat een verdrag heeft getekend.", "Het is de overtuiging dat een bepaalde praktijk juridisch verplicht is.", "Het is een advies van het IGH.", "Het is de stemverhouding in de Veiligheidsraad."],
    a: "B", 
    r: "Gewoonterecht vereist zowel een feitelijke praktijk als de subjectieve overtuiging dat men juridisch gebonden is." 
  },
  { 
    id: 12, 
    q: "Wat gebeurt er met een gewoonterechtelijke regel als deze wordt gecodificeerd in een verdrag?", 
    options: ["De gewoonterechtelijke regel verdwijnt.", "De gewoonterechtelijke regel blijft bestaan naast de verdragsregel.", "De regel geldt alleen nog voor staten die het verdrag tekenen.", "De regel wordt automatisch jus cogens."],
    a: "B", 
    r: "Codificatie heft de oorspronkelijke bron (gewoonte) niet op; deze blijft gelden voor staten die geen partij zijn bij het verdrag." 
  },
  { 
    id: 13, 
    q: "Welke rechtsbron wordt in Art. 38 Statuut IGH omschreven als 'hulpmiddel'?", 
    options: ["Algemene rechtsbeginselen", "Internationale verdragen", "Rechterlijke beslissingen en opvattingen van schrijvers", "Besluiten van internationale organisaties"],
    a: "C", 
    r: "Jurisprudentie en literatuur zijn secundaire bronnen die helpen bij de vaststelling van de primaire regels." 
  },
  { 
    id: 14, 
    q: "Mag een staat een voorbehoud maken bij ELK verdrag?", 
    options: ["Ja, soevereiniteit is absoluut.", "Nee, niet als het verdrag voorbehouden verbiedt of als het voorbehoud strijdt met voorwerp en doel.", "Alleen als de VS en Rusland akkoord gaan.", "Alleen bij bilaterale verdragen."],
    a: "B", 
    r: "Art. 19 WVV stelt grenzen aan de vrijheid om voorbehouden te maken om de integriteit van het verdrag te beschermen." 
  },
  { 
    id: 15, 
    q: "Wat houdt 'pacta sunt servanda' (Art. 26 WVV) in?", 
    options: ["Verdragen mogen eenzijdig gewijzigd worden.", "Verdragen moeten te goeder trouw worden nagekomen door de partijen.", "Nieuwe staten hoeven verdragen niet na te leven.", "Nationale wet gaat altijd voor het verdrag."],
    a: "B", 
    r: "Dit is het fundamentele beginsel dat de verbindende kracht van alle verdragen onderbouwt." 
  },

  // WEEK 4: GESCHILLENBESLECHTING
  { 
    id: 16, 
    q: "Welke methode van geschillenbeslechting leidt tot een BINDENDE uitspraak?", 
    options: ["Bemiddeling", "Goede diensten", "Arbitrage", "Conciliatie"],
    a: "C", 
    r: "Arbitrage en rechtspraak zijn juridische methoden die een bindend dictum opleveren, in tegenstelling tot diplomatieke methoden." 
  },
  { 
    id: 17, 
    q: "Wat is een 'compromis' in de context van het IGH?", 
    options: ["Een politieke deal tussen twee ministers.", "Een specifieke overeenkomst tussen staten om een BESTAAND geschil aan het Hof voor te leggen.", "Een bepaling in een verdrag voor toekomstige geschillen.", "Een eenzijdige weigering om voor het Hof te verschijnen."],
    a: "B", 
    r: "Een compromis ziet op de ad hoc aanvaarding van rechtsmacht voor een reeds ontstaan conflict." 
  },
  { 
    id: 18, 
    q: "Wie heeft er toegang tot de contentieuze procedure van het Internationaal Gerechtshof?", 
    options: ["Individuen", "NGO's zoals Greenpeace", "Alleen staten", "Multinationals"],
    a: "C", 
    r: "Art. 34 van het IGH-statuut bepaalt dat alleen staten partij kunnen zijn in zaken voor het Hof." 
  },
  { 
    id: 19, 
    q: "Wanneer mag de Veiligheidsraad optreden tegen een staat?", 
    options: ["Bij elke schending van een verdrag.", "Wanneer er sprake is van een bedreiging van de internationale vrede en veiligheid.", "Alleen als de staat geen democratie is.", "Wanneer het IGH een advies uitbrengt."],
    a: "B", 
    r: "De bevoegdheden van de Veiligheidsraad onder Hoofdstuk VII van het VN-Handvest zijn gericht op collectieve veiligheid." 
  },
  { 
    id: 20, 
    q: "Wat is 'naming and shaming' in toezichtprocedures?", 
    options: ["Een fysieke sanctie.", "Het publiekelijk maken van niet-naleving om reputatieschade te veroorzaken.", "Het intrekken van het stemrecht in de VN.", "Het arresteren van het staatshoofd."],
    a: "B", 
    r: "Dit is een veelgebruikte correctieve maatregel binnen IGO's om staten tot naleving te dwingen zonder geweld." 
  },

  // WEEK 5: AANSPRAKELIJKHEID
  { 
    id: 21, 
    q: "Welke twee criteria zijn nodig voor staatsaansprakelijkheid (Art. 2 ILCA)?", 
    options: ["Schuld en een dodelijk slachtoffer.", "Een onrechtmatige daad en toerekenbaarheid aan de staat.", "Een verdragsschending en een financiële boete.", "Medeplichtigheid en opzet."],
    a: "B", 
    r: "Staatsaansprakelijkheid is objectief; het gaat om de schending van een plicht en de band met de staat." 
  },
  { 
    id: 22, 
    q: "Is een staat aansprakelijk voor de daden van een gewone burger op zijn grondgebied?", 
    options: ["Ja, altijd.", "Nee, tenzij de staat de daden achteraf aanvaardt of als de burger handelde onder instructie/controle.", "Alleen als de burger rijk is.", "Alleen als de burger de nationaliteit van die staat heeft."],
    a: "B", 
    r: "Daden van particulieren worden in beginsel niet toegerekend, behalve onder de uitzonderingen van Art. 8 of 11 ILCA." 
  },
  { 
    id: 23, 
    q: "Wat is het verschil tussen restitutie en schadevergoeding?", 
    options: ["Geen verschil.", "Restitutie herstelt de situatie naar de toestand voor de daad; schadevergoeding dekt de financiële waarde.", "Restitutie is alleen voor land; schadevergoeding alleen voor mensen.", "Restitutie is een boete; schadevergoeding is vrijwillig."],
    a: "B", 
    r: "Restitutie heeft de hoogste prioriteit (Art. 35 ILCA) omdat het de schending fysiek of juridisch ongedaan maakt." 
  },
  { 
    id: 24, 
    q: "Wanneer kan een staat zich beroepen op 'Noodtoestand' (State of Necessity)?", 
    options: ["Bij elke economische crisis.", "Als een essentieel belang wordt bedreigd door een ernstig en onmiddellijk gevaar.", "Wanneer het staatshoofd zich bedreigd voelt.", "Wanneer een verdrag niet meer gunstig is."],
    a: "B", 
    r: "Dit is een zeer strikte verdedigingsgrond (Art. 25 ILCA) die alleen geldt als er geen andere weg is." 
  },
  { 
    id: 25, 
    q: "Wat werd bepaald in de Nicaragua-zaak over de toerekening van daden van rebellen?", 
    options: ["Financiële steun is genoeg voor toerekening.", "Er moet sprake zijn van 'effective control' over de specifieke operaties.", "De staat is altijd aansprakelijk voor rebellen.", "Rebellen hebben zelf rechtssubjectiviteit."],
    a: "B", 
    r: "Het IGH legde de lat voor toerekening hoog: de staat moet de feitelijke regie hebben over de onrechtmatige handeling." 
  },

  // WEEK 6: RECHTSMACHT & IMMUNITEIT
  { 
    id: 26, 
    q: "Wat houdt het 'objectieve territorialiteitsbeginsel' in?", 
    options: ["Rechtsmacht over daden op eigen bodem.", "Rechtsmacht over daden in het buitenland die gevolgen hebben binnen het eigen territorium.", "Rechtsmacht over alle onderdanen in het buitenland.", "Rechtsmacht over de volle zee."],
    a: "B", 
    r: "Dit beginsel staat toe dat een staat optreedt tegen grensoverschrijdende criminaliteit die hem raakt." 
  },
  { 
    id: 27, 
    q: "Wie geniet 'persoonlijke immuniteit'?", 
    options: ["Elke ambtenaar.", "De Grote Drie (Staatshoofd, Regeringsleider, Min. Buitenlandse Zaken) tijdens hun ambt.", "Alleen de koning.", "Elke soldaat op missie."],
    a: "B", 
    r: "Persoonlijke immuniteit is status-gebonden en dekt zowel privé- als ambtelijke daden gedurende de ambtstermijn." 
  },
  { 
    id: 28, 
    q: "Vervalt immuniteit bij het Internationaal Strafhof (ISH)?", 
    options: ["Nee, het ISH moet nationale immuniteit respecteren.", "Ja, Art. 27 Statuut ISH bepaalt dat officiële hoedanigheid geen grond is voor strafuitsluiting of immuniteit.", "Alleen voor ministers.", "Alleen na toestemming van de eigen staat."],
    a: "B", 
    r: "Het ISH-stelsel wijkt af van het interstatelijke recht om straffeloosheid voor kernmisdrijven te voorkomen." 
  },
  { 
    id: 29, 
    q: "Wat is 'acta jure gestionis'?", 
    options: ["Overheidshandelingen waarvoor immuniteit geldt.", "Commerciële handelingen van een staat waarvoor GEEN staatsimmuniteit geldt.", "Het recht om oorlog te voeren.", "De benoeming van een ambassadeur."],
    a: "B", 
    r: "Staten treden vaak op als marktpartij; in die rol kunnen zij door nationale rechters worden aangesproken." 
  },
  { 
    id: 30, 
    q: "Wat is de maximale breedte van de 'Aansluitende Zone'?", 
    options: ["12 zeemijl", "24 zeemijl vanaf de basislijn", "200 zeemijl", "Onbeperkt"],
    a: "B", 
    r: "In deze zone mag een kuststaat controleren op douane, fiscus, immigratie en volksgezondheid (Art. 33 VN-Zeeverdrag)." 
  },

  // MIXED & VERDIEPING
  { 
    id: 31, 
    q: "Wat is 'erga omnes'?", 
    options: ["Een verplichting tegenover één specifieke staat.", "Een verplichting tegenover de internationale gemeenschap als geheel.", "Een verplichting die alleen in oorlogstijd geldt.", "Een term voor commercieel recht."],
    a: "B", 
    r: "Schending van erga omnes normen (zoals het verbod op genocide) geeft elke staat het recht om in te grijpen." 
  },
  { 
    id: 32, 
    q: "Wanneer is een doorvaart 'onschuldig'?", 
    options: ["Als het schip geen wapens aan boord heeft.", "Zolang de vrede, goede orde of veiligheid van de kuststaat niet wordt geschaad.", "Als de kuststaat tol heeft ontvangen.", "Als het schip onder de vlag van de VN vaart."],
    a: "B", 
    r: "Dit is een fundamenteel recht voor alle schepen in de territoriale zee van een andere staat." 
  },
  { 
    id: 33, 
    q: "Wat is het 'beschermingsbeginsel' bij jurisdictie?", 
    options: ["Rechtsmacht om eigen onderdanen te beschermen.", "Rechtsmacht over feiten in het buitenland die vitale belangen van de staat schaden (bijv. valsmunterij).", "Rechtsmacht over de hele wereld.", "Het recht om diplomaten te beschermen."],
    a: "B", 
    r: "Dit beginsel richt zich op de bescherming van de integriteit van de staat zelf." 
  },
  { 
    id: 34, 
    q: "Wat houdt de 'Clean Slate' regel in bij verdragen?", 
    options: ["Nieuwe staten beginnen zonder de verplichtingen van hun voorganger.", "Alle verdragen moeten elk jaar opnieuw getekend worden.", "De VN wist alle schulden van een staat.", "Een staat mag zijn eigen geschiedenis herschrijven."],
    a: "A", 
    r: "Vooral belangrijk voor gedekoloniseerde staten, hoewel grenzen hierop een uitzondering vormen." 
  },
  { 
    id: 35, 
    q: "Mag een diplomatieke tas worden geopend?", 
    options: ["Ja, bij vermoeden van drugs.", "Nee, de diplomatieke tas mag niet worden geopend of vastgehouden.", "Alleen door de politie met een bevel.", "Alleen als de diplomaat er niet bij is."],
    a: "B", 
    r: "De onschendbaarheid van de koerier en de tas is essentieel voor vrije communicatie (Art. 27 CDV)." 
  },
  { 
    id: 36, 
    q: "Wat is 'forum prorogatum'?", 
    options: ["Een verbod op het Hof.", "Instemming met rechtsmacht nadat een zaak is aangebracht.", "Een verlenging van een verdrag.", "Een manier om de VN te verlaten."],
    a: "B", 
    r: "Dit is een informele wijze van aanvaarding van de jurisdictie van het IGH." 
  },
  { 
    id: 37, 
    q: "Wat is het doel van 'represailles'?", 
    options: ["Wraak nemen.", "De andere staat dwingen te stoppen met een onrechtmatige daad en tot herstel over te gaan.", "Een staat volledig vernietigen.", "De economie van een buurland overnemen."],
    a: "B", 
    r: "Tegenmaatregelen zijn een pressiemiddel om de rechtsorde te herstellen." 
  },
  { 
    id: 38, 
    q: "Wie is aansprakelijk voor een 'ultra vires' handeling van een legeronderdeel?", 
    options: ["Alleen de soldaten zelf.", "De staat, mits het orgaan optrad in zijn officiële hoedanigheid.", "Niemand, want het was buiten de instructies.", "De Verenigde Naties."],
    a: "B", 
    r: "Staten kunnen zich niet verschuilen achter interne instructies om internationale aansprakelijkheid te ontlopen." 
  },
  { 
    id: 39, 
    q: "Wat is 'jus cogens'?", 
    options: ["Recht dat alleen voor rechters geldt.", "Dwingend recht waarvan nooit mag worden afgeweken.", "Recht van de zee.", "Een niet-bindend advies."],
    a: "B", 
    r: "Normen zoals het verbod op agressie en foltering staan bovenaan de hiërarchie van het IPR." 
  },
  { 
    id: 40, 
    q: "Mag een staat op de Volle Zee een ander schip aanhouden?", 
    options: ["Ja, voor elk vermoeden van een misdrijf.", "Nee, behalve bij piraterij, slavenhandel of schepen zonder vlag.", "Alleen als de kust dichtbij is.", "Alleen met toestemming van de vlaggenstaat."],
    a: "B", 
    r: "Exclusieve rechtsmacht van de vlaggenstaat is de regel op de volle zee, met zeer beperkte uitzonderingen (Art. 110 UNCLOS)." 
  },
];

const IPRStaticMCQuiz = () => {
  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-3xl font-serif italic text-[#1A365D] mb-4">40 Oefenvragen IPR</h1>
          <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">
            Multiple Choice | Week 1 - 6 | Tentamenniveau
          </p>
          <div className="h-1 w-24 bg-[#C5A059] mx-auto mt-6" />
        </header>

        {/* Sectie 1: De Vragenlijst */}
        <section className="mb-24">
          <h2 className="text-2xl font-serif text-[#1A365D] mb-8 border-b border-[#C5A059]/30 pb-2">
            Deel I: De Vragen
          </h2>
          <div className="space-y-12">
            {questions.map((q) => (
              <div key={q.id} className="flex flex-col gap-4 items-start">
                <div className="flex gap-4">
                  <span className="font-serif italic text-[#C5A059] text-xl min-w-[30px]">
                    {q.id}.
                  </span>
                  <p className="text-lg text-[#2D3748] font-bold leading-relaxed">
                    {q.q}
                  </p>
                </div>
                <div className="ml-12 grid grid-cols-1 gap-3 w-full">
                  {q.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-white shadow-sm">
                      <span className="font-bold text-[#1A365D]">{String.fromCharCode(65 + i)}.</span>
                      <span className="text-sm text-slate-600">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tussenstuk */}
        <div className="bg-[#1A365D] p-12 rounded-3xl text-center mb-24 shadow-2xl">
          <h3 className="text-white font-serif text-2xl mb-4 italic">Antwoorden Controleren?</h3>
          <p className="text-white/70 mb-8 max-w-md mx-auto text-sm">
            Scroll verder naar beneden voor de officiële antwoordsleutel en de Juridische Basis per vraag.
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
            Deel II: Antwoorden & Juridische Basis
          </h2>
          <div className="space-y-8">
            {questions.map((q) => (
              <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center">
                <div className="min-w-[80px]">
                  <span className="bg-[#1A365D] text-white text-[10px] font-bold px-3 py-1 rounded-full block text-center">
                    VRAAG {q.id}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black uppercase text-[#C5A059]">Correct:</span>
                    <span className="font-bold text-[#1A365D] text-xl">{q.a}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 min-w-[100px]">Juridische Basis:</span>
                    <p className="text-slate-600 text-xs leading-relaxed italic">{q.r}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 text-center border-t border-slate-200 pt-12 text-slate-400 text-xs">
          <p>© 2025 Elbert Knowledge Base - IPR Expert Mode</p>
        </footer>
      </div>
    </div>
  );
};

export default IPRStaticMCQuiz;