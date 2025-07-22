import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Calendar, Phone, Mail, ArrowLeft, Share2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

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
  owner: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
}

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPet(id);
    }
  }, [id]);

  const fetchPet = async (petId: string) => {
    try {
      const response = await axios.get(`/api/pets/${petId}`);
      setPet(response.data);
    } catch (error) {
      console.error('Error fetching pet:', error);
      toast.error('Pet not found');
      navigate('/pets');
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptionInterest = async () => {
    if (!user) {
      toast.error('Please login to express interest');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`/api/pets/${pet?._id}/interest`);
      toast.success('Interest expressed! The owner will be notified.');
      setShowContactInfo(true);
    } catch (error) {
      toast.error('Failed to express interest');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Adopt ${pet?.name}`,
          text: `Check out ${pet?.name}, a ${pet?.breed} looking for a loving home!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pet not found</h2>
          <button
            onClick={() => navigate('/pets')}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/pets')}
          className="flex items-center text-gray-600 hover:text-pink-500 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Listings
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Image Gallery */}
            <div className="md:w-1/2">
              <div className="relative">
                <img
                  src={pet.images[currentImageIndex] || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'}
                  alt={pet.name}
                  className="w-full h-96 md:h-full object-cover"
                />
                {pet.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {pet.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pet Information */}
            <div className="md:w-1/2 p-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <Share2 className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <span className="font-medium mr-2">Breed:</span>
                  <span>{pet.breed}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium mr-2">Age:</span>
                  <span>{pet.age} year{pet.age !== 1 ? 's' : ''} old</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium mr-2">Gender:</span>
                  <span className="capitalize">{pet.gender}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium mr-2">Size:</span>
                  <span className="capitalize">{pet.size}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{pet.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>Listed {new Date(pet.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Health & Behavior Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {pet.vaccinated && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    ✓ Vaccinated
                  </span>
                )}
                {pet.neutered && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    ✓ Neutered/Spayed
                  </span>
                )}
                {pet.goodWithKids && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    ✓ Good with kids
                  </span>
                )}
                {pet.goodWithPets && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                    ✓ Good with other pets
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About {pet.name}</h3>
                <p className="text-gray-600 leading-relaxed">{pet.description}</p>
              </div>

              {/* Contact Information */}
              {showContactInfo && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Owner:</span>
                      <span>{pet.owner.name}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <a href={`mailto:${pet.owner.email}`} className="text-pink-500 hover:underline">
                        {pet.owner.email}
                      </a>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <a href={`tel:${pet.owner.phone}`} className="text-pink-500 hover:underline">
                        {pet.owner.phone}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {user?.id !== pet.owner._id && (
                <button
                  onClick={handleAdoptionInterest}
                  className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Heart className="h-5 w-5" />
                  <span>I'm Interested in Adopting</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;