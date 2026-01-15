import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AllPayments from "../components/Shop/AllPayments";

const AllOrdersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <AllPayments />
    </div>
  );
};

export default AllOrdersPage;
