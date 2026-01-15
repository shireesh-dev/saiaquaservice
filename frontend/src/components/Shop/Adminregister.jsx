import React, { useState } from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const AdminRegister = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 4) {
      return toast.error("Password must be at least 4 characters");
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${server}/user/admin/register`, // backend admin register endpoint
        { name, email, password },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Admin registered successfully");
      navigate("/admin/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
        {/* Title */}
        <h2 className="text-center text-2xl font-extrabold text-indigo-700">
          Admin Registration
        </h2>
        <p className="text-center text-sm text-gray-500 mt-1">
          Create admin account 🔐
        </p>

        {/* Form */}
        <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Name
            </label>
            <input
              type="text"
              required
              placeholder="Enter admin name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {visible ? (
                <AiOutlineEye
                  size={22}
                  className="absolute right-3 top-3 cursor-pointer text-gray-600"
                  onClick={() => setVisible(false)}
                />
              ) : (
                <AiOutlineEyeInvisible
                  size={22}
                  className="absolute right-3 top-3 cursor-pointer text-gray-600"
                  onClick={() => setVisible(true)}
                />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500
               text-white font-semibold text-sm shadow-md disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Admin"}
            </button>

            <Link
              to="/"
              className="w-full py-3 rounded-lg border border-indigo-500 text-indigo-600 
               font-semibold text-sm text-center hover:bg-indigo-50 transition"
            >
              Cancel
            </Link>
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-gray-600 pt-2">
            Already an admin?
            <Link
              to="/admin/login"
              className="text-indigo-600 font-semibold ml-1"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
