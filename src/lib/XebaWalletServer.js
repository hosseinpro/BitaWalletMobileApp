"use strict";

import axios from "axios";
import Coins from "../Coins";

export default class XebaWalletServer {
  static baseAddress = "http://api.xebawallet.com";

  static async discover(coin, xpubreceive, xpubchange) {
    let query = XebaWalletServer.baseAddress + "/discover?";

    if (coin === Coins.BTC) query += "coin=" + Coins.BTC;
    else if (coin === Coins.TST) query += "coin=" + Coins.TST;
    else throw "Not supported coin";

    query += "&xpubreceive=" + xpubreceive + "&xpubchange=" + xpubchange;

    let res = await axios.get(query);

    return res.data;
  }

  static async send(coin, tx) {
    let query = XebaWalletServer.baseAddress + "/send?";

    if (coin === Coins.BTC) query += "coin=" + Coins.BTC;
    else if (coin === Coins.TST) query += "coin=" + Coins.TST;
    else throw "Not supported coin";

    query += "&tx=" + tx;

    let res = await axios.get(query);

    return res.data;
  }

  static async gethistory(coin, xpubreceive, xpubchange) {
    let query = XebaWalletServer.baseAddress + "/gethistory?";

    if (coin === Coins.BTC) query += "coin=" + Coins.BTC;
    else if (coin === Coins.TST) query += "coin=" + Coins.TST;
    else throw "Not supported coin";

    query += "&xpubreceive=" + xpubreceive + "&xpubchange=" + xpubchange;

    let res = await axios.get(query);

    return res.data;
  }
}
