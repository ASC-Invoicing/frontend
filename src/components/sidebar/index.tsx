import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  Plus,
} from "lucide-react";
import { Button } from "../ui";

const PRIMARY_BLUE = "#00529A";

const navItems = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { id: "invoices", name: "Invoices", icon: FileText, path: "/invoices" },
  { id: "customers", name: "Customers", icon: Users, path: "/customers" },
  { id: "products", name: "Products", icon: ShoppingBag, path: "/products" },
  { id: "reports", name: "Reports", icon: BarChart3, path: "/reports" },
  { id: "settings", name: "Settings", icon: Settings, path: "/settings" },
];

export const Sidebar = () => {
  return (
    <aside className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed lg:relative z-20">
      {/* Header / Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-50">
          <FileText className="w-5 h-5" style={{ color: PRIMARY_BLUE }} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-800 leading-tight">ASC e-Invoice</h2>
          <p className="text-xs text-gray-500">FIRS Compliant</p>
        </div>
      </div>

      {/* Org Section */}
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="p-3 border border-orange-200 rounded bg-[#FFFBEB]">
          <p className="text-xs font-medium text-gray-500 mb-2">
            No organization selected
          </p>
          <Button
            className="w-full bg-[#B45309] hover:bg-orange-900 text-sm text-orange-700 h-9"
            icon={<Plus className="w-4 h-4" />}
          >
            Create Organization
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
          Navigation
        </h3>
        {navItems.map(({ id, name, icon: Icon, path }) => (
          <NavLink
            key={id}
            to={path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 ${isActive
                ? "bg-blue-50 text-[#00529A] font-semibold"
                : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <Icon className="w-5 h-5 mr-3 shrink-0" />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
