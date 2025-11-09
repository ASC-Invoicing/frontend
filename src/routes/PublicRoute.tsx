import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import type { JSX } from "react";
import { LoadingSpinner } from "../components/ui";
import { SplashScreen } from "../components/splash-screen";

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, hydrated } = useSelector((state: RootState) => state.auth);

  if (!hydrated) return <SplashScreen/>; 

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
