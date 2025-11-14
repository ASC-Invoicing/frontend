// features/users/user-slice.ts
import { baseApi } from "../api/baseApi";

// ---------- Types ----------
export interface UserProfile {
  UID: string;
  FirstName: string;
  LastName: string;
  Email: string;
  AuthMethod: string;
  JoinedAt: string;
}

export interface UserProfileResponse {
  data: UserProfile;
  message: string;
  success: boolean;
}

export interface UpdateUserProfilePayload {
  FirstName: string;
  LastName: string;
}

export interface ChangePasswordPayload {
  OldPassword: string;
  NewPassword: string;
}

export interface PasswordChangeResponse {
  data: { message: string };
  message: string;
  success: boolean;
}

// ---------- API Slice ----------
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET USER PROFILE
    getUserProfile: builder.query<UserProfileResponse, void>({
      query: () => ({
        url: `/users/data`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // UPDATE PROFILE
    updateUserProfile: builder.mutation<UserProfileResponse, UpdateUserProfilePayload>({
      query: (body) => ({
        url: `/users/data`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // CHANGE PASSWORD
    changePassword: builder.mutation<PasswordChangeResponse, ChangePasswordPayload>({
      query: (body) => ({
        url: `/users/change-password`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
} = userApi;
