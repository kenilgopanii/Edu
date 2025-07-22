import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="text-xl font-bold">PetConnect</span>
            </div>
            <p className="text-gray-300 mb-4">
              Connecting loving families with pets in need. Every pet deserves a forever home,
              and every family deserves the joy of a furry companion.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-pink-500" />
                <span className="text-sm">info@petconnect.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-pink-500" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/pets" className="text-gray-300 hover:text-pink-500 transition-colors">Adopt Pets</a></li>
              <li><a href="/lost-found" className="text-gray-300 hover:text-pink-500 transition-colors">Lost & Found</a></li>
              <li><a href="/add-pet" className="text-gray-300 hover:text-pink-500 transition-colors">Add Pet</a></li>
              <li><a href="/report-lost" className="text-gray-300 hover:text-pink-500 transition-colors">Report Lost Pet</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-pink-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-pink-500 transition-colors">Safety Tips</a></li>
              <li><a href="#" className="text-gray-300 hover:text-pink-500 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-pink-500 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2025 PetConnect. Made with ❤️ for pets and their families.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;