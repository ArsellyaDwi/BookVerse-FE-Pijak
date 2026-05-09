import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ReturnPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <Navbar />

      {/* Back Button */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-20 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>Back</span>
        </button>
      </div>

      {/* Hero Section - NO ICON */}
      <div className="bg-white border-b border-gray-100 py-12 mt-4">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-20 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-poppins">
            Return Policy
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-poppins">
            Learn about our return, exchange, and refund process
          </p>
          <p className="text-sm text-gray-500 mt-2">Last updated: 5/9/2026</p>
        </div>
      </div>

      {/* Alert Box */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-20 -mt-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800 font-semibold text-sm">⚠️ Non-refundable & Non-returnable</p>
          <p className="text-red-700 text-sm mt-1">Books purchased cannot be canceled, returned, or refunded unless damaged or incorrectly shipped.</p>
        </div>
      </div>

      {/* Content - NO ICONS */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-20 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">1. General Policy</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                All book sales are final. We do not accept returns or exchanges unless the item is defective, damaged during shipping, or incorrectly shipped.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Damaged or Defective Items</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                If you receive a damaged or defective book, please contact us within 3x24 hours (3 days) of delivery. Include your order number and clear photos of the damage. We will arrange for a replacement or refund after verification.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Wrong Item Received</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                If you receive the wrong book, contact us immediately with your order number and photos of the received item. We will send the correct book at no additional cost.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Time Limit for Claims</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Claims for damaged or incorrect items must be made within 3 days of delivery. Claims made after this period may not be honored.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">5. How to Request a Return</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Contact our customer service team at customerservicebookverse@gmail.com or WhatsApp 0878-2246-3210. Provide your order number, reason for return, and photos of the item. We will guide you through the return process.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Refund Process</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Once your return is approved and we receive the returned item, refunds will be processed within 7-14 business days. The refund will be issued to your original payment method.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Non-Returnable Items</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                The following items cannot be returned: books that have been read or damaged by the customer, digital products, and items purchased during clearance sales.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Contact Information</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Email: customerservicebookverse@gmail.com<br />
                WhatsApp: 0878-2246-3210<br />
                Hours: Monday - Sunday, 8:00 AM - 9:00 PM WIB
              </p>
            </div>
          </div>
        </div>

        {/* Still Have Questions Section */}
        <div className="mt-12 text-center bg-red-50 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">
            Still have questions about returns?
          </h3>
          <p className="text-gray-600 mb-4 font-poppins">
            Contact our customer service team, we're ready to help you
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg font-poppins font-medium hover:bg-red-700 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="mailto:customerservicebookverse@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-poppins font-medium hover:bg-gray-50 transition-colors"
            >
              customerservicebookverse@gmail.com
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}