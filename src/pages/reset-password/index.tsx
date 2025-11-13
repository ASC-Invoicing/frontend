import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ResetPassword } from "./ResetPassword";
import { ResetConfirmationPage } from "./ResetConfirmation";

export default function ResetPasswordWrapper() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const t = searchParams.get("token");
    if (t) {
      setToken(t); 
      navigate("/reset-password", { replace: true }); 
    }
  }, [searchParams, navigate]);

  return token ? <ResetConfirmationPage token={token} /> : <ResetPassword />;
}
