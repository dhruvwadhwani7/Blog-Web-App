// Navbar component: handles site navigation
import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => (
  <nav style={{ padding: '1rem', background: '#f5f5f5', marginBottom: '2rem' }}>
    <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
    <Link to="/about" style={{ marginRight: '1rem' }}>About</Link>
    <Link to="/create" style={{ marginRight: '1rem' }}>Create Blog</Link>
    <Link to="/saved" style={{ marginRight: '1rem' }}>Saved Blogs</Link>
    <Link to="/profile/1" style={{ marginRight: '1rem' }}>Profile</Link>
    <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
    <Link to="/register" style={{ marginRight: '1rem' }}>Register</Link>
    {/* <Link to="/admin" style={{ marginRight: '1rem' }}>Admin</Link> */}
    <Link to="/settings">Settings</Link>
  </nav>
)

export default Navbar
