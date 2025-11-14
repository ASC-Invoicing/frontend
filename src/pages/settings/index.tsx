import React, { useEffect, useState } from "react";
import { Lock, User, LogOut, Settings, Save } from "lucide-react";
import { Button, Input } from "../../components/ui";
import { Header } from "../../components/header";
import { useToast } from "../../components/ui/toast/ToastProvider";

import {
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useChangePasswordMutation,
} from "../../features/user/user-slice";
import { useLogoutUserMutation } from "../../features/auth/authSlice";
import { baseApi } from "../../features/api/baseApi";
import { useNavigate } from "react-router-dom";


import { useDispatch } from "react-redux";
import { clearUser, setUser } from "../../store/userSlice";

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [logoutUser] = useLogoutUserMutation();

    const dispatch = useDispatch();
    const { showToast } = useToast();

    // --- GET PROFILE ---
    const { data, isLoading: isProfileLoading } = useGetUserProfileQuery();

    // --- MUTATIONS ---
    const [updateProfile, { isLoading: isUpdatingProfile }] =
        useUpdateUserProfileMutation();

    const [changePassword, { isLoading: isChangingPassword }] =
        useChangePasswordMutation();

    // Local form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // Password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    // Populate form after fetching user
    useEffect(() => {
        if (data?.data) {
            setFirstName(data.data.FirstName);
            setLastName(data.data.LastName);
        }
    }, [data]);

    // Save updated profile
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await updateProfile({
                FirstName: firstName,
                LastName: lastName,
            }).unwrap();

            dispatch(setUser(res.data));

            showToast("Profile updated successfully.", "success");
        } catch (err: any) {
            showToast(err?.data?.message || "Failed to update profile.", "error");
        }
    };

    // Change password
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            showToast("Passwords do not match.", "error");
            return;
        }

        try {
            await changePassword({
                OldPassword: currentPassword,
                NewPassword: newPassword,
            }).unwrap();

            showToast("Password updated successfully.", "success");

            // reset fields
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (err: any) {
            showToast(err?.data?.message || "Failed to update password.", "error");
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(clearUser());
            dispatch(baseApi.util.resetApiState());
            localStorage.clear();
            sessionStorage.clear();
            showToast("Logout successful", "success");

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 600);

        } catch (err) {
            console.error("Logout failed:", err);
            showToast("Logout failed. Please try again.", "error");
        }
    };


    return (
        <div className="flex flex-col font-sans min-h-screen">
            <Header
                icon={<Settings className="w-6 h-6 text-[#00A859]" />}
                title="Account Settings"
                description="Manage your personal profile and security settings"
            />

            {/* Profile */}
            <div className="space-y-12 mb-6">
                <div className="pb-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-baseline border-b border-gray-200 bg-[#F9FAFB] p-6 rounded-t-xl">
                        <div className="flex items-center gap-3">
                            <User className="w-6 h-6 text-gray-600" />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Profile Information
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Update your personal information
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <form className="space-y-6" onSubmit={handleSaveProfile}>
                            <div className="grid grid-cols-1 gap-6">
                                <Input
                                    label="First Name *"
                                    value={firstName}
                                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setFirstName(e.target.value)}
                                    required
                                />

                                <Input
                                    label="Last Name *"
                                    value={lastName}
                                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setLastName(e.target.value)}
                                    required
                                />

                                <Input
                                    label="Email Address"
                                    value={data?.data.Email || ""}
                                    disabled
                                />

                                <p className="text-xs text-gray-500 -mt-4">
                                    Email cannot be changed.
                                </p>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <Button
                                    type="submit"
                                    variant="solid"
                                    disabled={isUpdatingProfile}
                                    loading={isUpdatingProfile}
                                    loadingText="Saving"
                                    icon={<Save size={18} />}
                                >
                                    Save Profile
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Password Section */}
            <div className="space-y-12 mb-6">
                <div className="pb-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-gray-200 bg-[#F9FAFB] p-6 rounded-t-xl">
                        <Lock className="w-6 h-6 text-gray-600" />
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                Change Password
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Update your password to keep your account secure
                            </p>
                        </div>
                    </div>

                    <div className="p-6">
                        <form className="space-y-6" onSubmit={handleChangePassword}>
                            <Input
                                label="Current Password *"
                                type="password"
                                value={currentPassword}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setCurrentPassword(e.target.value)}
                                required
                            />

                            <Input
                                label="New Password *"
                                type="password"
                                value={newPassword}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setNewPassword(e.target.value)}
                                required
                            />

                            <Input
                                label="Confirm New Password *"
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setConfirmNewPassword(e.target.value)}
                                required
                            />

                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <Button
                                    type="submit"
                                    variant="solid"
                                    disabled={isChangingPassword}
                                    loading={isChangingPassword}
                                    loadingText="Updating"
                                    icon={<Lock size={18} />}
                                >
                                    Change Password
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* LOGOUT */}
            <div className="space-y-12">
                <div className="pb-6 rounded-xl border border-red-200 shadow-sm">
                    <div className="flex items-center gap-3 bg-[#FEF2F2] border-b border-red-200 px-6 py-5 rounded-t-xl">
                        <LogOut className="w-6 h-6 text-red-600" />
                        <div>
                            <h3 className="text-2xl font-semibold text-red-800">Sign Out</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Sign out from your account
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-6 pt-4 border-t border-red-100">
                        <p className="text-sm text-gray-500">
                            You will be logged out and redirected to login.
                        </p>

                        <Button
                            type="button"
                            variant="solid"
                            className="bg-red-600 text-white hover:bg-red-700 shadow-md"
                            onClick={handleLogout}
                            icon={<LogOut size={18} />}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SettingsPage;
