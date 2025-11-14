import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { ConfigProvider, } from "antd";
import { ToastProvider } from "./components/ui/toast/ToastProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#00A859",
          },
        }}
      >
          <ToastProvider>
            <App />
          </ToastProvider>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
