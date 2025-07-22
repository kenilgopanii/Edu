import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Upload, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

interface PetForm {
  name: string;
  type: string;
  breed: string;
  age: number;
  gender: string;
  size: string;
  location: string;
  description: string;
  vaccinated: boolean;
  neutered: boolean;
  goodWithKids: boolean;
  goodWithPets: boolean;
}

const AddPet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PetForm>();

  React.useEffect(() => {
    if (!user) {
      toast.error('Please login to add a pet');
      navigate('/login');
    }
  }, [user, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PetForm) => {
    try {
      const formData = new FormData();
      
      // Append pet data
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      // Append images
      images.forEach(image => {
        formData.append('images', image);
      });

      const response = await axios.post('/api/pets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Pet added successfully!');
      navigate(`/pets/${response.data._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add pet');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Add a Pet for Adoption</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Name *
                </label>
                <input
                  {...register('name', { required: 'Pet name is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter pet's name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  {...register('type', { required: 'Pet type is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">Select type</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="other">Other</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breed *
                </label>
                <input
                  {...register('breed', { required: 'Breed is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter breed"
                />
                {errors.breed && (
                  <p className="mt-1 text-sm text-red-600">{errors.breed.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age (years) *
                </label>
                <input
                  {...register('age', { 
                    required: 'Age is required',
                    min: { value: 0, message: 'Age must be positive' },
                    max: { value: 30, message: 'Age must be realistic' }
                  })}
                  type="number"
                  min="0"
                  max="30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter age"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  {...register('gender', { required: 'Gender is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size *
                </label>
                <select
                  {...register('size', { required: 'Size is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">Select size</option>
                  <option value="small">Small (0-25 lbs)</option>
                  <option value="medium">Medium (26-60 lbs)</option>
                  <option value="large">Large (61-100 lbs)</option>
                  <option value="extra-large">Extra Large (100+ lbs)</option>
                </select>
                {errors.size && (
                  <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                {...register('location', { required: 'Location is required' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter city/location"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                placeholder="Tell us about this pet's personality, habits, and what kind of home would be best..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Health & Behavior */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Health & Behavior</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    {...register('vaccinated')}
                    type="checkbox"
                    className="rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Vaccinated</span>
                </label>

                <label className="flex items-center">
                  <input
                    {...register('neutered')}
                    type="checkbox"
                    className="rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Neutered/Spayed</span>
                </label>

                <label className="flex items-center">
                  <input
                    {...register('goodWithKids')}
                    type="checkbox"
                    className="rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Good with kids</span>
                </label>

                <label className="flex items-center">
                  <input
                    {...register('goodWithPets')}
                    type="checkbox"
                    className="rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Good with other pets</span>
                </label>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos (Max 5)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="images" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload photos
                      </span>
                      <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/pets')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adding Pet...' : 'Add Pet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPet;