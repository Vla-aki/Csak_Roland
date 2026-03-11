// src/pages/Contact.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaUser, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    consent: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'A név megadása kötelező';
    }
    
    if (!formData.email) {
      newErrors.email = 'Az email cím megadása kötelező';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Érvénytelen email cím';
    }
    
    if (!formData.subject) {
      newErrors.subject = 'A tárgy megadása kötelező';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Az üzenet megadása kötelező';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Az üzenet legalább 10 karakter hosszú legyen';
    }
    
    if (!formData.consent) {
      newErrors.consent = 'El kell fogadnod az adatkezelési tájékoztatót';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    // TODO: API hívás
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        consent: false
      });
      
      // 5 másodperc után eltüntetjük a sikeres üzenetet
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="text-2xl" />,
      title: 'Székhely',
      details: ['1137 Budapest', 'Drón utca 12.', 'Magyarország']
    },
    {
      icon: <FaPhone className="text-2xl" />,
      title: 'Telefon',
      details: ['+36 30 123 4567', '+36 1 234 5678'],
      links: ['tel:+36301234567', 'tel:+3612345678']
    },
    {
      icon: <FaEnvelope className="text-2xl" />,
      title: 'Email',
      details: ['info@hoverhire.hu', 'support@hoverhire.hu'],
      links: ['mailto:info@hoverhire.hu', 'mailto:support@hoverhire.hu']
    },
    {
      icon: <FaClock className="text-2xl" />,
      title: 'Ügyfélszolgálat',
      details: ['Hétfő - Péntek: 9:00 - 18:00', 'Szombat: 10:00 - 14:00', 'Vasárnap: Zárva']
    }
  ];

  const faqItems = [
    {
      question: 'Hogyan találhatok megbízható pilótát?',
      answer: 'Minden pilóta alapos ellenőrzésen esik át, rendelkeznek a szükséges engedélyekkel és biztosítással. Értékeléseik alapján könnyen kiválaszthatod a számodra legmegfelelőbb szakembert.'
    },
    {
      question: 'Mennyibe kerül a regisztráció?',
      answer: 'A regisztráció mindenki számára ingyenes! Csak a sikeres projektek után számolunk fel jutalékot.'
    },
    {
      question: 'Hogyan történik a fizetés?',
      answer: 'A fizetés biztonságosan, a platformon keresztül történik. A pénz addig letétben marad, amíg mindkét fél elégedetten le nem zárja a projektet.'
    },
    {
      question: 'Milyen drónos munkákra lehet jelentkezni?',
      answer: 'Számos kategóriában találsz projekteket: légifotózás, videózás, ipari ellenőrzés, térképezés, szállítás és még sok más.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700">
      <Navbar />
      
      <div className="pt-24 pb-16">
        {/* Hero szekció - sima kocka, hullám nélkül */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 px-4 text-white transition-all duration-700">
          <div className="container mx-auto max-w-7xl text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700">
              Kapcsolat
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90 transition-all duration-700">
              Keress minket bizalommal, ha bármilyen kérdésed van. Ügyfélszolgálatunk készséggel áll rendelkezésedre.
            </p>
          </div>
        </section>

        {/* Sikeres küldés üzenet */}
        {isSubmitted && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in transition-all duration-700">
            <FaCheckCircle className="text-2xl" />
            <span>Köszönjük üzeneted! Válaszunkkal hamarosan jelentkezünk.</span>
          </div>
        )}

        {/* Kontakt információk és űrlap */}
        <section className="py-20 px-4 bg-white dark:bg-gray-800 transition-all duration-700">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Bal oldal - Kontakt info */}
              <div className="transition-all duration-700">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-700">
                  Írj nekünk!
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 transition-all duration-700">
                  Bármilyen kérdésed van a szolgáltatással kapcsolatban, vagy segítségre van szükséged, töltsd ki az űrlapot, és munkatársunk hamarosan felveszi veled a kapcsolatot.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex gap-4 transition-all duration-700">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 transition-all duration-700">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 transition-all duration-700">
                          {info.title}
                        </h3>
                        {info.details.map((detail, i) => (
                          info.links?.[i] ? (
                            <a
                              key={i}
                              href={info.links[i]}
                              className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                            >
                              {detail}
                            </a>
                          ) : (
                            <p key={i} className="text-gray-600 dark:text-gray-400 transition-all duration-700">
                              {detail}
                            </p>
                          )
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Térkép helyettesítő */}
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center transition-all duration-700">
                  <div className="text-center">
                    <FaMapMarkerAlt className="text-4xl text-gray-400 mx-auto mb-2 transition-all duration-700" />
                    <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">1137 Budapest, Drón utca 12.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 transition-all duration-700">(A térkép itt jelenik meg)</p>
                  </div>
                </div>
              </div>

              {/* Jobb oldal - Kapcsolatfelvételi űrlap */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 transition-all duration-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-700">
                  Küldj üzenetet
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Név */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-all duration-700">
                      Név <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400 transition-all duration-700" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border ${
                          errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                        } rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white transition-all duration-700`}
                        placeholder="Kovács János"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-all duration-700">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-all duration-700">
                      Email cím <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400 transition-all duration-700" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border ${
                          errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                        } rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white transition-all duration-700`}
                        placeholder="pelda@email.hu"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-all duration-700">{errors.email}</p>
                    )}
                  </div>

                  {/* Telefonszám (opcionális) */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-all duration-700">
                      Telefonszám <span className="text-gray-500 text-xs">(opcionális)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white transition-all duration-700"
                      placeholder="+36 30 123 4567"
                    />
                  </div>

                  {/* Tárgy */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-all duration-700">
                      Tárgy <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border ${
                        errors.subject ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                      } rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white transition-all duration-700`}
                    >
                      <option value="">Válassz témát</option>
                      <option value="Általános kérdés">Általános kérdés</option>
                      <option value="Technikai segítség">Technikai segítség</option>
                      <option value="Együttműködés">Együttműködés</option>
                      <option value="Pilóta jelentkezés">Pilóta jelentkezés</option>
                      <option value="Reklamáció">Reklamáció</option>
                      <option value="Egyéb">Egyéb</option>
                    </select>
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-all duration-700">{errors.subject}</p>
                    )}
                  </div>

                  {/* Üzenet */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-all duration-700">
                      Üzenet <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border ${
                        errors.message ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                      } rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-gray-900 dark:text-white transition-all duration-700`}
                      placeholder="Írd ide az üzeneted..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-all duration-700">{errors.message}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right transition-all duration-700">
                      {formData.message.length} / 500 karakter
                    </p>
                  </div>

                  {/* Adatkezelési hozzájárulás */}
                  <div>
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 transition-all duration-700"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 transition-all duration-700">
                        Hozzájárulok, hogy a HoverHire a megadott adataimat kezelje, és kapcsolatba lépjen velem. 
                        Az <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline transition-all duration-300">adatvédelmi tájékoztatót</Link> elolvastam és elfogadom.
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-all duration-700">{errors.consent}</p>
                    )}
                  </div>

                  {/* Küldés gomb */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 bg-blue-600 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      isLoading 
                        ? 'opacity-70 cursor-not-allowed' 
                        : 'hover:bg-blue-700 hover:shadow-lg'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Küldés folyamatban...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Üzenet küldése
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* GYIK szekció */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900 transition-all duration-700">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
                Gyakran Ismételt Kérdések
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 transition-all duration-700">
                Válaszok a leggyakoribb kérdésekre
              </p>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-all duration-700">
                    {item.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">
                Nem találtad meg a választ?{' '}
                <button
                  onClick={() => document.getElementById('message').focus()}
                  className="text-blue-600 dark:text-blue-400 hover:underline transition-all duration-300"
                >
                  Írj nekünk üzenetet!
                </button>
              </p>
            </div>
          </div>
        </section>

        {/* CTA szekció */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white transition-all duration-700">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 transition-all duration-700">
              Csatlakozz Te is!
            </h2>
            <p className="text-xl mb-8 opacity-90 transition-all duration-700">
              Regisztrálj most, és kezdd el használni Magyarország legnagyobb drónos piacterét.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register?role=customer"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium shadow-lg"
              >
                Megbízóként regisztrálok
              </Link>
              <Link
                to="/register?role=driver"
                className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 font-medium"
              >
                Pilótaként regisztrálok
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;