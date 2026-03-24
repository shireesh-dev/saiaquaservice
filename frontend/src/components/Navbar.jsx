import React from "react";
import { Link } from "react-router-dom";
import logo from "../Assests/images/OM-SAI-AQUA-PUNE.png";

const Navbar = () => {
  return (
    <>
      {/* 🔷 TOP BAR */}
      <div className="container-fluid bg-dark px-0">
        <div className="row g-0 d-none d-lg-flex">
          <div className="col-lg-6 ps-5 text-start">
            <div className="h-100 d-inline-flex align-items-center text-white">
              <span>Follow Us:</span>
              <a className="btn btn-link text-light" href="#">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a className="btn btn-link text-light" href="#">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-6 text-end">
            <div className="h-100 d-inline-flex align-items-center text-white py-2 px-5">
              <span className="fs-6 fw-bold me-2">
                <i className="fa fa-phone-alt me-2"></i>Order:
              </span>
              <a href="tel:+919552989143" className="fs-6 fw-bold text-white">
                +91 9552989143
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 🔷 MAIN NAVBAR */}
      <div className="bg-white shadow-sm py-3 px-4 flex flex-wrap items-center justify-between gap-3">
        {/* Logo */}
        <img src={logo} alt="Om Sai Aqua" className="h-12 object-contain" />

        {/* Buttons Section */}
        <div className="flex flex-wrap gap-2 justify-center">
          {/* Place Order */}
          <Link to="/place-order">
            <div className="flex items-center gap-2 bg-emerald-600 px-4 py-2 rounded-md text-white text-sm font-semibold shadow hover:bg-emerald-700 transition">
              🚚 Place Order
            </div>
          </Link>

          {/* Admin */}
          <Link to="/admin/register">
            <div className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-md text-white text-sm font-semibold shadow hover:bg-indigo-700 transition">
              🛠️ Admin
            </div>
          </Link>

          {/* 📞 Call Button */}
          <a
            href="tel:9552989143"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow hover:bg-blue-700 transition"
          >
            📞 Call
          </a>

          {/* 💬 WhatsApp Button */}
          <a
            href="https://wa.me/9630969994"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow hover:bg-green-700 transition"
          >
            💬 WhatsApp
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
