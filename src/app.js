// React core
import React from "react";
import { createRoot } from "react-dom/client";

// ZaUI stylesheet
import "zmp-ui/zaui.css";

// Tailwind stylesheet
import "./css/tailwind.scss";

// Your stylesheet
import "./css/app.scss";

// Expose app configuration
import appConfig from "../app-config.json";
if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig;
}

// Mount the app
import Layout from "./components/layout";
const root = createRoot(document.getElementById("app"));
root.render(React.createElement(Layout));

import zmp from "zmp-sdk";

zmp.getUserInfo({
  success: (userInfo) => {
    console.log("Thông tin người dùng:", userInfo);
  },
  fail: (error) => {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
  },
});