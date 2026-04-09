import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AllReports from "../components/Shop/AllReports";

const AllReportPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/reports");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <AllReports />
    </div>
  );
};

export default AllReportPage;
