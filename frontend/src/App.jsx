import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import CreateBlog from './pages/CreateBlog.jsx'
import ViewBlog from './pages/ViewBlog.jsx'
import SavedBlogs from './pages/SavedBlogs.jsx'
import Profile from './pages/Profile.jsx'
import About from './pages/About.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Settings from './pages/Settings.jsx'
import UserList from './admin/UserList.jsx'
import BlogStats from './admin/BlogStats.jsx'
import ReportedContent from './admin/ReportedContent.jsx'
import Navbar from './components/Navbar.jsx'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Router>
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create" element={<CreateBlog />} />
            <Route path="/blog/:id" element={<ViewBlog />} />
            <Route path="/saved" element={<SavedBlogs />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/admin/stats" element={<BlogStats />} />
            <Route path="/admin/reports" element={<ReportedContent />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </Router>
    </div>
  )
}

export default App
