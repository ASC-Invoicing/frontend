import React, { useState } from "react";
import { ArrowLeft, Save, Search } from "lucide-react";
import { Button, Input } from "../../components/ui";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useToast } from "../../components/ui/toast/ToastProvider";
import {
    useVerifyTINMutation,
    useCreateOrganizationMutation,
    type Organization,
} from "../../features/organizations/organization-slice";
import { useDispatch } from "react-redux";
import { setActiveOrg } from "../../store/orgContextSlice";
import { baseApi } from "../../features/api/baseApi";

const CreateOrganization = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [verifyTIN, { isLoading: verifying }] = useVerifyTINMutation();
    const [createOrganization, { isLoading: creating }] =
        useCreateOrganizationMutation();

    const [tin, setTin] = useState("");
    const [verifiedData, setVerifiedData] = useState<any>(null);
    const dispatch = useDispatch();

    const handleVerify = async () => {
        if (!tin.trim()) return showToast("Enter a TIN to verify", "error");
        try {
            const res = await verifyTIN(tin).unwrap();
            if (res.success && res.data.Verified) {
                setVerifiedData(res.data);
                showToast("TIN verified successfully!", "success");
            } else {
                showToast(res.message || "TIN not verified", "error");
            }
        } catch (err: any) {
            showToast(err?.data?.message || "Verification failed", "error");
        }
    };

    
    const handleCreate = async () => {
        if (!verifiedData) return showToast("Please verify a TIN first", "error");
        try {
            const res = await createOrganization({
                CompanyName: verifiedData.CompanyName,
                TIN: tin,
            }).unwrap();

            if (res.success) {
                dispatch(setActiveOrg({ slug: res.data.Slug, name: res.data.CompanyName }));
                showToast("Organization created successfully!", "success");
                await dispatch(
                    // @ts-ignore
                    baseApi.endpoints.listOrganizations.initiate(undefined, { forceRefetch: true })
                ).unwrap();

                navigate(`/${res.data.Slug}/dashboard`, { replace: true });
            } else {
                showToast(res.message || "Failed to create organization", "error");
            }
        } catch (err: any) {
            showToast(err?.data?.message || "Creation failed", "error");
        }
    };





    return (
        <div className="flex flex-col font-sans min-h-screen">
            <div className="flex-1 flex justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-3xl space-y-8">
                    <form className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
                        {/* Header */}
                        <div className="bg-teal-50 p-6 mb-8 flex gap-4 items-center">
                            <Link to={"/dashboard"}>
                                <ArrowLeft className="w-4 h-4 hover:text-[#00786F]" />
                            </Link>
                            <div>
                                <h2 className="text-lg font-semibold">Create Organization</h2>
                                <p className="text-gray-500 text-sm">
                                    We will use the TIN you provide to create your organization.
                                </p>
                            </div>
                        </div>

                        {/* Step 1: Verify TIN */}
                        <div className="grid grid-cols-1  gap-6 mb-6">
                            <div className="flex flex-col w-full">
                                <label className="text-sm font-medium mb-1">Enter TIN</label>
                                <div className="flex w-full border border-gray-300 rounded-md overflow-hidden">
                                    <input
                                        type="text"
                                        id="tin"
                                        value={tin}
                                        onChange={(e) => setTin(e.target.value)}
                                        placeholder="e.g., 25156944-0001"
                                        className="flex-1 w-20 px-3 py-2.5 text-sm outline-none focus:ring-0 focus:border-none"
                                    />
                                    <Button
                                        onClick={handleVerify}
                                        icon={<Search className="w-4 h-4" />}
                                        loading={verifying}
                                        loadingText="Verifying"
                                        type="button"
                                        className="!rounded-none !shadow-none border-l border-gray-300"
                                    >
                                        Verify
                                    </Button>
                                </div>
                            </div>
                        </div>


                        {/* Step 2: Show Verified Info */}
                        {verifiedData && (
                            <div className="border-t border-gray-200 pt-6 mt-4">
                                <h3 className="text-gray-700 font-semibold mb-4">
                                    Organization Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input label="Company Name" value={verifiedData.CompanyName} disabled />
                                    <Input label="Tax Office" value={verifiedData.TaxOffice} disabled />
                                    <Input label="RC Number" value={verifiedData.RCNumber} disabled />
                                    <Input label="Business Email" value={verifiedData.BusinessEmail} disabled />
                                    <Input label="Phone Number" value={verifiedData.PhoneNumber} disabled />
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <Button
                                        icon={<Save className="w-4 h-4" />}
                                        onClick={handleCreate}
                                        loading={creating}
                                        loadingText="Creating"
                                    >
                                        Create Organization
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateOrganization;


