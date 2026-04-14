// src/pages/drone/DroneDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaClipboardList, FaCheckCircle, FaMoneyBillWave, FaStar, FaUserCircle, FaTimes, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../contexts/AuthContext';

const DroneDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    availableProjects: 0,
    activeBids: 0,
    completedJobs: 0,
    totalEarnings: 0,
    rating: 0
  });

  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [activeBids, setActiveBids] = useState([]);
  const [viewProject, setViewProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        const [projRes, bidsRes, contractsRes] = await Promise.all([
          fetch(`${apiUrl}/projects`),
          fetch(`${apiUrl}/bids/my-bids`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/contracts`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        
        const projData = await projRes.json();
        const bidsData = await bidsRes.json();
        const contractsData = await contractsRes.json();
        
        if (projData.success) {
          const activeProjs = projData.projects.filter(p => p.status === 'active' && !p.contract_id);
          setRecommendedProjects(activeProjs.slice(0, 3).map(p => ({
            id: p.id, title: p.title, budget: p.budget, budgetType: p.budget_type,
            location: p.location, deadline: new Date(p.deadline).toLocaleDateString('hu-HU'),
            skills: p.skills_required || [], matched: Math.floor(Math.random() * 20) + 80
          })));
        }
        
        if (bidsData.success) {
          setActiveBids(bidsData.bids.filter(b => b.status === 'pending').slice(0, 3).map(b => ({
            id: b.id, projectTitle: b.projectTitle, amount: b.bidAmount, status: b.status, 
            submittedDate: new Date(b.submittedDate).toLocaleDateString('hu-HU')
          })));
        }

        let completed = 0, earnings = 0;
        if (contractsData.success) {
          const completedContracts = contractsData.contracts.filter(c => c.status === 'completed' || c.payment_status === 'paid');
          completed = completedContracts.length;
          earnings = completedContracts.reduce((sum, c) => sum + Number(c.amount), 0);
        }
        
        setStats({
          availableProjects: projData.success ? projData.projects.filter(p => p.status === 'active' && !p.contract_id).length : 0,
          activeBids: bidsData.bids?.filter(b => b.status === 'pending').length || 0,
          completedJobs: completed,
          totalEarnings: earnings,
          rating: user?.rating ? Number(user.rating).toFixed(1) : 0
        });

      } catch (error) {
        console.error("Hiba a dashboard betöltésekor:", error);
      }
    };
    
    if (user) fetchDashboardData();
  }, [user]);

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

  const getBidStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 text-xs rounded-full">Elbírálás alatt</span>;
      case 'accepted':
        return <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs rounded-full">Elfogadva</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-xs rounded-full">Elutasítva</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700 flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 flex-1">
        <div className="container mx-auto max-w-7xl">
          
          {/* Üdvözlet */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-all duration-700">
                Üdvözöljük, {user?.name?.split(' ')[0] || 'Pilóta'}! 🚁
              </h1>
              <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">
                Itt követheted nyomon a jelentkezéseidet és az aktuális projekteket.
              </p>
            </div>
            <Link
              to="/find-work"
              className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              <FaSearch className="mr-2" />
              Projektek keresése
            </Link>
          </div>

          {/* Statisztikák */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Elérhető projektek</h3>
                <FaSearch className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.availableProjects}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Jelentkezésre vár</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Aktív ajánlataid</h3>
                <FaClipboardList className="text-yellow-600 dark:text-yellow-400 text-xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeBids}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Függőben lévő ajánlatok</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Elvégzett munkák</h3>
                <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completedJobs}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Eddigi sikeres munkák</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Összes bevétel</h3>
                <FaMoneyBillWave className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalEarnings.toLocaleString('hu-HU')} Ft</p>
              <div className="flex items-center gap-1 mt-2">
                <FaStar className="text-yellow-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.rating}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">({user?.reviews_count || 0} értékelés)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ajánlott projektek */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Neked ajánlott projektek</h2>
                  <Link to="/find-work" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    Összes megtekintése →
                  </Link>
                </div>

                <div className="space-y-4">
                  {recommendedProjects.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">Jelenleg nincs elérhető projekt.</p>
                    </div>
                  ) : recommendedProjects.map((project) => (
                    <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs rounded-full">
                              {project.matched}% egyezés
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            <span className="text-gray-900 dark:text-white font-medium">{parseInt(project.budget).toLocaleString('hu-HU')} Ft / {project.budgetType === 'fix' ? 'fix' : 'óra'}</span>
                            <span className="text-gray-500 dark:text-gray-400">{project.location}</span>
                            <span className="text-gray-500 dark:text-gray-400">Határidő: {project.deadline}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.skills.map((skill, i) => (
                              <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      <button
                        onClick={() => handleViewProject(project.id)}
                        disabled={loadingProject}
                          className="px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 text-center whitespace-nowrap"
                        >
                          Részletek
                      </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Jobb sáv */}
            <div className="space-y-6">
              {/* Ajánlatok */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Aktív ajánlataid</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{activeBids.length} db</span>
                </div>

                <div className="space-y-3">
                  {activeBids.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Nincsenek függőben lévő ajánlataid.</p>
                    </div>
                  ) : activeBids.map((bid) => (
                    <div key={bid.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm">{bid.projectTitle}</h3>
                        {getBidStatusBadge(bid.status)}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Ajánlat: {parseInt(bid.amount).toLocaleString('hu-HU')} Ft</span>
                        <span className="text-gray-500 dark:text-gray-400">{bid.submittedDate}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Link to="/my-bids" className="block mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline text-center">
                  Összes ajánlat megtekintése
                </Link>
              </div>

              {/* Gyorslinkek */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Gyorslinkek</h2>
                <div className="space-y-3">
                  <Link to="/my-contracts" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300">
                    <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Szerződéseim</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Aktív és lezárt szerződések</p>
                    </div>
                  </Link>
                  <Link to="/profile" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300">
                    <FaUserCircle className="text-purple-600 dark:text-purple-400 text-xl" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Profil szerkesztése</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Frissítsd a szakértelmed és adataid</p>
                    </div>
                  </Link>
                  <Link to="/earnings" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300">
                    <FaMoneyBillWave className="text-blue-600 dark:text-blue-400 text-xl" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Bevételek</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Kifizetések és statisztikák</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DroneDashboard;