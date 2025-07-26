import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Admin from './pages/Admin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserFromToken } from './redux/authSlice';
import { useEffect } from 'react';
import Profile from './pages/Profile';
import MyBlog from './pages/MyBlog';
import BlogDetail from './pages/BlogDetail';
import CategoryPage from './pages/CategoryPage';
import BlogList from './pages/BlogList';
import PersonalProfile from './pages/PersonalProfile';
import SavedBlogs from './pages/SavedBlogs';
import About from './pages/About';


function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  useEffect(() => {
    if (token && !user) {
      dispatch(loadUserFromToken());
    }
  }, [token, user, dispatch]);
  return (
    <>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/about' element={<About/>}/>
        <Route path="/signin" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/user/:id' element={<PersonalProfile />} />
        <Route path='/my-blog' element={<MyBlog />} />
         <Route path='/saved-blog' element={<SavedBlogs />} />
        <Route path="/:id" element={<BlogDetail />} />
        <Route path='/bloglist' element={<BlogList/>}/>
        <Route path="/category/:category" element={<CategoryPage />} />
      </Routes>
   
    </Router>
        <ToastContainer
        position="bottom-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
      </>
  );
}

export default App;
