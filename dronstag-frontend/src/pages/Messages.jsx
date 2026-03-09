// src/pages/Messages.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPaperPlane, FaEllipsisV, FaImage, FaPaperclip, FaSmile, FaCheckCircle, FaClock } from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../contexts/AuthContext';

const Messages = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Chat lista (mock)
  const chats = [
    {
      id: 1,
      name: 'Kovács Péter',
      role: 'Pilóta',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      lastMessage: 'Szia! Elküldtem az ajánlatomat a projektedre.',
      lastMessageTime: '10:45',
      unread: 2,
      online: true,
      verified: true,
      project: 'Drónfotózás ingatlanhoz'
    },
    {
      id: 2,
      name: 'Ingatlan.com Zrt.',
      role: 'Megbízó',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      lastMessage: 'Rendben, akkor várjuk a képeket!',
      lastMessageTime: 'Tegnap',
      unread: 0,
      online: false,
      verified: true,
      project: 'Drónfotózás ingatlanhoz'
    },
    {
      id: 3,
      name: 'Nagy Eszter',
      role: 'Pilóta',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      lastMessage: 'Mikor lenne megfelelő az időpont?',
      lastMessageTime: 'Tegnap',
      unread: 0,
      online: true,
      verified: true,
      project: 'Ipari csarnok ellenőrzése'
    },
    {
      id: 4,
      name: 'Szabó István',
      role: 'Pilóta',
      image: 'https://randomuser.me/api/portraits/men/45.jpg',
      lastMessage: 'Köszönöm a lehetőséget!',
      lastMessageTime: '2026.03.05.',
      unread: 0,
      online: false,
      verified: true,
      project: 'Mezőgazdasági terület térképezés'
    },
    {
      id: 5,
      name: 'Kiss Anna',
      role: 'Pilóta',
      image: 'https://randomuser.me/api/portraits/women/63.jpg',
      lastMessage: 'Elküldtem a szerződéstervezetet.',
      lastMessageTime: '2026.03.04.',
      unread: 1,
      online: false,
      verified: true,
      project: 'Esküvői drónvideó'
    },
    {
      id: 6,
      name: 'Győri Ipari Park',
      role: 'Megbízó',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      lastMessage: 'Rendben, várjuk a részletes jelentést.',
      lastMessageTime: '2026.03.03.',
      unread: 0,
      online: false,
      verified: true,
      project: 'Ipari csarnok ellenőrzése'
    }
  ];

  // Üzenetek a kiválasztott chathez (mock)
  const messages = selectedChat ? [
    {
      id: 1,
      senderId: 1,
      text: 'Szia! Láttam a projektedet, és szívesen elvállalnám a munkát.',
      time: '10:30',
      status: 'read'
    },
    {
      id: 2,
      senderId: 'me',
      text: 'Szia! Örülök, hogy jelentkeztél. Mikor tudnál kezdeni?',
      time: '10:32',
      status: 'read'
    },
    {
      id: 3,
      senderId: 1,
      text: 'Már a jövő héten tudnék kezdeni. 10 ingatlanról van szó, ugye?',
      time: '10:35',
      status: 'read'
    },
    {
      id: 4,
      senderId: 'me',
      text: 'Igen, 10 budapesti ingatlan. Milyen áron dolgozol?',
      time: '10:38',
      status: 'read'
    },
    {
      id: 5,
      senderId: 1,
      text: 'Szia! Elküldtem az ajánlatomat a projektedre.',
      time: '10:45',
      status: 'delivered'
    },
    {
      id: 6,
      senderId: 1,
      text: 'Nézd meg kérlek, és ha bármi kérdésed van, nyugodtan írj!',
      time: '10:46',
      status: 'delivered'
    }
  ] : [];

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      // TODO: API hívás
      console.log('Üzenet elküldve:', messageInput);
      setMessageInput('');
    }
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 h-[calc(100vh-200px)]">
        <div className="container mx-auto max-w-7xl h-full">
          
          {/* Üzenetek konténer */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 h-full flex overflow-hidden transition-all duration-700">
            
            {/* Bal oldal - Chat lista */}
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

              {/* Chat lista */}
              <div className="flex-1 overflow-y-auto">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 border-b border-gray-100 dark:border-gray-700 ${
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
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {chat.name}
                          </h3>
                          {chat.verified && (
                            <span className="text-blue-600 dark:text-blue-400 text-xs">✓</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {chat.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {chat.role} • {chat.project}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Jobb oldal - Chat ablak */}
            {selectedChat ? (
              <div className="flex-1 flex flex-col">
                {/* Chat fejléc */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
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
                      } p-3`}>
                        <p className="text-sm">{message.text}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                          message.senderId === 'me' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          <span>{message.time}</span>
                          {message.senderId === 'me' && getStatusIcon(message.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Üzenet bevitel */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                    >
                      <FaImage />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                    >
                      <FaPaperclip />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                    >
                      <FaSmile />
                    </button>
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