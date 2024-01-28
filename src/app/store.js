import { configureStore } from "@reduxjs/toolkit";
import nodeHandlerReducer from "../features/nodeHandlerSlice.js";
import authReducer from "../features/authServices.js";
import restApiReducer from "../features/restApiSlice.js";
import adminApiReducer from "../features/adminApi.js";

export const store = configureStore({
  reducer: {
    nodeHandler: nodeHandlerReducer,
    auth: authReducer,
    restApi: restApiReducer,
    adminApi: adminApiReducer,
  },
});
