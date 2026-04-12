// src/pages/customer/MyProjects.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEye, FaEdit, FaTrash, FaFilter, FaSearch, FaTimes, FaSave, FaInfoCircle } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const MyProjects = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [alertModal, setAlertModal] = useState({ show: false, message: '', type: 'error' });

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/projects/my-projects`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setProjects(data.projects);
        }
      } catch (error) {
        console.error("Hiba a projektek lekérésekor:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProjects();
  }, []);

  const openProjectModal = (project, isEdit) => {
    setSelectedProject(project);
    setIsEditingProject(isEdit);
    if (isEdit) {
      setEditFormData({
        title: project.title,
        category: project.category,
        description: project.description,
        location: project.location,
        budget_type: project.budget_type,
        budget: project.budget,
        deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : ''
      });
    }
  };

  const submitProjectEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/projects/${selectedProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      if (data.success) {
        setProjects(projects.map(p => p.id === selectedProject.id ? { ...p, ...data.project } : p));
        setSelectedProject(null);
        setAlertModal({ show: true, message: 'Projekt sikeresen frissítve!', type: 'success' });
      } else {
        setAlertModal({ show: true, message: data.message || 'Hiba a szerkesztés során.', type: 'error' });
      }
    } catch (err) {
      setAlertModal({ show: true, message: 'Hálózati hiba történt a szerkesztés során.', type: 'error' });
    }
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/projects/${deleteModal.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setProjects(projects.filter(p => p.id !== deleteModal.id));
        setDeleteModal({ show: false, id: null });
      } else {
        setAlertModal({ show: true, message: data.message || 'Hiba a törlés során.', type: 'error' });
      }
    } catch (error) {
      setAlertModal({ show: true, message: 'Hálózati hiba történt a törlés során.', type: 'error' });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs rounded-full">Aktív</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 text-xs rounded-full">Függőben</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">Befejezett</span>;
      case 'expired':
        return <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-xs rounded-full">Lejárt</span>;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'photography': return '📷';
      case 'videography': return '🎥';
      case 'inspection': return '🔍';
      case 'mapping': return '🗺️';
      case 'delivery': return '📦';
      default: return '📋';
    }
  };

  const filteredProjects = projects.filter(project => {
    if (filter !== 'all' && project.status !== filter) return false;
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700 flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 flex-1">
        <div className="container mx-auto max-w-7xl">
          
          {/* Fejléc */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-all duration-700">
                Projektjeim
              </h1>
              <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">
                Itt találod az összes projektjeidet.
              </p>
            </div>
            <Link
              to="/create-project"
              className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              <FaPlus className="mr-2" />
              Új projekt
            </Link>
          </div>

          {/* Szűrők */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-all duration-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Keresés a projektek között..."
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
              >
                <FaFilter className="mr-2" />
                Szűrők
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      filter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Összes ({projects.length})
                  </button>
                  <button
                    onClick={() => setFilter('active')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      filter === 'active'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Aktív ({projects.filter(p => p.status === 'active').length})
                  </button>
                  <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      filter === 'pending'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Függőben ({projects.filter(p => p.status === 'pending').length})
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      filter === 'completed'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Befejezett ({projects.filter(p => p.status === 'completed').length})
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Projektek */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-4">Projektek betöltése...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getCategoryIcon(project.category)}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {project.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            {getStatusBadge(project.status)}
                            <span className="text-gray-500 dark:text-gray-400">
                              {parseInt(project.budget).toLocaleString('hu-HU')} Ft / {project.budget_type === 'fix' ? 'fix' : 'óra'}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">{project.location}</span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {project.proposals_count} ajánlat
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              Feladva: {formatDate(project.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 lg:ml-4">
                      <button
                        onClick={() => openProjectModal(project, false)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                        title="Megtekintés"
                      >
                        <FaEye />
                      </button>
                      {project.status !== 'completed' && (
                        <>
                          <button
                            onClick={() => openProjectModal(project, true)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300"
                            title="Szerkesztés"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ show: true, id: project.id })}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300"
                            title="Törlés"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {project.proposals_count > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        to={`/project/${project.id}/bids`}
                        className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {project.proposals_count} ajánlat megtekintése →
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Nincs találat a keresési feltételeknek megfelelően.</p>
              <button
                onClick={() => {
                  setFilter('all');
                  setSearchQuery('');
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Szűrők törlése
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Törlés megerősítő ablak */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Biztosan törlöd a projektet?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Ezzel a művelettel a projekthez tartozó összes ajánlat is véglegesen törlődik az adatbázisból!</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteModal({ show: false, id: null })} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">Mégse</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">Igen, törlöm</button>
            </div>
          </div>
        </div>
      )}

      {/* Megtekintés / Szerkesztés Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{isEditingProject ? 'Projekt szerkesztése' : 'Projekt részletei'}</h2>
              <button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><FaTimes size={20}/></button>
            </div>
            
            <div className="p-6">
              {!isEditingProject ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{selectedProject.title}</h3>
                    {getStatusBadge(selectedProject.status)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{selectedProject.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Költségkeret</p>
                      <p className="font-bold text-gray-900 dark:text-white">{parseInt(selectedProject.budget).toLocaleString('hu-HU')} Ft / {selectedProject.budget_type === 'fix' ? 'fix' : 'óra'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Határidő</p>
                      <p className="font-bold text-gray-900 dark:text-white">{formatDate(selectedProject.deadline)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Helyszín</p>
                      <p className="font-bold text-gray-900 dark:text-white">{selectedProject.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Ajánlatok száma</p>
                      <p className="font-bold text-gray-900 dark:text-white">{selectedProject.proposals_count} db</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button onClick={() => setSelectedProject(null)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 font-medium">Bezárás</button>
                    {selectedProject.status !== 'completed' && (
                      <button onClick={() => openProjectModal(selectedProject, true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"><FaEdit/> Szerkesztés</button>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={submitProjectEdit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Projekt címe</label>
                      <input type="text" name="title" value={editFormData.title || ''} onChange={(e) => setEditFormData({...editFormData, title: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategória</label>
                      <select name="category" value={editFormData.category || 'photography'} onChange={(e) => setEditFormData({...editFormData, category: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white">
                        <option value="photography">Légifotózás</option>
                        <option value="videography">Videózás</option>
                        <option value="inspection">Ellenőrzés</option>
                        <option value="mapping">Térképezés</option>
                        <option value="delivery">Szállítás</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Leírás</label>
                    <textarea name="description" value={editFormData.description || ''} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} rows="4" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white resize-none" required></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Helyszín</label>
                      <input type="text" name="location" value={editFormData.location || ''} onChange={(e) => setEditFormData({...editFormData, location: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Határidő</label>
                      <input type="date" name="deadline" value={editFormData.deadline || ''} onChange={(e) => setEditFormData({...editFormData, deadline: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Díjazás típusa</label>
                      <select name="budget_type" value={editFormData.budget_type || 'fix'} onChange={(e) => setEditFormData({...editFormData, budget_type: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white">
                        <option value="fix">Fix összeg</option><option value="hourly">Óradíj</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Költségkeret (Ft)</label>
                      <input type="number" name="budget" value={editFormData.budget || ''} onChange={(e) => setEditFormData({...editFormData, budget: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white" required />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button type="button" onClick={() => setIsEditingProject(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 font-medium">Mégse</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"><FaSave/> Mentés</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Figyelmeztető/Siker modal */}
      {alertModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl p-6 text-center">
            <FaInfoCircle className={`text-5xl mx-auto mb-4 ${alertModal.type === 'success' ? 'text-green-500' : 'text-red-500'}`} />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {alertModal.type === 'success' ? 'Siker' : 'Hiba'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{alertModal.message}</p>
            <button 
              onClick={() => setAlertModal({ show: false, message: '', type: 'error' })}
              className={`px-6 py-2 text-white rounded-lg transition-colors font-medium w-full ${alertModal.type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              Bezárás
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjects;