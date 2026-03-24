import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// ✅ Redux
import { Provider } from "react-redux";
import store from "./redux/store";

// CSS
import "./css/bootstrap.min.css";
import "./css/animate.min.css";
import "./css/style.css";
import './App.css';

// Bootstrap JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
