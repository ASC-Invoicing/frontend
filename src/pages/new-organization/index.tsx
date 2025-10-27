import React, { useState } from 'react';
import { FileText, Plus, Save, ChevronLeft, ArrowLeft } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { CustomTextArea } from '../../components/ui/textarea';
import { Link } from 'react-router-dom';

const PRIMARY_BLUE = "#00529A";





const CreateOrganization = () => {
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        console.log("Saving organization data:", formData);
        // Simulate API call delay
        setTimeout(() => {
            setIsSaving(false);
            alert("Organization created successfully! (Simulated)");
            // In a real app, you would redirect the user here.
        }, 1500);
    };

    return (
        <div className="flex flex-col bg-gray-50 font-sans min-h-screen">


            {/* Main Content Area: Centered Form */}
            <div className="flex-1 flex justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-4xl space-y-8">

                    {/* Form Card */}
                    <form onSubmit={handleSubmit} className="bg-white p-8 px-0 pt-0 rounded-xl shadow-2xl border border-gray-200">
                        <div className='bg-[#EEF3FF] p-8 mb-8 flex-wrap flex gap-6 items-center'>
                            <Link to={'/dashboard'}>
                                <ArrowLeft className="w-4 h-4 hover:text-blue-300 " />
                            </Link>
                            <div>
                                <h2 className="text-xl font-semibold flex items-center">
                                    Create Your Organization
                                </h2>
                                <p className='text-gray-500 mt-1 text-sm'>Set up your company profile for FIRS compliance</p>
                            </div>
                        </div>
                        <div className="space-y-10 px-8">

                            {/* Section: Company Information */}
                            <div className="space-y-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input label="Company Name" id="companyName" placeholder="e.g., Acme Nigeria Ltd" required />
                                    <Input label="Tax Identification Number (TIN)" id="tin" placeholder="TIN (e.g., 12345678-0001)" required />
                                    <Input label="Business Email" id="email" placeholder="billing@acme.com" type="email" required />
                                    <Input label="Phone" id="phone" placeholder="+234 800 123 4567" type="tel" required />
                                </div>
                                <Input label="Industry" id="industry" placeholder="e.g., Retail Store, Consulting" required />
                                <CustomTextArea label="Registered Address" id="address" placeholder="123 Main Street, Lagos" isTextArea required />
                            </div>

                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex justify-end px-8">
                            <Button
                                type="submit"
                                icon={<Save className="w-4 h-4" />}
                                className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                                disabled={isSaving}
                                loadingText="Creating Organization"
                            >
                              Create Organization
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateOrganization;
