import { useNavigate, Link } from "react-router";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "@/components/image-with-fallback";
import useQuery from "@/hooks/use-query";
import useMutation from "@/hooks/use-mutation";
import { buildStorageUrl } from "@/lib/helper";
import { Loader2, MapPin, Calendar, Truck, Store, Users } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BookCard from "@/components/book-card";

const CheckoutShimmer = () => (
  <div className="bg-white min-h-screen font-poppins">
    <Navbar />
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>
    </div>
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 pt-12 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="h-6 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [deliveryMethodId, setDeliveryMethodId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [total, setTotal] = useState(0);

  // Fetch checkout data
  const { data: checkoutData, loading: checkoutLoading } = useQuery({
    url: "/checkout/data",
    method: "GET",
    immediate: true,
    guard: true,
  });

  // Fetch collaborative recommendations
  const { data: collaborativeData, loading: collaborativeLoading } = useQuery({
    url: "collaborative",
    immediate: true,
    guard: false,
  });

  // Create transaction mutation
  const { mutate: createTransaction, loading: creatingTransaction } =
    useMutation({
      url: "/checkout",
      method: "POST",
      guard: true,
      onSuccess: (data) => {
        navigate(`/payment/${data.data.transaction_id}`);
      },
      onError: (error) => {
        alert(error.message || "Failed to create transaction");
      },
    });

  // Extract data from checkoutData
  const cartItems = checkoutData?.cart_items || [];
  const subtotal = checkoutData?.subtotal || 0;
  const addresses = checkoutData?.addresses || [];
  const deliveryMethods = checkoutData?.delivery_methods || [];
  const paymentMethods = checkoutData?.payment_methods || [];
  const collaborativeRecommendations = collaborativeData || [];

  // Calculate total books in cart
  const totalBooks = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Set defaults when data loads
  useEffect(() => {
    if (checkoutData && !deliveryMethodId && deliveryMethods.length > 0) {
      setDeliveryMethodId(deliveryMethods[0].id);
    }
    if (checkoutData && !selectedPaymentMethodId && paymentMethods.length > 0) {
      setSelectedPaymentMethodId(paymentMethods[0].id);
    }
    if (checkoutData && !selectedAddressId && addresses.length > 0) {
      const defaultAddress = addresses.find((addr) => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    }
  }, [checkoutData, deliveryMethods, paymentMethods, addresses]);

  // Calculate shipping cost based on selected delivery method
  useEffect(() => {
    if (deliveryMethodId && deliveryMethods.length > 0 && totalBooks > 0) {
      const selectedMethod = deliveryMethods.find(
        (m) => m.id === deliveryMethodId
      );

      if (selectedMethod) {
        const isPickup =
          selectedMethod.name?.toLowerCase().includes("pickup") ||
          selectedMethod.id === 2;

        if (isPickup) {
          setShippingCost(0);
          setTotal(subtotal);
        } else {
          // Calculate shipping cost using the same logic as backend
          const multiplier = Math.ceil(
            totalBooks / selectedMethod.books_per_multiplier
          );
          const calculatedShipping = selectedMethod.base_price * multiplier;
          setShippingCost(calculatedShipping);
          setTotal(subtotal + calculatedShipping);
        }
      }
    } else {
      setShippingCost(0);
      setTotal(subtotal);
    }
  }, [deliveryMethodId, deliveryMethods, totalBooks, subtotal]);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getEstimatedDaysText = (method) => {
    if (method.estimated_days_min && method.estimated_days_max) {
      return `${method.estimated_days_min} - ${method.estimated_days_max} days`;
    }
    return method.estimated_days || "Varies";
  };

  const getShippingCalculationText = (method) => {
    if (method.books_per_multiplier === 1) {
      return `${formatRupiah(method.base_price)} per book`;
    }
    return `${formatRupiah(method.base_price)} per ${method.books_per_multiplier
      } books`;
  };

  const getSelectedAddress = () => {
    if (selectedAddressId) {
      return addresses.find((addr) => addr.id === selectedAddressId);
    }
    return addresses.find((addr) => addr.is_default) || addresses[0];
  };

  const isPickupMethod = () => {
    const selectedMethod = deliveryMethods.find(
      (m) => m.id === deliveryMethodId
    );
    return (
      selectedMethod?.name?.toLowerCase().includes("pickup") ||
      selectedMethod?.id === 2
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPaymentMethodId) {
      alert("Please select a payment method");
      return;
    }

    const selectedMethod = deliveryMethods.find(
      (m) => m.id === deliveryMethodId
    );
    const isPickup =
      selectedMethod?.name?.toLowerCase().includes("pickup") ||
      selectedMethod?.id === 2;

    // Calculate shipping cost
    let calculatedShipping = 0;
    if (!isPickup && selectedMethod) {
      const multiplier = Math.ceil(
        totalBooks / selectedMethod.books_per_multiplier
      );
      calculatedShipping = selectedMethod.base_price * multiplier;
    }

    const payload = {
      delivery_method_id: deliveryMethodId,
      payment_method_id: selectedPaymentMethodId,
      shipping_cost: calculatedShipping,
      total: total,
    };

    // Only add delivery_address_id if NOT pickup
    if (!isPickup) {
      if (addresses.length === 0) {
        alert("Please add a delivery address");
        navigate("/my-address");
        return;
      }

      const selectedAddress = getSelectedAddress();
      if (!selectedAddress) {
        alert("Please select a delivery address");
        return;
      }
      payload.delivery_address_id = selectedAddress.id;
    }

    await createTransaction(payload);
  };

  if (checkoutLoading) {
    return <CheckoutShimmer />;
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate("/books")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const isPickup = isPickupMethod();
  const selectedMethod = deliveryMethods.find((m) => m.id === deliveryMethodId);

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen font-poppins">
        <div className="bg-white border-b border-gray-100 py-3">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20">
            <div className="flex items-center gap-2 text-sm font-poppins text-gray-500">
              <Link to="/" className="hover:text-blue-600 transition-colors duration-300 hover:underline underline-offset-4">
                Home
              </Link>
              <span>›</span>
              <span className="text-gray-800 font-medium">Checkout</span>
            </div>
          </div>
        </div>
        <div className="bg-white border-b border-gray-200 py-6">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20">
            <h1 className="font-poppins text-[28px] font-bold text-slate-800 m-0 leading-relaxed">
              Checkout
            </h1>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 pt-12 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                {/* Delivery Method Selection */}
                <div className="mb-8">
                  <h2 className="font-poppins text-xl font-semibold text-slate-800 m-0 mb-4 leading-relaxed">
                    Delivery Method
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deliveryMethods.map((method) => {
                      const isPickupMethodItem =
                        method.name?.toLowerCase().includes("pickup") ||
                        method.id === 2;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setDeliveryMethodId(method.id)}
                          className={`p-4 border-2 rounded-xl text-left transition-all duration-300 ${deliveryMethodId === method.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            {isPickupMethodItem ? (
                              <Store className="w-6 h-6 text-blue-600 mt-1" />
                            ) : (
                              <Truck className="w-6 h-6 text-blue-600 mt-1" />
                            )}
                            <div className="flex-1">
                              <p className="font-poppins font-semibold text-slate-800 m-0">
                                {method.name}
                              </p>
                              <p className="font-poppins text-sm text-slate-500 m-0 mt-1">
                                {method.description}
                              </p>
                              <div className="flex items-center gap-3 mt-2 flex-wrap">
                                {!isPickupMethodItem && (
                                  <>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3 text-slate-400" />
                                      <p className="font-poppins text-xs text-slate-500 m-0">
                                        Est. {getEstimatedDaysText(method)}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Truck className="w-3 h-3 text-slate-400" />
                                      <p className="font-poppins text-xs text-slate-600 m-0">
                                        {getShippingCalculationText(method)}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <p className="font-poppins text-xs font-semibold text-blue-600 m-0">
                                        {formatRupiah(method.base_price)} base
                                      </p>
                                    </div>
                                  </>
                                )}
                                {isPickupMethodItem && (
                                  <div className="flex items-center gap-1">
                                    <Store className="w-3 h-3 text-green-600" />
                                    <p className="font-poppins text-xs font-semibold text-green-600 m-0">
                                      Free Pickup
                                    </p>
                                  </div>
                                )}
                              </div>
                              {!isPickupMethodItem &&
                                method.books_per_multiplier > 1 && (
                                  <p className="font-poppins text-xs text-slate-400 m-0 mt-2">
                                    *Shipping cost multiplies every{" "}
                                    {method.books_per_multiplier} books
                                  </p>
                                )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pickup Info */}
                {isPickup && (
                  <div className="mb-8 p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-start gap-3">
                      <Store className="w-6 h-6 text-green-600 mt-1" />
                      <div>
                        <h3 className="font-poppins font-semibold text-slate-800 m-0 mb-1">
                          Pickup Information
                        </h3>
                        <p className="font-poppins text-sm text-slate-600 m-0">
                          You can pick up your order at our store
                        </p>
                        <p className="font-poppins text-sm text-slate-500 m-0 mt-2">
                          📍 BookVerse Store - Jakarta
                          <br />
                          Jl. Sudirman No. 123, Jakarta Selatan
                          <br />
                          🕒 Open: 09:00 - 20:00 WIB (Daily)
                          <br />
                          📞 (021) 1234-5678
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping Information - Only for Delivery */}
                {!isPickup && (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-poppins text-xl font-semibold text-slate-800 m-0 leading-relaxed">
                        Shipping Address
                      </h2>
                      <button
                        type="button"
                        onClick={() => navigate("/my-address")}
                        className="text-blue-600 font-poppins text-sm font-medium hover:underline flex items-center gap-1"
                      >
                        <MapPin className="w-4 h-4" />
                        Manage Addresses
                      </button>
                    </div>

                    {addresses.length > 0 ? (
                      <div className="space-y-3">
                        {addresses.map((address) => (
                          <div
                            key={address.id}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${selectedAddressId === address.id ||
                              (address.is_default && !selectedAddressId)
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                              }`}
                            onClick={() => setSelectedAddressId(address.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="font-poppins font-semibold text-slate-800 m-0">
                                    {address.province}, {address.city}
                                  </p>
                                  {address.is_default && (
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="font-poppins text-sm text-slate-600 m-0">
                                  {address.address}
                                </p>
                                <p className="font-poppins text-sm text-slate-600 m-0">
                                  {address.district}, {address.village}
                                </p>
                              </div>
                              {(selectedAddressId === address.id ||
                                (address.is_default && !selectedAddressId)) && (
                                  <svg
                                    className="w-5 h-5 text-blue-600 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 mb-3">No addresses found</p>
                        <button
                          type="button"
                          onClick={() => navigate("/my-address")}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Add your first address
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Payment Method Section */}
                <div className="mb-8">
                  <h2 className="font-poppins text-xl font-semibold text-slate-800 m-0 mb-4 leading-relaxed">
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedPaymentMethodId(method.id)}
                        className={`w-full p-4 border-2 rounded-xl text-left transition-all duration-300 ${selectedPaymentMethodId === method.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <p className="font-poppins font-semibold text-slate-800 m-0">
                                {method.name}
                              </p>
                              {selectedPaymentMethodId === method.id && (
                                <svg
                                  className="w-5 h-5 text-blue-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                            <p className="font-poppins text-sm text-slate-500 m-0 mt-1">
                              {method.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            {/* Right Side - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h2 className="font-poppins text-lg font-semibold text-slate-800 m-0 mb-6 leading-relaxed">
                  Order Summary
                </h2>

                {/* Book List */}
                <div className="mb-6 max-h-96 overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex gap-3 ${index < cartItems.length - 1 ? "mb-4" : ""
                        }`}
                    >
                      <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                        <ImageWithFallback
                          src={buildStorageUrl(item.cover_img)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-poppins text-[13px] font-medium text-slate-800 m-0 mb-1 leading-relaxed line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="font-poppins text-xs font-normal text-slate-500 m-0 mb-2 leading-relaxed">
                          x{item.quantity}
                        </p>
                        <p className="font-poppins text-sm font-semibold text-slate-800 m-0 leading-relaxed">
                          {formatRupiah(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Info Summary */}
                {!isPickup && selectedMethod && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="font-poppins text-xs text-slate-500 m-0 mb-1">
                      Shipping Calculation
                    </p>
                    <p className="font-poppins text-xs text-slate-600 m-0">
                      {totalBooks} book(s) ×{" "}
                      {getShippingCalculationText(selectedMethod)}
                    </p>
                    <p className="font-poppins text-xs text-slate-600 m-0 mt-1">
                      Multiplier:{" "}
                      {Math.ceil(
                        totalBooks / selectedMethod.books_per_multiplier
                      )}{" "}
                      × {formatRupiah(selectedMethod.base_price)}
                    </p>
                  </div>
                )}

                <div className="w-full h-px bg-slate-200 my-6" />

                {/* Cost Details */}
                <div className="mb-6">
                  <div className="flex justify-between mb-3">
                    <span className="font-poppins text-sm font-normal text-slate-500 leading-relaxed">
                      Subtotal
                    </span>
                    <span className="font-poppins text-sm font-medium text-slate-800 leading-relaxed">
                      {formatRupiah(subtotal)}
                    </span>
                  </div>
                  {!isPickup && (
                    <div className="flex justify-between">
                      <span className="font-poppins text-sm font-normal text-slate-500 leading-relaxed">
                        Shipping Cost
                      </span>
                      <span className="font-poppins text-sm font-medium text-slate-800 leading-relaxed">
                        {formatRupiah(shippingCost)}
                      </span>
                    </div>
                  )}
                  {isPickup && (
                    <div className="flex justify-between">
                      <span className="font-poppins text-sm font-normal text-slate-500 leading-relaxed">
                        Pickup Fee
                      </span>
                      <span className="font-poppins text-sm font-medium text-green-600 leading-relaxed">
                        Free
                      </span>
                    </div>
                  )}
                </div>

                <div className="w-full h-px bg-slate-200 my-6" />

                {/* Total */}
                <div className="flex justify-between mb-6">
                  <span className="font-poppins text-base font-semibold text-blue-600 leading-relaxed">
                    Total
                  </span>
                  <span className="font-poppins text-xl font-bold text-blue-600 leading-relaxed">
                    {formatRupiah(total)}
                  </span>
                </div>

                {/* Payment Method Summary */}
                {selectedPaymentMethodId && (
                  <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                    <p className="font-poppins text-xs text-slate-500 m-0 mb-1">
                      Payment Method
                    </p>
                    <p className="font-poppins text-sm font-medium text-slate-800 m-0">
                      {
                        paymentMethods.find(
                          (m) => m.id === selectedPaymentMethodId
                        )?.name
                      }
                    </p>
                  </div>
                )}

                {/* Proceed to Payment Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    creatingTransaction || (!isPickup && addresses.length === 0)
                  }
                  className="w-full h-12 font-poppins text-[15px] font-semibold text-white bg-blue-600 border-none rounded-full cursor-pointer transition-all duration-300 leading-relaxed hover:bg-blue-700 hover:-translate-y-px hover:shadow-md active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {creatingTransaction ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Collaborative Recommendations Section */}
          {!collaborativeLoading && collaborativeRecommendations.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="font-poppins text-2xl font-bold text-gray-800">
                  Customers Also Bought
                </h2>
              </div>
              <p className="font-poppins text-sm text-gray-500 mb-6">
                Other customers who purchased items in your cart also bought these books
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {collaborativeRecommendations.slice(0, 10).map((book) => (
                  <div key={book.id} className="group">
                    <div
                      className="cursor-pointer"
                      onClick={() => navigate(`/books/${book.id}`)}
                    >
                      <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[2/3]">
                        <ImageWithFallback
                          src={book.cover_img ? buildStorageUrl(book.cover_img) : null}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="mt-3">
                        <h3 className="font-poppins font-semibold text-sm text-gray-800 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                          {book.title}
                        </h3>
                        <p className="font-poppins text-xs text-gray-500 line-clamp-1 mb-2">
                          {book.author}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="font-poppins text-sm font-bold text-blue-600">
                            Rp {parseFloat(book.price).toLocaleString("id-ID")}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add to cart functionality can be added here
                              alert(`Added ${book.title} to cart`);
                            }}
                            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-poppins font-medium rounded-lg hover:bg-blue-700 transition-all opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-200"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {collaborativeRecommendations.length > 10 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => navigate("/recommendations")}
                    className="px-6 py-2.5 text-blue-600 font-poppins text-sm font-semibold hover:text-blue-700 transition-colors border-2 border-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    View More Recommendations
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Loading skeleton for recommendations */}
          {collaborativeLoading && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg aspect-[2/3]" />
                    <div className="mt-3 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}