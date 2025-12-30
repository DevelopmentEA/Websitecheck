import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const StrafrechtExpertInteractive = () => {
  // --- STATE MANAGEMENT ---
  const [p1Answers, setP1Answers] = useState({});
  const [p1Submitted, setP1Submitted] = useState(false);

  const [p2SetIndex, setP2SetIndex] = useState(0); 
  const [p2Answers, setP2Answers] = useState({}); 
  const [p2Submitted, setP2Submitted] = useState(false);

  // --- DATA DEEL 1: WAAR / NIET WAAR ---
  const TF_QUESTIONS = useMemo(() => [
    {
      id: 1,
      stmt: "Als 'wederrechtelijk' in de delictsomschrijving staat en er is sprake van een rechtvaardigingsgrond, volgt OVAR.",
      isTrue: false,
      exp: "Onjuist. Omdat het een bestanddeel is, leidt het ontbreken ervan tot Vrijspraak (bestanddeel niet bewezen)."
    },
    {
      id: 2,
      stmt: "De Hoge Raad toetst in cassatie niet de feiten, maar alleen of het recht juist is toegepast.",
      isTrue: true,
      exp: "Juist. De Hoge Raad is een cassatierechter, geen feitenrechter."
    },
    {
      id: 3,
      stmt: "In het Porsche-arrest was de doorslaggevende factor voor 'schuld' dat de bestuurder dronken was.",
      isTrue: false,
      exp: "Onjuist. De contra-indicatie was dat hij eerdere inhaalpogingen afbrak (hij wilde het risico vermijden), wat wees op ontbreken van aanvaarding."
    },
    {
      id: 4,
      stmt: "Bij eendaadse samenloop worden de strafmaxima bij elkaar opgeteld.",
      isTrue: false,
      exp: "Onjuist. Bij eendaadse samenloop geldt het absorptiestelsel (alleen de zwaarste telt)."
    },
    {
      id: 5,
      stmt: "De maatregel 'onttrekking aan het verkeer' kan ook bij vrijspraak worden opgelegd.",
      isTrue: true,
      exp: "Juist. Gevaarlijke goederen (drugs/wapens) kunnen onttrokken worden ter beveiliging, ongeacht de schuldvraag."
    },
    {
      id: 6,
      stmt: "Een dagvaarding is nietig als de naam van de verdachte verkeerd is gespeld.",
      isTrue: false,
      exp: "Onjuist. Alleen als de identiteit onduidelijk is voor de rechter/verdachte. Een verschrijving leidt niet direct tot nietigheid."
    },
    {
      id: 7,
      stmt: "Het anticipatiegebod houdt in dat voorlopige hechtenis niet langer mag duren dan de te verwachten straf.",
      isTrue: true,
      exp: "Juist. Dit is vastgelegd in art. 67a lid 3 Sv."
    },
    {
      id: 8,
      stmt: "Lex Certa houdt in dat de wetgever geen enkele vage term mag gebruiken.",
      isTrue: false,
      exp: "Onjuist. Enige vaagheid is toegestaan om wetgeving werkbaar te houden (zie arrest 'Onbehoorlijk gedrag')."
    },
    {
      id: 9,
      stmt: "De Rechter-Commissaris is exclusief bevoegd tot het doorzoeken van een woning ter inbeslagneming (behoudens spoed).",
      isTrue: true,
      exp: "Juist. Het huisrecht weegt zwaar, dus de R-C moet dit toetsen."
    },
    {
      id: 10,
      stmt: "Herziening ten nadele is in Nederland onder geen enkele omstandigheid mogelijk.",
      isTrue: false,
      exp: "Onjuist. Sinds 2013 is dit mogelijk bij een 'novum' (zeer ernstig delict) of een 'falsa' (bedrog/meineed)."
    },
  ], []);

  // --- DATA DEEL 2: MATCHING ---
  const MATCHING_SETS = useMemo(() => [
    {
      title: "Ronde 1: Basisbegrippen",
      pairs: [
        { term: "Legaliteitsbeginsel", match: "C" },
        { term: "Materieel Strafrecht", match: "E" }, 
        { term: "Formeel Strafrecht", match: "B" },
        { term: "Opportuniteitsbeginsel", match: "A" },
        { term: "Opzet met zekerheidsbewustzijn", match: "D" },
      ],
      definitions: [
        { key: "A", text: "Het OM is niet verplicht te vervolgen (beleidssepot)." },
        { key: "B", text: "De regels van het proces (Wetboek van Strafvordering)." },
        { key: "C", text: "Geen feit is strafbaar dan uit kracht van een daaraan voorafgegane wettelijke strafbepaling." },
        { key: "D", text: "De dader wil het gevolg niet primair, maar weet dat het zeker zal gebeuren." },
        { key: "E", text: "Het recht dat bepaalt welk gedrag strafbaar is (Wetboek van Strafrecht)." }
      ]
    },
    {
      title: "Ronde 2: Jurisprudentie",
      pairs: [
        { term: "Hollende Kleurling", match: "B" },
        { term: "Porsche Arrest", match: "D" },
        { term: "Letale Longembolie", match: "A" },
        { term: "Melk en Water", match: "E" },
        { term: "Hoornse Taart", match: "C" },
      ],
      definitions: [
        { key: "A", text: "Introductie van de leer van de redelijke toerekening (Causaliteit)." },
        { key: "B", text: "Redelijk vermoeden van schuld moet gebaseerd zijn op objectieve feiten." },
        { key: "C", text: "Eerste keer dat voorwaardelijk opzet werd aangenomen." },
        { key: "D", text: "Grens tussen voorwaardelijk opzet en bewuste schuld (contra-indicaties)." },
        { key: "E", text: "Geen straf zonder schuld (AVAS)." }
      ]
    },
    {
      title: "Ronde 3: Sancties & Maatregelen",
      pairs: [
        { term: "TBS", match: "C" },
        { term: "ISD", match: "A" },
        { term: "Onttrekking aan het verkeer", match: "E" },
        { term: "Schadevergoeding", match: "B" },
        { term: "Gevangenisstraf", match: "D" },
      ],
      definitions: [
        { key: "A", text: "Maatregel voor stelselmatige daders (veelplegers)." },
        { key: "B", text: "Maatregel om het slachtoffer financieel te compenseren." },
        { key: "C", text: "Maatregel voor ontoerekeningsvatbaren (beveiliging)." },
        { key: "D", text: "Vrijheidsbenemende hoofdstraf voor misdrijven." },
        { key: "E", text: "Maatregel voor gevaarlijke goederen (kan ook bij vrijspraak)." }
      ]
    },
    {
      title: "Ronde 4: Rechtsmiddelen & Dwang",
      pairs: [
        { term: "Cassatie", match: "B" },
        { term: "Herziening", match: "D" },
        { term: "Verzet", match: "A" },
        { term: "Inverzekeringstelling", match: "E" },
        { term: "Voorlopige Hechtenis", match: "C" },
      ],
      definitions: [
        { key: "A", text: "Rechtsmiddel tegen een strafbeschikking van het OM." },
        { key: "B", text: "Beroep bij de Hoge Raad over rechtsvragen (geen feiten)." },
        { key: "C", text: "Vrijheidsbeneming in afwachting van het proces (bewaring/gevangenhouding)." },
        { key: "D", text: "Buitengewoon rechtsmiddel bij een novum of falsa." },
        { key: "E", text: "Vrijheidsbeneming van max 3 (+3) dagen in belang van onderzoek." }
      ]
    }
  ], []);

  // --- HANDLERS ---
  const handleP1Select = (qId, val) => {
    setP1Answers(prev => ({ ...prev, [qId]: val }));
  };

  const checkPart1 = () => {
    setP1Submitted(true);
  };

  const handleP2Select = (termIndex, letter) => {
    setP2Answers(prev => ({ ...prev, [termIndex]: letter }));
  };

  const checkPart2Set = () => {
    setP2Submitted(true);
    const currentSet = MATCHING_SETS[p2SetIndex];
    const isAllCorrect = currentSet.pairs.every((p, i) => p2Answers[i] === p.match);
    if (isAllCorrect) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#C5A059', '#1A365D'] });
    }
  };

  const nextSet = () => {
    if (p2SetIndex < 3) {
      setP2SetIndex(prev => prev + 1);
      setP2Answers({});
      setP2Submitted(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-12 px-4 md:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-24">
        
        {/* HEADER */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A365D] font-serif italic tracking-tight">
            Interactief Practicum
          </h1>
          <p className="text-xs font-black tracking-[0.3em] uppercase text-[#C5A059]">
            Deel I: Waarheidsvinding • Deel II: Begrippenkader
          </p>
        </div>

        {/* --- DEEL 1: WAAR / NIET WAAR --- */}
        <section className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-full bg-[#1A365D] text-white flex items-center justify-center font-bold font-serif">I</div>
            <h2 className="text-xl font-bold text-[#1A365D]">Juridische Stellingen</h2>
          </div>

          <div className="space-y-6">
            {TF_QUESTIONS.map((q) => {
              // HIER ZIT DE FIX: We kijken naar de waarde van de state
              const selectedValue = p1Answers[q.id]; 
              const isCorrect = selectedValue === q.isTrue;
              
              // Helper functie voor dynamische stijlen
              const getButtonStyle = (isTrueButton) => {
                const isSelected = selectedValue === isTrueButton;
                
                // Als geselecteerd: Donkerblauw achtergrond, Witte tekst
                if (isSelected) {
                  return {
                    backgroundColor: '#1A365D',
                    color: 'white',
                    borderColor: '#1A365D',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  };
                }
                // Als niet geselecteerd: Wit achtergrond, Grijze tekst
                return {
                  backgroundColor: 'white',
                  color: '#64748b', // slate-500
                  borderColor: '#e2e8f0' // slate-200
                };
              };

              return (
                <div key={q.id} className="relative">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-sm md:text-base font-medium text-slate-700 flex-1 leading-relaxed">
                      <span className="font-bold text-[#1A365D] mr-3">{q.id}.</span>
                      {q.stmt}
                    </p>
                    
                    <div className="flex gap-2 shrink-0">
                      {/* KNOP WAAR */}
                      <button 
                        onClick={() => !p1Submitted && handleP1Select(q.id, true)}
                        style={getButtonStyle(true)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all border ${p1Submitted ? 'opacity-50 cursor-default' : 'hover:border-[#1A365D]'}`}
                      >
                        Waar
                      </button>

                      {/* KNOP NIET WAAR */}
                      <button 
                        onClick={() => !p1Submitted && handleP1Select(q.id, false)}
                        style={getButtonStyle(false)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all border ${p1Submitted ? 'opacity-50 cursor-default' : 'hover:border-[#1A365D]'}`}
                      >
                        Niet Waar
                      </button>
                    </div>
                  </div>

                  {/* FEEDBACK PANEL */}
                  <AnimatePresence>
                    {p1Submitted && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="overflow-hidden"
                      >
                        <div className={`mt-2 ml-4 p-4 rounded-xl border-l-4 text-sm ${isCorrect ? 'border-green-500 bg-green-50 text-green-800' : 'border-red-500 bg-red-50 text-red-800'}`}>
                          <div className="font-black uppercase text-[10px] tracking-widest mb-1">
                            {isCorrect ? "Correct" : "Incorrect"}
                          </div>
                          {q.exp}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            {!p1Submitted ? (
              <button 
                onClick={checkPart1}
                className="bg-[#C5A059] text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#b08d4b] transition-colors shadow-lg"
              >
                Controleer Antwoorden
              </button>
            ) : (
              <div className="text-[#1A365D] font-serif italic text-lg">
                Deel 1 Voltooid. Ga door naar de begrippen.
              </div>
            )}
          </div>
        </section>

        {/* --- DEEL 2: MATCHING --- */}
        <section className="bg-[#1A365D] rounded-[3rem] p-8 md:p-12 shadow-2xl text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#C5A059] text-white flex items-center justify-center font-bold font-serif">II</div>
              <div>
                <h2 className="text-xl font-bold">Begrippen Match</h2>
                <p className="text-[10px] uppercase tracking-widest text-white/60">Set {p2SetIndex + 1} van 4: {MATCHING_SETS[p2SetIndex].title}</p>
              </div>
            </div>
            {/* Progress dots */}
            <div className="flex gap-2">
              {[0,1,2,3].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === p2SetIndex ? 'bg-[#C5A059]' : 'bg-white/20'}`} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            {/* LEFT: QUESTIONS */}
            <div className="space-y-4">
              {MATCHING_SETS[p2SetIndex].pairs.map((pair, idx) => {
                const userVal = p2Answers[idx];
                const correctVal = pair.match;
                const isCorrect = userVal === correctVal;
                
                return (
                  <div key={idx} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <span className="font-bold text-sm">{pair.term}</span>
                    
                    <div className="flex items-center gap-3">
                      {/* DROPDOWN */}
                      <select 
                        disabled={p2Submitted}
                        value={userVal || ""}
                        onChange={(e) => handleP2Select(idx, e.target.value)}
                        className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-1 text-sm font-bold focus:outline-none focus:border-[#C5A059] appearance-none cursor-pointer text-center w-12 h-8"
                      >
                        <option value="" className="text-black">-</option>
                        {["A","B","C","D","E"].map(l => (
                          <option key={l} value={l} className="text-black">{l}</option>
                        ))}
                      </select>

                      {/* RESULT ICON */}
                      {p2Submitted && (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                          {isCorrect ? '✓' : correctVal}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* RIGHT: DEFINITIONS */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#C5A059] mb-4">Definities & Casus</h3>
              <div className="space-y-3">
                {MATCHING_SETS[p2SetIndex].definitions.map((def) => (
                  <div key={def.key} className="flex gap-3 text-sm text-white/80 leading-snug">
                    <span className="font-bold text-[#C5A059] shrink-0">{def.key}.</span>
                    <span>{def.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end relative z-10">
            {!p2Submitted ? (
              <button 
                onClick={checkPart2Set}
                className="bg-[#C5A059] text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#b08d4b] transition-colors shadow-lg"
              >
                Check Set {p2SetIndex + 1}
              </button>
            ) : (
              <button 
                onClick={nextSet}
                disabled={p2SetIndex === 3}
                className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-colors shadow-lg flex items-center gap-2 ${p2SetIndex === 3 ? 'bg-green-500 cursor-default' : 'bg-white text-[#1A365D] hover:bg-slate-200'}`}
              >
                {p2SetIndex === 3 ? "Training Voltooid!" : "Volgende Set →"}
              </button>
            )}
          </div>

        </section>

      </div>
    </div>
  );
};

export default StrafrechtExpertInteractive;