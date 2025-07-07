// Navbar component: handles site navigation
import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => (
  <nav className="bg-white shadow-md rounded-xl mx-4 my-6 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <span className="text-2xl font-bold text-blue-700 tracking-tight">Blogify</span>
    </div>
    <div className="flex flex-wrap items-center gap-4">
      <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Home</Link>
      <Link to="/about" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">About</Link>
      <Link to="/create" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Create Blog</Link>
      <Link to="/saved" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Saved Blogs</Link>
      <Link to="/profile/1" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Profile</Link>
      <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Login</Link>
      <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Register</Link>
      {/* <Link to="/admin" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Admin</Link> */}
      <Link to="/settings" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Settings</Link>
    </div>
  </nav>
)

export default Navbar
