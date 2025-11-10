import type { Key } from "react";
import { baseApi } from "../api/baseApi";

// ---------- Types ----------
export interface ProductCategory {
  UID?: string;
  Name: string;
  Description?: string;
  CreatedAt?: string;
}

export interface Product {
  UID?: string;
  Name: string;
  Description?: string;
  Category?: ProductCategory;
  CategoryUID: string;
  UnitPrice: number;
  TaxRate: number;
  CreatedAt?: string;
}

export interface ProductResponse {
  data: Product;
  message: string;
  success: boolean;
}

export interface ProductListResponse {
  data: Product[];
  message: string;
  success: boolean;
  meta: {
    Limit: number;
    Page: number;
    Total: number;
  };
}

// ---------- Payload Types ----------
export interface CreateProductCategoryPayload {
  Name: string;
  Description?: string;
}

export interface UpdateProductCategoryPayload extends CreateProductCategoryPayload {
  UID: string;
}

export interface CreateProductPayload {
  Name: string;
  Description?: string;
  CategoryUID: string;
  UnitPrice: number;
  TaxRate: number;
}

export interface UpdateProductPayload extends CreateProductPayload {
  UID: string;
}

// ---------- API Slice ----------
export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ----- Product Categories -----
    listCategories: builder.query<{ data: ProductCategory[] }, void>({
      query: () => `/product-categories`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ UID }) => ({
                type: "Category" as const,
                id: UID,
              })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    createCategory: builder.mutation<ProductResponse, CreateProductCategoryPayload>({
      query: (body) => ({
        url: `/product-categories`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    updateCategory: builder.mutation<ProductResponse, UpdateProductCategoryPayload>({
      query: ({ UID, ...body }) => ({
        url: `/product-categories/${UID}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Category", id: arg.UID }],
    }),

    deleteCategory: builder.mutation<ProductResponse, { UID: string }>({
      query: ({ UID }) => ({
        url: `/product-categories/${UID}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Category", id: arg.UID }],
    }),

    // ----- Products (ORG-SCOPED) -----
    listProducts: builder.query<ProductListResponse, { orgUID: string }>({
      query: ({ orgUID }) => ({
        url: `/organizations/${orgUID}/products`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ UID }) => ({
                type: "Product" as const,
                id: UID,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    getProduct: builder.query<ProductResponse, { orgUID: string; UID: string }>({
      query: ({ orgUID, UID }) => ({
        url: `/organizations/${orgUID}/products/${UID}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [{ type: "Product", id: arg.UID }],
    }),

    createProduct: builder.mutation<ProductResponse, { orgUID: string } & CreateProductPayload>({
      query: ({ orgUID, ...body }) => ({
        url: `/organizations/${orgUID}/products`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    updateProduct: builder.mutation<ProductResponse, { orgUID: string } & UpdateProductPayload>({
      query: ({ orgUID, UID, ...body }) => ({
        url: `/organizations/${orgUID}/products/${UID}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Product", id: arg.UID }],
    }),

    deleteProduct: builder.mutation<ProductResponse, { orgUID: string; UID: string }>({
      query: ({ orgUID, UID }) => ({
        url: `/organizations/${orgUID}/products/${UID}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Product", id: arg.UID }],
    }),
  }),
});

export const {
  // Categories
  useListCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,

  // Products
  useListProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
