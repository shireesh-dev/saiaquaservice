import axios from "axios";
import { server } from "../../server";

// ✅ GET ALL CONTACTS
export const getAllContacts = () => async (dispatch) => {
  try {
    dispatch({ type: "GetAllContactsRequest" });

    const { data } = await axios.get(`${server}/contact/get-contacts`, {
      withCredentials: true,
    });

    dispatch({
      type: "GetAllContactsSuccess",
      payload: data.contacts,
    });
  } catch (error) {
    dispatch({
      type: "GetAllContactsFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ DELETE CONTACT
export const deleteContact = (id) => async (dispatch) => {
  try {
    dispatch({ type: "DeleteContactRequest" });

    const { data } = await axios.delete(
      `${server}/contact/delete-contact/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "DeleteContactSuccess",
      payload: data.message,
    });

    // refresh list
    dispatch(getAllContacts());
  } catch (error) {
    dispatch({
      type: "DeleteContactFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ CREATE CONTACT
export const createContact = (contactData) => async (dispatch) => {
  try {
    dispatch({ type: "CreateContactRequest" });

    const { data } = await axios.post(
      `${server}/contact/create-contact`,
      contactData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    dispatch({
      type: "CreateContactSuccess",
      payload: data.contact, // 👈 important (not just message)
    });
  } catch (error) {
    dispatch({
      type: "CreateContactFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ GET SINGLE CONTACT (optional but recommended)
export const getContactById = (id) => async (dispatch) => {
  try {
    dispatch({ type: "GetContactByIdRequest" });

    const { data } = await axios.get(`${server}/contact/${id}`, {
      withCredentials: true,
    });

    dispatch({
      type: "GetContactByIdSuccess",
      payload: data.contact,
    });
  } catch (error) {
    dispatch({
      type: "GetContactByIdFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ UPDATE Contact STATUS
export const updateContactStatus = (id, status) => async (dispatch) => {
  try {
    dispatch({ type: "UpdateContactStatusRequest" });

    const { data } = await axios.put(
      `${server}/contact/update-status/${id}`,
      { status },
      { withCredentials: true }
    );

    dispatch({
      type: "UpdateContactStatusSuccess",
      payload: data.contact,
    });

    // refresh list
    dispatch(getAllContacts());
  } catch (error) {
    dispatch({
      type: "UpdateContactStatusFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ CLEAR ERRORS
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: "ClearErrors" });
};
