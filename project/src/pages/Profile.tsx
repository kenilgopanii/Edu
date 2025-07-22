import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Heart, AlertCircle, Edit, Plus } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface UserPet {
  _id: string;
  name: string;
  type: string;
  breed: string;
  images: string[];
  status: string;
  createdAt: string;
}

interface UserLostPet {
  _id: string;
  name: string;
  type: string;
  breed: string;
  status: 'lost' | 'found';
  images: string[];
  createdAt: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [userPets, setUserPets] = useState<UserPet[]>([]);
  const [userLostPets, setUserLostPets] = useState<UserLostPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pets' | 'lost-found'>('pets');

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const [petsResponse, lostPetsResponse] = await Promise.all([
        axios.get('/api/user/pets'),
        axios.get('/api/user/lost-pets')
      ]);
      
      setUserPets(petsResponse.data);
      setUserLostPets(lostPetsResponse.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please login to view your profile</h2>
          <Link
            to="/login"
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-pink-100 p-4 rounded-full">
                <User className="h-12 w-12 text-pink-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">Pet Lover & Community Member</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 text-pink-500 hover:text-pink-600 transition-colors">
              <Edit className="h-5 w-5" />
              <span>Edit Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{user.phone}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{user.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-pink-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{userPets.length}</p>
                <p className="text-gray-600">Pets Listed</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{userLostPets.length}</p>
                <p className="text-gray-600">Lost/Found Reports</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date().getFullYear() - new Date(user.createdAt || '2024-01-01').getFullYear() || 'New'}
                </p>
                <p className="text-gray-600">Member Since</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('pets')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'pets'
                    ? 'border-b-2 border-pink-500 text-pink-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                My Pet Listings ({userPets.length})
              </button>
              <button
                onClick={() => setActiveTab('lost-found')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'lost-found'
                    ? 'border-b-2 border-pink-500 text-pink-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Lost/Found Reports ({userLostPets.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'pets' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Your Pet Listings</h2>
                  <Link
                    to="/add-pet"
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Pet</span>
                  </Link>
                </div>

                {userPets.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No pets listed yet</h3>
                    <p className="text-gray-600 mb-4">Start helping pets find their forever homes!</p>
                    <Link
                      to="/add-pet"
                      className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                    >
                      Add Your First Pet
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userPets.map((pet) => (
                      <Link
                        key={pet._id}
                        to={`/pets/${pet._id}`}
                        className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <img
                          src={pet.images[0] || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'}
                          alt={pet.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1">{pet.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{pet.breed}</p>
                          <p className="text-gray-500 text-xs">
                            Listed {new Date(pet.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'lost-found' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Your Lost/Found Reports</h2>
                  <Link
                    to="/report-lost"
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Report</span>
                  </Link>
                </div>

                {userLostPets.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No reports yet</h3>
                    <p className="text-gray-600 mb-4">Help reunite pets with their families!</p>
                    <Link
                      to="/report-lost"
                      className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                    >
                      Create Your First Report
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userLostPets.map((pet) => (
                      <div
                        key={pet._id}
                        className="bg-gray-50 rounded-lg overflow-hidden"
                      >
                        <img
                          src={pet.images[0] || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'}
                          alt={pet.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{pet.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              pet.status === 'lost' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {pet.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{pet.breed}</p>
                          <p className="text-gray-500 text-xs">
                            Reported {new Date(pet.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;