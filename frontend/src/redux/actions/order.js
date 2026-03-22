import axios from "axios";
import { server } from "../../server";

//Place order -Public

export const placeOrder = (customerId, products) => async (dispatch) => {
  try {
    dispatch({ type: "PlaceOrderRequest" });

    const { data } = await axios.post(
      `${server}/order/place-order`,
      {
        customerId,
        products,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({
      type: "PlaceOrderSuccess",
      payload: data.order,
    });
  } catch (error) {
    dispatch({
      type: "PlaceOrderFail",
      payload: error?.response?.data?.message || "Failed to place order",
    });
  }
};

//get order by customerId

export const getCustomerOrders = (customerId) => async (dispatch) => {
  try {
    dispatch({ type: "GetCustomerOrdersRequest" });

    const { data } = await axios.get(
      `${server}/order/get-orders/${customerId}`
    );

    dispatch({
      type: "GetCustomerOrdersSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "GetCustomerOrdersFail",
      payload:
        error?.response?.data?.message || "Failed to fetch customer orders",
    });
  }
};

// Mark order as paid
export const markOrderAsPaid = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: "MarkOrderPaidRequest" });

    const { data } = await axios.put(
      `${server}/order/mark-paid/${orderId}`,
      {},
      { withCredentials: true }
    );

    dispatch({
      type: "MarkOrderPaidSuccess",
      payload: data.order, // updated order
    });
  } catch (error) {
    dispatch({
      type: "MarkOrderPaidFail",
      payload:
        error?.response?.data?.message || "Failed to update payment status",
    });
  }
};

//Admin -Get Orders

export const adminGetAllOrders = () => async (dispatch) => {
  try {
    dispatch({ type: "AdminGetOrdersRequest" });

    const { data } = await axios.get(`${server}/order/admin-get-orders`, {
      withCredentials: true, // admin auth cookie
    });

    dispatch({
      type: "AdminGetOrdersSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "AdminGetOrdersFail",
      payload: error?.response?.data?.message || "Failed to fetch orders",
    });
  }
};

export const updateOrderStatus = (orderId, orderStatus) => async (dispatch) => {
  try {
    dispatch({ type: "UpdateOrderStatusRequest" });

    const { data } = await axios.put(
      `${server}/order/update-status/${orderId}`,
      { orderStatus },
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "UpdateOrderStatusSuccess",
      payload: data.order,
    });
  } catch (error) {
    dispatch({
      type: "UpdateOrderStatusFail",
      payload: error.response?.data?.message || "Failed to update order status",
    });
  }
};

// Create Regular Customer Order
export const createRegularOrder =
  (customerId, deliveryDate, quantity) => async (dispatch) => {
    try {
      dispatch({ type: "CreateRegularOrderRequest" });

      const { data } = await axios.post(
        `${server}/order/admin/regular-order`,
        {
          customerId,
          deliveryDate,
          quantity,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch({
        type: "CreateRegularOrderSuccess",
        payload: {
          order: data?.order || null,
          message: data?.message || "Order created successfully",
        },
      });

      // ✅ IMPORTANT: return response for component usage
      return {
        success: true,
        order: data?.order,
        message: data?.message,
      };
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create regular customer order";

      dispatch({
        type: "CreateRegularOrderFail",
        payload: message,
      });

      // ✅ IMPORTANT: throw so component can catch
      throw new Error(message);
    }
  };

// Get Orders By Date (Admin)

export const getOrdersByDate = (date) => async (dispatch) => {
  try {
    dispatch({ type: "GetOrdersByDateRequest" });

    const { data } = await axios.get(
      `${server}/order/admin/orders-by-date?date=${date}`,
      { withCredentials: true }
    );

    dispatch({
      type: "GetOrdersByDateSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "GetOrdersByDateFail",
      payload: error?.response?.data?.message || "Failed to fetch orders",
    });
  }
};

// CANCEL ORDER -Admin
export const deleteOrder = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: "DeleteOrderRequest" });

    const { data } = await axios.delete(
      `${server}/order/admin/cancel-order/${orderId}`,
      { withCredentials: true }
    );

    dispatch({
      type: "DeleteOrderSuccess",
      payload: data.message,
    });

    return data;
  } catch (error) {
    dispatch({
      type: "DeleteOrderFail",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// Get Customer Monthly Orders
export const getCustomerMonthlyOrders =
  (customerId, month, year) => async (dispatch) => {
    try {
      dispatch({ type: "GetCustomerMonthlyOrdersRequest" });

      const { data } = await axios.get(
        `${server}/order/admin/customer-month-orders`,
        {
          params: {
            customerId,
            month,
            year,
          },
          withCredentials: true,
        }
      );

      dispatch({
        type: "GetCustomerMonthlyOrdersSuccess",
        payload: data.orders,
      });
    } catch (error) {
      dispatch({
        type: "GetCustomerMonthlyOrdersFail",
        payload:
          error?.response?.data?.message || "Failed to fetch monthly orders",
      });
    }
  };

// 🔹 Share Order (WhatsApp)
export const shareOrder = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: "ShareOrderRequest" });

    const res = await fetch(`${server}/order/${orderId}/share`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (data.success) {
      // ✅ Open WhatsApp
      window.open(data.whatsappUrl, "_blank");

      dispatch({
        type: "ShareOrderSuccess",
        payload: orderId, // we only need ID to update state
      });
    } else {
      dispatch({
        type: "ShareOrderFail",
        payload: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: "ShareOrderFail",
      payload: error.message,
    });
  }
};

/**
 * 🔄 Clear Errors
 */
export const clearOrderErrors = () => async (dispatch) => {
  dispatch({ type: "ClearOrderErrors" });
};
