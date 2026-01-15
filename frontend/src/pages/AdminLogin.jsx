import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Login from "../components/Shop/AdminLogin";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/admin");
    }
  }, [loading, isAuthenticated, navigate]);

  return (
    <div>
      <Login />
    </div>
  );
};

export default AdminLogin;
