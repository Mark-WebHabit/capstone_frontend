import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  map: "whole",
};

export const selectMapSlice = createSlice({
  name: "selectMap",
  initialState,
  reducers: {
    getSelectedMap: (state, action) => {
      state.map = action.payload;
    },
  },
});
