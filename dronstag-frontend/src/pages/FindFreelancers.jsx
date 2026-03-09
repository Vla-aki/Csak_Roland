// src/pages/FindFreelancers.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaEuroSign, FaStar, FaFilter, FaCheckCircle, FaAward } from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const FindFreelancers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [filters, setFilters] = useState({
    location: '',
    minRate: '',
    maxRate: '',
    availability: 'all',
    verified: false
  });

  const categories = [
    { id: 'all', name: 'Összes', count: 528, icon: '👥' },
    { id: 'photography', name: 'Fotós', count: 156, icon: '📷' },
    { id: 'videography', name: 'Videós', count: 143, icon: '🎥' },
    { id: 'inspection', name: 'Ellenőrzés', count: 98, icon: '🔍' },
    { id: 'mapping', name: 'Térképezés', count: 76, icon: '🗺️' },
    { id: 'delivery', name: 'Szállítás', count: 55, icon: '📦' }
  ];

  const freelancers = [
    {
      id: 1,
      name: "Kovács Péter",
      title: "Profi drónpilóta - 8 év tapasztalat",
      description: "DJI Inspire 2, Mavic 3, hőkamera. Ingatlanfotózás, ipari ellenőrzés, rendezvények specialista.",
      hourlyRate: 45,
      location: "Budapest",
      category: "photography",
      rating: 4.9,
      reviews: 234,
      jobs: 187,
      verified: true,
      skills: ["ingatlan", "ipari", "hőkamera", "DJI"],
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      featured: true,
      availability: "azonnal",
      completedProjects: 187,
      memberSince: "2020"
    },
    {
      id: 2,
      name: "Nagy Eszter",
      title: "Kreatív drónvideós - rendezvények, esküvők",
      description: "Kreatív megközelítés, professzionális utómunka. 5+ év tapasztalat, 300+ esemény.",
      hourlyRate: 55,
      location: "Győr",
      category: "videography",
      rating: 5.0,
      reviews: 178,
      jobs: 256,
      verified: true,
      skills: ["esküvő", "rendezvény", "kreatív", "utómunka"],
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      featured: true,
      availability: "1 hét",
      completedProjects: 256,
      memberSince: "2019"
    },
    {
      id: 3,
      name: "Szabó István",
      title: "Ipari drónspecialista - hőkamera, szerkezetvizsgálat",
      description: "Mérnöki végzettség, ipari létesítmények ellenőrzése, részletes műszaki jelentések.",
      hourlyRate: 65,
      location: "Miskolc",
      category: "inspection",
      rating: 4.8,
      reviews: 156,
      jobs: 234,
      verified: true,
      skills: ["ipari", "hőkamera", "mérnöki", "jelentés"],
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      featured: false,
      availability: "3 nap",
      completedProjects: 234,
      memberSince: "2018"
    },
    {
      id: 4,
      name: "Tóth Gábor",
      title: "Térképezési szakértő - NDVI, 3D modellek",
      description: "Agrármérnöki végzettség, precíziós mezőgazdaság, NDVI elemzések, topográfiai térképek.",
      hourlyRate: 50,
      location: "Szeged",
      category: "mapping",
      rating: 4.9,
      reviews: 98,
      jobs: 145,
      verified: true,
      skills: ["NDVI", "3D", "agrár", "térkép"],
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      featured: false,
      availability: "azonnal",
      completedProjects: 145,
      memberSince: "2021"
    },
    {
      id: 5,
      name: "Varga Balázs",
      title: "Drónos szállítás - logisztika, sürgősségi",
      description: "Speciális szállítási engedélyek, 30kg-ig, gyógyszer- és dokumentumszállítás.",
      hourlyRate: 40,
      location: "Budapest",
      category: "delivery",
      rating: 4.7,
      reviews: 67,
      jobs: 189,
      verified: true,
      skills: ["szállítás", "logisztika", "gyors"],
      image: "https://randomuser.me/api/portraits/men/62.jpg",
      featured: false,
      availability: "2 nap",
      completedProjects: 189,
      memberSince: "2022"
    },
    {
      id: 6,
      name: "Kiss Anna",
      title: "Luxus ingatlanfotós - drón + földi fotózás",
      description: "Luxusingatlanokra specializálódva, komplett fotócsomag drónnal + földi géppel.",
      hourlyRate: 60,
      location: "Budapest",
      category: "photography",
      rating: 5.0,
      reviews: 145,
      jobs: 312,
      verified: true,
      skills: ["luxus", "ingatlan", "fotózás", "utómunka"],
      image: "https://randomuser.me/api/portraits/women/63.jpg",
      featured: true,
      availability: "1 hét",
      completedProjects: 312,
      memberSince: "2017"
    },
    {
      id: 7,
      name: "Molnár Dávid",
      title: "Drónos rendezvényfotós",
      description: "Koncertek, fesztiválok, sportesemények drónos rögzítése. Gyors, dinamikus felvételek.",
      hourlyRate: 48,
      location: "Debrecen",
      category: "videography",
      rating: 4.8,
      reviews: 89,
      jobs: 156,
      verified: false,
      skills: ["rendezvény", "koncert", "sport", "gyors"],
      image: "https://randomuser.me/api/portraits/men/72.jpg",
      featured: false,
      availability: "azonnal",
      completedProjects: 156,
      memberSince: "2023"
    },
    {
      id: 8,
      name: "Farkas Katalin",
      title: "Hőkamerás diagnosztika specialista",
      description: "Épületdiagnosztika, napelempark ellenőrzés, ipari létesítmények hőkamerás vizsgálata.",
      hourlyRate: 58,
      location: "Pécs",
      category: "inspection",
      rating: 4.9,
      reviews: 112,
      jobs: 178,
      verified: true,
      skills: ["hőkamera", "diagnosztika", "épület", "ipari"],
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      featured: true,
      availability: "3 nap",
      completedProjects: 178,
      memberSince: "2019"
    },
    {
      id: 9,
      name: "Balogh Tamás",
      title: "Mezőgazdasági drónspecialista",
      description: "Precíziós mezőgazdaság, NDVI elemzések, termésbecslés, permetezés.",
      hourlyRate: 52,
      location: "Székesfehérvár",
      category: "mapping",
      rating: 4.7,
      reviews: 76,
      jobs: 134,
      verified: true,
      skills: ["mezőgazdaság", "NDVI", "permetezés", "termésbecslés"],
      image: "https://randomuser.me/api/portraits/men/55.jpg",
      featured: false,
      availability: "1 hét",
      completedProjects: 134,
      memberSince: "2020"
    }
  ];

  const getAvailabilityBadge = (availability) => {
    switch(availability) {
      case 'azonnal':
        return <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs rounded-full">Azonnal</span>;
      case '1 hét':
        return <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 text-xs rounded-full">1 héten belül</span>;
      case '2 nap':
        return <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs rounded-full">2 napon belül</span>;
      case '3 nap':
        return <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs rounded-full">3 napon belül</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">{availability}</span>;
    }
  };

  const filteredFreelancers = freelancers.filter(f => {
    if (selectedCategory !== 'all' && f.category !== selectedCategory) return false;
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !f.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !f.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.location && !f.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.minRate && f.hourlyRate < parseInt(filters.minRate)) return false;
    if (filters.maxRate && f.hourlyRate > parseInt(filters.maxRate)) return false;
    if (filters.availability !== 'all' && f.availability !== filters.availability) return false;
    if (filters.verified && !f.verified) return false;
    return true;
  });

  const sortedFreelancers = [...filteredFreelancers].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'rating-low') return a.rating - b.rating;
    if (sortBy === 'price-high') return b.hourlyRate - a.hourlyRate;
    if (sortBy === 'price-low') return a.hourlyRate - b.hourlyRate;
    if (sortBy === 'jobs') return b.jobs - a.jobs;
    return 0;
  });

  const clearFilters = () => {
    setFilters({
      location: '',
      minRate: '',
      maxRate: '',
      availability: 'all',
      verified: false
    });
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FaStar key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
    ));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          
          {/* Fejléc */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
              Pilóták keresése
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 transition-all duration-700">
              Tallózz a legjobb drónpilóták között, és találd meg a projektedhez legmegfelelőbb szakembert.
            </p>
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
                  placeholder="Keresés pilóták között..."
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white transition-all duration-700"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white transition-all duration-700"
                >
                  <option value="rating">Értékelés szerint csökkenő</option>
                  <option value="rating-low">Értékelés szerint növekvő</option>
                  <option value="price-high">Óradíj szerint csökkenő</option>
                  <option value="price-low">Óradíj szerint növekvő</option>
                  <option value="jobs">Projektek száma szerint</option>
                </select>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 flex items-center gap-2"
                >
                  <FaFilter />
                  Szűrők
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                      Minimum óradíj (€)
                    </label>
                    <input
                      type="number"
                      value={filters.minRate}
                      onChange={(e) => setFilters({ ...filters, minRate: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maximum óradíj (€)
                    </label>
                    <input
                      type="number"
                      value={filters.maxRate}
                      onChange={(e) => setFilters({ ...filters, maxRate: e.target.value })}
                      placeholder="100"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Elérhetőség
                    </label>
                    <select
                      value={filters.availability}
                      onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                    >
                      <option value="all">Mindegy</option>
                      <option value="azonnal">Azonnal</option>
                      <option value="2 nap">2 napon belül</option>
                      <option value="3 nap">3 napon belül</option>
                      <option value="1 hét">1 héten belül</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.verified}
                        onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Csak ellenőrzött pilóták</span>
                    </label>
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

          {/* Kategória szűrők */}
          <div className="flex flex-wrap gap-2 mb-8">
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

          {/* Találatok száma */}
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {sortedFreelancers.length} pilóta találat
          </div>

          {/* Pilóták grid */}
          {sortedFreelancers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedFreelancers.map((f) => (
                <div
                  key={f.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => window.location.href = `/freelancer/${f.id}`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img src={f.image} alt={f.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gray-200 dark:border-gray-600 object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
                            {f.name}
                          </h3>
                          {f.verified && (
                            <FaCheckCircle className="text-blue-600 dark:text-blue-400" title="Ellenőrzött pilóta" />
                          )}
                          {f.featured && (
                            <FaAward className="text-yellow-500" title="Kiemelt pilóta" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{f.title}</p>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex">{renderStars(f.rating)}</div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">({f.reviews})</span>
                        </div>
                        {getAvailabilityBadge(f.availability)}
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {f.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {f.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                      {f.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                          +{f.skills.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{f.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaEuroSign className="text-gray-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">{f.hourlyRate}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">/óra</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">{f.completedProjects} projekt</span>
                      <span className="text-gray-500 dark:text-gray-400">Tag: {f.memberSince}</span>
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
          {sortedFreelancers.length > 0 && (
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
                  8
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

export default FindFreelancers;