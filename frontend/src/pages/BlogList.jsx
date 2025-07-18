import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBlogs } from '../redux/blogSlice';
import { Heart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLikeCount, isPostLiked, likePost, unlikePost } from '../redux/likeSlice';
import { fetchCommentsByPost } from '../redux/commentSlice';

const BlogList = () => {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.blogs);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', ...new Set(blogs.map(blog => blog.category))];
  const { likeCounts, likeStatus } = useSelector((state) => state.likes);
  const { commentCounts } = useSelector((state) => state.comments);

 console.log('count',likeCounts);
  const filteredBlogs = selectedCategory === 'All'
    ? blogs
    : blogs.filter(blog => blog.category === selectedCategory);

  useEffect(() => {
    dispatch(fetchAllBlogs());
  }, [dispatch]);
  const postIds = useMemo(() => blogs?.map(b => b._id), [blogs]);

useEffect(() => {
  if (postIds && postIds.length > 0) {
    postIds.forEach(postId => {
      dispatch(getLikeCount(postId));
      dispatch(isPostLiked(postId));
      dispatch(fetchCommentsByPost(postId))
    });
  }
}, [dispatch, postIds]);

  if (loading) return <div className="text-center py-10">Loading blogs...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
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
  console.log("count",likeCounts);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1 rounded-full border ${selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300'
              } hover:bg-blue-500 hover:text-white transition`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
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
                <div className="flex items-start gap-3 mb-2">
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
                        year: 'numeric'
                      })} • {blog?.category.charAt(0).toUpperCase() + blog?.category.slice(1)}
                    </div>
                  </div>
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
                {commentCounts[blog._id]||""}
                </span>
                <button
                  onClick={() => handleLikeToggle(blog._id)}
                  key={blog._id}
                  className={`flex items-center gap-1 transition-colors cursor-pointer  ${likeStatus[blog._id] ? 'text-red-600' : 'text-gray-500'
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

export default BlogList;
