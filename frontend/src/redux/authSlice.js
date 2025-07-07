// Redux slice for authentication
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // TODO: Add reducers
  },
})

export default authSlice.reducer
