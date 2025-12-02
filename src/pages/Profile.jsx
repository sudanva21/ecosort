import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { socialService } from '../services/socialService';
import { 
  User, MapPin, Calendar, Link as LinkIcon, Edit, 
  Users, Image, Heart, MessageCircle, Settings 
} from 'lucide-react';
import PostCard from '../components/PostCard';

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    loadProfile();
  }, [username, user]);

  const loadProfile = async () => {
    setLoading(true);
    
    let profileData;
    if (username) {
      const { data } = await socialService.searchUsers(username);
      profileData = data?.[0];
    } else {
      const { data } = await socialService.getUserProfile(user?.id);
      profileData = data;
    }

    if (profileData) {
      setProfile(profileData);
      setIsOwnProfile(profileData.id === user?.id);
      
      const { data: postsData } = await socialService.getUserPosts(profileData.id);
      setPosts(postsData || []);

      if (profileData.id !== user?.id) {
        const { data: followData } = await socialService.checkIfFollowing(
          profileData.id,
          user?.id
        );
        setIsFollowing(!!followData);
      }
    }
    
    setLoading(false);
  };

  const handleFollow = async () => {
    if (isFollowing) {
      await socialService.unfollowUser(profile.id, user.id);
      setIsFollowing(false);
      setProfile(prev => ({
        ...prev,
        followers_count: prev.followers_count - 1
      }));
    } else {
      await socialService.followUser(profile.id, user.id);
      setIsFollowing(true);
      setProfile(prev => ({
        ...prev,
        followers_count: prev.followers_count + 1
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile not found</h2>
          <button
            onClick={() => navigate('/social')}
            className="text-green-600 hover:underline"
          >
            Back to feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div
            className="h-48 bg-gradient-to-r from-green-400 to-emerald-500"
            style={{
              backgroundImage: profile.cover_photo_url ? `url(${profile.cover_photo_url})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-4">
              <div className="relative">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.username}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-green-100 flex items-center justify-center">
                    <User className="w-16 h-16 text-green-600" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 sm:ml-6 mt-4 sm:mt-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                      {profile.full_name || profile.username}
                    </h1>
                    <p className="text-gray-600">@{profile.username}</p>
                  </div>
                  
                  <div className="flex gap-2 mt-4 sm:mt-0">
                    {isOwnProfile ? (
                      <>
                        <button
                          onClick={() => navigate('/profile/edit')}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors"
                        >
                          <Edit size={18} />
                          Edit Profile
                        </button>
                        <button
                          onClick={() => navigate('/settings')}
                          className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors"
                        >
                          <Settings size={18} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleFollow}
                        className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                          isFollowing
                            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              {profile.bio && (
                <p className="text-gray-700 mb-3">{profile.bio}</p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    {profile.location}
                  </div>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-green-600 hover:underline"
                  >
                    <LinkIcon size={16} />
                    {profile.website.replace(/https?:\/\//, '')}
                  </a>
                )}
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  Joined {new Date(profile.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-6 mb-6 text-sm">
              <div>
                <span className="font-bold text-gray-800">{profile.posts_count}</span>
                <span className="text-gray-600 ml-1">Posts</span>
              </div>
              <div className="cursor-pointer hover:underline">
                <span className="font-bold text-gray-800">{profile.followers_count}</span>
                <span className="text-gray-600 ml-1">Followers</span>
              </div>
              <div className="cursor-pointer hover:underline">
                <span className="font-bold text-gray-800">{profile.following_count}</span>
                <span className="text-gray-600 ml-1">Following</span>
              </div>
              <div>
                <span className="font-bold text-gray-800">{profile.total_points}</span>
                <span className="text-gray-600 ml-1">Points</span>
              </div>
            </div>

            <div className="border-b border-gray-200 mb-6">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`pb-3 border-b-2 transition-colors ${
                    activeTab === 'posts'
                      ? 'border-green-600 text-green-600 font-semibold'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Posts
                </button>
                <button
                  onClick={() => setActiveTab('likes')}
                  className={`pb-3 border-b-2 transition-colors ${
                    activeTab === 'likes'
                      ? 'border-green-600 text-green-600 font-semibold'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Likes
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No posts yet</p>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} onUpdate={loadProfile} />
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
