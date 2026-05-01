// pages/MyTransactionsPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Eye,
  ChevronRight,
  Calendar,
  CreditCard,
  MapPin,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import useQuery from "@/hooks/use-query";
import { buildStorageUrl } from "@/lib/helper";
import { ImageWithFallback } from "@/components/image-with-fallback";

const TransactionShimmer = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6">
              <div className="flex justify-between mb-4">
                <div className="h-5 bg-gray-200 rounded w-32"></div>
                <div className="h-5 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-48 mb-3"></div>
              <div className="flex gap-3">
                <div className="w-16 h-20 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

const EmptyState = () => (
  <div className="text-center py-16">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
      <Package className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      No transactions yet
    </h3>
    <p className="text-gray-500 mb-6">You haven't made any purchases yet</p>
    <button
      onClick={() => (window.location.href = "/books")}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Start Shopping
    </button>
  </div>
);

const StatusBadge = ({ status }) => {
  const config = {
    waiting_payment: {
      icon: <Clock className="w-3 h-3" />,
      text: "Waiting Payment",
      className: "bg-orange-100 text-orange-700",
    },
    shipped: {
      icon: <Truck className="w-3 h-3" />,
      text: "Shipped",
      className: "bg-blue-100 text-blue-700",
    },
    done: {
      icon: <CheckCircle className="w-3 h-3" />,
      text: "Completed",
      className: "bg-green-100 text-green-700",
    },
    cancelled: {
      icon: <AlertCircle className="w-3 h-3" />,
      text: "Cancelled",
      className: "bg-red-100 text-red-700",
    },
  };

  const statusConfig = config[status] || config.waiting_payment;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}
    >
      {statusConfig.icon}
      {statusConfig.text}
    </span>
  );
};

const TransactionCard = ({ transaction, onClick }) => {
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const firstItem = transaction.items?.[0];
  const itemCount = transaction.items?.length || 0;

  return (
    <div
      onClick={() => onClick(transaction.id)}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-900">
              #{transaction.id}
            </span>
            <StatusBadge status={transaction.status} />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(transaction.date)}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-blue-600">
            {formatRupiah(transaction.total)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {firstItem && (
        <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
          <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            <ImageWithFallback
              src={buildStorageUrl(firstItem.cover_img)}
              alt={firstItem.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {firstItem.title}
            </p>
            <p className="text-xs text-gray-500 mt-1">{firstItem.author}</p>
            {itemCount > 1 && (
              <p className="text-xs text-blue-600 mt-1">
                +{itemCount - 1} more item{itemCount - 1 > 1 ? "s" : ""}
              </p>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </div>
      )}

      {transaction.delivery_method && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Truck className="w-3 h-3" />
            <span>{transaction.delivery_method.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function MyTransactionsPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  const { data, loading } = useQuery({
    url: "/transactions",
    method: "GET",
    guard: true,
    immediate: true,
    onSuccess: (data) => {
      setTransactions(data || []);
    },
  });

  const handleTransactionClick = (id) => {
    navigate(`/my-transactions/${id}`);
  };

  if (loading) {
    return <TransactionShimmer />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 py-6">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20">
            <h1 className="text-[28px] font-bold text-gray-900 mb-1">
              My Transactions
            </h1>
            <p className="text-gray-600">View and track your order history</p>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-8">
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onClick={handleTransactionClick}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
