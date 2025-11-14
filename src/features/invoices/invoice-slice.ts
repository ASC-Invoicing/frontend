import type { Key } from "react";
import { baseApi } from "../api/baseApi";

export interface LineItem {
    UID?: string;
    Description: string;
    Quantity: number;
    UnitPrice: number;
    TaxRate: number;
    ProductUID?: string;
    Subtotal?: number;
    Tax?: number;
    Total?: number;
}

export interface Business {
    UID: string;
    CompanyName: string;
    TIN: string;
    TaxOffice: string;
    RCNumber: string;
    PhoneNumber: string;
    BusinessEmail: string;
    Verified: boolean;
    LastVerifiedAt: string;
}

export interface Organization {
    UID: string;
    Slug: string;
    CompanyName: string;
    TIN: string;
    TINVerified: boolean;
    CreatedAt: string;
}

export interface Invoice {
    id?: Key;
    UID: string;
    IRN: string;
    InvoiceDate: string;
    DueDate: string;
    Status: string;
    FIRSStatus: string;
    Notes: string;
    Organization: Organization;
    Business: Business;
    LineItems: LineItem[];
    Subtotal: number;
    TaxVAT: number;
    Total: number;
    CreatedAt: string;
}

export interface InvoiceResponse {
    data: Invoice;
    message: string;
    success: boolean;
}

export interface InvoiceListResponse {
    data: Invoice[];
    message: string;
    success: boolean;
    meta: {
        Limit: number;
        Page: number;
        Total: number;
    };
}

export interface CreateInvoicePayload {
    InvoiceDate: string;
    DueDate: string;
    BusinessTIN: string;
    Notes?: string;
    SubmitToFIRS?: boolean;
    LineItems: LineItem[];
}

export interface AddLineItemPayload {
    InvoiceUID: string;
    Description: string;
    Quantity: number;
    UnitPrice: number;
    TaxRate: number;
    ProductUID?: string;
}

// ---------- API ----------
export const invoiceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createInvoice: builder.mutation<InvoiceResponse, { orgUID: string } & CreateInvoicePayload>({
            query: ({ orgUID, ...body }) => ({
                url: `/organizations/${orgUID}/invoices`,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Invoices", id: "LIST" }],
        }),

        listInvoices: builder.query<InvoiceListResponse, { orgUID: string }>({
            query: ({ orgUID }) => ({
                url: `/organizations/${orgUID}/invoices`,
                method: "GET",
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ UID }) => ({
                            type: "Invoices" as const,
                            id: UID,
                        })),
                        { type: "Invoices", id: "LIST" },
                    ]
                    : [{ type: "Invoices", id: "LIST" }],
        }),

        viewInvoice: builder.query<InvoiceResponse, { orgUID: string; invoiceUID: string }>({
            query: ({ orgUID, invoiceUID }) => ({
                url: `/organizations/${orgUID}/invoices/${invoiceUID}`,
                method: "GET",
            }),
            providesTags: (result, error, arg) => [{ type: "Invoices", id: arg.invoiceUID }],
        }),

        addLineItem: builder.mutation<
            any,
            {
                orgUID: string;
                InvoiceUID: string;
                Description: string;
                Quantity: number;
                UnitPrice: number;
                TaxRate: number;
                ProductUID?: string;
            }
        >({
            query: ({ orgUID, ...body }) => ({
                url: `/organizations/${orgUID}/invoices/line-items`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Invoices", id: arg.InvoiceUID },
            ],
        }),

        updateLineItem: builder.mutation<
            any,
            {
                orgUID: string;
                invoiceUID: string;
                lineItemUID: string;
                Description?: string;
                Quantity?: number;
                UnitPrice?: number;
                TaxRate?: number;
            }
        >({
            query: ({ orgUID, invoiceUID, lineItemUID, ...body }) => ({
                url: `/organizations/${orgUID}/invoices/${invoiceUID}/line-items/${lineItemUID}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Invoices", id: arg.invoiceUID },
            ],
        }),

        deleteLineItem: builder.mutation<
            void,
            { orgUID: string; invoiceUID: string; lineItemUID: string }
        >({
            query: ({ orgUID, invoiceUID, lineItemUID }) => ({
                url: `/organizations/${orgUID}/invoices/${invoiceUID}/line-items/${lineItemUID}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Invoices", id: arg.invoiceUID },
            ],
        }),

        updateInvoice: builder.mutation<
            InvoiceResponse,
            {
                orgUID: string;
                invoiceUID: string;
                InvoiceDate?: string;
                DueDate?: string;
                BusinessTIN?: string;
                Notes?: string;
                SubmitToFIRS?: boolean;
            }
        >({
            query: ({ orgUID, invoiceUID, ...body }) => ({
                url: `/organizations/${orgUID}/invoices/${invoiceUID}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Invoices", id: arg.invoiceUID },
                { type: "Invoices", id: "LIST" },
            ],
        })

    }),
});

export const {
    useCreateInvoiceMutation,
    useListInvoicesQuery,
    useViewInvoiceQuery,
    useAddLineItemMutation,
    useUpdateLineItemMutation,
    useDeleteLineItemMutation,
    useUpdateInvoiceMutation,
} = invoiceApi;
