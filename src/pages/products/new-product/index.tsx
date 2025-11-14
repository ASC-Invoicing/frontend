import { useState } from "react";
import { Button, Input, Select } from "../../../components/ui";
import { CustomTextArea } from "../../../components/ui/textarea";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { X, ArrowLeft } from "lucide-react";
import { useCreateProductMutation, useListCategoriesQuery } from "../../../features/products/product-slice";
import { CreateCategoryModal } from "../product-category";
import { useToast } from "../../../components/ui/toast/ToastProvider";
import type { Organization } from "../../../features/organizations/organization-slice";

interface OutletContext {
    currentOrg: Organization | undefined;
}

const CreateProduct = () => {
    const { currentOrg } = useOutletContext<OutletContext>();
    const orgUID = currentOrg?.UID;
    const navigate = useNavigate();
    const { showToast } = useToast(); // ✅ matches CreateInvoice

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const { data: categories } = useListCategoriesQuery();
    const [createProduct] = useCreateProductMutation();

    const [form, setForm] = useState({
        name: "",
        description: "",
        categoryUID: "",
        unitPrice: 0,
        taxRate: 7.5,
    });

    const handleChange = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!orgUID) {
                showToast("Organization not selected", "error");
                return;
            }

            await createProduct({
                orgUID,
                Name: form.name,
                Description: form.description,
                CategoryUID: form.categoryUID,
                UnitPrice: form.unitPrice,
                TaxRate: form.taxRate,
            }).unwrap();

            showToast("Product created successfully", "success");

            setForm({
                name: "",
                description: "",
                categoryUID: "",
                unitPrice: 0,
                taxRate: 7.5,
            });

            navigate("/products");
        } catch (err: any) {
            console.error("Product creation failed:", err);
            showToast(
                err?.data?.message || "Failed to create product. Please try again.",
                "error"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col font-sans min-h-screen">
            <div className="flex-1 flex justify-center pb-4">
                <div className="w-full max-w-5xl space-y-6">
                    <Link
                        to="/products"
                        className="flex items-center gap-2 text-sm font-semibold hover:text-[#00A859]"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Products
                    </Link>

                    <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
                    <p className="text-sm text-gray-500">
                        Add a new product to your catalog
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-xl border border-gray-200 p-6 space-y-6"
                    >
                        <Input
                            label="Product/Service Name *"
                            placeholder="Enter product name"
                            value={form.name}
                            onChange={(e: { target: { value: any; }; }) => handleChange("name", e.target.value)}
                            required
                        />

                        <CustomTextArea
                            label="Description"
                            placeholder="Enter description"
                            value={form.description}
                            onChange={(e: { target: { value: any; }; }) => handleChange("description", e.target.value)}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center gap-2">
                                    <Select
                                        label="Product Category"
                                        options={(categories?.data || []).map((c) => ({
                                            value: c.UID,
                                            label: c.Name,
                                        }))}
                                        value={form.categoryUID}
                                        onChange={(val: any) => handleChange("categoryUID", val)}
                                        className="w-2/3"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => setOpenCategoryModal(true)}
                                        className="mt-0 md:mt-5"
                                    >
                                        + New
                                    </Button>
                                </div>
                            </div>

                            <Input
                                label="Unit Price (₦) *"
                                type="number"
                                value={form.unitPrice}
                                onChange={(e: { target: { value: any; }; }) =>
                                    handleChange("unitPrice", Number(e.target.value))
                                }
                            />

                            <Select
                                label="Tax Rate *"
                                options={[
                                    { value: 7.5, label: "VAT (7.5%)" },
                                    { value: 0, label: "Zero Tax (0%)" },
                                ]}
                                value={form.taxRate}
                                onChange={(val: any) => handleChange("taxRate", val)}
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={() => navigate("/products")}
                            >
                                <X className="w-4 h-4 mr-2" /> Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                loading={isSubmitting}
                                loadingText="Saving"
                            >
                                Save Product
                            </Button>
                        </div>
                    </form>

                    <CreateCategoryModal
                        open={openCategoryModal}
                        onClose={() => setOpenCategoryModal(false)}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;
