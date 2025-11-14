import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../store";
export const COOKIE_AUTH_PLACEHOLDER = "COOKIE_BASED_TOKEN_PLACEHOLDER";
const baseQuery = fetchBaseQuery({
  baseUrl: "https://staging.usesynctax.com",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");
    const state = getState() as RootState;
    const token = state.auth.token; 

    if (token && token !== COOKIE_AUTH_PLACEHOLDER) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQuery,
  tagTypes: ["Organizations", "Invoices", "Product", "Category", "AuditLogs"],
  endpoints: () => ({}),
});
