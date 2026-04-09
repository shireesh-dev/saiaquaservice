import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";

const AllReports = () => {
  const navigate = useNavigate();

  const [reportType, setReportType] = useState("daily");
  const [loading, setLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleDownload = async () => {
    try {
      let url = `${server}/report/download-reports?type=${reportType}`;

      if (reportType === "daily") {
        if (!selectedDate) return toast.error("Select date");
        url += `&date=${selectedDate}`;
      }

      if (reportType === "weekly") {
        if (!startDate || !endDate) return toast.error("Select both dates");
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }

      if (reportType === "monthly") {
        if (!selectedMonth) return toast.error("Select month");
        url += `&month=${selectedMonth}`;
      }

      setLoading(true);

      const response = await axios.get(url, {
        withCredentials: true,
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${reportType}-report.xlsx`);

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Report downloaded");
    } catch (error) {
      console.error(error);
      toast.error("Download failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-4 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl sm:text-2xl font-bold">Reports</h2>
          <button
            onClick={() => navigate("/admin")}
            className="text-sm border px-3 py-1 rounded-md"
          >
            Back
          </button>
        </div>

        {/* Report Type */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {["daily", "weekly", "monthly"].map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`py-2 text-sm rounded-md capitalize ${
                reportType === type ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="space-y-4 mb-6">
          {reportType === "daily" && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border px-3 py-3 rounded-md w-full text-sm"
            />
          )}

          {reportType === "weekly" && (
            <div className="space-y-3">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border px-3 py-3 rounded-md w-full text-sm"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border px-3 py-3 rounded-md w-full text-sm"
              />
            </div>
          )}

          {reportType === "monthly" && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border px-3 py-3 rounded-md w-full text-sm"
            />
          )}
        </div>

        {/* Sticky Download Button */}
        <div className="sticky bottom-3">
          <button
            onClick={handleDownload}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-medium text-sm shadow ${
              loading ? "bg-gray-400" : "bg-green-600 active:scale-95"
            }`}
          >
            {loading ? "Downloading..." : "Download Report"}
          </button>
        </div>

        {/* Info */}
        <p className="mt-4 text-xs text-gray-500 text-center">
          📊 Select report type and download Excel file
        </p>
      </div>
    </div>
  );
};

export default AllReports;
