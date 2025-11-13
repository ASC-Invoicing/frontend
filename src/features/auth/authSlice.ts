import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation<
            {
                data: { message: string };
                message: string;
                success: boolean;
            },
            {
                Email: string;
                Password: string;
                FirstName: string;
                LastName: string;
            }
        >({
            query: (body) => ({
                url: "/auth/signup",
                method: "POST",
                body,
            }),
        }),

        verifyEmail: builder.query({
            query: (token) => ({
                url: `/auth/verify?token=${token}`,
                method: "GET",
            }),
        }),

        login: builder.mutation<
            {
                data: {
                    Email: string;
                    FirstName: string;
                    LastName: string;
                    message: string;
                    token?: string;
                    user?: any;
                };
                message: string;
                success: boolean;
            },
            {
                Email: string;
                Password: string;
            }
        >({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            }),
        }),

        getUserProfile: builder.query<
            {
                data: {
                    UID: string;
                    FirstName: string;
                    LastName: string;
                    Email: string;
                    AuthMethod: string;
                    JoinedAt: string;
                };
                message: string;
                success: boolean;
            },
            void
        >({
            query: () => ({
                url: "/users/data",
                method: "GET",
            }),
        }),

        logoutUser: builder.mutation<
            { message: string },
            void
        >({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),

        forgotPassword: builder.mutation<
            { data: { message: string }; message: string; success: boolean },
            { Email: string }
        >({
            query: (body) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body,
            }),
        }),

        resetPassword: builder.mutation<
            { data: { message: string }; message: string; success: boolean },
            { token: string; NewPassword: string }
        >({
            query: ({ token, NewPassword }) => ({
                url: `/auth/reset-password?token=${token}`,
                method: "POST",
                body: { NewPassword },
            }),
        }),

    }),
});

export const {
    useSignupMutation,
    useVerifyEmailQuery,
    useLoginMutation,
    useGetUserProfileQuery,
    useLogoutUserMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = authApi;

interface User {
    FirstName?: string;
    LastName?: string;
    Email?: string;
    Role?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    hydrated: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    hydrated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.hydrated = true;
            localStorage.setItem("auth", JSON.stringify(state));
        },
        loadStoredAuth: (state) => {
            const stored = localStorage.getItem("auth");
            if (stored) {
                const parsed = JSON.parse(stored);
                state.user = parsed.user;
                state.token = parsed.token;
                state.isAuthenticated = parsed.isAuthenticated;
            }
            state.hydrated = true;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.hydrated = true;
            localStorage.removeItem("auth");
        },
    },
});

export const { setCredentials, loadStoredAuth, logout } = authSlice.actions;
export default authSlice.reducer;
