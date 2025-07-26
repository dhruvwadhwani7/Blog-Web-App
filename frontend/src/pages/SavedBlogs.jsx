import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSavedBlogs, saveBlog, unsaveBlog } from '../redux/authSlice';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { getLikeCount, isPostLiked, likePost, unlikePost } from '../redux/likeSlice';
import { fetchCommentsByPost } from '../redux/commentSlice';
import { toast } from 'react-toastify';
import Loader from '../Components/Loader';

const SavedBlogs = () => {
  const dispatch = useDispatch();
  const { savedBlogs, loading, error } = useSelector((state) => state.auth);
  const { likeCounts, likeStatus } = useSelector((state) => state.likes);
  const { commentCounts } = useSelector((state) => state.comments);

  useEffect(() => {
    dispatch(fetchSavedBlogs());
  }, [dispatch]);

  useEffect(() => {
    savedBlogs?.forEach((blog) => {
      dispatch(getLikeCount(blog._id));
      dispatch(isPostLiked(blog._id));
      dispatch(fetchCommentsByPost(blog._id));
    });
  }, [dispatch, savedBlogs]);

  const getTruncatedText = (html, maxLength = 150) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleLikeToggle = (postId) => {
    if (likeStatus[postId]) {
      dispatch(unlikePost(postId));
    } else {
      dispatch(likePost(postId));
    }
  };

  if (loading) return <Loader/>
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Saved Blogs</h2>

      {savedBlogs.length === 0 && (
        <p className="text-gray-500">You haven’t saved any blogs yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedBlogs.map((blog) => (
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
              <div>
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

                  <button
                    onClick={async () => {
                      await dispatch(unsaveBlog(blog._id)); 
                      dispatch(fetchSavedBlogs()); 
                      toast.success('Blog removed from saved!', {
                        position: 'bottom-right',
                      });
                    }}
                    className="text-gray-500 hover:text-black"
                    title="Unsave"
                  >
                    <FaBookmark className="text-[#A04F3B]" size={18} />
                  </button>
                </div>

                <Link to={`/${blog._id}`}>
                  <h3 className="text-lg font-bold mt-2">{blog.title}</h3>
                  <p className="text-sm text-gray-700 mt-2">
                    {getTruncatedText(blog.content, 120)}
                  </p>
                </Link>
              </div>

              <div className="mt-4 border-t border-gray-400 pt-3 flex justify-between text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {commentCounts[blog._id] || ""}
                </span>
                <button
                  onClick={() => handleLikeToggle(blog._id)}
                  className={`flex items-center gap-1 transition-colors cursor-pointer ${likeStatus[blog._id] ? 'text-red-600' : 'text-gray-500'
                    } hover:text-red-600`}
                >
                  <Heart
                    className="w-4 h-4 fill-current"
                    fill={likeStatus[blog._id] ? 'currentColor' : 'none'}
                  />
                  <span className="text-gray-600">{likeCounts[blog._id] ?? 0}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedBlogs;
