import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    FileText,
    Users,
    ShoppingBag,
    BarChart3,
    Settings,
    Plus,
    Menu,
    X,
    Building,
    Check,
    LogOut,
} from "lucide-react";
import { Button, LoadingSpinner, Modal, } from "../ui";
import { useDispatch, useSelector } from "react-redux";
import { logout, useGetUserProfileQuery } from "../../features/auth/authSlice";
import { useListOrganizationsQuery } from "../../features/organizations/organization-slice";
import { setActiveOrg } from "../../store/orgContextSlice";
import type { RootState } from "../../store";
import { Empty } from "antd";
import { useToast } from "../ui/toast/toastProvider";

const PRIMARY_TEAL = "#00786F";

const navItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
    { id: "invoices", name: "Invoices", icon: FileText, path: "invoices" },
    { id: "customers", name: "Customers", icon: Users, path: "customers" },
    { id: "products", name: "Products", icon: ShoppingBag, path: "products" },
    { id: "reports", name: "Reports", icon: BarChart3, path: "reports" },
    { id: "settings", name: "Settings", icon: Settings, path: "settings" },
];

export const Sidebar = ({ currentOrg }: { currentOrg?: any }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showToast } = useToast(); // Using toast

    const [isOpen, setIsOpen] = useState(false);
    const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const { data: userData } = useGetUserProfileQuery();
    const { data: orgsData, isLoading: orgLoading } = useListOrganizationsQuery();
    const organizations = orgsData?.data || [];

    const activeOrg = useSelector((state: RootState) => state.orgContext);

    const toTitleCase = (str: string) => {
        if (!str) return "";
        return str
            .toLowerCase()
            .replace(/\b\w/g, (char: string) => char.toUpperCase());
    };

    useEffect(() => {
        if (currentOrg) {
            dispatch(setActiveOrg({ slug: currentOrg.Slug, name: currentOrg.CompanyName }));
        }
    }, [currentOrg, dispatch]);

    useEffect(() => {
        if (organizations.length > 0 && !activeOrg.slug) {
            const first = organizations[0];
            dispatch(setActiveOrg({ slug: first.Slug, name: first.CompanyName }));
        }
    }, [organizations, activeOrg.slug, dispatch]);

    const handleOrgSelect = (org: any) => {
        dispatch(setActiveOrg({ slug: org.Slug, name: org.CompanyName }));
        setIsOrgDropdownOpen(false);
        navigate(`/${org.Slug}/dashboard`);
    };

    const confirmLogout = () => {
        setShowLogoutModal(true);
    };

    const performLogout = () => {
        setShowLogoutModal(false);
        showToast("Logout successful", "success");

        // Wait 2-3 seconds before logging out
        setTimeout(() => {
            dispatch(logout());
            navigate("/login", { replace: true });
        }, 2500);
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded-md shadow-md border border-gray-200"
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/30 z-20 lg:hidden"
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:relative lg:flex lg:flex-col`}
            >
                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-teal-50">
                        <FileText className="w-5 h-5" style={{ color: PRIMARY_TEAL }} />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-800 leading-tight">
                            ASC e-Invoice
                        </h2>
                        <p className="text-xs text-gray-500">FIRS Compliant</p>
                    </div>
                </div>

                {/* Organization Switcher */}
                <div className="px-5 py-4 border-b border-gray-200 relative">
                    <p className="text-xs font-medium text-gray-500 mb-2">ORGANIZATION</p>
                    <button
                        onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
                        className="w-full flex items-center justify-between capitalize p-3 py-2.5 border border-gray-300 rounded-lg text-sm cursor-pointer bg-white hover:bg-gray-50 transition"
                    >
                        <div className="flex items-center gap-2">
                            <Building className="w-5 h-5 text-[#00786F]" />
                            <span className="font-medium text-gray-800 truncate max-w-[150px] text-sm">

                                {toTitleCase(activeOrg?.name || "Select Organization")}
                            </span>
                        </div>
                        <svg
                            className={`w-4 h-4 text-gray-500 transition-transform ${isOrgDropdownOpen ? "rotate-180" : "rotate-0"
                                }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {isOrgDropdownOpen && (
                        <div className="absolute left-5 w-[300px] mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-10">
                            <div className="px-4 py-4 text-xs font-semibold text-gray-500">
                                Switch Organization
                            </div>
                            {orgLoading ? (
                                <div className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
                                    <LoadingSpinner size={16} /> Loading
                                </div>
                            ) : organizations.length > 0 ? (
                                organizations.map((org) => (
                                    <div
                                        key={org.UID}
                                        onClick={() => handleOrgSelect(org)}
                                        className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-50 text-sm ${activeOrg.slug === org.Slug
                                            ? "bg-teal-50 font-medium"
                                            : "text-gray-700"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Building
                                                className={`w-5 h-5 ${activeOrg.slug === org.Slug
                                                    ? "text-[#00786F]"
                                                    : "text-gray-400"
                                                    }`}
                                            />
                                            <span>{toTitleCase(org.CompanyName)}</span>

                                        </div>
                                        {activeOrg.slug === org.Slug && (
                                            <Check className="w-4 h-4 text-[#00786F]" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-gray-500">
                                    <Empty description="No organizations found" />
                                </div>
                            )}
                            <div className="border-t border-gray-100">
                                <Link to="/onboarding">
                                    <div className="flex items-center gap-2 px-4 py-2.5 mt-2 cursor-pointer text-[#00786F] hover:bg-teal-50 text-sm font-medium">
                                        <Plus className="w-5 h-5" />
                                        <span>Create New Organization</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Nav Links */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    {navItems.map(({ id, name, icon: Icon, path }) => (
                        <NavLink
                            key={id}
                            to={`/${activeOrg.slug || ""}/${path}`}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive
                                    ? "bg-teal-50 text-[#00786F] font-semibold"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`
                            }
                        >
                            <Icon className="w-5 h-5 mr-3 shrink-0" />
                            <span>{name}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="px-5 py-4 border-t border-gray-200">
                    <button
                        onClick={confirmLogout}
                        className="flex items-center cursor-pointer w-full px-3 py-2.5 rounded-lg text-sm transition-colors text-gray-600 hover:bg-red-50 hover:text-red-600 font-medium"
                    >
                        <LogOut className="w-5 h-5 mr-3 shrink-0" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <Modal
                    open
                    title="Confirm Logout"
                    onCancel={() => setShowLogoutModal(false)}
                    width={500}
                    footer={
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                onClick={() => setShowLogoutModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-red-500 hover:bg-red-600"
                                onClick={performLogout}
                            >
                                Logout
                            </Button>
                        </div>
                    }
                >
                    <p>Are you sure you want to logout?</p>
                </Modal>
            )}
        </>
    );
};