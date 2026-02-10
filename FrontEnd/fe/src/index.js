import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "~/App";
import reportWebVitals from "./reportWebVitals";
import store from "./redux/store";
import "~/assets/scss/global.scss";
import { makeServer } from "./server";

// Initialize MirageJS mock server in production (Vercel) or when USE_MOCK is enabled
if (
  process.env.NODE_ENV === "production" ||
  process.env.REACT_APP_USE_MOCK === "true"
) {
  makeServer({ environment: "production" });
  console.log("🚀 MirageJS mock server started");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
