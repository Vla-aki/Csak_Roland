// src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaInfoCircle, FaMoneyBillWave, FaClock, FaStar, FaBriefcase, FaSave, FaTags, FaCamera, FaPlus, FaTimes, FaCalendarAlt, FaCheckCircle, FaEdit } from 'react-icons/fa';

const Profile = () => {
  const { user } = useAuth();
  
  // State az űrlap adatainak tárolására (kezdeti értékek a bejelentkezett user adataiból)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    hourly_rate: user?.hourly_rate || '',
    availability: user?.availability || '',
    skills: user?.skills || [], // A user_skills táblából
    portfolio: user?.portfolio || [], // A portfolio táblából
    profile_image: user?.profile_image || '' 
  });

  // Profilkép kezeléséhez szükséges állapotok
  const fileInputRef = useRef(null);
  const portfolioFileInputRef = useRef(null);
  const [profileImagePreview, setProfileImagePreview] = useState(user?.profile_image || null);

  // Amikor betöltődik a user adat (vagy ha módosul), beállítjuk az űrlap és a profilkép értékeit
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        hourly_rate: user.hourly_rate || '',
        availability: user.availability || '',
        skills: user.skills || [],
        portfolio: user.portfolio || [],
        profile_image: user.profile_image || ''
      });
      setProfileImagePreview(user.profile_image || null);
    }
  }, [user]);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [customSkill, setCustomSkill] = useState('');

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleSwitchLoading, setRoleSwitchLoading] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Szerkesztés megszakítása és adatok visszaállítása
  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
      hourly_rate: user?.hourly_rate || '',
      availability: user?.availability || '',
      skills: user?.skills || [],
      portfolio: user?.portfolio || [],
      profile_image: user?.profile_image || ''
    });
    setIsEditing(false);
  };
  
  // Szakterület hozzáadása
  const handleAddSkill = () => {
    const skillToAdd = selectedSkill === 'Egyéb' ? customSkill.trim() : selectedSkill;
    if (skillToAdd && !formData.skills.includes(skillToAdd)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skillToAdd] }));
      setCustomSkill('');
      setSelectedSkill('');
    }
  };

  // Szakterület törlése
  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  // Képkiválasztó megnyitása
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Segédfüggvény a fájl szerverre küldéséhez
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    const res = await fetch(`${apiUrl}/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      const baseUrl = apiUrl.replace('/api', '');
      return `${baseUrl}${data.url}`;
    }
    throw new Error('Feltöltési hiba');
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setProfileImagePreview(URL.createObjectURL(file)); // Ideiglenes előnézet
        const uploadedUrl = await uploadImage(file);
        setFormData(prev => ({ ...prev, profile_image: uploadedUrl }));
      } catch (error) {
        alert('Hiba a kép feltöltésekor!');
      }
    }
  };

  // Portfólió képkiválasztó megnyitása
  const handlePortfolioClick = () => {
    portfolioFileInputRef.current.click();
  };

  const handlePortfolioChange = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      try {
        const uploadedUrl = await uploadImage(file);
        setFormData(prev => ({ ...prev, portfolio: [...prev.portfolio, uploadedUrl] }));
      } catch (error) {
        alert('Hiba a portfólió kép feltöltésekor!');
      }
    }
  };

  const handleRemovePortfolioItem = (index) => {
    setFormData(prev => ({ ...prev, portfolio: prev.portfolio.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${apiUrl}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
         // Frissítjük a böngésző helyi tárolójában lévő felhasználói adatokat, mielőtt újratölt a lap
         const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
         const finalUser = result.updatedUser ? { ...currentUser, ...result.updatedUser } : { ...currentUser, ...formData };
         
         try {
           localStorage.setItem('user', JSON.stringify(finalUser));
         } catch (e) {
           // Ha a képek miatt betelt a localStorage (QuotaExceededError), a képek nélkül mentjük a gyorsítótárba
           finalUser.portfolio = [];
           localStorage.setItem('user', JSON.stringify(finalUser));
         }

         setSaveMessage({ type: 'success', text: 'A profil adatai sikeresen frissítve lettek!' });
        setIsEditing(false); // Visszaváltunk olvasási nézetbe újratöltés nélkül
        setTimeout(() => window.location.reload(), 1000); // Újratöltjük az oldalt, hogy a Navbar is frissüljön
      } else {

        setSaveMessage({ type: 'error', text: result.message || 'Hiba történt a mentés során.' });
      }
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Hálózati hiba történt a mentés során. Kérlek próbáld újra!' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleRoleSwitch = async () => {
    setRoleSwitchLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const newRole = user.role === 'driver' ? 'customer' : 'driver';
      
      const response = await fetch(`${apiUrl}/auth/switch-role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newRole })
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        window.location.href = result.user.role === 'driver' ? '/drone-dashboard' : '/dashboard';
      } else {
        alert(result.message || 'Hiba történt a váltás során.');
      }
    } catch (error) {
      alert('Hálózati hiba történt.');
    } finally {
      setRoleSwitchLoading(false);
      setShowRoleModal(false);
    }
  };

  if (!user) return null; // Biztonsági ellenőrzés, ha nincs user, a PrivateRoute úgyis kivédi

  // Csatlakozás dátumának formázása
  const formatDate = (dateString) => {
    if (!dateString) return 'Ismeretlen';
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-700 flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 pt-24 pb-16 max-w-6xl">
        
        {/* Fejléc */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-700">Profil beállítások</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-700">Kezeld a személyes adataidat és a szakmai profilodat.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Bal oldali sáv: Statisztikák és Névjegykártya */}
          <div className="lg:w-1/3 space-y-6">
            {/* Névjegykártya */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-700 text-center">
              
              {/* Kattintható Profilkép */}
              <div 
            className={`relative w-24 h-24 mx-auto rounded-full mb-4 shadow-lg shadow-blue-600/30 overflow-hidden ${isEditing ? 'cursor-pointer group' : ''}`}
            onClick={isEditing ? handleImageClick : undefined}
              >
                {profileImagePreview ? (
                  <img src={profileImagePreview} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                
                {/* Hover overlay (Kép cseréje) */}
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FaCamera className="text-white text-xl mb-1" />
                  <span className="text-white text-[10px] font-medium uppercase tracking-wider">Módosítás</span>
                </div>
              </div>
              
              {/* Rejtett fájl beviteli mező */}
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

          <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-700">{formData.name}</h2>
              <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">
                {user.role === 'driver' ? (formData.skills && formData.skills.length > 0 ? formData.skills.join(' • ') : 'Drónpilóta') : 'Megbízó'}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Aktív fiók
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FaCalendarAlt /> Tag ekkortól: {formatDate(user.member_since)}
              </div>
            </div>

            {/* Statisztikák (Csak olvasható, az adatbázisból jön) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-700">Statisztikák</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl transition-colors duration-700">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <FaStar className="text-yellow-400 text-xl" />
                    <span className="font-medium">Értékelés</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900 dark:text-white block">
                      {user.rating ? Number(user.rating).toFixed(1) : 'Új'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user.reviews_count || 0} vélemény
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl transition-colors duration-700">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <FaBriefcase className="text-blue-500 text-xl" />
                    <span className="font-medium">Elvégzett munkák</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {user.completed_jobs || 0}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <button 
                  onClick={() => setShowRoleModal(true)}
                  className="w-full px-4 py-2 border-2 border-red-500 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Váltás {user.role === 'driver' ? 'Megbízó' : 'Drónpilóta'} fiókra
                </button>
              </div>
            </div>
          </div>

          {/* Jobb oldali sáv: Szerkeszthető űrlap */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-700">
              
              {saveMessage.text && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                  saveMessage.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {saveMessage.type === 'success' ? <FaCheckCircle /> : <FaInfoCircle />}
                  <p className="font-medium">{saveMessage.text}</p>
                </div>
              )}

              {!isEditing ? (
                /* --- OLVASÁSI NÉZET --- */
                <div className="space-y-8">
                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3 transition-colors duration-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-700">Személyes adatok</h3>
                    <button 
                      onClick={() => setIsEditing(true)} 
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium text-sm"
                    >
                      <FaEdit /> Profil szerkesztése
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Teljes név</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formData.name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email cím</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formData.email || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Telefonszám</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formData.phone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Helyszín</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formData.location || '-'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bemutatkozás</p>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{formData.bio || 'Még nem adtál meg bemutatkozást.'}</p>
                  </div>

                  {user.role === 'driver' && (
                    <>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3 pt-4 transition-colors duration-700">Szakmai adatok</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Irányadó óradíj</p>
                          <p className="font-medium text-gray-900 dark:text-white">{formData.hourly_rate ? `${formData.hourly_rate} Ft / óra` : '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Elérhetőség</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formData.availability === 'full_time' ? 'Teljes munkaidőben elérhető' : 
                             formData.availability === 'part_time' ? 'Részmunkaidőben (Hétvégén / Esténként)' : 
                             formData.availability === 'unavailable' ? 'Jelenleg nem vállalok új munkát' : '-'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Szakterületek</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.skills && formData.skills.length > 0 ? (
                            formData.skills.map((skill, idx) => (
                              <span key={idx} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800/50">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500 italic">Még nem adtál meg szakterületet.</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">Portfólió munkák</p>
                      {formData.portfolio && formData.portfolio.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {formData.portfolio.map((img, idx) => (
                            <img key={idx} src={img} alt={`Portfolio ${idx}`} className="w-full h-32 object-cover rounded-xl shadow-sm border border-gray-200 dark:border-gray-700" />
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-center bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center">
                          <FaCamera className="text-3xl text-gray-400 mb-2" />
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Még nincsenek feltöltve portfólió munkák.</p>
                        </div>
                      )}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* --- SZERKESZTŐ ŰRLAP --- */
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3 transition-colors duration-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Személyes adatok szerkesztése</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teljes név</label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-500" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email cím (Bejelentkezéshez)</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required disabled
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed transition-colors duration-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Az email címed nem módosítható.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Telefonszám</label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Helyszín (Város / Megye)</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Pl. Budapest"
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-500" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rövid bemutatkozás</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" placeholder="Írj magadról pár sort a megbízóknak..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-500 resize-none"></textarea>
                </div>

                {/* Pilóta specifikus beállítások */}
                {user.role === 'driver' && (
                  <>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3 pt-4 transition-colors duration-700">Szakmai adatok</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Irányadó óradíj (Ft/óra)</label>
                        <div className="relative">
                          <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type="number" name="hourly_rate" value={formData.hourly_rate} onChange={handleChange} placeholder="Pl. 15000"
                            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-500" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Elérhetőség</label>
                        <div className="relative">
                          <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <select name="availability" value={formData.availability} onChange={handleChange}
                            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-500 appearance-none">
                            <option value="">Válassz elérhetőséget...</option>
                            <option value="full_time">Teljes munkaidőben elérhető</option>
                            <option value="part_time">Részmunkaidőben (Hétvégén / Esténként)</option>
                            <option value="unavailable">Jelenleg nem vállalok új munkát</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Szakterületek / Készségek */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Szakterületek (pl. Légifotózás, Földmérés)</label>
                      <div className="flex gap-2 mb-3">
                        <div className="relative flex-1 flex flex-col sm:flex-row gap-2">
                          <div className="relative flex-1">
                            <FaTags className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                            <select 
                              value={selectedSkill} 
                              onChange={(e) => setSelectedSkill(e.target.value)}
                              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white appearance-none"
                            >
                              <option value="">Válassz szakterületet...</option>
                              <option value="Drónfotós">Drónfotós</option>
                              <option value="Drónvideós">Drónvideós</option>
                              <option value="Ipari ellenőr">Ipari ellenőr</option>
                              <option value="Térképező / Földmérő">Térképező / Földmérő</option>
                              <option value="Mezőgazdasági drónos">Mezőgazdasági drónos</option>
                              <option value="FPV pilóta">FPV pilóta</option>
                              <option value="Egyéb">Egyéb (saját megadása)</option>
                            </select>
                          </div>
                          {selectedSkill === 'Egyéb' && (
                            <input 
                              type="text" 
                              value={customSkill} 
                              onChange={(e) => setCustomSkill(e.target.value)}
                              placeholder="Írd be a sajátod..."
                              className="w-full sm:w-1/2 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            />
                          )}
                        </div>
                        <button 
                          type="button" 
                          onClick={handleAddSkill}
                          className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium flex items-center gap-2 transition-colors"
                        >
                          <FaPlus /> Hozzáad
                        </button>
                      </div>
                      
                      {/* Címkék listája */}
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800/50">
                            {skill}
                            <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-200 focus:outline-none">
                              <FaTimes />
                            </button>
                          </span>
                        ))}
                        {formData.skills.length === 0 && (
                          <p className="text-sm text-gray-500 italic">Még nem adtál meg szakterületet.</p>
                        )}
                      </div>
                    </div>

                    {/* Portfólió */}
                    <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Portfólió munkák</label>
                      <button type="button" onClick={handlePortfolioClick} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"><FaPlus /> Új munka feltöltése</button>
                      <input type="file" ref={portfolioFileInputRef} onChange={handlePortfolioChange} accept="image/*" multiple className="hidden" />
                      </div>
                    {formData.portfolio && formData.portfolio.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {formData.portfolio.map((img, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                            <img src={img} alt={`Portfolio ${idx}`} className="w-full h-32 object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <button type="button" onClick={() => handleRemovePortfolioItem(idx)} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700">
                                <FaTimes />
                              </button>
                            </div>
                          </div>
                        ))}
                        <div onClick={handlePortfolioClick} className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors h-32">
                          <FaPlus className="text-3xl text-gray-400" />
                        </div>
                      </div>
                    ) : (
                      <div onClick={handlePortfolioClick} className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-center bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <FaCamera className="mx-auto text-3xl text-gray-400 mb-3" />
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Töltsd fel a legjobb képeidet/videóidat ide, hogy a megbízók lássák mire vagy képes!</p>
                      </div>
                    )}
                    </div>
                  </>
                )}

                <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 ${
                      isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-95'
                    }`}
                  >
                    {isSaving ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <><FaSave /> Változások mentése</>
                    )}
                  </button>
                </div>
              </form>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* ===== SZEREPKÖR VÁLTÁS MODAL ===== */}
      {showRoleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Biztosan szerepkört váltasz?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {user.role === 'driver' 
                ? 'Ha átváltasz Megbízó fiókra, az eddigi pilóta adataid (szakterületek, óradíj, elérhetőség) törlődni fognak az adatbázisból!' 
                : 'Ha átváltasz Pilóta fiókra, új adatokat kell majd megadnod a profilodban (óradíj, szakterületek), hogy a megbízók megtaláljanak.'}
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Mégse
              </button>
              <button 
                onClick={handleRoleSwitch}
                disabled={roleSwitchLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
              >
                {roleSwitchLoading ? 'Váltás folyamatban...' : 'Igen, váltok'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;