import { useState } from 'react';
import { FileText, ArrowLeft, Plus, ChevronDown, Trash2, X, Send } from 'lucide-react';
import { Button, Input, Select } from '../../../components/ui';
import { CustomTextArea } from '../../../components/ui/textarea';
import { Link } from 'react-router-dom';
import { Empty } from 'antd';



const CreateProduct = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const ProductOptions = [
        { value: 'retail', label: 'Goods' },
        { value: 'tech', label: 'Technology Service' },
        { value: 'service', label: 'Foodstuff' },
    ];

    
    const TaxOptions = [
        { value: '7.5', label: 'VAT (7.5%)' },
        { value: '0', label: 'Zero Added Tax (0%)' },
        { value: '7.5', label: 'Others (7.5%)' },
    ];

    return (
        <div className="flex flex-col bg-gray-50 font-sans min-h-screen">


            <div className="flex-1 flex justify-center pb-4  ">
                <div className="w-full max-w-5xl space-y-6">
                    <div className='items-center'>
                        <Link to={'/products'}>
                            <p className='flex items-center gap-2 hover:text-blue-400 font-semibold text-sm'><ArrowLeft className="w-4 h-4 text-gray-800 hover:text-blue-500 transition-colors" /> Back to Products</p>
                        </Link>
                        <div className='mt-6'>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Add New Product
                            </h2>
                            <p className='mt-1 text-sm text-gray-500'>Add a new product to your list of products</p>
                        </div>
                    </div>

                    {/* Form Card */}
                    <form onSubmit={handleSubmit} className="">
                        <div className=" space-y-12 ">
                            <div className="pb-6 bg-white rounded-xl  border border-gray-200">
                                <div className="flex justify-between items-baseline border-b border-gray-200 bg-[#F9FAFB] p-6 ">
                                    <h3 className="text-xl font-semibold text-gray-800 ">Product Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-1 px-6 mt-6 lg:grid-cols-1 gap-4">
                                    <Input
                                        label="Product/Service Name *"
                                        id="ProductName"
                                        placeholder="Enter product name"
                                        required
                                    />

                                    <CustomTextArea
                                        label="Description"
                                        id="Description"
                                        placeholder="Enter product description"
                                        className='pb-5'
                                    />                                                                        
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 px-6 mb-6 lg:grid-cols-3 gap-6 px-6'>
                                    <Select
                                        label="Category  *"
                                        id="Category"
                                        options={ProductOptions.map(opt => ({ value: opt.label, label: opt.label }))}>

                                    </Select>
                                    <Input
                                        label="Unit Price (₦)  *"
                                        id="UnitPrice"
                                        placeholder="0"
                                        type="number"
                                        default="0"
                                    />
                                    <Select
                                        label="Tax Rate  *"
                                        id="TaxRate"
                                        options={TaxOptions.map(opt => ({ value: opt.label, label: opt.label }))}>
                                    </Select>

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

export default CreateProduct;
