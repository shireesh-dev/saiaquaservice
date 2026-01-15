import axios from "axios";
import { server } from "../../server";

// === Load User ===
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });

    const { data } = await axios.get(`${server}/user/me`, {
      withCredentials: true,
    });

    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error?.response?.data?.message || "Failed to load user",
    });
  }
};

// === Admin Login ===
export const loginAdmin = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: "LoginAdminRequest" });

    const { data } = await axios.post(
      `${server}/user/admin/login`,
      { email, password },
      { withCredentials: true }
    );

    dispatch({
      type: "LoginAdminSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LoginAdminFail",
      payload: error?.response?.data?.message || "Login failed",
    });
  }
};

// === Admin Register ===
export const registerAdmin = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: "RegisterAdminRequest" });

    const { data } = await axios.post(
      `${server}/user/admin/register`,
      { name, email, password },
      { withCredentials: true }
    );

    dispatch({
      type: "RegisterAdminSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "RegisterAdminFail",
      payload: error?.response?.data?.message || "Registration failed",
    });
  }
};

// === Logout Admin ===
export const logoutAdmin = () => async (dispatch) => {
  try {
    dispatch({ type: "LogoutAdminRequest" });

    await axios.get(`${server}/user/logout`, {
      withCredentials: true,
    });

    dispatch({ type: "LogoutAdminSuccess" });
  } catch (error) {
    dispatch({
      type: "LogoutAdminFail",
      payload: error?.response?.data?.message || "Logout failed",
    });
  }
};
