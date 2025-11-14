import React, { useMemo } from "react";
import {
  Plus,
  LayoutList,
  CheckCircle,
  Clock,
  XCircle,
  LayoutDashboard,
  TrendingUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Button } from "../../components/ui";
import { Header } from "../../components/header";
import { Link } from "react-router-dom";

// --- MOCK DATA (same as ReportsPage) ---
const MOCK_INVOICES = [
  { id: "INV-2024-001", customer: "Dangote Group", date: "Dec 1, 2024", amount: 537500, status: "submitted", firsStatus: "validated" },
  { id: "INV-2024-002", customer: "MTN Nigeria", date: "Dec 5, 2024", amount: 537500, status: "submitted", firsStatus: "pending" },
  { id: "INV-2024-003", customer: "Access Bank PLC", date: "Nov 15, 2024", amount: 322500, status: "submitted", firsStatus: "rejected" },
  { id: "INV-2024-004", customer: "Dangote Group", date: "Oct 25, 2024", amount: 806250, status: "submitted", firsStatus: "validated" },
  { id: "INV-2024-005", customer: "Glo Nigeria", date: "Oct 1, 2024", amount: 150000, status: "submitted", firsStatus: "validated" },
  { id: "INV-2024-006", customer: "Airtel Nigeria", date: "Dec 15, 2024", amount: 750000, status: "submitted", firsStatus: "validated" },
];

// --- TYPES ---
interface StatusCardData {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  subText?: string;
}

const StatusCard: React.FC<StatusCardData> = ({
  title,
  value,
  icon: Icon,
  color,
  subText,
}) => (
  <div className="relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
    {/* Decorative half circle in background */}
    <div
      className={`absolute -top-6 -right-10 w-30 h-28 rounded-full opacity-30 ${color.includes("blue")
        ? "bg-blue-200"
        : color.includes("green")
          ? "bg-green-200"
          : color.includes("yellow")
            ? "bg-yellow-200"
            : "bg-red-200"
        }`}
    />

    <div className="relative z-10 flex justify-between items-start mb-4">
      <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
      <div
        className={`p-3 rounded-xl shadow-md text-white ${color.includes("blue")
          ? "bg-[#2A6BED]"
          : color.includes("green")
            ? "bg-[#1CB454]"
            : color.includes("yellow")
              ? "bg-[#D89B06]"
              : "bg-[#E63737]"
          }`}
      >
        <Icon className="w-5 h-5" />
      </div>
    </div>

    <div className="relative z-10">
      <p className="text-4xl font-extrabold text-gray-900">{value}</p>
      {subText && (
        <p className="text-xs text-gray-500 mt-1 flex items-center">
          <span className="text-green-500 mr-1"><TrendingUp size={15} /></span>
          {subText}
        </p>
      )}
    </div>
  </div>
);


const DashboardPage = () => {
  // --- Data processing reused from ReportsPage ---
  const {
    totalSubmissions,
    validatedCount,
    pendingCount,
    rejectedCount,
    pieData,
    barData,
  } = useMemo(() => {
    const total = MOCK_INVOICES.length;
    const validated = MOCK_INVOICES.filter((i) => i.firsStatus === "validated").length;
    const pending = MOCK_INVOICES.filter((i) => i.firsStatus === "pending").length;
    const rejected = MOCK_INVOICES.filter((i) => i.firsStatus === "rejected").length;

    const pieChartData = [
      { name: `Validated`, value: validated, color: "#10B981" },
      { name: `Pending`, value: pending, color: "#F59E0B" },
      { name: `Rejected`, value: rejected, color: "#EF4444" },
    ].filter((d) => d.value > 0);

    const monthlyCounts = MOCK_INVOICES.reduce<Record<string, number>>((acc, invoice) => {
      const month = invoice.date.split(" ")[0];
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const monthOrder = ["Oct", "Nov", "Dec"];
    const barChartData = monthOrder.map((month) => ({
      name: month,
      submissions: monthlyCounts[month] || 0,
    }));

    return {
      totalSubmissions: total,
      validatedCount: validated,
      pendingCount: pending,
      rejectedCount: rejected,
      pieData: pieChartData,
      barData: barChartData,
    };
  }, []);

  const complianceRate =
    totalSubmissions > 0
      ? ((validatedCount / totalSubmissions) * 100).toFixed(1)
      : "0.0";

  // --- Status Cards ---
  const statusCards: StatusCardData[] = [
    {
      title: "Total Submitted",
      value: totalSubmissions,
      icon: LayoutList,
      color: "text-[#0B344B] bg-blue-100",
    },
    {
      title: "FIRS Validated",
      value: validatedCount,
      icon: CheckCircle,
      color: "text-green-500 bg-green-100",
      subText: `${complianceRate}% success rate`,
    },
    {
      title: "Pending Validation",
      value: pendingCount,
      icon: Clock,
      color: "text-yellow-500 bg-yellow-100",
    },
    {
      title: "Rejected",
      value: rejectedCount,
      icon: XCircle,
      color: "text-red-500 bg-red-100",
    },
  ];

  return (
    <div className="flex flex-col flex-grow font-sans">
      {/* Header */}
      <Header
        icon={<LayoutDashboard className="w-6 h-6 text-[#00A859]" />}
        title="FIRS Compliance Dashboard"
        description="Track your invoice submissions and validation status"
        actions={
          <Link to="../invoices/create-invoice">
            <Button icon={<Plus className="w-4 h-4" />} className="shadow-md">
              Submit New Invoice
            </Button>
          </Link>
        }
      />

      {/* Status Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 mt-6">
        {statusCards.map((card) => (
          <StatusCard key={card.title} {...card} />
        ))}
      </section>

      {/* Main Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm hover:shadow-md transition">
          <h2 className="text-lg font-bold py-5 pl-5 bg-[#EFF3FF] text-gray-800 mb-4">
            FIRS Validation Status
          </h2>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm hover:shadow-md transition">
          <h2 className="text-lg font-bold py-5 pl-5 bg-[#ecfdf5] text-gray-800 mb-4">
            Submission Trends (Q4 2024)
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={barData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#555" />
                <YAxis allowDecimals={false} stroke="#555" />
                <Tooltip />
                <Bar
                  dataKey="submissions"
                  name="Submissions"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
