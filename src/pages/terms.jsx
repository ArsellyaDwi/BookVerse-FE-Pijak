import { useNavigate } from "react-router";
import { ArrowLeft, FileText } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function TermsPage() {
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
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-poppins">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-poppins">
            Please read these terms carefully before using BookVerse services
          </p>
          <p className="text-sm text-gray-500 mt-2">Last updated: 5/9/2026</p>
        </div>
      </div>

      {/* Content - NO ICONS */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-20 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                By accessing and using BookVerse, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Account Registration</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Users must provide accurate and complete information when creating an account. Each user is responsible for maintaining the confidentiality of their account credentials. Users must not create multiple accounts or share accounts with others.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Prohibited Activities</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Users are prohibited from: misusing the service, conducting fraudulent transactions, spreading false information, attempting to hack or disrupt the system, or violating applicable laws. Violations may result in account suspension or permanent ban.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Purchases and Payments</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                All purchases made on BookVerse are final. Users must provide valid payment information. BookVerse reserves the right to cancel any order suspected of fraudulent activity.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Shipping and Delivery</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Books will be delivered to the address provided by the user during checkout. Delivery times are estimates and may vary. BookVerse is not responsible for delays caused by the courier or incorrect addresses.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Returns and Refunds</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Books cannot be returned or exchanged unless damaged or incorrectly shipped. Claims must be made within 3x24 hours of receipt with photo evidence. Refunds, if applicable, will be processed within 7-14 business days.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Intellectual Property</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                All content on BookVerse, including books, images, logos, and text, is protected by copyright and intellectual property laws. Users may not reproduce, distribute, or modify content without permission.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Limitation of Liability</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                BookVerse shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services, including but not limited to loss of data or profits.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Governing Law</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                These terms are governed by and construed in accordance with the laws of Indonesia. Any disputes arising from these terms shall be resolved in the courts of Indonesia.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">10. Changes to Terms</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                BookVerse reserves the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 text-center bg-gray-100 rounded-2xl p-6">
          <p className="text-gray-600 text-sm">
            If you have any questions about these Terms & Conditions, please contact us at{' '}
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