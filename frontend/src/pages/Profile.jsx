import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import EditProfileModal from '../Components/EditProfileModal';
import BlogForm from '../Components/BlogForm';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const getInitial = (name) => name?.charAt(0).toUpperCase();

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
              className="mt-4 px-5 py-2 bg-[#b4552c] hover:bg-[#943d1e] transition text-white flex items-center gap-2 rounded"
            >
              <Pencil size={18} /> Edit Profile
            </button>
          </div>
          <div className="relative bg-white  rounded-xl shadow-lg pt-16 px-6 pb-6 w-full sm:w-80 mt-8 sm:mt-0 text-center">
            <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
              {user?.avatar ? (
                <img
                  src={`http://localhost:5000${user.avatar}`}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg">
                  {getInitial(user?.name)}
                </div>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mt-4">{user?.name}</h2>
            <div className="flex justify-center gap-8 mt-4">
              <div>
                <p className="text-lg font-bold text-[#b4552c]">12</p>
                <p className="text-sm font-semibold text-gray-700">Blog Post</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#b4552c]">5</p>
                <p className="text-sm font-semibold text-gray-700">Saved</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 italic">
              {user?.bio || 'A passionate blogger sharing ideas with the world.'}
            </p>
            <div className="mt-6 w-full flex flex-col gap-3">
              <button
                onClick={() => alert('Settings clicked')}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Settings
              </button>
              <button
                onClick={() => dispatch(logout())}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
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
