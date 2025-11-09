import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../features/api/baseApi";
import authReducer from "../features/auth/authSlice";
import orgContextReducer from "./orgContextSlice";
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
      orgContext: orgContextReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
