import { instance } from "../app/instance";
import { verifyUser, setUser } from "../features/authServices";
import axios from "axios";

const { CancelToken, isCancel } = axios;
const cancelSource = CancelToken.source();

export const authenticatedRequestPostAndPatch = async (
  body,
  endPoint,
  dispatch,
  getState,
  isPost = true,
  thunkSignal = undefined
) => {
  let user = getState().auth.user;

  if (!user || !user?.token) {
    throw new Error("Unknown User Found");
  }

  try {
    const token = user.token;
    let response;

    if (isPost) {
      response = await instance.post(endPoint, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: thunkSignal ? thunkSignal : undefined,
      });
    } else {
      response = await instance.patch(endPoint, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: thunkSignal ? thunkSignal : undefined,
      });
    }
    return response.data;
  } catch (error) {
    if (isCancel(error)) {
      throwError("Request Cancelled");
    }
    if (error.response && error.response.status == 401) {
      await dispatch(verifyUser());
      await dispatch(setUser());

      let newUser = getState().auth.user;
      let reResponse;
      try {
        if (isPost) {
          reResponse = await instance.post(endPoint, body, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: thunkSignal ? thunkSignal : undefined,
          });
        } else {
          reResponse = await instance.patch(endPoint, body, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: thunkSignal ? thunkSignal : undefined,
          });
        }

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
};

export const authenticatedRequest = async (
  endPoint,
  dispatch,
  getState,
  thunkSignal = undefined
) => {
  let user = getState().auth.user;

  if (!user || !user?.token) {
    return [];
  }
  try {
    const token = user.token;

    const response = await instance.get(endPoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: thunkSignal ? thunkSignal : undefined,
    });
    return response.data;
  } catch (error) {
    if (isCancel(error)) {
      throwError("Request Cancelled");
    }
    if (error.response && error.response.status === 401) {
      //meaning the error is about the validity of access token
      await dispatch(verifyUser());
      await dispatch(setUser());

      let newUser = getState().auth.user;

      try {
        // retry the request
        const reResponse = await instance.get(endPoint, {
          headers: {
            Authorization: `Bearer ${newUser.token}`,
          },
        });
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
};

export const throwError = (err) => {
  const error = err.message;

  throw new Error(error);
};
