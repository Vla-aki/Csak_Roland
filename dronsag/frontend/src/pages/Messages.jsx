// src/pages/Messages.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaPaperPlane, FaEllipsisV, FaImage, FaPaperclip, FaSmile, FaCheckCircle, FaClock, FaDownload, FaTimes, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../contexts/AuthContext';
import EmojiPicker from 'emoji-picker-react';

const Messages = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const prevMsgCount = useRef(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileLightboxImage, setProfileLightboxImage] = useState(null);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/messages/chats`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        let fetchedChats = data.chats;

        // Ha érkezett új beszélgetőpartner (pl. a Pilóták keresése oldalról)
        if (location.state?.newChatUser) {
          const newUser = location.state.newChatUser;
          const existingChat = fetchedChats.find(c => c.id === newUser.id);

          if (!existingChat) {
            fetchedChats = [{
              id: newUser.id,
              name: newUser.name,
              role: newUser.role === 'customer' ? 'Megbízó' : 'Pilóta',
              image: newUser.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.name)}&background=2563eb&color=fff`,
              lastMessage: 'Új beszélgetés...',
              lastMessageTime: '',
              unread: 0,
              online: false,
              verified: newUser.verified,
              project: ''
            }, ...fetchedChats];
          }

          setSelectedChat(fetchedChats.find(c => c.id === newUser.id));
          
          // Töröljük a state-et, hogy oldalfrissítésnél ne ugorjon vissza feleslegesen
          navigate(location.pathname, { replace: true, state: {} });
        }

        setChats(fetchedChats);
      }
    } catch (error) { console.error(error); }
  };

  const fetchMessages = async (otherId) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/messages/${otherId}`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (messages.length > prevMsgCount.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMsgCount.current = messages.length;
  }, [messages]);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageInput.trim() && selectedChat) {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ receiverId: selectedChat.id, message: messageInput.trim() })
        });
        const data = await res.json();
        if(data.success) {
          setMessages(prev => [...prev, data.message]);
          setMessageInput('');
          fetchChats();
        }
      } catch(e) { console.error(e); }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('image', file); // A backend ezen a néven várja a fájlt
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const res = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
        const fileUrl = baseUrl + data.url;
        setMessageInput(prev => prev + (prev ? ' ' : '') + fileUrl);
      }
    } catch (error) { console.error('Fájlfeltöltési hiba:', error); }
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

  const getStatusIcon = (status) => {
    switch(status) {
      case 'read':
        return <FaCheckCircle className="text-blue-600 text-xs" />;
      case 'delivered':
        return <FaCheckCircle className="text-gray-400 text-xs" />;
      default:
        return <FaClock className="text-gray-400 text-xs" />;
    }
  };

  const formatMessageText = (text, isMe) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(/^https?:\/\//)) {
          const isImage = /\.(jpeg|jpg|gif|png|webp|bmp|svg)(\?.*)?$/i.test(part);
          const isVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(part);
          
        if (isImage) {
          return (
              <img key={i} src={part} alt="Csatolmány" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLightboxImage(part); }} className="max-w-full max-h-64 rounded-lg cursor-zoom-in hover:opacity-90 transition-opacity object-cover relative z-10" />
            );
          }
          if (isVideo) {
            return (
              <video key={i} src={part} controls preload="metadata" className="max-w-full max-h-64 rounded-lg object-contain relative z-10" onClick={(e) => e.stopPropagation()} />
          );
        }
        return (
          <a key={i} href={part} target="_blank" rel="noreferrer" className={`underline break-all ${isMe ? 'text-blue-200 hover:text-white' : 'text-blue-600 dark:text-blue-400 hover:text-blue-800'}`}>{part}</a>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 h-[calc(100vh-200px)]">
        <div className="container mx-auto max-w-7xl h-full">
          
          {/* Konténer */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 h-full flex overflow-hidden transition-all duration-700">
            
            {/* Chat lista */}
            <div className="w-full md:w-96 border-r border-gray-200 dark:border-gray-700 flex flex-col">
              {/* Kereső */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Keresés..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Partnerek */}
              <div className="flex-1 overflow-y-auto">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 border-b border-gray-100 dark:border-gray-700 text-left ${
                      selectedChat?.id === chat.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="relative">
                      <img src={chat.image} alt={chat.name} className="w-12 h-12 rounded-full" />
                      {chat.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <h3 className="font-bold text-gray-900 dark:text-white truncate">
                            {chat.name}
                          </h3>
                          {chat.verified && (
                            <span className="text-blue-600 dark:text-blue-400 text-xs flex-shrink-0">✓</span>
                          )}
                          <span className="hidden sm:inline-block px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-[10px] rounded uppercase font-bold flex-shrink-0">
                            {chat.role}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2 flex-shrink-0">
                          {chat.lastMessageTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${chat.unread > 0 ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <span className="ml-2 flex-shrink-0 w-5 h-5 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-full">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat ablak */}
            {selectedChat ? (
              <div className="flex-1 flex flex-col">
                {/* Fejléc */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleOpenProfile(selectedChat.id)}>
                    <div className="relative">
                      <img src={selectedChat.image} alt={selectedChat.name} className="w-10 h-10 rounded-full" />
                      {selectedChat.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                          {selectedChat.name}
                        </h2>
                        {selectedChat.verified && (
                          <span className="text-blue-600 dark:text-blue-400 text-xs">✓</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedChat.role} • {selectedChat.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
                    <FaEllipsisV />
                  </button>
                </div>

                {/* Üzenetek */}

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
                </div>
            ) : (
                <div className="p-8 text-center text-red-500 font-medium">Hiba történt a profil betöltésekor.</div>
            )}
          </div>
        </div>
      )}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.senderId !== 'me' && (
                        <img src={selectedChat.image} alt="" className="w-8 h-8 rounded-full mr-2 self-end" />
                      )}
                      <div className={`max-w-[70%] ${
                        message.senderId === 'me'
                          ? 'bg-blue-600 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-lg rounded-tr-lg rounded-br-lg'
                      } ${/^https?:\/\/[^\s]+\.(jpeg|jpg|gif|png|webp|bmp|svg|mp4|webm|ogg|mov)(\?.*)?$/i.test(message.text.trim()) ? 'p-1' : 'p-3'} shadow-sm`}>
                        <div className="text-sm whitespace-pre-wrap break-words">{formatMessageText(message.text, message.senderId === 'me')}</div>
                        <div className={`flex items-center justify-end gap-1 mt-1 px-1 text-xs ${
                          message.senderId === 'me' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          <span>{message.time}</span>
                          {message.senderId === 'me' && getStatusIcon(message.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Beviteli mező */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <input type="file" ref={imageInputRef} onChange={handleFileUpload} accept="image/*,video/mp4,video/quicktime,video/webm" className="hidden" />
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                    
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                    >
                      <FaImage />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                    >
                      <FaPaperclip />
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                      >
                        <FaSmile />
                      </button>
                      {showEmojiPicker && (
                        <div className="absolute bottom-full left-0 mb-2 z-50 shadow-xl rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                          <EmojiPicker 
                            onEmojiClick={(emojiObject) => { setMessageInput(prev => prev + emojiObject.emoji); setShowEmojiPicker(false); }}
                            theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                            searchPlaceHolder="Keresés..."
                            lazyLoadEmojis={true}
                          />
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Írj egy üzenetet..."
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      disabled={!messageInput.trim()}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        messageInput.trim()
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <FaPaperPlane className="text-4xl text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Válassz egy beszélgetést
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Kattints egy chatre a bal oldalon az üzenetek megtekintéséhez.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Messages;