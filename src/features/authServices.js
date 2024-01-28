import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../app/instance";

const initialState = {
  status: "idle",
  error: null,
  response: null,
  userError: null,
  role: undefined,
  user: {},
  user_changepass_credential: undefined,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (credential) => {
    try {
      const response = await instance.post("/auth/register", credential);

      return response.data;
    } catch (error) {
      if (error?.name === "AxiosError") {
        if (
          error.response.data.error ==
          "Something went wrong: check the error log for error details"
        ) {
          throw new Error("System Error: Please try again later");
        }
        throw new Error(error.response.data.error);
      } else {
        throw new Error("System Error: Please try again later");
      }
    }
  }
);

export const loginUser = createAsyncThunk("/auth/login", async (credential) => {
  try {
    const response = await instance.post("/auth/login", credential);

    return response.data;
  } catch (error) {
    if (error?.name === "AxiosError") {
      if (
        error.response.data.error ==
        "Something went wrong: check the error log for error details"
      ) {
        throw new Error("System Error: Please try again later");
      }
      throw new Error(error.response.data.error);
    } else {
      throw new Error("System Error: Please try again later");
    }
  }
});

export const forgotPassDispatch = createAsyncThunk(
  "/auth/forgot_pass",
  async (credential) => {
    try {
      const response = await instance.post("/auth/forgot_pass", credential);

      return response.data;
    } catch (error) {
      if (error?.name === "AxiosError") {
        if (
          error.response.data.error ==
          "Something went wrong: check the error log for error details"
        ) {
          throw new Error("System Error: Please try again later");
        }
        throw new Error(error.response.data.error);
      } else {
        throw new Error("System Error: Please try again later");
      }
    }
  }
);

export const validateCanChangepass = createAsyncThunk(
  "/auth/can_changepass/:token",
  async (token) => {
    try {
      const response = await instance.get(`/auth/can_changepass/${token}`);

      return response.data;
    } catch (error) {
      if (error?.name === "AxiosError") {
        if (
          error.response.data.error ==
          "Something went wrong: check the error log for error details"
        ) {
          throw new Error("System Error: Please try again later");
        }
        throw new Error(error.response.data.error);
      } else {
        throw new Error("System Error: Please try again later");
      }
    }
  }
);

export const changePassPost = createAsyncThunk(
  "/auth/changepass",
  async (data) => {
    try {
      const response = await instance.post("/auth/changepass", data);

      return response.data;
    } catch (error) {
      if (error?.name === "AxiosError") {
        if (
          error.response.data.error ==
          "Something went wrong: check the error log for error details"
        ) {
          throw new Error("System Error: Please try again later");
        }
        throw new Error(error.response.data.error);
      } else {
        throw new Error("System Error: Please try again later");
      }
    }
  }
);

export const sendEmail = createAsyncThunk("/auth/sendmail", async (data) => {
  try {
    const response = await instance.post("/auth/sendmail", data);

    return response.data;
  } catch (error) {
    if (error?.name === "AxiosError") {
      if (
        error.response.data.error ==
        "Something went wrong: check the error log for error details"
      ) {
        throw new Error("System Error: Please try again later");
      }
      throw new Error(error.response.data.error);
    } else {
      throw new Error("System Error: Please try again later");
    }
  }
});

export const verifyUser = createAsyncThunk(
  "auth/verify",
  async (_, { getState }) => {
    try {
      const state = getState();

      if (!state.auth.user.token || !state.auth.user.email) {
        return {};
      }

      const response = await instance.post(
        "/auth/verify",
        {
          email: state.auth.user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${state.auth.user.token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      localStorage.clear();
      if (error.response) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error(error.message);
      }
    }
  }
);

export const getUserRole = createAsyncThunk("auth/role", async (email) => {
  try {
    const response = await instance.get(`/auth/role/${email}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error(error.message);
    }
  }
});

export const logout = createAsyncThunk("auth/logout", async (email) => {
  try {
    const response = await instance.post("/auth/logout", { email });

    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearLoadingErrorState: (state) => {
      state.error = null;
      state.status = "idle";
      state.response = null;
    },
    setUser: (state, action) => {
      state.user = {
        token: localStorage.getItem("token") || null,
        email: localStorage.getItem("email") || null,
        username: localStorage.getItem("username") || null,
      };
    },
    clearError: (state) => {
      state.userError = null;
    },
    // make an endpoint in backend that verify the token found in local storage if there is
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.error = null;
        state.response = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.state = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.error = null;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("email", action.payload.email);
        localStorage.setItem("username", action.payload.username);
        state.user = {
          token: action.payload.token,
          email: action.payload.email,
          username: action.payload.username,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        (state.status = "idle"), (state.success = false);
        state.error = action.error.message;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.user = action.payload;
        if (action.payload?.token && action.payload?.email) {
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("email", action.payload.email);
          localStorage.setItem("username", action.payload.username);
        }
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.user = {};
        state.userError = action.error.message;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.user = {};
        state.userError = null;
        state.error = null;
        state.role = undefined;
      })
      .addCase(logout.rejected, (state, action) => {
        localStorage.clear();
        state.user = {};
        state.error = null;
      })
      .addCase(getUserRole.fulfilled, (state, action) => {
        state.userError = null;
        state.role = action.payload.role;
      })
      .addCase(getUserRole.rejected, (state, action) => {
        (state.role = undefined), (state.userError = action.error.message);
      })
      .addCase(validateCanChangepass.fulfilled, (state, action) => {
        state.user_changepass_credential = action.payload.data;
      })
      .addCase(validateCanChangepass.rejected, (state, action) => {
        state.user_changepass_credential = "Not Allowed";
      })
      .addCase(changePassPost.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(changePassPost.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(sendEmail.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { clearLoadingErrorState, setUser, clearError } =
  authSlice.actions;

export default authSlice.reducer;
