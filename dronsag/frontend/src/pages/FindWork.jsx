// src/pages/FindWork.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaTags, FaBriefcase, FaFilter, FaTimes, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../contexts/AuthContext';

const FindWork = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const location = useLocation();

  // Ajánlattételhez (Bidding) szükséges állapotok
  const [biddingProject, setBiddingProject] = useState(null);
  const [bidData, setBidData] = useState({ amount: '', estimated_days: '', message: '' });
  const [bidStatus, setBidStatus] = useState({ loading: false, message: '', type: '' });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('q')) setSearchQuery(params.get('q'));
    if (params.get('category')) setSelectedCategory(params.get('category'));

    const fetchProjects = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/projects`);
        const data = await response.json();
        
        if (data.success) {
          setProjects(data.projects);
        }
      } catch (error) {
        console.error('Hiba a projektek lekérésekor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [location.search]);

  // Keresés szűrése a frontend oldalon
  const filteredProjects = projects.filter(project => {
    const matchesQuery = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  // Dátum formázó
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Kategória fordító
  const getCategoryName = (cat) => {
    const cats = {
      'photography': 'Légifotózás',
      'videography': 'Drónvideózás',
      'inspection': 'Ipari ellenőrzés',
      'mapping': 'Térképezés és 3D',
      'delivery': 'Drónos szállítás'
    };
    return cats[cat] || cat;
  };

  const handleOpenBidModal = (project) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'driver') {
      alert('Csak pilótaként regisztrált felhasználók jelentkezhetnek munkákra!');
      return;
    }
    setBiddingProject(project);
    setBidData({ amount: project.budget || '', estimated_days: '', message: '' });
    setBidStatus({ loading: false, message: '', type: '' });
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidStatus({ loading: true, message: '', type: '' });

    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/projects/${biddingProject.id}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(bidData)
      });
      const result = await response.json();

      if (response.ok) {
        setBidStatus({ loading: false, message: 'Ajánlat sikeresen elküldve a megbízónak!', type: 'success' });
        setTimeout(() => setBiddingProject(null), 2000); // 2 mp után bezárja az ablakot
      } else {
        setBidStatus({ loading: false, message: result.message || 'Hiba történt.', type: 'error' });
      }
    } catch (error) {
      setBidStatus({ loading: false, message: 'Hálózati hiba történt.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-700 flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 pt-24 pb-16 max-w-6xl">
        {/* Fejléc */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-700">Elérhető munkák</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-700">
            Böngéssz a megbízók által feladott legfrissebb drónos projektek között és küldd el az ajánlatodat!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Bal oldali szűrősáv */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sticky top-24 transition-colors duration-700">
              <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
                <FaFilter className="text-blue-600 dark:text-blue-400" />
                <h2 className="font-bold text-gray-900 dark:text-white">Keresés és Szűrők</h2>
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kulcsszó</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pl. esküvő, Budapest..." 
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 italic">
                További részletes szűrők (kategória, ár) hamarosan...
              </p>
            </div>
          </div>

          {/* Jobb oldali lista: Projektek */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-4">Munkák betöltése...</p>
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  {filteredProjects.length} db projekt található
                </div>
                
                {filteredProjects.map(project => (
                  <div key={project.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      
                      {/* Projekt infók */}
                      <div className="flex-1">
                        <Link to={`/project/${project.id}`} className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:underline mb-1 block">
                          {project.title}
                        </Link>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300">{getCategoryName(project.category)}</span>
                          <span>•</span>
                          <span>Feladva: {formatDate(project.created_at)}</span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                          {project.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.skills_required && project.skills_required.map((skill, idx) => (
                            <span key={idx} className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md">
                              <FaTags className="text-[10px]" /> {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Ár és adatok */}
                      <div className="sm:w-48 flex flex-col sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-gray-700 pt-4 sm:pt-0 sm:pl-4 mt-4 sm:mt-0">
                        <div className="space-y-2 w-full">
                          <div className="flex items-center sm:justify-end gap-2 text-gray-700 dark:text-gray-300 font-bold text-lg">
                            <FaMoneyBillWave className="text-green-500" />
                            {parseInt(project.budget).toLocaleString('hu-HU')} Ft {project.budget_type === 'hourly' ? '/ óra' : ''}
                          </div>
                          <div className="flex items-center sm:justify-end gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <FaMapMarkerAlt /> {project.location}
                          </div>
                          <div className="flex items-center sm:justify-end gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <FaClock /> Határidő: {formatDate(project.deadline)}
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleOpenBidModal(project)}
                          className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm active:scale-95"
                        >
                          Érdekel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
                <FaBriefcase className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Nincs találat</h3>
                <p className="text-gray-500 dark:text-gray-400">Jelenleg nincs a keresésnek megfelelő elérhető munka.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />

      {/* AJÁNLATTÉTEL (BIDDING) MODAL */}
      {biddingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ajánlattétel</h3>
              <button onClick={() => setBiddingProject(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">{biddingProject.title}</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Költségkeret: <strong>{parseInt(biddingProject.budget).toLocaleString('hu-HU')} Ft</strong> ({biddingProject.budget_type === 'hourly' ? 'óradíj' : 'fix összeg'})
                </p>
              </div>

              {bidStatus.message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${bidStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {bidStatus.type === 'success' ? <FaCheckCircle /> : <FaInfoCircle />}
                  <p className="text-sm font-medium">{bidStatus.message}</p>
                </div>
              )}

              <form onSubmit={handleBidSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ajánlott összeg (Ft)</label>
                    <input 
                      type="number" required min="1"
                      value={bidData.amount} onChange={(e) => setBidData({...bidData, amount: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Becsült idő (Nap)</label>
                    <input 
                      type="number" required min="1"
                      value={bidData.estimated_days} onChange={(e) => setBidData({...bidData, estimated_days: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Üzenet a megbízónak</label>
                  <textarea 
                    required rows="4" placeholder="Győzd meg a megbízót, miért téged válasszon..."
                    value={bidData.message} onChange={(e) => setBidData({...bidData, message: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none" 
                  />
                </div>
                
                <button 
                  type="submit" disabled={bidStatus.loading || bidStatus.type === 'success'}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                  {bidStatus.loading ? 'Küldés...' : 'Ajánlat elküldése'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindWork;