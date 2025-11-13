import React, { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { CheckCircle, Eye, EyeOff } from "lucide-react"
import { useToast } from "../../components/ui/toast/ToastProvider"
import { useResetPasswordMutation } from "../../features/auth/authSlice"

export function ResetConfirmationPage({ token }: { token: string }) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [resetPassword, { isLoading }] = useResetPasswordMutation()




  // --- VALIDATION ---
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.password.trim()) newErrors.password = "Password is required"
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters"

    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Please confirm your password"
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setErrors({ ...errors, [field]: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    if (!token) {
      setErrors({ password: "Invalid or missing reset token" })
      return
    }

    try {
      const res = await resetPassword({ token, NewPassword: formData.password }).unwrap()
      if (res.success) {
        showToast(res.data?.message || "Password reset successfully", "success")
        setIsComplete(true)
      } else {
        showToast(res.message || "Failed to reset password", "error")
      }
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.error ||
        err?.message ||
        "Password reset failed. Please try again."
      showToast(message, "error")
    }
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 bg-white">
          <div className="w-full max-w-md text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center shadow-lg ring-8 ring-white">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Password Reset Complete
            </h1>
            <p className="text-gray-600 mb-6">Your password has been updated</p>
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-8">
              <p className="text-sm text-green-900">
                You can now log in with your new credentials.
              </p>
            </div>
            <Link to="/login" className="block">
              <Button fullWidth>Go to Login</Button>
            </Link>
          </div>
        </div>
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 items-center justify-center p-12">
          <div className="text-white max-w-md">
            <h2 className="text-4xl font-bold mb-4">Ready to Connect</h2>
            <p className="text-lg text-teal-100">
              Your account is now secure. Log in and start syncing your integrations.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // --- FORM ---
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Set New Password</h1>
          <p className="text-gray-600 mb-6">Create a strong password for your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password */}
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={formData.password}
                onChange={(e: { target: { value: string } }) => handleChange("password", e.target.value)}
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

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e: { target: { value: string } }) => handleChange("confirmPassword", e.target.value)}
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
              disabled={isLoading}
              fullWidth
              loading={isLoading}
              loadingText="Resetting..."
            >
              Reset Password
            </Button>
          </form>
        </div>
      </div>

      {/* Right Column */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <h2 className="text-4xl font-bold mb-6">Create a Strong Password</h2>
          <div className="space-y-4 mb-12">
            <p className="text-teal-100">✓ At least 8 characters long</p>
            <p className="text-teal-100">✓ Mix of uppercase and lowercase letters</p>
            <p className="text-teal-100">✓ Include numbers and special characters</p>
            <p className="text-teal-100">✓ Avoid personal information</p>
          </div>
        </div>
      </div>
    </div>
  )
}
