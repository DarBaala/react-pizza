import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export enum SortPropertyEnum {
  RATING_DESK = "rating",
  RATING_ASK = "-rating",
  TITLE_DESK = "title",
  TITLE_ASK = "-title",
  PRICE_DESK = "price",
  PRICE_ASK = "-price",
}

export type Sort = {
  name: string;
  sortProperty: SortPropertyEnum;
};

export interface FilterSliceState {
  categoryId: number;
  pageCoint: number;
  sort: Sort;
  searchValue: string;
}

const initialState: FilterSliceState = {
  categoryId: 0,
  pageCoint: 1,
  sort: { name: "популярности", sortProperty: SortPropertyEnum.RATING_DESK },
  searchValue: "",
};

export const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategoryId(state, action: PayloadAction<number>) {
      state.categoryId = action.payload;
    },
    setSort(state, action: PayloadAction<Sort>) {
      state.sort = action.payload;
    },
    setPageCoint(state, action: PayloadAction<number>) {
      state.pageCoint = action.payload;
    },
    setSearchValue(state, action: PayloadAction<string>) {
      state.searchValue = action.payload;
    },
    setFiltres(state, action: PayloadAction<FilterSliceState>) {
      if (Object.keys(action.payload).length) {
        state.pageCoint = Number(action.payload.pageCoint);
        state.categoryId = Number(action.payload.categoryId);
        state.sort = action.payload.sort;
      } else {
        state.pageCoint = 1;
        state.categoryId = 0;
        state.sort = {
          name: "популярности",
          sortProperty: SortPropertyEnum.RATING_DESK,
        };
      }
    },
  },
});

export const selectFilter = (state: RootState) => state.filter;
export const selectSort = (state: RootState) => state.filter.sort;

export const {
  setCategoryId,
  setSort,
  setPageCoint,
  setSearchValue,
  setFiltres,
} = filterSlice.actions;

export default filterSlice.reducer;
