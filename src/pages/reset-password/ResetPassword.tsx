
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui"
import { Input } from "../../components/ui/input"
import { Mail } from "lucide-react"
import { useToast } from "../../components/ui/toast/ToastProvider"
import { useForgotPasswordMutation } from "../../features/auth/authSlice"
import logo from "../../assets/images/syntax-logo.png"

export function ResetPassword() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const { showToast } = useToast()
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!email.trim()) {
            setError("Please enter your email address")
            return
        }

        try {
            const res = await forgotPassword({ Email: email }).unwrap()

            if (res.success) {
                showToast(res.data?.message || "Password reset link sent!", "success")
                setIsSubmitted(true)
            } else {
                showToast(res.message || "Something went wrong", "error")
            }
        } catch (err: any) {
            const message =
                err?.data?.message ||
                err?.error ||
                err?.message ||
                "Failed to send reset email. Please try again."
            showToast(message, "error")
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-100 flex">

                <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 bg-white">
                    <div className="w-full max-w-md text-center">
                        <div className="flex justify-center mb-6">
                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center shadow-lg ring-8 ring-white">
                                <Mail className="h-10 w-10 text-[#00A859]" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h1>
                        <p className="text-gray-600 mb-6">Password reset link sent</p>

                        <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 mb-8">
                            <p className="text-sm text-gray-700">
                              We&apos;ve sent a password reset link to:{" "}
                                <span className="font-semibold text-teal-900">{email}</span>
                            </p>
                        </div>

                        <p className="text-sm text-gray-600 mb-8">
                            Click the link in the email to reset your password. If you don&apos;t see it, check your spam folder.
                        </p>

                        <div className="space-y-3">
                            <Link to="/login" className="block">
                                <Button fullWidth>
                                    Back to Login
                                </Button>
                            </Link>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="w-full text-sm text-teal-700 hover:underline font-medium py-2"
                            >
                                Didn&apos;t receive it? Try another email
                            </button>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 items-center justify-center p-12">
                    <div className="text-white max-w-md">
                        <h2 className="text-4xl font-bold mb-4">Secure Your Account</h2>
                        <p className="text-lg text-teal-100 mb-8">
                            We take security seriously. Reset your password to protect your Synctax account.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Left Column - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <img src={logo} className="h-11 md:h-12" alt="SyncTax Logo" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
                    <p className="text-gray-600 mb-6">Enter your email to receive reset instructions</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email Address"
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e: { target: { value: React.SetStateAction<string> } }) => setEmail(e.target.value)}
                            error={error}
                        />

                        <Button type="submit" fullWidth loading={isLoading} loadingText="Sending...">
                            Send Reset Link
                        </Button>

                        <Link to="/login">
                            <Button variant="outline" fullWidth>
                                Back to Login
                            </Button>
                        </Link>
                    </form>
                </div>
            </div>
            {/* Right Column - Security Info */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 items-center justify-center p-12">
                <div className="text-white max-w-md">
                    <h2 className="text-4xl font-bold mb-6">Account Protection</h2>

                    <div className="space-y-6 mb-12">
                        <div className="flex gap-4">
                            <span className="text-2xl">🔒</span>
                            <div>
                                <h3 className="font-semibold mb-1">Secure Password Reset</h3>
                                <p className="text-sm text-teal-100">We&apos;ll send a secure link directly to your email</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-2xl">⏰</span>
                            <div>
                                <h3 className="font-semibold mb-1">Time-Limited Links</h3>
                                <p className="text-sm text-teal-100">Reset links expire after 24 hours for your protection</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-2xl">📧</span>
                            <div>
                                <h3 className="font-semibold mb-1">Instant Notification</h3>
                                <p className="text-sm text-teal-100">You&apos;ll receive an email confirming password changes</p>
                            </div>
                        </div>
                    </div>

                    <blockquote className="border-l-4 border-teal-400 pl-4">
                        <p className="text-teal-50 mb-2">
                            &quot;Security is paramount in Synctax. We use enterprise-grade encryption for all accounts.&quot;
                        </p>
                        <p className="font-semibold text-sm">Security Team</p>
                    </blockquote>
                </div>
            </div>
        </div>
    )
}
