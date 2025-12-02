import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Recycle, Droplet, Trash2, Leaf, CheckCircle, Lightbulb } from 'lucide-react';
import { getDisposalGuide } from '../utils/api';

const DisposalGuide = ({ category }) => {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuide = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDisposalGuide(category);
        setGuide(data);
      } catch (err) {
        console.error('Error fetching disposal guide:', err);
        setError(err.message || 'Failed to load disposal guide');
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchGuide();
    }
  }, [category]);

  const getIcon = (iconName) => {
    const icons = {
      recycle: Recycle,
      leaf: Leaf,
      trash: Trash2,
      droplet: Droplet,
    };
    return icons[iconName] || Trash2;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-red-600 font-semibold mb-2">Failed to Load Disposal Guide</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No guide available</p>
      </div>
    );
  }

  const Icon = getIcon(guide.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: guide.color + '20' }}
          >
            <Icon className="w-8 h-8" style={{ color: guide.color }} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{guide.category}</h2>
            <p className="text-gray-600">{guide.description}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-800">Disposal Tips</h3>
            </div>
            <div className="space-y-3">
              {guide.tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 bg-green-50 p-4 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{tip}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Examples</h3>
            <div className="flex flex-wrap gap-3">
              {guide.examples.map((example, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-4 py-2 bg-white rounded-full shadow-md text-gray-700 font-medium"
                >
                  {example}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl shadow-xl p-8 text-white"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Leaf className="w-8 h-8" />
          <h3 className="text-2xl font-bold">Environmental Impact</h3>
        </div>
        <p className="text-green-50">
          By properly segregating your {guide.category.toLowerCase()} waste, you're contributing
          to a cleaner environment and helping reduce landfill burden. Every small action counts
          towards building a sustainable future for our planet.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default DisposalGuide;
