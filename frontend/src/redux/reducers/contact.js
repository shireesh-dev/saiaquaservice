const initialState = {
  contacts: [],
  loading: false,
  error: null,
  successMessage: null,
};

export const contactReducer = (state = initialState, action) => {
  switch (action.type) {
    // 🔹 GET CONTACTS
    case "GetAllContactsRequest":
      return {
        ...state,
        loading: true,
      };

    case "GetAllContactsSuccess":
      return {
        ...state,
        loading: false,
        contacts: action.payload,
      };

    case "GetAllContactsFail":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // 🔹 DELETE CONTACT
    case "DeleteContactRequest":
      return {
        ...state,
        loading: true,
      };

    case "DeleteContactSuccess":
      return {
        ...state,
        loading: false,
        successMessage: action.payload,
      };

    case "DeleteContactFail":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // 🔹 CREATE CONTACT
    case "CreateContactRequest":
      return {
        ...state,
        loading: true,
      };

    case "CreateContactSuccess":
      return {
        ...state,
        loading: false,
        successMessage: "Contact created successfully",
        contacts: [action.payload, ...state.contacts], // ✅ add new contact instantly
      };

    case "CreateContactFail":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // 🔹 SINGLE CONTACT (optional but useful)
    case "GetContactByIdRequest":
      return {
        ...state,
        loading: true,
      };

    case "GetContactByIdSuccess":
      return {
        ...state,
        loading: false,
        contact: action.payload,
      };

    case "GetContactByIdFail":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    //Update contact Status
    case "UpdateContactStatusRequest":
      return {
        ...state,
        loading: true,
      };

    case "UpdateContactStatusSuccess":
      return {
        ...state,
        loading: false,
        successMessage: "Status updated successfully",
      };

    case "UpdateContactStatusFail":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // 🔹 CLEAR
    case "ClearErrors":
      return {
        ...state,
        error: null,
      };

    case "CLEAR_MESSAGES":
      return {
        ...state,
        successMessage: null,
      };

    default:
      return state;
  }
};
