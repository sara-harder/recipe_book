import { createSlice } from '@reduxjs/toolkit'

export const selectionSlice = createSlice({
  name: 'selection',
  initialState: {
    value: undefined
  },
  reducers: {
    select(state, action) {
      state.value = action.payload
    }
  }
})

export const { select } = selectionSlice.actions

export default selectionSlice.reducer