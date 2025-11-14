"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui";
import { Input } from "../../components/ui";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { useSignupMutation } from "../../features/auth/authSlice";
import { useToast } from "../../components/ui/toast/ToastProvider";
import logo from "../../assets/images/syntax-logo.png"

export default function SignUpPage() {
    const { showToast } = useToast()
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [signup, { isLoading }] = useSignupMutation();

    // ---- FORM VALIDATION ----
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (!formData.confirmPassword)
            newErrors.confirmPassword = "Please confirm your password";

        if (formData.password && formData.password.length < 8)
            newErrors.password = "Password must be at least 8 characters";

        if (
            formData.password &&
            formData.confirmPassword &&
            formData.password !== formData.confirmPassword
        )
            newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: "" });
    };

    // ---- SUBMIT HANDLER ----
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const result = await signup({
                Email: formData.email,
                Password: formData.password,
                FirstName: formData.firstName,
                LastName: formData.lastName,
            }).unwrap();

            showToast(result?.data?.message || "Verification link sent to your email.", "success");
            setShowSuccess(true);
        } catch (err: any) {
            const msg = err?.data?.message || "Signup failed. Please try again.";
            showToast(msg, "error");
        }
    };

    // ---- SUCCESS SCREEN ----
    if (showSuccess) {
        return (
            <div className="min-h-screen bg-gray-100 flex">
                <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 bg-white">
                    <div className="w-full max-w-md text-center">
                        <div className="flex justify-center mb-6">
                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center shadow-lg ring-8 ring-white">
                                <CheckCircle className="h-10 w-10 text-[#00A859]" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome to Synctax!
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Your account has been created successfully.
                        </p>

                        <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 mb-8">
                            <p className="text-sm text-gray-700">
                                We’ve sent a verification email to{" "}
                                <span className="font-semibold text-teal-900">{formData.email}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 items-center justify-center p-12">
                    <div className="text-white max-w-md">
                        <h2 className="text-4xl font-bold mb-4">You’re Almost There!</h2>
                        <p className="text-lg text-teal-100 mb-8">
                            Start managing your invoices and tax compliance with ease today.
                        </p>
                        <div className="space-y-4 text-sm text-teal-100">
                            <p>✓ Submit invoices to FIRS</p>
                            <p>✓ Track validation status in real time</p>
                            <p>✓ Ensure tax compliance automatically</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ---- SIGNUP FORM ----
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="mb-8">
                        <img src={logo} className="h-11 md:h-12" alt="SyncTax Logo" />
                    </div>

                    {/* Title */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                        <p className="text-gray-600 mt-2">
                            Join Synctax to manage your e-invoices and tax compliance
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="First Name"
                                id="firstName"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={(e: any) => handleChange("firstName", e.target.value)}
                                error={errors.firstName}
                            />
                            <Input
                                label="Last Name"
                                id="lastName"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={(e: any) => handleChange("lastName", e.target.value)}
                                error={errors.lastName}
                            />
                        </div>

                        <Input
                            label="Email Address"
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e: any) => handleChange("email", e.target.value)}
                            error={errors.email}
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={(e: any) => handleChange("password", e.target.value)}
                                error={errors.password}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-11 cursor-pointer -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        <div className="relative">
                            <Input
                                label="Confirm Password"
                                id="confirmPassword"
                                type={showConfirm ? "text" : "password"}
                                placeholder="Re-enter your password"
                                value={formData.confirmPassword}
                                onChange={(e: any) => handleChange("confirmPassword", e.target.value)}
                                error={errors.confirmPassword}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-11 cursor-pointer -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirm ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>



                        <Button
                            type="submit"
                            variant="solid"
                            fullWidth
                            loading={isLoading}
                            loadingText="Signing up"
                        >
                            Sign Up
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

                        <p className="text-sm text-gray-600 text-center mt-3">
                            Already have an account?{" "}
                            <Link to="/login" className="text-[#00A859] font-medium hover:underline">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right Section */}
            {/* <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#00A859] via-teal-500 to-teal-700 items-center justify-center p-12">
                <div className="text-white max-w-md">
                    <h2 className="text-4xl font-bold mb-4">Simplify E-Invoicing</h2>
                    <p className="text-lg text-teal-100 mb-8">
                        Automate compliance and manage your tax workflows efficiently.
                    </p>
                    <div className="space-y-4 text-sm text-teal-100">
                        <p>✓ Submit invoices to FIRS</p>
                        <p>✓ Track validation status in real time</p>
                        <p>✓ Ensure tax compliance automatically</p>
                    </div>
                </div>
            </div> */}

            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 items-center justify-center p-12">
                <div className="text-white max-w-md">
                    <h2 className="text-4xl font-bold mb-4">Streamline E-Invoicing</h2>
                    <p className="text-lg text-teal-100 mb-8">
                        Manage invoices and FIRS compliance all in one powerful platform
                    </p>
                    <div className="space-y-6 mb-12">
                        <div className="flex gap-4">
                            <div className="text-2xl">📄</div>
                            <div>
                                <h3 className="font-semibold mb-1">Easy Invoice Management</h3>
                                <p className="text-sm text-teal-100">Create and submit invoices to FIRS effortlessly</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-2xl">✅</div>
                            <div>
                                <h3 className="font-semibold mb-1">Automatic Compliance Tracking</h3>
                                <p className="text-sm text-teal-100">Monitor validation status in real-time</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-2xl">🔒</div>
                            <div>
                                <h3 className="font-semibold mb-1">Secure & Compliant</h3>
                                <p className="text-sm text-teal-100">FIRS compliant with enterprise-level security</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
