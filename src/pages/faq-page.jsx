import React from "react";
import { useNavigate } from "react-router";

export default function FAQPage() {
  const navigate = useNavigate();

  const faqs = [
    "Users can create an account and log in to make book purchase transactions.",
    "Purchased books will be delivered according to the address provided by the user.",
    "Various payment methods are available along with information about the shipping process.",
    "Users can request a return (refund/return) if there is an error or damage to the product.",
    "Users can track their order status through the tracking feature.",
    "Each user account must use valid information and must not be misused.",
    "Users are required to comply with the applicable terms while using Book Verse services.",
  ];

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
            Frequently Asked Questions
          </h1>

          <p className="text-blue-100 text-lg">
            Find answers to common questions about Book Verse services.
          </p>
        </div>

        {/* FAQ Container */}
        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition duration-300"
            >
              <div className="flex items-start gap-4">
                {/* Number */}
                <div className="flex items-center justify-center min-w-[40px] h-10 rounded-full bg-white text-[#2457F5] font-bold">
                  {index + 1}
                </div>

                {/* FAQ Text */}
                <p className="text-white leading-relaxed text-base md:text-lg">
                  {faq}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-14 bg-white/10 border border-white/20 rounded-3xl p-8 text-center backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-white mb-3">
            Still Have Questions?
          </h2>

          <p className="text-blue-100 mb-6">
            Contact our support team for more information and assistance.
          </p>

          <button className="bg-white text-[#2457F5] font-semibold px-6 py-3 rounded-full hover:scale-105 transition duration-300">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}