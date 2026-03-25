import React from "react";
import { App, ZMPRouter, SnackbarProvider } from "zmp-ui";
import { getConfig } from "utils/config";
import { Layout } from "./layout";
import { ConfigProvider } from "./config-provider";

const MyApp = () => {
  return (
    <ConfigProvider
      cssVariables={{
        "--zmp-primary-color": getConfig((c) => c.template.primaryColor),
        "--zmp-background-color": "#EEF7F1",
      }}
    >
      <App>
        <SnackbarProvider>
          <ZMPRouter>
            <Layout />
          </ZMPRouter>
        </SnackbarProvider>
      </App>
    </ConfigProvider>
  );
};
export default MyApp;
