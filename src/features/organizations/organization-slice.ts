import type { Key } from "react";
import { baseApi } from "../api/baseApi";

export interface Organization {
  id?: Key;
  UID: string;
  Slug: string;
  CompanyName: string;
  TIN: string;
  TaxOffice: string;
  RCNumber: string;
  PhoneNumber: string;
  BusinessEmail: string;
  TINVerified: boolean;
  CreatedAt: string;
}

export interface TinVerificationResponse {
  data: {
    CompanyName: string;
    BusinessAddress: string;
    TaxOffice: string;
    RCNumber: string;
    PhoneNumber: string;
    BusinessEmail: string;
    Industry: string;
    Verified: boolean;
  };
  message: string;
  success: boolean;
}

export interface CreateOrganizationResponse {
  data: Organization;
  message: string;
  success: boolean;
}

export interface ListOrganizationsResponse {
  data: Organization[];
  message: string;
  success: boolean;
}

export const organizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyTIN: builder.mutation<TinVerificationResponse, string>({
      query: (tin) => ({
        url: `/organizations/verify/tin/${tin}`,
        method: "GET",
      }),
    }),
    createOrganization: builder.mutation<CreateOrganizationResponse, { CompanyName: string; TIN: string }>({
      query: (body) => ({ url: "/organizations", method: "POST", body }),
      invalidatesTags: [{ type: "Organizations", id: "LIST" }], 
    }),

    listOrganizations: builder.query<ListOrganizationsResponse, void>({
      query: () => ({ url: "/organizations/all", method: "GET" }),
      providesTags: (result) =>
        result
          ? [
            ...result.data.map(({ UID }) => ({ type: "Organizations" as const, id: UID })),
            { type: "Organizations", id: "LIST" },
          ]
          : [{ type: "Organizations", id: "LIST" }],
    }),

  }),
});


export const {
  useVerifyTINMutation,
  useCreateOrganizationMutation,
  useListOrganizationsQuery,
} = organizationApi;
