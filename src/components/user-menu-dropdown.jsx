// components/user-menu-dropdown.jsx
import { useState, useEffect } from "react";
import { X, Package, MapPin, Settings, LogOut, User } from "lucide-react";
import { Link } from "react-router";

export default function UserMenuDropdown({
  isOpen,
  onClose,
  user,
  onMenuClick,
  onLogout,
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  const menuItems = [
    {
      icon: <Package className="w-4 h-4" />,
      label: "My Transactions",
      path: "/my-transactions",
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      label: "My Addresses",
      path: "/my-address",
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: "My Account",
      path: "/my-account",
    },
  ];

  if (!shouldRender) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        onClick={onClose}
      />

      {/* Dropdown Card */}
      <div
        className={`absolute top-full right-0 z-50 transition-all duration-300 origin-top-right ${
          isAnimating
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2"
        }`}
        style={{
          width: "280px",
          marginTop: "12px",
        }}
      >
        <div className="bg-white rounded-2xl shadow-lg font-poppins relative overflow-hidden">
          {/* Arrow/Triangle pointing up */}
          <div className="absolute -top-2 right-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white" />

          {/* User Info Header */}
          <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-poppins text-sm font-semibold text-gray-900">
                  {user?.name || "User"}
                </p>
                <p className="font-poppins text-xs text-gray-500">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => onMenuClick(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                  {item.icon}
                </div>
                <span className="font-poppins text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                  {item.label}
                </span>
              </button>
            ))}

            {/* Divider */}
            <div className="h-px bg-gray-100 my-2" />

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors duration-200 group"
            >
              <div className="text-gray-400 group-hover:text-red-600 transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-poppins text-sm text-gray-700 group-hover:text-red-600 transition-colors">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
