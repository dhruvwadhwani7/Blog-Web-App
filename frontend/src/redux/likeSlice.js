import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const LIKE_API = 'http://localhost:5000/api/likes';

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
});

export const likePost = createAsyncThunk('likes/like', async (postId, thunkAPI) => {
    try {
        const res = await axios.post(`${LIKE_API}/${postId}`, {}, authHeader());
        return { postId };
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || 'Like failed');
    }
});

export const unlikePost = createAsyncThunk('likes/unlike', async (postId, thunkAPI) => {
    try {
        const res = await axios.delete(`${LIKE_API}/${postId}`, authHeader());
        return { postId };
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || 'Unlike failed');
    }
});

export const getLikeCount = createAsyncThunk(
    'likes/getCount',
    async (postId, thunkAPI) => {
        try {
            const res = await axios.get(`${LIKE_API}/${postId}`);
            console.log("Like count API response:", res.data);
            return { postId, count: res.data.likes };
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to get count');
        }
    }
);


export const isPostLiked = createAsyncThunk(
    'likes/isLiked',
    async (postId, thunkAPI) => {
        try {
            const res = await axios.get(`${LIKE_API}/${postId}/is-liked`, authHeader());
            return { postId, liked: res.data.liked };
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to check liked status');
        }
    }
);

const initialState = {
    likeCounts: {},
    likeStatus: {},
    loading: false,
    error: null,
};

const likeSlice = createSlice({
    name: 'likes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(likePost.fulfilled, (state, action) => {
                const postId = action.payload.postId;
                state.likeStatus[postId] = true;
                state.likeCounts[postId] = (state.likeCounts[postId] || 0) + 1;
            })
            .addCase(unlikePost.fulfilled, (state, action) => {
                const postId = action.payload.postId;
                state.likeStatus[postId] = false;
                state.likeCounts[postId] = Math.max((state.likeCounts[postId] || 1) - 1, 0);
            })
            .addCase(getLikeCount.fulfilled, (state, action) => {
                const { postId, count } = action.payload;
                console.log("Redux updating likeCounts:", postId, count);
                state.likeCounts[postId] = typeof count === 'number' ? count : 0;
            })
            .addCase(isPostLiked.fulfilled, (state, action) => {
                const { postId, liked } = action.payload;
                state.likeStatus[postId] = liked;
            })
            .addMatcher(
                (action) => action.type.startsWith('likes/') && action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('likes/') && action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('likes/') && action.type.endsWith('/fulfilled'),
                (state) => {
                    state.loading = false;
                }
            );
    },
});

export default likeSlice.reducer;
