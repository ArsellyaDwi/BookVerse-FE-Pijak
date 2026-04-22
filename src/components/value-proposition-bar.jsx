import { Gift, Truck, ShoppingBag, Calendar } from "lucide-react";

export default function ValuePropositionBar() {
  const features = [
    {
      icon: Gift,
      title: "Best Prices & Offers",
      color: "#2563EB",
    },
    {
      icon: Truck,
      title: "Free Shipping",
      color: "#2563EB",
    },
    {
      icon: ShoppingBag,
      title: "Wide Variety",
      color: "#2563EB",
    },
    {
      icon: Calendar,
      title: "Great Monthly Deals",
      color: "#2563EB",
    },
  ];

  return (
    <section className="pt-8 pb-0 px-20 max-w-[1440px] mx-auto">
      {/* Icon Bar */}
      <div className="flex justify-between items-center gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-4 flex-1 p-4 rounded-xl transition-all duration-300 cursor-default hover:bg-blue-50"
          >
            {/* Icon Circle */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
              style={{
                backgroundColor: feature.color,
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
              }}
            >
              <feature.icon className="w-7 h-7 text-white" strokeWidth={2} />
            </div>

            {/* Text */}
            <div className="flex-1">
              <h4 className="font-poppins text-sm font-semibold text-gray-800 leading-relaxed m-0">
                {feature.title}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* Section Divider - 8pt Grid System */}
      <div className="h-px bg-gray-300 my-8 w-full" />
    </section>
  );
}
