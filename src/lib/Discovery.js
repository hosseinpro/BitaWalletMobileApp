"use strict";

import BitaWalletCard from "../lib/BitaWalletCard";
import Blockchain from "../lib/Blockchain";
import Coins from "../Coins";

export default class Discovery {
  static async run(coinInfoInit) {
    // Get initial copy of coinInfo
    let str = JSON.stringify(coinInfoInit);
    let coinInfo = JSON.parse(str);

    // Get xPubs for receiving and change addresses for BTC and TST
    try {
      let res;
      res = await global.bitaWalletCard.getXPub("6D2C000000");
      coinInfo.btc.receiveAddressXPub = res.xpub;
      res = await global.bitaWalletCard.getXPub("6D2C000001");
      coinInfo.btc.changeAddressXPub = res.xpub;
      res = await global.bitaWalletCard.getXPub("6D2C010000");
      coinInfo.tst.receiveAddressXPub = res.xpub;
      res = await global.bitaWalletCard.getXPub("6D2C010001");
      coinInfo.tst.changeAddressXPub = res.xpub;
    } catch (error) {
      throw new Error(error);
    }

    // Discover address on the Blockchain
    // BTC
    const addressInfoReceivingBtc = await Discovery.searchInBlockchain(
      BitaWalletCard.btcMain,
      false,
      coinInfo.btc.receiveAddressXPub
    );

    coinInfo.btc.receiveAddress = Discovery.calculateReceiveAddress(
      addressInfoReceivingBtc,
      coinInfo.btc.receiveAddressXPub,
      BitaWalletCard.btcMain
    );

    const addressInfoChangeBtc = await Discovery.searchInBlockchain(
      BitaWalletCard.btcMain,
      true,
      coinInfo.btc.changeAddressXPub
    );

    let firstUnusedKeyPath = Discovery.calculateChangeKeyPath(
      addressInfoChangeBtc
    );
    if (firstUnusedKeyPath === "")
      coinInfo.btc.changeKeyPath = "6D2C0000010000";
    else coinInfo.btc.changeKeyPath = firstUnusedKeyPath;

    coinInfo.btc.addressInfo = addressInfoReceivingBtc.concat(
      addressInfoChangeBtc
    );

    coinInfo.btc.balance = Discovery.calculateBalance(coinInfo.btc.addressInfo);

    //TST
    const addressInfoReceivingTst = await Discovery.searchInBlockchain(
      BitaWalletCard.btcTest,
      false,
      coinInfo.tst.receiveAddressXPub
    );

    coinInfo.tst.receiveAddress = Discovery.calculateReceiveAddress(
      addressInfoReceivingTst,
      coinInfo.tst.receiveAddressXPub,
      BitaWalletCard.btcTest
    );

    const addressInfoChangeTst = await Discovery.searchInBlockchain(
      BitaWalletCard.btcTest,
      true,
      coinInfo.tst.changeAddressXPub
    );

    firstUnusedKeyPath = Discovery.calculateChangeKeyPath(addressInfoChangeTst);
    if (firstUnusedKeyPath === "")
      coinInfo.tst.changeKeyPath = "6D2C0100010000";
    else coinInfo.tst.changeKeyPath = firstUnusedKeyPath;

    coinInfo.tst.addressInfo = addressInfoReceivingTst.concat(
      addressInfoChangeTst
    );

    coinInfo.tst.balance = Discovery.calculateBalance(coinInfo.tst.addressInfo);

    return coinInfo;
  }

  static async searchInBlockchain(coin, change, xpub) {
    let coinByte = "";
    let network = "";
    if (coin === Coins.BTC) {
      coinByte = "00";
      network = Blockchain.btcMain;
    } else {
      coinByte = "01";
      network = Blockchain.btcTest;
    }

    let changeByte = "";
    if (change === false) changeByte = "00";
    else changeByte = "01";

    let addressInfo = [];
    let k = 0;
    let stopDiscover = false;

    const chunkSize = 10;
    while (!stopDiscover) {
      let addressInfoChunk = [];

      for (let i = k; i < k + chunkSize; i++) {
        const address = BitaWalletCard.getChildAddress(coin, xpub, i);
        const keyPath =
          "6D2C" +
          coinByte +
          "00" +
          changeByte +
          BitaWalletCard.padHex(i.toString(16), 4);
        addressInfoChunk.push({ address, keyPath });
      }

      // await Discovery.timeout(1200); // temp

      let refinedAddressInfo = await Blockchain.getUnspentTxs(
        addressInfoChunk,
        network
      );

      if (refinedAddressInfo.length === 0) stopDiscover = true;
      else {
        for (let i = 0; i < refinedAddressInfo.length; i++)
          addressInfo.push(refinedAddressInfo[i]);
      }

      k += chunkSize;
    }

    return addressInfo;
  }

  // static timeout(ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }

  static calculateBalance(addressInfo) {
    let balance = 0;
    for (let i = 0; i < addressInfo.length; i++) {
      for (let j = 0; j < addressInfo[i].txs.length; j++) {
        if (addressInfo[i].txs[j].utxo !== -1)
          balance += addressInfo[i].txs[j].value;
      }
    }
    return balance;
  }

  static calculateChangeKeyPath(addressInfoChange) {
    if (addressInfoChange.length === 0) return "";
    const lastUsedKeyPath =
      addressInfoChange[addressInfoChange.length - 1].keyPath;
    const firstUnusedIndex = parseInt(lastUsedKeyPath.substr(10, 4), 16) + 1;
    const firstUnusedKeyPath =
      lastUsedKeyPath.substr(0, 10) +
      BitaWalletCard.padHex(firstUnusedIndex.toString(16), 4);
    return firstUnusedKeyPath;
  }

  static calculateReceiveAddress(addressInfoReceive, receiveAddressXPub, coin) {
    let firstUnusedIndex;
    if (addressInfoReceive.length === 0) firstUnusedIndex = 0;
    else {
      const lastUsedKeyPath =
        addressInfoReceive[addressInfoReceive.length - 1].keyPath;
      firstUnusedIndex = parseInt(lastUsedKeyPath.substr(10, 4), 16) + 1;
    }
    const firstUnusedAddress = BitaWalletCard.getChildAddress(
      coin,
      receiveAddressXPub,
      firstUnusedIndex
    );
    return firstUnusedAddress;
  }

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
