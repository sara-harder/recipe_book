import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: {
        _id: "",
        username: "",
        fullname: "",
        favorites: [],
        recents: []
    }
  },
  reducers: {
    login(state, action) {
      state.value = action.payload
    },
    setFavorites(state, action) {
      state.value.favorites = action.payload
    },
    setRecents(state, action) {
      state.value.recents = action.payload
    }
  }
})

export const { login, setFavorites, setRecents } = userSlice.actions

export default userSlice.reducer