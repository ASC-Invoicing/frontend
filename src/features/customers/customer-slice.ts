import { baseApi } from "../api/baseApi";

// ---------- Types ----------
export interface Customer {
  UID: string;
  CompanyName: string;
  TIN: string;
  TaxOffice: string;
  RCNumber?: string;
  PhoneNumber?: string;
  BusinessEmail?: string;
  Verified: boolean;
  LastVerifiedAt?: string;
}

export interface CustomerListResponse {
  data: Customer[];
  message: string;
  success: boolean;
  meta: {
    Limit: number;
    Page: number;
    Total: number;
  };
}

export interface CustomerResponse {
  data: Customer;
  message: string;
  success: boolean;
}

// Invoices for a specific customer
export interface CustomerInvoice {
  [x: string]: any;
  CustomerName: any;
  UID: string;
  IRN: string;
  InvoiceDate: string;
  DueDate: string;
  Total: number;
  Status: string;
  FIRSStatus: string;
  Business?: {
    CompanyName: string;
    TIN: string;
  };
}

export interface CustomerInvoiceListResponse {
  data: CustomerInvoice[];
  message: string;
  success: boolean;
  meta: {
    Limit: number;
    Page: number;
    Total: number;
  };
}

// ---------- API Slice ----------
export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCustomers: builder.query<
      CustomerListResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) =>
        `/customers?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((c) => ({
                type: "Customer" as const,
                id: c.UID,
              })),
              { type: "Customer", id: "LIST" },
            ]
          : [{ type: "Customer", id: "LIST" }],
    }),

    getCustomer: builder.query<CustomerResponse, { UID: string }>({
      query: ({ UID }) => `/customers/${UID}`,
      providesTags: (result, error, arg) => [
        { type: "Customer", id: arg.UID },
      ],
    }),

    listCustomerInvoices: builder.query<
      CustomerInvoiceListResponse,
      { UID: string; page: number; limit: number }
    >({
      query: ({ UID, page, limit }) =>
        `/customers/${UID}/invoices?page=${page}&limit=${limit}`,
      providesTags: (result, error, arg) => [
        { type: "CustomerInvoice", id: arg.UID },
      ],
    }),
  }),
});

export const {
  useListCustomersQuery,
  useGetCustomerQuery,
  useListCustomerInvoicesQuery,
} = customerApi;
