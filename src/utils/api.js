import { supabase } from '../lib/supabase';

const N8N_CLASSIFY_WEBHOOK = import.meta.env.VITE_N8N_CLASSIFY_WEBHOOK;
const N8N_GUIDE_WEBHOOK = import.meta.env.VITE_N8N_GUIDE_WEBHOOK;

export const classifyImage = async (imageFile, userId) => {
  try {
    if (!N8N_CLASSIFY_WEBHOOK) {
      throw new Error('N8N webhook URL not configured. Please set VITE_N8N_CLASSIFY_WEBHOOK in .env file');
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch(N8N_CLASSIFY_WEBHOOK, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`N8N Classification failed (${response.status}): ${errorText}`);
    }
    
    const text = await response.text();
    if (!text || text.trim() === '') {
      throw new Error('N8N webhook returned empty response');
    }
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('N8N response parse error:', parseError, 'Response:', text);
      throw new Error(`Invalid JSON response from N8N: ${text.substring(0, 100)}`);
    }
    
    const result = {
      category: data.category || 'Unknown',
      confidence: data.confidence || 0,
      description: data.description || '',
      disposal_method: data.disposal_method || '',
    };
    
    if (userId) {
      await saveClassification(userId, result);
    }
    
    return result;
  } catch (error) {
    console.error('Classification error:', error);
    throw error;
  }
};

export const saveClassification = async (userId, classification) => {
  try {
    const confidence = parseFloat(classification.confidence);
    const confidenceInt = Math.round(confidence > 1 ? confidence : confidence * 100);
    
    const validCategories = ['plastic', 'paper', 'metal', 'glass', 'organic', 'e-waste', 'hazardous'];
    let category = (classification.category || '').toLowerCase().trim();
    
    console.log('Original category:', classification.category);
    console.log('Normalized category:', category);
    
    if (!validCategories.includes(category)) {
      console.warn('Invalid category, defaulting to plastic. Received:', category);
      category = 'plastic';
    }
    
    console.log('Final category being saved:', category);
    
    const { data, error } = await supabase
      .from('classifications')
      .insert([
        {
          user_id: userId,
          category: category,
          confidence: confidenceInt,
          description: classification.description,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }
    return data[0];
  } catch (error) {
    console.error('Error saving classification:', error);
    throw error;
  }
};

export const getUserClassifications = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('classifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching classifications:', error);
    throw error;
  }
};

export const getDisposalGuide = async (category) => {
  try {
    if (!N8N_GUIDE_WEBHOOK) {
      throw new Error('N8N guide webhook URL not configured');
    }

    const response = await fetch(N8N_GUIDE_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Disposal guide request failed (${response.status}): ${errorText}`);
    }

    const text = await response.text();
    if (!text || text.trim() === '') {
      throw new Error('Disposal guide webhook returned empty response');
    }

    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error('Error fetching disposal guide:', error);
    throw error;
  }
};

export const getStreak = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      const { data: newStreak, error: insertError } = await supabase
        .from('streaks')
        .insert([
          {
            user_id: userId,
            current_streak: 0,
            longest_streak: 0,
            last_date: null,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      return newStreak;
    }

    return data;
  } catch (error) {
    console.error('Error fetching streak:', error);
    throw error;
  }
};

export const updateStreak = async (userId) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: existingStreak, error: fetchError } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    let currentStreak = 1;
    let longestStreak = 1;

    if (existingStreak) {
      if (existingStreak.last_date === today) {
        return existingStreak;
      }

      const lastDate = existingStreak.last_date;
      currentStreak = existingStreak.current_streak || 0;
      longestStreak = existingStreak.longest_streak || 0;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      currentStreak = lastDate === yesterdayStr ? currentStreak + 1 : 1;
      longestStreak = Math.max(longestStreak, currentStreak);
    }

    const { data, error } = await supabase
      .from('streaks')
      .upsert(
        {
          user_id: userId,
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_date: today,
        },
        { onConflict: 'user_id', ignoreDuplicates: false }
      )
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};

export const getLeaderboardData = async () => {
  try {
    const { data: streaks, error } = await supabase
      .from('streaks')
      .select('user_id, current_streak, longest_streak')
      .order('current_streak', { ascending: false })
      .limit(10);

    if (error) throw error;

    const leaderboardData = await Promise.all(
      streaks.map(async (streak, index) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', streak.user_id)
          .single();

        return {
          rank: index + 1,
          name: profile?.username || 'Anonymous',
          badge: getBadge(streak.current_streak).name,
          classifications: streak.current_streak,
          streak: streak.current_streak,
        };
      })
    );

    return leaderboardData;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

export const getBadge = (streakCount) => {
  if (streakCount >= 365) return { name: '🔥 Year Master', color: 'text-red-500' };
  if (streakCount >= 180) return { name: '⭐ Half Year Hero', color: 'text-yellow-500' };
  if (streakCount >= 90) return { name: '💎 Quarter Champion', color: 'text-blue-500' };
  if (streakCount >= 30) return { name: '🎖️ Month Warrior', color: 'text-green-500' };
  if (streakCount >= 7) return { name: '🌟 Week Star', color: 'text-purple-500' };
  if (streakCount >= 3) return { name: '🚀 Starter', color: 'text-gray-500' };
  return { name: '🌱 Beginner', color: 'text-gray-400' };
};
