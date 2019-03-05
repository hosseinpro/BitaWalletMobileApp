"use strict";

import axios from "axios";

export default class Blockchain1 {
  static baseAddress = "https://api.blockcypher.com/v1";
  static token = "bb7bc2d851574c2c87fa02b51ba3f9f4";
  static btcMain = "/btc/main";
  static btcTest = "/btc/test3";

  static getAddressHistory(addressInfo, network) {
    let addresses = "";
    for (let i = 0; i < addressInfo.length; i++) {
      addresses += addressInfo[i].address;
      if (i < addressInfo.length - 1) addresses += ";";
    }
    return new Promise((resolve, reject) => {
      axios
        .get(
          Blockchain.baseAddress +
            network +
            "/addrs/" +
            addresses +
            // "?unspentOnly=true" +
            // "&token=" +
            "?token=" +
            Blockchain.token
        )
        .then(res => {
          let addressInfo2 = [];
          for (let i = 0; i < addressInfo.length; i++) {
            let addressInfoElement = addressInfo[i];

            let addressObject = res.data.filter(
              addressObject =>
                addressObject.address === addressInfoElement.address
            )[0];

            if (addressObject.n_tx === 0) continue;

            addressInfoElement.txs = [];

            if (addressObject.txrefs !== undefined) {
              for (let j = 0; j < addressObject.txrefs.length; j++) {
                let tx = {};
                tx.txHash = addressObject.txrefs[j].tx_hash;
                tx.utxo = addressObject.txrefs[j].tx_output_n;
                tx.value = addressObject.txrefs[j].value;

                addressInfoElement.txs[j] = tx;
              }
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
        .post(
          Blockchain.baseAddress +
            network +
            "/txs/push" +
            "?token=" +
            Blockchain.token,
          JSON.stringify({ tx })
        )
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
