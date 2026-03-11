// src/pages/drone/AvailableProjects.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaEuroSign, FaCalendar, FaFilter, FaSearch, FaStar } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const AvailableProjects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minBudget: '',
    maxBudget: '',
    location: '',
    budgetType: 'all'
  });

  const categories = [
    { id: 'all', name: 'Összes', count: 1247, icon: '📋' },
    { id: 'photography', name: 'Légifotó', count: 432, icon: '📷' },
    { id: 'videography', name: 'Videózás', count: 356, icon: '🎥' },
    { id: 'inspection', name: 'Ellenőrzés', count: 289, icon: '🔍' },
    { id: 'mapping', name: 'Térképezés', count: 178, icon: '🗺️' },
    { id: 'delivery', name: 'Szállítás', count: 92, icon: '📦' }
  ];

  const projects = [
    {
      id: 1,
      title: "Drónfotózás ingatlanhoz - 10 ingatlan",
      description: "Budapesti luxusingatlanok fotózásához keresek profi drónost. 10 különböző helyszín, 20-30 kép/ingatlan.",
      budget: 250,
      budgetType: "fix",
      location: "Budapest",
      category: "photography",
      postedDate: "2026.03.01.",
      deadline: "2026.03.15.",
      skills: ["légifotó", "ingatlan", "photoshop"],
      client: {
        name: "Ingatlan.com Zrt.",
        rating: 4.9,
        verified: true
      },
      featured: true,
      bids: 8
    },
    {
      id: 2,
      title: "Ipari csarnok ellenőrzése - szerkezetvizsgálat",
      description: "5000m2-es ipari csarnok tetőszerkezetének ellenőrzése hőkamerás drónnal. Részletes jelentés kell, fotókkal.",
      budget: 65,
      budgetType: "hourly",
      location: "Győr",
      category: "inspection",
      postedDate: "2026.03.02.",
      deadline: "2026.03.20.",
      skills: ["hőkamera", "ipari", "szerkezetvizsgálat"],
      client: {
        name: "Győri Ipari Park",
        rating: 4.7,
        verified: true
      },
      featured: false,
      bids: 3
    },
    {
      id: 3,
      title: "Mezőgazdasági terület térképezés - NDVI elemzés",
      description: "120 hektáros búzatábla NDVI elemzése, 3D modell készítése. Részletes jelentés a növényegészségügyi állapotról.",
      budget: 480,
      budgetType: "fix",
      location: "Bács-Kiskun",
      category: "mapping",
      postedDate: "2026.02.28.",
      deadline: "2026.03.25.",
      skills: ["NDVI", "térképezés", "mezőgazdaság"],
      client: {
        name: "Kiskunsági Mezőgazdasági Zrt.",
        rating: 4.8,
        verified: true
      },
      featured: true,
      bids: 5
    },
    {
      id: 4,
      title: "Esküvői drónvideó - 8 órás rendezvény",
      description: "Esküvői helyszín és ceremónia drónos felvétele. 8 órás rendezvény, 3-5 perces összeállítás kell.",
      budget: 120,
      budgetType: "hourly",
      location: "Visegrád",
      category: "videography",
      postedDate: "2026.03.03.",
      deadline: "2026.04.01.",
      skills: ["esküvő", "videózás", "utómunka"],
      client: {
        name: "Kovácsék",
        rating: 5.0,
        verified: false
      },
      featured: false,
      bids: 12
    },
    {
      id: 5,
      title: "Napelempark ellenőrzés - hőkamerás diagnosztika",
      description: "5MW-s napelempark paneljeinek ellenőrzése hőkamerával. Hibás panelek azonosítása, részletes jelentés.",
      budget: 1800,
      budgetType: "fix",
      location: "Kecskemét",
      category: "inspection",
      postedDate: "2026.02.25.",
      deadline: "2026.03.10.",
      skills: ["napelem", "hőkamera", "diagnosztika"],
      client: {
        name: "Magyar Napelem Kft.",
        rating: 4.6,
        verified: true
      },
      featured: true,
      bids: 6
    },
    {
      id: 6,
      title: "Reklámfilm drónfelvételek - autó reklám",
      description: "Autóreklámhoz kellenek dinamikus drónfelvételek. 2 nap forgatás, Balaton környékén.",
      budget: 95,
      budgetType: "hourly",
      location: "Balatonfüred",
      category: "videography",
      postedDate: "2026.03.01.",
      deadline: "2026.03.18.",
      skills: ["reklám", "autó", "dinamikus"],
      client: {
        name: "Creative Studio Budapest",
        rating: 4.9,
        verified: true
      },
      featured: false,
      bids: 9
    },
    {
      id: 7,
      title: "Tóparti ingatlan drónfotózása",
      description: "Balaton-parti nyaraló fotózása madártávlatból. 20-30 kép, reggeli és esti fények.",
      budget: 180,
      budgetType: "fix",
      location: "Balatonfüred",
      category: "photography",
      postedDate: "2026.03.04.",
      deadline: "2026.03.22.",
      skills: ["légifotó", "ingatlan", "táj"],
      client: {
        name: "Horváth Csaba",
        rating: 4.5,
        verified: false
      },
      featured: false,
      bids: 2
    },
    {
      id: 8,
      title: "Építkezés heti monitorozása",
      description: "Új lakópark építésének heti dokumentálása drónnal. 3 hónapon keresztül, heti 1 alkalom.",
      budget: 3200,
      budgetType: "fix",
      location: "Debrecen",
      category: "videography",
      postedDate: "2026.03.02.",
      deadline: "2026.03.30.",
      skills: ["építkezés", "dokumentáció", "heti rendszeresség"],
      client: {
        name: "Lakópark Kft.",
        rating: 4.8,
        verified: true
      },
      featured: true,
      bids: 4
    }
  ];

  const filteredProjects = projects.filter(project => {
    if (selectedCategory !== 'all' && project.category !== selectedCategory) return false;
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !project.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    if (filters.minBudget && project.budget < parseInt(filters.minBudget)) return false;
    if (filters.maxBudget && project.budget > parseInt(filters.maxBudget)) return false;
    if (filters.location && !project.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.budgetType !== 'all' && project.budgetType !== filters.budgetType) return false;
    
    return true;
  });

  const clearFilters = () => {
    setFilters({
      minBudget: '',
      maxBudget: '',
      location: '',
      budgetType: 'all'
    });
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          
          {/* Fejléc */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
              Elérhető projektek
            </h1>
            <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">
              Tallózz a legfrissebb projektek között, és küldd el ajánlatodat.
            </p>
          </div>

          {/* Kategória szűrő */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name} <span className="text-xs opacity-75">({cat.count})</span>
              </button>
            ))}
          </div>

          {/* Kereső és szűrők */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-all duration-700">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Keresés projektek között..."
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
              >
                <FaFilter className="mr-2" />
                Részletes szűrők
              </button>
            </div>

            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Helyszín
                    </label>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      placeholder="Pl. Budapest"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Minimum ár (€)
                    </label>
                    <input
                      type="number"
                      value={filters.minBudget}
                      onChange={(e) => setFilters({ ...filters, minBudget: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maximum ár (€)
                    </label>
                    <input
                      type="number"
                      value={filters.maxBudget}
                      onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
                      placeholder="1000"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ár típusa
                    </label>
                    <select
                      value={filters.budgetType}
                      onChange={(e) => setFilters({ ...filters, budgetType: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                    >
                      <option value="all">Mindegy</option>
                      <option value="fix">Fix ár</option>
                      <option value="hourly">Óradíj</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Szűrők törlése
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Projektek grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                  onClick={() => window.location.href = `/project/${project.id}`}
                >
                  {project.featured && (
                    <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-br-lg z-10">
                      Kiemelt
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl mr-2">{categories.find(c => c.id === project.category)?.icon}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{project.postedDate}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 mb-2">
                      {project.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <FaEuroSign className="text-gray-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">{project.budget}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">/{project.budgetType === 'fix' ? 'fix' : 'óra'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{project.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                      {project.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                          +{project.skills.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{project.client.name}</span>
                        {project.client.verified && (
                          <span className="text-blue-600 dark:text-blue-400 text-xs">✓</span>
                        )}
                        <div className="flex items-center gap-1 ml-2">
                          <FaStar className="text-yellow-400 text-xs" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">{project.client.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <FaCalendar className="text-gray-400" />
                        <span>{project.deadline}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">{project.bids} ajánlat</span>
                      <Link
                        to={`/project/${project.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Részletek →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Nincs találat a keresési feltételeknek megfelelően.</p>
              <button
                onClick={clearFilters}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Szűrők törlése
              </button>
            </div>
          )}

          {/* Lapozás */}
          {filteredProjects.length > 0 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300">
                  ←
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 text-white">1</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300">
                  2
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300">
                  3
                </button>
                <span className="text-gray-500 dark:text-gray-400">...</span>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300">
                  12
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300">
                  →
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AvailableProjects;