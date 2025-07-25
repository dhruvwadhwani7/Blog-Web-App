import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  users: []
};

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
export const createUserByAdmin = createAsyncThunk(
  'auth/createUserByAdmin',
  async ({ name, email, phone, password }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}register`, {
        name,
        email,
        phone,
        password,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.user; // only return created user
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to create user'
      );
    }
  }
);


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

export const loadUserFromToken = createAsyncThunk(
  'auth/profile',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      console.log(" Token from localStorage:", token);
      if (!token || token.split('.').length !== 3) {
        console.warn("Invalid token format");
        throw new Error('Invalid or missing token');
      }

      const res = await axios.get(`${API_URL}profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('loadUserFromToken error:', error.response?.data || error.message);
      localStorage.removeItem('token');
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to load user'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/update',
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

export const fetchAllUsers = createAsyncThunk(
  'auth/fetchAllUsers',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}users`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Required if verifyToken is used
        },
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${API_URL}users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return userId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
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
      .addCase(createUserByAdmin.fulfilled, (state, action) => {
  state.loading = false;
  state.users.push(action.payload); // update the user list
})
.addCase(createUserByAdmin.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
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
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
        state.token = null;
        state.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
