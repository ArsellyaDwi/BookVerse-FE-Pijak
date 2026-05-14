import { Gift, Truck, ShoppingBag, Calendar } from "lucide-react";

export default function ValuePropositionBar() {
  const features = [
    { icon: Gift, title: "Best Prices & Offers", color: "#2563EB" },
    { icon: Truck, title: "Free Shipping", color: "#2563EB" },
    { icon: ShoppingBag, title: "Wide Variety", color: "#2563EB" },
    { icon: Calendar, title: "Great Monthly Deals", color: "#2563EB" },
  ];

  return (
    <section className="w-full bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-6 sm:py-8">
        
        {/* Desktop */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 cursor-default hover:bg-blue-50 hover:shadow-md"
            >
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-full"
                style={{
                  backgroundColor: feature.color,
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                  width: "48px",
                  height: "48px",
                }}
              >
                <feature.icon className="text-white w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-poppins font-semibold text-gray-800 text-sm">
                  {feature.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile */}
        <div className="block sm:hidden">
          <div className="grid grid-cols-2 gap-8 justify-items-center">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    backgroundColor: feature.color,
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                    width: "56px",
                    height: "56px",
                  }}
                >
                  <feature.icon className="text-white w-6 h-6" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] text-gray-500 text-center leading-tight max-w-[80px]">
                  {feature.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-8 sm:mt-10 w-full" />
      </div>
    </section>
  );
}