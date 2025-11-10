import { useEffect, useState } from "react";
import { Modal } from "antd";
import { Button, Input, Select } from "../../components/ui";
import { CustomTextArea } from "../../components/ui/textarea";
import { useToast } from "../../components/ui/toast/ToastProvider";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useListCategoriesQuery,
} from "../../features/products/product-slice";

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  product: any | null;
  orgUID: string | undefined;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  open,
  onClose,
  product,
  orgUID,
}) => {
  const { showToast } = useToast();
  const { data: categories } = useListCategoriesQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryUID: "",
    unitPrice: 0,
    taxRate: 7.5,
  });

  // Prefill fields when a product is opened
  useEffect(() => {
    if (product) {
      setForm({
        name: product.Name || "",
        description: product.Description || "",
        categoryUID: product.Category?.UID || "",
        unitPrice: product.UnitPrice || 0,
        taxRate: product.TaxRate || 7.5,
      });
    }
  }, [product]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!product?.UID || !orgUID) return;
    setIsSaving(true);
    try {
      await updateProduct({
        orgUID,
        UID: product.UID,
        Name: form.name,
        Description: form.description,
        CategoryUID: form.categoryUID,
        UnitPrice: form.unitPrice,
        TaxRate: form.taxRate,
      }).unwrap();

      showToast("Product updated successfully", "success");
      onClose();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update product", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product?.UID || !orgUID) return;
    setIsDeleting(true);
    try {
      await deleteProduct({ UID: product.UID, orgUID }).unwrap();
      showToast("Product deleted successfully", "success");
      setIsConfirmDelete(false);
      onClose();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to delete product", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        title={`Edit Product - ${product?.Name || ""}`}
        width={800}
        style={{
          top: 0, 
          padding: 0,
        }}
        bodyStyle={{
          height: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: 0,
        }}
      >
        <div className="flex flex-col h-full">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <Input
              label="Product Name *"
              value={form.name}
              onChange={(e: { target: { value: any; }; }) => handleChange("name", e.target.value)}
            />

            <CustomTextArea
              label="Description"
              value={form.description}
              onChange={(e: { target: { value: any; }; }) => handleChange("description", e.target.value)}
            />

            <Select
              label="Category"
              options={(categories?.data || []).map((c) => ({
                value: c.UID,
                label: c.Name,
              }))}
              value={form.categoryUID}
              onChange={(val: any) => handleChange("categoryUID", val)}
            />

            <Input
              label="Unit Price (₦)"
              type="number"
              value={form.unitPrice}
              onChange={(e: { target: { value: any; }; }) =>
                handleChange("unitPrice", Number(e.target.value))
              }
            />

            <Select
              label="Tax Rate (%)"
              options={[
                { value: 7.5, label: "VAT (7.5%)" },
                { value: 0, label: "Zero Tax (0%)" },
              ]}
              value={form.taxRate}
              onChange={(val: any) => handleChange("taxRate", val)}
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-3 py-4 px-6 border-t border-gray-200 bg-white sticky bottom-0">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={isSaving} loadingText="Saving" disabled={isSaving}>
            Save Changes
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsConfirmDelete(true)}
              disabled={isSaving}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={isConfirmDelete}
        onCancel={() => setIsConfirmDelete(false)}
        title="Confirm Deletion"
        onOk={handleDelete}
        okText={isDeleting ? "Deleting" : "Delete"}
        okButtonProps={{ danger: true, loading: isDeleting }}
      >
        Are you sure you want to permanently delete “{product?.Name}”?
      </Modal>
    </>
  );
};
