import React, { useState, useEffect } from 'react';
import { 
  Music, Heart, BookOpen, Star, MapPin, Mail, Phone, 
  ChevronDown, Quote, Award, Sparkles, Coffee 
} from 'lucide-react';

const Klavierplezier = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#FCFBF9] text-[#1a1a1a] font-light selection:bg-amber-100 selection:text-amber-900">
      
      {/* --- ELEGANT NAVIGATION --- */}
      <nav className={`fixed w-full z-50 transition-all duration-700 ${
        scrolled ? 'bg-white/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto px-10 flex justify-between items-center">
          <div className="group cursor-pointer">
            <h1 className="text-3xl font-serif tracking-[0.15em] uppercase">
              Klavier<span className="text-amber-800 italic">plezier</span>
            </h1>
            <div className="h-0.5 bg-amber-800 w-0 group-hover:w-full transition-all duration-500" />
            <p className="text-[10px] tracking-[0.4em] uppercase opacity-60 mt-1">Annette Niels • Arnhem</p>
          </div>
          
          <div className="hidden lg:flex items-center space-x-12 text-[11px] uppercase tracking-[0.2em] font-medium">
            {['De Praktijk', 'Kinderen', 'Volwassenen', 'Over Annette', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '')}`} className="hover:text-amber-800 transition-colors">
                {item}
              </a>
            ))}
            <button className="border border-[#1a1a1a] px-8 py-3 hover:bg-[#1a1a1a] hover:text-white transition-all duration-500 uppercase tracking-[0.2em]">
              Kennismaken
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover grayscale opacity-20"
            alt="Piano Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FCFBF9]/0 via-[#FCFBF9]/40 to-[#FCFBF9]" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-6">
          <span className="text-xs uppercase tracking-[0.6em] mb-8 block text-amber-800 font-medium">Lessen op de Bakenbergseweg</span>
          <h2 className="text-6xl md:text-[5.5rem] font-serif leading-[1.1] mb-10">
            Vind jouw ritme bij <br />
            <span className="italic">de bron.</span>
          </h2>
          <div className="w-24 h-[1px] bg-amber-800/40 mx-auto mb-10" />
          <p className="text-lg md:text-xl text-slate-600 font-serif italic max-w-2xl mx-auto leading-relaxed">
            "Annette Niels heeft een grote belangstelling voor ieders persoonlijke en muzikale ontwikkeling."
          </p>
          <ChevronDown className="mx-auto mt-16 animate-bounce opacity-30" size={30} />
        </div>
      </section>

      {/* --- PHILOSOPHY SECTION --- */}
      <section id="depraktijk" className="py-32 px-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.4em] text-amber-800 font-bold">De Visie</h3>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">Muziek als verlengstuk van de mens.</h2>
            </div>
            <p className="text-lg text-slate-700 leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left">
              De vele aspecten van de muziek, zoals techniek, geschiedenis en haar vele verschijningsvormen, 
              hebben de speciale interesse van Annette. In haar praktijk staat niet alleen het instrument, 
              maar de wisselwerking tussen 'de mens en muziek' centraal. Of het nu gaat om het brein of 
              het hart, muziek is een persoonlijke reis.
            </p>
            <div className="bg-white border-l-4 border-amber-800 p-10 shadow-sm italic text-xl text-slate-600">
              Onze enorme culturele erfenis en de plaats die muziek daarin inneemt is een bron voor de thema’s 
              en projecten die in de lessen worden uitgewerkt.
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <img 
              src="https://images.unsplash.com/photo-1520527053377-4710dbf6c0bc?auto=format&fit=crop&q=80&w=1000" 
              className="rounded-sm shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000" 
              alt="Piano detail"
            />
          </div>
        </div>
      </section>

      {/* --- TARGET AUDIENCES --- */}
      <section className="py-24 bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid md:grid-cols-2 gap-1px bg-white/10 border border-white/10">
            
            {/* KINDEREN */}
            <div id="kinderen" className="p-16 space-y-8 hover:bg-white/[0.02] transition-colors">
              <Sparkles className="text-amber-500" size={32} />
              <h3 className="text-3xl font-serif italic">Voor de Jonge Ontdekkers</h3>
              <p className="text-slate-400 leading-relaxed">
                Met jonge kinderen wordt er naast een methode ook met liedjes gewerkt. Deze zingen en klappen we en spelen ze tenslotte na. 
                We plakken ze dan in een mooi <strong>plakboek</strong> waar ook het huiswerk in komt te staan. 
                Samen met een mooie muziekkaart en de wekelijkse sticker ontstaat er een vrolijk en persoonlijk boek.
              </p>
              <ul className="space-y-4 text-sm tracking-wide text-slate-300">
                <li className="flex items-center gap-4"><Music size={16} className="text-amber-500" /> Klassiek, pop, jazz of blues</li>
                <li className="flex items-center gap-4"><Music size={16} className="text-amber-500" /> Drie voorspeelmiddagen per jaar</li>
                <li className="flex items-center gap-4"><Music size={16} className="text-amber-500" /> Stimulatie van eigen muzikale smaak</li>
              </ul>
            </div>

            {/* VOLWASSENEN */}
            <div id="volwassenen" className="p-16 space-y-8 hover:bg-white/[0.02] transition-colors">
              <Coffee className="text-amber-500" size={32} />
              <h3 className="text-3xl font-serif italic">Voor de Gevorderde Wens</h3>
              <p className="text-slate-400 leading-relaxed">
                Het is nooit te laat om een langgekoesterde wens te vervullen of oude lessen op te pakken. 
                In een vol bestaan gaan we flexibel om met oefentijd en afspraken. 
                Hoogtepunt is de jaarlijkse <strong>'avond onder ons'</strong>: een informele setting met koffie of een glas wijn.
              </p>
              <div className="p-6 border border-white/10 rounded-sm">
                <p className="text-sm italic text-amber-200/80">
                  "De avonden vinden plaats bij Annette thuis, zodat er gespeeld kan worden op de prachtige Steinway Concertvleugel."
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- ABOUT ANNETTE --- */}
      <section id="overannette" className="py-32 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            <div className="w-full lg:w-1/3">
              <div className="relative group">
                <div className="absolute inset-0 border-2 border-amber-800 translate-x-4 translate-y-4 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
                <img 
                  src="/api/placeholder/800/1000" 
                  alt="Annette Niels" 
                  className="w-full aspect-[4/5] object-cover rounded-sm shadow-xl"
                />
              </div>
            </div>
            
            <div className="w-full lg:w-2/3 space-y-8">
              <h2 className="text-5xl font-serif leading-tight">Annette Niels</h2>
              <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
                <p>
                  Na haar afstuderen aan <strong>ArtEZ</strong>, vervolgde Annette haar studie aan het 
                  <strong> Utrechts Conservatorium</strong> waar zij liedbegeleiding studeerde bij Thom Bollen. 
                  Sinds 2000 vormt zij een vast duo met zangeres Maria Kemler.
                </p>
                <p>
                  Als lid van de <strong>EPTA</strong> (European Piano Teachers Association) is zij actief betrokken 
                  bij de organisatie en jurering van landelijke graadexamens. Leerlingen van Klavierplezier 
                  krijgen dan ook de mogelijkheid om officieel erkende examens af te leggen.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-4">
                  <Award className="text-amber-800" />
                  <span className="text-xs uppercase tracking-widest font-bold">ArtEZ Alumna</span>
                </div>
                <div className="flex items-center gap-4">
                  <Star className="text-amber-800" />
                  <span className="text-xs uppercase tracking-widest font-bold">EPTA Jurylid</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTACT & LOCATION --- */}
      <section id="contact" className="py-32 bg-[#F4F2EE]">
        <div className="max-w-7xl mx-auto px-10 grid lg:grid-cols-2 gap-24">
          <div className="space-y-12">
            <h2 className="text-5xl font-serif">De Studio in Arnhem</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              De lespraktijk bevindt zich in een inspirerende omgeving in Arnhem Noord. 
              Hier komen traditie en modern pianospel samen.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <MapPin className="text-amber-800 mt-1" />
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs mb-1">Bezoekadres</h4>
                  <p className="text-slate-600">Bakenbergseweg 224, 6816 PL Arnhem</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <Mail className="text-amber-800 mt-1" />
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs mb-1">E-mail</h4>
                  <p className="text-slate-600 font-serif italic">info@klavierplezier.nl</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-12 shadow-xl">
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold">Uw Naam</label>
                <input type="text" className="w-full border-b border-slate-200 py-3 focus:border-amber-800 outline-none transition-colors bg-transparent" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold">E-mailadres</label>
                <input type="email" className="w-full border-b border-slate-200 py-3 focus:border-amber-800 outline-none transition-colors bg-transparent" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold">Bericht</label>
                <textarea rows="4" className="w-full border-b border-slate-200 py-3 focus:border-amber-800 outline-none transition-colors bg-transparent resize-none"></textarea>
              </div>
              <button className="w-full bg-[#1a1a1a] text-white py-5 uppercase tracking-[0.3em] text-xs hover:bg-amber-900 transition-colors duration-500">
                Verstuur Bericht
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 px-10 bg-white border-t border-slate-100 text-center">
        <div className="max-w-7xl mx-auto space-y-10">
          <h2 className="text-2xl font-serif tracking-widest uppercase">Klavierplezier</h2>
          <div className="flex justify-center gap-12 opacity-50 grayscale">
            <img src="/api/placeholder/100/40" alt="EPTA Logo" className="h-8 object-contain" />
            <img src="/api/placeholder/100/40" alt="ArtEZ Logo" className="h-8 object-contain" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400">
            © {new Date().getFullYear()} Klavierplezier Annette Niels • Arnhem Noord
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Klavierplezier;