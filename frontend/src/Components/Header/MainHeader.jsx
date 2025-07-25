import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authSlice';

const MainHeader = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };
  return (
    <div className="bg-white px-6 py-4 flex flex-col md:flex-row items-center justify-between border-b-white">
      <h1 className="text-3xl font-serif font-semibold tracking-wide text-gray-900">
        Blogging Platform
      </h1>
      <nav className="mt-3 md:mt-0 flex gap-8 text-base font-medium text-gray-800">
        {user?.role !== "admin" && (
          <>
            <Link to="/" className="hover:text-pink-600 transition-colors">Home</Link>
            {user && token ? (
              <Link to="/my-blog" className="hover:text-pink-600 transition-colors">My Blog</Link>
            ) : (null)}
            <Link to="/about" className="hover:text-pink-600 transition-colors">About</Link>
            {user && token ? (
              <Link to="/profile" className="hover:text-pink-600 transition-colors">Profile</Link>
            ) : (
              <Link to="/signin" className="hover:text-pink-600 transition-colors">SignIn</Link>
            )}
          </>
        )}
        {user?.role === "admin"&& (
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            Logout
          </button>
        )}
      </nav>
    </div>
  );
};

export default MainHeader;
