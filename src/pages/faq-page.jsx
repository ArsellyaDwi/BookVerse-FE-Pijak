import { useState } from "react";
import { useNavigate } from "react-router";
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function FAQPage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I create a BookVerse account?",
      answer: "Click the avatar icon in the top right corner, select 'Sign Up Now', then fill out the registration form with your full name, email, password (minimum 6 characters), and confirm your password. Check the Terms & Conditions and Privacy Policy agreement, then click 'Register Now'."
    },
    {
      question: "How do I place an order for books?",
      answer: "Find the book you want to purchase, choose 'Wishlist' or 'Add to Cart', then proceed to the book detail page or directly to the Cart page for checkout. On the checkout page, select a Delivery Method (JNE Reguler, JNE YES, etc.), fill in your Shipping Address, and choose a Payment Method (QRIS, Bank Transfer, etc.)."
    },
    {
      question: "What is Delivery Method?",
      answer: "Delivery Method is the shipping method for your books. Example: JNE Reguler (estimated 2-5 days, Rp3,000 per 4 books, with a base cost of Rp3,000. Shipping costs multiply for every 4 books)."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping times: Greater Jakarta area 2-3 business days, Java 3-5 business days, Outside Java 5-7 business days, and remote areas 7-14 business days."
    },
    {
      question: "What payment methods are available?",
      answer: "QRIS (Quick Response Code Indonesian Standard), Bank Transfer (BCA, Mandiri, BRI, BNI), E-Wallet (GoPay, OVO, Dana, ShopeePay), Credit Card (Visa/Mastercard), and COD (Cash on Delivery) for specific areas."
    },
    {
      question: "How do I contact customer service?",
      answer: "Email: customerservicebookverse@gmail.com, WhatsApp: 0878-2246-3210, or through the contact form on our website. Operating hours: Monday-Sunday, 8:00 AM - 9:00 PM WIB."
    },
    {
      question: "Do I need to login to purchase books?",
      answer: "Yes, you must have an account and be logged in to make a purchase. An account is required to process orders and manage shipping addresses."
    },
    {
      question: "What should I do if I forget my password?",
      answer: "Click 'Forgot Password' on the login page, enter your registered email, and we will send a password reset link to your email."
    },
    {
      question: "Are there any special promos or discounts?",
      answer: "Follow BookVerse social media (Instagram, Facebook) for the latest promo info. Also subscribe to our newsletter to get exclusive discount coupons."
    },
    {
      question: "Is my personal information secure?",
      answer: "We are committed to protecting your personal data. Your information is only used to process orders and will not be sold or misused."
    },
    {
      question: "What if my shipping address is wrong?",
      answer: "Contact customer service immediately before your order is processed. If the order has already been shipped, you must contact the courier directly for address changes."
    }
  ];

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
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-poppins">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-poppins">
            Find answers to common questions about BookVerse
          </p>
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-20 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, index) => (
              <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <span className="font-semibold text-gray-800 font-poppins">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-gray-600 font-poppins text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 text-center bg-blue-50 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-4 font-poppins">
            Contact our customer service team, we're ready to help you
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-poppins font-medium hover:bg-blue-700 transition-colors"
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