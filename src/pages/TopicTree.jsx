<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Gavel, AlertOctagon, CheckCircle2, Heart, Zap, X } from 'lucide-react';
import allQuestions from './vragen2.json';

const CourtroomRush = () => {
  const [gameState, setGameState] = useState('start'); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(22);
  const [lastResult, setLastResult] = useState(null); 
  const audioRef = useRef(null);

  // Verbeterde Randomization Functie
  const startGame = () => {
    if (!allQuestions || allQuestions.length === 0) return;
    
    // Volledige willekeurige sortering van de brondata
    const randomSelection = [...allQuestions]
      .sort(() => Math.random() - 0.5) 
      .slice(0, 20); 

    setQuestions(randomSelection);
    setGameState('playing');
    setScore(0);
    setLives(3);
    setCurrentIdx(0);
    setTimeLeft(22);
  };

  const resetTimer = () => setTimeLeft(22);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 0.1)), 100);
    } else if (timeLeft <= 0 && gameState === 'playing') {
      handleAnswer(null); 
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleAnswer = (userSaysCorrect) => {
    if (gameState !== 'playing') return;

    const question = questions[currentIdx];
    if (!question) return;

    const isActuallyCorrect = question.isCorrect;
    const isRightDecision = (userSaysCorrect === isActuallyCorrect);

    if (isRightDecision && userSaysCorrect !== null) {
      setScore(prev => prev + Math.ceil(timeLeft * 100));
      setLastResult('correct');
      if (userSaysCorrect === false) {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 }, colors: ['#6EE7B7', '#059669'] });
      }
    } else {
      setLives(prev => prev - 1);
      setLastResult('wrong');
    }

    setGameState('feedback');

    setTimeout(() => {
      if (lives <= 1 && !isRightDecision) {
        setGameState('result');
      } else if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setGameState('playing');
        setLastResult(null);
        resetTimer();
      } else {
        setGameState('result');
      }
    }, 10000); 
  };

  const getRank = () => {
    if (score > 15000) return "Raadsheer bij de Hoge Raad";
    if (score > 9000) return "Officier van Justitie";
    if (score > 4000) return "Advocaat-Stagiair";
    return "Rechtenstudent";
  };

  if (gameState === 'start') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-slate-900 p-6 text-center bg-slate-50 font-sans">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="w-20 h-20 bg-[#6EE7B7]/10 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm text-[#059669]">
            <Gavel size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight text-slate-900">Courtroom Rush</h1>
          <p className="text-slate-500 max-w-lg mx-auto mb-10 text-lg leading-relaxed font-medium">
            Analyseer de verklaringen. Je hebt 22 seconden per casus en 10 seconden om de juridische analyse te bestuderen.
          </p>
          <button 
            onClick={startGame}
            className="px-10 py-4 bg-[#1F2937] text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            START DE ZITTING
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans relative min-h-screen bg-slate-50 text-slate-900">
      {/* Header met Statussen */}
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Heart key={i} size={24} fill={i < lives ? "#ef4444" : "none"} color={i < lives ? "#ef4444" : "#cbd5e1"} className="transition-all duration-300" />
          ))}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
          <p className="text-3xl font-bold text-[#059669] leading-none tabular-nums">{score.toLocaleString()}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'playing' && questions[currentIdx] && (
          <motion.div 
            key={`play-${currentIdx}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden relative">
              <div className="p-12 md:p-20 text-center min-h-[350px] flex flex-col justify-center items-center">
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold mb-8 uppercase tracking-wide">
                  Casus {currentIdx + 1} / 20
                </span>
                <h2 className="text-2xl md:text-4xl font-bold leading-tight text-slate-900 max-w-3xl">
                  "{questions[currentIdx].statement}"
                </h2>
              </div>
              
              {/* Progress Timer */}
              <div className="h-2 w-full bg-slate-100 relative">
                <motion.div 
                  className={`absolute top-0 left-0 bottom-0 ${timeLeft < 5 ? 'bg-rose-500' : 'bg-[#6EE7B7]'}`}
                  initial={{ width: "100%" }}
                  animate={{ width: `${(timeLeft / 22) * 100}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>
            </div>

            {/* Actie Knoppen */}
            <div className="grid grid-cols-2 gap-6">
              <button 
                onClick={() => handleAnswer(false)}
                className="group p-8 bg-white border border-slate-200 rounded-2xl hover:border-rose-500 hover:bg-rose-50 transition-all duration-200 flex flex-col items-center gap-3 shadow-sm hover:shadow-md"
              >
                <div className="p-3 bg-rose-100 rounded-full text-rose-600 group-hover:scale-110 transition-transform">
                    <AlertOctagon size={32} />
                </div>
                <span className="font-bold text-sm uppercase tracking-wider text-rose-600">Objection!</span>
              </button>

              <button 
                onClick={() => handleAnswer(true)}
                className="group p-8 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 flex flex-col items-center gap-3 shadow-sm hover:shadow-md"
              >
                <div className="p-3 bg-emerald-100 rounded-full text-emerald-600 group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={32} />
                </div>
                <span className="font-bold text-sm uppercase tracking-wider text-emerald-600">Proceed</span>
              </button>
            </div>
          </motion.div>
        )}

        {gameState === 'feedback' && (
          <motion.div 
            key="feedback"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10"
          >
            {lastResult === 'correct' ? (
              <div className="space-y-6">
                <motion.div 
                  animate={{ rotate: [0, -10, 0], scale: [1, 1.05, 1] }}
                  className="w-24 h-24 bg-[#6EE7B7]/20 rounded-full flex items-center justify-center mx-auto text-[#059669]"
                >
                  <Gavel size={48} strokeWidth={2} />
                </motion.div>
                <h3 className="text-4xl font-bold text-[#059669]">Sustained!</h3>
                <div className="bg-white p-8 rounded-2xl border-l-4 border-[#6EE7B7] text-left max-w-2xl mx-auto shadow-sm">
                   <p className="text-slate-700 text-lg leading-relaxed font-medium">"{questions[currentIdx]?.basis}"</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600">
                  <X size={48} strokeWidth={2} />
                </div>
                <h3 className="text-4xl font-bold text-rose-600">Overruled!</h3>
                <div className="bg-white p-8 rounded-2xl border-l-4 border-rose-500 text-left max-w-2xl mx-auto shadow-sm">
                  <p className="text-rose-600 font-bold mb-2 text-xs uppercase tracking-wider">
                    {timeLeft <= 0 ? "TIJD IS VERSTREKEN" : "ONJUISTE ANALYSE"}
                  </p>
                  <p className="text-slate-700 text-lg leading-relaxed">"{questions[currentIdx]?.basis}"</p>
                </div>
              </div>
            )}
            <div className="mt-10">
               <div className="h-1 w-32 bg-slate-200 mx-auto rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-slate-800"
                   initial={{ width: 0 }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 10, ease: "linear" }}
                 />
               </div>
               <p className="text-slate-400 mt-3 text-xs font-semibold uppercase tracking-wide">Volgend dossier wordt geladen...</p>
            </div>
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-200 relative overflow-hidden max-w-2xl mx-auto"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#6EE7B7]" />
            <h2 className="text-xl font-medium text-slate-500 mb-2">Het vonnis is geveld</h2>
            <h3 className="text-3xl font-bold text-slate-900 mb-10">{getRank()}</h3>
            
            <div className="text-8xl font-bold text-[#059669] mb-4 tracking-tight">
              {score}
            </div>
            <p className="text-slate-400 font-bold tracking-widest mb-12 uppercase text-xs">Totaalscore</p>

            <button 
              onClick={startGame}
              className="bg-[#1F2937] text-white px-12 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-black transition-all shadow-lg hover:-translate-y-1"
            >
              NIEUWE ZAAK STARTEN
            </button>
          </motion.div>
        )}
      </AnimatePresence>
=======
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gavel, 
  Globe, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Scale, 
  BookOpen, 
  ArrowRight,
  FileText
} from 'lucide-react';

// ==========================================
// DATA STRUCTUUR
// ==========================================
const themes = [
  {
    id: 'theme1',
    title: 'Doorwerking',
    subtitle: 'Internationaal Recht in de Nationale Rechtsorde',
    icon: <FileText size={20} />,
    color: 'bg-blue-50 text-blue-600',
    cases: [
      {
        name: 'HR Spoorwegstaking',
        tags: ['Art. 93 Gw', 'Directe Werking'],
        core: 'Wanneer heeft een verdragsbepaling "eenieder verbindende kracht"?',
        content: (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">De Spoorwegstaking-Test</h4>
              <ul className="space-y-3 relative">
                <li className="flex items-start gap-3 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">1</div>
                  <span className="text-slate-600 text-sm">Heeft de wetgever directe werking uitgesloten? <br/><span className="text-emerald-600 font-semibold">Nee? → Ga door.</span></span>
                </li>
                <li className="flex items-start gap-3 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">2</div>
                  <span className="text-slate-600 text-sm">Is het een instructienorm (dwang tot wetgeving)? <br/><span className="text-emerald-600 font-semibold">Nee? → Ga door.</span></span>
                </li>
                <li className="flex items-start gap-3 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-xs font-bold text-emerald-700 shrink-0">3</div>
                  <span className="text-slate-800 font-medium text-sm">Is de bepaling onvoorwaardelijk en nauwkeurig genoeg om als objectief recht te gelden?</span>
                </li>
                {/* Connector Line */}
                <div className="absolute left-[11px] top-2 bottom-6 w-0.5 bg-slate-200 -z-0"></div>
              </ul>
            </div>
          </div>
        ),
        outcome: 'Art. 6 lid 4 ESH (stakingsrecht) is direct werkend. Burgers kunnen zich er rechtstreeks op beroepen.'
      },
      {
        name: 'HR Decembermoorden',
        tags: ['Legaliteitsbeginsel', 'Art. 1 Sr'],
        core: 'Mag je wetgeving met terugwerkende kracht toepassen bij ernstige misdrijven?',
        rule: 'Nee. Art. 1 Sr en Art. 16 Gw zijn strikt. Je mag de Uitvoeringswet Folteringverdrag niet toepassen op feiten van vóór de wet, zelfs niet bij foltering.',
        outcome: 'Bouterse kon niet vervolgd worden op basis van de Uitvoeringswet Folteringverdrag wegens het verbod op terugwerkende kracht.'
      }
    ]
  },
  {
    id: 'theme2',
    title: 'Rechtssubjectiviteit',
    subtitle: 'Spelers & Bronnen van Internationaal Recht',
    icon: <Globe size={20} />,
    color: 'bg-purple-50 text-purple-600',
    cases: [
      {
        name: 'Reparation for Injuries (ICJ)',
        tags: ['Rechtspersoonlijkheid', 'VN'],
        core: 'Hebben internationale organisaties (zoals de VN) rechtspersoonlijkheid?',
        rule: 'Ja, functionele rechtspersoonlijkheid. De VN moet claims kunnen indienen om taken uit te voeren en personeel te beschermen.',
        outcome: 'De VN kan schadevergoeding eisen, ook van niet-leden.'
      },
      {
        name: 'Oost-Timor (Fretilin)',
        tags: ['Staat', 'Erkenning'],
        core: 'Wanneer is een entiteit een staat?',
        rule: 'Erkenning is declaratoir (bevestigend), niet constitutief (scheppend). Doorslaggevend zijn de feitelijke Montevideo-criteria (bevolking, grondgebied, overheid, relaties).',
        outcome: 'De rechter kijkt naar de feiten, niet enkel naar politieke erkenning.'
      },
      {
        name: 'North Sea Continental Shelf (ICJ)',
        tags: ['Gewoonterecht'],
        core: 'Kan een verdragsregel gewoonterecht worden?',
        content: (
          <div className="bg-slate-50 p-3 rounded border border-slate-200 text-sm space-y-2">
            <p className="font-semibold text-slate-700">Vereisten voor gewoonterecht:</p>
            <ol className="list-decimal list-inside text-slate-600 space-y-1 pl-1">
              <li>Fundamenteel normcreërend karakter.</li>
              <li>Uniforme en extensieve statenpraktijk (ook belanghebbenden).</li>
              <li><strong>Opinio Iuris</strong> (overtuiging van juridische plicht).</li>
            </ol>
          </div>
        ),
        outcome: 'In casu geen gewoonterecht; Duitsland was niet gebonden.'
      },
      {
        name: 'Qatar v. Bahrain (ICJ)',
        tags: ['Verdragen'],
        core: 'Wanneer is een afspraak een verdrag?',
        rule: 'De naam (Minutes, Brief) maakt niet uit. Het gaat om de intentie om juridische rechten en plichten te creëren. Interne politieke bezwaren achteraf tellen niet als er getekend is.',
        outcome: 'De "Minutes" waren een bindend verdrag.'
      }
    ]
  },
  {
    id: 'theme3',
    title: 'Jurisdictie',
    subtitle: 'Staatsaansprakelijkheid & Bevoegdheid',
    icon: <Gavel size={20} />,
    color: 'bg-orange-50 text-orange-600',
    cases: [
      {
        name: 'Bosnia v. Serbia (Genocide)',
        tags: ['Staatsaansprakelijkheid', 'Due Diligence'],
        core: 'Is een staat aansprakelijk voor genocide door milities?',
        content: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-red-50 p-3 rounded border border-red-100">
              <span className="font-bold text-red-700 block mb-1">Plegen?</span>
              Nee. Alleen als de staat <span className="font-semibold">Effective Control</span> had over de specifieke daden.
            </div>
            <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
              <span className="font-bold text-emerald-700 block mb-1">Niet voorkomen?</span>
              Ja. Dit is een <span className="font-semibold">inspanningsverplichting</span>. Servië deed niets terwijl ze invloed hadden.
            </div>
          </div>
        ),
        outcome: 'Servië aansprakelijk voor het niet voorkomen (due diligence).'
      },
      {
        name: 'HR Nuhanovic',
        tags: ['Dutchbat', 'Toerekening'],
        core: 'Wie is aansprakelijk voor Dutchbat: VN of Nederland?',
        rule: 'Hoofdregel: VN. Uitzondering: Als de staat (NL) "Effective Control" uitoefent over het specifieke gedrag (het wegsturen van de familie).',
        outcome: 'Nederland aansprakelijk omdat zij feitelijke zeggenschap hadden over de evacuatiebeslissing.'
      },
      {
        name: 'East Timor (Monetary Gold)',
        tags: ['Bevoegdheid Hof'],
        core: 'De "Monetary Gold"-doctrine.',
        rule: 'Het Hof mag niet oordelen in een zaak tussen A en B, als dat onvermijdelijk een oordeel velt over de rechten van C (die geen partij is).',
        outcome: 'Hof onbevoegd omdat Indonesië geen partij was.'
      }
    ]
  },
  {
    id: 'theme4',
    title: 'Immuniteit',
    subtitle: 'De "Gouden Kooi" van het IPR',
    icon: <Shield size={20} />,
    color: 'bg-slate-800 text-white',
    intro: 'Rode draad: Immuniteit is procesrechtelijk. Het betekent niet dat je onschuldig bent, maar dat de rechter de deur niet open mag doen.',
    cases: [
      {
        name: 'Arrest Warrant Case (ICJ)',
        tags: ['Ministers'],
        core: 'Immuniteit van zittende Ministers van Buitenlandse Zaken.',
        rule: 'Absolute immuniteit (ook privé, ook oorlogsmisdaden). Functionele noodzaak: ze moeten kunnen reizen en onderhandelen.',
        outcome: 'België schond immuniteit door arrestatiebevel.'
      },
      {
        name: 'Jurisdictional Immunities (ICJ)',
        tags: ['Staatsimmuniteit'],
        core: 'Immuniteit van staten bij civiele claims (WOII daden).',
        rule: 'Staten hebben immuniteit voor acta jure imperii (overheidshandelen). Geen uitzondering voor oorlogsmisdaden in gewoonterecht.',
        outcome: 'Italië mocht Duitsland niet veroordelen tot schadevergoeding.'
      },
      {
        name: 'Mothers of Srebrenica (HR)',
        tags: ['VN Immuniteit'],
        core: 'Kan de VN vervolgd worden voor Srebrenica?',
        rule: 'VN geniet absolute immuniteit. Dit is essentieel voor het functioneren. Geen schending recht op rechter (art. 6 EVRM) zolang er doelmatige reden is.',
        outcome: 'VN kan niet voor de Nederlandse rechter worden gedaagd.'
      }
    ]
  }
];

// ==========================================
// SUB-COMPONENT: CASE CARD
// ==========================================
const CaseCard = ({ data }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
    {/* Header */}
    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between">
      <div>
        <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
          {data.name}
        </h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {data.tags.map((tag, i) => (
            <span key={i} className="px-2 py-0.5 bg-slate-200/60 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <Scale size={18} className="text-slate-300" />
    </div>

    {/* Body */}
    <div className="p-5 flex-1 space-y-4">
      
      {/* KERN */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle size={14} className="text-orange-500" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">De Rechtsvraag</span>
        </div>
        <p className="text-slate-700 font-medium text-sm leading-relaxed">
          {data.core}
        </p>
      </div>

      {/* REGEL / CONTENT */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={14} className="text-blue-500" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">De Regel / Overweging</span>
        </div>
        {data.content ? (
          data.content
        ) : (
          <p className="text-slate-600 text-sm leading-relaxed">
            {data.rule}
          </p>
        )}
      </div>

    </div>

    {/* Footer: UITKOMST */}
    <div className="p-4 bg-[#6EE7B7]/10 border-t border-[#6EE7B7]/20">
      <div className="flex gap-3">
        <CheckCircle2 size={18} className="text-[#059669] shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-[#059669] uppercase tracking-wide block mb-1">Conclusie</span>
          <p className="text-sm text-slate-800 font-medium leading-snug">
            {data.outcome}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// MAIN COMPONENT
// ==========================================
const IPRSummaryView = () => {
  const [activeTab, setActiveTab] = useState('theme1');

  const activeThemeData = themes.find(t => t.id === activeTab);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      
      {/* Header Section */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center p-2 bg-slate-100 rounded-full mb-2">
          <Gavel className="text-slate-500 mr-2" size={16} />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tentamenstof Week 1-6</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Jurisprudentie <span className="text-[#6EE7B7]">IPR</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Een thematisch overzicht van alle kernarresten voor Inleiding Internationaal Publiekrecht.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 border-b border-slate-200 pb-1">
        {themes.map((theme) => {
          const isActive = activeTab === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => setActiveTab(theme.id)}
              className={`pb-3 px-4 flex items-center gap-2 text-sm font-bold transition-all border-b-2 ${
                isActive 
                  ? 'border-[#6EE7B7] text-slate-900' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
              }`}
            >
              <span className={`p-1.5 rounded-md ${isActive ? theme.color : 'bg-slate-100 text-slate-400'}`}>
                {theme.icon}
              </span>
              <span className="hidden md:inline">{theme.title}</span>
              <span className="md:hidden">{theme.title.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Theme Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  {activeThemeData.title}
                  <span className="text-slate-300 text-lg font-normal mx-2">/</span>
                  <span className="text-base text-slate-500 font-medium">{activeThemeData.subtitle}</span>
                </h2>
                {activeThemeData.intro && (
                  <div className="mt-3 inline-flex items-start gap-2 bg-amber-50 text-amber-800 px-4 py-2 rounded-lg text-sm border border-amber-100 max-w-2xl">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                    {activeThemeData.intro}
                  </div>
                )}
              </div>
            </div>

            {/* Grid of Cases */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeThemeData.cases.map((caseItem, idx) => (
                <CaseCard key={idx} data={caseItem} />
              ))}
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      <div className="text-center pt-8 border-t border-slate-100">
        <p className="text-xs text-slate-400 font-medium">
          Tip: Leer de feiten, maar onthoud vooral de <span className="text-slate-600">rechtsregel</span> en het <span className="text-slate-600">toetsingskader</span>.
        </p>
      </div>
>>>>>>> 1d6bd31885c81de89a4c63b93a83452b7f65ebe3
    </div>
  );
};

<<<<<<< HEAD
export default CourtroomRush;
=======
export default IPRSummaryView;
>>>>>>> 1d6bd31885c81de89a4c63b93a83452b7f65ebe3
