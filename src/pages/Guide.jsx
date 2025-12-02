import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import DisposalGuide from '../components/DisposalGuide';
import { useApp } from '../context/AppContext';

const Guide = () => {
  const location = useLocation();
  const { currentClassification } = useApp();
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    } else if (currentClassification?.category) {
      setSelectedCategory(currentClassification.category);
    } else {
      setSelectedCategory('Recyclable');
    }
  }, [location.state, currentClassification]);

  const categories = ['Recyclable', 'Wet', 'Dry'];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Disposal Guidelines
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn the best practices for disposing different types of waste responsibly
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {selectedCategory && <DisposalGuide category={selectedCategory} />}
      </div>
    </div>
  );
};

export default Guide;
