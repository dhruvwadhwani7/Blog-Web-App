import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/authSlice';
import { toast } from 'react-toastify';

const Login = () => {
  const images = [
    './business.jpg',
    './culture.jpg',
    './sport1.jpg',
    './tech.jpg',
    './life.jpg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
const [formData, setFormData] = useState({ email: '', password: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 300000); 

    return () => clearInterval(interval); 
  }, []);

  useEffect(() => {
  if (user && token) {
    toast.success("Login Successfull");

    if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  }
}, [user, token, navigate]);
useEffect(() => {
  if (error) {
    toast.error(error, { autoClose: 3000 });
  }
}, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-avenir">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow-md w-full max-w-4xl  overflow-hidden mb-15">
        <div className="hidden md:block">
          <img
            src={images[currentIndex]}
            alt="Login visual"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 sm:p-8 w-full">
          <h2 className="text-3xl mb-3 text-gray-800">
            SignIn
          </h2>
          <p className="text-sm mb-6 text-gray-600">
            Access your account to explore and manage your blog posts.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit} >

            <div>
              <label className="block font-light font-avenir mb-1">Email *</label>
              <input
               name="email"
                type="email"
                className="w-full border-b border-gray-400 focus:outline-none focus:border-[#b4552c] py-2 bg-transparent"
                 value={formData.email}
                onChange={handleChange}
                 required
              />
            </div>

            <div>
              <label className="block font-light font-avenir mb-1">Password *</label>
              <input
               name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-b border-gray-400 focus:outline-none focus:border-[#b4552c] py-2 bg-transparent"
                 required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#b4552c] text-white py-2 rounded hover:bg-[#943f20] transition"
            >
              Log In
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600 text-center">
            Don't have an account? <a href="/signup" className="text-[#b4552c] font-medium">SignUp</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
