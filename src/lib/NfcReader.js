"use strict";

import NfcManager, { NfcTech } from "react-native-nfc-manager";
import BitaWalletCard from "./BitaWalletCard";

export default class NfcReader {
  isSupported() {
    return new Promise((resolve, reject) => {
      NfcManager.isSupported()
        .then(supported => {
          if (supported) {
            this.bitaWalletCard = new BitaWalletCard(this.transmit.bind(this));
          }
          resolve(supported);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  transmit(commandAPDU) {
    return new Promise((resolve, reject) => {
      commandAPDU = commandAPDU.toUpperCase().replace(/\s/g, "");
      // is connected?
      let inBuffer = BitaWalletCard.hex2Bytes(commandAPDU);
      NfcManager.transceive(inBuffer)
        .then(outBuffer => {
          const responseAPDU = BitaWalletCard.bytes2Hex(outBuffer);
          resolve(responseAPDU);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  cardDetection = eventFunction => {
    NfcManager.start()
      .then(() => NfcManager.isEnabled())
      .then(() => NfcManager.closeTechnology())
      .then(() => NfcManager.unregisterTagEvent())
      .then(() => NfcManager.registerTagEvent())
      .then(() => NfcManager.requestTechnology(NfcTech.IsoDep))
      .then(() => NfcManager.getTag())
      .then(() => this.getCardInfo())
      .then(() => eventFunction())
      .catch(err => {
        console.warn(err);
      });
  };

  disconnectCard() {
    NfcManager.closeTechnology().then(() => NfcManager.unregisterTagEvent());
  }

  getCardInfo() {
    return new Promise((resolve, reject) => {
      let cardInfo = {};
      this.bitaWalletCard
        .selectApplet()
        // .then(
        //   this.bitaWalletCard
        //     .getSerialNumber()
        //     .then(res => (cardInfo.serialNumber = res.serialNumber))
        //     .then(
        //       this.bitaWalletCard
        //         .getVersion()
        //         .then(res => {
        //           cardInfo.type = res.type;
        //           cardInfo.version = res.version;
        //         })
        //         .then(
        //           this.bitaWalletCard
        //             .getLabel()
        //             .then(res => (cardInfo.label = res.label))
        //             .then(() => (this.cardInfo = cardInfo))
        //             .then(() => resolve(cardInfo))
        //         )
        //     )
        // )
        .catch(error => {
          reject(error);
        });
    });
  }
}
