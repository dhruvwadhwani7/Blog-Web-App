import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useState } from 'react';
import { LogOut, Pencil } from 'lucide-react';
import EditProfileModal from '../Components/EditProfileModal';
import BlogForm from '../Components/BlogForm';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const getInitial = (name) => name?.charAt(0).toUpperCase();
  console.log(user);
  

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-50">
      <div className="bg-gray shadow-xl p-6 w-full max-w-xl space-y-4">
        <div className="flex items-center gap-4">
          {user?.avatar ? (
            <img
               src={`http://localhost:5000${user.avatar}`}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-semibold">
              {getInitial(user?.name)}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Bio */}
        <div>
          <p className="text-gray-600 italic">
            {user?.bio ? user.bio : 'Tell the world a bit about yourself!'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-5  mt-4">
          <button
          style={{backgroundColor:"#b4552c"}}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <Pencil size={18} /> Edit Profile
          </button>
          <button
           style={{backgroundColor:"#b4552c"}}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white  hover:bg-red-700 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {showModal && (
        <EditProfileModal user={user} closeModal={() => setShowModal(false)} />
      )}
      {/* <BlogForm/> */}
    </div>
  );
}
