import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  CreditCard,
  Package,
  Heart,
  LogOut,
  Camera,
  ChevronRight,
  Shield,
  Globe,
  Home,
  Lock,
  MessageCircle,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import useQuery from "@/hooks/use-query";
import useMutation from "@/hooks/use-mutation";
import { toast } from "sonner";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { useAuth } from "@/context/auth-context";

const AccountShimmer = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-8">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg w-64 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="w-28 h-28 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-40 mx-auto"></div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <div className="h-7 bg-gray-200 rounded w-32"></div>
              <div className="h-14 bg-gray-200 rounded"></div>
              <div className="h-14 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default function MyAccountPage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    gender: "",
    birth_date: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        province: user.province || "",
        postal_code: user.postal_code || "",
        gender: user.gender || "",
        birth_date: user.birth_date || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const { refetch: refetchProfile } = useQuery({
    url: "/auth/me",
    method: "GET",
    guard: true,
    immediate: true,
    onSuccess: (data) => {
      if (data?.user) {
        updateUser(data.user);
      }
    },
  });

  const { mutate: updateProfile, loading: updateLoading } = useMutation({
    url: "/user/profile",
    method: "PUT",
    guard: true,
    onSuccess: (data) => {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      updateUser(data.user);
      refetchProfile();
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    {
      id: "profile",
      icon: <User className="w-5 h-5" />,
      label: "Profile Information",
      description: "Manage your personal data",
    },
    {
      id: "orders",
      icon: <Package className="w-5 h-5" />,
      label: "My Orders",
      description: "Track your purchases",
      onClick: () => navigate("/my-transactions"),
    },
    {
      id: "address",
      icon: <Home className="w-5 h-5" />,
      label: "Addresses",
      description: "Manage shipping addresses",
      onClick: () => navigate("/my-address"),
    },
    {
      id: "payment",
      icon: <CreditCard className="w-5 h-5" />,
      label: "Payment Methods",
      description: "Manage payment options",
      onClick: () => navigate("/payment-methods"),
    },
    {
      id: "security",
      icon: <Shield className="w-5 h-5" />,
      label: "Security",
      description: "Password & security settings",
      onClick: () => navigate("/change-password"),
    },
  ];

  if (!user) {
    return <AccountShimmer />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section - Same Blue as ContactUsPage */}
        <div className="relative bg-blue-600 text-white py-16">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20">
            {/* Back Button */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group mb-6"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </button>

            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  My Account
                </h1>
                <p className="text-blue-100 text-lg">
                  Welcome back, {user.name?.split(" ")[0]}!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-12">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Menu */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                <div className="px-4 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {user.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
                <nav className="p-3">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (item.onClick) item.onClick();
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 mb-1 ${
                        activeTab === item.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5">{item.icon}</span>
                        <div className="text-left">
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-gray-400">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                  ))}

                  <div className="border-t border-gray-100 my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 mt-1"
                  >
                    <LogOut className="w-5 h-5" />
                    <div className="text-left">
                      <p className="text-sm font-medium">Sign Out</p>
                      <p className="text-xs text-gray-400">Logout from your account</p>
                    </div>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex flex-wrap justify-between items-center gap-4 px-6 py-5 border-b border-gray-100 bg-gray-50/30">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Profile Information
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Update your personal information
                    </p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-200 font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled={true}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Email cannot be changed
                      </p>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="+62 xxx xxx xxx"
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all"
                        />
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gender
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 appearance-none"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Birth Date */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Birth Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          name="birth_date"
                          value={formData.birth_date}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={!isEditing}
                          rows="3"
                          placeholder="Your full address"
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all resize-none"
                        />
                      </div>
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City
                      </label>
                      <div className="relative">
                        <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="City"
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all"
                        />
                      </div>
                    </div>

                    {/* Province */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Province
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="Province"
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all"
                        />
                      </div>
                    </div>

                    {/* Postal Code */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="postal_code"
                          value={formData.postal_code}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="Postal code"
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                      <button
                        type="submit"
                        disabled={updateLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-sm"
                      >
                        {updateLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: user.name || "",
                            email: user.email || "",
                            phone: user.phone || "",
                            address: user.address || "",
                            city: user.city || "",
                            province: user.province || "",
                            postal_code: user.postal_code || "",
                            gender: user.gender || "",
                            birth_date: user.birth_date || "",
                            bio: user.bio || "",
                          });
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

// ArrowLeft component (add this import or define inline)
const ArrowLeft = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);
