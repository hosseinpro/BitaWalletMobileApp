"use strict";

import BitaWalletCard from "../lib/BitaWalletCard";
import Blockchain from "../lib/Blockchain";
import Coins from "../Coins";
import XebaWalletServer from "../lib/XebaWalletServer";

export default class Discovery {
  static async getTransactionHistory(coinInfoElement, coin) {
    let addressArray = [];
    for (let i = 0; i < 20; i++) {
      const address = BitaWalletCard.getChildAddress(
        coin,
        coinInfoElement.receiveAddressXPub,
        i
      );
      addressArray.push(address);
    }
    for (let i = 0; i < 20; i++) {
      const address = BitaWalletCard.getChildAddress(
        coin,
        coinInfoElement.changeAddressXPub,
        i
      );
      addressArray.push(address);
    }

    let network = "";
    if (coin === Coins.BTC) network = Blockchain.btcMain;
    else network = Blockchain.btcTest;

    const txs = await Blockchain.getTxs(addressArray, network);

    return txs;
  }
}
