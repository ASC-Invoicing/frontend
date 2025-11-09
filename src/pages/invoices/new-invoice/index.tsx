import { useState, useMemo } from "react";
import { FileText, ArrowLeft, Plus, X, Send, Trash2 } from "lucide-react";
import { Button, Input, Select } from "../../../components/ui";
import { CustomTextArea } from "../../../components/ui/textarea";
import { Link } from "react-router-dom";
import { DataTable } from "../../../components/ui/table";


const CreateInvoice = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lineItems, setLineItems] = useState([]);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Invoice submitted successfully! (Simulated)");
    }, 2000);
  };

  
  const mockCustomerData = [
    { value: "cust-1", label: "MTN Nigeria" },
    { value: "cust-2", label: "Dangote Group" },
    { value: "cust-3", label: "Access Bank PLC" },
  ];

  const ProductData = [
    { value: "goods", label: "Goods", unitPrice: 20000, taxRate: 7.5 },
    { value: "tech", label: "Technology Service", unitPrice: 45000, taxRate: 7.5 },
    { value: "food", label: "Foodstuff", unitPrice: 10000, taxRate: 5.0 },
  ];


  const handleAddFromProducts = (value) => {
    const selected = ProductData.find((p) => p.label === value);
    if (!selected) return;
    const newItem = {
      id: Date.now(),
      description: selected.label,
      quantity: 1,
      unitPrice: selected.unitPrice,
      taxRate: selected.taxRate,
    };
    setLineItems((prev) => [...prev, newItem]);
  };


  const updateItem = (id, field, value) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: Number(value) || value } : item
      )
    );
  };

 
  const handleRemoveItem = (id) =>
    setLineItems((prev) => prev.filter((item) => item.id !== id));


  const subtotal = useMemo(
    () => lineItems.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0),
    [lineItems]
  );
  const vat = useMemo(
    () => lineItems.reduce((acc, i) => acc + (i.quantity * i.unitPrice * i.taxRate) / 100, 0),
    [lineItems]
  );
  const total = subtotal + vat;


  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => updateItem(record.id, "description", e.target.value)}
          placeholder="Service or Product name"
        />
      ),
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      align: "right",
      render: (qty, record) => (
        <Input
          type="number"
          value={qty}
          onChange={(e) => updateItem(record.id, "quantity", e.target.value)}
        />
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      align: "right",
      render: (price, record) => (
        <Input
          type="number"
          value={price}
          onChange={(e) => updateItem(record.id, "unitPrice", e.target.value)}
        />
      ),
    },
    {
      title: "Tax %",
      dataIndex: "taxRate",
      align: "right",
      render: (tax, record) => (
        <Input
          type="number"
          value={tax}
          onChange={(e) => updateItem(record.id, "taxRate", e.target.value)}
        />
      ),
    },
    {
      title: "Subtotal",
      align: "right",
      render: (_, record) => (
        <>₦{(record.quantity * record.unitPrice).toFixed(2)}</>
      ),
    },
    {
      title: "Tax",
      align: "right",
      render: (_, record) => (
        <>₦{((record.quantity * record.unitPrice * record.taxRate) / 100).toFixed(2)}</>
      ),
    },
    {
      title: "",
      align: "center",
      render: (_, record) => (
        <button
          onClick={() => handleRemoveItem(record.id)}
          className="text-red-500 cursor-pointer hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col font-sans min-h-screen">
      <div className="flex-1 flex justify-center pb-4">
        <div className="w-full max-w-5xl space-y-6">
          {/* --- Header --- */}
          <div className="items-center">
            <Link to={"/invoices"}>
              <p className="flex items-center gap-2 hover:text-[#00786F] font-semibold text-sm">
                <ArrowLeft className="w-4 h-4 text-gray-800 hover:text-[#00786F] transition-colors" />
                Back to Invoices
              </p>
            </Link>
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Submit Invoice to FIRS
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Fill in the invoice details and submit for FIRS validation
              </p>
            </div>
          </div>

          {/* --- Invoice Form --- */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-12">
              {/* --- Section 1: Invoice Details --- */}
              <div className="space-y- bg-white rounded-xl border border-gray-200">
                <div className="flex justify-between items-baseline border-b border-gray-200 bg-[#F9FAFB] p-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Invoice Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 p-6 lg:grid-cols-2 gap-6">
                  <Input
                    label="Invoice Number *"
                    id="invoiceNumber"
                    placeholder="INV-1761487276025"
                    required
                    defaultValue="INV-1761487276025"
                    readOnly
                  />

                  <Select
                    label="Customer *"
                    options={mockCustomerData.map((opt) => ({
                      value: opt.label,
                      label: opt.label,
                    }))}
                    placeholder="Select a customer"
                  />

                  <Input
                    label="Invoice Date *"
                    id="invoiceDate"
                    placeholder="mm/dd/yyyy"
                    type="date"
                    required
                    defaultValue="2025-10-26"
                  />

                  <Input
                    label="Due Date"
                    id="dueDate"
                    placeholder="mm/dd/yyyy"
                    type="date"
                  />
                </div>
              </div>

              {/* --- Section 2: Line Items --- */}
              <div className="space-y-6 bg-white rounded-xl border border-gray-200">
                <div className="flex justify-between flex-wrap space-y-4 md:space-y-0 items-baseline border-b border-gray-200 bg-[#F9FAFB] p-6">
                  <h3 className="text-xl font-semibold text-gray-800">Line Items</h3>
                  <div className="flex flex-wrap space-y-2 md:space-y-0space-x-3">
                    <Select
                      options={ProductData.map((opt) => ({
                        value: opt.label,
                        label: opt.label,
                      }))}
                      className="w-[250px]"
                      placeholder="Add from products"
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
                            description: "",
                            quantity: 1,
                            unitPrice: 0,
                            taxRate: 7.5,
                          },
                        ])
                      }
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

                  {/* Totals */}
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
                      <div className="flex justify-between text-lg font-bold text-blue-600 pt-2 border-t border-gray-300">
                        <span>Total:</span>
                        <span>₦{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- Section 3: Additional Information --- */}
              <div className="bg-white rounded-xl border border-gray-200 space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 bg-[#F9FAFB] p-6">
                  Additional Information
                </h3>
                <CustomTextArea
                  label="Notes"
                  id="notes"
                  placeholder="Add any additional notes or terms..."
                  className="px-6 pb-5"
                />
              </div>
            </div>

            {/* --- Footer --- */}
            <div className="flex flex-wrap space-y-3 md:space-y-0 justify-between items-center mt-5 p-4 rounded-b-xl">
              <Button
                className="bg-white border border-gray-200 text-gray-700"
                onClick={() => console.log("Cancel clicked")}
                type="button"
                variant="ghost"
              >
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <div className="flex flex-wrap space-y-2 md:space-y-0 space-x-3">
                <Button
                  icon={<Send className="w-4 h-4" />}
                  className="bg-[#9333EA] hover:bg-purple-700"
                  type="button"
                  loadingText="Submitting"
                  disabled={isSubmitting}
                >
                  Submit to FIRS
                </Button>
                <Button
                  type="submit"
                  icon={<FileText className="w-4 h-4" />}
                  variant="solid"
                  disabled={isSubmitting}
                  loadingText="Saving"
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
