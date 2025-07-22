import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Heart, MapPin, Calendar } from 'lucide-react';
import axios from 'axios';

interface Pet {
  _id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  gender: string;
  size: string;
  location: string;
  description: string;
  images: string[];
  vaccinated: boolean;
  neutered: boolean;
  goodWithKids: boolean;
  goodWithPets: boolean;
  createdAt: string;
}

const PetListings = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    breed: '',
    age: '',
    size: '',
    location: ''
  });

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    filterPets();
  }, [pets, searchTerm, filters]);

  const fetchPets = async () => {
    try {
      const response = await axios.get('/api/pets');
      setPets(response.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPets = () => {
    let filtered = pets;

    if (searchTerm) {
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(pet => {
          if (key === 'age') {
            const ageRange = value.split('-');
            if (ageRange.length === 2) {
              return pet.age >= parseInt(ageRange[0]) && pet.age <= parseInt(ageRange[1]);
            }
            return pet.age.toString() === value;
          }
          return pet[key as keyof Pet]?.toString().toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    setFilteredPets(filtered);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading adorable pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Pet</h1>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
              placeholder="Search by name, breed, or type..."
            />
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">All Types</option>
                <option value="dog">Dogs</option>
                <option value="cat">Cats</option>
                <option value="bird">Birds</option>
                <option value="rabbit">Rabbits</option>
                <option value="other">Other</option>
              </select>

              <input
                type="text"
                value={filters.breed}
                onChange={(e) => handleFilterChange('breed', e.target.value)}
                placeholder="Breed"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              />

              <select
                value={filters.age}
                onChange={(e) => handleFilterChange('age', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">All Ages</option>
                <option value="0-1">Puppy/Kitten (0-1 year)</option>
                <option value="1-3">Young (1-3 years)</option>
                <option value="3-7">Adult (3-7 years)</option>
                <option value="7-15">Senior (7+ years)</option>
              </select>

              <select
                value={filters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">All Sizes</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>

              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="Location"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredPets.length} of {pets.length} pets
          </p>
        </div>

        {/* Pet Grid */}
        {filteredPets.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No pets found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <Link
                key={pet._id}
                to={`/pets/${pet._id}`}
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
                    <span className="text-sm text-gray-500 capitalize">{pet.gender}</span>
                  </div>
                  <p className="text-gray-600 mb-2">{pet.breed} • {pet.age} year{pet.age !== 1 ? 's' : ''} old</p>
                  <div className="flex items-center text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{pet.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{pet.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pet.vaccinated && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Vaccinated
                      </span>
                    )}
                    {pet.neutered && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Neutered
                      </span>
                    )}
                    {pet.goodWithKids && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        Good with kids
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Listed {new Date(pet.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetListings;