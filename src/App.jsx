import React, { useEffect, useState } from 'react';
import { Music, Heart, BookOpen, Star, MapPin, Mail, Phone, ChevronDown, Award, Coffee, Sparkles, GraduationCap } from 'lucide-react';

const Klavierplezier = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#FAF9F6] text-[#2c2c2c] font-light selection:bg-amber-100 selection:text-amber-900">
      
      {/* --- ELEGANT NAVIGATION --- */}
      <nav className={`fixed w-full z-50 transition-all duration-700 ${scrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-md' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="group cursor-pointer">
            <h1 className="text-2xl font-serif font-bold tracking-[0.15em] uppercase text-slate-900">
              Klavier<span className="text-amber-800 italic group-hover:text-amber-600 transition-colors">plezier</span>
            </h1>
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-60">Annette Niels • Arnhem</p>
          </div>
          <div className="hidden lg:flex items-center space-x-10 text-[11px] uppercase tracking-[0.2em] font-medium">
            {['De Praktijk', 'Kinderen', 'Volwassenen', 'Over Annette', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '')}`} className="hover:text-amber-800 transition-colors">
                {item}
              </a>
            ))}
            <button className="bg-slate-900 text-white px-8 py-3 rounded-sm hover:bg-amber-900 transition-all shadow-lg hover:-translate-y-0.5">
              Kennismaking
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/40 z-10" />
          <img 
            src="/public/image_7f7e59.jpg" 
            className="w-full h-full object-cover scale-105"
            alt="Foto 2: De sfeervolle lespraktijk van Klavierplezier"
          />
        </div>
        
        <div className="relative z-20 text-center px-6 max-w-4xl">
          <span className="text-xs uppercase tracking-[0.6em] mb-6 block text-amber-900 font-semibold">Muziek is een persoonlijke reis</span>
          <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight text-slate-900">
            Vind jouw ritme <br />
            <span className="italic font-normal text-amber-900 text-4xl md:text-6xl">bij de bron.</span>
          </h2>
          <div className="w-24 h-[1px] bg-amber-800 mx-auto mb-8" />
          <p className="text-lg md:text-xl font-serif italic text-slate-800 leading-relaxed">
            "De piano is geen instrument, het is een verlengstuk van wie je bent."
          </p>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
           <ChevronDown size={32} />
        </div>
      </section>

      {/* --- FILOSOFIE: DE PRAKTIJK --- */}
      <section id="depraktijk" className="py-32 px-8 max-w-7xl mx-auto border-b border-slate-200">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h3 className="text-xs uppercase tracking-[0.4em] text-amber-800 font-bold">Pianoles in Arnhem</h3>
            <h2 className="text-4xl md:text-5xl font-serif leading-snug text-slate-900">
              Een serieuze aanpak met een <span className="italic underline decoration-amber-200 underline-offset-8">enthousiast hart.</span>
            </h2>
            <p className="text-lg leading-relaxed text-slate-600">
              Annette Niels heeft een grote belangstelling voor ieders persoonlijke en muzikale ontwikkeling. 
              In mijn praktijk aan de rand van de wijken **Gulden Bodem, Hoogkamp en Schaarsbergen** staat de leerling centraal. 
              Of je nu 6 of 86 bent, we kijken samen naar jouw unieke mogelijkheden.
            </p>
            <p className="text-slate-600 leading-relaxed">
              De vele aspecten van de muziek, zoals techniek, geschiedenis, haar vele verschijningsvormen, 
              muziek en het brein en ‘de mens en muziek’ hebben haar speciale interesse. De leidraad is de lange en 
              prachtige traditie van het pianospel, maar de invulling is altijd modern en afgestemd op de eigenheid van de pianist.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-t-full overflow-hidden shadow-2xl border-8 border-white">
              <img src="/public/image_7f7e59.jpg" className="w-full h-full object-cover" alt="Foto 2: De studio" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-8 shadow-xl max-w-xs hidden lg:block">
              <Quote className="text-amber-800 mb-4" />
              <p className="font-serif italic text-slate-700">
                Onze enorme culturele erfenis is een bron voor de thema’s en projecten in de les.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- KINDEREN: CREATIVITEIT & PLEZIER --- */}
      <section id="kinderen" className="py-32 bg-white px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2 order-2 md:order-1 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-48 bg-amber-50 rounded-2xl flex flex-col items-center justify-center text-amber-800 p-6 text-center">
                  <Sparkles size={32} className="mb-2" />
                  <span className="text-xs font-bold uppercase tracking-widest">Wekelijkse Stickers</span>
                </div>
                <div className="h-64 bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
                   <img src="https://images.unsplash.com/photo-1514119412350-e174d90d280e?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover grayscale" alt="Piano" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-64 bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
                   <img src="https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Detail" />
                </div>
                <div className="h-48 bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white p-6 text-center">
                  <BookOpen size={32} className="mb-2" />
                  <span className="text-xs font-bold uppercase tracking-widest">Persoonlijk Plakboek</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 order-1 md:order-2 space-y-8">
              <h2 className="text-4xl font-serif text-slate-900">Voor de jonge ontdekkers</h2>
              <p className="text-lg text-slate-600 leading-relaxed font-serif italic">
                "Muzikale smaak is een ontwikkeling die gerespecteerd en gestimuleerd moet worden."
              </p>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Met jonge kinderen wordt er naast een methode ook met liedjes gewerkt. Deze zingen en klappen we en spelen ze tenslotte na. 
                  We plakken ze dan in een mooi <strong>plakboek</strong> waar ook het huiswerk in komt te staan. Samen met een mooie muziekkaart 
                  en de wekelijkse sticker ontstaat er een vrolijk en persoonlijk boek.
                </p>
                <p>
                  Hoe groter de kinderen worden hoe specifieker hun eigen wensen. Klassieke of popmuziek, jazz en bluesimprovisatie: 
                  het ligt allemaal binnen de mogelijkheden. Delen en verbinden is essentieel; daarom organiseren we drie voorspeelmiddagen per jaar.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                 <div className="px-4 py-2 bg-amber-50 text-amber-800 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-100">Thema Projecten</div>
                 <div className="px-4 py-2 bg-amber-50 text-amber-800 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-100">Voorspeelmiddagen</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- VOLWASSENEN: FLEXIBILITEIT & DE STEINWAY --- */}
      <section id="volwassenen" className="py-32 bg-slate-900 text-white px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-900/10 -skew-x-12 translate-x-10" />
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-3 text-amber-400">
               <Coffee size={24} />
               <span className="text-xs font-bold uppercase tracking-[0.3em]">Onder ons</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif leading-tight text-white">
              Eindelijk die langgekoesterde <span className="italic text-amber-200 text-3xl md:text-4xl">wens vervullen.</span>
            </h2>
            <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
              <p>
                Ook als volwassene is het fijn om vroegere lessen weer op te pakken of nu eindelijk eens die stap te zetten. 
                In een vol bestaan kunnen afspraken en oefenen onder druk komen te staan; daar wordt zo flexibel mogelijk mee omgegaan.
              </p>
              <div className="bg-white/5 border border-white/10 p-10 rounded-sm italic font-serif text-amber-100 text-xl leading-relaxed shadow-2xl backdrop-blur-sm">
                "Eén keer per jaar hebben we een avondje ‘onder ons’. Er worden stukken voor elkaar gespeeld onder het genot van een kop koffie 
                of een glas wijn, op de prachtige **Steinway Concertvleugel** bij Annette thuis."
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 hidden lg:block">
            <img src="https://images.unsplash.com/photo-1520527053377-4710dbf6c0bc?auto=format&fit=crop&q=80&w=1000" className="rounded-sm grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl opacity-60 hover:opacity-100" alt="Steinway Detail" />
          </div>
        </div>
      </section>

      {/* --- OVER ANNETTE --- */}
      <section id="overannette" className="py-32 px-8 bg-[#F4F2EE]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-5 relative">
              <div className="absolute inset-0 border-[12px] border-white -translate-x-6 -translate-y-6 z-0 shadow-lg" />
              <img 
                src="/public/image_7f7e3a.png" 
                className="w-full relative z-10 shadow-2xl" 
                alt="Foto 1: Annette Niels" 
              />
              <div className="absolute -bottom-6 -right-6 bg-slate-900 p-8 text-white z-20 shadow-xl">
                 <Award size={40} className="text-amber-400" />
              </div>
            </div>
            <div className="md:col-span-7 space-y-8 lg:pl-10">
              <h2 className="text-5xl font-serif text-slate-900">Annette Niels</h2>
              <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
                <p>
                  Na mijn afstuderen aan <strong>ArtEZ</strong> heb ik mijn studie vervolgd aan het <strong>Utrechts Conservatorium</strong>, 
                  waar ik liedbegeleiding studeerde bij Thom Bollen. Sinds 2000 vorm ik een duo met zangeres Maria Kemler; wij treden regelmatig op.
                </p>
                <p>
                  Ik ben lid van de <strong>EPTA</strong>, waar ik actief ben bij de organisatie en jurering van de landelijke graadexamens. 
                  Voor mijn leerlingen is er dan ook de mogelijkheid om aan deze examens deel te nemen.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
                <div className="flex items-start gap-4 p-6 bg-white shadow-sm border-t-2 border-amber-800">
                  <GraduationCap className="text-amber-800" size={28} />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-1">Pedagogisch Expert</h4>
                    <p className="text-xs text-slate-500">Focus op techniek, brein & menselijke ontwikkeling.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-white shadow-sm border-t-2 border-amber-800">
                  <Star className="text-amber-800" size={28} />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-1">EPTA Gecertificeerd</h4>
                    <p className="text-xs text-slate-500">Mogelijkheid tot landelijke graadexamens.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTACT & LOCATIE --- */}
      <section id="contact" className="py-32 px-8 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div>
              <h2 className="text-5xl font-serif mb-8 text-slate-900">Contact & Locatie</h2>
              <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                De lespraktijk bevindt zich in de inspirerende omgeving van Arnhem Noord. 
                Gevestigd aan de prachtige **Bakenbergseweg 224**, goed bereikbaar met de fiets, auto en het openbaar vervoer.
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                { icon: MapPin, title: 'Bezoekadres', desc: 'Bakenbergseweg 224, 6816 PL Arnhem' },
                { icon: Phone, title: 'Telefoon', desc: 'Voor vragen of overleg' },
                { icon: Mail, title: 'E-mail', desc: 'info@klavierplezier.nl' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-6 bg-[#FAF9F6] rounded-sm group hover:bg-slate-900 hover:text-white transition-all duration-500">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-amber-800 shadow-sm">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-[0.2em]">{item.title}</h4>
                    <p className="opacity-70 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#FAF9F6] p-12 rounded-sm shadow-2xl relative">
            <div className="absolute inset-0 border-2 border-amber-800/10 -m-4 rounded-sm" />
            <h3 className="text-2xl font-serif mb-8 text-center uppercase tracking-widest text-slate-800">Stuur een bericht</h3>
            <form className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                <input type="text" placeholder="Naam" className="w-full bg-white border border-slate-200 rounded-sm px-6 py-4 focus:ring-1 focus:ring-amber-800 outline-none transition-all" />
                <input type="email" placeholder="E-mailadres" className="w-full bg-white border border-slate-200 rounded-sm px-6 py-4 focus:ring-1 focus:ring-amber-800 outline-none transition-all" />
              </div>
              <textarea placeholder="Uw bericht" rows="4" className="w-full bg-white border border-slate-200 rounded-sm px-6 py-4 focus:ring-1 focus:ring-amber-800 outline-none transition-all"></textarea>
              <button className="w-full bg-slate-900 text-white font-bold py-5 rounded-sm hover:bg-amber-900 transition-all uppercase tracking-[0.3em] text-xs shadow-lg">
                Verstuur Aanvraag
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-white py-20 px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-serif tracking-[0.3em] uppercase">Klavierplezier</h2>
            <p className="text-amber-400 text-[10px] tracking-[0.4em] uppercase">Annette Niels • Muziekpraktijk</p>
          </div>
          
          <div className="flex gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
            <img src="/api/placeholder/120/40" alt="EPTA Logo" className="h-8 object-contain" />
            <img src="/api/placeholder/120/40" alt="ArtEZ Logo" className="h-8 object-contain" />
          </div>

          <div className="w-full h-[1px] bg-white/10" />

          <div className="flex flex-col md:flex-row justify-between w-full items-center gap-8 text-[10px] text-slate-500 uppercase tracking-widest">
            <p>© {new Date().getFullYear()} Klavierplezier Annette Niels. Alle rechten voorbehouden.</p>
            <div className="flex space-x-10">
               <a href="#" className="hover:text-amber-400">Privacybeleid</a>
               <a href="#" className="hover:text-amber-400">Algemene Voorwaarden</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Klavierplezier;