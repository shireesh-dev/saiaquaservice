const initialState = {
  deposits: [],
  customerDeposits: [],
  balance: 0,
  loading: false,
  error: null,
  successMessage: null,
};

export const depositReducer = (state = initialState, action) => {
  switch (action.type) {
    // 🔹 CREATE
    case "CreateDepositRequest":
      return { ...state, loading: true };

    case "CreateDepositSuccess":
      return {
        ...state,
        loading: false,
        successMessage: "Deposit added successfully",
        deposits: [action.payload, ...state.deposits],
      };

    case "CreateDepositFail":
      return { ...state, loading: false, error: action.payload };

    // 🔹 GET ALL
    case "GetAllDepositsRequest":
      return { ...state, loading: true };

    case "GetAllDepositsSuccess":
      return {
        ...state,
        loading: false,
        deposits: action.payload,
      };

    case "GetAllDepositsFail":
      return { ...state, loading: false, error: action.payload };

    // 🔹 CUSTOMER DEPOSITS
    case "GetCustomerDepositsRequest":
      return { ...state, loading: true };

    case "GetCustomerDepositsSuccess":
      return {
        ...state,
        loading: false,
        customerDeposits: action.payload,
      };

    case "GetCustomerDepositsFail":
      return { ...state, loading: false, error: action.payload };

    // 🔹 BALANCE
    case "GetDepositBalanceRequest":
      return { ...state, loading: true };

    case "GetDepositBalanceSuccess":
      return {
        ...state,
        loading: false,
        balance: action.payload,
      };

    case "GetDepositBalanceFail":
      return { ...state, loading: false, error: action.payload };

    // 🔹 DELETE
    case "DeleteDepositRequest":
      return { ...state, loading: true };

    case "DeleteDepositSuccess":
      return {
        ...state,
        loading: false,
        successMessage: action.payload,
      };

    case "DeleteDepositFail":
      return { ...state, loading: false, error: action.payload };

    // 🔹 CLEAR
    case "ClearErrors":
      return { ...state, error: null };

    case "CLEAR_MESSAGES":
      return { ...state, successMessage: null };

    default:
      return state;
  }
};
