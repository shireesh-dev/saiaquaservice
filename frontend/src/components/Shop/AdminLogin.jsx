import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { useDispatch } from "react-redux";
import { loadUser } from "../../redux/actions/user";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${server}/user/admin/login`,
        { email, password },
        { withCredentials: true }
      );

      // Dispatch loadUser to update Redux state
      await dispatch(loadUser());

      toast.success("Login successful");
      navigate("/admin"); // now Redux state has user role
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Admin Login
        </h2>
        <p className="text-center text-sm text-gray-500 mt-1">
          Enter your email and password
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={visible ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {visible ? (
                <AiOutlineEye
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
                  size={20}
                  onClick={() => setVisible(false)}
                />
              ) : (
                <AiOutlineEyeInvisible
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
                  size={20}
                  onClick={() => setVisible(true)}
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Cancel */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full py-2 rounded-md border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
