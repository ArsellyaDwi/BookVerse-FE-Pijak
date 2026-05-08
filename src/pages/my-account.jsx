import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { useAuth } from "@/context/auth-context";
import { useState } from "react";

export default function MyAccountPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");

  const handleUpdateAccount = async (e) => {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/api/auth", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      alert("Account updated successfully!");
      location.reload();

      localStorage.setItem("user", JSON.stringify({ ...user, name }));
    } else {
      alert("Failed to update account.");
    }

  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 py-6">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20">
            <h1 className="text-[28px] font-bold text-gray-900 mb-1">
              My Account
            </h1>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20">
          <div className="bg-white p-4 rounded-lg shadow-sm mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Account
            </h2>

            <form className="space-y-5" onSubmit={handleUpdateAccount}>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2457F5]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2457F5]"
                  value={user?.email}
                />
              </div>

               <button
                type="submit"
                className="w-full bg-[#2457F5] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition duration-300"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
