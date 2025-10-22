import React from "react";
import {
  Plus,
  LayoutList,
  CheckCircle,
  Clock,
  XCircle,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "../../components/ui";

interface StatusCardData {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  subText?: string;
}


const statusCards: StatusCardData[] = [
  {
    title: "Total Submitted",
    value: 0,
    icon: LayoutList,
    color: "text-blue-500 bg-blue-100",
  },
  {
    title: "FIRS Validated",
    value: 0,
    icon: CheckCircle,
    color: "text-green-500 bg-green-100",
    subText: "0% success rate",
  },
  {
    title: "Pending Validation",
    value: 0,
    icon: Clock,
    color: "text-yellow-500 bg-yellow-100",
  },
  {
    title: "Rejected",
    value: 0,
    icon: XCircle,
    color: "text-red-500 bg-red-100",
  },
];


const StatusCard: React.FC<StatusCardData> = ({
  title,
  value,
  icon: Icon,
  color,
  subText,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <div className={`p-2 rounded-xl ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>

    <div>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
      {subText && (
        <p className="text-xs text-gray-500 mt-1 flex items-center">
          <span className="text-green-500 mr-1">▲</span>
          {subText}
        </p>
      )}
    </div>
  </div>
);


const DashboardPage = () => {
  return (
    <div className="flex flex-col flex-grow bg-gray-50 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-[#00529A]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              FIRS Compliance Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Track your invoice submissions and validation status
            </p>
          </div>
        </div>

        <Button
          icon={<Plus className="w-4 h-4" />}
          className="shadow-md"
        >
          Submit New Invoice
        </Button>
      </header>

      {/* Status Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statusCards.map((card) => (
          <StatusCard key={card.title} {...card} />
        ))}
      </section>

      {/* Main Content */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            FIRS Validation Status
          </h2>
          <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
            Chart
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Submission Trends (Last 6 Months)
          </h2>
          <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
            Chart component placeholder
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
