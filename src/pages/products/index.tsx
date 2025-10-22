import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { Button as AntButton } from "antd";
import { Input } from '../../components/ui';

type ProductType = 'services' | 'digital services' | 'physical goods';

interface Product {
    id: string;
    name: string;
    type: ProductType;
    description: string;
    unitPrice: number;
    taxRate: number;
}

const mockProducts: Product[] = [
    {
        id: 'PROD-001',
        name: 'Business Consulting Services',
        type: 'services',
        description: 'Professional business advisory and consulting services',
        unitPrice: 250000,
        taxRate: 7.5
    },
    {
        id: 'PROD-002',
        name: 'Software Development',
        type: 'digital services',
        description: 'Custom software development and implementation',
        unitPrice: 500000,
        taxRate: 7.5
    },
    {
        id: 'PROD-003',
        name: 'IT Support & Maintenance',
        type: 'services',
        description: 'Monthly IT infrastructure support and maintenance',
        unitPrice: 150000,
        taxRate: 7.5
    },
    {
        id: 'PROD-004',
        name: 'Enterprise Hardware Leasing',
        type: 'physical goods',
        description: 'Long-term leasing of server hardware and networking equipment.',
        unitPrice: 850000,
        taxRate: 7.5
    },
];

const currencyFormatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
});


const TypeTag: React.FC<{ type: ProductType }> = ({ type }) => {
    let colorClass = 'bg-purple-100 text-purple-700'; // Default: services
    if (type === 'digital services') colorClass = 'bg-green-100 text-green-700';
    if (type === 'physical goods') colorClass = 'bg-orange-100 text-orange-700';

    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass}`}>
            {type.replace(' ', ' ')}
        </span>
    );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between transition-shadow duration-200 hover:shadow-lg">

            {/* Header and Actions */}
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900 leading-tight pr-4">
                    {product.name}
                </h2>
                <div className="flex space-x-2 flex-shrink-0">
                    <button className="text-gray-500 hover:text-[#2563EB] p-1 rounded-md transition-colors">
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-red-500 p-1 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Body Content */}
            <div className="flex-grow mb-4">
                <div className="mb-3">
                    <TypeTag type={product.type} />
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            </div>

            {/* Footer Details */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Unit Price</span>
                    <span className="text-lg font-bold text-[#2563EB]">
                        {currencyFormatter.format(product.unitPrice)}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Tax Rate</span>
                    <span className="font-semibold text-gray-800">{product.taxRate}%</span>
                </div>
            </div>
        </div>
    );
};


const ProductPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredProducts = mockProducts.filter(product => {
        const term = searchTerm.toLowerCase();
        return product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term);
    });

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">

            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-3xl font-bold text-gray-900">Products & Services</h1>
                    <p className="text-sm text-gray-500">Manage your product catalog</p>
                </div>

                <AntButton type="primary" className="flex items-center bg-[#2563EB] text-white h-10 px-4 font-medium rounded-lg hover:bg-[#1d4ed8] border-0 shadow-lg shadow-[#2563EB]/40">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                </AntButton>
            </header>

            {/* Search Input */}
            <div className="p-4 sm:p-6 bg-white border-b border-gray-200">
                <div className="relative max-w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        
                    <Input
                        icon={<Search className="w-5 h-5" />}
                        placeholder="Search products..."
                        type="text"
                        name="search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    ></Input>
                </div>
            </div>

            {/* Product Cards */}
            <main className="p-4 sm:p-6 flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="p-10 text-center text-gray-500 bg-white rounded-xl shadow-md mt-6">
                        No products or services found matching your criteria.
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProductPage;
