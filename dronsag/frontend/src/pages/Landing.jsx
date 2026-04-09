import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Landing = () => {
  // ========== STATE MANAGEMENT ==========
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showFreelancerModal, setShowFreelancerModal] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({ jobs: 0, freelancers: 0, completed: 0, earnings: 0 });
  const [jobs, setJobs] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [targetStats, setTargetStats] = useState({ jobs: 1247, freelancers: 528, completed: 9876, earnings: 2450000 });

  // ========== REFERENCIÁK ==========
  const heroRef = useRef(null);
  const jobsRef = useRef(null);
  const freelancersRef = useRef(null);
  const statsRef = useRef(null);
  const howItWorksRef = useRef(null);
  const ctaRef = useRef(null);

  // ========== SCROLL EFFECTS ==========
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      const sections = [
        { id: 'hero', ref: heroRef },
        { id: 'jobs', ref: jobsRef },
        { id: 'freelancers', ref: freelancersRef },
        { id: 'stats', ref: statsRef },
        { id: 'how-it-works', ref: howItWorksRef },
        { id: 'cta', ref: ctaRef }
      ];
      
      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ========== STATISZTIKA ANIMÁCIÓ ==========
  useEffect(() => {
    const duration = 2000;
    let startTime = Date.now();
    let animationFrame;
    
    const updateStats = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setStats({
        jobs: Math.floor(progress * targetStats.jobs),
        freelancers: Math.floor(progress * targetStats.freelancers),
        completed: Math.floor(progress * targetStats.completed),
        earnings: Math.floor(progress * targetStats.earnings)
      });
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateStats);
      }
    };
    
    animationFrame = requestAnimationFrame(updateStats);
    return () => cancelAnimationFrame(animationFrame);
  }, [targetStats]);

  // ========== ADATOK LEKÉRÉSE (ADATBÁZIS) ==========
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        // 1. Statisztikák lekérése
        const statsRes = await fetch(`${apiUrl}/projects/system-stats`);
        const statsData = await statsRes.json();
        if (statsData.success && statsData.stats) {
          setTargetStats({
            jobs: statsData.stats.jobs || 1247,
            freelancers: statsData.stats.freelancers || 528,
            completed: statsData.stats.completed || 1200,
            earnings: statsData.stats.earnings || 2450000
          });
        }

        // 2. Legfrissebb projektek lekérése
        const projRes = await fetch(`${apiUrl}/projects`);
        const projData = await projRes.json();
        if (projData.success) {
          const formattedJobs = projData.projects.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            budget: p.budget,
            budgetType: p.budget_type,
            location: p.location,
            category: p.category,
            postedDate: new Date(p.created_at).toLocaleDateString('hu-HU'),
            deadline: new Date(p.deadline).toLocaleDateString('hu-HU'),
            proposals: p.proposals_count,
            skills: p.skills_required || [],
            client: {
              name: p.customer_name,
              rating: 5.0,
              reviews: 0,
              verified: true
            },
            featured: p.featured === 1
          }));
          setJobs(formattedJobs.slice(0, 6)); // Csak a legújabb 6 projekt
        }

        // 3. Kiemelt pilóták lekérése
        const pilotRes = await fetch(`${apiUrl}/auth/pilots`);
        const pilotData = await pilotRes.json();
        if (pilotData.success) {
          setFreelancers(pilotData.pilots.slice(0, 6)); // Csak a top 6 pilóta
        }
      } catch (error) {
        console.error("Hiba az adatok lekérésekor:", error);
      }
    };
    fetchData();
  }, []);

  // ========== JOBS ADATOK ==========
  const jobCategories = [
    { id: 'all', name: 'Összes', count: 1247 },
    { id: 'photography', name: 'Légifotó', count: 432 },
    { id: 'videography', name: 'Videózás', count: 356 },
    { id: 'inspection', name: 'Ellenőrzés', count: 289 },
    { id: 'mapping', name: 'Térképezés', count: 178 },
    { id: 'delivery', name: 'Szállítás', count: 92 }
  ];

  const filteredJobs = jobs.filter(job => {
    if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !job.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedLocation && !job.location.includes(selectedLocation)) return false;
    if (job.budgetType === 'fix' && (job.budget < priceRange.min || job.budget > priceRange.max)) return false;
    return true;
  });

  // ========== FREELANCERS ADATOK ==========
  const freelancerCategories = [
    { id: 'all', name: 'Összes', count: 528 },
    { id: 'photography', name: 'Fotós', count: 156 },
    { id: 'videography', name: 'Videós', count: 143 },
    { id: 'inspection', name: 'Ellenőrzés', count: 98 },
    { id: 'mapping', name: 'Térképezés', count: 76 },
    { id: 'delivery', name: 'Szállítás', count: 55 }
  ];

  const filteredFreelancers = freelancers.filter(f => {
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !f.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !f.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedLocation && !f.location.includes(selectedLocation)) return false;
    if (f.hourlyRate < priceRange.min || f.hourlyRate > priceRange.max) return false;
    return true;
  });

  // ========== HOW IT WORKS ==========
  const howItWorks = [
    {
      step: 1,
      title: "Projekt meghirdetése",
      description: "Add meg a projekt részleteit, helyszínt, időpontot és költségkeretet. Teljesen ingyenes!",
      icon: "📋"
    },
    {
      step: 2,
      title: "Ajánlatok fogadása",
      description: "A regisztrált pilóták ajánlatokat küldenek, te pedig összehasonlíthatod őket.",
      icon: "📨"
    },
    {
      step: 3,
      title: "Kiválasztás és munka",
      description: "Válaszd ki a legjobb ajánlatot, és a pilóta elvégzi a munkát.",
      icon: "✅"
    },
    {
      step: 4,
      title: "Értékelés és fizetés",
      description: "Ha elégedett vagy, a pénz kifizetésre kerül, és értékelheted a pilótát.",
      icon: "💰"
    }
  ];

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700">
      
      {/* ===== NAVBAR ===== */}
      <Navbar />

      {/* ===== HERO SZEKCIÓ ===== */}
      <section ref={heroRef} id="hero" className="pt-24 pb-16 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 transition-all duration-700">
        <div className="container mx-auto max-w-7xl transition-all duration-700">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="transition-all duration-700">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-700">
                Találd meg a legjobb 
                <span className="text-blue-600 dark:text-blue-400"> drónpilótát</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 transition-all duration-700">
                Magyarország legnagyobb drónos piactere. Több mint 500 ellenőrzött pilóta, 
                1200+ sikeres projekt.
              </p>

              {/* Kereső */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 mb-6 transition-all duration-700">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Keresés projektek vagy pilóták között..."
                    className="flex-1 px-4 py-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white transition-all duration-700"
                  />
                  <button 
                    onClick={() => navigate(`/find-work?q=${encodeURIComponent(searchQuery)}`)} 
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 whitespace-nowrap">
                    Keresés
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 transition-all duration-700">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full transition-all duration-700"></span>
                  500+ pilóta
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full transition-all duration-700"></span>
                  1200+ projekt
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full transition-all duration-700"></span>
                  98% elégedettség
                </span>
              </div>
            </div>

            <div className="relative transition-all duration-700 mt-8 lg:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Drone"
                className="rounded-lg shadow-2xl transition-all duration-700 w-full h-auto"
              />
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-700">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 transition-all duration-700">98%</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-all duration-700">Ügyfél<br />elégedettség</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATISZTIKA ===== */}
      <section ref={statsRef} id="stats" className="py-16 px-4 bg-gray-50 dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700 transition-all duration-700">
        <div className="container mx-auto max-w-7xl transition-all duration-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="transition-all duration-700">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-all duration-700">{stats.jobs}+</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-all duration-700">Meghirdetett projekt</div>
            </div>
            <div className="transition-all duration-700">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-all duration-700">{stats.freelancers}+</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-all duration-700">Aktív pilóta</div>
            </div>
            <div className="transition-all duration-700">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-all duration-700">{stats.completed}+</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-all duration-700">Sikeres projekt</div>
            </div>
            <div className="transition-all duration-700">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-all duration-700">{stats.earnings.toLocaleString()} €</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-all duration-700">Kifizetett összeg</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AKTUÁLIS PROJEKTEK ===== */}
      <section ref={jobsRef} id="jobs" className="py-24 px-4 transition-all duration-700">
        <div className="container mx-auto max-w-7xl transition-all duration-700">
          <div className="flex flex-wrap items-center justify-between mb-12">
            <div className="transition-all duration-700">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-all duration-700">Aktuális projektek</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-all duration-700">Tallózz a legfrissebb munkák között</p>
            </div>
            <Link to="/find-work" className="text-blue-600 dark:text-blue-400 hover:underline transition-all duration-300 text-sm sm:text-base">
              Összes projekt megtekintése →
            </Link>
          </div>

          {/* Kategória szűrő */}
          <div className="flex flex-wrap gap-2 mb-8">
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {jobCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/find-work?category=${cat.id}`}
                  className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white"
                >
                  {cat.name} <span className="text-xs opacity-75">({cat.count})</span>
                </Link>
              ))}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Szűrők</span>
              <span className="sm:hidden">Szűrők</span>
            </button>
          </div>

          {/* Szűrők panel */}
          {showFilters && (
            <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-all duration-700">
                    Helyszín
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white transition-all duration-700"
                  >
                    <option value="">Minden helyszín</option>
                    <option value="Budapest">Budapest</option>
                    <option value="Győr">Győr</option>
                    <option value="Miskolc">Miskolc</option>
                    <option value="Szeged">Szeged</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-all duration-700">
                    Ár minimum
                  </label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white transition-all duration-700"
                    placeholder="0 €"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-all duration-700">
                    Ár maximum
                  </label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value) || 1000})}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white transition-all duration-700"
                    placeholder="1000 €"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedLocation('');
                      setPriceRange({ min: 0, max: 1000 });
                    }}
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                  >
                    Szűrők törlése
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Projektek grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden"
                onClick={() => {
                  setSelectedJob(job);
                  setShowJobModal(true);
                }}
              >
                {job.featured && (
                  <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-br-lg transition-all duration-700 z-10">
                    Kiemelt
                  </div>
                )}
                <div className="p-6 pt-8">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 pr-4">
                      {job.title}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 transition-all duration-700 whitespace-nowrap">{job.postedDate}</span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4 line-clamp-2 transition-all duration-700">
                    {job.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white transition-all duration-700">{job.budget} €</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 transition-all duration-700">/{job.budgetType === 'fix' ? 'fix' : 'óra'}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 transition-all duration-700">{job.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded transition-all duration-700">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 transition-all duration-700">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white transition-all duration-700">{job.client.name}</span>
                      {job.client.verified && (
                        <span className="text-blue-600 dark:text-blue-400 text-xs transition-all duration-700">✓</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 transition-all duration-700">
                      {job.proposals} ajánlat
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/find-work"
              className="inline-block px-5 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base"
            >
              Összes projekt megtekintése
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PILÓTÁK ===== */}
      <section ref={freelancersRef} id="freelancers" className="py-24 px-4 bg-gray-50 dark:bg-gray-800 transition-all duration-700">
        <div className="container mx-auto max-w-7xl transition-all duration-700">
          <div className="flex flex-wrap items-center justify-between mb-12">
            <div className="transition-all duration-700">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-all duration-700">Legjobb pilótáink</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-all duration-700">Ellenőrzött szakemberek, profi felszereléssel</p>
            </div>
            <Link to="/find-freelancers" className="text-blue-600 dark:text-blue-400 hover:underline transition-all duration-300 text-sm sm:text-base">
              Összes pilóta megtekintése →
            </Link>
          </div>

          {/* Kategória szűrő */}
          <div className="flex flex-wrap gap-2 mb-8">
            {freelancerCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/find-freelancers?category=${cat.id}`}
                className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white"
              >
                {cat.name} <span className="text-xs opacity-75">({cat.count})</span>
              </Link>
            ))}
          </div>

          {/* Pilóták grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFreelancers.map((f) => (
              <div
                key={f.id}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => {
                  setSelectedFreelancer(f);
                  setShowFreelancerModal(true);
                }}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img src={f.image} alt={f.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-gray-200 dark:border-gray-600 transition-all duration-700" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
                          {f.name}
                        </h3>
                        {f.verified && (
                          <span className="text-blue-600 dark:text-blue-400 text-xs transition-all duration-700">✓</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 transition-all duration-700">{f.title}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4 line-clamp-2 transition-all duration-700">
                    {f.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {f.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 text-xs rounded transition-all duration-700">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white transition-all duration-700">{f.hourlyRate} €</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 transition-all duration-700">/óra</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 transition-all duration-700">★</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white transition-all duration-700">{f.rating}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 transition-all duration-700">({f.reviews})</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between text-xs transition-all duration-700">
                    <span className="text-gray-500 dark:text-gray-400 transition-all duration-700">{f.location}</span>
                    <span className="text-green-600 dark:text-green-400 transition-all duration-700">{f.availability}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section ref={howItWorksRef} id="how-it-works" className="py-24 px-4 transition-all duration-700">
        <div className="container mx-auto max-w-7xl transition-all duration-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-4 transition-all duration-700">Hogyan működik?</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto transition-all duration-700">
            Négy egyszerű lépésben megtalálhatod a projektedhez legmegfelelőbb drónpilótát.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step) => (
              <div key={step.step} className="text-center transition-all duration-700">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-3xl transition-all duration-700">
                  {step.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-all duration-700">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-all duration-700">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section ref={ctaRef} id="cta" className="py-24 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-y border-gray-200 dark:border-gray-800 transition-all duration-700">
        <div className="container mx-auto max-w-4xl text-center transition-all duration-700">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-700">
            Készen állsz a felszállásra?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto transition-all duration-700">
            Csatlakozz Magyarország legnagyobb drónos közösségéhez. Ingyenes regisztráció, ellenőrzött pilóták, biztonságos fizetés.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
              Projektet hirdetek
            </Link>
            <Link to="/register?type=driver" className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-medium">
              Pilóta leszek
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-all duration-700">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full transition-all duration-700"></span>
              Ingyenes regisztráció
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full transition-all duration-700"></span>
              Ellenőrzött pilóták
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full transition-all duration-700"></span>
              Biztonságos fizetés
            </span>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <Footer />

      {/* ===== PROJEKT MODAL ===== */}
      {showJobModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-all duration-700">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-all duration-700">{selectedJob.title}</h2>
                <button
                  onClick={() => setShowJobModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-300 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full transition-all duration-700">
                    {selectedJob.category === 'photography' && 'Légifotó'}
                    {selectedJob.category === 'videography' && 'Videózás'}
                    {selectedJob.category === 'inspection' && 'Ellenőrzés'}
                    {selectedJob.category === 'mapping' && 'Térképezés'}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 transition-all duration-700">{selectedJob.location}</span>
                  <span className="text-gray-500 dark:text-gray-400 transition-all duration-700">{selectedJob.postedDate}</span>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 transition-all duration-700">Leírás</h3>
                  <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">{selectedJob.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 transition-all duration-700">Elvárt készségek</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded transition-all duration-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 transition-all duration-700">Költségkeret</h3>
                    <p className="text-2xl font-bold text-blue-600 transition-all duration-700">{selectedJob.budget} € / {selectedJob.budgetType === 'fix' ? 'fix' : 'óra'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 transition-all duration-700">Jelentkezési határidő</h3>
                    <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">{selectedJob.deadline}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 transition-all duration-700">
                  <h3 className="font-semibold mb-2 transition-all duration-700">Megbízó adatai</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-medium transition-all duration-700">{selectedJob.client.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-400 transition-all duration-700">★</span>
                        <span className="text-sm transition-all duration-700">{selectedJob.client.rating}</span>
                        <span className="text-sm text-gray-500 transition-all duration-700">({selectedJob.client.reviews} értékelés)</span>
                      </div>
                    </div>
                    <Link
                      to="/find-work"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 text-center"
                    >
                      Részletek és jelentkezés
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== PILÓTA MODAL ===== */}
      {showFreelancerModal && selectedFreelancer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-all duration-700">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-all duration-700">{selectedFreelancer.name}</h2>
                <button
                  onClick={() => setShowFreelancerModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-300 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <img src={selectedFreelancer.image} alt={selectedFreelancer.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-gray-200 dark:border-gray-600 transition-all duration-700" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 transition-all duration-700">{selectedFreelancer.title}</h3>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400 transition-all duration-700">★</span>
                        <span className="font-medium transition-all duration-700">{selectedFreelancer.rating}</span>
                        <span className="text-sm text-gray-500 transition-all duration-700">({selectedFreelancer.reviews} értékelés)</span>
                      </div>
                      <span className="text-sm text-gray-500 transition-all duration-700">{selectedFreelancer.jobs} projekt</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 transition-all duration-700">Bemutatkozás</h3>
                  <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">{selectedFreelancer.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 transition-all duration-700">Szakértelem</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedFreelancer.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded transition-all duration-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 transition-all duration-700">Óradíj</h3>
                    <p className="text-2xl font-bold text-blue-600 transition-all duration-700">{selectedFreelancer.hourlyRate} € / óra</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 transition-all duration-700">Elérhetőség</h3>
                    <p className="text-green-600 transition-all duration-700">{selectedFreelancer.availability}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 transition-all duration-700">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500 transition-all duration-700">Helyszín: {selectedFreelancer.location}</p>
                    </div>
                    <Link
                      to="/find-freelancers"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 text-center"
                    >
                      Teljes profil megtekintése
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;