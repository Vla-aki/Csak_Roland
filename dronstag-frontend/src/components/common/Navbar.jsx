import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaDrone, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to={`/${user.role}`} className="flex items-center space-x-2">
            <FaDrone className="text-primary-600 text-2xl" />
            <span className="font-bold text-xl">DroneTag</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user.role === 'customer' ? (
              <>
                <Link to="/customer" className="nav-link">Dashboard</Link>
                <Link to="/customer/projects" className="nav-link">My Projects</Link>
                <Link to="/customer/projects/create" className="btn-primary">
                  Post Project
                </Link>
              </>
            ) : (
              <>
                <Link to="/drone" className="nav-link">Dashboard</Link>
                <Link to="/drone/projects" className="nav-link">Available Projects</Link>
                <Link to="/drone/my-bids" className="nav-link">My Bids</Link>
                <Link to="/drone/contracts" className="nav-link">Contracts</Link>
              </>
            )}

            <div className="flex items-center space-x-3 ml-4 pl-4 border-l">
              <FaUser className="text-gray-600" />
              <span className="text-sm">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;