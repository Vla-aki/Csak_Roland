import React, { useState, useEffect } from 'react';
import { FaTrash, FaUserShield, FaProjectDiagram, FaUsers } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      if (activeTab === 'projects') {
        const res = await fetch(`${apiUrl}/admin/projects`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) setProjects(data.projects);
      } else {
        const res = await fetch(`${apiUrl}/admin/users`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) setUsers(data.users);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Biztosan törölni akarod ezt a projektet? Ez a művelet visszavonhatatlan!')) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await fetch(`${apiUrl}/admin/projects/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      fetchData(); 
    } catch (error) {
      alert('Hiba történt a törlés során.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Biztosan törölni akarod ezt a felhasználót? Minden adata (projektek, ajánlatok, portfólió) TÖRLŐDIK!')) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await fetch(`${apiUrl}/admin/users/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      fetchData(); 
    } catch (error) {
      alert('Hiba történt a törlés során.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-700 flex flex-col">
      <Navbar />
      <div className="pt-24 pb-16 px-4 flex-1">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <FaUserShield className="text-3xl text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Adminisztrációs Pult</h1>
              <p className="text-gray-600 dark:text-gray-400">Rendszer felügyelete és moderálása</p>
            </div>
          </div>

          {/* Tabok */}
          <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <button onClick={() => setActiveTab('projects')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'projects' ? 'bg-red-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'}`}>
              <FaProjectDiagram /> Projektek
            </button>
            <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'users' ? 'bg-red-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'}`}>
              <FaUsers /> Felhasználók
            </button>
          </div>

          {/* Lista */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-gray-500">Adatok betöltése...</div>
            ) : activeTab === 'projects' ? (
              <table className="w-full text-left border-collapse min-w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
                    <th className="p-4 border-b dark:border-gray-600">ID</th>
                    <th className="p-4 border-b dark:border-gray-600">Cím</th>
                    <th className="p-4 border-b dark:border-gray-600">Létrehozó</th>
                    <th className="p-4 border-b dark:border-gray-600">Állapot</th>
                    <th className="p-4 border-b dark:border-gray-600 text-right">Művelet</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 border-b dark:border-gray-700 text-gray-900 dark:text-gray-100">
                      <td className="p-4 text-sm">#{p.id}</td>
                      <td className="p-4 font-medium">{p.title}</td>
                      <td className="p-4 text-sm">{p.user_name} <br/><span className="text-xs text-gray-500">{p.user_email}</span></td>
                      <td className="p-4 text-sm">{p.status}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDeleteProject(p.id)} className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors" title="Projekt Törlése">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse min-w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
                    <th className="p-4 border-b dark:border-gray-600">ID</th>
                    <th className="p-4 border-b dark:border-gray-600">Név</th>
                    <th className="p-4 border-b dark:border-gray-600">Email</th>
                    <th className="p-4 border-b dark:border-gray-600">Szerepkör</th>
                    <th className="p-4 border-b dark:border-gray-600 text-right">Művelet</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 border-b dark:border-gray-700 text-gray-900 dark:text-gray-100">
                      <td className="p-4 text-sm">#{u.id}</td>
                      <td className="p-4 font-medium">{u.name}</td>
                      <td className="p-4 text-sm">{u.email}</td>
                      <td className="p-4 text-sm">{u.role === 'admin' ? <span className="text-red-500 font-bold">Admin</span> : u.role}</td>
                      <td className="p-4 text-right">
                        {u.role !== 'admin' && (
                          <button onClick={() => handleDeleteUser(u.id)} className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors" title="Felhasználó Törlése">
                            <FaTrash />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default AdminDashboard;
