import React, { useState } from "react";
import { Search, FileText, User } from "lucide-react";
import { Header } from "../../components/header";
import { DataTable } from "../../components/ui/table";
import { Input } from "../../components/ui";
import { useParams } from "react-router-dom";
import {
  useListCustomerInvoicesQuery,
  useGetCustomerQuery,
} from "../../features/customers/customer-slice";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

export default function CustomerInvoicesPage() {
  const { UID } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  // ⭐ Fetch customer details
  const { data: customerData } = useGetCustomerQuery({ UID: UID! });

  const customerName = customerData?.data?.CompanyName || "Customer";

  // Fetch invoices
  const { data, isLoading } = useListCustomerInvoicesQuery({
    UID: UID!,
    page: 1,
    limit: 50,
  });

  const invoices = data?.data || [];

  const filtered = invoices.filter((invoice) =>
    invoice.IRN.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { title: "IRN", dataIndex: "IRN", key: "irn" },
    { title: "Date", dataIndex: "InvoiceDate", key: "date" },
    {
      title: "Amount",
      key: "amount",
      render: (r: any) => (
        <span className="font-semibold text-gray-900">
          {currency.format(r.Total)}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (r: any) => (
        <span className="bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded-full">
          {r.Status}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        icon={<User className="w-6 h-6 text-[#00A859]" />}
        title={`${customerName}`}
        description={`All invoices issued to ${customerName}`}
      />

      <div className="py-3">
        <div className="relative max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <Input
            placeholder="       Search invoices by IRN..."
            value={searchTerm}
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <main className="py-4 flex-grow">
        <DataTable
          title="Invoices"
          columns={columns}
          dataSource={filtered}
          loading={isLoading}
          total={filtered.length}
          currentPage={1}
          pageSize={50}
        />
      </main>
    </div>
  );
}
