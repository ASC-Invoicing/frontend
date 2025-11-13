// routes/OrgProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useListOrganizationsQuery } from "../features/organizations/organization-slice";
import type { RootState } from "../store";
import { SplashScreen } from "../components/splash-screen";
import type { JSX } from "react";

interface OrgProtectedRouteProps {
    children: JSX.Element;
}

export const OrgProtectedRoute = ({ children }: OrgProtectedRouteProps) => {
    const { isAuthenticated, hydrated } = useSelector(
        (state: RootState) => state.auth
    );

    const { data, isLoading, isError } = useListOrganizationsQuery();
    if (!hydrated || isLoading) return <SplashScreen />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (isError) return <Navigate to="/onboarding" replace />;

    const organizations = data?.data ?? [];

    // If there are no organizations, go to onboarding
    if (!organizations.length) {
        return <Navigate to="/onboarding" replace />;
    }

    return children;
};
