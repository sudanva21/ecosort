import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { socialService } from '../services/socialService';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Navigation } from 'lucide-react';

const NearbyUsers = () => {
  const navigate = useNavigate();
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [radius, setRadius] = useState(50);

  useEffect(() => {
    loadNearbyUsers();
  }, [radius]);

  const loadNearbyUsers = () => {
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const { data, error } = await socialService.getNearbyUsers(
            latitude,
            longitude,
            radius
          );
          
          if (data) {
            setNearbyUsers(data);
          } else if (error) {
            setError('Failed to load nearby users');
          }
          setLoading(false);
        },
        (error) => {
          setError('Please enable location access to find nearby users');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-full">
              <Navigation className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Nearby Eco-Warriors</h1>
              <p className="text-gray-600">Connect with environmental enthusiasts near you</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <label className="text-gray-700 font-semibold">Radius:</label>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
            </select>
            <button
              onClick={loadNearbyUsers}
              className="px-6 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-12 text-center"
          >
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{error}</p>
          </motion.div>
        ) : nearbyUsers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-12 text-center"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No users found nearby</h3>
            <p className="text-gray-600 mb-4">Try increasing the search radius</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nearbyUsers.map((nearbyUser) => (
              <motion.div
                key={nearbyUser.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/profile/${nearbyUser.username}`)}
                className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  {nearbyUser.avatar_url ? (
                    <img
                      src={nearbyUser.avatar_url}
                      alt={nearbyUser.username}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <Users size={32} className="text-green-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-800 truncate">
                      {nearbyUser.full_name || nearbyUser.username}
                    </h3>
                    <p className="text-gray-600 text-sm">@{nearbyUser.username}</p>
                    <div className="flex items-center gap-1 text-green-600 mt-2">
                      <MapPin size={16} />
                      <span className="text-sm font-semibold">
                        {nearbyUser.distance_km} km away
                      </span>
                    </div>
                    {nearbyUser.location && (
                      <p className="text-gray-500 text-xs mt-1 truncate">
                        {nearbyUser.location}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyUsers;
