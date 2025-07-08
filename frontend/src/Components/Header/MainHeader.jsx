import React from 'react';

const MainHeader = () => {
  return (
    <div className="bg-white px-6 py-4 flex flex-col md:flex-row items-center justify-between border-b-white">
      {/* Title */}
      <h1 className="text-3xl font-serif font-semibold tracking-wide text-gray-900">
        Blogging Platform
      </h1>

      {/* Navigation */}
      <nav className="mt-3 md:mt-0 flex gap-8 text-base font-medium text-gray-800">
        <a href="/" className="hover:text-pink-600 transition-colors">Home</a>
        <a href="/blog" className="hover:text-pink-600 transition-colors">My Blog</a>
        <a href="/about" className="hover:text-pink-600 transition-colors">About</a>
        <a href="/signin" className="hover:text-pink-600 transition-colors">SignIn</a>
      </nav>
    </div>
  );
};

export default MainHeader;
