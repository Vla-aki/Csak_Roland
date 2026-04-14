import React, { useState, useEffect } from 'react';
import { FaTrash, FaUserShield, FaProjectDiagram, FaUsers, FaInfoCircle, FaCheckCircle, FaFileAlt, FaEye, FaCommentDots, FaTimes } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, type: '', id: null });
  const [alertModal, setAlertModal] = useState({ show: false, message: '' });
  const [stats, setStats] = useState({ activeProjects: 0, totalProposals: 0, completedProjects: 0, totalUsers: 0 });
  const [viewProject, setViewProject] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [currentMessagePage, setCurrentMessagePage] = useState(1);
  const messagesPerPage = 15;

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Statisztikák lekérése
      const statsRes = await fetch(`${apiUrl}/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.stats);
      }

      if (activeTab === 'projects') {
        const res = await fetch(`${apiUrl}/admin/projects`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          if (data.success) setProjects(data.projects);
        }
      } else if (activeTab === 'users') {
        const res = await fetch(`${apiUrl}/admin/users`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          if (data.success) setUsers(data.users);
        }
      } else if (activeTab === 'messages') {
        const res = await fetch(`${apiUrl}/admin/messages`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setMessages(data.messages);
            setCurrentMessagePage(1); // Lapozás nullázása újratöltéskor
          }
        } else {
          setAlertModal({ show: true, message: 'A szerver még nem frissült. Indítsd újra a backendet (stop.bat majd start.bat)!' });
        }
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

  const confirmDeletion = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      if (deleteConfirm.type === 'project') {
        await fetch(`${apiUrl}/admin/projects/${deleteConfirm.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      } else if (deleteConfirm.type === 'user') {
        await fetch(`${apiUrl}/admin/users/${deleteConfirm.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      }
      fetchData(); 
      setDeleteConfirm({ show: false, type: '', id: null });
    } catch (error) {
      setAlertModal({ show: true, message: 'Hiba történt a törlés során.' });
    }
  };

  const handleViewProject = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/projects/${id}`);
      const data = await res.json();
      if (data.success) setViewProject(data.project);
    } catch (error) {
      setAlertModal({ show: true, message: 'Hiba a projekt részleteinek lekérésekor.' });
    }
  };

  const handleViewUser = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/user/${id}`);
      const data = await res.json();
      if (data.success) setViewUser(data.user);
    } catch (error) {
      setAlertModal({ show: true, message: 'Hiba a felhasználó részleteinek lekérésekor.' });
    }
  };

  const handleDeleteProject = (id) => {
    setDeleteConfirm({ show: true, type: 'project', id });
  };

  const handleDeleteUser = (id) => {
    setDeleteConfirm({ show: true, type: 'user', id });
  };

  // Lapozás kiszámítása az üzenetekhez
  const indexOfLastMessage = currentMessagePage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalMessagePages = Math.ceil(messages.length / messagesPerPage);

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

          {/* Statisztikák */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Aktív Projektek</h3>
                <FaProjectDiagram className="text-blue-600 text-xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeProjects}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Befejezett Projektek</h3>
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completedProjects}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Összes Ajánlat</h3>
                <FaFileAlt className="text-yellow-600 text-xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalProposals}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Regisztrált Felhasználók</h3>
                <FaUsers className="text-purple-600 text-xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
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
            <button onClick={() => setActiveTab('messages')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'messages' ? 'bg-red-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'}`}>
              <FaCommentDots /> Üzenetek
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
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button onClick={() => handleViewProject(p.id)} className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors" title="Részletek">
                          <FaEye />
                        </button>
                        <button onClick={() => handleDeleteProject(p.id)} className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors" title="Projekt Törlése">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : activeTab === 'users' ? (
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
                      <td className="p-4 text-right flex justify-end gap-2">
                        {u.role !== 'admin' && (
                          <>
                          <button onClick={() => handleViewUser(u.id)} className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors" title="Részletek">
                            <FaEye />
                          </button>
                          <button onClick={() => handleDeleteUser(u.id)} className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors" title="Felhasználó Törlése">
                            <FaTrash />
                          </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col min-w-full">
                <table className="w-full text-left border-collapse min-w-full">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
                      <th className="p-4 border-b dark:border-gray-600">ID</th>
                      <th className="p-4 border-b dark:border-gray-600">Dátum</th>
                      <th className="p-4 border-b dark:border-gray-600">Feladó</th>
                      <th className="p-4 border-b dark:border-gray-600">Címzett</th>
                      <th className="p-4 border-b dark:border-gray-600">Üzenet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMessages.map(m => (
                      <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 border-b dark:border-gray-700 text-gray-900 dark:text-gray-100">
                        <td className="p-4 text-sm">#{m.id}</td>
                        <td className="p-4 text-sm">{new Date(m.created_at).toLocaleString('hu-HU')}</td>
                        <td className="p-4 text-sm font-medium">{m.sender_name} <span className="text-xs text-gray-500">({m.sender_role})</span></td>
                        <td className="p-4 text-sm font-medium">{m.receiver_name} <span className="text-xs text-gray-500">({m.receiver_role})</span></td>
                        <td className="p-4 text-sm max-w-xs truncate" title={m.message}>
                          {m.message.match(/^https?:\/\/[^\s]+\.(jpeg|jpg|gif|png|webp|mp4)(\?.*)?$/i) ? '[Fájl/Kép csatolmány]' : m.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {totalMessagePages > 1 && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-b-xl gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Összesen: {messages.length} üzenet
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setCurrentMessagePage(prev => Math.max(prev - 1, 1))}
                        disabled={currentMessagePage === 1}
                        className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
                      >
                        Előző
                      </button>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
                        {currentMessagePage} / {totalMessagePages}
                      </span>
                      <button 
                        onClick={() => setCurrentMessagePage(prev => Math.min(prev + 1, totalMessagePages))}
                        disabled={currentMessagePage === totalMessagePages}
                        className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
                      >
                        Következő
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />

      {/* Törlés megerősítő ablak */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Biztosan törölni akarod?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {deleteConfirm.type === 'project' 
                ? 'A projekt és az összes hozzá tartozó ajánlat véglegesen törlődik a rendszerből!' 
                : 'A felhasználó és minden adata (projektek, ajánlatok, portfólió) véglegesen törlődik a rendszerből!'}
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm({ show: false, type: '', id: null })} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">Mégse</button>
              <button onClick={confirmDeletion} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">Igen, törlés</button>
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

      {/* Projekt Részletek Modal */}
      {viewProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all" onClick={() => setViewProject(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Projekt: {viewProject.title}</h3>
              <button onClick={() => setViewProject(null)} className="text-gray-400 hover:text-gray-600"><FaTimes size={20}/></button>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p><strong>Létrehozó:</strong> {viewProject.customer_name}</p>
              <p><strong>Kategória:</strong> {viewProject.category}</p>
              <p><strong>Helyszín:</strong> {viewProject.location}</p>
              <p><strong>Költségkeret:</strong> {viewProject.budget} Ft ({viewProject.budget_type})</p>
              <p><strong>Határidő:</strong> {new Date(viewProject.deadline).toLocaleDateString('hu-HU')}</p>
              <p><strong>Státusz:</strong> {viewProject.status}</p>
              <div>
                <strong>Leírás:</strong>
                <p className="mt-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">{viewProject.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Felhasználó Részletek Modal */}
      {viewUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all" onClick={() => setViewUser(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Felhasználó: {viewUser.name}</h3>
              <button onClick={() => setViewUser(null)} className="text-gray-400 hover:text-gray-600"><FaTimes size={20}/></button>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p><strong>Email:</strong> {viewUser.email}</p>
              <p><strong>Telefon:</strong> {viewUser.phone || 'Nem adta meg'}</p>
              <p><strong>Szerepkör:</strong> {viewUser.role}</p>
              <p><strong>Helyszín:</strong> {viewUser.location || 'Nem adta meg'}</p>
              <p><strong>Csatlakozott:</strong> {viewUser.memberSince}</p>
              {viewUser.role === 'driver' && (
                <>
                  <p><strong>Óradíj:</strong> {viewUser.hourlyRate ? `${viewUser.hourlyRate} Ft/óra` : 'Nincs megadva'}</p>
                  <p><strong>Elérhetőség:</strong> {viewUser.availability || 'Nincs megadva'}</p>
                  <p><strong>Értékelés:</strong> {viewUser.rating} ({viewUser.reviews} vélemény)</p>
                </>
              )}
              <div>
                <strong>Bemutatkozás:</strong>
                <p className="mt-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg whitespace-pre-wrap">{viewUser.bio || 'Nem adott meg bemutatkozást.'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;
