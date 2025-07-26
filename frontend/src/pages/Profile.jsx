import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useEffect, useState } from 'react';
import { Bookmark, FileText, LogOut, Pencil, Settings } from 'lucide-react';
import EditProfileModal from '../Components/EditProfileModal';
import BlogForm from '../Components/BlogForm';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMyBlogs } from '../redux/blogSlice';
import Loader from '../Components/Loader';

export default function Profile() {
  const { user,loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const getInitial = (name) => name?.charAt(0).toUpperCase();
  const { myBlogs } = useSelector(state => state.blogs);
const savedBlogs = useSelector((state) => state.auth.savedBlogs);
  useEffect(() => {
    dispatch(fetchMyBlogs());
  }, [dispatch])


  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      <div
        className="relative w-full overflow-hidden shadow-xl"
        style={{
          backgroundImage: "url('./profile4.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-black/60 p-8 sm:p-12 flex flex-col sm:flex-row justify-between items-center" style={{ minHeight: '400px', padding: '4rem' }}>
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "monospace" }}>Hello {user?.name?.split(' ')[0]}</h1>
            <p className=" opacity-90 " style={{ fontFamily: "cursive", fontSize: "25" }}>
              {/* {user?.bio || 'Tell the world a bit about yourself!'} */}
              Welcome to your blogging space. Share your thoughts, connect with readers, and let your voice shape the conversation.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-5 py-2 bg-[#b4552c] hover:bg-[#943d1e] font-semibold transition text-white flex items-center gap-2"
            >
              <Pencil size={18} /> Edit Profile
            </button>
          </div>
          <div className="relative bg-white  rounded-xl shadow-lg pt-16 px-6 pb-6 w-full sm:w-80 mt-8 sm:mt-0 text-center">
            <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
              {user?.avatar ? (
                <img
                  src={`http://localhost:5000${user?.avatar}`}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <img
                  src={`./avatar.webp`}
                  alt="Author"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mt-4">{user?.name}</h2>
            <div className="flex justify-center gap-8 mt-4 mb-8">
              <div>
                <p className="text-lg font-bold text-[#b4552c]">{myBlogs?.length || 0}</p>
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4 text-black" />
                  <p className="text-sm font-bold text-gray-700">BLOG POST</p>
                </div>
              </div>
              <div>
                <Link to={'/saved-blog'}>
                <p className="text-lg font-bold text-[#b4552c]">{savedBlogs?.length || 0}</p>
                <div className="flex items-center space-x-1">
                  <Bookmark className="w-4 h-4 text-black" />
                  <p className="text-sm font-bold text-gray-700">SAVED BLOGS</p>
                </div>
                </Link>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 italic">
              {user?.bio || 'A passionate blogger sharing ideas with the world.'}
            </p>
            <div className="mt-6 w-full flex flex-col gap-3">
              <button
                onClick={() => alert('Settings clicked')}
                className="flex justify-center items-center gap-1.5 px-4 py-2 bg-gray-600 font-semibold text-white rounded hover:bg-gray-700 transition"
              >
                <Settings className="w-5 h-5" />
                Settings
              </button>
              <button
                onClick={() => {
                  dispatch(logout())
                  navigate('/signin');
                }
                }
                className="flex justify-center items-center gap-1.5 px-4 py-2 bg-red-700 font-semibold text-white rounded hover:bg-red-700 transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <BlogForm />
      </div>
      {showModal && (
        <EditProfileModal user={user} closeModal={() => setShowModal(false)} />
      )}
    </div>
  );
}
