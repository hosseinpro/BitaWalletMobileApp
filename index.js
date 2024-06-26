/** @format */

import React from "react";
import { AppRegistry } from "react-native";
import App from "./src/App";
import { name as appName } from "./app.json";
import { Provider } from "react-redux";
import redux from "./src/redux/redux";

const ReactNativeRedux = () => (
  <Provider store={redux.store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => ReactNativeRedux);
