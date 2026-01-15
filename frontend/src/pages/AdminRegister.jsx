import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Register from "../components/Shop/Adminregister";

const AdminRegister = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/admin");
    }
  }, [loading, isAuthenticated, navigate]);

  return (
    <div>
      <Register />
    </div>
  );
};

export default AdminRegister;
