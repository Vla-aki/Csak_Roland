// src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaInfoCircle, FaMoneyBillWave, FaClock, FaStar, FaBriefcase, FaSave, FaTags, FaCamera, FaPlus, FaTimes, FaCalendarAlt, FaCheckCircle, FaEdit, FaLock, FaEyeSlash, FaEye } from 'react-icons/fa';
import Cropper from 'react-easy-crop';

const Profile = () => {
  const { user } = useAuth();
  
  // Űrlap állapotok
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

  // Profilkép állapotok
  const fileInputRef = useRef(null);
  const portfolioFileInputRef = useRef(null);
  const [profileImagePreview, setProfileImagePreview] = useState(user?.profile_image || null);
  const [cropModal, setCropModal] = useState({ show: false, imageSrc: null, crop: { x: 0, y: 0 }, zoom: 1, croppedAreaPixels: null });

  // Adatok betöltése
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

  const [roleSwitchError, setRoleSwitchError] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleSwitchLoading, setRoleSwitchLoading] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  // Jelszó csere állapotok
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, error: '', success: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Szerkesztés megszakítása
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

  // Képkiválasztó
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Kép feltöltése a szerverre
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    const response = await fetch(`${apiUrl}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Hiba a feltöltés során');
    }
    return data.url;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'image/gif') {
        try {
          setIsSaving(true);
          const url = await uploadImage(file);
          const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
          const fullUrl = baseUrl + url;
          setProfileImagePreview(fullUrl);
          setFormData(prev => ({ ...prev, profile_image: fullUrl }));
          setSaveMessage({ type: 'success', text: 'GIF profilkép sikeresen feltöltve!' });
        } catch (error) {
          setSaveMessage({ type: 'error', text: 'Hiba a GIF feltöltésekor!' });
        } finally {
          setIsSaving(false);
          setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
        }
      } else {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          setCropModal(prev => ({ ...prev, show: true, imageSrc: reader.result }));
        });
        reader.readAsDataURL(file);
      }
    }
    e.target.value = '';
  };

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise(resolve => image.onload = resolve);
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob], "profile.jpg", { type: "image/jpeg" }));
      }, 'image/jpeg');
    });
  };

  const handleCropConfirm = async () => {
    try {
      setIsSaving(true);
      setCropModal(prev => ({ ...prev, show: false }));
      const croppedFile = await getCroppedImg(cropModal.imageSrc, cropModal.croppedAreaPixels);
      const url = await uploadImage(croppedFile);
      const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
      const fullUrl = baseUrl + url;
      setProfileImagePreview(fullUrl);
      setFormData(prev => ({ ...prev, profile_image: fullUrl }));
      setSaveMessage({ type: 'success', text: 'Kép sikeresen beállítva!' });
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Hiba a kép feldolgozásakor!' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
    }
  };

  // Portfólió képkiválasztó
  const handlePortfolioClick = () => {
    portfolioFileInputRef.current.click();
  };

  const handlePortfolioChange = async (e) => {
    const files = Array.from(e.target.files);
    setIsSaving(true);
    let uploadedUrls = [];
    try {
      for (const file of files) {
        const url = await uploadImage(file);
        const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
        uploadedUrls.push(baseUrl + url);
      }
      setFormData(prev => ({ ...prev, portfolio: [...prev.portfolio, ...uploadedUrls] }));
      setSaveMessage({ type: 'success', text: 'Portfólió képek sikeresen feltöltve!' });
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Hiba a portfólió kép feltöltésekor!' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
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
           // Gyorsítótár ürítése
           finalUser.portfolio = [];
           localStorage.setItem('user', JSON.stringify(finalUser));
         }

         setSaveMessage({ type: 'success', text: 'A profil adatai sikeresen frissítve lettek!' });
        setIsEditing(false);
        setTimeout(() => window.location.reload(), 1000);
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
    setRoleSwitchError('');
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
        setShowRoleModal(false);
        window.location.href = result.user.role === 'driver' ? '/drone-dashboard' : '/dashboard';
      } else {
        setRoleSwitchError(result.message || 'Hiba történt a váltás során.');
      }
    } catch (error) {
      setRoleSwitchError('Hálózati hiba történt.');
    } finally {
      setRoleSwitchLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordStatus({ loading: true, error: '', success: '' });

    if (passwordData.new !== passwordData.confirm) {
      return setPasswordStatus({ loading: false, error: 'Az új jelszavak nem egyeznek!', success: '' });
    }
    if (passwordData.new.length < 6) {
      return setPasswordStatus({ loading: false, error: 'Az új jelszónak legalább 6 karakternek kell lennie!', success: '' });
    }

    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwordData.current, newPassword: passwordData.new })
      });
      const data = await res.json();

      if (data.success) {
        setPasswordStatus({ loading: false, error: '', success: 'Jelszó sikeresen megváltoztatva!' });
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordData({ current: '', new: '', confirm: '' });
          setPasswordStatus({ loading: false, error: '', success: '' });
        }, 2000);
      } else {
        setPasswordStatus({ loading: false, error: data.message, success: '' });
      }
    } catch (err) {
      setPasswordStatus({ loading: false, error: 'Hálózati hiba történt.', success: '' });
    }
  };

  if (!user) return null;

  // Dátum formázás
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' });
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
          
          {/* Bal sáv */}
          <div className="lg:w-1/3 space-y-6">
            {/* Névjegykártya */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-700 text-center">
              
              {/* Profilkép */}
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
                
                {/* Kép cseréje */}
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FaCamera className="text-white text-xl mb-1" />
                  <span className="text-white text-[10px] font-medium uppercase tracking-wider">Módosítás</span>
                </div>
              </div>
              
              {/* Fájl input */}
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

          <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-700">{formData.name}</h2>
              <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">
                {user.role === 'driver' ? (formData.skills && formData.skills.length > 0 ? formData.skills.join(' • ') : 'Drónpilóta') : 'Megbízó'}
              </p>
              
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FaCalendarAlt /> Tag ekkortól: {formatDate(user.member_since || user.created_at)}
              </div>
            </div>

            {/* Statisztikák */}
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
              
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaLock className="inline mr-2" /> Jelszó megváltoztatása
                </button>
              </div>
            </div>
          </div>

          {/* Jobb sáv */}
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
                /* Olvasási nézet */
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
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Település</p>
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
                /* Szerkesztő űrlap */
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Település (Város / Megye)</label>
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

                {/* Pilóta beállítások */}
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

                    {/* Szakterületek */}
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
                      
                      {/* Címkék */}
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

      {/* Szerepkör váltás modal */}
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
            
            {roleSwitchError && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-sm font-medium">
                {roleSwitchError}
              </div>
            )}
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

      {/* Jelszócsere Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Jelszó megváltoztatása</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><FaTimes size={20}/></button>
            </div>
            
            {passwordStatus.error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{passwordStatus.error}</div>}
            {passwordStatus.success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{passwordStatus.success}</div>}
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jelenlegi jelszó</label>
                <div className="relative">
                  <input type={showPw.current ? 'text' : 'password'} required value={passwordData.current} onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white focus:ring-2 focus:ring-blue-500" />
                  <button type="button" onClick={() => setShowPw({...showPw, current: !showPw.current})} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPw.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Új jelszó</label>
                <div className="relative">
                  <input type={showPw.new ? 'text' : 'password'} required value={passwordData.new} onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white focus:ring-2 focus:ring-blue-500" />
                  <button type="button" onClick={() => setShowPw({...showPw, new: !showPw.new})} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPw.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Új jelszó megerősítése</label>
                <div className="relative">
                  <input type={showPw.confirm ? 'text' : 'password'} required value={passwordData.confirm} onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white focus:ring-2 focus:ring-blue-500" />
                  <button type="button" onClick={() => setShowPw({...showPw, confirm: !showPw.confirm})} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPw.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 transition-colors font-medium">Mégse</button>
                <button type="submit" disabled={passwordStatus.loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50">
                  {passwordStatus.loading ? 'Mentés...' : 'Jelszó frissítése'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Képvágó Modal */}
      {cropModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Profilkép beállítása</h3>
              <button onClick={() => setCropModal(prev => ({ ...prev, show: false }))} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors">
                <FaTimes />
              </button>
            </div>
            <div className="relative flex-1 bg-gray-900">
              <Cropper
                image={cropModal.imageSrc}
                crop={cropModal.crop}
                zoom={cropModal.zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={(crop) => setCropModal(prev => ({ ...prev, crop }))}
                onZoomChange={(zoom) => setCropModal(prev => ({ ...prev, zoom }))}
                onCropComplete={(_, croppedAreaPixels) => setCropModal(prev => ({ ...prev, croppedAreaPixels }))}
              />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <input type="range" value={cropModal.zoom} min={1} max={3} step={0.1} onChange={(e) => setCropModal(prev => ({ ...prev, zoom: e.target.value }))} className="w-full mb-4 accent-blue-600" />
              <div className="flex justify-end gap-3">
                <button onClick={() => setCropModal(prev => ({ ...prev, show: false }))} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">Mégse</button>
                <button onClick={handleCropConfirm} disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50">Mentés</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;