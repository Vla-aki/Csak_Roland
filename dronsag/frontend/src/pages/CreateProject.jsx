// src/pages/CreateProject.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { FaHeading, FaAlignLeft, FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt, FaTags, FaPlus, FaTimes, FaSave, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

const CreateProject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newSkill, setNewSkill] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'photography',
    location: '',
    budget_type: 'fix',
    budget: '',
    deadline: '',
    skills: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${apiUrl}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'A projekt sikeresen feladásra került!' });
        // Pár másodperc múlva átirányítjuk a felhasználót (pl. a saját projektjeihez vagy a keresőbe)
        setTimeout(() => navigate('/find-work'), 2000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Hiba történt a mentés során.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Hálózati hiba történt. Kérlek ellenőrizd az internetkapcsolatot!' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ha a felhasználó nem megbízó, ne is lássa az űrlapot
  if (user?.role !== 'customer') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Nincs jogosultságod</h2>
            <p className="text-gray-600 dark:text-gray-400">Csak megbízók hozhatnak létre új projekteket.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-700 flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-700">Új projekt feladása</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-700">Add meg a munka részleteit, hogy a legjobb drónpilóták rátaláljanak!</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-700">
          
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {message.type === 'success' ? <FaCheckCircle /> : <FaInfoCircle />}
              <p className="font-medium">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Alapadatok */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Alapadatok</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Projekt címe</label>
                <div className="relative">
                  <FaHeading className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="pl. Esküvői drónvideózás a Balatonnál"
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Részletes leírás</label>
                <div className="relative">
                  <FaAlignLeft className="absolute left-4 top-4 text-gray-400" />
                  <textarea name="description" value={formData.description} onChange={handleChange} required rows="5" placeholder="Írd le pontosan, hogy milyen feladatra keresel pilótát..."
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-500 resize-none"></textarea>
                </div>
              </div>
            </div>

            {/* Kategória és Helyszín */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kategória</label>
                <select name="category" value={formData.category} onChange={handleChange} required
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-500 appearance-none">
                  <option value="photography">Légifotózás</option>
                  <option value="videography">Drónvideózás</option>
                  <option value="inspection">Ipari ellenőrzés</option>
                  <option value="mapping">Térképezés és 3D</option>
                  <option value="delivery">Drónos szállítás</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Helyszín</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="pl. Budapest, vagy Távmunka"
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-500" />
                </div>
              </div>
            </div>

            {/* Költségkeret és Határidő */}
            <div className="space-y-6 pt-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Költségkeret és Határidő</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bérezés típusa</label>
                  <select name="budget_type" value={formData.budget_type} onChange={handleChange} required
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-500 appearance-none">
                    <option value="fix">Fix összeg</option>
                    <option value="hourly">Óradíj</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Költségkeret (Ft)</label>
                  <div className="relative">
                    <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" name="budget" value={formData.budget} onChange={handleChange} required placeholder="pl. 50000" min="1"
                      className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Határidő</label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required
                      className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Elvárt képességek */}
            <div className="pt-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 mb-4">Elvárt Szakterületek</h3>
              
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <FaTags className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                    placeholder="Írj be egy elvárt készséget (pl. Hőkamera, FPV) és nyomj Entert..."
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" />
                </div>
                <button type="button" onClick={handleAddSkill} className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium flex items-center gap-2 transition-colors">
                  <FaPlus /> Hozzáad
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800/50">
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-200 focus:outline-none"><FaTimes /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Mentés gomb */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
              <button type="submit" disabled={isSubmitting} className={`flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 shadow-md active:scale-95'}`}>
                {isSubmitting ? 'Mentés folyamatban...' : <><FaSave /> Projekt feladása</>}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateProject;