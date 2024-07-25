import { createSlice } from '@reduxjs/toolkit'

export const selectionSlice = createSlice({
  name: 'selection',
  initialState: {
    recipe: undefined,
    category: undefined,
    flavor: undefined
  },
  reducers: {
    selectR(state, action) {
      state.recipe = action.payload
    },
    selectC(state, action) {
      state.category = action.payload
    },
    selectF(state, action) {
      state.flavor = action.payload
    }
  }
})

export const { selectR, selectC, selectF } = selectionSlice.actions

export default selectionSlice.reducer