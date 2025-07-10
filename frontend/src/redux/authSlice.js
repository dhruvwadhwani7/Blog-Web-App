import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

// Register
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, phone, password }, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}register`, {
        name,
        email,
        phone,
        password,
      });

      const { user, token } = res.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      return { user, token };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}login`, {
        email,
        password,
      });

      const { user, token } = res.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      return { user, token };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

// Load user from token
export const loadUserFromToken = createAsyncThunk(
  'auth/profile',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const res = await axios.get(`${API_URL}profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to load user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.put(`${API_URL}update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUser = res.data;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Load from Token
      .addCase(loadUserFromToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserFromToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loadUserFromToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        // Optional: only clear if token is expired/invalid
        state.token = null;
        state.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
