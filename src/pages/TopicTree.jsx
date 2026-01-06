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
    </div>
  );
};

export default IPRSummaryView;