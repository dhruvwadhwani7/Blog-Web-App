// src/redux/notificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 🔐 Authorization header
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

// ✅ Fetch all notifications for logged-in user
export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications', authHeader());
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

// ✅ Mark a notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id, thunkAPI) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, authHeader());
      return res.data.notification;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

// ✅ Initial state
const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotifications(state) {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.notifications.findIndex((n) => n._id === updated._id);
        if (index !== -1) {
          state.notifications[index] = updated;
        }
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
