import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { socialService } from '../services/socialService';
import { X, Image as ImageIcon, MapPin, Hash, Loader } from 'lucide-react';

const CreatePostModal = ({ onClose, onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      setGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            setLocation(data.display_name || `${latitude}, ${longitude}`);
          } catch (error) {
            setLocation(`${latitude}, ${longitude}`);
          }
          setGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setGettingLocation(false);
          alert('Unable to get your location. Please enter it manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('Please write something before posting');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = null;
      
      if (image) {
        const { data: uploadData, error: uploadError } = await socialService.uploadImage(image);
        if (uploadError) {
          throw new Error('Failed to upload image');
        }
        imageUrl = uploadData.url;
      }

      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const postData = {
        user_id: user.id,
        content: content.trim(),
        image_url: imageUrl,
        location: location || null,
        tags: tagArray.length > 0 ? tagArray : null,
        is_public: true
      };

      const { data, error } = await socialService.createPost(postData);

      if (error) {
        throw error;
      }

      if (onPostCreated) {
        onPostCreated(data);
      }
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Create Post</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your eco-friendly journey, tips, or environmental thoughts..."
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
              rows="6"
              disabled={isSubmitting}
            />

            {imagePreview && (
              <div className="mt-4 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full rounded-2xl max-h-96 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview('');
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            <div className="mt-4 space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <MapPin size={20} className="text-gray-600 flex-shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Add location"
                    className="flex-1 px-3 py-2 sm:px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 text-sm sm:text-base"
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={gettingLocation || isSubmitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 transition-colors text-sm sm:text-base whitespace-nowrap"
                >
                  {gettingLocation ? <Loader className="animate-spin" size={20} /> : 'Get Location'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Hash size={20} className="text-gray-600 flex-shrink-0" />
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Add tags (comma separated) e.g. recycling, eco-tips"
                  className="flex-1 px-3 py-2 sm:px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 text-sm sm:text-base"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <label className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-full cursor-pointer transition-colors text-sm sm:text-base">
                <ImageIcon size={20} />
                <span className="font-semibold">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-full font-semibold transition-colors text-sm sm:text-base"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim() || isSubmitting}
                  className="flex-1 sm:flex-none px-6 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Posting...
                    </>
                  ) : (
                    'Post'
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreatePostModal;
