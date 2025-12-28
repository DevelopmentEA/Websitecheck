import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const StrafrechtExpertStatic = () => {
  // 30 VRAGEN - MOEILIJK/EXPERT NIVEAU
  const QUESTIONS = useMemo(() => [
    // WEEK 1: Dogmatiek & Legaliteit
    {
      id: 1,
      q: "Wat is het formele gevolg voor de einduitspraak als 'wederrechtelijkheid' als bestanddeel in de delictsomschrijving staat, en de verdachte een geslaagd beroep doet op een rechtvaardigingsgrond?",
      options: ["Ontslag van alle rechtsvervolging (OVAR), omdat de wederrechtelijkheid als element ontbreekt.", "Vrijspraak, omdat het bestanddeel niet bewezen kan worden.", "Vrijspraak, omdat de verwijtbaarheid ontbreekt.", "Niet-ontvankelijkheid van het OM wegens gebrek aan grondslag."],
      a: "B",
      r: "Omdat het in de tekst van de wet staat (bestanddeel), moet de OvJ het bewijzen. Een rechtvaardigingsgrond neemt de wederrechtelijkheid weg -> bestanddeel niet bewezen -> Vrijspraak."
    },
    {
      id: 2,
      q: "Welke interpretatiemethode hanteert de rechter wanneer hij de betekenis van een bepaling afleidt uit de 'ratio' of het maatschappelijk doel van de wet?",
      options: ["De grammaticale interpretatiemethode.", "De teleologische interpretatiemethode.", "De wetshistorische interpretatiemethode.", "De wetssystematische interpretatiemethode."],
      a: "B",
      r: "Teleologisch (telos = doel) kijkt naar de strekking en het doel van de bepaling in de huidige tijd."
    },
    {
      id: 3,
      q: "Wat houdt het 'lex certa'-gebod in en hoe verhoudt dit zich tot het arrest 'Onbehoorlijk gedrag'?",
      options: ["De wet moet absoluut duidelijk zijn; de HR vernietigde de APV bepaling wegens vaagheid.", "De wet moet duidelijk zijn, maar enige vaagheid is onvermijdelijk om wetgeving toepasbaar te houden; de bepaling bleef in stand.", "Het geldt alleen voor misdrijven, niet voor overtredingen zoals in de APV.", "De wet mag met terugwerkende kracht worden toegepast als het in het voordeel van de verdachte is."],
      a: "B",
      r: "De Hoge Raad oordeelde dat wetgeving niet elk detail kan regelen. Termen als 'onbehoorlijk' zijn aanvaardbaar als ze in de context duidelijk genoeg zijn."
    },
    {
      id: 4,
      q: "Wanneer spreken we van een 'oneigenlijk omissiedelict'?",
      options: ["Wanneer iemand strafbaar is omdat hij nalaat te getuigen.", "Wanneer een commissiedelict (doen) wordt gepleegd door iets na te laten (niet-doen), zoals een moeder die haar kind niet voedt.", "Wanneer een overtreding per ongeluk wordt begaan.", "Wanneer de verdachte een ambtenaar in functie is."],
      a: "B",
      r: "Oneigenlijk omissie: De wet omschrijft een handeling (doden), maar de dader verricht dit door niets te doen (verhongeren)."
    },

    // WEEK 2: Opzet, Schuld & Causaliteit
    {
      id: 5,
      q: "Welk specifiek element was in het Porsche-arrest de doorslaggevende contra-indicatie om 'voorwaardelijk opzet' af te wijzen?",
      options: ["Het dronkenschap van de bestuurder.", "Het feit dat hij eerdere inhaalpogingen had afgebroken.", "De snelheid van het voertuig.", "Het ontbreken van een geldig rijbewijs."],
      a: "B",
      r: "Het afbreken van eerdere pogingen wees erop dat hij het risico wilde vermijden (hij dacht dat het kon), en de kans dus niet 'aanvaardde'."
    },
    {
      id: 6,
      q: "Wat is de definitie van 'roekeloosheid' in juridische zin (de zwaarste schuldvorm)?",
      options: ["Willens en wetens de kans aanvaarden (gelijk aan opzet).", "Het nemen van onaanvaardbare risico's waarbij men zeer lichtzinnig vertrouwt op een goede afloop.", "Een moment van onoplettendheid in het verkeer.", "Het plegen van een delict onder invloed van drugs."],
      a: "B",
      r: "Roekeloosheid is de zwaarste vorm van culpa. De dader ziet het gevaar, neemt onverantwoorde risico's, maar 'hoopt/denkt' dat het goed komt."
    },
    {
      id: 7,
      q: "In het arrest 'Letale Longembolie' introduceerde de Hoge Raad een nieuwe causaliteitsleer. Welke?",
      options: ["De Causa Proxima leer.", "De leer van de adequate veroorzaking.", "De leer van de redelijke toerekening.", "De Conditio sine qua non leer."],
      a: "C",
      r: "De vraag is of het gevolg redelijkerwijs aan de handeling van de verdachte kan worden toegerekend, gezien de aard van de gedraging en het gevolg."
    },
    {
      id: 8,
      q: "Wat is een 'geobjectiveerd bestanddeel' in een opzetdelict?",
      options: ["Een bestanddeel dat objectief bewezen moet worden.", "Een bestanddeel waarop het opzet van de verdachte niet gericht hoeft te zijn.", "Een bestanddeel dat leidt tot strafvermindering.", "Een bestanddeel dat alleen voor medeplegers geldt."],
      a: "B",
      r: "Bijv. art 180 Sr: het verzet moet opzettelijk zijn, maar de dader hoeft geen opzet te hebben op de 'rechtmatigheid' van de ambtshandeling."
    },

    // WEEK 3 & 4: Strafproces & Dwangmiddelen
    {
      id: 9,
      q: "Art. 27 Sv noemt het materiële verdachtenbegrip. Welke drie elementen zijn vereist?",
      options: ["1. Aanhouding, 2. Verhoor, 3. Proces-verbaal.", "1. Redelijk vermoeden van schuld, 2. Aan een strafbaar feit, 3. Voortvloeiend uit feiten of omstandigheden.", "1. Betrapping op heterdaad, 2. Identificatie, 3. Voorgeleiding.", "1. Beschuldiging, 2. Dagvaarding, 3. Bewijs."],
      a: "B",
      r: "Het vermoeden moet individualiseerbaar, concretiseerbaar en objectiveerbaar zijn (Caribian Nights)."
    },
    {
      id: 10,
      q: "Wat is de maximale duur van het 'ophouden voor onderzoek' bij een feit waarvoor géén voorlopige hechtenis mogelijk is?",
      options: ["6 uur (plus eventueel 6 uur verlenging voor identificatie).", "9 uur.", "3 dagen.", "12 uur."],
      a: "A",
      r: "Standaard 6 uur. Alleen bij misdrijven met voorlopige hechtenis is het 9 uur. De verlenging is alleen voor identificatie."
    },
    {
      id: 11,
      q: "Het 'anticipatiegebod' (art. 67a lid 3 Sv) verbiedt voorlopige hechtenis als...",
      options: ["De verdachte geen vluchtgevaar heeft.", "Het ernstig waarschijnlijk is dat de verdachte niet langer vast zal zitten dan de uiteindelijke onvoorwaardelijke straf.", "De verdachte 'first offender' is.", "Het onderzoek nog niet is afgerond."],
      a: "B",
      r: "Je mag iemand niet langer in voorarrest houden dan de straf die hij naar verwachting gaat krijgen."
    },
    {
      id: 12,
      q: "Wie is exclusief bevoegd tot het doorzoeken van een woning ter inbeslagneming (behoudens art. 97 Sv spoed)?",
      options: ["De Hulpofficier van Justitie.", "De Officier van Justitie.", "De Rechter-Commissaris.", "De politiecommissaris."],
      a: "C",
      r: "Huisrecht (art 12 Gw) weegt zwaar. Doorzoeking (kasten openen e.d.) in een woning is de exclusieve taak van de R-C (art 110 Sv)."
    },
    {
      id: 13,
      q: "In het arrest 'Braak bij binnentreden' toetste de Hoge Raad het politieoptreden aan beginselen van behoorlijke procesorde. Welke?",
      options: ["Vertrouwensbeginsel en Gelijkheidsbeginsel.", "Proportionaliteit en Subsidiariteit.", "Zuiverheid van oogmerk.", "Nemo tenetur."],
      a: "B",
      r: "De politie forceerde een voordeur voor een relatief licht feit. Dat was disproportioneel en niet subsidiair."
    },
    {
      id: 14,
      q: "Wat is het verschil tussen 'infiltratie' en 'pseudo-koop'?",
      options: ["Bij infiltratie neemt de agent deel aan de criminele groep; bij pseudo-koop neemt hij slechts goederen/diensten af.", "Infiltratie mag zonder bevel OvJ, pseudo-koop niet.", "Pseudo-koop is voor drugs, infiltratie voor wapens.", "Er is geen verschil."],
      a: "A",
      r: "Infiltratie gaat veel verder (deelnemen aan de organisatie) en is een zwaarder middel dan enkel eenmalig iets kopen."
    },

    // WEEK 5 & 6: Vervolging & Zitting
    {
      id: 15,
      q: "Wanneer is het OM niet-ontvankelijk in de vervolging?",
      options: ["Als het bewijs onvoldoende is.", "Als er sprake is van een vormverzuim dat niet gerepareerd kan worden.", "Als het vervolgingsrecht is vervallen (bijv. verjaring, ne bis in idem).", "Als de verdachte ontkent."],
      a: "C",
      r: "Niet-ontvankelijkheid ziet op de bevoegdheid om te vervolgen. Als het recht is vervallen, mag het OM niet meer optreden."
    },
    {
      id: 16,
      q: "Wat houdt de 'grondslagleer' strikt genomen in?",
      options: ["De rechter moet de materiele waarheid vinden.", "De beraadslaging van de rechter (348/350 Sv) is gebonden aan de tekst van de tenlastelegging.", "De grondwet vormt de basis van het strafproces.", "De rechter mag feiten toevoegen als ze ter zitting zijn bewezen."],
      a: "B",
      r: "De tenlastelegging is het enige waarover geoordeeld mag worden. De papieren werkelijkheid is leidend."
    },
    {
      id: 17,
      q: "Welke procedure kan een slachtoffer starten als het OM besluit de zaak te seponeren?",
      options: ["Een civiele procedure tegen de OvJ.", "Een Artikel 12 Sv procedure bij het Gerechtshof.", "Een cassatieberoep bij de Hoge Raad.", "Een verzoekschrift bij de Koning."],
      a: "B",
      r: "Via de Art. 12 Sv procedure kan een belanghebbende het Gerechtshof vragen om het OM alsnog te dwingen tot vervolging."
    },
    {
      id: 18,
      q: "Wanneer is een dagvaarding 'nietig'?",
      options: ["Als er een spelfout in de naam staat.", "Als de dagvaarding niet voldoet aan de eisen van art. 261 Sv (bijv. onduidelijke opgave feit).", "Als de verdachte niet is verschenen.", "Als het bewijs in het dossier ontbreekt."],
      a: "B",
      r: "Nietigheid volgt als de functie van de dagvaarding (informeren/beschuldigen) fundamenteel faalt."
    },
    {
      id: 19,
      q: "Wat is het verschil tussen 'onderbreking' en 'schorsing' van de zitting?",
      options: ["Schorsing is voor de lunch.", "Onderbreking is kort en gaat zelfde dag verder; Schorsing is voor onbepaalde/bepaalde tijd (dagen/weken).", "Schorsing betekent einde zaak.", "Er is geen juridisch verschil."],
      a: "B",
      r: "Schorsing (aanhouding) wordt gebruikt als het onderzoek niet op één dag kan worden afgerond."
    },
    {
      id: 20,
      q: "Wat gebeurt er als de rechter vaststelt dat het feit bewezen is, maar de dader een beroep kan doen op 'noodweerexces'?",
      options: ["Vrijspraak.", "Ontslag van alle rechtsvervolging (OVAR) wegens ontbreken strafbaarheid dader.", "OVAR wegens ontbreken strafbaarheid feit.", "Veroordeling zonder straf."],
      a: "B",
      r: "Noodweerexces is een schulduitsluitingsgrond. Het feit is strafbaar, maar de dader niet. Dus OVAR."
    },

    // WEEK 7: Sancties & Rechtsmiddelen
    {
      id: 21,
      q: "Wat is het 'absorptiestelsel' bij eendaadse samenloop (art. 55 lid 1 Sr)?",
      options: ["De straffen worden opgeteld.", "Er wordt slechts één strafbepaling toegepast (de zwaarste).", "De zwaarste straf wordt met 1/3 verhoogd.", "De rechter kiest willekeurig."],
      a: "B",
      r: "Bij eendaadse samenloop absorbeert de zwaarste bepaling de andere."
    },
    {
      id: 22,
      q: "Can de maatregel 'onttrekking aan het verkeer' worden opgelegd bij vrijspraak?",
      options: ["Nee, nooit.", "Ja, dit is een maatregel ter beveiliging en staat los van de veroordeling.", "Alleen als de verdachte instemt.", "Alleen door de Hoge Raad."],
      a: "B",
      r: "Art. 36b Sr staat toe dat gevaarlijke goederen worden onttrokken, zelfs bij vrijspraak."
    },
    {
      id: 23,
      q: "Wat is de maximale duur van de TBS-maatregel met dwangverpleging bij een geweldsmisdrijf?",
      options: ["Maximaal 4 jaar.", "Maximaal 2 jaar.", "In beginsel ongemaximeerd (verlengbaar).", "Levenslang zonder toetsing."],
      a: "C",
      r: "Bij geweldsmisdrijven (art. 38e Sr) kan TBS telkens verlengd worden."
    },
    {
      id: 24,
      q: "Wat is een 'voorwaardelijke veroordeling' (art. 14a Sr)?",
      options: ["De straf wordt niet ten uitvoer gelegd bij goed gedrag.", "De verdachte wordt vrijgesproken.", "De straf is afhankelijk van de minister.", "Een straf die alleen geldt als het slachtoffer dat wil."],
      a: "A",
      r: "Het is een stok achter de deur; ga je in de fout, dan moet je alsnog de straf ondergaan."
    },
    {
      id: 25,
      q: "Welk rechtsmiddel is een 'buitengewoon rechtsmiddel'?",
      options: ["Hoger Beroep.", "Cassatie.", "Herziening.", "Verzet."],
      a: "C",
      r: "Herziening is een buitengewoon rechtsmiddel tegen onherroepelijke vonnissen."
    },
    {
      id: 26,
      q: "Sinds 2013 is 'herziening ten nadele' mogelijk. Wat is een 'falsa'?",
      options: ["Een nieuwe DNA-match.", "Een verkeerde wetsinterpretatie.", "Een gebleken onwaarheid die tot vrijspraak leidde.", "Een bekentenis na vrijspraak."],
      a: "C",
      r: "Falsa is bedrog of leugen (meineed) in het oorspronkelijke proces."
    },
    {
      id: 27,
      q: "Wat toetst de Hoge Raad in cassatie NIET?",
      options: ["De feiten.", "De toepassing van het recht.", "Vormverzuimen.", "Motivering van het vonnis."],
      a: "A",
      r: "De Hoge Raad is een rechtsrechter, geen feitenrechter."
    },
    {
      id: 28,
      q: "Wat houdt het 'draagkrachtbeginsel' in bij geldboetes?",
      options: ["De boete moet hoog zijn.", "Rekening houden met de financiële situatie van de verdachte.", "De overheid betaalt.", "Rijke mensen krijgen lagere straffen."],
      a: "B",
      r: "Art. 24 Sr: de boete moet voor iedereen relatief even zwaar voelen."
    },
    {
      id: 29,
      q: "Wat is 'sprongcassatie' en mag dit in Nederland?",
      options: ["Direct van Rechtbank naar HR; Ja.", "Direct van Rechtbank naar HR; Nee.", "Van Hof naar EHRM; Ja.", "Van politie naar rechter; Nee."],
      a: "B",
      r: "Nederland kent een gesloten stelsel; men moet de hiërarchie volgen."
    },
    {
      id: 30,
      q: "Wat is het verschil tussen hechtenis en gevangenisstraf?",
      options: ["Hechtenis voor overtredingen, gevangenisstraf voor misdrijven.", "Hechtenis is levenslang.", "Gevangenisstraf is thuis.", "Er is geen verschil."],
      a: "A",
      r: "Hechtenis is de straf voor overtredingen of bij niet betalen boete."
    }
  ], []);

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-12 px-6 font-serif">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-20">
          <h1 className="text-5xl font-bold text-[#1A365D] mb-4 italic tracking-tight">Strafrecht Expert Toets</h1>
          <p className="text-slate-500 uppercase tracking-[0.4em] text-xs font-black">
            Verdiepingsmodule | Week 1 - 7 | 30 Casusvragen
          </p>
          <div className="h-1 w-24 bg-[#C5A059] mx-auto mt-8" />
        </header>

        {/* Sectie I: De Vragen */}
        <section className="mb-32">
          <h2 className="text-2xl font-bold text-[#1A365D] mb-12 border-b border-[#C5A059]/30 pb-3">
            Deel I: De Vraagstukken
          </h2>
          <div className="space-y-16">
            {QUESTIONS.map((item) => (
              <div key={item.id} className="group">
                <div className="flex gap-6 items-start mb-6">
                  <span className="font-serif italic text-[#C5A059] text-2xl min-w-[40px] font-bold">
                    {item.id}.
                  </span>
                  <p className="text-xl text-[#2D3748] font-bold leading-snug">
                    {item.q}
                  </p>
                </div>
                <div className="ml-16 grid grid-cols-1 gap-3">
                  {item.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:border-[#1A365D] transition-colors">
                      <span className="font-bold text-[#1A365D] w-6">{String.fromCharCode(65 + i)}.</span>
                      <span className="text-slate-600 text-base">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Visuele Breuk */}
        <div className="bg-[#1A365D] p-16 rounded-[3rem] text-center mb-32 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#C5A059]" />
          <h3 className="text-white font-serif text-3xl mb-4 italic font-bold">Zelfreflectie voltooid?</h3>
          <p className="text-white/70 mb-8 max-w-md mx-auto text-lg">
            Scroll naar beneden voor de officiële antwoorden en de Juridische Basis.
          </p>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-[#C5A059] text-4xl"
          >
            ↓
          </motion.div>
        </div>

        {/* Sectie II: De Antwoorden */}
        <section id="answers" className="pb-20">
          <h2 className="text-2xl font-bold text-[#1A365D] mb-12 border-b border-[#C5A059]/30 pb-3">
            Deel II: Antwoorden & Juridische Basis
          </h2>
          <div className="grid grid-cols-1 gap-8">
            {QUESTIONS.map((item) => (
              <div key={item.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative">
                <div className="flex justify-between items-center mb-6">
                  <span className="bg-[#1A365D] text-white text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full uppercase">
                    Casus {item.id}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-black uppercase text-[#C5A059]">Correct Antwoord:</span>
                  <span className="font-bold text-[#1A365D] text-2xl">{item.a}</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-[#C5A059]">
                  <span className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest">Juridische Basis:</span>
                  <p className="text-[#2D3748] text-base leading-relaxed italic">
                    {item.r}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center border-t border-slate-200 pt-12 text-slate-400 text-xs">
          <p>© 2025 ELBERT Knowledge Base — Strafrecht Expert Modus</p>
        </footer>
      </div>
    </div>
  );
};

export default StrafrechtExpertStatic;