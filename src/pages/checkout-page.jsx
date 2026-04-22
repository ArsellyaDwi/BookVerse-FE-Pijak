import { useNavigate } from "react-router";
import { useState } from "react";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { booksData } from "@/data/booksData";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState("delivery"); // 'delivery' or 'pickup'
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      fullName: "John Doe",
      phone: "081234567890",
      address: "Jl. Sudirman No. 123",
      city: "Jakarta Selatan",
      postalCode: "12190",
      isDefault: true,
    },
    {
      id: 2,
      fullName: "John Doe",
      phone: "081234567891",
      address: "Jl. Thamrin No. 45",
      city: "Jakarta Pusat",
      postalCode: "10350",
      isDefault: false,
    },
  ]);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("bank_transfer");

  const paymentMethods = [
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: "🏦",
      description: "Transfer via BCA, Mandiri, BNI, BRI",
    },
    {
      id: "credit_card",
      name: "Credit Card",
      icon: "💳",
      description: "Visa, Mastercard, JCB",
    },
    {
      id: "e_wallet",
      name: "E-Wallet",
      icon: "📱",
      description: "GoPay, OVO, Dana, ShopeePay",
    },
    {
      id: "cash_on_delivery",
      name: "Cash on Delivery",
      icon: "💰",
      description: "Pay when package arrives (delivery only)",
    },
  ];

  const cartItems = [
    { book: booksData[0], quantity: 1 },
    { book: booksData[1], quantity: 2 },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  // Shipping cost based on delivery method
  const shippingOptions = {
    "JNE Regular": 15000,
    "JNE YES": 25000,
    "SiCepat Regular": 15000,
    "J&T Express": 12000,
  };

  const [selectedShipping, setSelectedShipping] = useState("JNE Regular");
  const shipping =
    deliveryMethod === "delivery" ? shippingOptions[selectedShipping] : 0;
  const total = subtotal + shipping;

  const handleAddressChange = (e) => {
    setNewAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddAddress = () => {
    if (
      newAddress.fullName &&
      newAddress.phone &&
      newAddress.address &&
      newAddress.city &&
      newAddress.postalCode
    ) {
      const newId = Math.max(...addresses.map((a) => a.id), 0) + 1;
      setAddresses([
        ...addresses,
        { ...newAddress, id: newId, isDefault: false },
      ]);
      setNewAddress({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
      });
      setShowAddressForm(false);
    }
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
    if (selectedAddressId === id) {
      setSelectedAddressId(null);
    }
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    setSelectedAddressId(id);
  };

  const getSelectedAddress = () => {
    if (selectedAddressId) {
      return addresses.find((addr) => addr.id === selectedAddressId);
    }
    return addresses.find((addr) => addr.isDefault) || addresses[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (deliveryMethod === "delivery" && addresses.length === 0) {
      alert("Please add a delivery address");
      return;
    }

    const selectedAddress = getSelectedAddress();

    // Save checkout data for PaymentPage
    localStorage.setItem(
      "checkoutData",
      JSON.stringify({
        deliveryMethod,
        shippingAddress: deliveryMethod === "delivery" ? selectedAddress : null,
        selectedShipping:
          deliveryMethod === "delivery" ? selectedShipping : null,
        selectedPaymentMethod,
        cartItems,
        subtotal,
        shipping,
        total,
      })
    );
    navigate("/payment");
  };

  return (
    <div className="bg-white min-h-screen font-poppins">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-[1440px] mx-auto px-20">
          <h1 className="font-poppins text-[28px] font-bold text-slate-800 m-0 leading-relaxed">
            Checkout
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-20 pt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Side - Form (2/3 width) */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Delivery Method Selection */}
              <div className="mb-8">
                <h2 className="font-poppins text-xl font-semibold text-slate-800 m-0 mb-4 leading-relaxed">
                  Delivery Method
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("delivery")}
                    className={`p-4 border-2 rounded-xl text-left transition-all duration-300 ${
                      deliveryMethod === "delivery"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🚚</span>
                      <div>
                        <p className="font-poppins font-semibold text-slate-800 m-0">
                          Delivery
                        </p>
                        <p className="font-poppins text-sm text-slate-500 m-0">
                          Delivered to your address
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("pickup")}
                    className={`p-4 border-2 rounded-xl text-left transition-all duration-300 ${
                      deliveryMethod === "pickup"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏪</span>
                      <div>
                        <p className="font-poppins font-semibold text-slate-800 m-0">
                          Pickup
                        </p>
                        <p className="font-poppins text-sm text-slate-500 m-0">
                          Take at BookVerse Store
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Pickup Location Info */}
              {deliveryMethod === "pickup" && (
                <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <h3 className="font-poppins font-semibold text-slate-800 m-0 mb-1">
                        Pickup Location
                      </h3>
                      <p className="font-poppins text-sm text-slate-600 m-0">
                        BookVerse Store - Jakarta
                      </p>
                      <p className="font-poppins text-sm text-slate-500 m-0 mt-1">
                        Jl. Sudirman No. 123, Jakarta Selatan
                        <br />
                        Open: 09:00 - 20:00 WIB (Daily)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Information - Only for Delivery */}
              {deliveryMethod === "delivery" && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-poppins text-xl font-semibold text-slate-800 m-0 leading-relaxed">
                      Shipping Address
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="text-blue-600 font-poppins text-sm font-medium hover:underline"
                    >
                      + Add New Address
                    </button>
                  </div>

                  {/* Address List */}
                  {addresses.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                            selectedAddressId === address.id ||
                            (address.isDefault && !selectedAddressId)
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedAddressId(address.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-poppins font-semibold text-slate-800 m-0">
                                  {address.fullName}
                                </p>
                                {address.isDefault && (
                                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="font-poppins text-sm text-slate-600 m-0">
                                {address.phone}
                              </p>
                              <p className="font-poppins text-sm text-slate-600 m-0 mt-1">
                                {address.address}, {address.city},{" "}
                                {address.postalCode}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetDefaultAddress(address.id);
                                }}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Set Default
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAddress(address.id);
                                }}
                                className="text-xs text-red-500 hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Address Form */}
                  {showAddressForm && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="font-poppins font-semibold text-slate-800 mb-3">
                        New Address
                      </h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          name="fullName"
                          value={newAddress.fullName}
                          onChange={handleAddressChange}
                          placeholder="Full Name"
                          className="w-full h-11 px-3 font-poppins text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                        />
                        <input
                          type="tel"
                          name="phone"
                          value={newAddress.phone}
                          onChange={handleAddressChange}
                          placeholder="Phone Number"
                          className="w-full h-11 px-3 font-poppins text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                        />
                        <input
                          type="text"
                          name="address"
                          value={newAddress.address}
                          onChange={handleAddressChange}
                          placeholder="Full Address"
                          className="w-full h-11 px-3 font-poppins text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="city"
                            value={newAddress.city}
                            onChange={handleAddressChange}
                            placeholder="City"
                            className="w-full h-11 px-3 font-poppins text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                          />
                          <input
                            type="text"
                            name="postalCode"
                            value={newAddress.postalCode}
                            onChange={handleAddressChange}
                            placeholder="Postal Code"
                            className="w-full h-11 px-3 font-poppins text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleAddAddress}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-poppins text-sm hover:bg-blue-700 transition-colors"
                          >
                            Save Address
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-poppins text-sm hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Shipping Option */}
                  {deliveryMethod === "delivery" && (
                    <div className="mt-6">
                      <label className="block font-poppins text-sm font-medium text-slate-700 mb-2 leading-relaxed">
                        Shipping Courier
                      </label>
                      <select
                        value={selectedShipping}
                        onChange={(e) => setSelectedShipping(e.target.value)}
                        className="w-full h-12 px-4 font-poppins text-sm text-slate-800 bg-white border border-slate-200 rounded-lg outline-none transition-all duration-300 cursor-pointer focus:border-blue-600"
                      >
                        <option value="JNE Regular">
                          JNE Regular (2-3 days) - Rp 15,000
                        </option>
                        <option value="JNE YES">
                          JNE YES (1 day) - Rp 25,000
                        </option>
                        <option value="SiCepat Regular">
                          SiCepat Regular (2-3 days) - Rp 15,000
                        </option>
                        <option value="J&T Express">
                          J&T Express (2-4 days) - Rp 12,000
                        </option>
                      </select>
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
                  {paymentMethods.map((method) => {
                    const isDisabled =
                      method.id === "cash_on_delivery" &&
                      deliveryMethod === "pickup";
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() =>
                          !isDisabled && setSelectedPaymentMethod(method.id)
                        }
                        disabled={isDisabled}
                        className={`w-full p-4 border-2 rounded-xl text-left transition-all duration-300 ${
                          selectedPaymentMethod === method.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        } ${
                          isDisabled
                            ? "opacity-50 cursor-not-allowed bg-gray-50"
                            : "cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{method.icon}</span>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <p className="font-poppins font-semibold text-slate-800 m-0">
                                {method.name}
                              </p>
                              {selectedPaymentMethod === method.id && (
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
                            {isDisabled && (
                              <p className="font-poppins text-xs text-orange-500 m-0 mt-1">
                                Not available for pickup
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>
          </div>

          {/* Right Side - Order Summary (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-8">
              <h2 className="font-poppins text-lg font-semibold text-slate-800 m-0 mb-6 leading-relaxed">
                Order Summary
              </h2>

              {/* Book List */}
              <div className="mb-6">
                {cartItems.map((item, index) => (
                  <div
                    key={item.book.id}
                    className={`flex gap-3 ${
                      index < cartItems.length - 1 ? "mb-4" : ""
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                      <ImageWithFallback
                        src={item.book.image}
                        alt={item.book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Book Info */}
                    <div className="flex-1">
                      <h3 className="font-poppins text-[13px] font-medium text-slate-800 m-0 mb-1 leading-relaxed line-clamp-2">
                        {item.book.title}
                      </h3>
                      <p className="font-poppins text-xs font-normal text-slate-500 m-0 mb-2 leading-relaxed">
                        x{item.quantity}
                      </p>
                      <p className="font-poppins text-sm font-semibold text-slate-800 m-0 leading-relaxed">
                        Rp{" "}
                        {(item.book.price * item.quantity).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-slate-200 my-6" />

              {/* Cost Details */}
              <div className="mb-6">
                <div className="flex justify-between mb-3">
                  <span className="font-poppins text-sm font-normal text-slate-500 leading-relaxed">
                    Subtotal
                  </span>
                  <span className="font-poppins text-sm font-medium text-slate-800 leading-relaxed">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
                {deliveryMethod === "delivery" && (
                  <div className="flex justify-between">
                    <span className="font-poppins text-sm font-normal text-slate-500 leading-relaxed">
                      Shipping Cost
                    </span>
                    <span className="font-poppins text-sm font-medium text-slate-800 leading-relaxed">
                      Rp {shipping.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
                {deliveryMethod === "pickup" && (
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

              {/* Divider */}
              <div className="w-full h-px bg-slate-200 my-6" />

              {/* Total */}
              <div className="flex justify-between mb-6">
                <span className="font-poppins text-base font-semibold text-blue-600 leading-relaxed">
                  Total
                </span>
                <span className="font-poppins text-xl font-bold text-blue-600 leading-relaxed">
                  Rp {total.toLocaleString("id-ID")}
                </span>
              </div>

              {/* Payment Method Summary */}
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <p className="font-poppins text-xs text-slate-500 m-0 mb-1">
                  Payment Method
                </p>
                <p className="font-poppins text-sm font-medium text-slate-800 m-0">
                  {
                    paymentMethods.find((m) => m.id === selectedPaymentMethod)
                      ?.name
                  }
                </p>
              </div>

              {/* Proceed to Payment Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full h-12 font-poppins text-[15px] font-semibold text-white bg-blue-600 border-none rounded-full cursor-pointer transition-all duration-300 leading-relaxed hover:bg-blue-700 hover:-translate-y-px hover:shadow-md active:translate-y-0"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
