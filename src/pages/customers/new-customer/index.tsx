import { useState } from 'react';
import { FileText, ArrowLeft, Plus, ChevronDown, Trash2, X, Send } from 'lucide-react';
import { Button, Input, Select } from '../../../components/ui';
import { CustomTextArea } from '../../../components/ui/textarea';
import { Link } from 'react-router-dom';
import { Empty } from 'antd';



const CreateCustomer = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lineItems, setLineItems] = useState([]);

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log("Submitting Customer");
        // Simulate API call delay
        setTimeout(() => {
            setIsSubmitting(false);
            alert("Customer Added");
        }, 2000);
    };



    return (
        <div className="flex flex-col font-sans min-h-screen">


            <div className="flex-1 flex justify-center pb-4  ">
                <div className="w-full max-w-5xl space-y-6">
                    <div className='items-center'>
                        <Link to={'/customers'}>
                            <p className='flex items-center gap-2 hover:text-[#00A859] font-semibold text-sm'><ArrowLeft className="w-4 h-4 text-gray-800 hover:text-[#00A859] transition-colors" /> Back to Customers</p>
                        </Link>
                        <div className='mt-6'>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Add New Customer
                            </h2>
                            <p className='mt-1 text-sm text-gray-500'>Add a new customer to your list of customers</p>
                        </div>
                    </div>

                    {/* Form Card */}
                    <form onSubmit={handleSubmit} className="">
                        <div className=" space-y-12 ">
                            <div className="pb-6 bg-white rounded-xl  border border-gray-200">
                                <div className="flex justify-between items-baseline border-b border-gray-200 bg-[#F9FAFB] p-6 ">
                                    <h3 className="text-xl font-semibold text-gray-800 ">Customer Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 p-6 lg:grid-cols-2 gap-6">
                                    <Input
                                        label="Customer Name *"
                                        id="CustomerName"
                                        placeholder="Dangote LTD"
                                        required
                                    />

                                    <Input
                                        label="Tax ID (TIN) *"
                                        id="CustomerTIN"
                                        placeholder="Enter TIN"
                                        required
                                    />

                                    <Input
                                        label="Email *"
                                        id="Email"
                                        placeholder="customer@example.com"
                                        required
                                    />

                                    <Input
                                        label="Phone *"
                                        id="+234XXXXXX"
                                        placeholder="Dangote LTD"
                                        required
                                    />
                                </div>

                                <div>
                                    <CustomTextArea
                                        label="Address"
                                        id="address"
                                        placeholder="Enter customer address"
                                        className='px-6 pb-5'
                                    />

                                </div>

                                <div className="flex justify-end px-6  space-x-3">
                                    <Button
                                        className="bg-white border border-gray-200 text-gray-700"
                                        onClick={() => console.log("Cancel clicked")}
                                        type="button"
                                        variant='ghost'
                                    >
                                        <X className="w-4 h-4 mr-2" /> Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        icon={<FileText className="w-4 h-4" />}
                                        className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                                        disabled={isSubmitting}
                                        loadingText="Saving"
                                    >
                                        Save Customer
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCustomer;
