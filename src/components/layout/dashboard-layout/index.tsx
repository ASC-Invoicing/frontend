import { Sidebar } from "../../sidebar";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import { SplashScreen } from "../../splash-screen";
import { useListOrganizationsQuery } from "../../../features/organizations/organization-slice";
import { useEffect, useMemo, useState } from "react";

import { useGetUserProfileQuery } from "../../../features/auth/authSlice";

export const DashboardLayout = () => {
  const { orgSlug } = useParams();
  const navigate = useNavigate();
  const { data: orgData, isLoading: orgLoading } = useListOrganizationsQuery();
  const { data: userData, isLoading: userLoading } = useGetUserProfileQuery();
  const [showLoader, setShowLoader] = useState(true);

  const organizations = orgData?.data ?? [];
  const currentOrg = useMemo(
    () => organizations.find((org) => org.Slug === orgSlug),
    [orgSlug, organizations]
  );

  // simple loader logic
  const isStillLoading = orgLoading || userLoading || showLoader;

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isStillLoading && organizations.length > 0 && !currentOrg) {
      navigate(`/${organizations[0].Slug}/dashboard`, { replace: true });
    }
  }, [isStillLoading, organizations, currentOrg, navigate]);

  if (isStillLoading) return <SplashScreen />;

  return (
    <div className="flex h-screen bg-gray-50">
      {organizations.length > 0 && (
        <Sidebar currentOrg={currentOrg} />
      )}
      <main className="flex-1 overflow-y-auto max-w-7xl mx-auto p-6 px-4 md:px-6">
        <Outlet context={{ currentOrg, userData }} />
      </main>
    </div>
  );
};
