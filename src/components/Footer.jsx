import React from 'react';
import { Heart, Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white/60 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <Leaf className="w-6 h-6 text-green-600" />
            <span className="text-xl font-bold text-gray-800">EcoSort</span>
          </div>
          
          <p className="text-gray-600 text-center max-w-md">
            Empowering communities to segregate waste intelligently and build a sustainable future.
          </p>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for Planet Earth</span>
          </div>
          
          <div className="text-xs text-gray-400">
            © 2025 EcoSort. Segregate Smart, Recycle Better.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
