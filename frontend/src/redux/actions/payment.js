import axios from "axios";
import { server } from "../../server";

/* =====================================================
   ADMIN: GET ALL PAYMENTS
===================================================== */
export const adminGetAllPayments =
  (type = "today") =>
  async (dispatch) => {
    try {
      dispatch({ type: "AdminGetPaymentsRequest" });

      const { data } = await axios.get(
        `${server}/payment/admin-get-payments?type=${type}`,
        { withCredentials: true }
      );

      dispatch({
        type: "AdminGetPaymentsSuccess",
        payload: data.payments, // ✅ array
      });
    } catch (error) {
      dispatch({
        type: "AdminGetPaymentsFail",
        payload: error?.response?.data?.message || "Failed to fetch payments",
      });
    }
  };

/* =====================================================
   ADMIN: UPDATE PAYMENT STATUS (PAID / UNPAID)
   ✅ MUST USE paymentId
===================================================== */
export const updatePaymentStatus =
  (paymentId, paymentStatus) => async (dispatch) => {
    try {
      dispatch({ type: "UpdatePaymentStatusRequest" });

      const { data } = await axios.put(
        `${server}/payment/update-payment-status/${paymentId}`,
        { paymentStatus }, // paid | unpaid
        { withCredentials: true }
      );

      dispatch({
        type: "UpdatePaymentStatusSuccess",
        payload: data.payment, // ✅ updated payment document
      });
    } catch (error) {
      dispatch({
        type: "UpdatePaymentStatusFail",
        payload:
          error?.response?.data?.message || "Failed to update payment status",
      });
    }
  };
