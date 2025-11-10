// import React, { useState } from "react";
// import { Search, Plus, Upload, Pencil, FileText } from "lucide-react";
// import { Button, Input } from "../../components/ui";
// import { DataTable } from "../../components/ui/table";
// import { Header } from "../../components/header";
// import { usePagination } from "../../hooks/usePagination";
// import type { TablePaginationConfig } from "antd";
// import { Link } from "react-router-dom";


// type InvoiceStatus = "draft" | "submitted" | "validated" | "paid";
// type FirsStatus = "pending" | "rejected" | "validated";

// interface Invoice {
//     id: string;
//     customerName: string;
//     customerTIN: string;
//     date: string;
//     dueDate: string;
//     amount: number;
//     status: InvoiceStatus;
//     firsStatus: FirsStatus;
// }


// const mockInvoices: Invoice[] = [
//     { id: "INV-2024-002", customerName: "MTN Nigeria", customerTIN: "TIN: 87654321-0001", date: "Dec 5, 2024", dueDate: "Jan 5, 2025", amount: 537500, status: "submitted", firsStatus: "pending" },
//     { id: "INV-2024-003", customerName: "Access Bank PLC", customerTIN: "TIN: 45678912-0001", date: "Nov 15, 2024", dueDate: "Dec 15, 2024", amount: 322500, status: "submitted", firsStatus: "rejected" },
//     { id: "INV-2024-004", customerName: "Dangote Group", customerTIN: "TIN: 12345678-0001", date: "Oct 25, 2024", dueDate: "Nov 25, 2024", amount: 806250, status: "submitted", firsStatus: "validated" },
//     { id: "INV-2024-005", customerName: "Dangote Group", customerTIN: "TIN: 12345678-0001", date: "Dec 1, 2024", dueDate: "Dec 31, 2024", amount: 537500, status: "draft", firsStatus: "pending" },
//     { id: "INV-2024-006", customerName: "MTN Nigeria", customerTIN: "TIN: 87654321-0001", date: "Dec 5, 2024", dueDate: "Jan 5, 2025", amount: 537500, status: "submitted", firsStatus: "pending" },
//     { id: "INV-2024-007", customerName: "Access Bank PLC", customerTIN: "TIN: 45678912-0001", date: "Nov 15, 2024", dueDate: "Dec 15, 2024", amount: 322500, status: "submitted", firsStatus: "rejected" },
//     { id: "INV-2024-008", customerName: "Dangote Group", customerTIN: "TIN: 12345678-0001", date: "Oct 25, 2024", dueDate: "Nov 25, 2024", amount: 806250, status: "submitted", firsStatus: "validated" },
//     { id: "INV-2024-009", customerName: "Dangote Group", customerTIN: "TIN: 12345678-0001", date: "Dec 1, 2024", dueDate: "Dec 31, 2024", amount: 537500, status: "draft", firsStatus: "pending" },
//     { id: "INV-2024-0010", customerName: "MTN Nigeria", customerTIN: "TIN: 87654321-0001", date: "Dec 5, 2024", dueDate: "Jan 5, 2025", amount: 537500, status: "submitted", firsStatus: "pending" },
//     { id: "INV-2024-0011", customerName: "Access Bank PLC", customerTIN: "TIN: 45678912-0001", date: "Nov 15, 2024", dueDate: "Dec 15, 2024", amount: 322500, status: "submitted", firsStatus: "rejected" },
//     { id: "INV-2024-0012", customerName: "Dangote Group", customerTIN: "TIN: 12345678-0001", date: "Oct 25, 2024", dueDate: "Nov 25, 2024", amount: 806250, status: "submitted", firsStatus: "validated" },
//     { id: "INV-2024-0013", customerName: "Dangote Group", customerTIN: "TIN: 12345678-0001", date: "Dec 1, 2024", dueDate: "Dec 31, 2024", amount: 537500, status: "draft", firsStatus: "pending" },
//     { id: "INV-2024-0014", customerName: "MTN Nigeria", customerTIN: "TIN: 87654321-0001", date: "Dec 5, 2024", dueDate: "Jan 5, 2025", amount: 537500, status: "submitted", firsStatus: "pending" },
//     { id: "INV-2024-0015", customerName: "Access Bank PLC", customerTIN: "TIN: 45678912-0001", date: "Nov 15, 2024", dueDate: "Dec 15, 2024", amount: 322500, status: "submitted", firsStatus: "rejected" },
//     { id: "INV-2024-0016", customerName: "Dangote Group", customerTIN: "TIN: 12345678-0001", date: "Oct 25, 2024", dueDate: "Nov 25, 2024", amount: 806250, status: "submitted", firsStatus: "validated" },
//     { id: "INV-2024-0017", customerName: "Dangote Group", customerTIN: "TIN: 12345678-0001", date: "Dec 1, 2024", dueDate: "Dec 31, 2024", amount: 537500, status: "draft", firsStatus: "pending" },
// ];

// const currencyFormatter = new Intl.NumberFormat("en-NG", {
//     style: "currency",
//     currency: "NGN",
//     minimumFractionDigits: 2,
// });


// const StatusTag: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
//     const colors: Record<InvoiceStatus, string> = {
//         draft: "bg-gray-100 text-gray-600",
//         submitted: "bg-blue-100 text-blue-700",
//         validated: "bg-green-100 text-green-700",
//         paid: "bg-indigo-100 text-indigo-700",
//     };

//     return (
//         <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${colors[status]}`}>
//             {status}
//         </span>
//     );
// };

// const FirsStatusTag: React.FC<{ status: FirsStatus }> = ({ status }) => {
//     const colors: Record<FirsStatus, string> = {
//         pending: "bg-yellow-100 text-yellow-700",
//         rejected: "bg-red-100 text-red-700",
//         validated: "bg-green-100 text-green-700",
//     };

//     return (
//         <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${colors[status]}`}>
//             {status}
//         </span>
//     );
// };


// const FilterTabs: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({
//     activeTab,
//     setActiveTab,
// }) => {
//     const tabs = ["All", "Draft", "Submitted", "Validated", "Paid"];

//     return (
//         <div className="flex flex-wrap bg-[#F4F4F5] p-1 gap-4">
//             {tabs.map((tab) => (
//                 <button
//                     key={tab}
//                     onClick={() => setActiveTab(tab)}
//                     className={`p-2 text-sm font-medium cursor-pointer transition-colors ${activeTab === tab
//                         ? "text-[#00000] !bg-[#ffff]"
//                         : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
//                         }`}
//                 >
//                     {tab}
//                 </button>
//             ))}
//         </div>
//     );
// };


// const InvoicesPage: React.FC = () => {
//     const [activeTab, setActiveTab] = useState("All");
//     const [searchTerm, setSearchTerm] = useState("");
//     const { page, pageSize, onPageChange } = usePagination(10);

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchTerm(e.target.value);
//     };

//     const handleTableChange = (
//         pagination: TablePaginationConfig,
//     ) => {
//         onPageChange(
//             pagination.current ?? 1,
//             pagination.pageSize ?? pageSize
//         );
//     };


//     const filteredInvoices = mockInvoices.filter((invoice) => {
//         const matchesSearch =
//             invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
//         if (activeTab === "All") return matchesSearch;
//         return matchesSearch && invoice.status === activeTab.toLowerCase();
//     });


//     const startIndex = (page - 1) * pageSize;
//     const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + pageSize);


//     const columns = [
//         {
//             title: "Invoice #",
//             dataIndex: "id",
//             key: "id",
//             render: (text: string) => <span className="font-semibold text-gray-900">{text}</span>,
//         },
//         {
//             title: "Customer",
//             dataIndex: "customerName",
//             key: "customer",
//             render: (_: any, record: Invoice) => (
//                 <div>
//                     <div className="text-sm font-medium text-gray-900">{record.customerName}</div>
//                     <div className="text-xs text-gray-500">{record.customerTIN}</div>
//                 </div>
//             ),
//         },
//         { title: "Date", dataIndex: "date", key: "date" },
//         { title: "Due Date", dataIndex: "dueDate", key: "dueDate" },
//         {
//             title: "Amount",
//             dataIndex: "amount",
//             key: "amount",
//             render: (amount: number) => (
//                 <span className="font-semibold text-gray-900">{currencyFormatter.format(amount)}</span>
//             ),
//         },
//         { title: "Status", key: "status", render: (_: any, r: Invoice) => <StatusTag status={r.status} /> },
//         { title: "FIRS Status", key: "firsStatus", render: (_: any, r: Invoice) => <FirsStatusTag status={r.firsStatus} /> },
//         {
//             title: "Actions",
//             key: "actions",
//             render: () => (
//                 <button className="text-[#2563EB] cursor-pointer hover:text-[#00786F] p-1 rounded-md transition-colors">
//                     <Pencil className="w-4 h-4" />
//                 </button>
//             ),
//         },
//     ];

//     return (
//         <div className="flex flex-col font-sans min-h-screen">
//             {/* Header */}
//             <Header
//                 icon={<FileText className="w-6 h-6 text-[#00786F]" />}
//                 title="Invoices"
//                 description="Manage and track all your invoices"
//                 actions={[
//                     <Button
//                         key="upload"
//                         icon={<Upload className="w-4 h-4" />}
//                         className="bg-[#ffffff] !text-[#000000] shadow-xs hover:bg-gray-100 border border-gray-200"
//                     >
//                         Bulk Upload
//                     </Button>,

//                   <Link to="create-invoice">
//                         <Button
//                             key="create"
//                             variant="solid"
//                             icon={<Plus className="w-4 h-4" />}
//                             className="shadow-md"
//                         >
//                             Create Invoice
//                         </Button>
//                     </Link>
//                 ]}
//             />


//             {/* Search and Filter Row */}
//             <div className="py-3 ">
//                 <div className="flex flex-col sm:flex-row justify-between gap-6">
//                     <div className="relative flex-grow max-w-full">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                         <Input
//                             icon={<Search className="w-5 h-5" />}
//                             placeholder="Search invoices by number or customer..."
//                             type="text"
//                             name="search"
//                             value={searchTerm}
//                             onChange={handleSearchChange}
//                         >
//                         </Input>
//                     </div>

//                     {/* Filter Tabs */}
//                     <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
//                 </div>
//             </div>

//             {/* Table */}
//             <main className="py-4 flex-grow">
//                 <DataTable
//                     columns={columns}
//                     dataSource={paginatedInvoices}
//                     loading={false}
//                     total={filteredInvoices.length}
//                     currentPage={page}
//                     pageSize={pageSize}
//                     onPageChange={onPageChange}
//                     title="Invoice List"
//                     bordered
//                 />
//             </main>
//         </div>
//     );
// };

// export default InvoicesPage;







import React, { useState, useMemo } from "react";
import { Search, Plus, Upload, Pencil, FileText } from "lucide-react";
import { Button, Input } from "../../components/ui";
import { DataTable } from "../../components/ui/table";
import { Header } from "../../components/header";
import { usePagination } from "../../hooks/usePagination";
import type { TablePaginationConfig } from "antd";
import { Link, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { useListInvoicesQuery,  } from "../../features/invoices/invoice-slice";
import type { RootState } from "../../store";
import type { Organization } from "../../features/organizations/organization-slice";

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
            title: "Invoice #",
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
                <Link to={`/invoices/${record.UID}`}>
                    <button className="text-[#2563EB] cursor-pointer hover:text-[#00786F] p-1 rounded-md transition-colors">
                        <Pencil className="w-4 h-4" />
                    </button>
                </Link>
            ),
        },
    ];

    return (
        <div className="flex flex-col font-sans min-h-screen">
            <Header
                icon={<FileText className="w-6 h-6 text-[#00786F]" />}
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
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Search invoices by number or customer..."
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
