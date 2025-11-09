import { Sidebar } from "../../sidebar";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import { SplashScreen } from "../../splash-screen";
import { useListOrganizationsQuery } from "../../../features/organizations/organization-slice";
import { useEffect, useMemo, useState } from "react";

export const DashboardLayout = () => {
  const { orgSlug } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useListOrganizationsQuery();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const organizations = data?.data ?? [];


  const currentOrg = useMemo(
    () => organizations.find((org) => org.Slug === orgSlug),
    [orgSlug, organizations]
  );


  useEffect(() => {
    if (!isLoading && organizations.length > 0 && !currentOrg) {
      navigate(`/${organizations[0].Slug}/dashboard`, { replace: true });
    }
  }, [isLoading, organizations, currentOrg, navigate]);

  if (showLoader || isLoading) return <SplashScreen />;

  return (
    <div className="flex h-screen bg-gray-50">
      {organizations.length > 0 && <Sidebar currentOrg={currentOrg} />}
      <main className="flex-1 overflow-y-auto max-w-7xl mx-auto p-6 px-4 md:px-6">
        <Outlet context={{ currentOrg }} />
      </main>
    </div>
  );
};
