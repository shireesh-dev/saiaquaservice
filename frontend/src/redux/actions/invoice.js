import axios from "axios";
import { server } from "../../server";

//create Invoice -Admin
export const createInvoice = (invoiceData) => async (dispatch) => {
  try {
    dispatch({ type: "CreateInvoiceRequest" });

    const { data } = await axios.post(
      `${server}/invoice/create-invoice`,
      invoiceData,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "CreateInvoiceSuccess",
      payload: data.invoice,
    });
  } catch (error) {
    dispatch({
      type: "CreateInvoiceFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

//get All Invoices -Admin
export const getAllInvoices =
  (query = "") =>
  async (dispatch) => {
    try {
      dispatch({ type: "GetAllInvoicesRequest" });

      const { data } = await axios.get(
        `${server}/invoice/get-invoices${query}`,
        {
          withCredentials: true,
        }
      );

      dispatch({
        type: "GetAllInvoicesSuccess",
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: "GetAllInvoicesFail",
        payload: error.response?.data?.message || error.message,
      });
    }
  };

//get Single Invoice by Id -Admin
export const getInvoiceById = (id) => async (dispatch) => {
  try {
    dispatch({ type: "GetInvoiceByIdRequest" });

    const { data } = await axios.get(`${server}/invoice/${id}`, {
      withCredentials: true,
    });

    dispatch({
      type: "GetInvoiceByIdSuccess",
      payload: data.invoice,
    });
  } catch (error) {
    dispatch({
      type: "GetInvoiceByIdFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

//clear errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: "ClearErrors" });
};
