// src/pages/customer/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaClipboardList, FaFileAlt, FaChartLine, FaBell, FaUserCircle } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../contexts/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalProposals: 0,
    completedProjects: 0,
    totalSpent: 0
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/projects/my-projects`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
          const projs = data.projects;
          setRecentProjects(projs.slice(0, 3)); // Csak az utolsó 3
          
          let active = 0, completed = 0, proposals = 0;
          projs.forEach(p => {
            if (p.status === 'active') active++;
            if (p.status === 'completed') completed++;
            proposals += p.proposals_count;
          });
          setStats({ activeProjects: active, totalProposals: proposals, completedProjects: completed, totalSpent: 0 });
        }
      } catch (error) {
        console.error("Hiba a dashboard lekérésekor:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Új ajánlat érkezett a 'Drónfotózás ingatlanhoz' projektre",
      time: "5 perce",
      read: false
    },
    {
      id: 2,
      message: "A 'Ipari csarnok ellenőrzése' projekt holnap lejár",
      time: "2 órája",
      read: false
    },
    {
      id: 3,
      message: "Kiss Anna elfogadta az ajánlatod",
      time: "1 napja",
      read: true
    }
  ]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs rounded-full">Aktív</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 text-xs rounded-full">Függőben</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">Befejezett</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          
          {/* Üdvözlő sor */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-all duration-700">
                Üdvözlünk, {user?.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">
                Itt követheted nyomon a projektjeidet és az ajánlatokat.
              </p>
            </div>
            <Link
              to="/create-project"
              className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              <FaPlus className="mr-2" />
              Új projekt létrehozása
            </Link>
          </div>

          {/* Statisztika kártyák */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Aktív projektek</h3>
                <FaClipboardList className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeProjects}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Kiadott projektek</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Összes ajánlat</h3>
                <FaFileAlt className="text-green-600 dark:text-green-400 text-xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalProposals}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Összes beérkezett jelentkezés</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Befejezett projektek</h3>
                <FaChartLine className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completedProjects}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Sikeresen lezárva</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Összes kiadás</h3>
                <span className="text-blue-600 dark:text-blue-400 text-xl font-bold">€</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalSpent} €</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Hamarosan...</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bal oldal - Legutóbbi projektek */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Legutóbbi projektjeid</h2>
                  <Link to="/my-projects" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    Összes megtekintése →
                  </Link>
                </div>

                <div className="space-y-4">
                  {loading ? (
                     <div className="text-center py-4">
                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                     </div>
                  ) : recentProjects.length === 0 ? (
                     <p className="text-gray-500">Még nem adtál fel projektet.</p>
                  ) : recentProjects.map((project) => (
                    <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            {getStatusBadge(project.status)}
                            <span className="text-gray-500 dark:text-gray-400">{project.proposals_count} ajánlat</span>
                            <span className="text-gray-500 dark:text-gray-400">{parseInt(project.budget).toLocaleString('hu-HU')} Ft</span>
                            <span className="text-gray-500 dark:text-gray-400">Határidő: {formatDate(project.deadline)}</span>
                          </div>
                        </div>
                        <Link
                          to={`/project/${project.id}`}
                          className="px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 text-center"
                        >
                          Részletek
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Jobb oldal - Értesítések és gyorslinkek */}
            <div className="space-y-6">
              {/* Értesítések */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Értesítések</h2>
                  <FaBell className="text-gray-400 dark:text-gray-500 text-xl" />
                </div>

                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-3 rounded-lg transition-all duration-300 ${
                      notification.read 
                        ? 'bg-gray-50 dark:bg-gray-700' 
                        : 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
                    }`}>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{notification.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline text-center">
                  Összes megtekintése
                </button>
              </div>

              {/* Gyorslinkek */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Gyorslinkek</h2>
                <div className="space-y-3">
                  <Link to="/find-freelancers" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300">
                    <FaUserCircle className="text-blue-600 dark:text-blue-400 text-xl" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Pilóták keresése</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tallózz a regisztrált pilóták között</p>
                    </div>
                  </Link>
                  <Link to="/my-proposals" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300">
                    <FaFileAlt className="text-green-600 dark:text-green-400 text-xl" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Ajánlataim</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Kövesd nyomon az ajánlatokat</p>
                    </div>
                  </Link>
                  <Link to="/profile" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300">
                    <FaUserCircle className="text-purple-600 dark:text-purple-400 text-xl" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Profil szerkesztése</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Frissítsd az adataidat</p>
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

export default CustomerDashboard;