import React from "react";
import { Link } from "react-router-dom";
import mainLogo from "../../Assests/images/ePaperBilling.png";

const AdminHeader = () => {
  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-6">
      {/* Logo Section */}
      <div className="bg-white p-2 rounded-full">
        <Link to="/">
          <img
            src={mainLogo}
            alt="ePaperBilling Logo"
            style={{ width: "60px", height: "auto" }}
            className="hidden md:flex items-center justify-between"
          />
        </Link>
      </div>
    </div>
  );
};

export default AdminHeader;
