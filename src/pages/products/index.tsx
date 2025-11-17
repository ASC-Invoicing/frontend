import { useState, type ChangeEvent } from "react";
import { Search, Plus, Pencil, Trash2, ShoppingBag } from "lucide-react";
import { Empty, Modal } from "antd";
import { Button, Input, LoadingSpinner } from "../../components/ui";
import { Header } from "../../components/header";
import { Link, useOutletContext } from "react-router-dom";
import { useToast } from "../../components/ui/toast/ToastProvider";
import {
    useListProductsQuery,
    useListCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} from "../../features/products/product-slice";
import type { Organization } from "../../features/organizations/organization-slice";
import { CreateCategoryModal } from "./product-category";
import { EditCategoryModal } from "./product-category/EditCategory";
import { EditProductModal } from "./EditProductModal";

interface OutletContext {
    currentOrg: Organization | undefined;
}

interface Product {
    UID?: string;
    Name: string;
    Description?: string;
    UnitPrice: number;
    TaxRate: number;
    Category?: { Name: string };
}

interface ProductCategory {
    UID?: string;
    Name: string;
    Description?: string;
}

// --- Tabs Component ---
const CategoryTabs: React.FC<{
    categories: ProductCategory[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onEdit: (category: ProductCategory) => void;
}> = ({ categories, activeTab, setActiveTab, onEdit }) => (
    <div className="flex flex-wrap bg-[#F4F4F5] p-2 gap-2 rounded-md mb-4">
        <button
            className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${activeTab === "All" ? "bg-white text-black" : "text-gray-500 hover:bg-white hover:text-black"
                }`}
            onClick={() => setActiveTab("All")}
        >
            All
        </button>

        {categories.map((cat) => (
            <div key={cat.UID} className="relative gap-2 flex ">
                <div
                    className={`px-2 py-2 cursor-pointer text-sm flex gap-1 font-medium rounded-md cursor-pointer transition-colors ${activeTab === cat.Name ? "bg-white text-black" : "text-gray-500 hover:bg-white hover:text-black"
                        }`}
                    onClick={() => setActiveTab(cat.Name)}
                >
                    <button className="cursor-pointer">{cat.Name}</button>
                    <button
                        className="cursor-pointer text-gray-400 hover:text-[#0B344B]"
                        onClick={() => onEdit(cat)}
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        ))}
    </div>
);

// --- Product Card with Edit/Delete ---
const ProductCard: React.FC<{
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}> = ({ product, onEdit, onDelete }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between transition-shadow duration-200 hover:shadow-lg">
        <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900 leading-tight pr-4">{product.Name}</h2>
            <div className="flex space-x-2 flex-shrink-0">
                <button
                    className="text-gray-500 cursor-pointer hover:text-[#2563EB] p-1 rounded-md transition-colors"
                    onClick={() => onEdit(product)}
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    className="text-gray-500 cursor-pointer hover:text-red-500 p-1 rounded-md transition-colors"
                    onClick={() => onDelete(product)}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
        <div className="flex-grow mb-4">
            <div className="mb-3">
                <span className="text-xs font-medium text-gray-500">{product.Category?.Name || "Uncategorized"}</span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{product.Description || "No description"}</p>
        </div>
        <div className="pt-4 border-t border-gray-100 space-y-2">
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Unit Price</span>
                <span className="text-lg font-bold text-[#00A859]">₦{product.UnitPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Tax Rate</span>
                <span className="font-semibold text-gray-800">{product.TaxRate}%</span>
            </div>
        </div>
    </div>
);

const ProductPage: React.FC = () => {
    const { currentOrg } = useOutletContext<OutletContext>();
    const orgUID = currentOrg?.UID;
    const { showToast } = useToast();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [editProductModalOpen, setEditProductModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("All");

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<ProductCategory | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryDescription, setNewCategoryDescription] = useState("");

    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const { data: productsData, isLoading: isProductsLoading } = useListProductsQuery(
        { orgUID: orgUID! },
        { skip: !orgUID }
    );
    const { data: categoriesData, isLoading: isCategoriesLoading } = useListCategoriesQuery();
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

    const filteredProducts =
        productsData?.data?.filter(
            (p) =>
                (activeTab === "All" || p.Category?.Name === activeTab) &&
                (p.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.Description?.toLowerCase().includes(searchTerm.toLowerCase()))
        ) || [];

    // --- Category Handlers ---
    const handleCategorySave = async () => {
        try {
            if (categoryToEdit) {
                await updateCategory({
                    UID: categoryToEdit.UID!,
                    Name: newCategoryName,
                    Description: newCategoryDescription,
                }).unwrap();
                showToast("Category updated successfully!", "success");
            } else {
                await createCategory({
                    Name: newCategoryName,
                    Description: newCategoryDescription,
                }).unwrap();
                showToast("Category created successfully!", "success");
            }
            setCategoryToEdit(null);
            setNewCategoryName("");
            setNewCategoryDescription("");
            setIsCategoryModalOpen(false);
        } catch (err: any) {
            showToast(err?.data?.message || "Failed to save category", "error");
        }
    };

    const confirmDeleteCategory = async () => {
        if (!categoryToDelete) return;
        try {
            await deleteCategory({ UID: categoryToDelete.UID! }).unwrap();
            showToast("Category deleted successfully!", "success");
            setCategoryToDelete(null);
        } catch (err) {
            showToast("Failed to delete category", "error");
        }
    };

    const handleEditCategory = (cat: ProductCategory) => {
        setSelectedCategory(cat);
        setEditModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setProductToEdit(product);
        setEditProductModalOpen(true);
    };


    const handleDeleteProduct = (product: Product) => {
        setProductToDelete(product);
    };

    const confirmDeleteProduct = async () => {
        if (!productToDelete || !orgUID) return;
        try {
            await deleteProduct({ UID: productToDelete.UID!, orgUID }).unwrap();
            showToast("Product deleted successfully!", "success");
            setProductToDelete(null);
        } catch (err) {
            showToast("Failed to delete product", "error");
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-sans">
            {/* Header */}
            <Header
                icon={<ShoppingBag className="w-6 h-6 text-[#00A859]" />}
                title="Products & Services"
                description="Manage your product catalog"
                actions={
                    <div className="flex flex-wrap gap-2">
                        <Button
                            className="bg-[#ffffff] !text-[#000000] shadow-xs hover:bg-gray-100 border border-gray-200 order-2 md:order-none"
                            icon={<Plus className="w-4 h-4" />}
                            onClick={() => {
                                setSelectedCategory(null);
                                setEditModalOpen(false);
                                setIsCategoryModalOpen(true);
                            }}
                        >
                            Add Category
                        </Button>

                        <Link to="create-product">
                            <Button
                                icon={<Plus className="w-4 h-4" />}
                                className="order-1 md:order-none"
                            >
                                Add Product
                            </Button>
                        </Link>
                    </div>
                }
            />

            {/* Search */}
            <div className="py-3">
                <div className="relative max-w-full">
                    <Search className="z-50 absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <Input
                        placeholder="       Search products..."
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            {/* Category Tabs */}
            {isCategoriesLoading ? (
                <LoadingSpinner />
            ) : (
                <CategoryTabs
                    categories={categoriesData?.data || []}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onEdit={handleEditCategory}
                />
            )}

            {/* Products Grid */}
            {isProductsLoading ? (
                <LoadingSpinner />
            ) : filteredProducts.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-gray-500 rounded-xl mt-6">
                    <Empty description="No products found for this category." />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.UID ?? product.Name}
                            product={product}
                            onEdit={handleEditProduct}
                            onDelete={handleDeleteProduct}
                        />
                    ))}
                </div>
            )}

            {/* Edit/Create Category Modal */}
            <CreateCategoryModal
                open={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
            />

            {/* Delete Confirmation Modals */}
            <Modal
                open={!!categoryToDelete}
                title="Confirm Delete"
                onOk={confirmDeleteCategory}
                onCancel={() => setCategoryToDelete(null)}
                okText="Delete"
                okType="danger"
            >
                Are you sure you want to delete the category "{categoryToDelete?.Name}"?
            </Modal>

            <Modal
                open={!!productToDelete}
                title="Confirm Delete"
                onOk={confirmDeleteProduct}
                onCancel={() => setProductToDelete(null)}
                okText="Delete"
                okType="danger"                className=""
            >
                Are you sure you want to delete the product "{productToDelete?.Name}"?
            </Modal>

            <EditCategoryModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                category={selectedCategory}
            />

            <EditProductModal
                open={editProductModalOpen}
                onClose={() => setEditProductModalOpen(false)}
                product={productToEdit}
                orgUID={orgUID}
            />

        </div>
    );
};

export default ProductPage;
