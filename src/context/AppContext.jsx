import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStreak } from '../utils/api';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentClassification, setCurrentClassification] = useState(null);
  const [streak, setStreak] = useState({ count: 0, lastDate: null });
  const [classificationHistory, setClassificationHistory] = useState([]);

  useEffect(() => {
    const fetchStreak = async () => {
      if (user?.id) {
        try {
          const streakData = await getStreak(user.id);
          if (streakData) {
            setStreak(streakData);
          }
        } catch (error) {
          console.error('Failed to fetch streak, using default:', error);
          setStreak({ count: 0, last_date: null });
        }
      }
    };
    fetchStreak();
  }, [user]);

  const updateClassification = (classification) => {
    setCurrentClassification(classification);
    setClassificationHistory(prev => [
      { ...classification, timestamp: new Date() },
      ...prev.slice(0, 9)
    ]);
  };

  const updateStreakCount = (newStreak) => {
    setStreak(newStreak);
  };

  const value = {
    currentClassification,
    setCurrentClassification: updateClassification,
    streak,
    updateStreakCount,
    classificationHistory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
