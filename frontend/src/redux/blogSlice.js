import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/blogs';

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }
});

export const createBlog = createAsyncThunk(
  'blogs/create',
  async (formData, thunkAPI) => {
    try {
      const res = await axios.post(API_URL, formData, {
        ...authHeader(),
        headers: {
          ...authHeader().headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Create failed');
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blogs/update',
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, formData, {
        ...authHeader(),
        headers: {
          ...authHeader().headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blogs/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${id}`, authHeader());
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Delete failed');
    }
  }
);

export const fetchAllBlogs = createAsyncThunk(
  'blogs/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);

export const fetchMyBlogs = createAsyncThunk(
  'blogs/fetchMine',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/my-blogs`, authHeader());
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  'blogs/fetchById',
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);

const blogSlice = createSlice({
  name: 'blogs',
  initialState: {
    blogs: [],
    myBlogs: [],
    blog: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetStatus: (state) => {
      state.success = false;
      state.error = null;
    },
    clearState: (state) => {
      state.blogs = [];
      state.myBlogs = [];
      state.blog = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.unshift(action.payload);
        state.myBlogs.unshift(action.payload);
        state.success = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const updated = action.payload;
        state.blogs = state.blogs.map(b => b._id === updated._id ? updated : b);
        state.myBlogs = state.myBlogs.map(b => b._id === updated._id ? updated : b);
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        const id = action.payload;
        state.blogs = state.blogs.filter(b => b._id !== id);
        state.myBlogs = state.myBlogs.filter(b => b._id !== id);
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload;
      })
      .addCase(fetchMyBlogs.fulfilled, (state, action) => {
        state.myBlogs = action.payload;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.blog = action.payload;
      })
      .addMatcher(
        action => action.type.startsWith('blogs/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        })
      .addMatcher(
        action => action.type.startsWith('blogs/') && action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
        })
      .addMatcher(
        action => action.type.startsWith('blogs/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
  }
});

export const { resetStatus, clearState } = blogSlice.actions;
export default blogSlice.reducer;
