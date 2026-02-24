import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaStar,
  FaPlay,
  FaChevronDown
} from 'react-icons/fa';

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: "🚀",
      title: "Lightning Fast",
      description: "Post a job and get matched with top drone pilots in minutes"
    },
    {
      icon: "📸",
      title: "Professional Quality",
      description: "All pilots are vetted and rated by our community"
    },
    {
      icon: "🗺️",
      title: "Global Coverage",
      description: "Find drone operators anywhere in the world"
    },
    {
      icon: "🛡️",
      title: "Secure Payments",
      description: "Your money is held securely until the job is complete"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Event Planner",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "HoverHire made finding a drone photographer for my wedding so easy! The pilot was professional and the footage was breathtaking.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Real Estate Agent",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "I've used HoverHire for over 20 property listings. The quality and reliability are unmatched in the industry.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Drone Pilot",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "As a pilot, HoverHire has connected me with amazing clients and helped grow my business exponentially.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Section with Parallax Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1508614589041-895b88991e3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `scale(${1 + scrollY * 0.001})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-purple-900/90"></div>
        </div>

        {/* Floating Drones Animation - Using emoji */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="relative w-full h-full">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute text-white/20 text-6xl float"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + i * 15}%`,
                  animationDelay: `${i * 0.5}s`,
                  transform: `rotate(${i * 45}deg)`,
                }}
              >
                🚁
              </div>
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center text-white px-4 slide-in-left">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="block">Hover</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-400">Hire</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            The future of drone services is here. Connect with professional pilots worldwide for any aerial need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full font-semibold text-lg overflow-hidden hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300"
            >
              <span className="relative z-10">Get Started Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <button 
              onClick={() => setShowVideo(true)}
              className="px-8 py-4 bg-white/20 backdrop-blur-md rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:bg-white/30 transition-all duration-300"
            >
              <FaPlay className="text-sm" /> Watch Demo
            </button>
          </div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <FaChevronDown className="text-3xl text-white/70" />
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setShowVideo(false)}>
          <div className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              Close ✕
            </button>
            <div className="relative pt-[56.25%]">
              <iframe 
                className="absolute inset-0 w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="HoverHire Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 fade-in">
            Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">HoverHire?</span>
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            We're revolutionizing the drone service industry with cutting-edge technology and a community of trusted professionals.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 text-5xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Animated Numbers */}
      <section className="py-24 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="slide-in-left">
              <div className="text-6xl font-bold mb-2">10K+</div>
              <div className="text-xl opacity-90">Completed Missions</div>
            </div>
            <div className="slide-in-right" style={{ animationDelay: '0.2s' }}>
              <div className="text-6xl font-bold mb-2">500+</div>
              <div className="text-xl opacity-90">Certified Pilots</div>
            </div>
            <div className="slide-in-left" style={{ animationDelay: '0.4s' }}>
              <div className="text-6xl font-bold mb-2">50+</div>
              <div className="text-xl opacity-90">Countries Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            How <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">HoverHire</span> Works
          </h2>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 transform -translate-y-1/2 hidden lg:block"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
              {[1, 2, 3].map((step, index) => (
                <div key={step} className="relative text-center group">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-indigo-500/50">
                    {step}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    {index === 0 && "Post Your Project"}
                    {index === 1 && "Get Matched"}
                    {index === 2 && "Launch & Monitor"}
                  </h3>
                  <p className="text-gray-600">
                    {index === 0 && "Describe your drone needs and set your budget"}
                    {index === 1 && "Receive bids from qualified pilots near you"}
                    {index === 2 && "Track your project in real-time from anywhere"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            What Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Community</span> Says
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4 border-2 border-indigo-600"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Drone flying"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-purple-900/90"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Take Flight?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers and professional pilots on HoverHire today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register?type=customer"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Hire a Pilot
            </Link>
            <Link 
              to="/register?type=driver"
              className="px-8 py-4 bg-white/20 backdrop-blur-md rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-300"
            >
              Become a Pilot
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;