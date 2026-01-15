import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import mainLogo from "../../Assests/images/jar.png";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

const Header = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-300
        bg-gradient-to-r from-sky-700 to-cyan-500
        ${active ? "shadow-lg" : ""}
      `}
    >
      <div className={`${styles.section} px-3 py-3`}>
        {/* Top Row */}
        <div className="flex items-center justify-between">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="bg-white p-2 rounded-full shadow">
              <img
                src={mainLogo}
                alt="JAR Logo"
                className="w-[40px] h-[40px]"
              />
            </Link>

            <div>
              <h1
                className="font-extrabold text-lg md:text-xl tracking-wide
               text-amber-300 drop-shadow-sm"
              >
                OM SAI Aqua
              </h1>

              <p className="text-sky-100 text-xs">Alkaline RO + UV Water</p>
            </div>
          </div>

          {/* Desktop Call Info */}
          <div className="hidden md:flex flex-col text-right gap-1 max-w-[420px]">
            <p className="text-sky-100 text-sm">
              📍 Om Sai Lane No. C6, Anand Park, Dhanori Road, Vishrantwadi,
              Pune – 411015
            </p>
            <p className="text-white text-sm font-semibold">
              📞 Delivery: Madhavi khatave - 9552989143
            </p>
            <div className="flex items-center justify-end gap-1 text-white text-sm">
              <FaWhatsapp className="text-green-300" />

              <span>9630969994</span>
            </div>
          </div>
        </div>

        {/* Mobile Details */}
        <div className="md:hidden mt-3 space-y-2">
          <p className="text-sky-100 text-xs leading-snug">
            📍 Om Sai Lane No. C6, Anand Park, Dhanori Road, Vishrantwadi, Pune
            – 411015
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="tel:8459343099"
              className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full"
            >
              <FaPhoneAlt className="text-white" />
              <span className="text-white text-sm font-medium">
                {" "}
                Madhavi Khatave : 9552989143
              </span>
            </a>

            <a
              href="https://wa.me/919630969994"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full"
            >
              <FaWhatsapp className="text-green-300" />
              <span className="text-white text-sm font-medium">9630969994</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
