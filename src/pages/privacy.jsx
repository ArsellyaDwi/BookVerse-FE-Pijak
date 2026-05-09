import { useNavigate } from "react-router";
import { ArrowLeft, Shield } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function PrivacyPage() {
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

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 py-12 mt-4">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-poppins">
            Privacy Policy
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-poppins">
            How we collect, use, and protect your personal information
          </p>
          <p className="text-sm text-gray-500 mt-2">Last updated: 5/9/2026</p>
        </div>
      </div>

      {/* Content - NO ICONS */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-20 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We collect personal information such as: full name, email address, phone number, shipping address, payment information, and browsing behavior when you create an account or make a purchase.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">2. How We Use Your Information</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We use your information to: process orders and payments, communicate with you about your orders, send promotional emails (with your consent), improve our services, and prevent fraudulent activities.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Data Security</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We implement industry-standard security measures including SSL encryption, secure payment gateways, and regular security audits to protect your personal information from unauthorized access.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Cookies</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We use cookies to enhance your browsing experience, analyze site traffic, remember your preferences, and personalize content. You can disable cookies in your browser settings.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Email Communications</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We may send you order confirmations, shipping updates, and promotional emails. You can unsubscribe from promotional emails at any time by clicking the unsubscribe link.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Third-Party Sharing</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We do not sell your personal information to third parties. We may share information with trusted partners (payment processors, shipping carriers) solely for order fulfillment.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Your Rights</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                You have the right to access, correct, or delete your personal information. You can manage your data through your account settings or by contacting customer service.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Children's Privacy</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 text-center bg-gray-100 rounded-2xl p-6">
          <p className="text-gray-600 text-sm">
            If you have questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:customerservicebookverse@gmail.com" className="text-blue-600 hover:underline">
              customerservicebookverse@gmail.com
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}