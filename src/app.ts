import React from "react";
import { createRoot } from "react-dom/client";

import "swiper/css";
import "swiper/css/pagination";
import "zmp-ui/zaui.css";
import "./css/tailwind.css";
import "./css/app.scss";

import App from "./components/app";
import appConfig from "../app-config.json";

if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig;
}

const root = createRoot(document.getElementById("app")!);
root.render(React.createElement(App));
