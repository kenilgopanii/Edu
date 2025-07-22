import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface LostPet {
  _id: string;
  name: string;
  type: string;
  breed: string;
  color: string;
  size: string;
  location: string;
  lastSeen: string;
  description: string;
  images: string[];
  status: 'lost' | 'found';
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
  createdAt: string;
}

const LostFound = () => {
  const [lostPets, setLostPets] = useState<LostPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLostPets();
  }, []);

  const fetchLostPets = async () => {
    try {
      const response = await axios.get('/api/lost-pets');
      setLostPets(response.data);
    } catch (error) {
      console.error('Error fetching lost pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPets = lostPets.filter(pet => {
    const matchesTab = pet.status === activeTab;
    const matchesSearch = searchTerm === '' || 
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lost and found pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Lost & Found Pets</h1>
          <p className="text-lg text-gray-600 mb-6">
            Help reunite pets with their families or find their new homes
          </p>
          <Link
            to="/report-lost"
            className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition-colors inline-flex items-center space-x-2"
          >
            <AlertCircle className="h-5 w-5" />
            <span>Report Lost/Found Pet</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('lost')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'lost'
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:text-pink-500'
              }`}
            >
              Lost Pets
            </button>
            <button
              onClick={() => setActiveTab('found')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'found'
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:text-pink-500'
              }`}
            >
              Found Pets
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
            placeholder="Search by name, breed, or location..."
          />
        </div>

        {/* Results */}
        {filteredPets.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              {activeTab === 'lost' ? (
                <AlertCircle className="h-16 w-16 text-gray-300 mx-auto" />
              ) : (
                <CheckCircle className="h-16 w-16 text-gray-300 mx-auto" />
              )}
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No {activeTab} pets found
            </h3>
            <p className="text-gray-600">
              {activeTab === 'lost' 
                ? "No lost pets reported in your area yet."
                : "No found pets reported in your area yet."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <div
                key={pet._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={pet.images[0] || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'}
                    alt={pet.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{pet.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pet.status === 'lost' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {pet.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{pet.breed} • {pet.color}</p>
                  <div className="flex items-center text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{pet.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{pet.description}</p>
                  <div className="flex items-center text-gray-400 text-sm mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {pet.status === 'lost' ? 'Last seen' : 'Found'} {new Date(pet.lastSeen).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">Contact: {pet.contactInfo.name}</p>
                    <div className="flex space-x-2">
                      <a
                        href={`tel:${pet.contactInfo.phone}`}
                        className="flex-1 bg-pink-500 text-white text-center py-2 px-4 rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
                      >
                        Call
                      </a>
                      <a
                        href={`mailto:${pet.contactInfo.email}`}
                        className="flex-1 bg-gray-500 text-white text-center py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                      >
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LostFound;