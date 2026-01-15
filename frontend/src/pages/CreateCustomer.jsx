import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddCustomer from "../components/Shop/AddCustomer";

const CreateCustomer = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (!loading && isAuthenticated === false) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, loading, navigate]);

  return <AddCustomer />;
};

export default CreateCustomer;
