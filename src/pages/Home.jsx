import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Recycle, Leaf, TrendingUp, Zap } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Classification',
      description: 'Instant waste identification using advanced machine learning',
    },
    {
      icon: Recycle,
      title: 'Smart Segregation',
      description: 'Learn proper disposal methods for every type of waste',
    },
    {
      icon: TrendingUp,
      title: 'Track Your Impact',
      description: 'Build streaks and earn badges for sustainable actions',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 sm:space-y-8"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                repeat: Infinity,
                duration: 20,
                ease: 'linear',
              }}
              className="inline-block"
            >
              <Leaf className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-green-600 mx-auto" />
            </motion.div>

            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
                  EcoSort
                </span>
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 font-medium px-4">
                Segregate Smart, Recycle Better
              </p>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                Transform your waste management with AI-powered classification.
                Join thousands making a difference, one item at a time.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/classify')}
              className="inline-flex items-center space-x-2 sm:space-x-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all"
            >
              <span>Start Classifying</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute inset-0 pointer-events-none hidden md:block"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360],
              }}
              transition={{
                repeat: Infinity,
                duration: 5 + i,
                delay: i * 0.5,
              }}
              className="absolute"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
            >
              <Leaf className="w-12 h-12 text-green-400" />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 text-center group hover:shadow-2xl transition-all"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 group-hover:from-green-500 group-hover:to-emerald-700 transition-all"
                  >
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 sm:space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
              Ready to Make a Difference?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Join our community of eco-warriors and start your journey towards
              a sustainable future today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all"
              >
                Get Started Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/guide')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-green-600 text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-green-200"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
