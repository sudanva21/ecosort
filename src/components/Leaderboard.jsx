import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { getLeaderboardData } from '../utils/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getLeaderboardData();
        setLeaderboard(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />;
      default:
        return <span className="text-base sm:text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-105';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white shadow-md';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-md';
      default:
        return 'bg-white/70 backdrop-blur-sm';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
          <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Global Leaderboard</h2>
        </div>
        <div className="flex justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-green-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
          <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Global Leaderboard</h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
          <p className="text-red-600 font-semibold mb-2 text-sm sm:text-base">Failed to Load Leaderboard</p>
          <p className="text-red-500 text-xs sm:text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
        <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Global Leaderboard</h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {leaderboard.length === 0 ? (
          <p className="text-center text-gray-500 py-8 text-sm sm:text-base">No leaderboard data available yet</p>
        ) : (
          leaderboard.map((user, index) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 ${getRankStyle(user.rank)} ${
                user.name === 'You' ? 'ring-2 ring-green-500' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                    {getRankIcon(user.rank)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-bold text-base sm:text-lg truncate ${user.rank <= 3 ? '' : 'text-gray-800'}`}>
                        {user.name}
                      </h3>
                      {user.name === 'You' && (
                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full flex-shrink-0">
                          You
                        </span>
                      )}
                    </div>
                    <p className={`text-xs sm:text-sm truncate ${user.rank <= 3 ? 'text-white/90' : 'text-gray-600'}`}>
                      {user.badge}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className={`text-lg sm:text-2xl font-bold ${user.rank <= 3 ? '' : 'text-gray-800'}`}>
                    {user.classifications}
                  </div>
                  <div className={`text-xs whitespace-nowrap ${user.rank <= 3 ? 'text-white/80' : 'text-gray-600'}`}>
                    {user.streak} day streak
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-xl sm:rounded-2xl">
        <p className="text-xs sm:text-sm text-gray-600 text-center">
          Keep classifying to climb the ranks and earn more badges!
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
