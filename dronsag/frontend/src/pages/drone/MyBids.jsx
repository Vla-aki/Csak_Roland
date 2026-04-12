// src/pages/drone/MyBids.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMoneyBillWave, FaCalendar, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaTimes, FaMapMarkerAlt, FaTags, FaInfoCircle } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const MyBids = () => {
  const [filter, setFilter] = useState('all');
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [viewProject, setViewProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(false);
  const [alertModal, setAlertModal] = useState({ show: false, message: '' });

  useEffect(() => {
    const fetchMyBids = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/bids/my-bids`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          const formatted = data.bids.map(b => ({
            id: b.id,
            projectId: b.projectId,
            projectTitle: b.projectTitle,
            projectLocation: b.projectLocation,
            bidAmount: parseInt(b.bidAmount),
            bidType: b.bidType,
            submittedDate: new Date(b.submittedDate).toLocaleDateString('hu-HU'),
            status: b.status,
            deadline: new Date(b.deadline).toLocaleDateString('hu-HU'),
            clientName: b.clientName,
            clientRating: b.clientRating || 5.0,
            message: b.message,
            estimatedDuration: `${b.estimatedDuration || 1} nap`
          }));
          setBids(formatted);
        }
      } catch (error) {
        console.error('Hiba az ajánlatok lekérésekor:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBids();
  }, []);

  const handleViewProject = async (projectId) => {
    setLoadingProject(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setViewProject(data.project);
      }
    } catch (err) { }
    setLoadingProject(false);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/bids/${deleteModal.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setBids(bids.filter(b => b.id !== deleteModal.id));
        setDeleteModal({ show: false, id: null });
      } else {
        setDeleteModal({ show: false, id: null });
        setAlertModal({ show: true, message: data.message || 'Hiba történt a törlés során.' });
      }
    } catch (error) {
      setDeleteModal({ show: false, id: null });
      setAlertModal({ show: true, message: 'Hálózati hiba történt.' });
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 text-xs rounded-full">
            <FaHourglassHalf className="mr-1 text-xs" />
            Elbírálás alatt
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs rounded-full">
            <FaCheckCircle className="mr-1 text-xs" />
            Elfogadva
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-xs rounded-full">
            <FaTimesCircle className="mr-1 text-xs" />
            Elutasítva
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs rounded-full">
            <FaCheckCircle className="mr-1 text-xs" />
            Befejezve
          </span>
        );
      default:
        return null;
    }
  };

  const filteredBids = bids.filter(bid => {
    if (filter === 'all') return true;
    return bid.status === filter;
  });

  const stats = {
    pending: bids.filter(b => b.status === 'pending').length,
    accepted: bids.filter(b => b.status === 'accepted').length,
    rejected: bids.filter(b => b.status === 'rejected').length,
    completed: bids.filter(b => b.status === 'completed').length,
    totalEarnings: bids.filter(b => b.status === 'completed' || b.status === 'accepted')
                       .reduce((sum, b) => sum + (b.paymentAmount || b.bidAmount), 0)
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700 flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 flex-1">
        <div className="container mx-auto max-w-7xl">
          
          {/* Fejléc */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
              Ajánlataim
            </h1>
            <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">
              Itt követheted nyomon az összes ajánlatodat.
            </p>
          </div>

          {/* Statisztikák */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{bids.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Összes ajánlat</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Függőben</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.accepted}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Elfogadva</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-center">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Elutasítva</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.completed}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Befejezve</p>
            </div>
          </div>

          {/* Szűrők */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-all duration-700">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Összes ({bids.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === 'pending'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Függőben ({stats.pending})
              </button>
              <button
                onClick={() => setFilter('accepted')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === 'accepted'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Elfogadva ({stats.accepted})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === 'rejected'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Elutasítva ({stats.rejected})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === 'completed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Befejezve ({stats.completed})
              </button>
            </div>
          </div>

          {/* Ajánlatok */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-4">
            {filteredBids.map((bid) => (
              <div
                key={bid.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {bid.projectTitle}
                      </h3>
                      {getStatusBadge(bid.status)}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {bid.message}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <FaMoneyBillWave className="text-gray-400" />
                        <span className="text-gray-900 dark:text-white font-medium">{bid.bidAmount} Ft</span>
                        <span className="text-gray-500 dark:text-gray-400">/{bid.bidType === 'fix' ? 'fix' : 'óra'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaCalendar className="text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Benyújtva: {bid.submittedDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaClock className="text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{bid.estimatedDuration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Határidő: {bid.deadline}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
                      <span className="font-medium text-gray-900 dark:text-white">{bid.clientName}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-gray-600 dark:text-gray-400">{bid.clientRating}</span>
                      </div>
                      {bid.status === 'accepted' && (
                        <span className="text-green-600 dark:text-green-400 text-xs">
                          Elfogadva: {bid.acceptedDate}
                        </span>
                      )}
                      {bid.status === 'rejected' && (
                        <span className="text-red-600 dark:text-red-400 text-xs">
                          {bid.rejectionReason}
                        </span>
                      )}
                      {bid.status === 'completed' && (
                        <span className="text-blue-600 dark:text-blue-400 text-xs">
                          Kifizetve: {bid.paymentAmount} Ft
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2 lg:ml-4">
                    <button
                      onClick={() => handleViewProject(bid.projectId)}
                      disabled={loadingProject}
                      className="px-4 py-2 text-center text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
                    >
                      Projekt megtekintése
                    </button>
                    {bid.status === 'pending' && (
                      <button 
                        onClick={() => setDeleteModal({ show: true, id: bid.id })}
                        className="px-4 py-2 text-center text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <FaTimesCircle /> Törlés
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}

          {/* Bevételek */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div>
                <p className="text-lg opacity-90 mb-1">Összes bevétel (elfogadott + befejezett)</p>
                <p className="text-4xl font-bold">{stats.totalEarnings} Ft</p>
              </div>
              <Link
                to="/earnings"
                className="mt-4 sm:mt-0 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300"
              >
                Részletes kimutatás →
              </Link>
            </div>
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
                <span className="text-gray-500 dark:text-gray-400"><FaMapMarkerAlt className="inline mr-1"/> {viewProject.location}</span>
                <span className="text-gray-500 dark:text-gray-400"><FaClock className="inline mr-1"/> Határidő: {new Date(viewProject.deadline).toLocaleDateString('hu-HU')}</span>
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
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">A megbízó költségkerete</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{parseInt(viewProject.budget).toLocaleString('hu-HU')} Ft <span className="text-sm">/{viewProject.budget_type === 'hourly' ? 'óra' : 'fix'}</span></p>
              </div>
              <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                <button onClick={() => setViewProject(null)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Bezárás</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Törlés megerősítő ablak */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Biztosan visszavonod az ajánlatot?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Ezzel az ajánlatod/jelentkezésed törlődik a megbízó listájából.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteModal({ show: false, id: null })} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">Mégse</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">Igen, visszavonom</button>
            </div>
          </div>
        </div>
      )}

      {/* Figyelmeztető modal */}
      {alertModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl p-6 text-center">
            <FaInfoCircle className="text-5xl text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Hiba</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{alertModal.message}</p>
            <button 
              onClick={() => setAlertModal({ show: false, message: '' })}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium w-full"
            >
              Bezárás
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBids;