import React from 'react';
import { motion } from 'framer-motion';
import { Recycle, Droplet, Trash2, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResultCard = ({ classification }) => {
  const navigate = useNavigate();

  const getCategoryConfig = (category) => {
    switch (category) {
      case 'Recyclable':
        return {
          icon: Recycle,
          color: 'from-green-500 to-emerald-600',
          bg: 'bg-green-100',
          textColor: 'text-green-700',
          borderColor: 'border-green-500',
        };
      case 'Wet':
        return {
          icon: Droplet,
          color: 'from-blue-500 to-cyan-600',
          bg: 'bg-blue-100',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-500',
        };
      case 'Dry':
        return {
          icon: Trash2,
          color: 'from-gray-500 to-slate-600',
          bg: 'bg-gray-100',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-500',
        };
      default:
        return {
          icon: Trash2,
          color: 'from-gray-400 to-gray-600',
          bg: 'bg-gray-100',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-500',
        };
    }
  };

  const config = getCategoryConfig(classification.category);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 ${config.borderColor}`}>
        <div className="flex items-center justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className={`w-24 h-24 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-12 h-12 text-white" />
          </motion.div>
        </div>

        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {classification.category}
            </h2>
            <p className="text-gray-600">{classification.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`inline-flex items-center space-x-2 px-6 py-3 ${config.bg} rounded-full`}
          >
            <CheckCircle className={`w-5 h-5 ${config.textColor}`} />
            <span className={`font-semibold ${config.textColor}`}>
              {classification.confidence}% Confidence
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/guide', { state: { category: classification.category } })}
              className={`flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r ${config.color} text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium w-full sm:w-auto mx-auto`}
            >
              <span>View Disposal Guide</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
