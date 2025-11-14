export interface AuditLog {
    UID: string;
    Description: string;
    Actor: string;
    Status: string;
    EventType: string;
    Severity: string;
    Resource: string;
    Category: string;
    Environment: string;
    ResourceType: string;
    Metadata: Record<string, any>;
    UserAgent: string;
    CreatedAt: string;
}

export interface AuditLogListResponse {
    data: AuditLog[];
    message: string;
    success: boolean;
    meta: {
        Limit: number;
        Page: number;
        Total: number;
    };
}

export interface AuditLogDetailResponse {
    data: AuditLog;
    message: string;
    success: boolean;
}


