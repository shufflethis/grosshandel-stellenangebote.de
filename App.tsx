import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  UserCircle, 
  Phone, 
  Mail, 
  Facebook, 
  Linkedin, 
  Twitter,
  Mic
} from 'lucide-react';
import JobCard from './components/JobCard';
import SeoContent from './components/SeoContent';
import VoiceAssistant from './components/VoiceAssistant';
import { Job, Page } from './types';

// Mock Data
const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Kaufmann im Groß- und Außenhandel (m/w/d)',
    company: 'Hanse Trade GmbH',
    location: 'Hamburg',
    type: 'Vollzeit',
    salary: '45.000 € - 55.000 €',
    postedAt: 'vor 2 Tagen',
    description: 'Wir suchen einen erfahrenen Kaufmann für den internationalen Einkauf von Elektronikkomponenten. Fließend Englisch vorausgesetzt.',
  },
  {
    id: '2',
    title: 'Fachkraft für Lagerlogistik (m/w/d)',
    company: 'Logistik Pro AG',
    location: 'Frankfurt am Main',
    type: 'Vollzeit',
    salary: '32.000 € - 38.000 €',
    postedAt: 'vor 5 Stunden',
    description: 'Organisieren Sie unser Hochregallager und steuern Sie den Warenausgang. Staplerschein erforderlich.',
  },
  {
    id: '3',
    title: 'Junior Sales Manager B2B (m/w/d)',
    company: 'BauStoff Welt',
    location: 'Berlin',
    type: 'Vollzeit',
    salary: '40.000 € + Provision',
    postedAt: 'vor 1 Woche',
    description: 'Starten Sie Ihre Karriere im Vertrieb von hochwertigen Baustoffen. Ideal für Quereinsteiger mit Vertriebstalent.',
  },
  {
    id: '4',
    title: 'Ausbildung zum Kaufmann für Büromanagement',
    company: 'Sanitär Großhandel Müller',
    location: 'München',
    type: 'Ausbildung',
    salary: '1.100 € (1. Lehrjahr)',
    postedAt: 'vor 3 Tagen',
    description: 'Lernen Sie alle kaufmännischen Abläufe in einem familiären Traditionsunternehmen kennen.',
  },
    {
    id: '5',
    title: 'Einkäufer Food & Beverage (m/w/d)',
    company: 'Gastro Service Nord',
    location: 'Hannover',
    type: 'Vollzeit',
    salary: '50.000 € - 65.000 €',
    postedAt: 'Gestern',
    description: 'Verantwortung für das Sortiment Frische & Tiefkühlkost. Verhandlung mit internationalen Lieferanten.',
  },
  {
    id: '6',
    title: 'Teamleiter Vertriebsinnendienst (m/w/d)',
    company: 'TechWholesale KG',
    location: 'Stuttgart',
    type: 'Vollzeit',
    salary: '60.000 € - 75.000 €',
    postedAt: 'vor 4 Tagen',
    description: 'Führen Sie ein Team von 10 Mitarbeitern und optimieren Sie unsere Vertriebsprozesse im Innendienst.',
  }
];

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');

  // Filter logic
  const filteredJobs = MOCK_JOBS.filter(job => 
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
    job.location.toLowerCase().includes(locationTerm.toLowerCase())
  );

  const navigateTo = (page: Page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigateTo(Page.HOME)}
          >
            <div className="bg-brand-600 text-white p-1.5 rounded-lg">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-brand-900 tracking-tight hidden sm:block">
              großhandel<span className="text-brand-600">-stellenangebote</span>.de
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
            <button onClick={() => navigateTo(Page.JOBS)} className={`hover:text-brand-600 transition-colors ${activePage === Page.JOBS ? 'text-brand-600 font-bold' : 'text-slate-600'}`}>Jobs finden</button>
            <button onClick={() => navigateTo(Page.EMPLOYERS)} className={`hover:text-brand-600 transition-colors ${activePage === Page.EMPLOYERS ? 'text-brand-600 font-bold' : 'text-slate-600'}`}>Für Arbeitgeber</button>
            <button onClick={() => navigateTo(Page.ABOUT)} className={`hover:text-brand-600 transition-colors ${activePage === Page.ABOUT ? 'text-brand-600 font-bold' : 'text-slate-600'}`}>Karriere-Ratgeber</button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsVoiceAssistantOpen(true)}
              className="hidden md:flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-brand-700 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              <Mic className="w-4 h-4" />
              <span>KI-Assistent</span>
            </button>
            <button className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
              Anmelden
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-slate-600 p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-4 animate-fade-in-down">
            <button onClick={() => navigateTo(Page.JOBS)} className="block w-full text-left py-2 font-medium text-slate-700">Jobs finden</button>
            <button onClick={() => navigateTo(Page.EMPLOYERS)} className="block w-full text-left py-2 font-medium text-slate-700">Für Arbeitgeber</button>
            <button onClick={() => navigateTo(Page.ABOUT)} className="block w-full text-left py-2 font-medium text-slate-700">Karriere-Ratgeber</button>
             <button 
              onClick={() => {
                  setIsVoiceAssistantOpen(true);
                  setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left py-2 font-medium text-brand-600"
            >
              <Mic className="w-4 h-4" />
              KI-Assistent öffnen
            </button>
          </div>
        )}
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow">
        
        {/* HERO SECTION (Only on Home) */}
        {activePage === Page.HOME && (
          <section className="relative bg-slate-900 overflow-hidden">
             {/* Abstract Background */}
            <div className="absolute inset-0 opacity-10">
                 <img src="https://picsum.photos/1920/1080?grayscale" alt="Warehouse Background" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-900 to-slate-900 opacity-90"></div>

            <div className="container mx-auto px-4 py-20 relative z-10 flex flex-col items-center text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                Karriere im <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500">Großhandel</span>
              </h1>
              <p className="text-brand-100 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                Finden Sie Top-Jobs in Einkauf, Logistik und Vertrieb. Wir verbinden führende Großhandelsunternehmen mit qualifizierten Fachkräften in ganz Deutschland.
              </p>

              {/* Search Box */}
              <div className="bg-white p-3 rounded-2xl shadow-xl w-full max-w-4xl flex flex-col md:flex-row gap-2">
                <div className="flex-grow flex items-center bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                  <Search className="w-5 h-5 text-slate-400 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Beruf, Stichwort oder Firma" 
                    className="bg-transparent border-none outline-none w-full text-slate-800 placeholder-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex-grow flex items-center bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                  <MapPin className="w-5 h-5 text-slate-400 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Stadt oder Postleitzahl" 
                    className="bg-transparent border-none outline-none w-full text-slate-800 placeholder-slate-400"
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => navigateTo(Page.JOBS)}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-brand-500/25 whitespace-nowrap"
                >
                  Jobs finden
                </button>
              </div>
              
              <div className="mt-8 flex gap-4 text-sm text-brand-200 font-medium">
                <span>Beliebte Suchen:</span>
                <span className="hover:text-white cursor-pointer underline decoration-brand-500 underline-offset-4">Logistikleiter</span>
                <span className="hover:text-white cursor-pointer underline decoration-brand-500 underline-offset-4">Einkauf</span>
                <span className="hover:text-white cursor-pointer underline decoration-brand-500 underline-offset-4">Außendienst</span>
              </div>
            </div>
          </section>
        )}

        {/* JOB LISTING SECTION */}
        {(activePage === Page.HOME || activePage === Page.JOBS) && (
          <section className="py-16 bg-slate-50">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Aktuelle Stellenangebote</h2>
                  <p className="text-slate-500">Die neuesten Jobs aus dem deutschen Großhandel.</p>
                </div>
                {activePage === Page.HOME && (
                  <button onClick={() => navigateTo(Page.JOBS)} className="hidden md:flex items-center text-brand-600 font-semibold hover:text-brand-800 transition-colors">
                    Alle Jobs ansehen <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.length > 0 ? (
                  filteredJobs.slice(0, activePage === Page.HOME ? 6 : undefined).map(job => (
                    <JobCard key={job.id} job={job} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-white rounded-lg border border-slate-200 border-dashed">
                    <p className="text-slate-500">Keine Jobs gefunden, die Ihren Kriterien entsprechen.</p>
                  </div>
                )}
              </div>
              
               {activePage === Page.HOME && (
                  <div className="mt-8 text-center md:hidden">
                    <button onClick={() => navigateTo(Page.JOBS)} className="bg-white border border-slate-300 text-slate-700 font-semibold py-2 px-6 rounded-full shadow-sm">
                      Alle Jobs laden
                    </button>
                  </div>
               )}
            </div>
          </section>
        )}

        {/* EMPLOYER TEASER */}
        {activePage === Page.HOME && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2">
                <img 
                  src="https://picsum.photos/800/600" 
                  alt="Modern Office" 
                  className="rounded-2xl shadow-2xl" 
                />
              </div>
              <div className="w-full md:w-1/2">
                <span className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-2 block">Für Arbeitgeber</span>
                <h2 className="text-4xl font-bold text-slate-900 mb-6">Finden Sie die Fachkräfte, die Sie brauchen.</h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  Der Fachkräftemangel im Großhandel ist spürbar. Wir nutzen innovative GEO (Generative Engine Optimization) Strategien, um Ihre Stellenanzeigen dort zu platzieren, wo moderne Kandidaten suchen: In Suchmaschinen und KI-Assistenten.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-slate-700">
                    <div className="bg-green-100 p-1 rounded-full mr-3 text-green-600"><Briefcase className="w-4 h-4" /></div>
                    Spezialisiert auf Großhandel & Logistik
                  </li>
                  <li className="flex items-center text-slate-700">
                    <div className="bg-green-100 p-1 rounded-full mr-3 text-green-600"><MapPin className="w-4 h-4" /></div>
                    Lokales Targeting für Ihre Region
                  </li>
                  <li className="flex items-center text-slate-700">
                    <div className="bg-green-100 p-1 rounded-full mr-3 text-green-600"><Search className="w-4 h-4" /></div>
                    KI-Optimierte Reichweite
                  </li>
                </ul>
                <button 
                  onClick={() => navigateTo(Page.EMPLOYERS)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl transition-all"
                >
                  Stellenanzeige schalten
                </button>
              </div>
            </div>
          </section>
        )}

        {/* CONTENT PAGES */}
        {(activePage === Page.ABOUT || activePage === Page.HOME) && (
             <SeoContent />
        )}
        
        {activePage === Page.EMPLOYERS && (
            <section className="py-20 bg-brand-50">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <h2 className="text-4xl font-bold text-brand-900 mb-6">Rekrutierung im Großhandel neu gedacht</h2>
                    <p className="text-lg text-brand-800 mb-10">
                        Nutzen Sie unsere Plattform, um gezielt qualifizierte Mitarbeiter für Lager, Einkauf, Vertrieb und Verwaltung zu gewinnen.
                    </p>
                    <div className="bg-white p-8 rounded-2xl shadow-lg text-left">
                        <h3 className="text-2xl font-bold mb-4">Preisübersicht</h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="border border-slate-200 p-6 rounded-xl hover:border-brand-500 transition-colors cursor-pointer">
                                <h4 className="font-bold text-lg mb-2">Standard Anzeige</h4>
                                <p className="text-3xl font-bold text-brand-600 mb-4">299 € <span className="text-sm text-slate-400 font-normal">/ 30 Tage</span></p>
                                <ul className="text-sm space-y-2 text-slate-600">
                                    <li>• Online für 30 Tage</li>
                                    <li>• Aufnahme in Google Jobs</li>
                                    <li>• Basis Support</li>
                                </ul>
                            </div>
                            <div className="border-2 border-brand-500 p-6 rounded-xl bg-brand-50 cursor-pointer relative">
                                <span className="absolute top-0 right-0 bg-brand-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">Empfohlen</span>
                                <h4 className="font-bold text-lg mb-2">Premium + AI Boost</h4>
                                <p className="text-3xl font-bold text-brand-600 mb-4">499 € <span className="text-sm text-slate-400 font-normal">/ 45 Tage</span></p>
                                <ul className="text-sm space-y-2 text-slate-600">
                                    <li>• Online für 45 Tage</li>
                                    <li>• <strong>Top-Platzierung</strong> auf der Startseite</li>
                                    <li>• <strong>KI-Optimierung</strong> (GEO) für ChatGPT & Gemini</li>
                                    <li>• Social Media Push</li>
                                </ul>
                            </div>
                        </div>
                         <button className="w-full mt-8 bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700">Jetzt buchen</button>
                    </div>
                </div>
            </section>
        )}

        {/* IMPRESSUM / LEGAL PLACEHOLDER */}
        {activePage === Page.IMPRESSUM && (
          <div className="container mx-auto px-4 py-16 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Impressum</h1>
            <div className="bg-white p-8 rounded-xl border border-slate-200 space-y-4 text-slate-600">
              <p><strong>Angaben gemäß § 5 TMG</strong></p>
              <p>
                Musterfirma Großhandel-Karriere GmbH<br />
                Musterstraße 123<br />
                12345 Musterstadt<br />
                Deutschland
              </p>
              <p>
                <strong>Vertreten durch:</strong><br />
                Max Mustermann
              </p>
              <p>
                <strong>Kontakt:</strong><br />
                Telefon: +49 (0) 123 44 55 66<br />
                E-Mail: info@grosshandel-stellenangebote.de
              </p>
              <p>
                <strong>Registereintrag:</strong><br />
                Eintragung im Handelsregister.<br />
                Registergericht: Amtsgericht Musterstadt<br />
                Registernummer: HRB 12345
              </p>
              <p>
                <strong>Umsatzsteuer:</strong><br />
                Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
                DE 123 456 789
              </p>
            </div>
          </div>
        )}

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4 text-white">
                <Briefcase className="w-6 h-6" />
                <span className="text-xl font-bold">großhandel<span className="text-brand-400">-stellenangebote</span>.de</span>
              </div>
              <p className="text-sm leading-relaxed mb-6">
                Die spezialisierte Jobbörse für den deutschen Großhandel. Wir bringen Fachkräfte und Unternehmen zusammen – digital, effizient und KI-optimiert.
              </p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Für Bewerber</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigateTo(Page.JOBS)} className="hover:text-brand-400 transition-colors">Jobs suchen</button></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Lebenslauf-Check</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Gehaltsvergleich</a></li>
                <li><button onClick={() => navigateTo(Page.ABOUT)} className="hover:text-brand-400 transition-colors">Karriere-Tipps</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Für Unternehmen</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigateTo(Page.EMPLOYERS)} className="hover:text-brand-400 transition-colors">Stelle aufgeben</button></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Preise & Produkte</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Partnerprogramm</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Recruiting-Ratgeber</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Rechtliches & Kontakt</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigateTo(Page.IMPRESSUM)} className="hover:text-brand-400 transition-colors">Impressum</button></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Datenschutz</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">AGB</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Kontakt</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} großhandel-stellenangebote.de. Alle Rechte vorbehalten. Made with React & Gemini AI.
          </div>
        </div>
      </footer>

      {/* Voice Assistant Overlay */}
      <VoiceAssistant 
        isOpen={isVoiceAssistantOpen} 
        onClose={() => setIsVoiceAssistantOpen(false)} 
      />

    </div>
  );
};

export default App;