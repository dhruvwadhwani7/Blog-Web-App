import React, { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBlogs } from '../redux/blogSlice';
import { Menu } from '@headlessui/react';
import { EllipsisVertical, Heart, MessageCircle, Trash2 } from 'lucide-react';
import { getLikeCount, isPostLiked, likePost, unlikePost } from '../redux/likeSlice';
import { fetchCommentsByPost } from '../redux/commentSlice';
import Loader from '../Components/Loader';
import { saveBlog, unsaveBlog } from '../redux/authSlice';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CategoryPage = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const { blogs = [], loading, error } = useSelector(state => state.blogs || {});
  const postIds = useMemo(() => blogs?.map(b => b._id), [blogs]);
  const { likeCounts, likeStatus } = useSelector((state) => state.likes);
  const { commentCounts } = useSelector((state) => state.comments);

  useEffect(() => {
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  const filtered = blogs
    .filter(blog => blog.category?.toLowerCase() === category.toLowerCase())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getTruncatedText = (html, maxLength = 55) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };
  useEffect(() => {
    if (postIds && postIds.length > 0) {
      postIds.forEach(postId => {
        dispatch(getLikeCount(postId));
        dispatch(isPostLiked(postId));
        dispatch(fetchCommentsByPost(postId))
      });
    }
  }, [dispatch, postIds]);

  const handleLikeToggle = (postId) => {
    if (likeStatus[postId]) {
      dispatch(unlikePost(postId));
    } else {
      dispatch(likePost(postId));
    }
  };
  const { savedBlogs } = useSelector((state) => state.auth);
  const isBlogSaved = (id) => {
    return Array.isArray(savedBlogs) && savedBlogs.some((b) => b._id === id);
  };

  const handleSaveToggle = async (blog) => {
    try {
      const saved = isBlogSaved(blog._id);
      if (saved) {
        await dispatch(unsaveBlog(blog._id));
        toast.info('Blog unsaved.', { position: 'bottom-right' });
      } else {
        await dispatch(saveBlog(blog._id));
        toast.success('Blog saved!', { position: 'bottom-right' });
      }
    } catch (err) {
      toast.error('Something went wrong.');
    }
  };

  if (loading) return <Loader />
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 capitalize">{category} Blogs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <Link to={`/${blog._id}`}>
              <img
                src={`http://localhost:5000/${blog.media?.[0]}`}
                alt={blog.title}
                className="w-full h-[200px] object-cover"
                loading="lazy"
              />
            </Link>

            <div className="p-4 flex flex-col justify-between flex-1">
              <div className="flex justify-between items-start gap-3 mb-2">
                <div className="flex items-start gap-3">
                  {blog?.authorId?.avatar ? (
                    <img
                      src={`http://localhost:5000${blog.authorId.avatar}`}
                      alt="Author"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src="/avatar.webp"
                      alt="Author"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  )}
                  <div className="text-sm text-gray-600">
                    <div className="text-black font-medium">{blog.authorId?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })} • {blog?.category.charAt(0).toUpperCase() + blog?.category.slice(1)}
                    </div>
                  </div>
                </div>

                {/* Save icon on the right */}
                <button
                  onClick={() => handleSaveToggle(blog)}
                  title={isBlogSaved(blog._id) ? 'Saved' : 'Save'}
                  className="text-gray-500 hover:text-black"
                >
                  {isBlogSaved(blog._id) ? (
                    <FaBookmark className="text-[#A04F3B]" size={18} />
                  ) : (
                    <FaRegBookmark size={18} />
                  )}
                </button>
              </div>

              <div className="mt-4 border-t border-gray-400 pt-3 flex justify-between text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {commentCounts[blog._id] || ''}
                </span>
                <button
                  onClick={() => handleLikeToggle(blog._id)}
                  key={blog._id}
                  className={`flex items-center gap-1 cursor-pointer transition-colors ${likeStatus[blog._id] ? 'text-red-600' : 'text-gray-500'
                    } hover:text-red-600`}
                >
                  <Heart
                    className="w-4 h-4 fill-current"
                    fill={likeStatus[blog._id] ? 'currentColor' : 'none'}
                  />
                  <span className='text-gray-600'>{likeCounts[blog._id] ?? 0}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
