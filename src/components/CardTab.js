import React, { Component } from "react";
import { Image } from "react-native";
import {
  Content,
  Text,
  Button,
  List,
  ListItem,
  Left,
  Body,
  Thumbnail,
  Right
} from "native-base";
import { connect } from "react-redux";
import redux from "../redux/redux";
import NfcReader from "../lib/NfcReader";
import BitaWalletCard from "../lib/BitaWalletCard";
import AlertBox from "./AlertBox";
import XebaWalletServer from "../lib/XebaWalletServer";

class CardTab extends Component {
  constructor(props) {
    super(props);
    global.CardTab = this;
  }

  componentDidMount() {
    global.nfcReader = new NfcReader();
    global.bitaWalletCard = new BitaWalletCard(
      global.nfcReader.transmit.bind(this)
    );

    this.startCardDetect();
  }

  async startCardDetect() {
    global.waitModal.show();

    this.props.unsetCardInfo();

    try {
      const cardInfo = await global.tapCardModal.show(null, null, true);
      this.props.setCardInfo(cardInfo);

      // Get initial copy of coinInfo
      let str = JSON.stringify(this.props.coinInfo);
      let coinInfo = JSON.parse(str);

      // Get xPubs for receiving and change addresses for BTC and TST
      await global.bitaWalletCard.getXPubs(
        4,
        "6D2C000000" + "6D2C000001" + "6D2C010000" + "6D2C010001"
      );
      const pin = await global.pinModal.show();
      let res = await global.bitaWalletCard.verifyPIN(pin);
      const xpubLen = 97 * 2;
      coinInfo.btc.receiveAddressXPub = res.substr(0, xpubLen);
      coinInfo.btc.changeAddressXPub = res.substr(xpubLen, xpubLen);
      coinInfo.tst.receiveAddressXPub = res.substr(xpubLen * 2, xpubLen);
      coinInfo.tst.changeAddressXPub = res.substr(xpubLen * 3, xpubLen);

      // Discover address on the Blockchain
      // BTC
      let coinInfoElement = await XebaWalletServer.discover(
        Coins.BTC,
        coinInfo.btc.receiveAddressXPub,
        coinInfo.btc.changeAddressXPub
      );
      coinInfo.btc = {
        ...coinInfo.btc,
        ...coinInfoElement
      };
      // TST
      coinInfoElement = await XebaWalletServer.discover(
        Coins.TST,
        coinInfo.tst.receiveAddressXPub,
        coinInfo.tst.changeAddressXPub
      );
      coinInfo.tst = {
        ...coinInfo.tst,
        ...coinInfoElement
      };

      this.props.setCoinInfo(coinInfo);
      global.waitModal.hide();
    } catch (error) {
      if (error !== undefined && error.message === "Incorrect PIN")
        await AlertBox.info("Incorrect PIN", error.leftTries + " tries left.");
      console.log(error);
      this.startCardDetect();
    }
  }

  onPressDisconnect() {
    if (global.SendTab !== undefined) global.SendTab.reset();
    if (global.ReceiveTab !== undefined) global.ReceiveTab.reset();
    if (global.TransactionsTab !== undefined) global.TransactionsTab.reset();
    if (global.MoreTab !== undefined) global.MoreTab.reset();
    this.props.navigation.navigate("Card");

    this.startCardDetect();
  }

  render() {
    return (
      <Content contentContainerStyle={{ flex: 1 }}>
        <Content
          contentContainerStyle={{
            flex: 1,
            marginRight: 20
          }}
        >
          <List>
            <ListItem>
              <Content
                contentContainerStyle={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Image
                  source={require("../img/card.png")}
                  style={{ height: 200 }}
                />
              </Content>
            </ListItem>
            <ListItem avatar>
              <Left>
                <Thumbnail small source={require("../img/btc.png")} />
              </Left>
              <Body>
                <Text style={{ color: Colors.text }}>Bitcoin</Text>
                <Text note numberOfLines={1}>
                  BTC
                </Text>
              </Body>
              <Right>
                <Text style={{ color: Colors.text }}>
                  {BitaWalletCard.satoshi2btc(this.props.coinInfo.btc.balance)}
                </Text>
              </Right>
            </ListItem>
            <ListItem avatar>
              <Left>
                <Thumbnail small source={require("../img/btctest.png")} />
              </Left>
              <Body>
                <Text style={{ color: Colors.text }}>Bitcoin (Testnet)</Text>
                <Text note numberOfLines={1}>
                  BTC
                </Text>
              </Body>
              <Right>
                <Text style={{ color: Colors.text }}>
                  {BitaWalletCard.satoshi2btc(this.props.coinInfo.tst.balance)}
                </Text>
              </Right>
            </ListItem>
          </List>
        </Content>
        <Button
          rounded
          block
          style={{ backgroundColor: Colors.secondary, margin: 20 }}
          onPress={() => this.onPressDisconnect()}
        >
          <Text style={{ color: Colors.text }}>Disconnect</Text>
        </Button>
      </Content>
    );
  }
}

const mapStateToProps = state => {
  return {
    cardInfo: state.cardInfo,
    coinInfo: state.coinInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCardInfo: cardInfo => dispatch(redux.setCardInfo(cardInfo)),
    unsetCardInfo: () => dispatch(redux.unsetCardInfo()),
    setCoinInfo: coinInfo => dispatch(redux.setCoinInfo(coinInfo))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardTab);
