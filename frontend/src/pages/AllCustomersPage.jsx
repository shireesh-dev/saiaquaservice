import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AllCustomers from "../components/Shop/AllCustomers";

const AllCustomer = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <AllCustomers />
    </div>
  );
};

export default AllCustomer;
