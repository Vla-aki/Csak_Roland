// src/pages/FindFreelancers.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaMoneyBillWave, FaStar, FaFilter, FaCheckCircle, FaAward, FaTimes } from 'react-icons/fa';
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
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [showFreelancerModal, setShowFreelancerModal] = useState(false);
  const [pilotReviews, setPilotReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [profileLightboxImage, setProfileLightboxImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('q')) setSearchQuery(params.get('q'));
    if (params.get('category')) setSelectedCategory(params.get('category'));

    const fetchPilots = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/auth/pilots`);
        const data = await response.json();
        if (data.success) {
          setFreelancers(data.pilots);
        }
      } catch (error) {
        console.error('Hiba a pilóták lekérésekor:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPilots();
  }, [location.search]);

  // Lapozás visszaállítása ha változik a szűrő
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, filters, sortBy]);

  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return freelancers.length;
    const catMap = {
      photography: ['fotó'],
      videography: ['videó'],
      inspection: ['ellenőr'],
      mapping: ['térkép', 'földmér'],
      agriculture: ['mezőgazdaság'],
      fpv: ['fpv']
    };
    const keywords = catMap[categoryId] || [];
    return freelancers.filter(f => f.skills?.some(s => keywords.some(kw => s.toLowerCase().includes(kw)))).length;
  };

  const dynamicCategories = [
    { id: 'all', name: 'Összes', count: freelancers.length, icon: '👥' },
    { id: 'photography', name: 'Drónfotós', count: getCategoryCount('photography'), icon: '📷' },
    { id: 'videography', name: 'Drónvideós', count: getCategoryCount('videography'), icon: '🎥' },
    { id: 'inspection', name: 'Ipari ellenőr', count: getCategoryCount('inspection'), icon: '🔍' },
    { id: 'mapping', name: 'Földmérő', count: getCategoryCount('mapping'), icon: '🗺️' },
    { id: 'agriculture', name: 'Mezőgazdaság', count: getCategoryCount('agriculture'), icon: '🌾' },
    { id: 'fpv', name: 'FPV pilóta', count: getCategoryCount('fpv'), icon: '🚀' }
  ];

  const getAvailabilityBadge = (availability) => {
    switch(availability) {
      case 'full_time':
        return <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs rounded-full">Teljes munkaidő</span>;
      case 'part_time':
        return <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 text-xs rounded-full">Részmunkaidő</span>;
      case 'unavailable':
        return <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-xs rounded-full">Nem elérhető</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">{availability || 'Ismeretlen'}</span>;
    }
  };

  const filteredFreelancers = freelancers.filter(f => {
    if (selectedCategory !== 'all') {
      const catMap = {
        photography: ['fotó'],
        videography: ['videó'],
        inspection: ['ellenőr'],
        mapping: ['térkép', 'földmér'],
        agriculture: ['mezőgazdaság'],
        fpv: ['fpv']
      };
      const keywords = catMap[selectedCategory] || [];
      const hasSkill = f.skills?.some(s => keywords.some(kw => s.toLowerCase().includes(kw)));
      if (!hasSkill) return false;
    }
    if (searchQuery && !(f.name || '').toLowerCase().includes(searchQuery.toLowerCase()) && 
        !(f.title || '').toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(f.description || '').toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.location && !(f.location || '').toLowerCase().includes(filters.location.toLowerCase())) return false;
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

  const totalPages = Math.ceil(sortedFreelancers.length / itemsPerPage);
  const paginatedFreelancers = sortedFreelancers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  const fetchPilotReviews = async (pilotId) => {
    setLoadingReviews(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/pilots/${pilotId}/reviews`);
      const data = await res.json();
      if (data.success) setPilotReviews(data.reviews);
    } catch (e) { console.error(e); }
    setLoadingReviews(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700 flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 flex-1">
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
                      Település
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
                      Minimum óradíj (Ft)
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
                      Maximum óradíj (Ft)
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
                      <option value="full_time">Teljes munkaidőben</option>
                      <option value="part_time">Részmunkaidőben</option>
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
            {dynamicCategories.map((cat) => (
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
          {loading ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-4">Pilóták betöltése az adatbázisból...</p>
            </div>
          ) : sortedFreelancers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedFreelancers.map((f) => (
                <div
                  key={f.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full"
                  onClick={() => {
                    setSelectedFreelancer(f);
                    fetchPilotReviews(f.id);
                    setShowFreelancerModal(true);
                  }}
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
                        <FaMoneyBillWave className="text-gray-400" />
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
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 disabled:opacity-50"
                >
                  ←
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 ${currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    {page}
                  </button>
                ))}

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 disabled:opacity-50"
                >
                  →
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* ===== PILÓTA MODAL ===== */}
      {showFreelancerModal && selectedFreelancer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-700" onClick={() => setShowFreelancerModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{selectedFreelancer.name}</h2>
                <button
                  onClick={() => setShowFreelancerModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <img src={selectedFreelancer.image} alt={selectedFreelancer.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-blue-50 dark:border-blue-900/30 object-cover shadow-md" />
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">{selectedFreelancer.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-lg">★</span>
                        <span className="font-bold text-gray-900 dark:text-white">{selectedFreelancer.rating}</span>
                        <span className="text-sm text-gray-500">({selectedFreelancer.reviews} értékelés)</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">{selectedFreelancer.completedProjects} sikeres projekt</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                      <FaMapMarkerAlt /> {selectedFreelancer.location || 'Ismeretlen'}
                      <span className="mx-2">•</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {selectedFreelancer.availability === 'full_time' ? 'Teljes munkaidő' : 
                     selectedFreelancer.availability === 'part_time' ? 'Részmunkaidő' : 
                     selectedFreelancer.availability === 'unavailable' ? 'Nem elérhető' : 
                     selectedFreelancer.availability || 'Ismeretlen'}
                  </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Bemutatkozás</h3>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{selectedFreelancer.description || 'A pilóta még nem adott meg bemutatkozást.'}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Szakterületek</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedFreelancer.skills && selectedFreelancer.skills.length > 0 ? selectedFreelancer.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full border border-blue-200 dark:border-blue-800/50">
                        {skill}
                      </span>
                    )) : <span className="text-gray-500 italic">Nincs megadva szakterület.</span>}
                  </div>
                </div>

            {selectedFreelancer.portfolio && selectedFreelancer.portfolio.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Portfólió</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {selectedFreelancer.portfolio.map((img, i) => (
                    <img key={i} src={img} alt={`Portfolio ${i}`} className="w-full h-32 object-cover rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-zoom-in" onClick={(e) => { e.stopPropagation(); setProfileLightboxImage(img); }} />
                  ))}
                </div>
              </div>
            )}

                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Értékelések ({selectedFreelancer.reviews})</h3>
                  {loadingReviews ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  ) : pilotReviews.length > 0 ? (
                    <div className="space-y-4">
                      {pilotReviews.map(review => (
                        <div key={review.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                          <div className="flex items-center gap-3 mb-2">
                            <img src={review.reviewerImage} className="w-8 h-8 rounded-full" alt="" />
                            <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">{review.reviewerName}</p>
                              <div className="flex items-center gap-2"><div className="flex">{renderStars(review.rating)}</div> <span className="text-xs text-gray-500">{review.date}</span></div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{review.comment}"</p>
                      <p className="text-sm text-gray-500 transition-all duration-700 mt-1">Csatlakozott: {selectedFreelancer.memberSince}</p>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-gray-500 italic">Még nem kapott szöveges értékelést.</p>}
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Irányadó óradíj</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{selectedFreelancer.hourlyRate || 0} <span className="text-lg text-gray-500">Ft / óra</span></p>
                  </div>
                  <Link
                    to="/messages"
                    state={{ newChatUser: { id: selectedFreelancer.id, name: selectedFreelancer.name, image: selectedFreelancer.image, verified: selectedFreelancer.verified, role: 'driver' } }}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md text-center"
                  >
                    Kapcsolatfelvétel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profil Portfólió Kép Nagyító */}
      {profileLightboxImage && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md transition-all"
          style={{ zIndex: 10001 }}
          onClick={(e) => { e.stopPropagation(); setProfileLightboxImage(null); }}
        >
          <div className="relative bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -top-4 -right-4 flex gap-2" style={{ zIndex: 10002 }}>
              <button 
                className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-xl border-2 border-white dark:border-gray-800 transition-colors"
                onClick={(e) => { e.stopPropagation(); setProfileLightboxImage(null); }}
                title="Bezárás"
              >
                <FaTimes size={16} />
              </button>
            </div>
            <img src={profileLightboxImage} alt="Nagyított portfólió kép" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default FindFreelancers;