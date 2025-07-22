import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, Users, Shield, ArrowRight } from 'lucide-react';

const Home = () => {
  const stats = [
    { number: '10,000+', label: 'Pets Adopted' },
    { number: '5,000+', label: 'Happy Families' },
    { number: '500+', label: 'Pets Found' },
    { number: '24/7', label: 'Support' }
  ];

  const features = [
    {
      icon: <Search className="h-8 w-8 text-pink-500" />,
      title: 'Smart Search',
      description: 'Find the perfect pet with our advanced filtering system based on breed, age, size, and location.'
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: 'Verified Listings',
      description: 'All pets and shelters are verified to ensure safe and legitimate adoptions.'
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: 'Community Support',
      description: 'Join a community of pet lovers helping each other find and care for their furry friends.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect
              <span className="text-pink-500"> Companion</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with loving pets looking for their forever homes. Every adoption saves a life
              and brings joy to your family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/pets"
                className="bg-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Heart className="h-5 w-5" />
                <span>Adopt Now</span>
              </Link>
              <Link
                to="/lost-found"
                className="bg-white text-pink-500 border-2 border-pink-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-pink-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Lost & Found</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-pink-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PetConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make pet adoption safe, easy, and joyful for everyone involved.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Join thousands of families who have found their perfect companion through PetConnect.
          </p>
          <Link
            to="/register"
            className="bg-white text-pink-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
          >
            <span>Get Started Today</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;