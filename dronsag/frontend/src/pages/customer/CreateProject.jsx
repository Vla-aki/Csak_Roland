// src/pages/customer/CreateProject.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaMoneyBillWave, FaCalendar, FaTag, FaPlus, FaTimes } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const CreateProject = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'photography',
    description: '',
    location: '',
    budgetType: 'fix',
    budget: '',
    deadline: '',
    skills: [],
    skillInput: '',
    attachments: []
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const categories = [
    { id: 'photography', name: 'Légifotózás', icon: '📷' },
    { id: 'videography', name: 'Videózás', icon: '🎥' },
    { id: 'inspection', name: 'Ellenőrzés', icon: '🔍' },
    { id: 'mapping', name: 'Térképezés', icon: '🗺️' },
    { id: 'delivery', name: 'Szállítás', icon: '📦' }
  ];

  const suggestedSkills = {
    photography: ['légifotó', 'ingatlan', 'drón', 'DJI', 'utómunka'],
    videography: ['videózás', 'rendezvény', 'esküvő', 'szerkesztés', 'színkorrekció'],
    inspection: ['hőkamera', 'ipari', 'szerkezetvizsgálat', 'diagnosztika', 'jelentés'],
    mapping: ['térképezés', '3D modell', 'NDVI', 'topográfia', 'mezőgazdaság'],
    delivery: ['szállítás', 'logisztika', 'gyors', 'csomag', 'expressz']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddSkill = () => {
    if (formData.skillInput.trim() && !formData.skills.includes(formData.skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.skillInput.trim()],
        skillInput: ''
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'A projekt címe kötelező';
    else if (formData.title.length < 5) newErrors.title = 'A cím legalább 5 karakter hosszú legyen';
    
    if (!formData.category) newErrors.category = 'Válassz kategóriát';
    
    if (!formData.description) newErrors.description = 'A leírás kötelező';
    else if (formData.description.length < 20) newErrors.description = 'A leírás legalább 20 karakter hosszú legyen';
    
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.location) newErrors.location = 'A helyszín megadása kötelező';
    if (!formData.budget) newErrors.budget = 'A költségkeret megadása kötelező';
    else if (formData.budget <= 0) newErrors.budget = 'A költségkeretnek pozitív számnak kell lennie';
    
    if (!formData.deadline) newErrors.deadline = 'A határidő megadása kötelező';
    else {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      if (selectedDate <= today) newErrors.deadline = 'A határidőnek a jövőben kell lennie';
    }
    
    return newErrors;
  };

  const handleNextStep = () => {
    let newErrors = {};
    if (currentStep === 1) newErrors = validateStep1();
    else if (currentStep === 2) newErrors = validateStep2();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const step1Errors = validateStep1();
    const step2Errors = validateStep2();
    
    if (Object.keys(step1Errors).length > 0 || Object.keys(step2Errors).length > 0) {
      setErrors({ ...step1Errors, ...step2Errors });
      setCurrentStep(1);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${apiUrl}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          location: formData.location,
          budget_type: formData.budgetType,
          budget: formData.budget,
          deadline: formData.deadline,
          skills: formData.skills
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Hiba történt a mentés során');
      
      // Átirányítás
      navigate('/my-projects', { 
        state: { message: 'Projekt sikeresen létrehozva!' } 
      });
    } catch (error) {
      setErrors({ form: error.message || 'Hiba történt a projekt létrehozása során' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700 flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 flex-1">
        <div className="container mx-auto max-w-4xl">
          
          {/* Vissza gomb */}
          <Link to="/dashboard" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-all duration-300">
            <FaArrowLeft className="mr-2" />
            Vissza a dashboardra
          </Link>

          {/* Fejléc */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
              Új projekt létrehozása
            </h1>
            <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">
              Add meg a projekt részleteit, és találd meg a megfelelő drónpilótát.
            </p>
          </div>

          {/* Progress bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>1</div>
              <div className={`flex-1 h-1 mx-2 ${
                currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            </div>
            <div className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>2</div>
              <div className={`flex-1 h-1 mx-2 ${
                currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            </div>
            <div className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>3</div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-all duration-700">
            
            {errors.form && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{errors.form}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
          {/* 1. lépés: Alapadatok */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Projekt címe <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border ${
                        errors.title ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                      } rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white`}
                      placeholder="Pl. Drónfotózás ingatlanhoz - 10 ingatlan"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Kategória <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                          className={`p-3 border rounded-lg text-center transition-all duration-300 ${
                            formData.category === cat.id
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                          }`}
                        >
                          <span className="text-2xl mb-1 block">{cat.icon}</span>
                          <span className="text-xs font-medium text-gray-900 dark:text-white">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Részletes leírás <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="6"
                      value={formData.description}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border ${
                        errors.description ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                      } rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white`}
                      placeholder="Írd le részletesen, hogy milyen munkára van szükséged..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Minimum 20 karakter. Add meg a pontos helyszínt, időpontot és elvárásokat.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                    >
                      Tovább a részletekhez →
                    </button>
                  </div>
                </div>
              )}

          {/* 2. lépés: Részletek */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaMapMarkerAlt className="inline mr-1 text-gray-400" />
                      Helyszín <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border ${
                        errors.location ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                      } rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white`}
                      placeholder="Pl. Budapest, XIII. kerület"
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="budgetType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FaMoneyBillWave className="inline mr-1 text-gray-400" />
                        Költségkeret típusa
                      </label>
                      <select
                        id="budgetType"
                        name="budgetType"
                        value={formData.budgetType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                      >
                        <option value="fix">Fix összeg</option>
                        <option value="hourly">Óradíj</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {formData.budgetType === 'fix' ? 'Összeg (Ft)' : 'Óradíj (Ft/óra)'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        min="0"
                        step="1"
                        className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border ${
                          errors.budget ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                        } rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white`}
                        placeholder="0"
                      />
                      {errors.budget && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.budget}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaCalendar className="inline mr-1 text-gray-400" />
                      Jelentkezési határidő <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="deadline"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border ${
                        errors.deadline ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                      } rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white`}
                    />
                    {errors.deadline && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.deadline}</p>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                    >
                      ← Vissza
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                    >
                      Tovább az áttekintéshez →
                    </button>
                  </div>
                </div>
              )}

          {/* 3. lépés: Áttekintés */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaTag className="inline mr-1 text-gray-400" />
                      Szükséges készségek
                    </label>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.skillInput}
                        onChange={(e) => setFormData(prev => ({ ...prev, skillInput: e.target.value }))}
                        onKeyPress={handleKeyPress}
                        placeholder="Adj meg egy készséget..."
                        className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                      >
                        <FaPlus />
                      </button>
                    </div>

                    {formData.category && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Javasolt készségek:</p>
                        <div className="flex flex-wrap gap-2">
                          {suggestedSkills[formData.category]?.map((skill, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                if (!formData.skills.includes(skill)) {
                                  setFormData(prev => ({
                                    ...prev,
                                    skills: [...prev.skills, skill]
                                  }));
                                }
                              }}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                            >
                              + {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Összefoglaló */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Projekt összefoglaló</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Cím:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formData.title}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Kategória:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {categories.find(c => c.id === formData.category)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Helyszín:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formData.location}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Költségkeret:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formData.budget} Ft {formData.budgetType === 'fix' ? '(fix)' : '/óra'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Határidő:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formData.deadline}</span>
                      </div>
                      {formData.skills.length > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Készségek:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formData.skills.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                    >
                      ← Vissza
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`px-8 py-3 bg-blue-600 text-white rounded-lg font-medium transition-all duration-300 ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-lg'
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Létrehozás...
                        </span>
                      ) : (
                        'Projekt létrehozása'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateProject;