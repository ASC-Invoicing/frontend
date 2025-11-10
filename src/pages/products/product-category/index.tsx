import { useState, type SetStateAction } from "react";
import { Button, Input } from "../../../components/ui";
import { Modal } from "../../../components/ui/modal";
import { useCreateCategoryMutation, useListCategoriesQuery } from "../../../features/products/product-slice";
import { useToast } from "../../../components/ui/toast/ToastProvider";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateCategoryModal: React.FC<Props> = ({ open, onClose }) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const { showToast } = useToast();
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const { refetch } = useListCategoriesQuery();

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      await createCategory({
        Name: newCategoryName.trim(),
        Description: newCategoryDescription.trim(),
      }).unwrap();

      showToast("Category created successfully!", "success");
      setNewCategoryName("");
      setNewCategoryDescription("");
      refetch();
      onClose();
    } catch (error) {
      console.error("Category creation failed:", error);
      showToast("Failed to create category", "error");
    }
  };

  return (
    <Modal
      open={open}       
      onCancel={onClose}      
      title="Create New Product Category"
      footer={false}
    >
      <div className="space-y-4 mt-6">
        <Input
          label="Category Name"
          value={newCategoryName}
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setNewCategoryName(e.target.value)
          }
          required
        />
        <Input
          label="Description"
          value={newCategoryDescription}
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setNewCategoryDescription(e.target.value)
          }
        />

        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateCategory}
            loading={isLoading}
            loadingText="Saving"
          >
            Save Category
          </Button>
        </div>
      </div>
    </Modal>
  );
};
