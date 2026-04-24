import axios from "axios";
import { server } from "../../server";

// ✅ CREATE DEPOSIT
export const createDeposit = (depositData) => async (dispatch) => {
  try {
    dispatch({ type: "CreateDepositRequest" });

    const { data } = await axios.post(
      `${server}/deposit/create-deposit`,
      depositData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    dispatch({
      type: "CreateDepositSuccess",
      payload: data.deposit,
    });

    // refresh list (optional)
    dispatch(getAllDeposits());
  } catch (error) {
    dispatch({
      type: "CreateDepositFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ GET ALL DEPOSITS
export const getAllDeposits = () => async (dispatch) => {
  try {
    dispatch({ type: "GetAllDepositsRequest" });

    const { data } = await axios.get(`${server}/deposit/all`, {
      withCredentials: true,
    });

    dispatch({
      type: "GetAllDepositsSuccess",
      payload: data.deposits,
    });
  } catch (error) {
    dispatch({
      type: "GetAllDepositsFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ GET DEPOSITS BY CUSTOMER
export const getCustomerDeposits = (customerId) => async (dispatch) => {
  try {
    dispatch({ type: "GetCustomerDepositsRequest" });

    const { data } = await axios.get(
      `${server}/deposit/customer/${customerId}`,
      { withCredentials: true }
    );

    dispatch({
      type: "GetCustomerDepositsSuccess",
      payload: data.deposits,
    });
  } catch (error) {
    dispatch({
      type: "GetCustomerDepositsFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ GET CUSTOMER BALANCE
export const getDepositBalance = (customerId) => async (dispatch) => {
  try {
    dispatch({ type: "GetDepositBalanceRequest" });

    const { data } = await axios.get(
      `${server}/deposit/balance/${customerId}`,
      { withCredentials: true }
    );

    dispatch({
      type: "GetDepositBalanceSuccess",
      payload: data.balance,
    });
  } catch (error) {
    dispatch({
      type: "GetDepositBalanceFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ DELETE DEPOSIT
export const deleteDeposit = (id) => async (dispatch) => {
  try {
    dispatch({ type: "DeleteDepositRequest" });

    const { data } = await axios.delete(`${server}/deposit/${id}`, {
      withCredentials: true,
    });

    dispatch({
      type: "DeleteDepositSuccess",
      payload: data.message,
    });

    // refresh list
    dispatch(getAllDeposits());
  } catch (error) {
    dispatch({
      type: "DeleteDepositFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ CLEAR ERRORS
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: "ClearErrors" });
};
