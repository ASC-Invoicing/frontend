import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login";
import Signup from "../pages/signup";
import NotFound from "../pages/not-found";
import { DashboardLayout } from "../components/layout/dashboard-layout";
import DashboardPage from "../pages/dashboard";
import InvoicesPage from "../pages/invoices/invoice";
import CustomersPage from "../pages/customers";
import ProductPage from "../pages/products";
import SettingsPage from "../pages/settings";
import ReportsPage from "../pages/reports";
import { ScrollToTop } from "../components/scroll-to-top";
import CreateOrganization from "../pages/new-organization";
import CreateInvoice from "../pages/invoices/new-invoice";
import CreateCustomer from "../pages/customers/new-customer";
import CreateProduct from "../pages/products/new-product";

export const AppRouter = () => {

    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />


                <Route path="/onboarding" element={<CreateOrganization />} />
                {/* Protected dashboard routes */}
                <Route
                    path="/"
                    element={
                        // <ProtectedRoute>
                        <DashboardLayout />
                        /* </ProtectedRoute> */
                    }
                >
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="invoices" element={<InvoicesPage />} />
                    <Route path="customers" element={<CustomersPage />} />
                    <Route path="products" element={<ProductPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="invoices/create-invoice" element={<CreateInvoice />} />
                    <Route path="customers/create-customer" element={<CreateCustomer />} />
                    <Route path="products/create-product" element={<CreateProduct />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};
