// src/services/api.js
const API_URL = 'http://localhost:5000/api';

// Segédfüggvény a fetch-hez
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Hiba történt');
    }
    
    return data;
  } catch (error) {
    console.error('API hiba:', error);
    throw error;
  }
};

export const api = {
  // Auth végpontok
  login: (email, password, role) => 
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role })
    }),
    
  register: (userData) => 
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
    
  // Projektek
  getProjects: () => apiCall('/projects'),
  getProject: (id) => apiCall(`/projects/${id}`),
  createProject: (projectData) => 
    apiCall('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    }),
    
  // Ajánlatok
  getBids: (projectId) => apiCall(`/projects/${projectId}/bids`),
  createBid: (projectId, bidData) => 
    apiCall(`/projects/${projectId}/bids`, {
      method: 'POST',
      body: JSON.stringify(bidData)
    }),
    
  // Felhasználók
  getProfile: () => apiCall('/users/profile'),
  updateProfile: (userData) => 
    apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    }),
    
  getFreelancers: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/users/freelancers${params ? `?${params}` : ''}`);
  }
};

export default api;