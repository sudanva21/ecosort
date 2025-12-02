import { useState } from 'react';
import { classifyImage, updateStreak } from '../utils/api';

export const useClassification = () => {
  const [classification, setClassification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const classify = async (imageFile, userId) => {
    if (!imageFile) {
      setError('No image file provided');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await classifyImage(imageFile, userId);
      setClassification(result);
      if (userId) {
        await updateStreak(userId);
      }
      return result;
    } catch (err) {
      setError(err.message || 'Classification failed');
      console.error('Classification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setClassification(null);
    setError(null);
    setLoading(false);
  };

  return {
    classification,
    loading,
    error,
    classify,
    reset,
  };
};
