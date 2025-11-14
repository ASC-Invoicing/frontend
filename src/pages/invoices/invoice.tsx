import React, { useState, useMemo } from "react";
import { Search, Plus, Upload, Pencil, FileText } from "lucide-react";
import { Button, Input } from "../../components/ui";
import { DataTable } from "../../components/ui/table";
import { Header } from "../../components/header";
import { usePagination } from "../../hooks/usePagination";
import { Link, useOutletContext } from "react-router-dom";
import type { Organization } from "../../features/organizations/organization-slice";
import { useListInvoicesQuery } from "../../features/invoices/invoice-slice";

type InvoiceStatus = "draft" | "submitted" | "validated" | "paid";
type FirsStatus = "pending" | "rejected" | "validated";


const currencyFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
});

const StatusTag: React.FC<{ status: string }> = ({ status }) => {
    const colors: Record<string, string> = {
        draft: "bg-gray-100 text-gray-600",
        submitted: "bg-blue-100 text-blue-700",
        validated: "bg-green-100 text-green-700",
        paid: "bg-indigo-100 text-indigo-700",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${colors[status] || "bg-gray-100 text-gray-600"
                }`}
        >
            {status}
        </span>
    );
};

const FirsStatusTag: React.FC<{ status: string }> = ({ status }) => {
    const colors: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-700",
        rejected: "bg-red-100 text-red-700",
        validated: "bg-green-100 text-green-700",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${colors[status] || "bg-gray-100 text-gray-600"
                }`}
        >
            {status}
        </span>
    );
};

const FilterTabs: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({
    activeTab,
    setActiveTab,
}) => {
    const tabs = ["All", "Draft", "Submitted", "Validated", "Paid"];

    return (
        <div className="flex flex-wrap bg-[#F4F4F5] p-1 gap-4">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`p-2 text-sm font-medium cursor-pointer transition-colors ${activeTab === tab
                        ? "text-[#00000] !bg-[#ffff]"
                        : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};
interface OutletContext {
    currentOrg: Organization | undefined;
}
const InvoicesPage: React.FC = () => {
    const { currentOrg } = useOutletContext<OutletContext>();
    const orgUID = currentOrg?.UID;
    const [activeTab, setActiveTab] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const { page, pageSize, onPageChange } = usePagination(10);


    const { data, isLoading } = useListInvoicesQuery({ orgUID }, { skip: !orgUID });

    const invoices = useMemo(() => data?.data || [], [data]);

    const filteredInvoices = invoices.filter((invoice) => {
        const matchesSearch =
            invoice.IRN?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.Business?.CompanyName?.toLowerCase().includes(searchTerm.toLowerCase());
        if (activeTab === "All") return matchesSearch;
        return matchesSearch && invoice.Status.toLowerCase() === activeTab.toLowerCase();
    });

    const startIndex = (page - 1) * pageSize;
    const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + pageSize);

    const columns = [
        {
            title: "INVOICE IRN",
            dataIndex: "IRN",
            key: "irn",
            render: (text: string) => <span className="font-semibold text-gray-900">{text}</span>,
        },
        {
            title: "Customer",
            key: "customer",
            render: (_: any, record: any) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">
                        {record.Business?.CompanyName}
                    </div>
                    <div className="text-xs text-gray-500">TIN: {record.Business?.TIN}</div>
                </div>
            ),
        },
        { title: "Date", dataIndex: "InvoiceDate", key: "date" },
        { title: "Due Date", dataIndex: "DueDate", key: "dueDate" },
        {
            title: "Amount",
            key: "total",
            render: (record: any) => (
                <span className="font-semibold text-gray-900">
                    {currencyFormatter.format(record.Total || 0)}
                </span>
            ),
        },
        { title: "Status", key: "status", render: (_: any, r: any) => <StatusTag status={r.Status} /> },
        { title: "FIRS Status", key: "firsStatus", render: (_: any, r: any) => <FirsStatusTag status={r.FIRSStatus} /> },
        {
            title: "Actions",
            key: "actions",
            render: (record: any) => (
                <Link to={`${record.UID}`}>
                    <button className="text-[#2563EB] cursor-pointer hover:text-[#00A859] p-1 rounded-md transition-colors">
                        <Pencil className="w-4 h-4" />
                    </button>
                </Link>
            ),
        },
    ];

    return (
        <div className="flex flex-col font-sans min-h-screen">
            <Header
                icon={<FileText className="w-6 h-6 text-[#00A859]" />}
                title="Invoices"
                description="Manage and track all your invoices"
                actions={[
                    <Button
                        key="upload"
                        icon={<Upload className="w-4 h-4" />}
                        className="bg-[#ffffff] !text-[#000000] shadow-xs hover:bg-gray-100 border border-gray-200"
                    >
                        Bulk Upload
                    </Button>,
                    <Link to="create-invoice" key="create">
                        <Button
                            variant="solid"
                            icon={<Plus className="w-4 h-4" />}
                            className="shadow-md"
                        >
                            Create Invoice
                        </Button>
                    </Link>,
                ]}
            />

            <div className="py-3 ">
                <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <div className="relative flex-grow max-w-full">
                        <Search className="z-50 absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                        <Input
                            placeholder="       Search invoices by number or customer..."
                            type="text"
                            name="search"
                            value={searchTerm}
                            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
            </div>

            <main className="py-4 flex-grow">
                <DataTable
                    columns={columns}
                    dataSource={paginatedInvoices}
                    loading={isLoading}
                    total={filteredInvoices.length}
                    currentPage={page}
                    pageSize={pageSize}
                    onPageChange={onPageChange}
                    title="Invoice List"
                    bordered
                />
            </main>
        </div>
    );
};

export default InvoicesPage;
