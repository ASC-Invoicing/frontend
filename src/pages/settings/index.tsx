import { useState } from "react";
import { Button, Input, Select } from "../../components/ui";
import { FileText, Save, Settings } from "lucide-react";
import TextArea from "antd/es/input/TextArea";
import { Form } from "antd";
import { Header } from "../../components/header";
import { CustomTextArea } from "../../components/ui/textarea";


const MOCK_COMPANY_SETTINGS = {
    companyName: '',
    tin: '',
    email: '',
    phone: '',
    industry: '',
    address: '',
    firsApiKey: '',
};
const SettingsPage = () => {
    const [settings, setSettings] = useState(MOCK_COMPANY_SETTINGS);
    const [, setLoading] = useState(false);

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Settings Saved:', settings);
        setLoading(false);
    };

    const industryOptions = [
        { value: 'retail', label: 'Retail Store' },
        { value: 'tech', label: 'Technology/Software' },
        { value: 'service', label: 'Professional Services' },
    ];

    return (
        <>
            <Header
                icon={<Settings className="w-6 h-6 text-[#00529A]" />}
                title="Company Settings"
                description="Manage your company profile and FIRS integration"
            />


            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Information Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-gray-600" />
                        Company Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Company Name"
                            name="companyName"
                            value={settings.companyName}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Tax Identification Number (TIN)"
                            name="tin"
                            value={settings.tin}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={settings.email}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Phone"
                            name="phone"
                            value={settings.phone}
                            onChange={handleChange}
                        />
                        <Select
                            label="Industry"
                            value={settings.industry}
                            onChange={(e: { target: { value: any; }; }) => setSettings(prev => ({ ...prev, industry: e.target.value }))}
                            options={industryOptions.map(opt => ({ value: opt.label, label: opt.label }))}
                        />
                    </div>

                    <div className="mt-6">

                        <CustomTextArea
                            value={settings.address}
                            onChange={handleChange}
                            label="Address"
                        >

                        </CustomTextArea>
                    </div>
                </div>

                {/* FIRS Integration Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        FIRS Integration
                    </h3>

                    <Input
                        label="FIRS API Key"
                        name="firsApiKey"
                        type="password"
                        placeholder="Enter your FIRS API key"
                        value={settings.firsApiKey}
                        onChange={handleChange}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        This key will be used to validate and submit invoices to FIRS
                    </p>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <Button type="submit" variant="solid" icon={<Save className="w-4 h-4" />} loadingText="Saving">
                        Save Settings
                    </Button>
                </div>
            </form>
        </>
    );
};

export default SettingsPage