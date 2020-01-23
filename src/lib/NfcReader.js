"use strict";

import { NativeModules } from "react-native";

export default class NfcReader {
  transmit(commandAPDU) {
    return new Promise((resolve, reject) => {
      commandAPDU = commandAPDU.toUpperCase().replace(/\s/g, "");

      NativeModules.NfcModule.transmit(commandAPDU, (responseAPDU, error) => {
        console.log("responseAPDU: ", responseAPDU);
        console.log("error: ", error);
        if (responseAPDU === null) {
          reject(error);
        } else {
          resolve(responseAPDU);
        }
      });
    });
  }

  enableCardDetection = eventFunction => {
    setTimeout(() => NativeModules.NfcModule.enableReader(eventFunction), 200);
  };

  disableCardDetection() {
    NativeModules.NfcModule.disableReader();
  }
}
