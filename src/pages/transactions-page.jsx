import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Eye, Download, X, Upload, CheckCircle2 } from "lucide-react";

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [transactions, setTransactions] = useState([
    {
      id: "TRX-001",
      date: "2024-01-15",
      total: 350000,
      status: "pending",
      paymentMethod: "bank_transfer",
      deliveryMethod: "delivery",
      items: [
        { name: "The Midnight Library", quantity: 1, price: 125000 },
        { name: "Atomic Habits", quantity: 2, price: 112500 },
      ],
      shippingAddress: {
        fullName: "John Doe",
        phone: "081234567890",
        address: "Jl. Sudirman No. 123",
        city: "Jakarta Selatan",
        postalCode: "12190",
      },
      selectedShipping: "JNE Regular",
      proofOfPayment: null,
    },
    {
      id: "TRX-002",
      date: "2024-01-10",
      total: 185000,
      status: "completed",
      paymentMethod: "e_wallet",
      deliveryMethod: "pickup",
      items: [
        { name: "BookVerse T-Shirt", quantity: 1, price: 150000 },
        { name: "Bookmark Set", quantity: 2, price: 17500 },
      ],
      pickupLocation: "BookVerse Store - Jakarta",
      proofOfPayment: "proof_trx002.jpg",
    },
    {
      id: "TRX-003",
      date: "2024-01-05",
      total: 275000,
      status: "shipped",
      paymentMethod: "credit_card",
      deliveryMethod: "delivery",
      items: [
        { name: "Dune", quantity: 1, price: 185000 },
        { name: "Notebook A5", quantity: 2, price: 45000 },
      ],
      shippingAddress: {
        fullName: "John Doe",
        phone: "081234567890",
        address: "Jl. Thamrin No. 45",
        city: "Jakarta Pusat",
        postalCode: "10350",
      },
      selectedShipping: "JNE YES",
      proofOfPayment: "proof_trx003.jpg",
    },
    {
      id: "TRX-004",
      date: "2024-01-18",
      total: 95000,
      status: "pending",
      paymentMethod: "cash_on_delivery",
      deliveryMethod: "delivery",
      items: [
        { name: "Ceramic Mug", quantity: 1, price: 85000 },
        { name: "Bookmark", quantity: 1, price: 10000 },
      ],
      shippingAddress: {
        fullName: "John Doe",
        phone: "081234567890",
        address: "Jl. Gatot Subroto No. 78",
        city: "Jakarta Selatan",
        postalCode: "12780",
      },
      selectedShipping: "SiCepat Regular",
      proofOfPayment: null,
    },
  ]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        text: "Pending Payment",
      },
      completed: { color: "bg-green-100 text-green-800", text: "Completed" },
      shipped: { color: "bg-blue-100 text-blue-800", text: "Shipped" },
      cancelled: { color: "bg-red-100 text-red-800", text: "Cancelled" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const getPaymentMethodName = (method) => {
    const methods = {
      bank_transfer: "Bank Transfer",
      credit_card: "Credit Card",
      e_wallet: "E-Wallet",
      cash_on_delivery: "Cash on Delivery",
    };
    return methods[method] || method;
  };

  const handleViewDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
    setUploadedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Maximum file size is 2MB");
        return;
      }
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("File format must be .JPG or .PNG");
        return;
      }
      setUploadedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Maximum file size is 2MB");
        return;
      }
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("File format must be .JPG or .PNG");
        return;
      }
      setUploadedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmitProof = () => {
    if (!uploadedFile) {
      alert("Please upload payment proof first");
      return;
    }

    // Update transaction with proof
    const updatedTransactions = transactions.map((t) =>
      t.id === selectedTransaction.id
        ? { ...t, proofOfPayment: uploadedFile.name, status: "completed" }
        : t
    );
    setTransactions(updatedTransactions);

    alert("Payment proof submitted successfully!");
    setShowDetailModal(false);
    setUploadedFile(null);
  };

  const handleDownloadInvoice = (transaction) => {
    alert(`Downloading invoice for ${transaction.id}`);
  };

  return (
    <div className="bg-white min-h-screen font-poppins">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-[1440px] mx-auto px-20">
          <h1 className="font-poppins text-[28px] font-bold text-slate-800 m-0 leading-relaxed">
            My Transactions
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-20 pt-12 pb-20">
        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-poppins text-sm font-semibold text-slate-700">
                    Order ID
                  </th>
                  <th className="text-left py-4 px-6 font-poppins text-sm font-semibold text-slate-700">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 font-poppins text-sm font-semibold text-slate-700">
                    Total
                  </th>
                  <th className="text-left py-4 px-6 font-poppins text-sm font-semibold text-slate-700">
                    Payment Method
                  </th>
                  <th className="text-left py-4 px-6 font-poppins text-sm font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-poppins text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="py-4 px-6">
                      <span className="font-poppins text-sm font-medium text-slate-800">
                        {transaction.id}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-poppins text-sm text-slate-600">
                        {new Date(transaction.date).toLocaleDateString("id-ID")}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-poppins text-sm font-semibold text-blue-600">
                        Rp {transaction.total.toLocaleString("id-ID")}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-poppins text-sm text-slate-600">
                        {getPaymentMethodName(transaction.paymentMethod)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetail(transaction)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(transaction)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300"
                          title="Download Invoice"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {transactions.length === 0 && (
          <div className="text-center py-16">
            <p className="font-poppins text-base text-slate-500">
              No transactions found
            </p>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setShowDetailModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="font-poppins text-xl font-bold text-slate-800 m-0">
                  Transaction Details
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="font-poppins text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                      Order Information
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-poppins text-sm text-slate-600">
                          Order ID:
                        </span>
                        <span className="font-poppins text-sm font-medium text-slate-800">
                          {selectedTransaction.id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-poppins text-sm text-slate-600">
                          Date:
                        </span>
                        <span className="font-poppins text-sm font-medium text-slate-800">
                          {new Date(
                            selectedTransaction.date
                          ).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-poppins text-sm text-slate-600">
                          Status:
                        </span>
                        {getStatusBadge(selectedTransaction.status)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="font-poppins text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                      Payment Information
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-poppins text-sm text-slate-600">
                          Method:
                        </span>
                        <span className="font-poppins text-sm font-medium text-slate-800">
                          {getPaymentMethodName(
                            selectedTransaction.paymentMethod
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-poppins text-sm text-slate-600">
                          Total:
                        </span>
                        <span className="font-poppins text-sm font-bold text-blue-600">
                          Rp {selectedTransaction.total.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="mb-6">
                  <h3 className="font-poppins text-base font-semibold text-slate-800 mb-3">
                    Delivery Information
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-4">
                    {selectedTransaction.deliveryMethod === "delivery" ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <p className="font-poppins text-xs text-slate-500 mb-1">
                              Recipient
                            </p>
                            <p className="font-poppins text-sm font-medium text-slate-800">
                              {selectedTransaction.shippingAddress?.fullName}
                            </p>
                          </div>
                          <div>
                            <p className="font-poppins text-xs text-slate-500 mb-1">
                              Phone
                            </p>
                            <p className="font-poppins text-sm font-medium text-slate-800">
                              {selectedTransaction.shippingAddress?.phone}
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="font-poppins text-xs text-slate-500 mb-1">
                              Address
                            </p>
                            <p className="font-poppins text-sm font-medium text-slate-800">
                              {selectedTransaction.shippingAddress?.address},{" "}
                              {selectedTransaction.shippingAddress?.city},{" "}
                              {selectedTransaction.shippingAddress?.postalCode}
                            </p>
                          </div>
                          <div>
                            <p className="font-poppins text-xs text-slate-500 mb-1">
                              Courier
                            </p>
                            <p className="font-poppins text-sm font-medium text-slate-800">
                              {selectedTransaction.selectedShipping}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div>
                        <p className="font-poppins text-xs text-slate-500 mb-1">
                          Pickup Location
                        </p>
                        <p className="font-poppins text-sm font-medium text-slate-800">
                          {selectedTransaction.pickupLocation ||
                            "BookVerse Store - Jakarta"}
                        </p>
                        <p className="font-poppins text-sm text-slate-600 mt-2">
                          Open: 09:00 - 20:00 WIB (Daily)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-poppins text-base font-semibold text-slate-800 mb-3">
                    Order Items
                  </h3>
                  <div className="bg-slate-50 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left py-3 px-4 font-poppins text-xs font-semibold text-slate-600">
                            Product
                          </th>
                          <th className="text-center py-3 px-4 font-poppins text-xs font-semibold text-slate-600">
                            Quantity
                          </th>
                          <th className="text-right py-3 px-4 font-poppins text-xs font-semibold text-slate-600">
                            Price
                          </th>
                          <th className="text-right py-3 px-4 font-poppins text-xs font-semibold text-slate-600">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTransaction.items.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-200">
                            <td className="py-3 px-4">
                              <p className="font-poppins text-sm font-medium text-slate-800">
                                {item.name}
                              </p>
                            </td>
                            <td className="text-center py-3 px-4">
                              <span className="font-poppins text-sm text-slate-600">
                                x{item.quantity}
                              </span>
                            </td>
                            <td className="text-right py-3 px-4">
                              <span className="font-poppins text-sm text-slate-600">
                                Rp {item.price.toLocaleString("id-ID")}
                              </span>
                            </td>
                            <td className="text-right py-3 px-4">
                              <span className="font-poppins text-sm font-medium text-slate-800">
                                Rp{" "}
                                {(item.price * item.quantity).toLocaleString(
                                  "id-ID"
                                )}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-100">
                        <tr>
                          <td colSpan="3" className="text-right py-3 px-4">
                            <span className="font-poppins text-sm font-semibold text-slate-700">
                              Total:
                            </span>
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className="font-poppins text-base font-bold text-blue-600">
                              Rp{" "}
                              {selectedTransaction.total.toLocaleString(
                                "id-ID"
                              )}
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Upload Proof Section - Only for pending payments */}
                {selectedTransaction.status === "pending" &&
                  selectedTransaction.paymentMethod !== "cash_on_delivery" && (
                    <div className="mb-6">
                      <h3 className="font-poppins text-base font-semibold text-slate-800 mb-3">
                        Upload Payment Proof
                      </h3>

                      {/* Bank Account Info */}
                      <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
                        <p className="font-poppins text-xs font-medium text-blue-800 mb-2 uppercase tracking-wide">
                          Transfer to:
                        </p>
                        <p className="font-poppins text-base font-semibold text-slate-800 mb-1">
                          Bank BCA
                        </p>
                        <p className="font-poppins text-[22px] font-bold text-blue-600 mb-1 tracking-wide">
                          1234567890
                        </p>
                        <p className="font-poppins text-sm font-medium text-slate-600">
                          a/n PT BookVerse Indonesia
                        </p>
                      </div>

                      {/* Upload Area */}
                      <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() =>
                          document.getElementById("modal-file-upload")?.click()
                        }
                        className={`rounded-xl p-8 transition-all duration-300 cursor-pointer text-center ${
                          isDragging
                            ? "bg-sky-50 border-2 border-dashed border-blue-600"
                            : "bg-white border-2 border-dashed border-slate-300"
                        }`}
                      >
                        <input
                          id="modal-file-upload"
                          type="file"
                          accept="image/jpeg,image/png"
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        {uploadedFile ? (
                          <div className="flex flex-col items-center gap-3">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                            <div>
                              <p className="font-poppins text-[15px] font-semibold text-green-600 m-0 mb-1">
                                File uploaded successfully
                              </p>
                              <p className="font-poppins text-[13px] font-normal text-slate-500 m-0">
                                {uploadedFile.name}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedFile(null);
                              }}
                              className="font-poppins text-[13px] font-medium text-blue-600 underline mt-2"
                            >
                              Change file
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <Upload className="w-12 h-12 text-slate-400" />
                            <div>
                              <p className="font-poppins text-[15px] font-medium text-slate-800 m-0 mb-1">
                                Click or drag file here
                              </p>
                              <p className="font-poppins text-[13px] font-normal text-slate-500 m-0">
                                File format .JPG or .PNG, max 2MB
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleSubmitProof}
                        className="w-full mt-4 h-12 font-poppins text-sm font-semibold text-white bg-blue-600 rounded-full transition-all duration-300 hover:bg-blue-700 hover:-translate-y-px hover:shadow-md"
                      >
                        Submit Payment Proof
                      </button>
                    </div>
                  )}

                {/* Proof of Payment Display for Completed */}
                {selectedTransaction.proofOfPayment && (
                  <div className="mb-6">
                    <h3 className="font-poppins text-base font-semibold text-slate-800 mb-3">
                      Payment Proof
                    </h3>
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="font-poppins text-sm font-medium text-green-800 m-0">
                            Payment proof uploaded
                          </p>
                          <p className="font-poppins text-xs text-green-600 m-0">
                            {selectedTransaction.proofOfPayment}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* COD Note */}
                {selectedTransaction.paymentMethod === "cash_on_delivery" &&
                  selectedTransaction.status === "pending" && (
                    <div className="mb-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                      <p className="font-poppins text-sm text-yellow-800 m-0">
                        💡 Payment will be made in cash when the package
                        arrives. No need to upload payment proof.
                      </p>
                    </div>
                  )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2 font-poppins text-sm font-medium text-slate-700 bg-gray-100 rounded-lg transition-all duration-300 hover:bg-gray-200"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownloadInvoice(selectedTransaction)}
                  className="px-6 py-2 font-poppins text-sm font-medium text-white bg-green-600 rounded-lg transition-all duration-300 hover:bg-green-700"
                >
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
