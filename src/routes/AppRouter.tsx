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
import EmailVerificationPage from "../pages/email-verification";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { useAuthInit } from "../hooks/useAuthInit";
import { OrgProtectedRoute } from "./OrgProtectedRoute";
import ResetPasswordWrapper from "../pages/reset-password";
import AuditLogsPage from "../pages/audit-logs";
import EditInvoice from "../pages/invoices/EditInvoice";

export const AppRouter = () => {
  useAuthInit();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <PublicRoute>
              <EmailVerificationPage />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPasswordWrapper />
            </PublicRoute>
          }
        />

        {/* Onboarding route for logged-in users without an organization */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <CreateOrganization />
            </ProtectedRoute>
          }
        />


        <Route
          path="/:orgSlug"
          element={
            <OrgProtectedRoute>
              <DashboardLayout />
            </OrgProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="invoices/:invoiceUID" element={<EditInvoice />} />
          <Route path="invoices/create-invoice" element={<CreateInvoice />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/create-customer" element={<CreateCustomer />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="products/create-product" element={<CreateProduct />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* <Route path="reports" element={<ReportsPage />} /> */}
          <Route path="audit-logs" element={<AuditLogsPage />} />
        </Route>


        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
