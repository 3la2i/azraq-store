import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import StoreContextProvider from "./context/StoreContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; // Make sure to use the correct path

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StoreContextProvider>
          <App />
        </StoreContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);