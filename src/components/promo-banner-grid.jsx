import { ArrowRight } from "lucide-react";

export default function PromoBannerGrid() {
  // WhatsApp number and message
  const waNumber = "6287822463210";
  const waMessage =
    "Hello%20BookVerse,%20I%20am%20interested%20in%20ordering%20the%20product.";
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <section className="pt-12 pb-0 px-20 max-w-[1440px] mx-auto">
      {/* Double Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT BANNER: Exclusive Book Package */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group cursor-pointer relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          style={{
            backgroundColor: "#2563EB",
            borderRadius: "16px",
            padding: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            boxShadow: "0 8px 24px rgba(37, 99, 235, 0.2)",
            textDecoration: "none",
          }}
        >
          {/* Decorative Pattern */}
          <div
            className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            }}
          />

          {/* Content */}
          <div className="flex-1 relative z-10">
            <div className="font-poppins text-xs font-semibold text-white/80 tracking-wide uppercase mb-2">
              Pre-Order Special
            </div>
            <h3 className="font-poppins text-2xl font-bold text-white leading-tight mb-4">
              Exclusive Book Package
            </h3>
            <p className="font-poppins text-sm text-white/90 leading-relaxed mb-6">
              Get the latest curated book collections with the best special
              pricing just for you.
            </p>
            <button
              type="button"
              className="font-poppins text-sm font-semibold text-blue-600 bg-white px-6 py-2.5 rounded-full inline-flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-105"
            >
              Order Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Illustration - Graduation Cap */}
          <div className="text-8xl opacity-20 transition-all duration-300 group-hover:opacity-30">
            🎓
          </div>
        </a>

        {/* RIGHT BANNER: Merchandise Collection */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group cursor-pointer relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          style={{
            background: "linear-gradient(135deg, #1F2937 0%, #374151 100%)",
            borderRadius: "16px",
            padding: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            boxShadow: "0 8px 24px rgba(31, 41, 55, 0.2)",
            textDecoration: "none",
          }}
        >
          {/* Decorative Pattern */}
          <div
            className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full -translate-x-1/2 translate-y-1/2"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
            }}
          />

          {/* Illustration - Shopping Bag */}
          <div className="text-8xl opacity-20 transition-all duration-300 group-hover:opacity-30">
            🛍️
          </div>

          {/* Content */}
          <div className="flex-1 relative z-10 text-right">
            <div className="font-poppins text-xs font-semibold text-white/80 tracking-wide uppercase mb-2">
              Exclusive Collection
            </div>
            <h3 className="font-poppins text-2xl font-bold text-white leading-tight mb-4">
              Merchandise Collection
            </h3>
            <p className="font-poppins text-sm text-white/90 leading-relaxed mb-6">
              Complete your study style with shirts, tote bags, and official
              BookVerse accessories.
            </p>
            <button
              type="button"
              className="font-poppins text-sm font-semibold text-gray-800 bg-white px-6 py-2.5 rounded-full inline-flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-105"
            >
              Order Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </a>
      </div>
    </section>
  );
}
