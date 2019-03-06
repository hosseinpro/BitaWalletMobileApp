"use strict";

import axios from "axios";

export default class Blockchain {
  static baseAddress = "http://api.xebawallet.com:3333";
  static btcMain = "mainnet";
  static btcTest = "testnet";

  static getAddressHistory(addressInfo, network) {
    let addresses = "";
    for (let i = 0; i < addressInfo.length; i++) {
      addresses += addressInfo[i].address;
      if (i < addressInfo.length - 1) addresses += ",";
    }
    return new Promise((resolve, reject) => {
      axios
        .get(
          Blockchain.baseAddress +
            "/utxo" +
            "?network=" +
            network +
            "&address=" +
            addresses
        )
        .then(res => {
          let addressInfo2 = [];
          for (let i = 0; i < addressInfo.length; i++) {
            let addressInfoElement = addressInfo[i];

            let addressObject = res.data.filter(
              addressObject =>
                addressObject.address === addressInfoElement.address
            )[0];

            if (addressObject === undefined) continue;

            addressInfoElement.txs = [];

            for (let j = 0; j < addressObject.txs.length; j++) {
              let tx = {};
              tx.txHash = addressObject.txs[j].txHash;
              tx.utxo = addressObject.txs[j].utxo;
              tx.value = addressObject.txs[j].value;

              addressInfoElement.txs[j] = tx;
            }

            addressInfo2.push(addressInfoElement);
          }

          resolve(addressInfo2);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  static pushTx(tx, network) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          Blockchain.baseAddress +
            "/pushtx" +
            "?network=" +
            network +
            "&rawtx=" +
            tx
        )
        .then(res => {
          resolve(res.data.txHash);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
