import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitMerge, 
  CheckCircle2, 
  XCircle, 
  ArrowDown, 
  Scale, 
  Globe, 
  BookOpen, 
  ShieldAlert,
  HelpCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Info,
  Zap,
  Gavel,
  AlertTriangle,
  UserCheck,
  Package,
  Clock,
  Briefcase
} from 'lucide-react';

// ==========================================
// HERBRUIKBARE UI-COMPONENTEN
// ==========================================

const DetailDropdown = ({ title, children, color = "blue" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const colorClasses = {
    blue: "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100",
    slate: "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100",
    emerald: "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
    amber: "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100",
    red: "bg-red-50 text-red-800 border-red-200 hover:bg-red-100",
  };

  return (
    <div className="mt-3 w-full">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${colorClasses[color]}`}
      >
        <span className="flex items-center gap-2">
          <Info size={14} /> {title}
        </span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-x border-b border-slate-100 bg-white rounded-b-lg text-sm text-slate-600 leading-relaxed shadow-inner">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FlowStep = ({ title, description, type = 'neutral', isLast = false, outcome, extraContent }) => {
  const getColors = () => {
    switch(type) {
      case 'success': return 'bg-emerald-50 border-emerald-300 text-emerald-900';
      case 'failure': return 'bg-red-50 border-red-300 text-red-900';
      case 'question': return 'bg-blue-50 border-blue-300 text-blue-900';
      case 'law': return 'bg-slate-100 border-slate-400 text-slate-900';
      default: return 'bg-white border-slate-200 text-slate-800';
    }
  };

  return (
    <div className="relative pl-8 pb-10 last:pb-0">
      {!isLast && <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-slate-200"></div>}
      <div className={`absolute left-0 top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 ${
        type === 'question' ? 'bg-blue-500 border-blue-600' : 'bg-white border-slate-300'
      }`}>
        {type === 'question' ? <HelpCircle size={14} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-slate-400" />}
      </div>
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        className={`p-5 rounded-xl border-2 shadow-sm ${getColors()}`}
      >
        <h4 className="font-black text-xs uppercase tracking-widest mb-1 opacity-70">{title}</h4>
        <p className="text-sm font-bold leading-snug">{description}</p>
        {extraContent}
        {outcome && (
          <div className="mt-4 pt-3 border-t border-black/10 text-xs font-black flex items-center gap-2 italic uppercase">
            <ArrowDown size={14} /> Resultaat: {outcome}
          </div>
        )}
      </motion.div>
    </div>
  );
};

// ==========================================
// DATA: DE 6 HOOFDSCHEMA'S
// ==========================================

const schemas = [
  {
    id: 'ovk-vorming',
    title: '1. Totstandkoming & Geldigheid',
    subtitle: 'Wilsverklaring, Vertrouwen & Wilsgebreken',
    icon: <UserCheck size={20} />,
    description: "Hoe ontstaat een verbintenis en is deze aantastbaar?",
    content: (
      <div className="space-y-4">
        <FlowStep 
          title="Stap 1: Aanbod & Aanvaarding"
          description="Is er een geldige overeenkomst gevormd conform art. 6:217 BW?"
          type="question"
          extraContent={
            <DetailDropdown title="Checklist Aanbod">
              <p>1. <strong>Essentalia:</strong> Bevat het de kernvoorwaarden? (Art. 3:33 BW)</p>
              <p>2. <strong>Herroepelijkheid:</strong> Is het ingetrokken vóór aanvaarding? (Art. 6:219 BW)</p>
              <p>3. <strong>Vormvrijheid:</strong> Verklaringen kunnen in gedragingen besloten liggen (Art. 3:37 lid 1 BW).</p>
            </DetailDropdown>
          }
        />
        <FlowStep 
          title="Stap 2: Wil vs Verklaring"
          description="Lopen de wil en verklaring uiteen? (Bijv. verspreking/fout)"
          type="question"
          outcome="Indien JA: Kijk naar bescherming wederpartij."
          extraContent={
            <DetailDropdown title="Art. 3:33 vs 3:35 BW">
              <p><strong>Art. 3:33:</strong> Geen wil = geen rechtshandeling.</p>
              <p><strong>Art. 3:35:</strong> Gerechtvaardigd vertrouwen. Mocht de wederpartij er redelijkerwijs van uitgaan dat de verklaring klopte? (Haviltex/Eelman-Hin).</p>
            </DetailDropdown>
          }
        />
        <FlowStep 
          title="Stap 3: Wilsgebreken"
          description="Is de wil gebrekkig gevormd? (Vernietigbaarheid)"
          type="law"
          extraContent={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div className="p-3 bg-white border rounded shadow-sm">
                <p className="font-bold text-xs text-blue-600">DWALING (Art. 6:228)</p>
                <p className="text-[10px]">Onjuiste voorstelling. Eis: Mededeling wederpartij, zwijgen of wederzijdse dwaling.</p>
              </div>
              <div className="p-3 bg-white border rounded shadow-sm">
                <p className="font-bold text-xs text-red-600">BEDROG (Art. 3:44 lid 3)</p>
                <p className="text-[10px]">Opzettelijke misleiding via kunstgrepen of verzwijgen.</p>
              </div>
            </div>
          }
        />
      </div>
    )
  },
  {
    id: 'wanprestatie',
    title: '2. Wanprestatie & Schade',
    subtitle: 'Art. 6:74 BW - De weg naar schadevergoeding',
    icon: <AlertTriangle size={20} />,
    description: "Gebruik dit bij elke vraag over het eisen van geld wegens niet-nakoming.",
    content: (
      <div className="space-y-2">
        <FlowStep 
          title="Stap 1: Tekortkoming"
          description="Is de schuldenaar achtergebleven bij de prestatie?"
          type="question"
          extraContent={<p className="text-xs italic mt-1">Check opeisbaarheid: Art. 6:38 of 6:39 BW.</p>}
        />
        <FlowStep 
          title="Stap 2: Toerekenbaarheid"
          description="Is de fout de schuldenaar aan te rekenen? (Art. 6:75 BW)"
          type="question"
          extraContent={
            <DetailDropdown title="Check Overmacht" color="red">
              <p>Geen toerekening als: Geen schuld + niet voor risico volgens wet (6:76 hulppersonen/6:77 zaken), rechtshandeling of verkeersopvatting.</p>
            </DetailDropdown>
          }
        />
        <FlowStep 
          title="Stap 3: Verzuim"
          description="Is nakoming nog mogelijk? Dan is verzuim vereist (Art. 6:74 lid 2)."
          type="question"
          extraContent={
            <DetailDropdown title="Hoe treedt verzuim in?" color="amber">
              <p>1. <strong>Ingebrekestelling (Art. 6:82):</strong> Schriftelijke aanmaning met redelijke termijn.</p>
              <p>2. <strong>Van rechtswege (Art. 6:83):</strong> Bijv. fatale termijn (sub a) of mededeling schuldenaar (sub c).</p>
            </DetailDropdown>
          }
        />
        <FlowStep 
          title="Stap 4: Schade & Causaliteit"
          description="Is er schade en staat deze in verband met de fout? (Art. 6:95-98 BW)"
          type="success"
          isLast={true}
          extraContent={
            <DetailDropdown title="Causaliteitstoets" color="emerald">
              <p><strong>Art. 6:98:</strong> Toerekening naar redelijkheid. Factoren: aard schade (letsel gaat voor vermogen) en aard aansprakelijkheid (schuld gaat voor risico).</p>
            </DetailDropdown>
          }
        />
      </div>
    )
  },
  {
    id: 'ontbinding-schema',
    title: '3. Ontbinding (Xerxes)',
    subtitle: 'Art. 6:265 BW - Contract beëindigen',
    icon: <Zap size={20} />,
    description: "Cruciaal schema voor casus Xerxes.",
    content: (
      <div className="space-y-2">
        <FlowStep 
          title="1. Wederkerige Overeenkomst"
          description="Is er sprake van art. 6:261 BW?"
          type="neutral"
          outcome="Ja (bijv. Koop)"
        />
        <FlowStep 
          title="2. Tekortkoming"
          description="Iedere tekortkoming geeft recht op ontbinding."
          type="law"
          extraContent={<p className="text-xs text-red-600 font-bold">LET OP: Toerekenbaarheid (overmacht) is hier NIET vereist!</p>}
        />
        <FlowStep 
          title="3. Verzuim"
          description="Alleen nodig als nakoming nog mogelijk is (Art. 6:265 lid 2)."
          type="question"
          extraContent={
            <div className="mt-2 p-2 bg-slate-100 rounded text-xs">
              <strong>Casus Xerxes:</strong> Steppen zijn 'soortzaken' (alom verkrijgbaar). Nakoming is dus mogelijk. Verzuim nodig. Trad in via 6:83 sub a (fatale datum 1 juni).
            </div>
          }
        />
        <FlowStep 
          title="4. Gevolgen"
          description="Bevrijding (6:271) en ongedaanmaking."
          type="success"
          isLast={true}
        />
      </div>
    )
  },
  {
    id: 'onrechtmatige-daad',
    title: '4. Onrechtmatige Daad',
    subtitle: 'Art. 6:162 BW - Schade buiten contract',
    icon: <Gavel size={20} />,
    description: "Vaste structuur voor OD-vragen.",
    content: (
      <div className="space-y-2">
        <FlowStep 
          title="1. Onrechtmatigheid"
          description="Drie gronden (Lid 2):"
          type="law"
          extraContent={
            <ul className="text-xs list-disc ml-4 mt-2">
              <li>Inbreuk op een recht (eigendom/lichaam)</li>
              <li>Strijd met wettelijke plicht</li>
              <li>Strijd met ongeschreven recht (Kelderluik)</li>
            </ul>
          }
        />
        <FlowStep 
          title="Kelderluik-Criteria (Maatschappelijke Betamelijkheid)"
          description="Moest de dader maatregelen nemen?"
          type="question"
          extraContent={
            <div className="grid grid-cols-2 gap-2 text-[10px] mt-2">
              <div className="bg-blue-50 p-1 border">1. Waarschijnlijkheid onoplettendheid</div>
              <div className="bg-blue-50 p-1 border">2. Kans op ongeval</div>
              <div className="bg-blue-50 p-1 border">3. Ernst gevolgen</div>
              <div className="bg-blue-50 p-1 border">4. Bezwaarlijkheid maatregelen</div>
            </div>
          }
        />
        <FlowStep 
          title="2. Toerekenbaarheid"
          description="Schuld, wet of verkeersopvatting? (Lid 3)"
          type="question"
          extraContent={
            <div className="bg-amber-50 p-2 border-l-4 border-amber-400 mt-2 text-xs">
              <strong>CASUS BRAM:</strong> Art. 6:164 BW. Kind &lt; 14 jaar? Dan <u>nooit</u> toerekening aan het kind.
            </div>
          }
        />
        <FlowStep 
          title="3. Relativiteit"
          description="Art. 6:163 BW - Beschermt de norm dit slachtoffer?"
          type="question"
          isLast={true}
        />
      </div>
    )
  },
  {
    id: 'kwalitatief',
    title: '5. Aansprakelijkheid voor Anderen',
    subtitle: 'Art. 6:169 t/m 6:179 BW',
    icon: <Scale size={20} />,
    description: "Wanneer ben je aansprakelijk voor kinderen, werknemers of zaken?",
    content: (
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 border rounded-xl">
          <h5 className="font-bold text-sm mb-2">Kinderen (Art. 6:169)</h5>
          <ul className="text-xs space-y-2">
            <li><strong>&lt; 14 jaar:</strong> Ouders volledig aansprakelijk (risico).</li>
            <li><strong>14 of 15 jaar:</strong> Ouders aansprakelijk, tenzij zij niet-nakoming zorgplicht aantonen.</li>
          </ul>
        </div>
        <div className="p-4 bg-slate-50 border rounded-xl">
          <h5 className="font-bold text-sm mb-2">Hulppersonen (Art. 6:170)</h5>
          <p className="text-xs italic">Werkgever is aansprakelijk voor fout ondergeschikte mits functioneel verband.</p>
        </div>
        <div className="p-4 bg-slate-50 border rounded-xl">
          <h5 className="font-bold text-sm mb-2">Zaken & Opstallen (6:173/174)</h5>
          <p className="text-xs">Bezitters-aansprakelijkheid voor gebrekkige zaken/gebouwen.</p>
        </div>
        <div className="p-4 bg-slate-50 border rounded-xl">
          <h5 className="font-bold text-sm mb-2">Dieren (Art. 6:179)</h5>
          <p className="text-xs">Bezitter aansprakelijk voor de 'eigen energie' van het dier.</p>
        </div>
      </div>
    )
  },
  {
    id: 'vertegenwoordiging',
    title: '6. Vertegenwoordiging',
    subtitle: 'Volmacht & Bekrachtiging',
    icon: <Briefcase size={20} />,
    description: "Wie wordt gebonden door een handeling van een ander?",
    content: (
      <div className="space-y-3">
        <FlowStep 
          title="Is er een volmacht? (Art. 3:60)"
          description="Heeft de achterman de tussenpersoon bevoegd gemaakt?"
          type="question"
          outcome="Indien NEE: Achterman niet gebonden, tenzij..."
        />
        <FlowStep 
          title="Schijn van Volmacht (Art. 3:61 lid 2)"
          description="Heeft de achterman door zijn doen of laten de schijn gewekt?"
          type="question"
          extraContent={<p className="text-xs italic">Wederpartij moet te goeder trouw zijn.</p>}
        />
        <FlowStep 
          title="Bekrachtiging (Art. 3:69)"
          description="De achterman kan de handeling achteraf alsnog geldig maken."
          type="success"
          isLast={true}
        />
      </div>
    )
  }
];

// ==========================================
// MAIN APP COMPONENT
// ==========================================

const CivilLawToolkit = () => {
  const [activeTab, setActiveTab] = useState('ovk-vorming');
  const activeSchema = schemas.find(s => s.id === activeTab);

  return (
    <div className="w-full max-w-6xl mx-auto p-2 md:p-6 bg-slate-50 min-h-screen font-sans text-slate-900">
      
      {/* Header Section */}
      <div className="mb-10 text-center md:text-left bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-lg shadow-blue-200">
          <Gavel size={14} /> Leiden Law Study Partner
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
          Inleiding Burgerlijk Recht <span className="text-blue-600">I</span>
        </h1>
        <p className="text-slate-500 max-w-2xl text-lg font-medium leading-relaxed">
          Interactieve schema's voor het oplossen van open vragen. Gebruik de <span className="font-bold text-slate-800 underline decoration-blue-400">IRAC-volgorde</span> zoals getoond in de stappenplannen.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        {schemas.map((schema) => (
          <button
            key={schema.id}
            onClick={() => setActiveTab(schema.id)}
            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
              activeTab === schema.id 
                ? 'bg-white border-blue-500 shadow-xl shadow-blue-100 scale-105 z-10' 
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 opacity-70 grayscale hover:grayscale-0'
            }`}
          >
            <div className={`p-3 rounded-xl ${activeTab === schema.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              {schema.icon}
            </div>
            <span className={`font-black text-[10px] uppercase tracking-tighter text-center leading-tight ${activeTab === schema.id ? 'text-blue-700' : 'text-slate-500'}`}>
              {schema.title.split('. ')[1]}
            </span>
          </button>
        ))}
      </div>

      {/* Dynamic Content Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Stappenplan */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
            >
              <div className="bg-slate-900 p-8 text-white">
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                  {activeSchema.title}
                </h2>
                <p className="text-slate-400 font-bold mt-2 uppercase text-xs tracking-widest">{activeSchema.subtitle}</p>
              </div>
              
              <div className="p-8 md:p-12">
                <p className="text-slate-500 font-medium mb-10 pb-6 border-b border-slate-100 italic">
                  "{activeSchema.description}"
                </p>
                {activeSchema.content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar Tips & IRAC Reminder */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-xl shadow-blue-200">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <BookOpen size={20} /> De IRAC-Methode
            </h3>
            <div className="space-y-4 text-sm font-medium opacity-90">
              <div className="border-l-2 border-white/30 pl-3">
                <p className="font-black text-xs uppercase">Issue (De Vraag)</p>
                <p>"De vraag is of Xerxes de overeenkomst kan ontbinden..."</p>
              </div>
              <div className="border-l-2 border-white/30 pl-3">
                <p className="font-black text-xs uppercase">Rule (De Regel)</p>
                <p>"Hiervoor is art. 6:265 BW van belang. Dit vereist een tekortkoming..."</p>
              </div>
              <div className="border-l-2 border-white/30 pl-3">
                <p className="font-black text-xs uppercase">Application (Toepassing)</p>
                <p>"In casu is er een tekortkoming omdat Yka niet heeft geleverd..."</p>
              </div>
              <div className="border-l-2 border-white/30 pl-3">
                <p className="font-black text-xs uppercase">Conclusion (Conclusie)</p>
                <p>"Kortom, Xerxes kan rechtsgeldig ontbinden."</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border-2 border-emerald-200 p-8 rounded-3xl">
            <h3 className="text-emerald-900 font-black text-lg mb-4 flex items-center gap-2">
              <ShieldAlert size={20} /> Tentamen Pro-Tips
            </h3>
            <ul className="text-xs text-emerald-800 space-y-3 font-bold">
              <li className="flex gap-2">
                <span className="text-emerald-500">●</span>
                Noem bij schadevergoeding ALTIJD eerst de grondslag (bijv. 6:74 of 6:162).
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">●</span>
                Vergeet bij minderjarigen (Bram) art. 1:234 lid 3 niet (gebruikelijke handelingen).
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">●</span>
                Uitleg van het contract? Gebruik de Haviltex-norm (Week 3).
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Footer Disclaimer */}
      <footer className="mt-16 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest border-t border-slate-200 pt-8 pb-12">
        © 2025 Universiteit Leiden Study Buddy | Niet delen of uploaden
      </footer>

    </div>
  );
};

export default CivilLawToolkit;