"use strict";

import axios from "axios";

export default class Blockchain {
  static baseAddressBtcMain = "https://insight.bitpay.com/api";
  static baseAddressBtcTest = "https://test-insight.bitpay.com/api";

  static btcMain = "mainnet";
  static btcTest = "testnet";

  static getUnspentTxs(addressInfo, network) {
    let baseAddress = "";
    if (network === Blockchain.btcMain)
      baseAddress = Blockchain.baseAddressBtcMain;
    else baseAddress = Blockchain.baseAddressBtcTest;

    let addresses = "";
    for (let i = 0; i < addressInfo.length; i++) {
      addresses += addressInfo[i].address;
      if (i < addressInfo.length - 1) addresses += ",";
    }

    return new Promise((resolve, reject) => {
      axios
        .get(baseAddress + "/addrs/" + addresses + "/utxo")
        .then(res => {
          let addressInfo2 = [];
          for (let i = 0; i < addressInfo.length; i++) {
            let addressInfoElement = addressInfo[i];

            let transactions = res.data.filter(
              transaction => transaction.address === addressInfoElement.address
            );

            // if (transactions === undefined) continue;
            if (transactions.length === 0) continue;

            addressInfoElement.txs = [];

            for (let j = 0; j < transactions.length; j++) {
              let tx = {};
              tx.txHash = transactions[j].txid;
              tx.utxo = transactions[j].vout;
              tx.value = transactions[j].satoshis;

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

  static getTxs(addressInfo, network) {
    let baseAddress = "";
    if (network === Blockchain.btcMain)
      baseAddress = Blockchain.baseAddressBtcMain;
    else baseAddress = Blockchain.baseAddressBtcTest;

    let addresses = "";
    for (let i = 0; i < addressInfo.length; i++) {
      addresses += addressInfo[i].address;
      if (i < addressInfo.length - 1) addresses += ",";
    }

    return new Promise((resolve, reject) => {
      axios
        .get(baseAddress + "/addrs/" + addresses + "/txs")
        .then(res => {
          let txs = [];

          for (let i = 0; i < res.data.items.length; i++) {
            let tx = {};
            tx.txHash = res.data.items[i].txid;
            // tx.utxo = res.data.items[i].vout;
            // tx.value = res.data.items[i].satoshis;

            txs[i] = tx;
          }

          resolve(txs);

          // let addressInfo2 = [];
          // for (let i = 0; i < addressInfo.length; i++) {
          //   let addressInfoElement = addressInfo[i];

          //   let transactions = res.data.filter(
          //     transaction => transaction.address === addressInfoElement.address
          //   );

          //   // if (transactions === undefined) continue;
          //   if (transactions.length === 0) continue;

          //   addressInfoElement.txs = [];

          //   for (let j = 0; j < transactions.length; j++) {
          //     let tx = {};
          //     tx.txHash = transactions[j].txid;
          //     tx.utxo = transactions[j].vout;
          //     tx.value = transactions[j].satoshis;

          //     addressInfoElement.txs[j] = tx;
          //   }

          //   addressInfo2.push(addressInfoElement);
          // }

          // resolve(addressInfo2);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  static pushTx(tx, network) {
    let baseAddress = "";
    if (network === Blockchain.btcMain)
      baseAddress = Blockchain.baseAddressBtcMain;
    else baseAddress = Blockchain.baseAddressBtcTest;

    return new Promise((resolve, reject) => {
      axios
        .post(baseAddress + "/tx/send", { rawtx: tx })
        .then(res => {
          resolve(res.data.txid);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
