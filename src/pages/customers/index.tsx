import React, { useState } from "react";
import { Search, Plus, Pencil, Trash2, Mail, Phone, User } from "lucide-react";
import { Button, Input } from "../../components/ui";
import { DataTable } from "../../components/ui/table";
import { Header } from "../../components/header";
import { Link } from "react-router-dom";

interface Customer {
    id: string;
    name: string;
    tin: string;
    email: string;
    phone: string;
    address: string;
}

const mockCustomers: Customer[] = [
    {
        id: "CUST-001",
        name: "Dangote Group",
        tin: "12345678-0001",
        email: "procurement@dangote.com",
        phone: "+234 803 123 4567",
        address: "1 Alfred Rewane Road, Ikoyi, Lagos",
    },
    {
        id: "CUST-002",
        name: "MTN Nigeria",
        tin: "87654321-0001",
        email: "accounts@mtn.ng",
        phone: "+234 805 987 6543",
        address: "Churchgate Towers, Victoria Island, Lagos",
    },
    {
        id: "CUST-003",
        name: "Access Bank PLC",
        tin: "45678912-0001",
        email: "vendors@accessbankplc.com",
        phone: "+234 802 456 7890",
        address: "999C Danmole Street, Victoria Island, Lagos",
    },
];

const CustomersPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCustomers = mockCustomers.filter((customer) => {
        const term = searchTerm.toLowerCase();
        return (
            customer.name.toLowerCase().includes(term) ||
            customer.tin.includes(term) ||
            customer.email.toLowerCase().includes(term)
        );
    });

    const columns = [
        {
            title: "Customer Name",
            dataIndex: "name",
            key: "name",
            render: (text: string) => (
                <span className="font-semibold text-gray-900">{text}</span>
            ),
        },
        {
            title: "TIN",
            dataIndex: "tin",
            key: "tin",
            render: (text: string) => (
                <span className="text-gray-700 tracking-wide">{text}</span>
            ),
        },
        {
            title: "Contact",
            key: "contact",
            render: (_: any, record: Customer) => (
                <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-700">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <a
                            href={`mailto:${record.email}`}
                            className="hover:text-[#2563EB] transition-colors"
                        >
                            {record.email}
                        </a>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{record.phone}</span>
                    </div>
                </div>
            ),
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            render: (text: string) => (
                <span className="text-gray-500 text-sm">{text}</span>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: () => (
                <div className="flex space-x-2">
                    <button className="text-gray-500 cursor-pointer hover:text-[#2563EB] p-1 rounded-md transition-colors">
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 cursor-pointer hover:text-red-500 p-1 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
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
                actions={
                    <Link to="create-customer">
                        <Button icon={<Plus className="w-4 h-4" />} className="shadow-md">
                            Add Customer
                        </Button>
                    </Link>
                }
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

            {/* Table */}
            <main className="py-4 flex-grow">
                <DataTable
                    title="Customer List"
                    columns={columns}
                    dataSource={filteredCustomers}
                    loading={false}
                    total={filteredCustomers.length}
                    currentPage={1}
                    pageSize={10}
                    bordered
                    emptyText="No customers found matching your criteria."
                />
            </main>
        </div>
    );
};

export default CustomersPage;
