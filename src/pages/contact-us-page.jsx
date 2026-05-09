import { useState } from "react";
import { useNavigate } from "react-router";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Globe,
  Share2,
  MessageSquare,
  Video,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function ContactUsPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("All fields are required!");
      return;
    }
    
    setSendingMessage(true);
    
    try {
      const response = await axios.post('/contact/send', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        }
      });
      
      if (response.data.success) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        toast.success(response.data.message || "Message sent successfully! We will reply within 24 hours.");
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        toast.error(response.data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(key => {
          toast.error(errors[key][0]);
        });
      } else {
        toast.error(error.response?.data?.message || "An error occurred. Please try again.");
      }
    } finally {
      setSendingMessage(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      details: [
        "BookVerse Store - Malang",
        "JL. Raya Karanglo No.KM. 2, Tasikmadu, Kec. Lowokwaru, Kota Malang",
        "Jawa Timur 65153",
        "Indonesia",
      ],
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: [
        "Customer Service: customerservicebookverse@gmail.com",
        "WhatsApp: 0878-2246-3210",
        "Monday - Sunday",
        "08:00 - 21:00 WIB",
      ],
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: [
        "General: info@bookverse.com",
        "Support: support@bookverse.com",
        "Partnership: partnership@bookverse.com",
      ],
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Store Hours",
      details: [
        "Monday - Friday: 08:00 - 21:00",
        "Saturday: 09:00 - 20:00",
        "Sunday: 10:00 - 18:00",
        "Public Holidays: 10:00 - 15:00",
      ],
    },
  ];

  const socialMedia = [
    {
      name: "Facebook",
      icon: <Share2 className="w-5 h-5" />,
      url: "https://facebook.com/bookverse",
    },
    {
      name: "Instagram",
      icon: <Globe className="w-5 h-5" />,
      url: "https://instagram.com/bookverse",
    },
    {
      name: "Twitter",
      icon: <MessageSquare className="w-5 h-5" />,
      url: "https://twitter.com/bookverse",
    },
    {
      name: "YouTube",
      icon: <Video className="w-5 h-5" />,
      url: "https://youtube.com/bookverse",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-poppins">
      {/* Back Button */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>Back</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative bg-blue-600 text-white py-20 mt-4">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Have questions? We're here to help! Our customer service team will respond within 24 hours.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-16">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:border-blue-200"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                {info.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {info.title}
              </h3>
              <div className="space-y-1">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-sm text-gray-600">
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Send a Message
              </h2>
              <p className="text-gray-600">
                Fill out the form below and our team will respond shortly.
              </p>
            </div>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-800">
                    Thank you! Your message has been sent. We will reply within 24 hours.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Write your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={sendingMessage}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sendingMessage ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Map and Social Media */}
          <div className="space-y-8">
            {/* Map */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Find Us
              </h2>
              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.3085001320236!2d112.619256!3d-7.9513072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7883a6b0b5b5b5%3A0x5e5e5e5e5e5e5e5e!2sJL.%20Raya%20Karanglo%20No.KM.%202%2C%20Tasikmadu%2C%20Kec.%20Lowokwaru%2C%20Kota%20Malang%2C%20Jawa%20Timur%2065153!5e0!3m2!1sen!2sid!4v1641234567890!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="BookVerse Store Location - Malang"
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    JL. Raya Karanglo No.KM. 2, Tasikmadu, Kec. Lowokwaru, Kota Malang
                    Jawa Timur 65153
                  </span>
                </p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    How long does shipping take?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Shipping typically takes 2-5 business days depending on your location.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Can I return a book?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Yes, we accept returns within 14 days of delivery for eligible items.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Do you offer international shipping?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Currently, we only ship within Indonesia. Stay tuned for international shipping updates.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Connect With Us
              </h2>
              <p className="text-gray-600 mb-6">
                Follow us on social media for updates, promotions, and book recommendations.
              </p>
              <div className="flex gap-4">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 transition-all duration-300 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}