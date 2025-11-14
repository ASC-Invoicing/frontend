import { useState, useMemo, type FormEvent, type SetStateAction } from "react";
import { FileText, ArrowLeft, Plus, X, Send, Trash2 } from "lucide-react";
import { Button, Input, Select } from "../../../components/ui";
import { CustomTextArea } from "../../../components/ui/textarea";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { DataTable } from "../../../components/ui/table";
import { useToast } from "../../../components/ui/toast/ToastProvider";
import {
  useCreateInvoiceMutation,
  useAddLineItemMutation,
  useUpdateLineItemMutation,
  useDeleteLineItemMutation,
} from "../../../features/invoices/invoice-slice";
import { useListProductsQuery } from "../../../features/products/product-slice";
import type { Organization } from "../../../features/organizations/organization-slice";

interface LineItem {
  id: number;
  UID?: string;
  Description: string;
  Quantity: number;
  UnitPrice: number;
  TaxRate: number;
}

interface ProductOption {
  value: string;
  label: string;
  unitPrice: number;
  taxRate: number;
}

interface OutletContext {
  currentOrg: Organization | undefined;
}

const CreateInvoice = () => {
  const { currentOrg } = useOutletContext<OutletContext>();
  const orgUID = currentOrg?.UID;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { data: productsData, isLoading: isProductsLoading } = useListProductsQuery(
    { orgUID: orgUID! },
    { skip: !orgUID }
  );

  const [createInvoice] = useCreateInvoiceMutation();
  const [addLineItem] = useAddLineItemMutation();
  const [updateLineItem] = useUpdateLineItemMutation();
  const [deleteLineItem] = useDeleteLineItemMutation();

  const [invoiceUID, setInvoiceUID] = useState<string | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [customerTIN, setCustomerTIN] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const ProductOptions: ProductOption[] =
    productsData?.data?.map((p) => ({
      value: p.UID!,
      label: p.Name,
      unitPrice: p.UnitPrice,
      taxRate: p.TaxRate,
    })) || [];

  const handleAddFromProducts = async (productUID: string) => {
    const selected = ProductOptions.find((p) => p.value === productUID);
    if (!selected) return;

    const newItem: LineItem = {
      id: Date.now(),
      Description: selected.label,
      Quantity: 1,
      UnitPrice: selected.unitPrice,
      TaxRate: selected.taxRate,
    };

    setLineItems((prev) => [...prev, newItem]);

    if (!invoiceUID) return; // wait for first draft to exist

    try {
      const res = await addLineItem({
        orgUID: orgUID!,
        InvoiceUID: invoiceUID,
        Description: newItem.Description,
        Quantity: newItem.Quantity,
        UnitPrice: newItem.UnitPrice,
        TaxRate: newItem.TaxRate,
      }).unwrap();

      setLineItems((prev) =>
        prev.map((item) =>
          item.id === newItem.id ? { ...item, UID: res.data?.UID } : item
        )
      );
      showToast("Line item added", "success");
    } catch {
      showToast("Failed to add line item", "error");
    }
  };

  const updateItem = async (id: number, field: keyof LineItem, value: string | number) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: Number(value) || (value as any) } : item
      )
    );

    const item = lineItems.find((i) => i.id === id);
    if (item?.UID && invoiceUID && orgUID) {
      try {
        await updateLineItem({
          orgUID,
          invoiceUID,
          lineItemUID: item.UID,
          [field]: Number(value),
        }).unwrap();
        showToast("Line item updated", "success");
      } catch {
        showToast("Failed to update line item", "error");
      }
    }
  };

  const handleRemoveItem = async (id: number) => {
    const item = lineItems.find((i) => i.id === id);
    if (item?.UID && invoiceUID && orgUID) {
      try {
        await deleteLineItem({ orgUID, invoiceUID, lineItemUID: item.UID }).unwrap();
        showToast("Line item deleted", "success");
      } catch {
        showToast("Failed to delete line item", "error");
        return;
      }
    }
    setLineItems((prev) => prev.filter((i) => i.id !== id));
  };

  const subtotal = useMemo(() => lineItems.reduce((acc, i) => acc + i.Quantity * i.UnitPrice, 0), [lineItems]);
  const vat = useMemo(() => lineItems.reduce((acc, i) => acc + (i.Quantity * i.UnitPrice * i.TaxRate) / 100, 0), [lineItems]);
  const total = subtotal + vat;

  const handleSubmit = async (e: FormEvent, submitToFIRS = false) => {
    e.preventDefault();
    if (submitToFIRS) setIsSubmitting(true);
    else setIsSavingDraft(true);

    try {
      if (!orgUID) throw new Error("No org selected");
      if (!customerTIN) throw new Error("Customer TIN required");
      if (lineItems.length === 0) throw new Error("Add at least one line item");

      const payload = {
        orgUID,
        InvoiceDate: invoiceDate,
        DueDate: dueDate,
        BusinessTIN: customerTIN,
        Notes: notes,
        SubmitToFIRS: submitToFIRS,
        LineItems: lineItems.map(({ Description, Quantity, UnitPrice, TaxRate }) => ({
          Description,
          Quantity,
          UnitPrice,
          TaxRate,
        })),
      };

      let res;
      if (!invoiceUID || submitToFIRS) {
        res = await createInvoice(payload).unwrap();
        setInvoiceUID(res.data.UID);
        showToast(submitToFIRS ? "Invoice submitted to FIRS" : "Draft saved", "success");
      } else {
        showToast("Draft updated", "success");
      }

      if (submitToFIRS) navigate("/invoices");
    } catch (err) {
      showToast("Failed to save invoice", "error");
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setIsSavingDraft(false);
    }
  };

  const columns = [
    { title: "Description", dataIndex: "Description", render: (text: string, record: LineItem) => (
        <Input value={text} placeholder="Service or Product name" onChange={(e: { target: { value: string | number; }; }) => updateItem(record.id, "Description", e.target.value)} />
    ) },
    { title: "Qty", dataIndex: "Quantity", align: "right" as const, render: (qty: number, record: LineItem) => (
        <Input type="number" value={qty} onChange={(e: { target: { value: string | number; }; }) => updateItem(record.id, "Quantity", e.target.value)} />
    ) },
    { title: "Unit Price", dataIndex: "UnitPrice", align: "right" as const, render: (price: number, record: LineItem) => (
        <Input type="number" value={price} onChange={(e: { target: { value: string | number; }; }) => updateItem(record.id, "UnitPrice", e.target.value)} />
    ) },
    { title: "Tax %", dataIndex: "TaxRate", align: "right" as const, render: (tax: number, record: LineItem) => (
        <Input type="number" value={tax} onChange={(e: { target: { value: string | number; }; }) => updateItem(record.id, "TaxRate", e.target.value)} />
    ) },
    { title: "", align: "center" as const, render: (_: unknown, record: LineItem) => (
        <button onClick={() => handleRemoveItem(record.id)} className="text-red-500 cursor-pointer hover:text-red-700">
          <Trash2 className="w-4 h-4" />
        </button>
    ) },
  ];

  return (
    <div className="flex flex-col font-sans min-h-screen">
      <div className="flex-1 flex justify-center pb-4">
        <div className="w-full max-w-5xl space-y-6">
          {/* Header */}
          <div className="items-center">
            <Link to={"/invoices"}>
              <p className="flex items-center gap-2 hover:text-[#00A859] font-semibold text-sm">
                <ArrowLeft className="w-4 h-4 text-gray-800 hover:text-[#00A859] transition-colors" />
                Back to Invoices
              </p>
            </Link>
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-gray-900">Submit Invoice to FIRS</h2>
              <p className="mt-1 text-sm text-gray-500">Fill in the invoice details and submit for FIRS validation</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-12">
              {/* Invoice Details */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="flex justify-between items-baseline border-b border-gray-200 bg-[#F9FAFB] p-6">
                  <h3 className="text-xl font-semibold text-gray-800">Invoice Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 p-6 lg:grid-cols-2 gap-6">
                  <Input
                    label="Customer TIN *"
                    id="customerTIN"
                    placeholder="Enter customer TIN"
                    value={customerTIN}
                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setCustomerTIN(e.target.value)}
                    required
                  />

                  <Input
                    label="Invoice Date *"
                    id="invoiceDate"
                    placeholder="mm/dd/yyyy"
                    type="date"
                    required
                    value={invoiceDate}
                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setInvoiceDate(e.target.value)}
                  />

                  <Input
                    label="Due Date"
                    id="dueDate"
                    placeholder="mm/dd/yyyy"
                    type="date"
                    value={dueDate}
                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-6 bg-white rounded-xl border border-gray-200">
                <div className="flex justify-between items-baseline border-b border-gray-200 bg-[#F9FAFB] p-6">
                  <h3 className="text-xl font-semibold text-gray-800">Line Items</h3>
                  <div className="flex gap-3">
                    <Select
                      options={ProductOptions.map((opt) => ({
                        value: opt.value,
                        label: opt.label,
                      }))}
                      className="w-[250px]"
                      placeholder={
                        isProductsLoading
                          ? "Loading products..."
                          : "Add from products"
                      }
                      disabled={isProductsLoading || !ProductOptions.length}
                      onChange={handleAddFromProducts}
                    />
                    <Button
                      icon={<Plus className="w-4 h-4" />}
                      className="bg-white border border-gray-200 text-gray-700"
                      onClick={() =>
                        setLineItems((prev) => [
                          ...prev,
                          {
                            id: Date.now(),
                            Description: "",
                            Quantity: 1,
                            UnitPrice: 0,
                            TaxRate: 7.5,
                          },
                        ])
                      }
                      type="button"
                      variant="ghost"
                    >
                      Add Item
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  <DataTable
                    columns={columns}
                    dataSource={lineItems}
                    emptyText="No items added yet."
                    bordered
                  />

                  <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                    <div className="w-full max-w-xs space-y-2 text-sm">
                      <div className="flex justify-between font-medium text-gray-600">
                        <span>Subtotal:</span>
                        <span>₦{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium text-gray-600">
                        <span>Tax (VAT):</span>
                        <span>₦{vat.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-[#00A859] pt-2 border-t border-gray-300">
                        <span>Total:</span>
                        <span>₦{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-white rounded-xl border border-gray-200 space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 bg-[#F9FAFB] p-6">
                  Additional Information
                </h3>
                <CustomTextArea
                  label="Notes"
                  id="notes"
                  placeholder="Add any additional notes or terms..."
                  className="px-6 pb-5"
                  value={notes}
                  onChange={(e: { target: { value: SetStateAction<string>; }; }) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-wrap justify-between items-center mt-5 p-4 rounded-b-xl">
              <Button
                className="bg-white border border-gray-200 text-gray-700"
                onClick={() => navigate("/invoices")}
                type="button"
                variant="ghost"
              >
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <div className="flex gap-3">
                <Button
                  icon={<Send className="w-4 h-4" />}
                  className="bg-[#9333EA] hover:bg-purple-700"
                  type="button"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  loadingText="Submitting"
                  onClick={(e) => handleSubmit(e, true)}
                >
                  Submit to FIRS
                </Button>

                <Button
                  type="button"
                  icon={<FileText className="w-4 h-4" />}
                  variant="solid"
                  disabled={isSavingDraft}
                  loading={isSavingDraft}
                  loadingText="Saving"
                  onClick={(e) => handleSubmit(e, false)}
                >
                  Save as Draft
                </Button>

              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
