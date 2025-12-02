import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Award, Star } from 'lucide-react';
import { getBadge } from '../utils/api';

const StreakBadge = ({ streak }) => {
  const badge = getBadge(streak.count);

  const getBadgeConfig = (badgeName) => {
    switch (badgeName) {
      case 'Zero-Waste Hero':
        return {
          icon: Award,
          color: 'from-yellow-400 to-orange-500',
          textColor: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          description: 'Master of sustainability!',
        };
      case 'Green Warrior':
        return {
          icon: Star,
          color: 'from-green-400 to-emerald-500',
          textColor: 'text-green-600',
          bgColor: 'bg-green-100',
          description: 'Eco champion in action!',
        };
      default:
        return {
          icon: Flame,
          color: 'from-blue-400 to-cyan-500',
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-100',
          description: 'Starting your eco journey!',
        };
    }
  };

  const config = getBadgeConfig(badge.name);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8"
    >
      <div className="text-center space-y-4 sm:space-y-6">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            repeatDelay: 1,
          }}
          className="flex justify-center"
        >
          <div className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg`}>
            <Icon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" />
          </div>
        </motion.div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Your Badge</h2>
          <div className={`inline-block px-4 sm:px-6 py-2 ${config.bgColor} rounded-full mb-2`}>
            <span className={`text-base sm:text-lg font-semibold ${config.textColor}`}>{badge.name}</span>
          </div>
          <p className="text-sm sm:text-base text-gray-600">{config.description}</p>
        </div>

        <div className="flex items-center justify-center space-x-3 pt-4">
          <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
          <div className="text-left">
            <div className="text-3xl sm:text-4xl font-bold text-gray-800">{streak.count}</div>
            <div className="text-xs sm:text-sm text-gray-600">Day Streak</div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-800">
                {streak.count >= 30 ? '✓' : '30'}
              </div>
              <div className="text-xs text-gray-600">Hero</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-800">
                {streak.count >= 10 ? '✓' : '10'}
              </div>
              <div className="text-xs text-gray-600">Warrior</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-800">
                {streak.count >= 1 ? '✓' : '1'}
              </div>
              <div className="text-xs text-gray-600">Rookie</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StreakBadge;
