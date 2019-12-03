"use strict";

import axios from "axios";
import BitaWalletCard from "../lib/BitaWalletCard";

export default class Blockchain {
  // static baseAddressBtcMain = "https://insight.bitpay.com/api";
  // static baseAddressBtcTest = "https://test-insight.bitpay.com/api";
  static baseAddressBtcMain = "https://blockexplorer.com/api";
  static baseAddressBtcTest = "https://testnet.blockexplorer.com/api";

  static btcMain = "mainnet";
  static btcTest = "testnet";

  static async getTxs(addressArray, network) {
    let baseAddress = "";
    if (network === Blockchain.btcMain)
      baseAddress = Blockchain.baseAddressBtcMain;
    else baseAddress = Blockchain.baseAddressBtcTest;

    let addresses = "";
    for (let i = 0; i < addressArray.length; i++) {
      addresses += addressArray[i];
      if (i < addressArray.length - 1) addresses += ",";
    }

    let res = await axios.get(
      baseAddress + "/addrs/" + addresses + "/txs?from=0&to=20"
    );
    let txs = [];

    for (let i = 0; i < res.data.items.length; i++) {
      let tx = {};
      tx.txHash = res.data.items[i].txid;
      tx.time = new Date(res.data.items[i].time * 1000);

      tx.in = [];
      for (let j = 0; j < res.data.items[i].vin.length; j++) {
        const address = res.data.items[i].vin[j].addr;
        const my =
          addressArray.filter(myAddress => myAddress === address).length > 0;
        const value = res.data.items[i].vin[j].valueSat;
        tx.in[j] = { address, my, value };
      }

      tx.out = [];
      for (let j = 0; j < res.data.items[i].vout.length; j++) {
        const address = "";
        const my = false;
        if (res.data.items[i].vout[j].scriptPubKey.addresses !== undefined) {
          address = res.data.items[i].vout[j].scriptPubKey.addresses[0];
          my =
            addressArray.filter(myAddress => myAddress === address).length > 0;
        }
        const value = BitaWalletCard.btc2satoshi(
          parseFloat(res.data.items[i].vout[j].value)
        );
        tx.out[j] = { address, my, value };
      }

      if (tx.in[0].my === true) {
        tx.send = true;
        const receiver = tx.out.filter(o => o.my === false)[0];
        tx.value = receiver.value;
        tx.to = receiver.address;
      } else {
        tx.receive = true;
        tx.from = [];
        for (let j = 0; j < tx.in.length; j++) tx.from[j] = tx.in[j].address;
        tx.value = 0;
        for (let j = 0; j < tx.out.length; j++)
          if (tx.out[j].my === true) tx.value += tx.out[j].value;
      }

      txs[i] = tx;
    }

    return txs;
  }

  static async pushTx(tx, network) {
    let baseAddress = "";
    if (network === Blockchain.btcMain)
      baseAddress = Blockchain.baseAddressBtcMain;
    else baseAddress = Blockchain.baseAddressBtcTest;

    let res = await axios.post(baseAddress + "/tx/send", { rawtx: tx });
    return res.data.txid;
  }
}
