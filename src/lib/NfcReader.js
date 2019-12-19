"use strict";

import { NativeModules } from "react-native";

export default class NfcReader {
  transmit(commandAPDU) {
    return new Promise((resolve, reject) => {
      commandAPDU = commandAPDU.toUpperCase().replace(/\s/g, "");

      NativeModules.Nfc.transmit(commandAPDU, (responseAPDU, error) => {
        if (responseAPDU === null) {
          reject(error);
        } else {
          resolve(responseAPDU);
        }
      });
    });
  }

  enableCardDetection = eventFunction => {
    setTimeout(() => NativeModules.Nfc.enableReader(eventFunction), 200);
  };

  disableCardDetection() {
    NativeModules.Nfc.disableReader();
  }
}
