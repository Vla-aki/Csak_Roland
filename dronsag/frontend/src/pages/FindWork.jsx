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
  const [filters, setFilters] = useState({
    location: '',
    minBudget: '',
    maxBudget: '',
    budgetType: 'all'
  });
  const navigate = useNavigate();
  const location = useLocation();

  const [viewProject, setViewProject] = useState(null);
  // Ajánlattétel állapotok
  const [biddingProject, setBiddingProject] = useState(null);
  const [bidData, setBidData] = useState({ amount: '', estimated_days: '', message: '' });
  const [bidStatus, setBidStatus] = useState({ loading: false, message: '', type: '' });
  const [alertModal, setAlertModal] = useState({ show: false, message: '' });
  
  const [quickMessageModal, setQuickMessageModal] = useState({ show: false, receiverId: null, receiverName: '', message: '', loading: false });

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

  // Szűrés logika
  const filteredProjects = projects.filter(project => {
    const matchesQuery = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesLoc = !filters.location || project.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesMin = !filters.minBudget || parseInt(project.budget) >= parseInt(filters.minBudget);
    const matchesMax = !filters.maxBudget || parseInt(project.budget) <= parseInt(filters.maxBudget);
    const matchesType = filters.budgetType === 'all' || project.budget_type === filters.budgetType;
    
    return matchesQuery && matchesCat && matchesLoc && matchesMin && matchesMax && matchesType;
  });

  // Dátum formázás
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Kategória fordítás
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
      setAlertModal({ show: true, message: 'Csak pilótaként regisztrált felhasználók jelentkezhetnek munkákra!' });
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

  const handleQuickMessageSubmit = async (e) => {
    e.preventDefault();
    setQuickMessageModal(prev => ({ ...prev, loading: true }));
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ receiverId: quickMessageModal.receiverId, message: quickMessageModal.message })
      });
      const data = await res.json();
      if (data.success) {
        setQuickMessageModal({ show: false, receiverId: null, receiverName: '', message: '', loading: false });
        setAlertModal({ show: true, message: 'Az üzenetedet sikeresen elküldtük a megbízónak!' });
      } else {
        setAlertModal({ show: true, message: data.message || 'Hiba az üzenet küldésekor.' });
        setQuickMessageModal(prev => ({ ...prev, loading: false }));
      }
    } catch (e) {
      setAlertModal({ show: true, message: 'Hálózati hiba történt.' });
      setQuickMessageModal(prev => ({ ...prev, loading: false }));
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
          
          {/* Szűrősáv */}
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
              
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kategória</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white">
                  <option value="all">Összes kategória</option>
                  <option value="photography">Légifotózás</option>
                  <option value="videography">Drónvideózás</option>
                  <option value="inspection">Ipari ellenőrzés</option>
                  <option value="mapping">Térképezés és 3D</option>
                  <option value="delivery">Drónos szállítás</option>
                </select>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Helyszín</label>
                <input type="text" value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})} placeholder="Pl. Budapest" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white" />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Díjazás típusa</label>
                <select value={filters.budgetType} onChange={(e) => setFilters({...filters, budgetType: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white">
                  <option value="all">Mindegy</option>
                  <option value="fix">Fix összeg</option>
                  <option value="hourly">Óradíj</option>
                </select>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Költségkeret (Ft)</label>
                <div className="flex gap-2">
                  <input type="number" value={filters.minBudget} onChange={(e) => setFilters({...filters, minBudget: e.target.value})} placeholder="Min" className="w-1/2 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white" />
                  <input type="number" value={filters.maxBudget} onChange={(e) => setFilters({...filters, maxBudget: e.target.value})} placeholder="Max" className="w-1/2 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>
              </div>

              <button onClick={() => {setSearchQuery(''); setSelectedCategory('all'); setFilters({location: '', minBudget: '', maxBudget: '', budgetType: 'all'});}} className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Szűrők törlése
              </button>
            </div>
          </div>

          {/* Projektek listája */}
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
                        <button onClick={() => setViewProject(project)} className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:underline mb-1 block text-left">
                          {project.title}
                        </button>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300">{getCategoryName(project.category)}</span>
                          <span>•</span>
                          <span>Feladva: {formatDate(project.created_at)}</span>
                          <span>•</span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{project.proposals_count} jelentkező</span>
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

      {/* Projekt megtekintése modal */}
      {viewProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{viewProject.title}</h3>
              <button onClick={() => setViewProject(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <FaTimes size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full">{getCategoryName(viewProject.category)}</span>
                <span className="text-gray-500 dark:text-gray-400"><FaMapMarkerAlt className="inline mr-1"/> {viewProject.location}</span>
                <span className="text-gray-500 dark:text-gray-400"><FaClock className="inline mr-1"/> Feladva: {formatDate(viewProject.created_at)}</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold ml-2">{viewProject.proposals_count} jelentkező</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Leírás</h4>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{viewProject.description}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Elvárt készségek</h4>
                <div className="flex flex-wrap gap-2">
                  {viewProject.skills_required?.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Költségkeret</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">{parseInt(viewProject.budget).toLocaleString('hu-HU')} Ft <span className="text-sm text-gray-500">/{viewProject.budget_type === 'hourly' ? 'óra' : 'fix'}</span></p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Határidő</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{formatDate(viewProject.deadline)}</p>
                </div>
              </div>

              {/* Megbízó profilkártya */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                  <img src={viewProject.customer_image} alt={viewProject.customer_name} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{viewProject.customer_name}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide">Megbízó Profilja</p>
                  </div>
                </div>
                <button onClick={() => { setViewProject(null); setQuickMessageModal({ show: true, receiverId: viewProject.customer_id, receiverName: viewProject.customer_name, message: '', loading: false }); }} className="w-full sm:w-auto px-5 py-2.5 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm">Kérdés feltevése</button>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button onClick={() => setViewProject(null)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 font-medium">Bezárás</button>
                <button 
                  onClick={() => { setViewProject(null); handleOpenBidModal(viewProject); }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md"
                >
                  Ajánlatot teszek
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ajánlattétel modal */}
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

      {/* Gyors üzenet modal */}
      {quickMessageModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Üzenet küldése</h3>
              <button onClick={() => setQuickMessageModal({ ...quickMessageModal, show: false })} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><FaTimes size={20}/></button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Kérdésed van a munkával kapcsolatban, vagy meggyőznéd <strong>{quickMessageModal.receiverName}</strong>-t? Írj neki közvetlenül!
            </p>
            <form onSubmit={handleQuickMessageSubmit}>
              <textarea required rows="4" placeholder="Üdv! A projekt leírásában olvastam, hogy..." value={quickMessageModal.message} onChange={(e) => setQuickMessageModal({...quickMessageModal, message: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none mb-4 outline-none" />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setQuickMessageModal({ ...quickMessageModal, show: false })} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 transition-colors font-medium">Mégse</button>
                <button type="submit" disabled={quickMessageModal.loading || !quickMessageModal.message.trim()} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50">
                  {quickMessageModal.loading ? 'Küldés...' : 'Üzenet elküldése'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Figyelmeztető modal */}
      {alertModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl p-6 text-center">
            <FaInfoCircle className="text-5xl text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Figyelem</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{alertModal.message}</p>
            <button 
              onClick={() => setAlertModal({ show: false, message: '' })}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium w-full"
            >
              Rendben, értem
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindWork;