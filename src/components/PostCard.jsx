import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { socialService } from '../services/socialService';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  MoreVertical,
  Trash2,
  Flag
} from 'lucide-react';

const PostCard = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    checkIfLiked();
  }, [post.id, user]);

  const checkIfLiked = async () => {
    if (user) {
      const { data } = await socialService.checkIfLiked(post.id, user.id);
      setIsLiked(!!data);
    }
  };

  const handleLike = async () => {
    if (!user) return;

    if (isLiked) {
      await socialService.unlikePost(post.id, user.id);
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      await socialService.likePost(post.id, user.id);
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
    }
  };

  const loadComments = async () => {
    const { data } = await socialService.getPostComments(post.id);
    if (data) {
      setComments(data);
    }
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      loadComments();
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submittingComment) return;

    setSubmittingComment(true);
    const { data, error } = await socialService.addComment(
      post.id,
      user.id,
      newComment.trim()
    );

    if (data) {
      setComments([data, ...comments]);
      setNewComment('');
      if (onUpdate) onUpdate();
    }
    setSubmittingComment(false);
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await socialService.deletePost(post.id);
      if (onUpdate) onUpdate();
    }
  };

  const postAuthor = post.profiles || {};
  const isOwnPost = user?.id === post.user_id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(`/profile/${postAuthor.username}`)}
          >
            {postAuthor.avatar_url ? (
              <img
                src={postAuthor.avatar_url}
                alt={postAuthor.username}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">
                  {postAuthor.username?.[0]?.toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-800">
                {postAuthor.full_name || postAuthor.username}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical size={20} className="text-gray-600" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                {isOwnPost ? (
                  <button
                    onClick={handleDeletePost}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete Post
                  </button>
                ) : (
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Flag size={16} />
                    Report Post
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

        {post.image_url && (
          <img
            src={post.image_url}
            alt="Post"
            className="w-full rounded-2xl mb-4 max-h-96 object-cover"
          />
        )}

        {post.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <MapPin size={16} />
            {post.location}
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              isLiked
                ? 'text-red-600 bg-red-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Heart
              size={20}
              fill={isLiked ? 'currentColor' : 'none'}
            />
            <span className="font-semibold">{likesCount}</span>
          </button>

          <button
            onClick={handleToggleComments}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
          >
            <MessageCircle size={20} />
            <span className="font-semibold">{post.comments_count || 0}</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <Share2 size={20} />
          </button>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 border-t border-gray-100 pt-4"
            >
              <form onSubmit={handleAddComment} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"
                    disabled={submittingComment}
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submittingComment}
                    className="px-6 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Post
                  </button>
                </div>
              </form>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    {comment.profiles?.avatar_url ? (
                      <img
                        src={comment.profiles.avatar_url}
                        alt={comment.profiles.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 text-xs font-bold">
                          {comment.profiles?.username?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-2">
                      <p className="font-semibold text-sm text-gray-800">
                        {comment.profiles?.full_name || comment.profiles?.username}
                      </p>
                      <p className="text-gray-700">{comment.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PostCard;
