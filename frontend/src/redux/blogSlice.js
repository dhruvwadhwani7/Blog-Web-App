// Redux slice for blog posts
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  blogs: [],
  loading: false,
  error: null,
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    // TODO: Add reducers
  },
})

export default blogSlice.reducer
