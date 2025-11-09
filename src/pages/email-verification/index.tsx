import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "../../components/ui";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useVerifyEmailQuery } from "../../features/auth/authSlice";

export default function EmailVerificationPage() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const { data, error, isLoading } = useVerifyEmailQuery(token!, {
    skip: !token,
  });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Invalid Link</h1>
          <p className="text-gray-600 mb-6">
            No verification token was found. Please check your email again.
          </p>
          <Link to="/signup">
            <Button variant="solid">Go to Sign Up</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin mb-4" />
        <p className="text-gray-600">Verifying your email</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
          <p className="text-gray-600 mb-6">
            We couldn’t verify your account. Please try again or contact support.
          </p>
          <Link to="/signup">
            <Button variant="solid">Back to Sign Up</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Email Verified</h1>
        <p className="text-gray-600 mb-6">
          {data?.data?.message || "Your email has been successfully verified."}
        </p>
        <Link to="/login">
          <Button variant="solid">Go to Login</Button>
        </Link>
      </div>
    </div>
  );
}
