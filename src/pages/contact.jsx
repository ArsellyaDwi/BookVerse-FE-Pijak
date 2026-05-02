import React from "react";
import { useNavigate } from "react-router";

export default function ContactPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#2457F5] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-8 bg-white text-[#2457F5] px-5 py-2 rounded-full font-semibold hover:scale-105 transition duration-300 shadow-md"
        >
          ← Back 
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Contact Us
          </h1>

          <p className="text-blue-100 text-lg">
            We are here to help you with any questions or issues.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Contact Information
            </h2>

            <div className="space-y-6">
              <div>
                <p className="text-white font-semibold mb-1">Email</p>
                <p className="text-blue-100">
                  support@bookverse.com
                </p>
              </div>

              <div>
                <p className="text-white font-semibold mb-1">Phone</p>
                <p className="text-blue-100">
                  +62 812-3456-7890
                </p>
              </div>

              <div>
                <p className="text-white font-semibold mb-1">Address</p>
                <p className="text-blue-100">
                  Jambi, Indonesia
                </p>
              </div>

              <div>
                <p className="text-white font-semibold mb-1">
                  Working Hours
                </p>
                <p className="text-blue-100">
                  Monday - Friday, 08:00 - 17:00
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-[#2457F5] mb-6">
              Send Message
            </h2>

            <form className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2457F5]"
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
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Message
                </label>

                <textarea
                  rows={5}
                  placeholder="Write your message..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2457F5] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2457F5] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}