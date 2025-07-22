import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, User, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="text-xl font-bold text-gray-800">PetConnect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/pets" className="text-gray-700 hover:text-pink-500 transition-colors">
              Adopt Pets
            </Link>
            <Link to="/lost-found" className="text-gray-700 hover:text-pink-500 transition-colors">
              Lost & Found
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/add-pet"
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Pet</span>
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-pink-500 transition-colors">
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-pink-500 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-pink-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-pink-500"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                to="/pets"
                className="block px-3 py-2 text-gray-700 hover:text-pink-500"
                onClick={() => setIsOpen(false)}
              >
                Adopt Pets
              </Link>
              <Link
                to="/lost-found"
                className="block px-3 py-2 text-gray-700 hover:text-pink-500"
                onClick={() => setIsOpen(false)}
              >
                Lost & Found
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/add-pet"
                    className="block px-3 py-2 text-gray-700 hover:text-pink-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Add Pet
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-gray-700 hover:text-pink-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-pink-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-700 hover:text-pink-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-gray-700 hover:text-pink-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;