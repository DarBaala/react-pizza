import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryId: 0,
  pageCoint: 1,
  sort: { name: "популярности", sortProperty: "rating" },
  searchValue: "",
};

export const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategoryId(state, action) {
      state.categoryId = action.payload;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
    setPageCoint(state, action) {
      state.pageCoint = action.payload;
    },
    setSearchValue(state, action) {
      state.searchValue = action.payload;
    },
    setFiltres(state, action) {
      if (Object.keys(action.payload).length) {
        state.pageCoint = Number(action.payload.pageCoint);
        state.categoryId = Number(action.payload.categoryId);
        state.sort = action.payload.sort;
      } else {
        state.pageCoint = 1;
        state.categoryId = 0;
        state.sort = { name: "популярности", sortProperty: "rating" };
      }
    },
  },
});

export const {
  setCategoryId,
  setSort,
  setPageCoint,
  setSearchValue,
  setFiltres,
} = filterSlice.actions;

export default filterSlice.reducer;
