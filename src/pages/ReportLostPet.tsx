import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Upload, X, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

interface LostPetForm {
  name: string;
  type: string;
  breed: string;
  color: string;
  size: string;
  location: string;
  lastSeen: string;
  description: string;
  status: 'lost' | 'found';
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

const ReportLostPet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<LostPetForm>({
    defaultValues: {
      contactName: user?.name || '',
      contactEmail: user?.email || '',
      status: 'lost'
    }
  });

  const status = watch('status');

  React.useEffect(() => {
    if (!user) {
      toast.error('Please login to report a lost/found pet');
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

  const onSubmit = async (data: LostPetForm) => {
    try {
      const formData = new FormData();
      
      // Append form data
      Object.entries(data).forEach(([key, value]) => {
        if (key.startsWith('contact')) {
          // Handle contact info separately
          return;
        }
        formData.append(key, value.toString());
      });

      // Append contact info as nested object
      formData.append('contactInfo[name]', data.contactName);
      formData.append('contactInfo[phone]', data.contactPhone);
      formData.append('contactInfo[email]', data.contactEmail);

      // Append images
      images.forEach(image => {
        formData.append('images', image);
      });

      await axios.post('/api/lost-pets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(`${status === 'lost' ? 'Lost' : 'Found'} pet reported successfully!`);
      navigate('/lost-found');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to report pet');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <AlertCircle className="h-8 w-8 text-pink-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Report Lost/Found Pet</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    {...register('status')}
                    type="radio"
                    value="lost"
                    className="text-pink-500 focus:ring-pink-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Lost Pet</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('status')}
                    type="radio"
                    value="found"
                    className="text-pink-500 focus:ring-pink-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Found Pet</span>
                </label>
              </div>
            </div>

            {/* Pet Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Name *
                </label>
                <input
                  {...register('name', { required: 'Pet name is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  placeholder={status === 'lost' ? "Your pet's name" : "Name if known, or 'Unknown'"}
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
                  placeholder="Enter breed or 'Mixed' if unsure"
                />
                {errors.breed && (
                  <p className="mt-1 text-sm text-red-600">{errors.breed.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color *
                </label>
                <input
                  {...register('color', { required: 'Color is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Primary color(s)"
                />
                {errors.color && (
                  <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
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
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="extra-large">Extra Large</option>
                </select>
                {errors.size && (
                  <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {status === 'lost' ? 'Last Seen Date *' : 'Date Found *'}
                </label>
                <input
                  {...register('lastSeen', { required: 'Date is required' })}
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
                {errors.lastSeen && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastSeen.message}</p>
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
                placeholder={status === 'lost' ? "Where was your pet last seen?" : "Where did you find this pet?"}
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
                placeholder={status === 'lost' 
                  ? "Describe your pet's appearance, behavior, and any distinguishing features..."
                  : "Describe the pet's appearance, behavior, and where you found them..."
                }
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    {...register('contactName', { required: 'Name is required' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  />
                  {errors.contactName && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    {...register('contactPhone', { required: 'Phone number is required' })}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  />
                  {errors.contactPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    {...register('contactEmail', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  />
                  {errors.contactEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
                  )}
                </div>
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
                onClick={() => navigate('/lost-found')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Reporting...' : `Report ${status === 'lost' ? 'Lost' : 'Found'} Pet`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportLostPet;