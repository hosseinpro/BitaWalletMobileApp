"use strict";

import { NativeModules } from "react-native";
import BitaWalletCard from "./BitaWalletCard";

export default class NfcReader {
  constructor() {
    this.bitaWalletCard = new BitaWalletCard(this.transmit.bind(this));
  }

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

  cardDetection = eventFunction => {
    NativeModules.Nfc.enableReader(eventFunction);
  };
}
