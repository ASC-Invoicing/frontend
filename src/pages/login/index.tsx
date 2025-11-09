import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "../../components/ui";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "../../components/ui/toast/toastProvider";
import { useLoginMutation } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";

export default function LoginPage() {
    const { showToast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) return showToast("Please enter email and password", "error");

        try {
            const res = await login({ Email: email, Password: password }).unwrap();

            if (res.success) {
                // If backend sets cookie, no need to extract token
                const user = {
                    Email: res.data?.Email || email,
                    FirstName: res.data?.FirstName || "User",
                    LastName: res.data?.LastName || "",
                };

                // Update Redux
                dispatch(setCredentials({ user, token: "cookie-session" })); // fake token to mark auth

                showToast("Login successful!", "success");
                navigate("/dashboard", { replace: true });
            } else {
                showToast(res.message || "Login failed", "error");
            }
        } catch (err: any) {
            const message =
                err?.data?.message || err?.error || err?.message || "Login failed. Please try again.";
            showToast(message, "error");
        }
    };




    return (
        <div className="min-h-screen bg-gray-50 flex">
            <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2">
                            <div className="h-8 w-8 bg-[#00786F] rounded-md flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{`{}`}</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">synctax</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-gray-600 mt-2">
                            Log in to continue managing invoices & compliance
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)}
                                error={!email ? "Email is required" : ""}
                            />
                        </div>

                        <div className="space-y-2 relative">
                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
                                error={!password ? "Password is required" : ""}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-11 cursor-pointer -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        <div className="text-right">
                            <Link to="/forgot-password" className="text-sm text-[#00786F] hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" variant="solid" fullWidth loading={isLoading} loadingText="Signing in">
                            Sign In
                        </Button>

                        <div className="relative py-3">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-white px-2 text-gray-600">OR</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            fullWidth
                            className="bg-[#ffffff] !text-[#000000] shadow-xs hover:bg-gray-100 border border-gray-200"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </Button>

                        <p className="text-center text-sm text-gray-600">
                            Don&apos;t have an account?{" "}
                            <Link to="/signup" className="text-[#00786F] hover:underline font-semibold">
                                Create Account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 items-center justify-center p-12">
                <div className="text-white max-w-md">
                    <h2 className="text-4xl font-bold mb-4">Streamline E-Invoicing</h2>
                    <p className="text-lg text-blue-100 mb-8">
                        Manage invoices and FIRS compliance all in one powerful platform
                    </p>
                    <div className="space-y-6 mb-12">
                        <div className="flex gap-4">
                            <div className="text-2xl">📄</div>
                            <div>
                                <h3 className="font-semibold mb-1">Easy Invoice Management</h3>
                                <p className="text-sm text-blue-100">Create and submit invoices to FIRS effortlessly</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-2xl">✅</div>
                            <div>
                                <h3 className="font-semibold mb-1">Automatic Compliance Tracking</h3>
                                <p className="text-sm text-blue-100">Monitor validation status in real-time</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-2xl">🔒</div>
                            <div>
                                <h3 className="font-semibold mb-1">Secure & Compliant</h3>
                                <p className="text-sm text-blue-100">FIRS compliant with enterprise-level security</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


