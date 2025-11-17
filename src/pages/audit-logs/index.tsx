import React, { useState, useMemo } from "react";
import { Search, Activity } from "lucide-react";
import { Input, Select, Modal } from "../../components/ui";
import { DataTable } from "../../components/ui/table";
import { Header } from "../../components/header";
import { usePagination } from "../../hooks/usePagination";
import {
    useListAuditLogsQuery,
    useGetAuditLogQuery,
} from "../../features/audit-logs/audit-logs-slice";
import { Spin } from "antd";

const ACTION_OPTIONS = [
    { label: "All Actions", value: "all" },
    { label: "Create", value: "create" },
    { label: "Update", value: "update" },
    { label: "Delete", value: "delete" },
    { label: "Submit", value: "submit" },
    { label: "Validate", value: "validate" },
    { label: "Reject", value: "reject" },
];

const ENTITY_OPTIONS = [
    { label: "All Entities", value: "all" },
    { label: "Invoices", value: "invoices" },
    { label: "Customers", value: "customers" },
    { label: "Products", value: "products" },
    { label: "Company", value: "company" },
    { label: "Users", value: "users" },
];

const AuditLogsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAction, setSelectedAction] = useState("all");
    const [selectedEntity, setSelectedEntity] = useState("all");

    const { page, pageSize, onPageChange } = usePagination(10);

    const { data, isLoading } = useListAuditLogsQuery({
        page,
        limit: pageSize,
    });

    const auditLogs = data?.data ?? [];
    const total = data?.meta?.Total ?? 0;

    // 🔹 Modal state for detail view
    const [selectedLogUID, setSelectedLogUID] = useState<string | null>(null);

    const { data: detailData, isFetching: detailLoading } = useGetAuditLogQuery(
        { uid: selectedLogUID! },
        { skip: !selectedLogUID }
    );

    // 🔹 Filtering
    const filteredLogs = useMemo(() => {
        return auditLogs.filter((log) => {
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                log.Actor?.toLowerCase().includes(search) ||
                log.EventType?.toLowerCase().includes(search) ||
                log.Resource?.toLowerCase().includes(search) ||
                log.Description?.toLowerCase().includes(search);

            const matchesAction =
                selectedAction === "all" ||
                log.EventType.toLowerCase().includes(selectedAction);

            const matchesEntity =
                selectedEntity === "all" ||
                log.Resource.toLowerCase().includes(selectedEntity);

            return matchesSearch && matchesAction && matchesEntity;
        });
    }, [auditLogs, searchTerm, selectedAction, selectedEntity]);

    const formatTimestamp = (value: string) => {
        const date = new Date(value);

        const formatted = date.toLocaleString("en-NG", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
        return formatted.replace(/am|pm/i, (m) => m.toUpperCase());
    };

    const tableData = filteredLogs.map((log) => ({
        key: log.UID,
        Timestamp: log.CreatedAt,
        User: log.Actor || "N/A",
        Action: log.EventType,
        Entity: log.Resource,
        Description: log.Description,
    }));



    const columns = [
        {
            title: "Timestamp",
            dataIndex: "Timestamp",
            key: "timestamp",
            render: (value: string) => <span>{formatTimestamp(value)}</span>,
        },
        {
            title: "User",
            dataIndex: "User",
            key: "user",
        },
        {
            title: "Action",
            dataIndex: "Action",
            key: "action",
            render: (text: string, row: any) => (
                <span
                    className="text-[#00A859] cursor-pointer font-medium"
                    onClick={() => setSelectedLogUID(row.key)}
                >
                    {text}
                </span>
            ),
        },
        {
            title: "Entity",
            dataIndex: "Entity",
            key: "entity",
        },
        {
            title: "Description",
            dataIndex: "Description",
            key: "description",
        },
    ];



    return (
        <div className="flex flex-col font-sans min-h-screen">
            <Header
                icon={<Activity className="w-6 h-6 text-[#00A859]" />}
                title="Audit Logs"
                description="Track all activities and changes in your organization"
            />

            {/* Filters */}
            <div className="py-3">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="relative flex-grow">
                        <Search className="absolute z-50 left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                        <Input
                            placeholder="       Search logs..."
                            value={searchTerm}
                            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="w-full sm:w-40">
                        <Select
                            options={ACTION_OPTIONS}
                            value={selectedAction}
                            onChange={setSelectedAction}
                        />
                    </div>

                    <div className="w-full sm:w-40">
                        <Select
                            options={ENTITY_OPTIONS}
                            value={selectedEntity}
                            onChange={setSelectedEntity}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <main className="py-4 flex-grow">
                <DataTable
                    columns={columns}
                    dataSource={tableData}
                    loading={isLoading}
                    total={total}
                    pageSize={pageSize}
                    currentPage={page}
                    onPageChange={onPageChange}
                    emptyText="No audit logs found"
                />
            </main>

            {/* Detail Modal */}
            <Modal
                open={!!selectedLogUID}
                title="Audit Log Details"
                onCancel={() => setSelectedLogUID(null)}
                width={600}
                footer={false}
            >
                {detailLoading ? (
                    <div className="py-10 flex justify-center">
                        <Spin size="large" />
                    </div>
                ) : detailData ? (
                    <div className="space-y-3 mt-5 text-sm">
                        <p><b>User:</b> {detailData.data.Actor}</p>
                        <p><b>Action:</b> {detailData.data.EventType}</p>
                        <p><b>Entity:</b> {detailData.data.Resource}</p>
                        <p><b>Description:</b> {detailData.data.Description}</p>
                        <p><b>Timestamp:</b> {formatTimestamp(detailData.data.CreatedAt)}</p>
                        <p><b>ID:</b> {detailData.data.UID}</p>
                    </div>
                ) : null}
            </Modal>
        </div>
    );
};

export default AuditLogsPage;
