import { createSlice } from 'redux-starter-kit'
import { SHOW_ALL } from './constants'

export const visibilityFilter = createSlice({
  slice: 'visibilityFilter',
  initialState: SHOW_ALL,
  reducers: {
    setVisibilityFilter: (state, action) => action.payload,
  },
})
