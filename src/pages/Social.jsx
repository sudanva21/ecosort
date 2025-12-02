import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { socialService } from '../services/socialService';
import { Plus, Users, MapPin, TrendingUp } from 'lucide-react';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import { useNavigate } from 'react-router-dom';

const Social = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState([]);

  useEffect(() => {
    loadFeed();
    loadNearbyUsers();
  }, []);

  const loadFeed = async () => {
    setLoading(true);
    const { data, error } = await socialService.getFeedPosts(20);
    if (data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const loadNearbyUsers = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const { data } = await socialService.getNearbyUsers(latitude, longitude, 50);
        if (data) {
          setNearbyUsers(data.slice(0, 5));
        }
      });
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    setShowCreatePost(false);
  };

  return (
    <div className="min-h-screen pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex-1 text-left px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors text-sm sm:text-base"
                >
                  Share your eco-friendly journey...
                </button>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="p-2 sm:p-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors flex-shrink-0"
                >
                  <Plus size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
            </motion.div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-green-600"></div>
                </div>
              ) : posts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-8 sm:p-12 text-center"
                >
                  <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No posts yet</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Be the first to share your eco-story!</p>
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="px-5 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-colors text-sm sm:text-base"
                  >
                    Create Post
                  </button>
                </motion.div>
              ) : (
                posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post}
                    onDelete={() => loadFeed()}
                    onUpdate={() => loadFeed()}
                  />
                ))
              )}
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-20 lg:self-start">
            {nearbyUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">Nearby Eco-Warriors</h2>
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div className="space-y-3">
                  {nearbyUsers.map((nearbyUser) => (
                    <div
                      key={nearbyUser.id}
                      onClick={() => navigate(`/profile/${nearbyUser.username}`)}
                      className="flex items-center gap-3 p-2 sm:p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                          {nearbyUser.username}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {nearbyUser.distance ? `${nearbyUser.distance}km away` : 'Nearby'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/nearby')}
                  className="w-full mt-4 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                >
                  View All
                </button>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6"
            >
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                Community Stats
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Total Members</span>
                  <span className="text-lg sm:text-2xl font-bold text-green-600">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Items Classified</span>
                  <span className="text-lg sm:text-2xl font-bold text-green-600">15.6K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Active Today</span>
                  <span className="text-lg sm:text-2xl font-bold text-green-600">342</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};

export default Social;
