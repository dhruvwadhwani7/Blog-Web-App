import { configureStore } from '@reduxjs/toolkit';
import authReducer from './redux/authSlice';
import blogReducer from './redux/blogSlice';
import likeReducer from './redux/likeSlice';
import commentsReducer from './redux/commentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
     likes: likeReducer,
      comments: commentsReducer,
  },
});
