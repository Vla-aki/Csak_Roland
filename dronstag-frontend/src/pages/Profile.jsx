// src/pages/Profile.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera, FaSave, FaStar, FaCheckCircle, FaAward, FaClock, FaEuroSign } from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profil adatok (mock)
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Kovács Péter',
    email: user?.email || 'peter.kovacs@example.com',
    phone: '+36 30 123 4567',
    location: 'Budapest, Magyarország',
    bio: 'Profi drónpilóta 8 év tapasztalattal. DJI Inspire 2, Mavic 3, hőkamera. Ingatlanfotózás, ipari ellenőrzés, rendezvények specialista.',
    skills: ['légifotó', 'ingatlan', 'ipari ellenőrzés', 'hőkamera', 'videózás', 'DJI'],
    languages: ['magyar (anyanyelvi)', 'angol (középfok)'],
    hourlyRate: 45,
    availability: 'azonnal',
    verified: true,
    memberSince: '2020. március',
    completedJobs: 187,
    rating: 4.9,
    reviews: 234
  });

  const [portfolio, setPortfolio] = useState([
    { id: 1, title: 'Luxus villa fotózás', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400', category: 'ingatlan' },
    { id: 2, title: 'Ipari csarnok ellenőrzés', image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400', category: 'ipari' },
    { id: 3, title: 'Balaton légifotó', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', category: 'táj' },
    { id: 4, title: 'Esküvői felvétel', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400', category: 'rendezvény' },
    { id: 5, title: 'Mezőgazdasági terület', image: 'https://images.unsplash.com/photo-1464226180484-05c6aa40e80a?w=400', category: 'mezőgazdaság' },
    { id: 6, title: 'Napelempark diagnosztika', image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400', category: 'ipari' }
  ]);

  const [reviews, setReviews] = useState([
    {
      id: 1,
      clientName: 'Ingatlan.com Zrt.',
      clientImage: 'https://randomuser.me/api/portraits/men/1.jpg',
      rating: 5,
      date: '2026.02.15.',
      comment: 'Kiváló munka, pontos, gyors. A képek lenyűgözőek lettek. Mindenképp újra dolgozunk együtt.',
      projectTitle: 'Drónfotózás ingatlanhoz - 10 ingatlan'
    },
    {
      id: 2,
      clientName: 'Győri Ipari Park',
      clientImage: 'https://randomuser.me/api/portraits/men/2.jpg',
      rating: 5,
      date: '2026.01.20.',
      comment: 'Profi felszerelés, részletes szakvélemény. Pontosan a megbeszélt határidőre elkészült.',
      projectTitle: 'Ipari csarnok ellenőrzése'
    },
    {
      id: 3,
      clientName: 'Kiskunsági Mezőgazdasági Zrt.',
      clientImage: 'https://randomuser.me/api/portraits/women/3.jpg',
      rating: 4,
      date: '2025.12.10.',
      comment: 'Jó minőségű NDVI elemzés, részletes jelentés. Ajánlom!',
      projectTitle: 'Mezőgazdasági terület térképezés'
    }
  ]);

  const [certificates, setCertificates] = useState([
    { id: 1, name: 'Drónpilóta jogosítvány', issuer: 'Nemzeti Közlekedési Hatóság', date: '2025', file: 'cert1.pdf' },
    { id: 2, name: 'Hőkamerás tanúsítvány', issuer: 'FLIR Academy', date: '2024', file: 'cert2.pdf' },
    { id: 3, name: 'Munkavédelmi oktatás', issuer: 'Munkavédelmi Hivatal', date: '2024', file: 'cert3.pdf' }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: API hívás
    setIsEditing(false);
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FaStar key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
    ));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          
          {/* Profil fejléc */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-all duration-700">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Profilkép */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-all duration-300">
                  <FaCamera className="text-sm" />
                </button>
              </div>

              {/* Alapadatok */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        {profileData.name}
                      </h1>
                      {profileData.verified && (
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm rounded-full flex items-center gap-1">
                          <FaCheckCircle /> Ellenőrzött
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        {renderStars(Math.floor(profileData.rating))}
                        <span className="ml-1 font-medium">{profileData.rating}</span>
                        <span className="text-gray-500 dark:text-gray-500">({profileData.reviews} értékelés)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="text-gray-400" />
                        <span>Tag {profileData.memberSince}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaCheckCircle className="text-green-500" />
                        <span>{profileData.completedJobs} sikeres projekt</span>
                      </div>
                    </div>
                  </div>
                  
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                    >
                      Profil szerkesztése
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center gap-2"
                      >
                        <FaSave /> Mentés
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                      >
                        Mégse
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Gyors statisztika */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{profileData.completedJobs}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Elvégzett munka</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{profileData.rating}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Értékelés</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{profileData.hourlyRate} €</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Óradíj</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{profileData.skills.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Szakértelem</p>
              </div>
            </div>
          </div>

          {/* Tabok */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                activeTab === 'profile'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Profil adatok
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                activeTab === 'portfolio'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Portfólió ({portfolio.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                activeTab === 'reviews'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Értékelések ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                activeTab === 'certificates'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Tanúsítványok
            </button>
          </div>

          {/* Profil adatok tab */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Személyes adatok</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaUser className="inline mr-2" />
                    Teljes név
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profileData.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaEnvelope className="inline mr-2" />
                    Email cím
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profileData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaPhone className="inline mr-2" />
                    Telefonszám
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profileData.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Helyszín
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profileData.location}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bemutatkozás
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">{profileData.bio}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Szakértelem</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {profileData.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaEuroSign className="inline mr-2" />
                      Óradíj
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="hourlyRate"
                        value={profileData.hourlyRate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData.hourlyRate} €/óra</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Elérhetőség
                    </label>
                    {isEditing ? (
                      <select
                        name="availability"
                        value={profileData.availability}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                      >
                        <option value="azonnal">Azonnal</option>
                        <option value="1 hét">1 héten belül</option>
                        <option value="2 hét">2 héten belül</option>
                        <option value="1 hónap">1 hónapon belül</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData.availability}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Portfólió tab */}
          {activeTab === 'portfolio' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Portfólió</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
                  + Új kép hozzáadása
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolio.map((item) => (
                  <div key={item.id} className="group relative overflow-hidden rounded-lg aspect-square">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <p className="text-white font-medium">{item.title}</p>
                        <p className="text-white/80 text-sm">{item.category}</p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
                      <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
                        ✎
                      </button>
                      <button className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700">
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Értékelések tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Értékelések</h2>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-yellow-400">{profileData.rating}</span>
                  <div className="flex">{renderStars(Math.floor(profileData.rating))}</div>
                  <span className="text-gray-500 dark:text-gray-400">({profileData.reviews} értékelés)</span>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <img src={review.clientImage} alt={review.clientName} className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{review.clientName}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{review.projectTitle}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{review.date}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button className="text-blue-600 dark:text-blue-400 hover:underline">
                  Összes értékelés megtekintése (234)
                </button>
              </div>
            </div>
          )}

          {/* Tanúsítványok tab */}
          {activeTab === 'certificates' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tanúsítványok</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
                  + Új hozzáadása
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaAward className="text-3xl text-yellow-500" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{cert.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{cert.issuer} • {cert.date}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 text-sm">
                      Letöltés
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;