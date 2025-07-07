// Redux slice for user profile and settings
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  profile: null,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // TODO: Add reducers
  },
})

export default userSlice.reducer
