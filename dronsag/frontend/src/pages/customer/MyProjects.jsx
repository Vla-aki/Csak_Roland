// src/pages/customer/MyProjects.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEye, FaEdit, FaTrash, FaFilter, FaSearch } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const MyProjects = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const projects = [
    {
      id: 1,
      title: "Drónfotózás ingatlanhoz - 10 ingatlan",
      description: "Budapesti luxusingatlanok fotózásához keresek profi drónost...",
      budget: 250,
      budgetType: "fix",
      location: "Budapest",
      category: "photography",
      status: "active",
      postedDate: "2026.03.01.",
      deadline: "2026.03.15.",
      proposals: 8,
      views: 45
    },
    {
      id: 2,
      title: "Ipari csarnok ellenőrzése",
      description: "5000m2-es ipari csarnok tetőszerkezetének ellenőrzése...",
      budget: 65,
      budgetType: "hourly",
      location: "Győr",
      category: "inspection",
      status: "active",
      postedDate: "2026.03.02.",
      deadline: "2026.03.20.",
      proposals: 3,
      views: 28
    },
    {
      id: 3,
      title: "Mezőgazdasági terület térképezés",
      description: "120 hektáros búzatábla NDVI elemzése, 3D modell...",
      budget: 480,
      budgetType: "fix",
      location: "Bács-Kiskun",
      category: "mapping",
      status: "active",
      postedDate: "2026.02.28.",
      deadline: "2026.03.25.",
      proposals: 5,
      views: 62
    },
    {
      id: 4,
      title: "Esküvői drónvideó",
      description: "Esküvői helyszín és ceremónia drónos felvétele...",
      budget: 120,
      budgetType: "hourly",
      location: "Visegrád",
      category: "videography",
      status: "pending",
      postedDate: "2026.03.03.",
      deadline: "2026.04.01.",
      proposals: 0,
      views: 15
    },
    {
      id: 5,
      title: "Napelempark ellenőrzés",
      description: "5MW-s napelempark paneljeinek ellenőrzése hőkamerával...",
      budget: 1800,
      budgetType: "fix",
      location: "Kecskemét",
      category: "inspection",
      status: "completed",
      postedDate: "2026.02.25.",
      deadline: "2026.03.10.",
      proposals: 6,
      views: 89
    }
  ];

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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
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

          {/* Szűrők és kereső */}
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
                    Aktív (3)
                  </button>
                  <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      filter === 'pending'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Függőben (1)
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      filter === 'completed'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Befejezett (1)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Projektek lista */}
          {filteredProjects.length > 0 ? (
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
                              {project.budget} € / {project.budgetType === 'fix' ? 'fix' : 'óra'}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">{project.location}</span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {project.proposals} ajánlat
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {project.views} megtekintés
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 lg:ml-4">
                      <Link
                        to={`/project/${project.id}`}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                        title="Megtekintés"
                      >
                        <FaEye />
                      </Link>
                      {project.status !== 'completed' && (
                        <>
                          <Link
                            to={`/project/${project.id}/edit`}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300"
                            title="Szerkesztés"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300"
                            title="Törlés"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {project.proposals > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        to={`/project/${project.id}/proposals`}
                        className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {project.proposals} ajánlat megtekintése →
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
    </div>
  );
};

export default MyProjects;