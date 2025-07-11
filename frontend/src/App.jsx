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


function App() {
  const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);
  useEffect(() => {
    if (token && !user) {
      dispatch(loadUserFromToken());
    }
  }, [token, user, dispatch]);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path='/profile' element={<Profile/>}/>
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Router>
  );
}

export default App;
