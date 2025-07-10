import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../redux/authSlice';
import { toast } from 'react-toastify';

const SignUp = () => {
    
     const images = [
        './business.jpg',
        './culture.jpg',
        './sport1.jpg',
        './tech.jpg',
        './life.jpg',
      ];
    
      const [currentIndex, setCurrentIndex] = useState(0);
     const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, error } = useSelector((state) => state.auth);
      useEffect(() => {
        const interval = setInterval(() => {
          setCurrentIndex(prev => (prev + 1) % images.length);
        }, 300000); 
    
        return () => clearInterval(interval); 
      }, []);
        useEffect(() => {
    if (user && token) {
      toast.success(`Successfully signed up!`);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, token, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow-lg w-full max-w-4xl overflow-hidden mb-20">
        {/* Left: Image Section */}
        <div className="hidden md:block">
           <img
            src={images[currentIndex]}
            alt="Login visual"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Form Section */}
        <div className="p-6 sm:p-8 w-full">
          <h2 className="text-3xl  mb-3 text-gray-800">Sign up</h2>
          <p className="text-sx mb-6 text-gray-600 font-light  font-avenir">
             Discover top blogs and hidden gems from our authors.
          </p>

          <form className="space-y-3" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block font-light font-avenir mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-[#b4552c] py-1.5 bg-transparent text-sm"
                required
              />
            </div>

            <div>
              <label className="block font-light font-avenir mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-[#b4552c] py-1.5 bg-transparent text-sm"
                required
              />
            </div>

            <div>
              <label className="block font-light font-avenir mb-1">Phone *</label>
              <div className="flex items-center border-b border-gray-300 focus-within:border-[#b4552c]">
                <span className="text-gray-700 px-2 py-1.5 select-none">+91</span>
                <input
                   type="tel"
                  name="phone"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full py-1.5 pl-1 bg-transparent focus:outline-none text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-light font-avenir mb-1">Password *</label>
              <input
               type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-[#b4552c] py-1.5 bg-transparent text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#b4552c] text-white py-2 rounded-md hover:bg-[#943f20] transition text-sm font-medium"
            >
              Sign Me Up
            </button>
          </form>
          <p className="mt-6 text-sm text-gray-600 text-center">
           Already have an account? <a href="/signin" className="text-[#b4552c] font-medium">SignIn</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
