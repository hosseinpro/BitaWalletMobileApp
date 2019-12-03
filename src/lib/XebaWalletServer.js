"use strict";

import axios from "axios";
import Coins from "../Coins";

export default class XebaWalletServer {
  static baseAddress = "http://api.xebawallet.com/";

  static async discover(coin, xpubreceive, xpubchange) {
    let query = XebaWalletServer.baseAddress + "discover?";

    if (coin === Coins.BTC) query += "coin=" + Coins.BTC;
    else if (coin === Coins.TST) query += "coin=" + Coins.TST;
    else throw "Not supported coin";

    query += "&xpubreceive=" + xpubreceive + "&xpubchange=" + xpubchange;

    let res = await axios.get(query);

    return res.data;
  }
}
