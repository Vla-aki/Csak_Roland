// src/pages/drone/MyContracts.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFileContract, FaEuroSign, FaCalendar, FaCheckCircle, FaClock, FaStar, FaDownload, FaPrint } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const MyContracts = () => {
  const [filter, setFilter] = useState('all');

  const contracts = [
    {
      id: 1001,
      projectId: 101,
      projectTitle: "Napelempark ellenőrzés - hőkamerás diagnosztika",
      clientName: "Magyar Napelem Kft.",
      clientRating: 4.6,
      startDate: "2026.03.01.",
      endDate: "2026.03.05.",
      amount: 1800,
      status: "active",
      paymentStatus: "pending",
      paymentDue: "2026.03.12.",
      description: "5MW-s napelempark paneljeinek ellenőrzése hőkamerával. Részletes diagnosztikai jelentés készítése.",
      milestones: [
        { id: 1, name: "Helyszíni felmérés", status: "completed", date: "2026.03.01." },
        { id: 2, name: "Hőkamerás felvételek", status: "completed", date: "2026.03.02." },
        { id: 3, name: "Diagnosztikai jelentés", status: "completed", date: "2026.03.04." },
        { id: 4, name: "Végső átadás", status: "active", date: "2026.03.05." }
      ]
    },
    {
      id: 1002,
      projectId: 102,
      projectTitle: "Drónfotózás ingatlanhoz - 10 ingatlan",
      clientName: "Ingatlan.com Zrt.",
      clientRating: 4.9,
      startDate: "2026.03.10.",
      endDate: "2026.03.15.",
      amount: 250,
      status: "pending",
      paymentStatus: "pending",
      paymentDue: "2026.03.22.",
      description: "10 budapesti luxusingatlan fotózása, 20-30 kép/ingatlan, utómunka.",
      milestones: [
        { id: 1, name: "Első 5 ingatlan fotózása", status: "pending", date: "2026.03.10." },
        { id: 2, name: "Második 5 ingatlan fotózása", status: "pending", date: "2026.03.12." },
        { id: 3, name: "Utómunka", status: "pending", date: "2026.03.14." },
        { id: 4, name: "Képek átadása", status: "pending", date: "2026.03.15." }
      ]
    },
    {
      id: 1003,
      projectId: 103,
      projectTitle: "Ipari csarnok ellenőrzése",
      clientName: "Győri Ipari Park",
      clientRating: 4.7,
      startDate: "2026.02.20.",
      endDate: "2026.02.25.",
      amount: 520,
      status: "completed",
      paymentStatus: "paid",
      paymentDate: "2026.02.28.",
      description: "5000m2-es ipari csarnok tetőszerkezetének ellenőrzése, szerkezetvizsgálat.",
      milestones: [
        { id: 1, name: "Előkészületek", status: "completed", date: "2026.02.20." },
        { id: 2, name: "Helyszíni ellenőrzés", status: "completed", date: "2026.02.21." },
        { id: 3, name: "Szerkezetvizsgálat", status: "completed", date: "2026.02.22." },
        { id: 4, name: "Jelentés készítése", status: "completed", date: "2026.02.24." },
        { id: 5, name: "Végső átadás", status: "completed", date: "2026.02.25." }
      ]
    },
    {
      id: 1004,
      projectId: 104,
      projectTitle: "Mezőgazdasági terület térképezés",
      clientName: "Kiskunsági Mezőgazdasági Zrt.",
      clientRating: 4.8,
      startDate: "2026.03.15.",
      endDate: "2026.03.20.",
      amount: 480,
      status: "pending",
      paymentStatus: "pending",
      paymentDue: "2026.03.27.",
      description: "120 hektáros búzatábla NDVI elemzése, 3D modell készítése.",
      milestones: [
        { id: 1, name: "Terepbejárás", status: "pending", date: "2026.03.15." },
        { id: 2, name: "Drónos felvételezés", status: "pending", date: "2026.03.16." },
        { id: 3, name: "Adatfeldolgozás", status: "pending", date: "2026.03.18." },
        { id: 4, name: "Jelentés és 3D modell", status: "pending", date: "2026.03.20." }
      ]
    },
    {
      id: 1005,
      projectId: 105,
      projectTitle: "Esküvői drónvideó",
      clientName: "Kovácsék",
      clientRating: 5.0,
      startDate: "2026.02.14.",
      endDate: "2026.02.16.",
      amount: 450,
      status: "completed",
      paymentStatus: "paid",
      paymentDate: "2026.02.20.",
      description: "Esküvői helyszín és ceremónia drónos felvétele, 3 perces összeállítás.",
      milestones: [
        { id: 1, name: "Előkészület", status: "completed", date: "2026.02.14." },
        { id: 2, name: "Felvételek", status: "completed", date: "2026.02.15." },
        { id: 3, name: "Utómunka", status: "completed", date: "2026.02.16." }
      ]
    }
  ];

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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
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

          {/* Statisztika kártyák */}
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
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalEarnings} €</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Összes bevétel</p>
            </div>
          </div>

          {/* Függőben lévő kifizetések */}
          {stats.pendingPayment > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaEuroSign className="text-yellow-600 dark:text-yellow-400 text-xl" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">Függőben lévő kifizetések</p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">{stats.pendingPayment} € összegben</p>
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

          {/* Szerződések lista */}
          <div className="space-y-6">
            {filteredContracts.map((contract) => (
              <div
                key={contract.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Szerződés fejléc */}
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
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{contract.amount} €</p>
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

                {/* Szerződés részletek */}
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

                  {/* Akciógombok */}
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
                      to={`/messages/${contract.clientName}`}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 text-sm"
                    >
                      Üzenet küldése
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ha nincs szerződés */}
          {filteredContracts.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <FaFileContract className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">Még nincs szerződés ebben a kategóriában.</p>
              <Link
                to="/available-projects"
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