import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import "./main.css";
import { store } from "./store";

// import { ControllerApp } from "./apps/Controller";
import { ScreenApp } from "./apps/Screen";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <ControllerApp /> */}
      <ScreenApp />
    </Provider>
  </React.StrictMode>
);
