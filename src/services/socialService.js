import { supabase } from '../lib/supabase';

export const socialService = {
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    return { data, error };
  },

  async createPost(postData) {
    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select()
      .single();
    
    return { data, error };
  },

  async getFeedPosts(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    return { data, error };
  },

  async getUserPosts(userId, limit = 20) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  async deletePost(postId) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);
    
    return { error };
  },

  async likePost(postId, userId) {
    const { data, error } = await supabase
      .from('likes')
      .insert([{ post_id: postId, user_id: userId }])
      .select()
      .single();
    
    return { data, error };
  },

  async unlikePost(postId, userId) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
    
    return { error };
  },

  async checkIfLiked(postId, userId) {
    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();
    
    return { data, error };
  },

  async getPostComments(postId) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async addComment(postId, userId, content) {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, user_id: userId, content }])
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .single();
    
    return { data, error };
  },

  async deleteComment(commentId) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);
    
    return { error };
  },

  async followUser(followingId, followerId) {
    const { data, error } = await supabase
      .from('follows')
      .insert([{ follower_id: followerId, following_id: followingId }])
      .select()
      .single();
    
    return { data, error };
  },

  async unfollowUser(followingId, followerId) {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);
    
    return { error };
  },

  async checkIfFollowing(followingId, followerId) {
    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();
    
    return { data, error };
  },

  async getFollowers(userId) {
    const { data, error } = await supabase
      .from('follows')
      .select(`
        follower_id,
        profiles:follower_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('following_id', userId);
    
    return { data, error };
  },

  async getFollowing(userId) {
    const { data, error } = await supabase
      .from('follows')
      .select(`
        following_id,
        profiles:following_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('follower_id', userId);
    
    return { data, error };
  },

  async getNearbyUsers(latitude, longitude, radiusKm = 50) {
    const { data, error } = await supabase
      .rpc('find_nearby_users', {
        user_lat: latitude,
        user_lng: longitude,
        radius_km: radiusKm
      });
    
    return { data, error };
  },

  async uploadImage(file, bucket = 'posts') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      return { data: null, error };
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { data: { path: filePath, url: publicUrl }, error: null };
  },

  async searchUsers(query) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, bio')
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(10);
    
    return { data, error };
  }
};
