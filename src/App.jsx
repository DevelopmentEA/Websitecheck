import React, { useEffect, useState } from 'react';
import { Music, Heart, BookOpen, Calendar, Mail, MapPin, Phone, ChevronDown, Award, Star } from 'lucide-react';

const Klavierplezier = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#FAF9F6] text-[#1a1a1a] font-light selection:bg-amber-100 selection:text-amber-900">
      
      {/* --- NAVIGATION --- */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="group cursor-pointer">
            <h1 className="text-2xl font-serif font-bold tracking-[0.2em] uppercase">
              Klavier<span className="text-amber-700 group-hover:text-amber-500 transition-colors">plezier</span>
            </h1>
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-60">Annette Niels • Arnhem</p>
          </div>
          <div className="hidden md:flex items-center space-x-10 text-sm uppercase tracking-widest font-medium">
            {['Lessen', 'Over Annette', 'Projecten', 'Agenda', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-amber-700 transition-colors">
                {item}
              </a>
            ))}
            <button className="bg-[#1a1a1a] text-white px-6 py-3 rounded-full hover:bg-amber-800 transition-all transform hover:-translate-y-1">
              Proefles Boeken
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/10 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1520527053377-4710dbf6c0bc?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
            alt="Piano keys"
          />
        </div>
        
        <div className="relative z-20 text-center text-white px-6">
          <h2 className="text-sm uppercase tracking-[0.5em] mb-6 animate-fade-in">Muziek is een persoonlijke reis</h2>
          <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-tight">
            Vind jouw ritme <br />
            <span className="italic font-normal">bij de bron.</span>
          </h1>
          <div className="flex justify-center gap-6 mt-12">
            <ChevronDown className="animate-bounce w-10 h-10 opacity-70" />
          </div>
        </div>
      </section>

      {/* --- PHILOSOPHY: Oog voor Eigenheid --- */}
      <section id="lessen" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-1 border border-amber-700/30 rounded-full text-amber-800 text-xs tracking-widest uppercase">
              Onze Methode
            </div>
            <h2 className="text-4xl md:text-5xl font-serif leading-snug text-slate-900">
              Een serieuze aanpak met een <span className="italic">enthousiast hart.</span>
            </h2>
            <p className="text-lg leading-relaxed text-slate-600">
              In mijn praktijk aan de rand van de wijken **Gulden Bodem, Hoogkamp en Schaarsbergen** staat de leerling centraal. Of je nu 6 of 86 bent, we kijken samen naar jouw unieke mogelijkheden. 
            </p>
            <blockquote className="border-l-4 border-amber-700 pl-6 italic text-xl text-slate-700 my-8">
              "De piano is geen instrument, het is een verlengstuk van wie je bent."
            </blockquote>
            <p className="text-slate-600 leading-relaxed">
              De leidraad is de lange en prachtige traditie van het pianospel, maar de invulling is altijd modern en afgestemd op de eigenheid van de pianist.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 relative">
             <div className="space-y-4 pt-12">
                <img src="https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&q=80&w=600" className="rounded-2xl shadow-lg grayscale hover:grayscale-0 transition-all duration-700" alt="Details" />
                <div className="bg-amber-700 p-8 rounded-2xl text-white">
                   <Music className="mb-4" size={32} />
                   <h3 className="font-serif text-2xl">Traditie</h3>
                </div>
             </div>
             <div className="space-y-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-50">
                   <Heart className="mb-4 text-amber-700" size={32} />
                   <h3 className="font-serif text-2xl text-slate-900">Passie</h3>
                </div>
                <img src="https://images.unsplash.com/photo-1514119412350-e174d90d280e?auto=format&fit=crop&q=80&w=600" className="rounded-2xl shadow-lg" alt="Piano" />
             </div>
          </div>
        </div>
      </section>

      {/* --- OVER ANNETTE --- */}
      <section id="annette" className="bg-[#1a1a1a] text-white py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="w-full aspect-square bg-slate-800 rounded-full overflow-hidden border-8 border-white/5">
               <img src="/api/placeholder/800/800" alt="Annette Niels" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-amber-700 p-10 rounded-full hidden lg:block animate-pulse">
               <Award size={48} />
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-5xl font-serif">Annette Niels</h2>
            <p className="text-xl text-slate-300 leading-relaxed font-light">
              Gecertificeerd docente met een diepe liefde voor het vak. Als lid van **EPTA Nederland** en partner van **Muziek Maakt Slim**, waarborg ik de hoogste kwaliteit in muzikale educatie.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm tracking-wider uppercase opacity-80">
              <div className="flex items-center gap-3"><Star className="text-amber-500" /> 20+ Jaar Ervaring</div>
              <div className="flex items-center gap-3"><Star className="text-amber-500" /> EPTA Gecertificeerd</div>
              <div className="flex items-center gap-3"><Star className="text-amber-500" /> Pedagogisch Expert</div>
              <div className="flex items-center gap-3"><Star className="text-amber-500" /> Artistiek Coach</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- THEMA'S & PROJECTEN --- */}
      <section id="projecten" className="py-32 px-8 bg-white">
        <div className="max-w-5xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Thema's & Projecten</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Muziek maken doe je niet alleen voor jezelf. Bij Klavierplezier organiseren we regelmatig projecten om samen te groeien.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { title: 'Leerlingenconcerten', date: 'Mei 2024', desc: 'Een podium voor iedereen, van beginners tot gevorderden.' },
            { title: 'Thema Avonden', date: 'Maandelijks', desc: 'Verdieping in specifieke componisten of stijlen.' },
            { title: 'Vakantie Cursus', date: 'Zomer', desc: 'Intensieve weken voor een boost in je spel.' }
          ].map((project, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="h-64 bg-slate-100 rounded-3xl mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white border border-white px-6 py-2 rounded-full uppercase text-xs tracking-widest">Bekijk Foto's</span>
                </div>
              </div>
              <h3 className="text-2xl font-serif mb-2">{project.title}</h3>
              <p className="text-amber-700 text-sm font-bold mb-3">{project.date}</p>
              <p className="text-slate-500 leading-relaxed">{project.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- LOCATION & CONTACT --- */}
      <section id="contact" className="py-32 px-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div>
              <h2 className="text-5xl font-serif mb-8">Contact & Locatie</h2>
              <p className="text-slate-600 mb-8 text-lg">
                De lespraktijk bevindt zich aan de prachtige **Bakenbergseweg 224** in Arnhem Noord. Makkelijk bereikbaar met de fiets, auto en OV.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6 p-4 bg-white rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-700">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Bezoekadres</h4>
                  <p className="text-slate-500 text-sm">Bakenbergseweg 224, 6816 PL Arnhem</p>
                </div>
              </div>
              <div className="flex items-center gap-6 p-4 bg-white rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-700">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Telefoon</h4>
                  <p className="text-slate-500 text-sm">Neem telefonisch contact op</p>
                </div>
              </div>
              <div className="flex items-center gap-6 p-4 bg-white rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-700">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold">E-mail</h4>
                  <p className="text-slate-500 text-sm">info@klavierplezier.nl</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[2rem] shadow-2xl shadow-slate-200">
            <h3 className="text-2xl font-serif mb-8 text-center uppercase tracking-widest">Stuur een bericht</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input type="text" placeholder="Naam" className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-amber-700 outline-none" />
                <input type="email" placeholder="E-mailadres" className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-amber-700 outline-none" />
              </div>
              <select className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-amber-700 outline-none text-slate-500">
                <option>Ik heb een vraag over...</option>
                <option>Proefles aanvragen</option>
                <option>Tarieven en agenda</option>
                <option>Anders</option>
              </select>
              <textarea placeholder="Uw bericht" rows="4" className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-amber-700 outline-none"></textarea>
              <button className="w-full bg-[#1a1a1a] text-white font-bold py-5 rounded-xl hover:bg-amber-700 transition-all uppercase tracking-widest shadow-lg">
                Verstuur Aanvraag
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white py-12 px-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-10 opacity-40 grayscale hover:grayscale-0 transition-all">
            <img src="/api/placeholder/120/40" alt="EPTA Logo" className="h-10 object-contain" />
            <img src="/api/placeholder/120/40" alt="Muziek Maakt Slim" className="h-10 object-contain" />
          </div>
          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} Klavierplezier Annette Niels. 
          </div>
          <div className="flex space-x-6 text-slate-400 text-sm">
             <a href="#" className="hover:text-amber-700">Privacybeleid</a>
             <a href="#" className="hover:text-amber-700">Voorwaarden</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Klavierplezier;