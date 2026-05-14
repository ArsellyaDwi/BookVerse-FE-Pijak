import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  FileText,
  Printer,
  Download,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import useQuery from "@/hooks/use-query";
import { buildStorageUrl } from "@/lib/helper";
import { ImageWithFallback } from "@/components/image-with-fallback";

const DetailShimmer = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
            <div className="bg-white rounded-xl p-6">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
              <div className="space-y-3">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

const StatusStepper = ({ status }) => {
  const steps = [
    { key: "waiting_payment", label: "Order Placed", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "done", label: "Delivered", icon: CheckCircle },
  ];

  const getStepStatus = (stepKey) => {
    if (status === "cancelled") return "cancelled";
    if (stepKey === "waiting_payment") return "completed";
    if (status === "shipped" && stepKey === "shipped") return "current";
    if (status === "shipped" && stepKey === "waiting_payment")
      return "completed";
    if (status === "done" && stepKey === "done") return "current";
    if (status === "done") return "completed";
    return "pending";
  };

  if (status === "cancelled") {
    return (
      <div className="bg-red-50 rounded-lg p-4 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-700 font-medium">Order Cancelled</p>
        <p className="text-sm text-red-600 mt-1">
          This order has been cancelled
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center">
      {steps.map((step, index) => {
        const stepStatus = getStepStatus(step.key);
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex-1 relative">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  stepStatus === "completed"
                    ? "bg-green-500"
                    : stepStatus === "current"
                    ? "bg-blue-500"
                    : "bg-gray-200"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    stepStatus === "completed" || stepStatus === "current"
                      ? "text-white"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <p
                className={`text-xs font-medium mt-2 ${
                  stepStatus === "completed" || stepStatus === "current"
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 w-full h-0.5 ${
                  stepStatus === "completed" ? "bg-green-500" : "bg-gray-200"
                }`}
                style={{ transform: "translateX(-50%)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    waiting_payment: {
      icon: <Clock className="w-4 h-4" />,
      text: "Waiting Payment",
      className: "bg-orange-100 text-orange-700",
    },
    shipped: {
      icon: <Truck className="w-4 h-4" />,
      text: "Shipped",
      className: "bg-blue-100 text-blue-700",
    },
    done: {
      icon: <CheckCircle className="w-4 h-4" />,
      text: "Completed",
      className: "bg-green-100 text-green-700",
    },
    cancelled: {
      icon: <AlertCircle className="w-4 h-4" />,
      text: "Cancelled",
      className: "bg-red-100 text-red-700",
    },
  };

  const statusConfig = config[status] || config.waiting_payment;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.className}`}
    >
      {statusConfig.icon}
      {statusConfig.text}
    </span>
  );
};

export default function TransactionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: transaction, loading } = useQuery({
    url: `/transactions/${id}`,
    method: "GET",
    guard: true,
    immediate: true,
  });

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

  const subtotal =
    (transaction?.total || 0) - (transaction?.shipping_cost || 0);
  const totalBooks =
    transaction?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  if (loading) {
    return <DetailShimmer />;
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
              onClick={() => navigate("/my-transactions")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Transactions
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
              onClick={() => navigate("/my-transactions")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Transactions
            </button>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-[28px] font-bold text-gray-900 mb-1">
                  Transaction Details
                </h1>
                <p className="text-gray-600">Order #{transaction.id}</p>
              </div>
              <StatusBadge status={transaction.status} />
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Order Status
                </h2>
                <StatusStepper status={transaction.status} />
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Items
                </h2>
                <div className="space-y-4">
                  {transaction.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <ImageWithFallback
                          src={buildStorageUrl(item.cover_img)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-1">
                          Author: {item.author}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-sm text-gray-600">
                              Price: {formatRupiah(item.price)}
                            </p>
                          </div>
                          <p className="text-base font-semibold text-blue-600">
                            {formatRupiah(item.subtotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">
                      {formatRupiah(subtotal)}
                    </span>
                  </div>
                  {transaction.shipping_cost > 0 && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Shipping Cost</span>
                      <span className="text-gray-900">
                        {formatRupiah(transaction.shipping_cost)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-semibold mt-3 pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-blue-600">
                      {formatRupiah(transaction.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              {transaction.delivery_address && (
                <div className="bg-white rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Delivery Information
                  </h2>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-800 font-medium">
                        {transaction.delivery_address.province},{" "}
                        {transaction.delivery_address.city}
                      </p>
                      <p className="text-gray-600 mt-1">
                        {transaction.delivery_address.address}
                      </p>
                      <p className="text-gray-600">
                        {transaction.delivery_address.district},{" "}
                        {transaction.delivery_address.village}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order Date</span>
                    <span className="text-gray-900">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Items</span>
                    <span className="text-gray-900">{totalBooks} books</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="text-gray-900">
                      {transaction.payment_method?.name || "-"}
                    </span>
                  </div>
                  {transaction.delivery_method && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Method</span>
                      <span className="text-gray-900">
                        {transaction.delivery_method.name}
                      </span>
                    </div>
                  )}
                  {transaction.delivery_method?.estimated_days_min && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Est. Delivery</span>
                      <span className="text-gray-900">
                        {transaction.delivery_method.estimated_days_min} -{" "}
                        {transaction.delivery_method.estimated_days_max} days
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Proof */}
              {transaction.payment_proof && (
                <div className="bg-white rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Payment Proof
                  </h2>
                  <img
                    src={buildStorageUrl(transaction.payment_proof)}
                    alt="Payment Proof"
                    className="w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
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
              )}

              {/* Action Buttons */}
              {transaction.status === "waiting_payment" && (
                <div className="bg-white rounded-xl p-6">
                  <button
                    onClick={() => navigate(`/payment/${transaction.id}`)}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Complete Payment
                  </button>
                </div>
              )}

              {transaction.status === "shipped" && (
                <div className="bg-white rounded-xl p-6">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-blue-800">
                        Your order is on the way!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {transaction.status === "done" && (
                <div className="bg-white rounded-xl p-6">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-green-800">
                        Order completed successfully!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
