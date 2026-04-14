import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaStar, FaMoneyBillWave, FaMapMarkerAlt, FaClock, FaCreditCard, FaLock, FaSpinner, FaTimes, FaCommentDots, FaFileContract } from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../contexts/AuthContext';

const ContractWorkspace = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [paymentStep, setPaymentStep] = useState(1);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileLightboxImage, setProfileLightboxImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        const contractRes = await fetch(`${apiUrl}/contracts/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        const contractData = await contractRes.json();
        
        if (contractData.success) {
          setContract(contractData.contract);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user.role]);

  // Fizetés szimuláció
  useEffect(() => {
    if (paymentStep === 2) {
      setTimeout(() => {
        handleCompleteContract();
      }, 2500);
    }
  }, [paymentStep]);

  const handleCompleteContract = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/contracts/${id}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(reviewData)
      });
      const data = await res.json();
      if (data.success) {
      setPaymentStep(3);
        setTimeout(() => { setShowReviewModal(false); navigate('/my-projects'); }, 2500);
      } else {
        setReviewError(data.message || 'Hiba történt a lezárás során.');
      }
    } catch(e) { 
      console.error(e); 
      setReviewError('Hálózati hiba történt.');
    }
  };

  const handleOpenProfile = async (userId) => {
    setLoadingProfile(true);
    setShowProfileModal(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/user/${userId}`);
      const data = await res.json();
      if (data.success) {
        setProfileData(data.user);
      }
    } catch(e) { console.error(e); }
    setLoadingProfile(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!contract) return <div className="pt-32 text-center text-gray-500">Szerződés nem található.</div>;

  const isCustomer = user.role === 'customer';
  const otherPartyName = isCustomer ? contract.pilotName : contract.customerName;
  const otherPartyImage = isCustomer ? contract.pilotImage : contract.customerImage;
  const otherPartyRole = isCustomer ? 'Drónpilóta' : 'Megbízó';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-700 flex flex-col">
      <Navbar />
      <div className="pt-24 pb-16 px-4 flex-1 flex flex-col">
        <div className="container mx-auto max-w-4xl flex-1 flex flex-col">
          <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-400 mb-6 w-fit transition-colors">
            <FaArrowLeft className="mr-2" /> Vissza
          </button>

          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <FaFileContract className="text-blue-600 text-2xl" />
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{contract.projectTitle}</h1>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Szerződés azonosító: #HHC-{contract.id}-2026</p>
                </div>
                <div>
                  {contract.status === 'completed' ? (
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2"><FaCheckCircle /> Sikeresen lezárva</span>
                  ) : (
                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2"><FaClock /> Folyamatban</span>
                  )}
                </div>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Projekt leírása</h3>
                <p className="text-gray-600 dark:text-gray-300">{contract.projectDescription}</p>
              </div>
            </div>
              
            {/* Grid for Details and Partner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Details Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-3">Részletek és Díjazás</h3>
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                        <FaMoneyBillWave />
                      </div>
                      <span className="font-medium">Szerződéses összeg</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{parseInt(contract.amount).toLocaleString('hu-HU')} Ft</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <FaMapMarkerAlt />
                      </div>
                      <span className="font-medium">Helyszín</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{contract.projectLocation}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                        <FaClock />
                      </div>
                      <span className="font-medium">Határidő</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{new Date(contract.projectDeadline).toLocaleDateString('hu-HU')}</span>
                  </div>
                </div>
              </div>

              {/* Partner Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-3">Szerződő Partner</h3>
                <div className="flex items-center gap-4 mb-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 -ml-2 rounded-xl transition-colors" onClick={() => handleOpenProfile(isCustomer ? contract.driver_id : contract.customer_id)}>
                  <img 
                    src={otherPartyImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherPartyName)}&background=2563eb&color=fff`} 
                    alt={otherPartyName} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 shadow-sm"
                  />
                  <div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white hover:text-blue-600 transition-colors">{otherPartyName}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wider">{otherPartyRole}</p>
                  </div>
                </div>
                
                <div className="mt-auto pt-4">
                  <Link 
                    to="/messages"
                    state={{ newChatUser: { id: isCustomer ? contract.driver_id : contract.customer_id, name: otherPartyName, image: otherPartyImage, verified: true, role: isCustomer ? 'driver' : 'customer' } }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-medium transition-colors"
                  >
                    <FaCommentDots /> Üzenet küldése
                  </Link>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 text-center">
              {isCustomer ? (
                contract.status === 'active' ? (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">A munka elkészült?</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Ha a pilóta átadta a munkát és elégedett vagy az eredménnyel, zárd le a projektet és indítsd el a kifizetést.</p>
                    <button onClick={() => setShowReviewModal(true)} className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto text-lg">
                      <FaCheckCircle /> Munka lezárása és Fizetés
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                      <FaCheckCircle />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">A projekt sikeresen lezárult</h3>
                    <p className="text-gray-500 dark:text-gray-400">A kifizetés megtörtént, a pilóta megkapta az értékelésedet. Köszönjük, hogy a HoverHire-t választottad!</p>
                  </div>
                )
              ) : (
                contract.status === 'active' ? (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">A projekt jelenleg aktív</h3>
                    <p className="text-gray-500 dark:text-gray-400">Végezd el a munkát a megbeszéltek szerint. Ha elkészültél, jelezd a megbízónak üzenetben, aki ezután le tudja zárni a projektet és elindítja a kifizetést.</p>
                  </div>
                ) : (
                  <div>
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                      <FaCheckCircle />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Gratulálunk, a munka lezárult!</h3>
                    <p className="text-gray-500 dark:text-gray-400">A megbízó elfogadta a munkát és a kifizetés összege ({parseInt(contract.amount).toLocaleString('hu-HU')} Ft) jóváírásra került a fiókodban.</p>
                  </div>
                )
              )}
            </div>

          </div>
        </div>
      </div>
      <Footer />

      {/* Értékelés Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            {paymentStep === 1 ? (
              <>
                <div className="flex items-center gap-3 mb-4"><FaLock className="text-blue-600 text-2xl" /><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Biztonságos Fizetés</h2></div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-6 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium flex justify-between items-center">
                    <span>Fizetendő összeg:</span>
                    <span className="text-2xl font-bold">{parseInt(contract.amount).toLocaleString('hu-HU')} Ft</span>
                  </p>
                </div>

                {/* Bankkártya űrlap */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Kártyaszám</label>
                    <div className="relative">
                      <FaCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 pr-4 py-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Lejárat</label>
                      <input type="text" placeholder="HH/ÉÉ" className="w-full px-4 py-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">CVC</label>
                      <input type="text" placeholder="123" className="w-full px-4 py-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-5 mb-6">
                  <p className="text-sm font-bold text-gray-900 dark:text-white mb-3 text-center">Értékeld a pilóta munkáját:</p>
                  <div className="flex gap-2 mb-4 justify-center bg-gray-50 dark:bg-gray-700/50 py-3 rounded-lg border border-gray-100 dark:border-gray-600">
                    {[1,2,3,4,5].map(star => (
                      <FaStar key={star} className={`text-3xl cursor-pointer hover:scale-110 transition-all ${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} onClick={() => setReviewData({...reviewData, rating: star})} />
                    ))}
                  </div>
                  <textarea placeholder="Írj egy rövid véleményt a közös munkáról (opcionális)..." value={reviewData.comment} onChange={e => setReviewData({...reviewData, comment: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" rows="3"></textarea>
                </div>

                {reviewError && (
                  <div className="mb-6 p-3 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-sm font-medium">
                    {reviewError}
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowReviewModal(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 transition-colors">Mégse</button>
                  <button onClick={() => setPaymentStep(2)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2">
                    <FaLock /> Fizetés Jóváhagyása
                  </button>
                </div>
              </>
            ) : paymentStep === 2 ? (
              <div className="text-center py-10">
                <FaSpinner className="animate-spin text-5xl text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tranzakció feldolgozása</h3>
                <p className="text-gray-500 dark:text-gray-400">Kérjük, ne zárd be az ablakot...</p>
              </div>
            ) : (
              <div className="text-center py-10">
                <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sikeres fizetés!</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">A projekt lezárult, a pilóta hamarosan megkapja a díját.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profil Megtekintése Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all" onClick={() => setShowProfileModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            {loadingProfile ? (
                <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Profil betöltése...</p>
                </div>
            ) : profileData ? (
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profil megtekintése</h2>
                    <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                      <FaTimes size={24} />
                    </button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
                    <img src={profileData.image} alt={profileData.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-blue-50 dark:border-blue-900/30 object-cover shadow-md" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{profileData.name}</h3>
                        {profileData.verified && <FaCheckCircle className="text-blue-600 dark:text-blue-400" title="Ellenőrzött" />}
                      </div>
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                        {profileData.role === 'driver' ? 'Drónpilóta' : 'Megbízó'}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400 text-lg" />
                          <span className="font-bold text-gray-900 dark:text-white">{profileData.rating || '5.0'}</span>
                          <span className="text-sm text-gray-500">({profileData.reviews || 0} értékelés)</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                          {profileData.completedProjects || 0} sikeres projekt
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                        <FaMapMarkerAlt /> {profileData.location || 'Ismeretlen'}
                        <span className="mx-2">•</span>
                        <FaClock /> Tag: {profileData.memberSince}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {profileData.bio && (
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Bemutatkozás</h4>
                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{profileData.bio}</p>
                      </div>
                    )}

                    {profileData.role === 'driver' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Óradíj</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{profileData.hourlyRate || 0} Ft/óra</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Elérhetőség</p>
                            <p className="font-bold text-green-600 dark:text-green-400">
                                {profileData.availability === 'full_time' ? 'Teljes munkaidő' : 
                                 profileData.availability === 'part_time' ? 'Részmunkaidő' : 
                                 profileData.availability === 'unavailable' ? 'Nem elérhető' : 'Ismeretlen'}
                            </p>
                          </div>
                        </div>

                        {profileData.skills && profileData.skills.length > 0 && (
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Szakterületek</h4>
                            <div className="flex flex-wrap gap-2">
                              {profileData.skills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full border border-blue-200 dark:border-blue-800/50">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {profileData.portfolio && profileData.portfolio.length > 0 && (
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Portfólió</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {profileData.portfolio.map((img, i) => (
                            <img key={i} src={img} alt="Portfolio" className="w-full h-32 object-cover rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-zoom-in" onClick={(e) => { e.stopPropagation(); setProfileLightboxImage(img); }} />
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
            ) : (
                <div className="p-8 text-center text-red-500 font-medium">Hiba történt a profil betöltésekor.</div>
            )}
          </div>
        </div>
      )}

      {/* Profil Portfólió Kép Nagyító */}
      {profileLightboxImage && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md transition-all"
          style={{ zIndex: 10001 }}
          onClick={(e) => { e.stopPropagation(); setProfileLightboxImage(null); }}
        >
          <div className="relative bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -top-4 -right-4 flex gap-2" style={{ zIndex: 10002 }}>
              <button 
                className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-xl border-2 border-white dark:border-gray-800 transition-colors"
                onClick={(e) => { e.stopPropagation(); setProfileLightboxImage(null); }}
                title="Bezárás"
              >
                <FaTimes size={16} />
              </button>
            </div>
            <img src={profileLightboxImage} alt="Nagyított portfólió kép" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};
export default ContractWorkspace;