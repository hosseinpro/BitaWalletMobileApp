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
import Discovery from "../lib/Discovery";

class CardTab extends Component {
  componentDidMount() {
    global.nfcReader = new NfcReader();
    global.bitaWalletCard = new BitaWalletCard(
      global.nfcReader.transmit.bind(this)
    );

    this.startCardDetect();
  }

  startCardDetect() {
    global.waitModal.show();

    this.props.unsetCardInfo();

    global.tapCardModal.show(
      null,
      null,
      this.cardDetected.bind(this),
      null,
      this.onWipe.bind(this)
    );
  }

  onWipe() {
    global.wipeModal.show(
      null,
      true,
      this.startCardDetect.bind(this),
      this.startCardDetect.bind(this)
    );
  }

  cardDetected(cardInfo) {
    this.setState({ cardInfo });
    global.passwordModal.show(
      "Enter Card Passcode",
      this.pinEntered.bind(this),
      this.startCardDetect.bind(this)
    );
  }

  async pinEntered(pin) {
    try {
      await global.bitaWalletCard.verifyPIN(pin);
    } catch (res) {
      if (res.leftTries !== undefined) {
        AlertBox.info(
          "Incorrect Password",
          res.leftTries + " tries left.",
          this.startCardDetect.bind(this)
        );
      } else {
        this.startCardDetect();
      }
      return;
    }

    this.props.setCardInfo(this.state.cardInfo);
    this.props.setCardPin(pin);

    try {
      const coinInfo = await Discovery.run(this.props.coinInfo);

      this.props.setCoinInfo(coinInfo);
      global.waitModal.hide();
    } catch (error) {
      AlertBox.info(
        "Address Error",
        "Card is not wiped.",
        this.startCardDetect.bind(this)
      );
    }
  }

  onPressDisconnect() {
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
    setCardPin: pin => dispatch(redux.setCardPin(pin)),
    setCoinInfo: coinInfo => dispatch(redux.setCoinInfo(coinInfo))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardTab);
