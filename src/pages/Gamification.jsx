import React from 'react';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import StreakBadge from '../components/StreakBadge';
import Leaderboard from '../components/Leaderboard';
import { useApp } from '../context/AppContext';

const Gamification = () => {
  const { streak } = useApp();

  const handleShare = () => {
    const text = `I've achieved a ${streak.count} day streak on EcoSort! Join me in making our planet greener. 🌱`;
    
    if (navigator.share) {
      navigator.share({
        title: 'EcoSort Achievement',
        text: text,
        url: window.location.origin,
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.origin}`);
      alert('Achievement copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            Your Achievements
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Track your progress, earn badges, and compete with other eco-warriors
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <StreakBadge streak={streak} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Leaderboard />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all"
          >
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Share Your Achievement</span>
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 sm:mt-12 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
            How It Works
          </h2>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm sm:text-base">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-1">
                  Classify Waste Items
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Upload images of waste items and get instant AI-powered classification
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm sm:text-base">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-1">
                  Build Your Streak
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Classify at least one item daily to maintain and grow your streak
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm sm:text-base">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-1">
                  Earn Badges
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Unlock special badges as you reach streak milestones
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm sm:text-base">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-1">
                  Compete Globally
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Climb the leaderboard and compete with eco-warriors worldwide
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Gamification;
