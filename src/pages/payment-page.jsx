import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);

  useEffect(() => {
    // Get checkout data from localStorage
    const data = localStorage.getItem("checkoutData");
    if (data) {
      setCheckoutData(JSON.parse(data));
    } else {
      // If no data, redirect to checkout
      navigate("/checkout");
    }
  }, [navigate]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      alert("Please upload payment proof first");
      return;
    }
    console.log("Payment proof submitted:", uploadedFile);
    localStorage.removeItem("checkoutData");
    alert(
      "Payment proof submitted successfully! Your order will be processed soon."
    );
    navigate("/");
  };

  if (!checkoutData) {
    return null;
  }

  return (
    <div className="bg-white min-h-screen font-poppins">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-[1440px] mx-auto px-20">
          <h1 className="font-poppins text-[28px] font-bold text-slate-800 m-0 leading-relaxed">
            Payment
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[800px] mx-auto px-20 pt-12 pb-20">
        <form onSubmit={handleSubmit}>
          {/* Shipping Data */}
          <div className="mb-8">
            <h2 className="font-poppins text-lg font-semibold text-slate-800 m-0 mb-4 leading-relaxed">
              Shipping Data
            </h2>
            <div className="bg-slate-50 rounded-xl p-5">
              <div className="mb-3">
                <span className="font-poppins text-[13px] font-medium text-slate-500 leading-relaxed">
                  Name:{" "}
                </span>
                <span className="font-poppins text-sm font-medium text-slate-800 leading-relaxed">
                  {checkoutData.shippingAddress?.fullName ||
                    checkoutData.fullName}
                </span>
              </div>
              <div className="mb-3">
                <span className="font-poppins text-[13px] font-medium text-slate-500 leading-relaxed">
                  Phone:{" "}
                </span>
                <span className="font-poppins text-sm font-medium text-slate-800 leading-relaxed">
                  {checkoutData.shippingAddress?.phone || checkoutData.phone}
                </span>
              </div>
              {checkoutData.deliveryMethod === "delivery" ? (
                <>
                  <div className="mb-3">
                    <span className="font-poppins text-[13px] font-medium text-slate-500 leading-relaxed">
                      Address:{" "}
                    </span>
                    <span className="font-poppins text-sm font-medium text-slate-800 leading-relaxed">
                      {checkoutData.shippingAddress?.address},{" "}
                      {checkoutData.shippingAddress?.city},{" "}
                      {checkoutData.shippingAddress?.postalCode}
                    </span>
                  </div>
                  <div>
                    <span className="font-poppins text-[13px] font-medium text-slate-500 leading-relaxed">
                      Courier:{" "}
                    </span>
                    <span className="font-poppins text-sm font-medium text-slate-800 leading-relaxed">
                      {checkoutData.selectedShipping}
                    </span>
                  </div>
                </>
              ) : (
                <div>
                  <span className="font-poppins text-[13px] font-medium text-slate-500 leading-relaxed">
                    Pickup Location:{" "}
                  </span>
                  <span className="font-poppins text-sm font-medium text-slate-800 leading-relaxed">
                    BookVerse Store - Jakarta
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-8">
            <h2 className="font-poppins text-lg font-semibold text-slate-800 m-0 mb-4 leading-relaxed">
              Payment Details
            </h2>
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <p className="font-poppins text-[13px] font-medium text-blue-800 m-0 mb-3 leading-relaxed uppercase tracking-wide">
                Transfer to:
              </p>
              <p className="font-poppins text-base font-semibold text-slate-800 m-0 mb-1 leading-relaxed">
                Bank BCA
              </p>
              <p className="font-poppins text-[22px] font-bold text-blue-600 m-0 mb-2 leading-relaxed tracking-wide">
                1234567890
              </p>
              <p className="font-poppins text-sm font-medium text-slate-600 m-0 leading-relaxed">
                a/n PT BookVerse Indonesia
              </p>
            </div>
          </div>

          {/* Payment Method Summary */}
          <div className="mb-8">
            <h2 className="font-poppins text-lg font-semibold text-slate-800 m-0 mb-4 leading-relaxed">
              Payment Method
            </h2>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="font-poppins text-sm font-medium text-slate-800 m-0">
                {checkoutData.selectedPaymentMethod === "bank_transfer" &&
                  "Bank Transfer"}
                {checkoutData.selectedPaymentMethod === "credit_card" &&
                  "Credit Card"}
                {checkoutData.selectedPaymentMethod === "e_wallet" &&
                  "E-Wallet"}
                {checkoutData.selectedPaymentMethod === "cash_on_delivery" &&
                  "Cash on Delivery"}
              </p>
            </div>
          </div>

          {/* Upload Proof */}
          <div className="mb-8">
            <h2 className="font-poppins text-lg font-semibold text-slate-800 m-0 mb-4 leading-relaxed">
              Upload Payment Proof
            </h2>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById("file-upload")?.click()}
              className={`rounded-xl p-10 transition-all duration-300 cursor-pointer text-center ${
                isDragging
                  ? "bg-sky-50 border-2 border-dashed border-blue-600"
                  : "bg-white border-2 border-dashed border-slate-300"
              }`}
            >
              <input
                id="file-upload"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="hidden"
              />

              {uploadedFile ? (
                <div className="flex flex-col items-center gap-3">
                  {/* Check Circle SVG */}
                  <svg
                    className="w-12 h-12 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-poppins text-[15px] font-semibold text-green-600 m-0 mb-1 leading-relaxed">
                      File uploaded successfully
                    </p>
                    <p className="font-poppins text-[13px] font-normal text-slate-500 m-0 leading-relaxed">
                      {uploadedFile.name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                    }}
                    className="font-poppins text-[13px] font-medium text-blue-600 bg-none border-none cursor-pointer underline mt-2"
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  {/* Upload SVG */}
                  <svg
                    className="w-12 h-12 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <div>
                    <p className="font-poppins text-[15px] font-medium text-slate-800 m-0 mb-1 leading-relaxed">
                      Click or drag file here
                    </p>
                    <p className="font-poppins text-[13px] font-normal text-slate-500 m-0 leading-relaxed">
                      File format .JPG or .PNG, max 2MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Final Summary */}
          <div className="bg-slate-50 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-poppins text-base font-semibold text-blue-600 leading-relaxed">
                Total Payment
              </span>
              <span className="font-poppins text-2xl font-bold text-blue-600 leading-relaxed">
                Rp {checkoutData.total?.toLocaleString("id-ID") || 0}
              </span>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            className="w-full h-13 font-poppins text-base font-semibold text-white bg-blue-600 border-none rounded-full cursor-pointer transition-all duration-300 leading-relaxed hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          >
            Confirm & Send Proof
          </button>
        </form>
      </div>
    </div>
  );
}
