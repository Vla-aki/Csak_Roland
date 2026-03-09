// src/pages/customer/ProjectBids.jsx
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaEuroSign, FaStar, FaCheckCircle, FaTimesCircle, FaUserCircle, FaCalendar, FaComment } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const ProjectBids = () => {
  const { projectId } = useParams();
  const [sortBy, setSortBy] = useState('price');
  const [selectedBid, setSelectedBid] = useState(null);

  // Projekt adatok (mock)
  const project = {
    id: projectId,
    title: "Drónfotózás ingatlanhoz - 10 ingatlan",
    budget: 250,
    budgetType: "fix",
    location: "Budapest",
    deadline: "2026.03.15.",
    description: "Budapesti luxusingatlanok fotózásához keresek profi drónost. 10 különböző helyszín, 20-30 kép/ingatlan."
  };

  // Ajánlatok (mock)
  const bids = [
    {
      id: 201,
      pilotName: "Kovács Péter",
      pilotRating: 4.9,
      pilotReviews: 234,
      pilotImage: "https://randomuser.me/api/portraits/men/32.jpg",
      pilotVerified: true,
      amount: 230,
      amountType: "fix",
      estimatedDays: 3,
      submittedDate: "2026.03.02.",
      message: "8 éves tapasztalat ingatlanfotózásban, professzionális felszereléssel (DJI Inspire 2, Mavic 3). Gyors utómunka, 24 órán belül képek átadása. Referenciáim között számos luxusingatlan található.",
      skills: ["légifotó", "ingatlan", "DJI", "utómunka"],
      status: "pending",
      featured: true
    },
    {
      id: 202,
      pilotName: "Nagy Eszter",
      pilotRating: 5.0,
      pilotReviews: 178,
      pilotImage: "https://randomuser.me/api/portraits/women/44.jpg",
      pilotVerified: true,
      amount: 260,
      amountType: "fix",
      estimatedDays: 4,
      submittedDate: "2026.03.01.",
      message: "Kreatív megközelítés, egyedi kompozíciók. 5+ év tapasztalat, 300+ sikeres projekt. Külön figyelmet fordítok az ingatlanok legelőnyösebb szögeinek megtalálására.",
      skills: ["légifotó", "kreatív", "ingatlan", "kompozíció"],
      status: "pending",
      featured: false
    },
    {
      id: 203,
      pilotName: "Szabó István",
      pilotRating: 4.8,
      pilotReviews: 156,
      pilotImage: "https://randomuser.me/api/portraits/men/45.jpg",
      pilotVerified: true,
      amount: 210,
      amountType: "fix",
      estimatedDays: 5,
      submittedDate: "2026.03.03.",
      message: "Versenyképes áron vállalom a munkát. 6 éve foglalkozom drónozással, megbízható, pontos munka. A képeket szerkesztve, retusálva adom át.",
      skills: ["légifotó", "ingatlan", "retusálás"],
      status: "pending",
      featured: false
    },
    {
      id: 204,
      pilotName: "Kiss Anna",
      pilotRating: 5.0,
      pilotReviews: 145,
      pilotImage: "https://randomuser.me/api/portraits/women/63.jpg",
      pilotVerified: true,
      amount: 280,
      amountType: "fix",
      estimatedDays: 3,
      submittedDate: "2026.03.02.",
      message: "Luxusingatlanokra specializálódtam, komplett fotócsomagot kínálok drónnal + földi géppel. 4K videó is készíthető igény esetén.",
      skills: ["légifotó", "luxus", "ingatlan", "videó"],
      status: "accepted",
      featured: true
    }
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'accepted':
        return <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs rounded-full">Elfogadva</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-xs rounded-full">Elutasítva</span>;
      default:
        return <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 text-xs rounded-full">Elbírálás alatt</span>;
    }
  };

  const sortedBids = [...bids].sort((a, b) => {
    if (sortBy === 'price') return a.amount - b.amount;
    if (sortBy === 'rating') return b.pilotRating - a.pilotRating;
    if (sortBy === 'date') return new Date(b.submittedDate) - new Date(a.submittedDate);
    return 0;
  });

  const handleAcceptBid = (bidId) => {
    // TODO: API hívás
    console.log('Ajánlat elfogadva:', bidId);
  };

  const handleRejectBid = (bidId) => {
    // TODO: API hívás
    console.log('Ajánlat elutasítva:', bidId);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          
          {/* Vissza gomb */}
          <Link to="/my-projects" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-all duration-300">
            <FaArrowLeft className="mr-2" />
            Vissza a projektjeimhez
          </Link>

          {/* Projekt infó */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-all duration-700">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{project.location}</span>
                  <span className="text-gray-600 dark:text-gray-400">Költségkeret: {project.budget} € / {project.budgetType === 'fix' ? 'fix' : 'óra'}</span>
                  <span className="text-gray-600 dark:text-gray-400">Határidő: {project.deadline}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{bids.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">ajánlat érkezett</p>
              </div>
            </div>
          </div>

          {/* Szűrők és rendezés */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-all duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Rendezés:</span>
                <button
                  onClick={() => setSortBy('price')}
                  className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 ${
                    sortBy === 'price' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Ár szerint
                </button>
                <button
                  onClick={() => setSortBy('rating')}
                  className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 ${
                    sortBy === 'rating' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Értékelés szerint
                </button>
                <button
                  onClick={() => setSortBy('date')}
                  className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 ${
                    sortBy === 'date' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Dátum szerint
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {bids.filter(b => b.status === 'pending').length} elbírálatlan ajánlat
              </p>
            </div>
          </div>

          {/* Ajánlatok lista */}
          <div className="space-y-4">
            {sortedBids.map((bid) => (
              <div
                key={bid.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 transition-all duration-300 ${
                  bid.status === 'accepted' 
                    ? 'border-green-500 dark:border-green-500' 
                    : bid.status === 'rejected'
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Pilóta infó */}
                    <div className="lg:w-64 flex-shrink-0">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={bid.pilotImage} alt={bid.pilotName} className="w-12 h-12 rounded-full" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{bid.pilotName}</h3>
                            {bid.pilotVerified && (
                              <span className="text-blue-600 dark:text-blue-400 text-sm">✓</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-400 text-xs" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{bid.pilotRating}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">({bid.pilotReviews})</span>
                          </div>
                        </div>
                      </div>
                      {bid.featured && (
                        <div className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs rounded-full mb-2">
                          Kiemelt ajánlat
                        </div>
                      )}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <FaEuroSign className="text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">{bid.amount} €</span>
                          <span>/{bid.amountType === 'fix' ? 'fix' : 'óra'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <FaCalendar className="text-gray-400" />
                          <span>{bid.estimatedDays} munkanap</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <FaComment className="text-gray-400" />
                          <span>Benyújtva: {bid.submittedDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ajánlat részletei */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">Ajánlat részletei</h4>
                        {getStatusBadge(bid.status)}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {bid.message}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {bid.skills.map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      {/* Akciógombok */}
                      {bid.status === 'pending' && (
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() => handleAcceptBid(bid.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 text-sm flex items-center gap-2"
                          >
                            <FaCheckCircle />
                            Ajánlat elfogadása
                          </button>
                          <button
                            onClick={() => handleRejectBid(bid.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 text-sm flex items-center gap-2"
                          >
                            <FaTimesCircle />
                            Elutasítás
                          </button>
                          <Link
                            to={`/messages/${bid.pilotName}`}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 text-sm"
                          >
                            Üzenet küldése
                          </Link>
                        </div>
                      )}

                      {bid.status === 'accepted' && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <p className="text-sm text-green-800 dark:text-green-200">
                              ✅ Ezt az ajánlatot elfogadtad. A pilóta értesítést kapott.
                            </p>
                            <Link
                              to={`/contract/${bid.id}`}
                              className="mt-2 inline-block text-sm text-green-600 dark:text-green-400 hover:underline"
                            >
                              Szerződés részletei →
                            </Link>
                          </div>
                        </div>
                      )}

                      {bid.status === 'rejected' && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                            <p className="text-sm text-red-800 dark:text-red-200">
                              ❌ Ezt az ajánlatot elutasítottad.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ha nincs ajánlat */}
          {bids.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <FaUserCircle className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">Még nem érkezett ajánlat erre a projektre.</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Az ajánlatok itt fognak megjelenni, amint pilóták jelentkeznek a projektedre.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectBids;