import { Sidebar } from "../../sidebar";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">

      <Sidebar />

      <main className="flex-1 overflow-y-auto max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};
