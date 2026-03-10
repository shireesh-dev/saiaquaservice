import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import socket from "../../../socket";

const AdminLayout = () => {
  useEffect(() => {
    // connect only once
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Admin connected:", socket.id);
    });

    socket.on("newOrder", (data) => {
      toast.info(`🛒 New Order from ${data.customerName} (₹${data.total})`);
    });

    return () => {
      socket.off("newOrder");
    };
  }, []);

  return (
    <div className="flex">
      <div className="flex-1 p-4 bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
