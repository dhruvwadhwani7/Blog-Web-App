import { useEffect, useState } from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterest, FaBell } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationAsRead } from '../../redux/notificationSlice';
import { fetchAllUsers } from '../../redux/authSlice';
import { fetchAllBlogs } from '../../redux/blogSlice';
import { Link } from 'react-router-dom';


const TopHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notifications);
  const { user, token } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.auth);
  const { blogs } = useSelector((state) => state.blogs);
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (user && token) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user, token]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  const userResults = users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );
  console.log("userResults", userResults);

  const blogResults = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(query.toLowerCase())
  );

  const categoryResults = blogs.filter((blog) =>
    blog.category?.toLowerCase().includes(query.toLowerCase())
  );
  console.log(categoryResults);

  return (
    <>
      {user && token ? (
        <div className="bg-black text-white px-12 py-3 flex justify-between items-center text-sm relative">
          <div className="flex-1 flex justify-start items-center space-x-2 relative">
            {!showSearch ? (
              <FiSearch
                className="text-xl cursor-pointer hover:text-pink-400 transition-colors"
                onClick={() => setShowSearch(true)}
              />
            ) : (
              <div className="flex items-center border border-neutral-200 rounded px-3 w-full max-w-lg mb-2 mt-2">
                <FiSearch className="text-white text-base" />
                <input
                  type="text"
                  placeholder="Search by Category, Profile, Blog"
                  className="ml-2 bg-transparent outline-none text-white placeholder-white w-full py-2"
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                  onFocus={() => query && setShowResults(true)}
                />
              </div>
            )}

            {showResults && query && (
              <div className="absolute top-12 w-full bg-white text-black rounded shadow-lg max-h-80 overflow-y-auto z-50 text-sm">

                {categoryResults.length > 0 && (
                  <>
                    <h6 className="px-4 py-2 font-semibold text-gray-600 ">Categories</h6>
                    {categoryResults.map((cat, idx) => (
                      <Link
                        key={`cat-${idx}`}
                        to={`/category/${cat.category}`}
                        onClick={() => {
                          setQuery(cat.category);
                          setShowResults(false);
                        }}
                      >
                        <p className="px-6 py-2 hover:bg-gray-100 cursor-pointer">
                          {cat.category}
                        </p>
                      </Link>
                    ))}
                  </>
                )}

                {blogResults.length > 0 && (
                  <>
                    <h6 className="px-4 py-2 font-semibold text-gray-600">Blogs</h6>
                    {blogResults.map((blog, idx) => (
                      <Link
                        key={`blog-${idx}`}
                        to={`/${blog._id}`}
                        onClick={() => {
                          setQuery(blog.title);
                          setShowResults(false);
                        }}
                      >
                        <p className="px-6 py-2 hover:bg-gray-100 cursor-pointer">
                          {blog.title}
                        </p>
                      </Link>
                    ))}
                  </>
                )}

                {userResults.length > 0 && (
                  <>
                    <h6 className="px-4 py-2 font-semibold text-gray-600">Users</h6>
                    {userResults.map((user, idx) => (
                      <Link
                        key={`user-${idx}`}
                        to={`/user/${user._id}`}
                        onClick={() => {
                          setQuery(user.name);
                          setShowResults(false);
                        }}
                      >
                        <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          <img
                            src={user?.avatar ? `http://localhost:5000${user.avatar}` : './avatar.webp'}
                            alt="Avatar"
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span>{user.name}</span>
                        </li>
                      </Link>
                    ))}
                  </>
                )}
                {userResults.length === 0 &&
                  blogResults.length === 0 &&
                  categoryResults.length === 0 && (
                    <div className="px-4 py-2 text-gray-500">No results found</div>
                  )}
              </div>
            )}
          </div>
          <div className="flex-1 flex justify-center">
          </div>
          <div className="flex-1 flex justify-end space-x-6 relative">
            {user && token ? (
              <div className="relative">
                <FaBell
                  className="text-lg cursor-pointer hover:text-pink-400 transition-colors"
                  onClick={() => setShowNotifications(!showNotifications)}
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-72 bg-white text-black rounded shadow-lg z-50">
                    <div className="px-4 py-2 border-b font-semibold text-sm">Notifications</div>
                    <ul className="max-h-60 overflow-y-auto text-sm">
                      {loading ? (
                        <li className="px-4 py-3 text-gray-500">Loading...</li>
                      ) : notifications.length === 0 ? (
                        <li className="px-4 py-3 text-gray-500">No notifications</li>
                      ) : (
                        notifications.map((n) => (
                          <li
                            key={n._id}
                            onClick={() => dispatch(markNotificationAsRead(n._id))}
                            className={`px-4 py-2 hover:bg-gray-100 ${!n.isRead ? 'font-semibold' : ''}`}
                          >
                            <span className="font-medium"></span>{' '}
                            {n.message}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ) : ('')}
          </div>
        </div>
      ) : (null)}
    </>
  );
};

export default TopHeader;
