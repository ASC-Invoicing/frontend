import React, { useState } from "react";
// NOTE: Assuming react-router-dom is available for NavLink
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  Plus,
  Menu,
  User,
  LogOut,
  X,
} from "lucide-react";
import { Button } from "../ui";


const PRIMARY_BLUE = "#00529A";
const USER_NAME = "Habeeb Adebimepe";
const USER_ROLE = "Administrator";
// NOTE: Use a mock or state-driven value for the email in a real app
const USER_EMAIL = "habeeb.a@company.com";


// Navigation items that should be SCROLLABLE
const scrollableNavItems = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { id: "invoices", name: "Invoices", icon: FileText, path: "/invoices" },
  { id: "customers", name: "Customers", icon: Users, path: "/customers" },
  { id: "products", name: "Products", icon: ShoppingBag, path: "/products" },
  { id: "reports", name: "Reports", icon: BarChart3, path: "/reports" },
  { id: "settings", name: "Settings", icon: Settings, path: "/settings" },
];


export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  // Helper function to get the first initial for the avatar
  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded-md shadow-md border border-gray-200"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-700" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
        ></div>
      )}

      {/* Sidebar Container: Use flex-col and h-full to enable the fixed footer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                lg:translate-x-0 lg:relative lg:flex lg:flex-col`}
      >
        {/* Header / Logo (FIXED TOP) */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-50">
            <FileText className="w-5 h-5" style={{ color: PRIMARY_BLUE }} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800 leading-tight">
              ASC e-Invoice
            </h2>
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

        {/* Navigation Menu (SCROLLABLE MIDDLE SECTION) */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
            Navigation
          </h3>
          {scrollableNavItems.map(({ id, name, icon: Icon, path }) => (
            <NavLink
              key={id}
              to={path}
              onClick={closeSidebar}
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

        {/* User Profile and Logout (FIXED BOTTOM SECTION) */}
        <div className="px-5 py-4 border-t border-gray-200">

          {/* User Profile Block */}
          <div className="flex items-center space-x-3 mb-4">
            {/* Avatar / Initial */}
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
              {getInitial(USER_NAME)}
            </div>
            {/* Name and Role */}
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-snug">{USER_NAME}</p>
              <p className="text-xs text-gray-500 leading-snug">{USER_ROLE}</p>
            </div>
          </div>

          {/* Logout Link/Button */}
          <NavLink
            to="/logout"
            onClick={closeSidebar}
            className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 text-gray-600 hover:bg-red-50 hover:text-red-600 font-medium"
          >
            <LogOut className="w-5 h-5 mr-3 shrink-0" />
            <span>Logout</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};
