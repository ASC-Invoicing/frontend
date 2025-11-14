import React, { useMemo } from 'react';
import {
  FileText,
  Check,
  CornerDownLeft,
  Download,
  BarChart3,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '../../components/ui';
import { Header } from '../../components/header';

// --- MOCK DATA ---
const MOCK_INVOICES = [
  { id: 'INV-2024-001', customer: 'Dangote Group', date: 'Dec 1, 2024', amount: 537500, status: 'submitted', firsStatus: 'validated' },
  { id: 'INV-2024-002', customer: 'MTN Nigeria', date: 'Dec 5, 2024', amount: 537500, status: 'submitted', firsStatus: 'pending' },
  { id: 'INV-2024-003', customer: 'Access Bank PLC', date: 'Nov 15, 2024', amount: 322500, status: 'submitted', firsStatus: 'rejected' },
  { id: 'INV-2024-004', customer: 'Dangote Group', date: 'Oct 25, 2024', amount: 806250, status: 'submitted', firsStatus: 'validated' },
  { id: 'INV-2024-005', customer: 'Glo Nigeria', date: 'Oct 1, 2024', amount: 150000, status: 'submitted', firsStatus: 'validated' },
  { id: 'INV-2024-006', customer: 'Airtel Nigeria', date: 'Dec 15, 2024', amount: 750000, status: 'submitted', firsStatus: 'validated' },
];

// --- TYPES ---
interface StatCardProps {
  title: string;
  value: string | number;
  StatIcon: React.ElementType;
  iconBgColor: string;
  iconTextColor: string;
  showPercent?: boolean;
}

// --- COMPONENTS ---
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  StatIcon,
  iconBgColor,
  iconTextColor,
  showPercent = false,
}) => (
  <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col justify-between h-full">
    <div className="flex justify-between items-start">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div className={`p-2 rounded-full ${iconBgColor} ${iconTextColor}`}>
        <StatIcon className="w-5 h-5" />
      </div>
    </div>
    <p className="text-3xl font-bold text-gray-900 mt-2">
      {value}
      {showPercent && '%'}
    </p>
  </div>
);

// --- MAIN REPORTS PAGE ---
const ReportsPage: React.FC = () => {
  const {
    totalSubmissions,
    validatedCount,
    pendingCount,
    rejectedCount,
    pieData,
    barData,
  } = useMemo(() => {
    const total = MOCK_INVOICES.length;
    const validated = MOCK_INVOICES.filter((i) => i.firsStatus === 'validated').length;
    const pending = MOCK_INVOICES.filter((i) => i.firsStatus === 'pending').length;
    const rejected = MOCK_INVOICES.filter((i) => i.firsStatus === 'rejected').length;

    const pieChartData = [
      { name: `Validated: ${validated}`, value: validated, color: '#10B981' },
      { name: `Pending: ${pending}`, value: pending, color: '#F59E0B' },
      { name: `Rejected: ${rejected}`, value: rejected, color: '#EF4444' },
    ].filter((d) => d.value > 0);

    const monthlyCounts = MOCK_INVOICES.reduce<Record<string, number>>((acc, invoice) => {
      const monthName = invoice.date.split(' ')[0];
      acc[monthName] = (acc[monthName] || 0) + 1;
      return acc;
    }, {});

    const monthOrder = ['Oct', 'Nov', 'Dec'];
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
      : '0.0';

  return (
    <div className="flex flex-col flex-grow font-sans">
      {/* Header */}
      <Header
        icon={<BarChart3 className="w-6 h-6 text-[#00A859]" />}
        title="FIRS Compliance Reports"
        description="Track your submission history and compliance metrics"
        actions={
          <Button icon={<Download className="w-4 h-4" />} className="shadow-md">
            Export Report
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-6">
        <StatCard
          title="Total Submissions"
          value={totalSubmissions}
          StatIcon={FileText}
          iconBgColor="bg-blue-100"
          iconTextColor="text-blue-600"
        />
        <StatCard
          title="FIRS Validated"
          value={validatedCount}
          StatIcon={Check}
          iconBgColor="bg-green-100"
          iconTextColor="text-green-600"
        />
        <StatCard
          title="Compliance Rate"
          value={complianceRate}
          StatIcon={CornerDownLeft}
          iconBgColor="bg-purple-100"
          iconTextColor="text-purple-600"
          showPercent
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            FIRS Validation Status
          </h3>
          <div className="h-80 w-full flex items-center justify-center">
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
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
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
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Submissions
          </h3>
          <div className="h-80 w-full">
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
      </div>
    </div>
  );
};

export default ReportsPage;
