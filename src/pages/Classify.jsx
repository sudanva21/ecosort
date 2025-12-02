import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import UploadBox from '../components/UploadBox';
import ResultCard from '../components/ResultCard';
import { useImageUpload } from '../hooks/useImageUpload';
import { useClassification } from '../hooks/useClassification';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const Classify = () => {
  const { user } = useAuth();
  const { preview, file, handleImageSelect, handleImageCapture, clearImage } = useImageUpload();
  const { classification, loading, error, classify, reset } = useClassification();
  const { setCurrentClassification, updateStreakCount } = useApp();

  const handleClassify = async () => {
    if (file && user) {
      const result = await classify(file, user.id);
      if (result) {
        setCurrentClassification(result);
      }
    }
  };

  const handleReset = () => {
    clearImage();
    reset();
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
            Classify Your Waste
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Upload or capture an image of your waste item, and our AI will identify
            the proper disposal category instantly.
          </p>
        </motion.div>

        <div className="space-y-6 sm:space-y-8">
          {!classification ? (
            <>
              <UploadBox
                preview={preview}
                onImageSelect={handleImageSelect}
                onImageCapture={handleImageCapture}
                onClear={clearImage}
              />

              {preview && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClassify}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                  >
                    Classify Waste
                  </motion.button>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 space-y-4"
                >
                  <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 animate-spin" />
                  <p className="text-base sm:text-lg text-gray-600">Analyzing your waste...</p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-center text-sm sm:text-base"
                >
                  {error}
                </motion.div>
              )}
            </>
          ) : (
            <>
              <ResultCard classification={classification} />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                >
                  Classify Another Item
                </motion.button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classify;
