import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedGenre: 'all',
  searchQuery: '',
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setGenre: (state, action) => {
      state.selectedGenre = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setGenre, setSearchQuery } = contentSlice.actions;
export default contentSlice.reducer;
