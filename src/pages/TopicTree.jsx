import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const StrafrechtExpertQuiz = () => {
  const [gameState, setGameState] = useState('start');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [showFeedback, setShowFeedback] = useState(false);

  // 50 VRAGEN - EXPERT NIVEAU - TRICKY DISTRACTORS
  const QUESTIONS = useMemo(() => [
    // --- WEEK 1: MATERIEEL STRAFRECHT & LEGALITEIT ---
    {
      q: "Stel: in de delictsomschrijving is 'wederrechtelijkheid' opgenomen als bestanddeel. De rechter acht het feit bewezen, maar de verdachte beroept zich succesvol op een rechtvaardigingsgrond. Wat is het dictum?",
      options: [
        "Ontslag van alle rechtsvervolging (OVAR), omdat de strafbaarheid van het feit ontbreekt.",
        "Vrijspraak, omdat het bestanddeel wederrechtelijkheid niet kan worden bewezen.",
        "OVAR, omdat de verwijtbaarheid van de dader ontbreekt.",
        "Niet-ontvankelijkheid van het OM wegens gebrek aan grondslag."
      ],
      correct: 1,
      exp: "Tricky! Normaal leidt een rechtvaardigingsgrond tot OVAR. Maar als 'wederrechtelijk' in de tekst staat (bestanddeel), moet de OvJ dit bewijzen. Een rechtvaardigingsgrond 'breekt' dit bewijs -> Vrijspraak."
    },
    {
      q: "Welke interpretatiemethode is strijdig met het lex stricta-beginsel als deze ten nadele van de verdachte werkt?",
      options: [
        "De extensieve interpretatie.",
        "De analoge interpretatie.",
        "De teleologische interpretatie.",
        "De grammaticale interpretatie."
      ],
      correct: 1,
      exp: "Extensief interpreteren mag (binnen de taalkundige betekenis), maar analoog interpreteren (de wet toepassen op een geval dat er taalkundig net buiten valt) mag niet ten nadele van de verdachte."
    },
    {
      q: "Wat concludeerde de Hoge Raad in het 'Elektriciteits-arrest' over het bestanddeel 'goed' in art. 310 Sr?",
      options: [
        "Elektriciteit is geen stoffelijk object, dus diefstal is onmogelijk (lex scripta).",
        "Elektriciteit is een 'goed' vanwege de economische waarde en de mogelijkheid tot toe-eigening.",
        "De wetgever moest de wet aanpassen voordat vervolging mogelijk was.",
        "Het aftappen van stroom valt onder 'oplichting', niet onder diefstal."
      ],
      correct: 1,
      exp: "De HR interpreteerde 'goed' teleologisch/extensief: het vertegenwoordigt een economische waarde, dus is het een goed, ook al is het niet stoffelijk."
    },
    {
      q: "Wanneer is er sprake van een 'oneigenlijk omissiedelict'?",
      options: [
        "Wanneer de wetgever een 'nalaten' strafbaar stelt (zoals art. 450 Sr).",
        "Wanneer een commissiedelict (omschreven als een 'doen') wordt gepleegd door passiviteit (niet-handelen).",
        "Wanneer de verdachte een ambtsmisdrijf pleegt door nalatigheid.",
        "Wanneer er sprake is van voorwaardelijk opzet bij een overtreding."
      ],
      correct: 1,
      exp: "Oneigenlijk omissie = een verbodsnorm (gij zult niet doden) schenden door niets te doen (bijv. moeder geeft kind geen eten)."
    },
    {
      q: "Welk rechtsbeginsel werd geschonden in het 'Water en Melk'-arrest (HR 1916) volgens de lagere rechter, maar gecorrigeerd door de Hoge Raad?",
      options: [
        "Geen straf zonder schuld (AVAS).",
        "Nulla poena sine lege (Legaliteit).",
        "Ne bis in idem.",
        "Het vertrouwensbeginsel."
      ],
      correct: 0,
      exp: "De Knecht werd vrijgesproken wegens AVAS (Afwezigheid van alle schuld). Hij wist niet dat de melk aangelengd was en kon het niet weten. Geen straf zonder schuld."
    },

    // --- WEEK 2: OPZET & CULPA ---
    {
      q: "Wat is de cruciale psychische grens tussen 'bewuste schuld' en 'voorwaardelijk opzet'?",
      options: [
        "De wetenschap van de kans (cognitief element).",
        "De aanvaarding van de kans (volitief element).",
        "De grootte van de kans (statistisch element).",
        "De ernst van het gevolg (normatief element)."
      ],
      correct: 1,
      exp: "Bij beiden ziet de dader het gevaar (wetenschap). Het verschil is de wil: bij opzet 'aanvaardt' hij het (op de koop toe nemen), bij schuld 'hoopt' hij dat het niet gebeurt."
    },
    {
      q: "In het Porsche-arrest (HR 1996) nam de Hoge Raad géén voorwaardelijk opzet aan. Welke contra-indicatie was doorslaggevend?",
      options: [
        "De verdachte was dronken en kon dus niet helder denken.",
        "Door eerdere inhaalpogingen af te breken, toonde hij aan het risico juist *niet* te willen aanvaarden.",
        "De snelheidsovertreding was niet hoog genoeg voor opzet.",
        "De verdachte had geen ruzie met de slachtoffers."
      ],
      correct: 1,
      exp: "Het afbreken van eerdere pogingen objectiveerde dat hij het gevaar zag maar het probeerde te vermijden (hoe onverantwoord ook), dus geen 'aanvaarding'."
    },
    {
      q: "Bij welke gradatie van culpa spreekt men van 'buwal-bewustzijn' (Bewust Onterecht Waarnemen)?",
      options: [
        "Onbewuste schuld.",
        "Bewuste schuld.",
        "Roekeloosheid.",
        "Voorwaardelijk opzet."
      ],
      correct: 1,
      exp: "Bij bewuste schuld ziet de dader het gevaar, maar schat hij ten onrechte in dat het goed zal aflopen (Buwal)."
    },
    {
      q: "Wat houdt 'geobjectiveerd opzet' in bij bijvoorbeeld art. 180 Sr (Wederspannigheid)?",
      options: [
        "De dader moet opzet hebben op de mishandeling, maar niet op de dood.",
        "De dader moet opzet hebben op het verzet, maar zijn opzet hoeft niet gericht te zijn op de 'rechtmatigheid' van de ambtshandeling.",
        "De rechter mag het opzet afleiden uit algemene ervaringsregels.",
        "Het opzet wordt verondersteld aanwezig te zijn bij dronkenschap."
      ],
      correct: 1,
      exp: "Het bestanddeel 'in de rechtmatige uitoefening' is geobjectiveerd: de dader hoeft niet te weten dat de agent rechtmatig handelt om strafbaar te zijn."
    },
    {
      q: "Welke causaliteitsleer is gehanteerd in het arrest 'Letale Longembolie'?",
      options: [
        "De leer van de adequate veroorzaking (voorzienbaarheid).",
        "De leer van de redelijke toerekening.",
        "De conditio sine qua non leer.",
        "De causa proxima leer."
      ],
      correct: 1,
      exp: "De HR stapte af van strikte voorzienbaarheid. De vraag is: kan het gevolg in redelijkheid aan de dader worden toegerekend, gezien de aard van de gedraging en het letsel?"
    },

    // --- WEEK 3: FORMEEL STRAFRECHT INTRO ---
    {
      q: "Art. 27 Sv definieert de verdachte. Welke drie elementen zijn cumulatief vereist voor het materiële verdachtenbegrip?",
      options: [
        "1. Aanhouding, 2. Proces-verbaal, 3. Voorgeleiding.",
        "1. Redelijk vermoeden van schuld, 2. Aan een strafbaar feit, 3. Voortvloeiend uit feiten of omstandigheden.",
        "1. Aanwijzing door OvJ, 2. Heterdaad, 3. Strafbaar feit.",
        "1. Individualiseerbaarheid, 2. Noodzakelijkheid, 3. Proportionaliteit."
      ],
      correct: 1,
      exp: "Het vermoeden moet gebaseerd zijn op objectieve feiten/omstandigheden, niet op een 'onderbuikgevoel' (Caribian Nights)."
    },
    {
      q: "Wat is het wezenlijke verschil tussen de 'justitiële taak' en de 'preventieve taak' van de politie?",
      options: [
        "De justitiële taak is onder gezag van de Burgemeester, de preventieve onder de OvJ.",
        "Bij de justitiële taak (opsporing) gelden de waarborgen van Sv, bij de preventieve taak (openbare orde) de Politiewet.",
        "Alleen bij de preventieve taak mag geweld gebruikt worden.",
        "De preventieve taak richt zich alleen op misdrijven."
      ],
      correct: 1,
      exp: "Opsporing (justitieel) = art. 132 Sv, onder gezag OvJ. Handhaving openbare orde (preventief) = Politiewet, onder gezag Burgemeester."
    },
    {
      q: "Welk beginsel van behoorlijke procesorde werd geschonden in het arrest 'Plastic boodschappentasje'?",
      options: [
        "Het vertrouwensbeginsel.",
        "Het gelijkheidsbeginsel.",
        "De cautieplicht (Nemo Tenetur).",
        "Het verbod op détournement de pouvoir."
      ],
      correct: 2,
      exp: "De politie bleef vragen stellen aan de verdachte ('van wie is dat tasje?') zonder de cautie te geven, terwijl er al een redelijk vermoeden van schuld was."
    },
    {
      q: "Wie heeft het 'vervolgingsmonopolie' in Nederland?",
      options: [
        "De Rechter-Commissaris.",
        "De politie.",
        "Het Openbaar Ministerie.",
        "Het slachtoffer (via art. 12 Sv)."
      ],
      correct: 2,
      exp: "Alleen het OM kan besluiten een zaak voor de strafrechter te brengen. Een slachtoffer kan dit alleen *afdwingen* via art. 12 Sv, maar vervolgt niet zelf."
    },
    {
      q: "Wat is de rol van de Rechter-Commissaris (R-C) in het vooronderzoek?",
      options: [
        "Het leiden van het opsporingsonderzoek (in plaats van de OvJ).",
        "Het beoordelen van de rechtmatigheid van dwangmiddelen en het horen van getuigen (onderzoeksrechter).",
        "Het bepalen van de uiteindelijke strafmaat.",
        "Het verdedigen van de belangen van de verdachte."
      ],
      correct: 1,
      exp: "De R-C toetst de inzet van zware dwangmiddelen (zoals bewaring, doorzoeking woning) en waarborgt de rechtmatigheid in het vooronderzoek."
    },

    // --- WEEK 4: DWANGMIDDELEN ---
    {
      q: "Mag een burger een verdachte aanhouden?",
      options: [
        "Nee, nooit. Dit is het geweldsmonopolie van de overheid.",
        "Ja, maar alleen op heterdaad (art. 53 Sv).",
        "Ja, mits hij hiervoor een burgerarrest-vergunning heeft.",
        "Ja, ook buiten heterdaad als de politie niet beschikbaar is."
      ],
      correct: 1,
      exp: "Art. 53 Sv: 'In geval van ontdekking op heterdaad is ieder bevoegd...' Buiten heterdaad is het voorbehouden aan opsporingsambtenaren (art. 54 Sv)."
    },
    {
      q: "Hoe lang duurt de termijn van 'Ophouden voor onderzoek' bij een misdrijf waarvoor voorlopige hechtenis mogelijk is?",
      options: [
        "6 uur.",
        "9 uur.",
        "3 dagen.",
        "15 uur."
      ],
      correct: 1,
      exp: "De basis is 9 uur bij VH-feiten (art. 56a lid 2 Sv). Bij lichtere feiten is het 6 uur. De tijd tussen 00:00 en 09:00 telt niet mee."
    },
    {
      q: "Aan welke vier cumulatieve voorwaarden moet voldaan zijn voor een bevel Voorlopige Hechtenis?",
      options: [
        "1. Misdrijf, 2. Dader bekend, 3. Vluchtgevaar, 4. Bewijs.",
        "1. Geval (art 67), 2. Gronden (art 67a), 3. Ernstige bezwaren, 4. Anticipatiegebod.",
        "1. Heterdaad, 2. Ernstige bezwaren, 3. Collusiegevaar, 4. Recidive.",
        "1. Bevel OvJ, 2. Bevel R-C, 3. Raadkamer, 4. Vonnis."
      ],
      correct: 1,
      exp: "Het moet een VH-waardig feit zijn (geval), er moet een reden zijn (grond), er moet veel bewijs zijn (ernstige bezwaren) en het mag niet langer duren dan de straf (anticipatie)."
    },
    {
      q: "Wie is bevoegd tot het doorzoeken van een woning ter inbeslagneming *tegen de wil* van de bewoner?",
      options: [
        "De Officier van Justitie.",
        "De Hulpofficier van Justitie (met machtiging).",
        "De Rechter-Commissaris (R-C).",
        "De politiechef."
      ],
      correct: 2,
      exp: "Het huisrecht is strikt. Doorzoeking (stelselmatig en gericht zoeken) in een woning is een exclusieve bevoegdheid van de R-C (art. 110 Sv), behoudens spoed (art. 97 Sv)."
    },
    {
      q: "Wat houdt het beginsel van 'subsidiariteit' in bij de toepassing van dwangmiddelen?",
      options: [
        "Het dwangmiddel moet in verhouding staan tot het doel.",
        "Men moet kiezen voor het minst ingrijpende middel dat hetzelfde doel bereikt.",
        "Het dwangmiddel mag niet gebruikt worden voor een ander doel (détournement).",
        "Het dwangmiddel moet wettelijk geregeld zijn."
      ],
      correct: 1,
      exp: "Proportionaliteit = verhouding doel/middel. Subsidiariteit = is er een lichter alternatief? (Bijv. staande houden i.p.v. aanhouden)."
    },

    // --- WEEK 5: VERVOLGING ---
    {
      q: "Wat is het verschil tussen een 'technisch sepot' en een 'beleidssepot'?",
      options: [
        "Technisch = onvoldoende bewijs/niet strafbaar; Beleids = wel haalbaar, maar niet opportuun (algemeen belang).",
        "Technisch = door de politie; Beleids = door de OvJ.",
        "Technisch = voor overtredingen; Beleids = voor misdrijven.",
        "Technisch = voorwaardelijk; Beleids = onvoorwaardelijk."
      ],
      correct: 0,
      exp: "Technisch sepot (code 01/02) betekent dat de zaak juridisch niet rond komt. Beleidssepot (opportuniteitsbeginsel) betekent dat vervolging niet wenselijk is."
    },
    {
      q: "Wat is de functie van de strafbeschikking (Wet OM-afdoening)?",
      options: [
        "De OvJ kan zelf straffen opleggen (behalve gevangenisstraf) zonder tussenkomst van de rechter.",
        "De OvJ doet een schikkingsvoorstel (transactie) dat de verdachte mag weigeren.",
        "De politie mag direct boetes innen op straat.",
        "De rechter legt een straf op via een verkorte procedure."
      ],
      correct: 0,
      exp: "De strafbeschikking is een daad van vervolging én berechting door het OM. Het is geen voorstel (zoals transactie), maar een strafoplegging. Verzet is nodig om het tegen te houden."
    },
    {
      q: "Wanneer is het OM 'niet-ontvankelijk' in de vervolging?",
      options: [
        "Als de dagvaarding nietig is.",
        "Als er onvoldoende wettig en overtuigend bewijs is.",
        "Als er sprake is van een vervolgingsbeletsel (verjaring, klacht, ne bis in idem).",
        "Als de verdachte ontoerekeningsvatbaar is."
      ],
      correct: 2,
      exp: "Niet-ontvankelijkheid ziet op de bevoegdheid om te vervolgen. Als die bevoegdheid er niet (meer) is door een beletsel, stopt de zaak."
    },
    {
      q: "Kan een slachtoffer het OM dwingen tot vervolging als de zaak is geseponeerd?",
      options: [
        "Nee, het OM heeft het vervolgingsmonopolie.",
        "Ja, via de beklagprocedure van artikel 12 Sv bij het Gerechtshof.",
        "Ja, via een kort geding bij de civiele rechter.",
        "Alleen bij levensdelicten."
      ],
      correct: 1,
      exp: "De Art. 12 Sv-procedure is de enige uitzondering op het vervolgingsmonopolie: het Hof kan het OM bevelen alsnog te vervolgen."
    },
    {
      q: "Wat gebeurt er als de verdachte het niet eens is met een strafbeschikking?",
      options: [
        "Hij moet in hoger beroep gaan bij het Hof.",
        "Hij moet binnen 14 dagen in verzet gaan bij het OM.",
        "Hij moet de boete niet betalen, dan komt het vanzelf voor de rechter.",
        "Hij kan een herziening aanvragen."
      ],
      correct: 1,
      exp: "Het rechtsmiddel tegen een strafbeschikking heet 'verzet' (art. 257e Sv). Na 14 dagen wordt de beschikking onherroepelijk."
    },

    // --- WEEK 6: TERECHTZITTING & 348/350 SV ---
    {
      q: "Wat is de dwingende volgorde van de voorvragen van art. 348 Sv?",
      options: [
        "1. Bevoegdheid rechter, 2. Geldigheid dagvaarding, 3. Ontvankelijkheid OM, 4. Schorsing vervolging.",
        "1. Geldigheid dagvaarding, 2. Bevoegdheid rechter, 3. Ontvankelijkheid OM, 4. Schorsing vervolging.",
        "1. Ontvankelijkheid OM, 2. Geldigheid dagvaarding, 3. Bevoegdheid rechter, 4. Schorsing vervolging.",
        "De volgorde maakt niet uit, als ze maar allemaal beantwoord worden."
      ],
      correct: 1,
      exp: "Ezelsbruggetje: G-B-O-S. Eerst moet de oproep (G) kloppen, dan de rechter (B), dan de vervolger (O), dan de situatie (S)."
    },
    {
      q: "Wanneer is een dagvaarding nietig?",
      options: [
        "Als de verdachte niet op de zitting verschijnt.",
        "Als de tenlastelegging innerlijk tegenstrijdig of onduidelijk is (obscuur libel).",
        "Als de naam van de verdachte verkeerd gespeld is.",
        "Als het bewijs in het dossier ontbreekt."
      ],
      correct: 1,
      exp: "De functie van de dagvaarding is informeren. Als de verdachte niet kan weten waarvan hij beschuldigd wordt (obscuur), is de dagvaarding nietig."
    },
    {
      q: "Wat houdt de 'grondslagleer' in bij de bewijsvraag (art. 350 Sv)?",
      options: [
        "De rechter moet de materiële waarheid vinden, ongeacht wat er op papier staat.",
        "De rechter is gebonden aan de tekst van de tenlastelegging en mag daar niet buiten treden.",
        "De rechter mag de tenlastelegging zelfstandig wijzigen om tot een veroordeling te komen.",
        "De grondslag van het vonnis is het politiedossier."
      ],
      correct: 1,
      exp: "De tenlastelegging bepaalt de omvang van het geding. Wat niet ten laste is gelegd, kan niet bewezen worden verklaard (tyrannie van de tenlastelegging)."
    },
    {
      q: "Stel: het feit is bewezen en kwalificeerbaar, maar de verdachte beroept zich succesvol op 'noodweerexces'. Wat volgt?",
      options: [
        "Vrijspraak.",
        "Ontslag van alle rechtsvervolging (OVAR) wegens niet-strafbaarheid van het feit.",
        "OVAR wegens niet-strafbaarheid van de dader.",
        "Veroordeling zonder strafoplegging."
      ],
      correct: 2,
      exp: "Noodweerexces is een schulduitsluitingsgrond. Het feit blijft strafbaar (wederrechtelijk), maar de dader is niet verwijtbaar. Dus OVAR (dader)."
    },
    {
      q: "Wat is het verschil tussen schorsing (art. 281 Sv) en onderbreking (art. 277 Sv) van de zitting?",
      options: [
        "Onderbreking is voor onbepaalde tijd, schorsing voor bepaalde tijd.",
        "Onderbreking is kort en de zitting gaat dezelfde dag verder; schorsing is uitstel naar een andere dag.",
        "Schorsing stopt de voorlopige hechtenis, onderbreking niet.",
        "Er is geen juridisch verschil."
      ],
      correct: 1,
      exp: "Onderbreking is een pauze (lunch/beraad). Schorsing (in de praktijk: aanhouding) betekent dat het onderzoek op een latere datum verdergaat."
    },

    // --- WEEK 7: SANCTIES ---
    {
      q: "Wat is het 'absorptiestelsel' bij eendaadse samenloop (art. 55 lid 1 Sr)?",
      options: [
        "De straffen worden bij elkaar opgeteld.",
        "Alleen de bepaling met de zwaarste hoofdstraf wordt toegepast.",
        "De zwaarste straf wordt met 1/3 verhoogd.",
        "De straffen worden geabsorbeerd door de ISD-maatregel."
      ],
      correct: 1,
      exp: "Bij eendaadse samenloop (1 daad, 2 regels) geldt absorptie: je krijgt maar 1 straf, gebaseerd op het zwaarste delict."
    },
    {
      q: "Kan de maatregel 'onttrekking aan het verkeer' worden opgelegd bij vrijspraak?",
      options: [
        "Nee, nooit. Geen straf zonder schuld.",
        "Ja, op grond van art. 36b Sr, als het goed gevaarlijk of verboden is.",
        "Alleen bij overtredingen.",
        "Alleen als de verdachte afstand doet van het goed."
      ],
      correct: 1,
      exp: "Ja. Deze maatregel is gericht op beveiliging, niet op leedtoevoeging. Een verboden wapen moet van straat, ook als de drager wordt vrijgesproken."
    },
    {
      q: "Wat is het verschil tussen een hoofdstraf en een bijkomende straf?",
      options: [
        "Hoofdstraffen zijn verplicht, bijkomende straffen optioneel.",
        "Een bijkomende straf kan alleen samen met een hoofdstraf worden opgelegd (of bij schuldigverklaring zonder straf).",
        "Hoofdstraffen staan in art. 9 Sr, bijkomende straffen in bijzondere wetten.",
        "Bijkomende straffen zijn altijd geldboetes."
      ],
      correct: 1,
      exp: "Je kunt niet *alleen* veroordeeld worden tot 'ontzetting uit het kiesrecht'. Het moet 'erbij' komen (of i.p.v. straf bij art 9a)."
    },
    {
      q: "Wat houdt de ISD-maatregel in?",
      options: [
        "Inrichting voor Stelselmatige Daders: een maatregel van 2 jaar voor veelplegers.",
        "Internationale Strafrecht Detentie.",
        "Inverzekeringstelling Dagen.",
        "Een taakstraf voor jongeren."
      ],
      correct: 0,
      exp: "ISD is een maatregel (geen straf) bedoeld om veelplegers uit de samenleving te halen en te behandelen. Duur is meestal 2 jaar."
    },
    {
      q: "Wat is de maximale duur van een tijdelijke gevangenisstraf bij meerdaadse samenloop?",
      options: [
        "30 jaar.",
        "De som van de straffen.",
        "Het zwaarste maximum + 1/3 (met een absoluut maximum van 30 jaar).",
        "Levenslang."
      ],
      correct: 2,
      exp: "Art. 57 Sr: Cumulatie met beperking. Je telt ze op, maar het mag niet meer zijn dan het zwaarste feit + 33%, en nooit meer dan 30 jaar."
    },

    // --- RECHTSMIDDELEN ---
    {
      q: "Tegen welke beslissing staat 'cassatie' open?",
      options: [
        "Tegen een vonnis van de rechtbank.",
        "Tegen een arrest van het gerechtshof.",
        "Tegen een strafbeschikking.",
        "Tegen een beslissing van de politie."
      ],
      correct: 1,
      exp: "Rechtbank -> Hoger Beroep (Hof) -> Cassatie (Hoge Raad). Je mag niet 'springen' van Rechtbank naar Hoge Raad."
    },
    {
      q: "Wat toetst de Hoge Raad in cassatie?",
      options: [
        "De feiten (wordt de zaak opnieuw gedaan?).",
        "Alleen rechtsvragen en vormverzuimen (geen nieuw feitenonderzoek).",
        "De hoogte van de straf (strafmaatverweer).",
        "De geloofwaardigheid van de getuigen."
      ],
      correct: 1,
      exp: "De Hoge Raad is cassatierechter, geen feitenrechter. De feiten zoals vastgesteld door het Hof staan vast ('voldongen feit')."
    },
    {
      q: "Wat is 'herziening ten nadele' en wanneer kan dit?",
      options: [
        "Het OM gaat in hoger beroep.",
        "Een onherroepelijke vrijspraak wordt heropend wegens een 'novum' (DNA) of 'falsa' (bedrog).",
        "De straf wordt verhoogd tijdens de tenuitvoerlegging.",
        "De Hoge Raad vernietigt een vonnis in het nadeel van de verdachte."
      ],
      correct: 1,
      exp: "Sinds 2013 kan een afgesloten zaak heropend worden ten nadele van de verdachte, maar alleen bij zeer ernstige misdrijven (novum) of bedrog (falsa)."
    },
    {
      q: "Wanneer heeft een verdachte GEEN recht op hoger beroep bij een overtreding?",
      options: [
        "Als de boete lager is dan €50 (art. 404 Sv).",
        "Als hij de feiten heeft bekend.",
        "Als hij geen advocaat had.",
        "Als de OvJ ook niet in beroep gaat."
      ],
      correct: 0,
      exp: "Bij bagatelzaken (overtredingen met lage boete) is de rechtsgang beperkt om het systeem niet te overbelasten (verlofstelsel)."
    },
    {
      q: "Wat is 'cassatie in het belang der wet'?",
      options: [
        "Een gewoon rechtsmiddel voor de verdachte.",
        "Een buitengewoon rechtsmiddel ingesteld door de Procureur-Generaal om een rechtsvraag te verhelderen, zonder gevolgen voor partijen.",
        "Een cassatieberoep van het slachtoffer.",
        "Een spoedprocedure bij de Hoge Raad."
      ],
      correct: 1,
      exp: "Dit middel (art. 461 Sv) dient de rechtseenheid. De uitspraak in de concrete zaak verandert niet, maar de Hoge Raad schept duidelijkheid voor de toekomst."
    },

    // --- GEMENGD / SPECIFIEKE CASUS ---
    {
      q: "Klaas steelt een fiets. In de delictsomschrijving (310 Sr) staat 'oogmerk van wederrechtelijke toe-eigening'. Klaas dacht dat het zijn eigen fiets was. Wat is het gevolg?",
      options: [
        "Vrijspraak wegens ontbreken van het bestanddeel 'oogmerk'.",
        "OVAR wegens dwaling omtrent de feiten.",
        "Veroordeling, want onwetendheid excuseert niet.",
        "Sepot wegens gering feit."
      ],
      correct: 0,
      exp: "Oogmerk is een bestanddeel. Als Klaas denkt dat het zijn fiets is, heeft hij niet het oogmerk zich de fiets *wederrechtelijk* toe te eigenen. Bestanddeel niet bewezen -> Vrijspraak."
    },
    {
      q: "Wat is het verschil tussen 'bewaring' en 'gevangenhouding' in de voorlopige hechtenis?",
      options: [
        "Bewaring is door de R-C (14 dagen), gevangenhouding door de Raadkamer (max 90 dagen).",
        "Bewaring is op het bureau, gevangenhouding in de gevangenis.",
        "Bewaring is voor overtredingen, gevangenhouding voor misdrijven.",
        "Er is geen verschil, het zijn synoniemen."
      ],
      correct: 0,
      exp: "Bewaring is de eerste fase van de VH (bevolen door R-C). Gevangenhouding is het vervolg (bevolen door de rechtbank in raadkamer)."
    },
    {
      q: "Mag de OvJ een getuige weigeren die door de verdediging is opgegeven?",
      options: [
        "Nee, de verdediging heeft onbeperkt recht op getuigen.",
        "Ja, op grond van art. 264 Sv (o.a. niet in het belang van de verdediging, of gezondheid getuige).",
        "Alleen als de getuige in het buitenland woont.",
        "Alleen met toestemming van de minister."
      ],
      correct: 1,
      exp: "Het ondervragingsrecht is niet absoluut. De OvJ (en later de rechter) kan weigeren op wettelijke gronden, zoals het 'verdedigingsbelang-criterium'."
    },
    {
      q: "Wat houdt de 'leer van de redelijke toerekening' in?",
      options: [
        "Een schadevergoedingsmaatregel.",
        "Een causaliteitstheorie: is het redelijk om het gevolg toe te rekenen aan de gedraging (bijv. bij medische fouten van derden)?",
        "Een regel voor toerekeningsvatbaarheid (TBS).",
        "Een bewijsregel voor opzet."
      ],
      correct: 1,
      exp: "Vervangt de strenge 'voorzienbaarheid'. Zelfs als het gevolg onverwacht is (zeldzame complicatie), kan het toch causaal zijn aan de klap als dat 'redelijk' is."
    },
    {
      q: "Wat is een 'formele vraag' in art 348 Sv vs een 'materiële vraag' in 350 Sv?",
      options: [
        "Formeel gaat over de procedure (geldigheid dagvaarding), materieel over de inhoud (bewijs/strafbaarheid).",
        "Formeel is schriftelijk, materieel is mondeling.",
        "Formeel is voor de griffier, materieel voor de rechter.",
        "Er is geen verschil."
      ],
      correct: 0,
      exp: "348 Sv (voorvragen) toetst of de zaak überhaupt behandeld mag worden. 350 Sv (hoofdvragen) toetst of de verdachte het gedaan heeft en strafbaar is."
    },
    {
      q: "Wanneer begint de 'redelijke termijn' van art. 6 EVRM te lopen?",
      options: [
        "Vanaf het moment van de 'criminal charge' (bijv. eerste verhoor als verdachte).",
        "Vanaf de dagvaarding.",
        "Vanaf het moment van het delict.",
        "Vanaf de uitspraak van de rechter."
      ],
      correct: 0,
      exp: "De termijn start bij de 'handeling waardoor de overheid de verwachting wekt dat vervolging zal plaatsvinden'. Dat is vaak het eerste politieverhoor."
    },
    {
      q: "Wat is het rechtsgevolg van overschrijding van de redelijke termijn?",
      options: [
        "Niet-ontvankelijkheid van het OM.",
        "Vrijspraak.",
        "Strafvermindering.",
        "Schorsing van de vervolging."
      ],
      correct: 2,
      exp: "Volgens vaste jurisprudentie leidt termijnoverschrijding in principe tot strafvermindering (compensatie), niet tot het eindigen van de zaak."
    },
    {
      q: "Is een 'poging' tot overtreding strafbaar?",
      options: [
        "Ja, altijd.",
        "Nee, poging tot overtreding is niet strafbaar (art. 45 Sr).",
        "Alleen bij zware overtredingen.",
        "Ja, maar met de helft van de straf."
      ],
      correct: 1,
      exp: "Art. 45 Sr: 'Poging tot misdrijf is strafbaar'. Poging tot overtreding dus niet. (Denk aan: proberen door rood te lopen)."
    },
    {
      q: "Wat is 'Vrijwillige terugtred' bij een poging?",
      options: [
        "De dader stopt uit zichzelf voordat het delict voltooid is -> niet strafbaar voor de poging.",
        "De dader bekent schuld na afloop -> strafvermindering.",
        "De dader wordt gestoord door de politie en stopt.",
        "De dader geeft zichzelf aan."
      ],
      correct: 0,
      exp: "Als het delict niet voltooid wordt door omstandigheden van de wil van de dader (hij krijgt spijt en stopt), vervalt de strafbaarheid van de poging (art. 46b Sr)."
    },
    {
      q: "Wat is het verschil tussen 'Medeplegen' en 'Medeplichtigheid'?",
      options: [
        "Medeplegen is samen uitvoeren (nauwe samenwerking), medeplichtigheid is helpen (ondersteunen).",
        "Medeplegen is zwaarder gestraft, medeplichtigheid is straffeloos.",
        "Medeplichtigheid is alleen voor de 'mastermind'.",
        "Er is geen verschil."
      ],
      correct: 0,
      exp: "Medeplegers zijn partners (samen de klus klaren). De medeplichtige is de helper (levert het wapen of staat op de uitkijk). De medeplichtige krijgt max 2/3 van de straf."
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
      confetti({ particleCount: 250, spread: 100, origin: { y: 0.6 }, colors: ['#4f46e5', '#ec4899', '#f59e0b'] }); 
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
  
  // Expert styling colors (Slate/Indigo/Amber for a serious academic look)
  const barColorClass = showFeedback ? (isCorrect ? 'bg-indigo-600' : 'bg-amber-600') : 'bg-slate-600';

  return (
    <div className="w-full min-h-screen bg-slate-100 font-serif antialiased pb-20">
      <nav className="h-20 bg-white border-b border-slate-200 px-10 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tighter text-slate-800">EXPERT QUIZ</span>
          <span className="text-[9px] uppercase tracking-[0.4em] text-indigo-600 font-black italic">Master Strafrecht — Score: {currentScore} / {QUESTIONS.length}</span>
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
                <div className="w-64 h-64 rounded-full border-[12px] border-white shadow-2xl overflow-hidden mx-auto bg-slate-200 flex items-center justify-center">
                    <span className="text-6xl">⚖️</span>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-indigo-600 text-white w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-xl rotate-12 border-4 border-white">
                    <span className="text-3xl font-bold">{QUESTIONS.length}</span>
                    <span className="text-[8px] uppercase font-black">Expert</span>
                </div>
              </div>
              <h1 className="text-6xl font-bold text-slate-900 leading-tight font-serif italic tracking-tight">De Meesterproef.</h1>
              <p className="text-slate-500 text-2xl italic font-light max-w-2xl mx-auto">Dogmatiek, Jurisprudentie & Formaliteiten.</p>
              <button onClick={() => setGameState('quiz')} className="px-16 py-6 bg-slate-900 text-white rounded-full font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:scale-105 transition-all">Start Examen</button>
            </motion.div>
          )}

          {gameState === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-200 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 transition-colors duration-500 ${barColorClass}`} />
                <div className="flex justify-between items-center mb-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vraag {currentIdx + 1} van {QUESTIONS.length}</span>
                    {showFeedback && (
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${isCorrect ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                    )}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 leading-snug mb-12 font-serif italic tracking-tight">{QUESTIONS[currentIdx].q}</h2>
                <div className="grid grid-cols-1 gap-4">
                  {QUESTIONS[currentIdx].options.map((opt, i) => {
                    const isCorrectOption = i === QUESTIONS[currentIdx].correct;
                    const isSelected = i === userAnswers[currentIdx];
                    let colorClasses = "bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-900";
                    if (showFeedback) {
                      if (isCorrectOption) colorClasses = "!bg-indigo-600 !border-indigo-700 !text-white shadow-lg";
                      else if (isSelected) colorClasses = "!bg-amber-600 !border-amber-700 !text-white opacity-90";
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
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-10 p-8 rounded-3xl border-l-8 ${isCorrect ? 'bg-indigo-50 border-indigo-500' : 'bg-amber-50 border-amber-500'}`}>
                      <h4 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-3 ${isCorrect ? 'text-indigo-700' : 'text-amber-700'}`}>Juridische Analyse</h4>
                      <p className="text-slate-700 italic text-lg leading-relaxed font-sans">{QUESTIONS[currentIdx].exp}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-between mt-12 pt-8 border-t border-slate-100">
                    <button onClick={handleBack} disabled={currentIdx === 0} className={`flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] transition-all ${currentIdx === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-900 hover:text-indigo-600'}`}>← Vorige</button>
                    <button onClick={handleNext} disabled={!isAnswered} className={`px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-md ${!isAnswered ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-black'}`}>
                        {currentIdx === QUESTIONS.length - 1 ? "Resultaat" : "Volgende →"}
                    </button>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'results' && (
            <motion.div key="results" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
              <div className="bg-white p-24 rounded-[5rem] shadow-2xl border border-slate-200 inline-block w-full relative">
                <div className="absolute top-0 left-0 w-full h-4 bg-indigo-600" />
                <h2 className="text-5xl font-bold text-slate-900 mb-4 font-serif italic tracking-tight">Eindbeoordeling</h2>
                <div className="text-[12rem] font-black leading-none text-slate-900 my-10">{currentScore}</div>
                <p className="text-4xl font-serif italic text-slate-600 mb-12">Cijfer: {((currentScore/QUESTIONS.length)*9 + 1).toFixed(1)}</p>
                <button onClick={() => window.location.reload()} className="px-16 py-6 border-2 border-slate-900 text-slate-900 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:text-white transition-all shadow-lg">Opnieuw proberen</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default StrafrechtExpertQuiz;