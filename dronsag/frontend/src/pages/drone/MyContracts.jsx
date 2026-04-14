// src/pages/drone/MyContracts.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFileContract, FaMoneyBillWave, FaCalendar, FaCheckCircle, FaClock, FaStar, FaDownload, FaPrint } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const MyContracts = () => {
  const [filter, setFilter] = useState('all');
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/contracts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          const formatted = data.contracts.map(c => ({
            id: c.id,
            projectId: c.project_id,
            projectTitle: c.projectTitle,
            clientName: c.otherPartyName,
            clientId: c.otherPartyId,
            clientImage: c.otherPartyImage,
            clientVerified: c.otherPartyVerified === 1,
            clientRating: c.otherPartyRating || 5.0,
            startDate: new Date(c.created_at).toLocaleDateString('hu-HU'),
            endDate: c.end_date ? new Date(c.end_date).toLocaleDateString('hu-HU') : '-',
            amount: parseInt(c.amount),
            status: c.status,
            paymentStatus: c.payment_status,
            paymentDue: c.payment_date ? new Date(c.payment_date).toLocaleDateString('hu-HU') : '-',
            description: c.description,
            milestones: []
          }));
          setContracts(formatted);
        }
      } catch (error) {
        console.error('Hiba a szerződések lekérésekor:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs rounded-full">Folyamatban</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 text-xs rounded-full">Kezdeti</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs rounded-full">Befejezve</span>;
      default:
        return null;
    }
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    switch(paymentStatus) {
      case 'paid':
        return <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs rounded-full">Kifizetve</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 text-xs rounded-full">Függőben</span>;
      default:
        return null;
    }
  };

  const getMilestoneStatus = (status) => {
    switch(status) {
      case 'completed':
        return <FaCheckCircle className="text-green-600 dark:text-green-400" />;
      case 'active':
        return <FaClock className="text-blue-600 dark:text-blue-400 animate-pulse" />;
      default:
        return <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>;
    }
  };

  const filteredContracts = contracts.filter(contract => {
    if (filter === 'all') return true;
    return contract.status === filter;
  });

  const stats = {
    active: contracts.filter(c => c.status === 'active').length,
    pending: contracts.filter(c => c.status === 'pending').length,
    completed: contracts.filter(c => c.status === 'completed').length,
    totalEarnings: contracts.filter(c => c.paymentStatus === 'paid').reduce((sum, c) => sum + c.amount, 0),
    pendingPayment: contracts.filter(c => c.paymentStatus === 'pending').reduce((sum, c) => sum + c.amount, 0)
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700 flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 flex-1">
        <div className="container mx-auto max-w-7xl">
          
          {/* Fejléc */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
              Szerződéseim
            </h1>
            <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">
              Itt követheted nyomon az aktív és lezárt szerződéseidet.
            </p>
          </div>

          {/* Statisztikák */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{contracts.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Összes szerződés</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Folyamatban</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Kezdeti</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.completed}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Befejezve</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalEarnings} Ft</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Összes bevétel</p>
            </div>
          </div>

          {/* Függő kifizetések */}
          {stats.pendingPayment > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                      <FaMoneyBillWave className="text-yellow-600 dark:text-yellow-400 text-xl" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">Függőben lévő kifizetések</p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">{stats.pendingPayment} Ft összegben</p>
                  </div>
                </div>
                <Link to="/earnings" className="text-yellow-600 dark:text-yellow-400 hover:underline text-sm">
                  Részletek →
                </Link>
              </div>
            </div>
          )}

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
                Összes ({contracts.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === 'active'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Folyamatban ({stats.active})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === 'pending'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Kezdeti ({stats.pending})
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

          {/* Szerződések */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-6">
            {filteredContracts.map((contract) => (
              <div
                key={contract.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  contract.status === 'completed' ? 'border-blue-500 dark:border-blue-500' : 
                  contract.status === 'active' ? 'border-green-500 dark:border-green-500' : 
                  'border-transparent dark:border-gray-700'
                }`}
              >
                {/* Fejléc */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <FaFileContract className="text-blue-600 dark:text-blue-400 text-2xl mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {contract.projectTitle}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="font-medium text-gray-900 dark:text-white">{contract.clientName}</span>
                          <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-400 text-xs" />
                            <span className="text-gray-600 dark:text-gray-400">{contract.clientRating}</span>
                          </div>
                          {getStatusBadge(contract.status)}
                          {getPaymentStatusBadge(contract.paymentStatus)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{contract.amount} Ft</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Szerződéses összeg</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
                          <FaDownload />
                        </button>
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
                          <FaPrint />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Részletek */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Szerződés száma</p>
                      <p className="font-medium text-gray-900 dark:text-white">HHC-{contract.id}-2026</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Időtartam</p>
                      <p className="font-medium text-gray-900 dark:text-white">{contract.startDate} - {contract.endDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fizetési határidő</p>
                      <p className="font-medium text-gray-900 dark:text-white">{contract.paymentDue || contract.paymentDate || '-'}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{contract.description}</p>

                  {/* Mérföldkövek */}
                  {contract.milestones && contract.milestones.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Mérföldkövek</h4>
                      <div className="space-y-3">
                        {contract.milestones.map((milestone, index) => (
                          <div key={milestone.id} className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {getMilestoneStatus(milestone.status)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className={`text-sm ${
                                  milestone.status === 'completed' 
                                    ? 'text-gray-900 dark:text-white' 
                                    : milestone.status === 'active'
                                    ? 'text-blue-600 dark:text-blue-400 font-medium'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                  {milestone.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{milestone.date}</p>
                              </div>
                              {index < contract.milestones.length - 1 && (
                                <div className="ml-2 mt-1 w-0.5 h-4 bg-gray-200 dark:bg-gray-700"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gombok */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
                    <Link
                      to={`/contract/${contract.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm"
                    >
                      Szerződés részletei
                    </Link>
                    {contract.status === 'active' && (
                      <button className="px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 text-sm">
                        Mérföldkő jelentése
                      </button>
                    )}
                    <Link
                      to="/messages"
                      state={{ newChatUser: { id: contract.clientId, name: contract.clientName, image: contract.clientImage, verified: contract.clientVerified, role: 'customer' } }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 text-sm"
                    >
                      Üzenetek megnyitása
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}

          {/* Üres állapot */}
          {filteredContracts.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <FaFileContract className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">Még nincs szerződés ebben a kategóriában.</p>
              <Link
                to="/find-work"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Keress új projekteket →
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyContracts;