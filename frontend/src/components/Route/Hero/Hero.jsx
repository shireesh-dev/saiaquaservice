import React from "react";
import { Link } from "react-router-dom";
import homeDelivery from "../../../Assests/images/water_delivery.png";

const Hero = () => {
  return (
    <div className="flex-grow w-full bg-gradient-to-b from-sky-50 via-cyan-50 to-sky-100 overflow-hidden">
      {/* Main Content */}
      <main className="flex-grow w-full overflow-y-auto pb-0 mb-0">
        {/* First Time Order Blinking Alert */}
        {/* First Time Order Alert */}
        <div className="bg-green-50 border border-green-400 text-green-900 p-4 rounded-lg shadow-md text-center space-y-3">
          <p className="font-semibold text-sm sm:text-base">
            📢 First Time Order?
          </p>

          <p className="text-sm leading-relaxed">
            Please call us or contact us on WhatsApp before placing your first
            order.
          </p>

          <div className="flex justify-center gap-3 flex-wrap">
            {/* Call Button */}
            <a
              href="tel:9552989143"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-blue-700 transition"
            >
              📞 Call Now
            </a>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/9630969994"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-green-700 transition"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
        <div className="relative min-h-[35vh] w-full flex flex-col xl:flex-row px-4 py-4 sm:px-3 sm:py-3">
          {/* Text Section */}
          <div className="w-full p-3">
            {/* Heading */}
            <h1 className="text-[13px] font-semibold text-[#000080] mb-4">
              Pure & Hygienic Drinking Water Supply
            </h1>

            {/* Paragraphs */}
            <p className="text-sm text-[#333] leading-relaxed">
              We provide <strong>safe & hygienic drinking water</strong> using{" "}
              <strong>Alkaline RO + UV</strong> technology for homes, offices,
              and commercial use with assured quality and timely delivery.
            </p>

            {/* Feature List */}
            <h1 className="text-[13px] font-semibold text-[#000080] mt-5 mb-3">
              ✨ Health Benefits
            </h1>

            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-[#007BFF]">
                  ✔ Hydration ✔ Weight Loss ✔ Digestive Health ✔ Detoxification
                  ✔ pH Balance ✔ Liver Health ✔ Brain Health ✔ Bone Strength ✔
                  Low Cholesterol ✔ High Energy
                </h2>
              </div>
            </div>
          </div>

          {/* Home Delivery Image */}
          <div className="mt-6 flex flex-col items-center text-center">
            <img
              src={homeDelivery}
              alt="Home Delivery Water Service"
              className="w-[220px] sm:w-[260px] md:w-[300px] object-contain drop-shadow-lg"
            />

            <div className="mt-2 text-sm text-sky-900 font-medium">
              🚚 DoorStep Delivery
            </div>
          </div>

          {/* Action Buttons Section */}
          <section className="flex-grow w-full bg-gradient-to-b from-sky-50 via-cyan-50 to-sky-100 overflow-hidden">
            <div className="max-w-[500px] mx-auto space-y-4">
              {/* Place Order */}
              <Link to="/place-order">
                <div className="flex items-center gap-4 bg-emerald-600 p-4 rounded-xl shadow-md active:scale-95 transition">
                  <div className="bg-white/20 p-3 rounded-full text-white text-lg">
                    🚚
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base">
                      Place Order
                    </h3>
                    <p className="text-emerald-100 text-xs">
                      Order water instantly with quick delivery
                    </p>
                  </div>
                </div>
              </Link>
              {/* Admin */}
              <Link to="/admin/register">
                <div
                  className="flex items-center gap-4 bg-indigo-600 p-4 rounded-xl shadow-md 
                  hover:bg-indigo-700 active:scale-95 transition-all duration-200"
                >
                  <div className="bg-white/25 p-3 rounded-full text-white text-xl">
                    🛠️
                  </div>

                  <div>
                    <h3 className="text-white font-semibold text-base">
                      Admin
                    </h3>
                    <p className="text-indigo-100 text-xs">
                      Manage orders, users & deliveries
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* footer Section */}
      <footer className="bg-gradient-to-r from-sky-900 to-cyan-800 py-4">
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="border-t border-white/10 pt-3 text-center text-xs text-sky-200">
            <p className="font-semibold text-amber-300">OM SAI Aqua</p>
            <p className="mt-1">
              © {new Date().getFullYear()} OM SAI Aqua. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;
