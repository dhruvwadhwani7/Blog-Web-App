import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const MainHeader = () => {
  const { user, token } = useSelector((state) => state.auth);

  return (
    <div className="bg-white px-6 py-4 flex flex-col md:flex-row items-center justify-between border-b-white">
      <h1 className="text-3xl font-serif font-semibold tracking-wide text-gray-900">
        Blogging Platform
      </h1>
      <nav className="mt-3 md:mt-0 flex gap-8 text-base font-medium text-gray-800">
        <Link to="/" className="hover:text-pink-600 transition-colors">Home</Link>
        {user && token ?  (
        <Link to="/my-blog" className="hover:text-pink-600 transition-colors">My Blog</Link>
        ):(null)}
        <Link to="/about" className="hover:text-pink-600 transition-colors">About</Link>
        {user && token ? (
          <Link to="/profile" className="hover:text-pink-600 transition-colors">Profile</Link>
        ) : (
          <Link to="/signin" className="hover:text-pink-600 transition-colors">SignIn</Link>
        )}
      </nav>
    </div>
  );
};

export default MainHeader;
