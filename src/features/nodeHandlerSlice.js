import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  headerRef: null,
};

export const nodeHandlerSlice = createSlice({
  name: "nodeHandler",
  initialState,
  reducers: {
    getHeaderHeight: (state, action) => {
      state.headerRef = action.payload;
    },
  },
});
export const { getHeaderHeight } = nodeHandlerSlice.actions;
export default nodeHandlerSlice.reducer;
