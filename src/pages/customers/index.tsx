import React, { useState } from "react";
import { Search, Plus, Mail, Phone, User } from "lucide-react";
import { Button, Input } from "../../components/ui";
import { DataTable } from "../../components/ui/table";
import { Header } from "../../components/header";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useListCustomersQuery } from "../../features/customers/customer-slice";

const CustomersPage: React.FC = () => {
    const navigate = useNavigate();
    const { orgSlug } = useParams();
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading } = useListCustomersQuery({
        page: 1,
        limit: 50,
    });

    const customers = data?.data || [];

    const filtered = customers.filter((c) => {
        const s = searchTerm.toLowerCase();
        return (
            c.CompanyName.toLowerCase().includes(s) ||
            c.TIN.includes(s) ||
            c.BusinessEmail?.toLowerCase().includes(s)
        );
    });

    const columns = [
        {
            title: "Customer",
            key: "name",
            render: (_: any, r: any) => (
                <div>
                    <div className="font-semibold text-gray-900">{r.CompanyName}</div>
                    <div className="text-xs text-gray-500">TIN: {r.TIN}</div>
                </div>
            ),
        },
        {
            title: "Contact",
            key: "contact",
            render: (_: any, r: any) => (
                <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-700">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {r.BusinessEmail || "—"}
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {r.PhoneNumber || "—"}
                    </div>
                </div>
            ),
        },
        {
            title: "Verified",
            key: "verified",
            render: (_: any, r: any) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${r.Verified
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                        }`}
                >
                    {r.Verified ? "Verified" : "Not Verified"}
                </span>
            ),
        },

        {
            title: "Actions",
            key: "actions",
            render: (_: any, r: any) => (
                <button
                    onClick={() => navigate(`/${orgSlug}/customers/${r.UID}/invoices`)}
                    className="border border-[#00A859] text-gray-700 px-3 py-1.5 cursor-pointer text-xs rounded-md hover:bg-gray-50"
                >
                    View Invoices
                </button>
            ),
        },
    ];

    return (

        <div className="flex flex-col font-sans min-h-screen">
            {/* Header */}

            <Header
                icon={<User className="w-6 h-6 text-[#00A859]" />}
                title="Customers"
                description="Manage your customer database"
            // actions={
            //     <Link to="create-customer">
            //         <Button icon={<Plus className="w-4 h-4" />} className="shadow-md">
            //             Add Customer
            //         </Button>
            //     </Link>
            // }
            />

            {/* Search */}
            <div className=" py-3">
                <div className="relative max-w-full">
                    <Search className="z-50 absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />

                    <Input
                        icon={<Search className="w-5 h-5" />}
                        placeholder="       Search customers by name, TIN, or email..."
                        type="text"
                        name="search"
                        value={searchTerm}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSearchTerm(e.target.value)}
                    ></Input>

                </div>
            </div>
            <main className="py-4 flex-grow">
                <DataTable
                    title="Customer List"
                    columns={columns}
                    dataSource={filtered}
                    loading={isLoading}
                    total={filtered.length}
                    currentPage={1}
                    pageSize={50}
                    bordered
                    emptyText="No customers found."
                />
            </main>
        </div>
    );
};


export default CustomersPage;
