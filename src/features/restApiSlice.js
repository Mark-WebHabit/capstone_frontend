import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { verifyUser, setUser } from "./authServices.js";

import {
  authenticatedRequest,
  throwError,
} from "../utility/restApiUtilitis.js";
import { instance } from "../app/instance.js";

const initialState = {
  lawns: [],
  lawn: null,
  plots: [], //overall plot
  deceaseds: [],
  searchResult: [],
  status: "idle",
  searchStatus: "idle",
  searchError: null,
  error: null,
  plotInfoStatus: "idle",
  plotInfoError: null,
  plotInfo: null,
  loginHistory: [],
  areaPlots: [], //plots specific to a certain area
  areaPlotsLoading: "idle",
};

export const getAllLawns = createAsyncThunk(
  "mapping/lawns",
  async (_, { dispatch, getState }) => {
    try {
      return await authenticatedRequest("/mapping/lawns", dispatch, getState);
    } catch (error) {
      throwError(error);
    }
  }
);

export const getLawn = createAsyncThunk(
  "mapping/lawns/lawnName",
  async (lawnName, { dispatch, getState }) => {
    try {
      return await authenticatedRequest(
        `mapping/lawns/${lawnName}`,
        dispatch,
        getState
      );
    } catch (error) {
      throwError(error);
    }
  }
);

export const getAllPlots = createAsyncThunk(
  "mapping/plots",
  async (_, { getState, dispatch }) => {
    try {
      return await authenticatedRequest("/mapping/plots", dispatch, getState);
    } catch (error) {
      throwError(error);
    }
  }
);

export const getAllDeceaseds = createAsyncThunk(
  "mapping/deceased",
  async (_, { getState, dispatch }) => {
    try {
      return await authenticatedRequest(
        "/mapping/deceaseds",
        dispatch,
        getState
      );
    } catch (error) {
      throwError(error);
    }
  }
);

export const searchQuery = createAsyncThunk(
  "mapping/search",
  async (query, { getState, dispatch }) => {
    try {
      return await authenticatedRequest(
        `/mapping/search/${query.toString()}`,
        dispatch,
        getState
      );
    } catch (error) {
      throwError(error);
    }
  }
);

export const getPlotInfo = createAsyncThunk(
  "mappping/plot/id",
  async (query, { getState, dispatch }) => {
    try {
      return await authenticatedRequest(
        `/mapping/plots/${query.toString()}`,
        dispatch,
        getState
      );
    } catch (error) {
      throwError(error);
    }
  }
);

export const getLoginHistroy = createAsyncThunk(
  "user/history",
  async (email, { getState, dispatch }) => {
    try {
      return await authenticatedRequest(
        `user/history/${email}`,
        dispatch,
        getState
      );
    } catch (error) {
      throwError(error);
    }
  }
);

export const getAreaPlots = createAsyncThunk(
  "mapping/:areaTypeName",
  async (areaTypeName, { getState, dispatch }) => {
    try {
      return await authenticatedRequest(
        `mapping/${areaTypeName}`,
        dispatch,
        getState
      );
    } catch (error) {
      throwError(error);
    }
  }
);

export const updateUsername = createAsyncThunk(
  "user/changeusername",
  async ({ data }, { getState, dispatch }) => {
    let user = getState().auth.user;

    if (!user || !user?.token) {
      return;
    }
    try {
      const token = user.token;

      const response = await instance.post(
        "user/changeusername",
        {
          email: data.email,
          username: data.username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        //meaning the error is about the validity of access token
        await dispatch(verifyUser());
        await dispatch(setUser());

        let newUser = getState().auth.user;

        try {
          // retry the request
          const reResponse = await instance.post(
            "user/changeusername",
            {
              email: data.email,
              username: data.username,
            },
            {
              headers: {
                Authorization: `Bearer ${newUser.token}`,
              },
            }
          );
          return reResponse.data;
        } catch (error) {
          if (error.response) {
            throw new Error(error.response.data.error);
          } else {
            throw new Error(error.message);
          }
        }
      } else if (error.response) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error(error.message);
      }
    }
  }
);
export const updatePassword = createAsyncThunk(
  "user/changepass",
  async ({ data }, { getState, dispatch }) => {
    let user = getState().auth.user;

    if (!user || !user?.token) {
      return;
    }
    try {
      const token = user.token;
      const response = await instance.post(
        "user/changepass",
        {
          email: data.email,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        //meaning the error is about the validity of access token
        await dispatch(verifyUser());
        await dispatch(setUser());

        let newUser = getState().auth.user;

        try {
          // retry the request
          const reResponse = await instance.post(
            "user/chnagepass",
            {
              email: data.email,
              currentPassword: data.currentPassword,
              newPassword: data.newPassword,
            },
            {
              headers: {
                Authorization: `Bearer ${newUser.token}`,
              },
            }
          );
          return reResponse.data;
        } catch (error) {
          if (error.response) {
            throw new Error(error.response.data.error);
          } else {
            throw new Error(error.message);
          }
        }
      } else if (error.response) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error(error.message);
      }
    }
  }
);

const restApiSlice = createSlice({
  name: "restApi",
  initialState,
  reducers: {
    reset: (state) => {
      state.searchResult = [];
      state.plotInfo = null;
      state.plotInfoStatus = "idle";
      state.searchStatus = "idle";
    },
    resetLawn: (state) => {
      state.lawn = null;
    },
    clearAreaPlots: (state) => {
      state.areaPlots = null;
    },
    clearLoginHistory: (state) => {
      state.loginHistory = [];
    },
    clearSystemError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllLawns.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllLawns.fulfilled, (state, action) => {
        state.error = null;
        state.status = "idle";
        state.lawns = action.payload;
      })
      .addCase(getAllLawns.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "idle";
        state.lawns = [];
      })
      .addCase(getAllPlots.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllPlots.fulfilled, (state, action) => {
        state.error = null;
        state.status = "idle";
        state.plots = action.payload.plots;
      })
      .addCase(getAllPlots.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
        state.plots = [];
      })
      .addCase(getAllDeceaseds.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllDeceaseds.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.plots = action.payload.deceaseds;
      })
      .addCase(getAllDeceaseds.rejected, (state, action) => {
        state.status = "idle";
        state.plots = [];
        state.error = action.error.message;
      })
      .addCase(getLawn.fulfilled, (state, action) => {
        state.lawn = action.payload.lawn;
        state.error = null;
      })
      .addCase(getLawn.rejected, (state, action) => {
        (state.lawn = null), (state.error = action.error.message);
      })
      .addCase(searchQuery.pending, (state) => {
        state.searchStatus = "loading";
      })
      .addCase(searchQuery.fulfilled, (state, action) => {
        state.searchResult = action.payload;
        (state.searchStatus = "done"), (state.searchError = null);
      })
      .addCase(searchQuery.rejected, (state, action) => {
        (state.searchStatus = "done"),
          (state.searchError = action.error.message);
      })
      .addCase(getPlotInfo.pending, (state) => {
        state.plotInfoStatus = "loading";
      })
      .addCase(getPlotInfo.fulfilled, (state, action) => {
        state.plotInfoError = null;
        state.plotInfoStatus = "done";
        state.plotInfo = action.payload;
      })
      .addCase(getPlotInfo.rejected, (state, action) => {
        (state.plotInfoStatus = "done"),
          (state.plotInfoError = action.error.message);
      })
      .addCase(getLoginHistroy.fulfilled, (state, action) => {
        state.loginHistory = action.payload.data;
      })
      .addCase(getLoginHistroy.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateUsername.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getAreaPlots.pending, (state) => {
        state.areaPlotsLoading = "loading";
      })
      .addCase(getAreaPlots.fulfilled, (state, action) => {
        state.areaPlots = action.payload?.data || [];
        state.areaPlotsLoading = "fetched";
      })
      .addCase(getAreaPlots.rejected, (state, action) => {
        state.error = action.error.message;
        state.areaPlotsLoading = "idle";
      });
  },
});

export const {
  reset,
  resetLawn,
  clearSystemError,
  clearLoginHistory,
  clearAreaPlots,
} = restApiSlice.actions;
export default restApiSlice.reducer;
