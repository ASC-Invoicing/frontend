

import { baseApi } from "../api/baseApi";
import type { AuditLog, AuditLogListResponse, AuditLogDetailResponse } from "../../types/audit-logs";

export const auditApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        listAuditLogs: builder.query<
            AuditLogListResponse,
            { page: number; limit: number }
        >({
            query: ({ page, limit }) => ({
                url: `/audit-logs?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.data.map((log) => ({
                              type: "AuditLogs" as const,
                              id: log.UID,
                          })),
                          { type: "AuditLogs", id: "LIST" },
                      ]
                    : [{ type: "AuditLogs", id: "LIST" }],
        }),

        getAuditLog: builder.query<
            AuditLogDetailResponse,
            { uid: string }
        >({
            query: ({ uid }) => ({
                url: `/audit-logs/${uid}`,
                method: "GET",
            }),
            providesTags: (result, err, arg) => [
                { type: "AuditLogs", id: arg.uid },
            ],
        }),

        recentAuditLogs: builder.query<
            AuditLogListResponse,
            { environment: string }
        >({
            query: ({ environment }) => ({
                url: `/audit-logs/recent?environment=${environment}`,
                method: "GET",
            }),
            providesTags: [{ type: "AuditLogs", id: "RECENT" }],
        }),
    }),
});

export const {
    useListAuditLogsQuery,
    useGetAuditLogQuery,
    useRecentAuditLogsQuery,
} = auditApi;
