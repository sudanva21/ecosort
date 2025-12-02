import React, { useRef } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadBox = ({ preview, onImageSelect, onImageCapture, onClear }) => {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-dashed border-green-300 hover:border-green-500 transition-all"
          >
            <div className="text-center space-y-6">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex justify-center"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <Upload className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Upload Waste Image
                </h3>
                <p className="text-gray-600">
                  Choose a file or capture from your camera
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium"
                >
                  <Upload className="w-5 h-5" />
                  <span>Choose File</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium"
                >
                  <Camera className="w-5 h-5" />
                  <span>Capture Photo</span>
                </motion.button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onImageSelect}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={onImageCapture}
                className="hidden"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-6 relative"
          >
            <button
              onClick={onClear}
              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="rounded-2xl overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              Image ready for classification
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadBox;
