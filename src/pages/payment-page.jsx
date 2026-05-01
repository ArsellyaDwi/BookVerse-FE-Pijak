// pages/PaymentPage.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  FileImage,
  X,
  ArrowLeft,
  Copy,
  Check,
  Truck,
  MapPin,
  Calendar,
  Building,
  Package,
  Timer,
  CreditCard,
} from "lucide-react";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { buildStorageUrl } from "@/lib/helper";
import useQuery from "@/hooks/use-query";
import useMutation from "@/hooks/use-mutation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const PaymentShimmer = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 mb-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
              <div className="space-y-3">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fetch transaction detail
  const {
    data: transaction,
    loading,
    refetch,
  } = useQuery({
    url: `/transactions/${id}`,
    method: "GET",
    guard: true,
    immediate: true,
  });

  // Upload payment proof mutation
  const { mutate: uploadPaymentProof, loading: uploading } = useMutation({
    url: `/transactions/${id}/upload-payment`,
    method: "POST",
    guard: true,
    onSuccess: () => {
      refetch();
      setUploadedFile(null);
      setPreviewUrl(null);
    },
  });

  const status = transaction?.status;
  const deliveryMethod = transaction?.delivery_method;
  const paymentMethod = transaction?.payment_method;
  const deliveryAddress = transaction?.delivery_address;
  const items = transaction?.items || [];
  const shippingCost = parseFloat(transaction?.shipping_cost || 0);
  const total = parseFloat(transaction?.total || 0);
  const subtotal = total - shippingCost;
  const totalBooks = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate shipping multiplier
  const multiplier = deliveryMethod?.books_per_multiplier
    ? Math.ceil(totalBooks / deliveryMethod.books_per_multiplier)
    : 1;

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = () => {
    switch (status) {
      case "waiting_payment":
        return {
          icon: <Clock className="w-6 h-6" />,
          color: "text-orange-500",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          title: "Waiting for Payment",
          message: "Please complete your payment within 24 hours",
        };
      case "shipped":
        return {
          icon: <Truck className="w-6 h-6" />,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          title: "Order Shipped",
          message: "Your order is on the way!",
        };
      case "done":
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          color: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          title: "Order Completed",
          message: "Thank you for shopping with us!",
        };
      case "cancelled":
        return {
          icon: <AlertCircle className="w-6 h-6" />,
          color: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          title: "Order Cancelled",
          message: "This order has been cancelled",
        };
      default:
        return {
          icon: <Clock className="w-6 h-6" />,
          color: "text-gray-500",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          title: "Unknown Status",
          message: "",
        };
    }
  };

  const statusConfig = getStatusConfig();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }
      if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
        alert("Only JPG, JPEG, and PNG files are allowed");
        return;
      }
      setUploadedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("payment_proof", uploadedFile);

    await uploadPaymentProof(formData);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <PaymentShimmer />;
  }

  if (!transaction) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Transaction Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The transaction you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 py-6">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-[28px] font-bold text-gray-900 mb-1">
              Payment
            </h1>
            <p className="text-gray-600">Transaction #{transaction.id}</p>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Card */}
              <div
                className={`bg-white rounded-xl p-6 border ${statusConfig.borderColor}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${statusConfig.color}`}>
                    {statusConfig.icon}
                  </div>
                  <h2 className={`text-xl font-semibold ${statusConfig.color}`}>
                    {statusConfig.title}
                  </h2>
                </div>
                <p className="text-gray-600">{statusConfig.message}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Order Date: {formatDate(transaction.date)}
                </p>
              </div>

              {/* Payment Method Information */}
              {status === "waiting_payment" && paymentMethod && (
                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Payment Method
                    </h2>
                  </div>
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      {paymentMethod.image && (
                        <img
                          onClick={() => {
                            window.open(
                              buildStorageUrl(paymentMethod.image),
                              "_blank"
                            );
                          }}
                          src={buildStorageUrl(paymentMethod.image)}
                          alt={paymentMethod.name}
                          className="w-24 h-24 object-contain bg-gray-50 rounded-lg p-2"
                        />
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {paymentMethod.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {paymentMethod.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Please complete your payment of{" "}
                      <span className="font-semibold">
                        {formatRupiah(total)}
                      </span>{" "}
                      using {paymentMethod.name}. Include Transaction ID #
                      {transaction.id} in the description.
                    </p>
                  </div>
                </div>
              )}

              {/* Delivery Method Information */}
              {deliveryMethod && (
                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Delivery Method
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Package className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">
                          {deliveryMethod.name}
                        </h3>
                      </div>
                      {deliveryMethod.description && (
                        <p className="text-sm text-gray-600 mb-3">
                          {deliveryMethod.description}
                        </p>
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Timer className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            Estimated Delivery:{" "}
                            {deliveryMethod.estimated_days_min &&
                            deliveryMethod.estimated_days_max
                              ? `${deliveryMethod.estimated_days_min} - ${deliveryMethod.estimated_days_max} days`
                              : "Varies"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Truck className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            Base Price:{" "}
                            {formatRupiah(deliveryMethod.base_price)}
                          </span>
                        </div>
                        {deliveryMethod.books_per_multiplier > 1 && (
                          <div className="flex items-center gap-2 text-sm">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              Books per multiplier:{" "}
                              {deliveryMethod.books_per_multiplier} books
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="border rounded-lg p-4 bg-blue-50">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Shipping Summary
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Books:</span>
                          <span className="font-semibold text-gray-900">
                            {totalBooks} books
                          </span>
                        </div>
                        {deliveryMethod.books_per_multiplier > 1 && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Multiplier:</span>
                              <span className="font-semibold text-gray-900">
                                {multiplier} × ({totalBooks} ÷{" "}
                                {deliveryMethod.books_per_multiplier})
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Calculation:
                              </span>
                              <span className="font-semibold text-gray-900">
                                {multiplier} ×{" "}
                                {formatRupiah(deliveryMethod.base_price)}
                              </span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between pt-2 border-t border-blue-200">
                          <span className="text-gray-700 font-medium">
                            Shipping Cost:
                          </span>
                          <span className="font-bold text-blue-600">
                            {formatRupiah(shippingCost)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 pb-4 border-b border-gray-100"
                    >
                      <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <ImageWithFallback
                          src={buildStorageUrl(item.cover_img)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-1">
                          Author: {item.author}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatRupiah(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">
                      {formatRupiah(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Shipping Cost</span>
                    <span className="text-gray-900">
                      {formatRupiah(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold mt-3 pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-blue-600">{formatRupiah(total)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              {deliveryAddress && (
                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Delivery Address
                    </h2>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-800 font-medium">
                      {deliveryAddress.province}, {deliveryAddress.city}
                    </p>
                    <p className="text-gray-600">{deliveryAddress.address}</p>
                    <p className="text-gray-600">
                      {deliveryAddress.district}, {deliveryAddress.village}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Upload Payment Proof */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Confirmation
                </h2>

                {status === "waiting_payment" && (
                  <>
                    {!transaction.payment_proof ? (
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 mb-2">
                            Upload your payment proof
                          </p>
                          <p className="text-xs text-gray-500 mb-4">
                            JPG, JPEG, or PNG (Max 2MB)
                          </p>
                          <input
                            type="file"
                            id="payment-proof"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="payment-proof"
                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                          >
                            Choose File
                          </label>
                        </div>

                        {previewUrl && (
                          <div className="relative">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => {
                                setUploadedFile(null);
                                setPreviewUrl(null);
                              }}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        <button
                          onClick={handleUpload}
                          disabled={!uploadedFile || uploading}
                          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {uploading ? "Uploading..." : "Upload Payment Proof"}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <FileImage className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-900">
                              Payment Proof Uploaded
                            </span>
                          </div>
                          <img
                            src={buildStorageUrl(transaction.payment_proof)}
                            alt="Payment Proof"
                            className="w-full rounded-lg cursor-pointer"
                            onClick={() =>
                              window.open(
                                buildStorageUrl(transaction.payment_proof),
                                "_blank"
                              )
                            }
                          />
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            Click image to view full size
                          </p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <p className="text-sm text-green-800">
                              Your payment proof has been uploaded. We will
                              verify it shortly.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {status === "shipped" && (
                  <div className="text-center py-6">
                    <Truck className="w-16 h-16 text-blue-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Order Shipped!
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your order is on the way.
                    </p>
                    {deliveryMethod && (
                      <p className="text-xs text-gray-500 mt-2">
                        Courier: {deliveryMethod.name}
                      </p>
                    )}
                  </div>
                )}

                {status === "done" && (
                  <div className="text-center py-6">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Order Completed!
                    </h3>
                    <p className="text-sm text-gray-600">
                      Thank you for shopping with us!
                    </p>
                    <button
                      onClick={() => navigate("/")}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}

                {status === "cancelled" && (
                  <div className="text-center py-6">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Order Cancelled
                    </h3>
                    <p className="text-sm text-gray-600">
                      This order has been cancelled. Please contact support for
                      more information.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
