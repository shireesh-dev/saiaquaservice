import axios from "axios";
import { server } from "../../server";

//create customer actions

export const createCustomer =
  (name, phoneNumber, address, customerType, products) => async (dispatch) => {
    try {
      dispatch({ type: "CreateCustomerRequest" });

      const { data } = await axios.post(
        `${server}/customer/create-customer`,
        {
          name,
          phoneNumber,
          address,
          customerType,
          products,
        },
        {
          withCredentials: true, // admin auth cookie
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch({
        type: "CreateCustomerSuccess",
        payload: data.customer,
      });
    } catch (error) {
      dispatch({
        type: "CreateCustomerFail",
        payload: error?.response?.data?.message || "Failed to create customer",
      });
    }
  };

//update customer

export const updateCustomerProfile =
  (name, phoneNumber, address, customerType, products) => async (dispatch) => {
    try {
      dispatch({ type: "UpdateCustomerProfileRequest" });

      const { data } = await axios.put(
        `${server}/customer/edit-customer`,
        { name, phoneNumber, address, customerType, products },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch({
        type: "UpdateCustomerProfileSuccess",
        payload: data.customer,
      });
    } catch (error) {
      dispatch({
        type: "UpdateCustomerProfileFail",
        payload: error?.response?.data?.message || "Failed to update profile",
      });
    }
  };

// get customer by id (specific customer)

export const getCustomerProfile = () => async (dispatch) => {
  try {
    dispatch({ type: "GetCustomerProfileRequest" });

    const { data } = await axios.get(`${server}/customer/profile`, {
      withCredentials: true,
    });

    dispatch({
      type: "GetCustomerProfileSuccess",
      payload: data.customer,
    });
  } catch (error) {
    dispatch({
      type: "GetCustomerProfileFail",
      payload: error?.response?.data?.message || "Failed to load profile",
    });
  }
};

//Admin get All customers

export const getAllCustomers = () => async (dispatch) => {
  try {
    dispatch({ type: "GetAllCustomersRequest" });

    const { data } = await axios.get(`${server}/customer/customers`, {
      withCredentials: true, // admin auth cookie
    });

    dispatch({
      type: "GetAllCustomersSuccess",
      payload: data.customers,
    });
  } catch (error) {
    dispatch({
      type: "GetAllCustomersFail",
      payload: error?.response?.data?.message || "Failed to fetch customers",
    });
  }
};

// delete customer-Admin
export const deleteCustomer = (customerId) => async (dispatch) => {
  try {
    dispatch({ type: "DeleteCustomerRequest" });

    const { data } = await axios.delete(`${server}/customer/${customerId}`, {
      withCredentials: true, // admin auth cookie
    });

    dispatch({
      type: "DeleteCustomerSuccess",
      payload: {
        customerId,
        message: data.message,
      },
    });
  } catch (error) {
    dispatch({
      type: "DeleteCustomerFail",
      payload: error?.response?.data?.message || "Failed to delete customer",
    });
  }
};
