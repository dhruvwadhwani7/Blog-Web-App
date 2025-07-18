import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/comments';
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const fetchCommentsByPost = createAsyncThunk(
  'comments/fetchCommentsByPost',
  async (postId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${postId}`);
      return {
        postId,
        comments: res.data.comments,
        count: res.data.count,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/${postId}`, { content }, authHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${commentId}`, authHeader());
      return commentId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  commentsByPost: {},      
  commentCounts: {},       
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCommentsByPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommentsByPost.fulfilled, (state, action) => {
        const { postId, comments, count } = action.payload;
        state.commentsByPost[postId] = comments;
        state.commentCounts[postId] = count;
        state.loading = false;
      })
      .addCase(fetchCommentsByPost.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const comment = action.payload;
        const postId = comment.postId;

        if (state.commentsByPost[postId]) {
          state.commentsByPost[postId].unshift(comment);
        } else {
          state.commentsByPost[postId] = [comment];
        }

        if (state.commentCounts[postId] !== undefined) {
          state.commentCounts[postId]++;
        } else {
          state.commentCounts[postId] = 1;
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const commentId = action.payload;
        for (const postId in state.commentsByPost) {
          const index = state.commentsByPost[postId].findIndex(c => c._id === commentId);
          if (index !== -1) {
            state.commentsByPost[postId].splice(index, 1);
            state.commentCounts[postId]--;
            break;
          }
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default commentsSlice.reducer;
