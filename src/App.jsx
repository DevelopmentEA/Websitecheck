import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Truck, Phone, Mail, MessageCircle, 
  ArrowRight, ShieldCheck, Banknote, Clock, 
  Wrench, Package, Home, Trash2, CheckCircle2 
} from 'lucide-react';

// Importeer afbeeldingen
import logoFoto from '/foto.png';
import pepijnFoto from '/Pepijn.png';
import backgroundImage from '/Background.png';

export default function PepijnVervoert() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Zorgt voor een donkere navigatiebalk zodra je naar beneden scrollt
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Over mij', id: 'over-mij' },
    { name: 'Diensten', id: 'diensten' },
    { name: 'Waarom kiezen', id: 'waarom-kiezen' },
  ];

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gray-50 selection:bg-blue-600 selection:text-white">
      
      {/* --- Navigatie (Minimalistisch over de foto) --- */}
      <nav className={`fixed w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-gray-950/95 backdrop-blur-md border-gray-800 py-2' : 'bg-transparent border-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('home')}>
            {/* Logo Afbeelding */}
            <div className="h-10 w-10 relative overflow-hidden rounded-md bg-white/10 flex-shrink-0">
               <img src={logoFoto} alt="Pepijn Vervoert Logo" className="object-cover w-full h-full" />
            </div>
            <span className="text-xl font-bold tracking-widest text-white uppercase text-sm">
              Pepijn Vervoert
            </span>
          </div>

          {/* Desktop Menu - Minimalistisch zoals in je voorbeeld */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <button 
                key={link.id} 
                onClick={() => scrollTo(link.id)}
                className="text-xs font-semibold tracking-widest text-gray-300 hover:text-white uppercase transition-colors"
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => scrollTo('contact')}
              className="text-xs font-semibold tracking-widest text-white hover:text-blue-400 uppercase transition-colors ml-4"
            >
              Contact
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-950 border-b border-gray-800 p-6 flex flex-col gap-6 absolute w-full shadow-2xl animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <button 
                key={link.id} 
                onClick={() => scrollTo(link.id)}
                className="text-left text-sm font-semibold tracking-widest text-gray-300 hover:text-white uppercase transition-colors"
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => scrollTo('contact')}
              className="text-left text-sm font-semibold tracking-widest text-blue-400 hover:text-blue-300 uppercase transition-colors pt-2 border-t border-gray-800"
            >
              Contact
            </button>
          </div>
        )}
      </nav>

      {/* --- Fullscreen Hero Sectie (Minimalistische landing page) --- */}
      <header id="home" className="relative min-h-screen flex items-center justify-center">
        
        {/* Achtergrond Afbeelding */}
        <div className="absolute inset-0 w-full h-full z-0 bg-gray-900">
          <img 
            src={backgroundImage} 
            alt="Vervoer achtergrond" 
            className="object-cover w-full h-full object-center opacity-80"
          />
          {/* Subtiele donkere overlay om de witte tekst perfect leesbaar te maken */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-transparent to-gray-950/80"></div>
        </div>

        {/* Hero Content - Volledig gecentreerd en clean */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center mt-12">
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight tracking-tight drop-shadow-xl mb-6">
            Betrouwbaar <br/> Vervoer.
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-300 max-w-2xl leading-relaxed font-light drop-shadow-md mb-14">
            Voor kleine verhuizingen, meubeltransport en ontruimingen. Snel en veilig geregeld.
          </p>
          
          {/* Minimalistische knoppen / Links (Zoals in de screenshot) */}
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-14 justify-center items-center">
            <button 
              onClick={() => scrollTo('contact')} 
              className="group text-white text-sm md:text-base font-bold tracking-[0.2em] uppercase hover:text-gray-300 transition-all flex items-center gap-3 relative pb-2"
            >
              Offerte Aanvragen
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
            
            <button 
              onClick={() => scrollTo('diensten')} 
              className="group text-gray-300 text-sm md:text-base font-bold tracking-[0.2em] uppercase hover:text-white transition-all relative pb-2"
            >
              Mijn Diensten
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-300 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>
          
        </div>
      </header>

      {/* --- Over Mij --- */}
      <section id="over-mij" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-5/12 relative">
               {/* Portret Foto Pepijn */}
              <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden shadow-2xl">
                 <img 
                    src={pepijnFoto} 
                    alt="Pepijn" 
                    className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
                 />
              </div>
            </div>
            
            <div className="md:w-7/12 space-y-6">
              <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold uppercase tracking-[0.15em] mb-2">Over mij</div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Persoonlijke service van een vakman in wording
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Als student autotechniek en ondernemer combineer ik technische kennis met praktijkervaring in de vervoersbranche. Sinds meer dan een jaar help ik particulieren en bedrijven met professionele vervoersdiensten, van kleine verhuizingen tot opruimklussen. 
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Mijn focus ligt op betrouwbare service, scherpe tarieven en persoonlijke aandacht voor elke opdracht. Jij hebt een klus, ik de oplossing.
              </p>
              
              <blockquote className="border-l-4 border-gray-900 bg-gray-50 p-6 rounded-r-xl italic text-gray-800 text-lg my-8">
                "Ik denk altijd met je mee en zorg dat de klus netjes en snel wordt gedaan. Voor grotere opdrachten regel ik gewoon extra handjes."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* --- Diensten --- */}
      <section id="diensten" className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 bg-white text-gray-600 border border-gray-200 rounded text-xs font-bold uppercase tracking-[0.15em] mb-4">Diensten</div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Waarmee kan ik helpen?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Home, title: "Kleine verhuizingen", desc: "Perfect voor studentenkamers, studio's of als je net dat beetje extra laadruimte nodig hebt." },
              { icon: Package, title: "Meubeltransport", desc: "Marktplaats aankoop gedaan? Ik haal het veilig op en breng het naar binnen." },
              { icon: Wrench, title: "Ontruimingen", desc: "Schuren, garages of opslagboxen vakkundig en bezemschoon leegruimen." },
              { icon: Trash2, title: "Grofvuil & Kringloop", desc: "Spullen waar je vanaf wilt breng ik netjes naar de stort of de lokale kringloop." },
              { icon: Truck, title: "Flexibele klushulp", desc: "Heb je naast vervoer ook iemand nodig die helpt tillen of monteren? Ik help mee." },
              { icon: MessageCircle, title: "Maatwerk", desc: "Staat je klus er niet tussen? Neem contact op, er is vaak meer mogelijk dan je denkt." }
            ].map((service, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="text-gray-900 mb-6">
                  <service.icon size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Waarom Kiezen --- */}
      <section id="waarom-kiezen" className="py-24 bg-white border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-10">
              <div>
                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold uppercase tracking-[0.15em] mb-4">Voordelen</div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Waarom je voor mij kiest</h2>
                <p className="text-xl text-gray-600">Geen gedoe met grote verhuisbedrijven of busjes huren. Ik kom voorrijden en we regelen het samen.</p>
              </div>

              <div className="space-y-8">
                {[
                  { icon: Clock, title: "Altijd op tijd", desc: "Een afspraak is een afspraak. Ik ben er wanneer we hebben afgesproken." },
                  { icon: Banknote, title: "Transparante tarieven", desc: "Vooraf een duidelijke prijsopgave, zodat je precies weet waar je aan toe bent." },
                  { icon: ShieldCheck, title: "Zuinig op jouw spullen", desc: "Ik ga met jouw spullen om alsof het mijn eigen spullen zijn. Veilig vastgezet in de bus." },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-5 items-start">
                    <div className="mt-1 text-gray-900 shrink-0">
                      <item.icon size={24} strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-600 text-lg">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 bg-gray-950 text-white p-10 md:p-14 rounded-2xl relative shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-white uppercase tracking-widest text-sm">De technische voorsprong</h3>
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                Als student autotechniek weet ik hoe ik mijn bus in topconditie moet houden en hoe laadgewichten en krachten werken tijdens transport. 
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                Die technische kennis lijkt overdreven voor een kleine verhuizing, maar het betekent in de praktijk dat jouw spullen veiliger en efficiënter van A naar B gaan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Contact --- */}
      <section id="contact" className="py-24 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-gray-900">Klaar om te plannen?</h2>
            <p className="text-gray-600 text-xl">Vul het formulier in of stuur me direct een appje. Ik reageer zo snel mogelijk met een voorstel.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
            
            {/* Contact Form */}
            <div className="flex-[2] bg-white rounded-2xl p-10 shadow-sm border border-gray-200">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Naam</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Telefoon</label>
                    <input type="tel" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-500">E-mailadres</label>
                  <input type="email" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Wat moet er gebeuren?</label>
                  <textarea rows="4" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all resize-none" required></textarea>
                </div>
                <button type="button" className="w-full py-4 bg-gray-900 text-white rounded-lg font-bold tracking-widest uppercase text-sm hover:bg-black transition-all mt-4">
                  Bericht versturen
                </button>
              </form>
            </div>

            {/* Contact Info (Zijkant) */}
            <div className="flex-[1] flex flex-col gap-6">
              <div className="bg-gray-950 p-10 rounded-2xl text-white h-full flex flex-col justify-center">
                <h4 className="font-bold text-xl mb-8 uppercase tracking-widest text-sm">Direct Contact</h4>
                <div className="space-y-8">
                  <a href="https://wa.me/31614069705" target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                    <MessageCircle size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">WhatsApp</p>
                      <p className="font-semibold text-lg">Stuur een appje</p>
                    </div>
                  </a>
                  <a href="tel:0614069705" className="flex items-center gap-4 group">
                    <Phone size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Bellen</p>
                      <p className="font-semibold text-lg">06 14069705</p>
                    </div>
                  </a>
                  <a href="mailto:Pepijnvervoert@outlook.com" className="flex items-center gap-4 group">
                    <Mail size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">E-mail</p>
                      <p className="font-semibold break-all">Pepijnvervoert<br/>@outlook.com</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white text-gray-500 py-12 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-gray-900">
            <Truck size={20} />
            <span className="font-bold tracking-widest uppercase text-sm">Pepijn Vervoert</span>
          </div>
          <div className="text-xs font-medium tracking-wide">
             <p>© {new Date().getFullYear()} Pepijn Vervoert. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}