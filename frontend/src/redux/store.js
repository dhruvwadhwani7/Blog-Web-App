// Redux store setup
import { configureStore } from '@reduxjs/toolkit'
// import authReducer from './authSlice'
// import blogReducer from './blogSlice'
// import userReducer from './userSlice'

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    // blog: blogReducer,
    // user: userReducer,
  },
})
