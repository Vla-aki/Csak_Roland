import React, { useState, useEffect, useRef } from 'react';
import { FaCommentDots, FaTimes, FaPaperPlane, FaArrowLeft, FaExternalLinkAlt, FaSmile, FaDownload, FaStar, FaCheckCircle, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';

const FloatingChat = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const prevMsgCount = useRef(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileLightboxImage, setProfileLightboxImage] = useState(null);

  // Partnerek lekérése
  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/messages/chats`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      
      if (data.success) {
        setChats(data.chats);
      }
    } catch (error) { console.error(error); }
  };

  // Üzenetek lekérése
  const fetchMessages = async (otherId) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/messages/${otherId}`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch (error) { console.error(error); }
  };

  // Kapcsolatok betöltése
  useEffect(() => {
    if (user && isOpen && !activeChat) fetchContacts();
  }, [user, isOpen, activeChat]);

  // Chat frissítése
  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.id);
      const interval = setInterval(() => fetchMessages(activeChat.id), 3000);
      return () => clearInterval(interval);
    }
  }, [activeChat]);

  // Automatikus görgetés
  useEffect(() => {
    if (messages.length > prevMsgCount.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMsgCount.current = messages.length;
  }, [messages]);

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

  // Üzenet elküldése
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ receiverId: activeChat.id, message: messageInput.trim() })
      });
      const data = await res.json();
      if(data.success) {
        setMessages(prev => [...prev, data.message]);
        setMessageInput('');
      }
    } catch(e) { console.error(e); }
  };

  const formatMessageText = (text, isMe) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(/^https?:\/\//)) {
          const isImage = /\.(jpeg|jpg|gif|png|webp|bmp|svg)(\?.*)?$/i.test(part);
          const isVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(part);
          
        if (isImage) {
          return (
              <img key={i} src={part} alt="Csatolmány" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLightboxImage(part); }} className="max-w-full max-h-48 rounded-lg cursor-zoom-in hover:opacity-90 transition-opacity object-cover relative z-10" />
            );
          }
          if (isVideo) {
            return (
              <video key={i} src={part} controls preload="metadata" className="max-w-full max-h-48 rounded-lg object-contain relative z-10" onClick={(e) => e.stopPropagation()} />
          );
        }
        return (
          <a key={i} href={part} target="_blank" rel="noreferrer" className={`underline break-all ${isMe ? 'text-blue-200 hover:text-white' : 'text-blue-600 dark:text-blue-400 hover:text-blue-800'}`}>{part}</a>
        );
      }
      return part;
    });
  };

  // Jogosultság ellenőrzés
  if (!user) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start">
      
      {/* Chat ablak */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-80 h-[26rem] mb-4 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-left">
          
          {/* Fejléc */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center shadow-md z-10">
            {activeChat ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setActiveChat(null)} className="hover:bg-blue-700 p-1.5 rounded transition-colors"><FaArrowLeft size={14} /></button>
                <span className="font-semibold text-sm truncate cursor-pointer hover:underline" onClick={() => handleOpenProfile(activeChat.id)}>
                  {activeChat.name}
                </span>
              </div>
            ) : (
              <span className="font-semibold text-sm pl-2">Üzenetek (Munkatársak)</span>
            )}
            <div className="flex items-center gap-1">
              <button onClick={() => { setIsOpen(false); navigate('/messages'); }} className="hover:bg-blue-700 p-1.5 rounded transition-colors" title="Teljes képernyős nézet">
                <FaExternalLinkAlt size={12} />
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1.5 rounded transition-colors">
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Üzenetek */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
            {!activeChat ? (
              <div className="p-2 space-y-1">
                {chats.length === 0 ? (
              <p className="text-center text-sm text-gray-500 mt-6 px-4">Még nincsenek üzeneteid. Írj egy megbízónak a munkák keresése oldalon!</p>
                ) : (
              [...chats].sort((a, b) => {
                // Olvasatlan üzenetek előre sorolása
                if (a.unread > 0 && b.unread === 0) return -1;
                if (a.unread === 0 && b.unread > 0) return 1;
                return 0;
              }).map(chat => (
                <button key={chat.id} onClick={() => setActiveChat(chat)} className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-left ${chat.unread > 0 ? 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                  <div className="relative flex-shrink-0">
                    <img src={chat.image} className="w-10 h-10 rounded-full shadow-sm object-cover" alt="" />
                    {chat.unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className={`text-sm truncate ${chat.unread > 0 ? 'font-bold text-blue-700 dark:text-blue-400' : 'font-bold text-gray-900 dark:text-white'}`}>{chat.name}</p>
                    </div>
                    <p className={`text-xs truncate ${chat.unread > 0 ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      {chat.lastMessage || 'Kattints a megtekintéshez...'}
                    </p>
                  </div>
                </button>
              ))
                )}
              </div>
            ) : (
              <div className="p-3 space-y-3 flex flex-col justify-end min-h-full">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl text-sm shadow-sm ${msg.senderId === 'me' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'} ${/^https?:\/\/[^\s]+\.(jpeg|jpg|gif|png|webp|bmp|svg|mp4|webm|ogg|mov)(\?.*)?$/i.test(msg.text.trim()) ? 'p-1' : 'p-2.5'}`}>
                      <div className="whitespace-pre-wrap break-words">{formatMessageText(msg.text, msg.senderId === 'me')}</div>
                      <div className={`text-[10px] mt-1 pr-1 text-right ${msg.senderId === 'me' ? 'text-blue-200' : 'text-gray-500'}`}>{msg.time}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Beviteli mező */}
          {activeChat && (
            <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2 items-center">
              <div className="relative">
                <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-gray-400 hover:text-blue-600 transition-colors p-1">
                  <FaSmile size={20} />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-full left-0 mb-2 z-50 shadow-xl rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <EmojiPicker 
                      onEmojiClick={(emojiObject) => { setMessageInput(prev => prev + emojiObject.emoji); setShowEmojiPicker(false); }}
                      theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                      searchPlaceHolder="Keresés..."
                      width={300}
                      height={350}
                      lazyLoadEmojis={true}
                    />
                  </div>
                )}
              </div>
              <input type="text" value={messageInput} onChange={e => setMessageInput(e.target.value)} placeholder="Írj üzenetet..." className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <button type="submit" disabled={!messageInput.trim()} className="w-9 h-9 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors">
                <FaPaperPlane size={13} className="-ml-0.5" />
              </button>
            </form>
          )}
        </div>
      )}

      {/* Lebegő gomb */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl shadow-blue-600/50 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      >
        {isOpen ? <FaTimes size={24} /> : <FaCommentDots size={24} />}
        {!isOpen && chats.some(c => c.unread > 0) && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"></span>
        )}
      </button>
    </div>
  );
};

export default FloatingChat;