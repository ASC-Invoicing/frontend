import { useState, type SetStateAction } from "react";
import { Button, Input } from "../../../components/ui";
import { Modal } from "../../../components/ui/modal";
import { 
  useUpdateCategoryMutation, 
  useDeleteCategoryMutation, 
  useListCategoriesQuery 
} from "../../../features/products/product-slice";
import { useToast } from "../../../components/ui/toast/ToastProvider";
import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  category: { UID: string; Name: string; Description?: string } | null;
}

export const EditCategoryModal: React.FC<Props> = ({ open, onClose, category }) => {
  const { showToast } = useToast();
  const { refetch } = useListCategoriesQuery();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [name, setName] = useState(category?.Name || "");
  const [description, setDescription] = useState(category?.Description || "");


  React.useEffect(() => {
    if (category) {
      setName(category.Name);
      setDescription(category.Description || "");
    }
  }, [category]);

  const handleUpdate = async () => {
    if (!name.trim()) return;
    try {
      await updateCategory({
        UID: category?.UID,
        Name: name.trim(),
        Description: description.trim(),
      }).unwrap();
      showToast("Category updated successfully!", "success");
      refetch();
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      showToast("Failed to update category", "error");
    }
  };

  const handleDelete = async () => {
    if (!category?.UID) return;
    try {
      await deleteCategory({ UID: category.UID }).unwrap();
      showToast("Category deleted successfully", "success");
      refetch();
      onClose();
    } catch (error) {
      console.error("Delete failed:", error);
      showToast("Failed to delete category", "error");
    }
  };

  return (
    <>
      {/* Main edit modal */}
      <Modal
        open={open}
        onCancel={onClose}
        title={`Edit Category: ${category?.Name || ""}`}
        footer={false}
      >
        <div className="space-y-4 mt-6">
          <Input
            label="Category Name"
            value={name}
            onChange={(e: { target: { value: SetStateAction<string> } }) =>
              setName(e.target.value)
            }
            required
          />
          <Input
            label="Description"
            value={description}
            onChange={(e: { target: { value: SetStateAction<string> } }) =>
              setDescription(e.target.value)
            }
          />

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => setConfirmDelete(true)}
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </Button>
            <div className="space-x-2">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                loading={isUpdating}
                loadingText="Saving"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Confirm delete modal */}
      <Modal
        open={confirmDelete}
        onCancel={() => setConfirmDelete(false)}
        title="Confirm Deletion"
        footer={false}
      >
        <div className="space-y-4 mt-6">
          <p>Are you sure you want to delete <strong>{category?.Name}</strong>?</p>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              loading={isDeleting}
              loadingText="Deleting..."
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
