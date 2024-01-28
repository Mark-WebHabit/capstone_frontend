import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  authenticatedRequest,
  throwError,
  authenticatedRequestPostAndPatch,
} from "../utility/restApiUtilitis.js";

const initialState = {
  error: null,
  areas: [],
  selectedAreas: undefined,
  tableContent: [],
  tableContentLength: undefined,
  area: undefined,
  fetchingStatus: "idle",
  page: 1,
  searchEnabled: false,
  searchPage: 1,
  submitSearch: null,
  personnel: [],
  guests: [],
};

export const getAreasAdmin = createAsyncThunk(
  "mapping/:areaTypeName",
  async (_, { getState, dispatch }) => {
    try {
      return await authenticatedRequest(`admin/areas`, dispatch, getState);
    } catch (error) {
      throwError(error);
    }
  }
);

export const getTableinfo = createAsyncThunk(
  "admin/info/:areaId",
  async (data, { getState, dispatch, signal }) => {
    try {
      return await authenticatedRequest(
        `admin/info/${data.areaId}?page=${data.page}&status=${data.filter}`,
        dispatch,
        getState,
        signal
      );
    } catch (error) {
      throwError(error);
    }
  }
);

export const getSearchDeceaseds = createAsyncThunk(
  "admin/info/search/:query?page=${page}",
  async (data, { getState, dispatch, signal }) => {
    try {
      return await authenticatedRequest(
        `admin/info/search/${data.query}?page=${data.page}`,
        dispatch,
        getState,
        signal
      );
    } catch (error) {
      throwError(error);
    }
  }
);

export const getPersonnel = createAsyncThunk(
  "admin/personnel",
  async (_, { getState, dispatch, signal }) => {
    try {
      return await authenticatedRequest(
        `admin/personnel`,
        dispatch,
        getState,
        signal
      );
    } catch (error) {
      throwError(error);
    }
  }
);

export const searchForGuests = createAsyncThunk(
  "admin/personnel/guests",
  async (query, { getState, dispatch, signal }) => {
    try {
      return await authenticatedRequest(
        `admin/personnel/guest/${query}`,
        dispatch,
        getState,
        signal
      );
    } catch (error) {
      throwError(error);
    }
  }
);

export const updatePlotNotWithInterment = createAsyncThunk(
  "admin/info/update",
  async (data, { getState, dispatch }) => {
    try {
      return await authenticatedRequestPostAndPatch(
        data,
        "admin/info/update",
        dispatch,
        getState,
        false
      );
    } catch (error) {
      throwError(error);
    }
  }
);

export const updateInterment = createAsyncThunk(
  "admin/info/update/interment",
  async (data, { getState, dispatch }) => {
    try {
      return await authenticatedRequestPostAndPatch(
        data,
        "admin/info/update/interment",
        dispatch,
        getState,
        false
      );
    } catch (error) {
      throwError(error);
    }
  }
);

export const updateGuestAsEmployee = createAsyncThunk(
  "admin/personnel/assign/:id",
  async (id, { getState, dispatch }) => {
    try {
      return await authenticatedRequestPostAndPatch(
        {},
        `admin/personnel/assign/${id}`,
        dispatch,
        getState,
        false
      );
    } catch (error) {
      throwError(error);
    }
  }
);

export const assignRoleToEmployee = createAsyncThunk(
  "admin/personnel/assign/employee/:id",
  async (data, { getState, dispatch }) => {
    try {
      return await authenticatedRequestPostAndPatch(
        { role: data.role },
        `admin//personnel/assign/employee/${data.id}`,
        dispatch,
        getState,
        false
      );
    } catch (error) {
      throwError(error);
    }
  }
);

const adminRestApiSlice = createSlice({
  name: "adminApi",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    setSelectedAreas: (state, action) => {
      state.selectedAreas = action.payload;
    },
    setError: (state, action) => (state.error = action.payload),
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSearchEnabled: (state, action) => {
      state.searchEnabled = action.payload;
    },
    setSearchPage: (state, action) => {
      state.searchPage = action.payload;
    },
    setSubmitSearch: (state, action) => {
      state.submitSearch = action.payload;
    },
    emptyGuests: (state) => {
      state.guests = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAreasAdmin.fulfilled, (state, action) => {
        state.areas = action.payload?.data || [];
      })
      .addCase(getAreasAdmin.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getTableinfo.pending, (state) => {
        state.fetchingStatus = "loading";
      })
      .addCase(getTableinfo.fulfilled, (state, action) => {
        state.tableContent = action.payload.data;
        state.tableContentLength = action.payload.length;
        state.area = action.payload?.area || null;
        state.fetchingStatus = "idle";
      })
      .addCase(getTableinfo.rejected, (state, action) => {
        state.error = action.error.message;
        state.fetchingStatus = "idle";
      })
      .addCase(getSearchDeceaseds.pending, (state, action) => {
        state.fetchingStatus = "loading";
      })
      .addCase(getSearchDeceaseds.fulfilled, (state, action) => {
        state.tableContent = action.payload.data;
        state.tableContentLength = action.payload.length;
        state.fetchingStatus = "idle";
      })
      .addCase(getSearchDeceaseds.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updatePlotNotWithInterment.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateInterment.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getPersonnel.fulfilled, (state, action) => {
        state.personnel = action.payload.data;
      })
      .addCase(getPersonnel.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(searchForGuests.fulfilled, (state, action) => {
        state.guests = action.payload.data;
      })
      .addCase(searchForGuests.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(assignRoleToEmployee.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const {
  clearAdminError,
  setSelectedAreas,
  setError,
  setPage,
  setSearchEnabled,
  setSearchPage,
  setSubmitSearch,
  emptyGuests,
} = adminRestApiSlice.actions;
export default adminRestApiSlice.reducer;
