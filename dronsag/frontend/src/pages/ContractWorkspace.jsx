import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPaperPlane, FaCheckCircle, FaStar, FaEuroSign, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../contexts/AuthContext';

const ContractWorkspace = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [contract, setContract] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        const [contractRes, messagesRes] = await Promise.all([
          fetch(`${apiUrl}/contracts/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/messages/contract/${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        
        const contractData = await contractRes.json();
        const messagesData = await messagesRes.json();
        
        if (contractData.success) setContract(contractData.contract);
        if (messagesData.success) setMessages(messagesData.messages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    
    // Egyszerű másodpercenkénti frissítés a chathoz (polling)
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/messages/contract/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: messageInput.trim() })
      });
      const data = await res.json();
      if(data.success) {
        setMessages(prev => [...prev, data.message]);
        setMessageInput('');
      }
    } catch(e) { console.error(e); }
  };

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
        alert('Munka sikeresen lezárva és kifizetve!');
        setShowReviewModal(false);
        navigate('/dashboard');
      } else {
        alert(data.message);
      }
    } catch(e) { console.error(e); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!contract) return <div className="pt-32 text-center text-gray-500">Szerződés nem található.</div>;

  const isCustomer = user.role === 'customer';
  const otherPartyName = isCustomer ? contract.pilotName : contract.customerName;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-700 flex flex-col">
      <Navbar />
      <div className="pt-24 pb-16 px-4 flex-1 flex flex-col">
        <div className="container mx-auto max-w-7xl flex-1 flex flex-col">
          <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-400 mb-6">
            <FaArrowLeft className="mr-2" /> Vissza
          </button>

          <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
            {/* Bal panel: Munka adatai */}
            <div className="lg:w-1/3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
              <div className="mb-6 border-b border-gray-100 dark:border-gray-700 pb-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{contract.projectTitle}</h2>
                  {contract.status === 'completed' ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Lezárva</span>
                  ) : (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Folyamatban</span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{contract.projectDescription}</p>
              </div>
              
              <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 mb-8">
                <p className="flex items-center gap-2"><FaEuroSign className="text-gray-400"/> Összeg: <strong>{parseInt(contract.amount).toLocaleString('hu-HU')} Ft</strong></p>
                <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400"/> Helyszín: <strong>{contract.projectLocation}</strong></p>
                <p className="flex items-center gap-2"><FaClock className="text-gray-400"/> Határidő: <strong>{new Date(contract.projectDeadline).toLocaleDateString('hu-HU')}</strong></p>
                <p className="flex items-center gap-2"><FaCheckCircle className="text-gray-400"/> Partner: <strong>{otherPartyName}</strong></p>
              </div>

              <div className="mt-auto">
                {isCustomer && contract.status === 'active' && (
                  <button onClick={() => setShowReviewModal(true)} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-md transition-colors">
                    Munka lezárása és Fizetés
                  </button>
                )}
              </div>
            </div>

            {/* Jobb panel: Üzenőfal */}
            <div className="lg:w-2/3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[60vh] lg:h-auto">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-xl">
                <h3 className="font-bold text-gray-900 dark:text-white">Munka Megbeszélése</h3>
                <p className="text-xs text-gray-500">Itt tudtok egyeztetni a projekt részleteiről {otherPartyName} felhasználóval.</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-3 rounded-2xl ${msg.senderId === 'me' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-[10px] mt-1 text-right ${msg.senderId === 'me' ? 'text-blue-200' : 'text-gray-500'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                <input type="text" value={messageInput} onChange={e => setMessageInput(e.target.value)} disabled={contract.status === 'completed'} placeholder={contract.status === 'completed' ? "A munka le van zárva." : "Írj üzenetet..."} className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:border-blue-500" />
                <button type="submit" disabled={!messageInput.trim() || contract.status === 'completed'} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors disabled:opacity-50"><FaPaperPlane /></button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Értékelés Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Fizetés és Értékelés</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">A gombra kattintva a letétbe helyezett összeg kifizetésre kerül a pilótának. Kérlek értékeld a munkáját!</p>
            <div className="flex justify-center gap-2 mb-6">
              {[1,2,3,4,5].map(star => (
                <FaStar key={star} className={`text-3xl cursor-pointer transition-colors ${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}`} onClick={() => setReviewData({...reviewData, rating: star})} />
              ))}
            </div>
            <textarea placeholder="Írj egy rövid véleményt a közös munkáról..." value={reviewData.comment} onChange={e => setReviewData({...reviewData, comment: e.target.value})} className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-6 resize-none" rows="3"></textarea>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowReviewModal(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 transition-colors">Mégse</button>
              <button onClick={handleCompleteContract} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">Jóváhagyás és Fizetés</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ContractWorkspace;