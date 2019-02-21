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
import Blockchain from "../lib/Blockchain";
import Coins from "../Coins";

class CardTab extends Component {
  componentDidMount() {
    global.nfcReader = new NfcReader();
    global.bitaWalletCard = new BitaWalletCard(
      global.nfcReader.transmit.bind(this)
    );

    this.startCardDetect();
  }

  startCardDetect() {
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

  pinEntered(pin) {
    global.bitaWalletCard
      .verifyPIN(pin)
      .then(() => {
        this.props.setCardInfo(this.state.cardInfo);
        this.props.setCardPin(pin);

        let coinInfo = {};
        this.fillCoinInfo(Coins.BTC)
          .then(coinInfoElement => {
            coinInfo.btc = coinInfoElement;
            this.fillCoinInfo(Coins.TST).then(coinInfoElement => {
              coinInfo.tst = coinInfoElement;

              this.props.setCoinInfo(coinInfo);
              console.log(coinInfo);
            });
          })
          .catch(error => console.log(error));
      })
      .catch(res => {
        if (res.leftTries !== undefined) {
          AlertBox.info(
            "Incorrect Password",
            res.leftTries + " tries left.",
            this.startCardDetect.bind(this)
          );
        } else {
          this.startCardDetect();
        }
      });
  }

  fillCoinInfo(coin) {
    return new Promise((resolve, reject) => {
      let baseKeyPath = "";
      if (coin === Coins.BTC)
        baseKeyPath = "6D2C" + BitaWalletCard.btcMain + "00000000";
      else baseKeyPath = "6D2C" + BitaWalletCard.btcTest + "00000000";

      global.bitaWalletCard
        .getAddressList(baseKeyPath, 2)
        .then(res => {
          let network = "";
          if (coin === Coins.BTC) network = Blockchain.btcMain;
          else network = Blockchain.btcTest;

          Blockchain.getAddressHistory(res.addressInfo, network)
            .then(addressInfo => {
              let coinInfoElement = {};
              coinInfoElement.addressInfo = addressInfo;

              let balance = 0;
              for (let i = 0; i < addressInfo.length; i++) {
                for (let j = 0; j < addressInfo[i].txs.length; j++) {
                  balance += addressInfo[i].txs[j].value;
                }
              }
              coinInfoElement.balance = balance;

              if (coin === Coins.BTC)
                coinInfoElement.changeKeyPath =
                  "6D2C" + BitaWalletCard.btcMain + "00010000";
              else
                coinInfoElement.changeKeyPath =
                  "6D2C" + BitaWalletCard.btcTest + "00010000";

              // temporary
              if (coinInfoElement.addressInfo.length !== 0) {
                coinInfoElement.receiveAddress =
                  coinInfoElement.addressInfo[0].address;
              } else {
                coinInfoElement.receiveAddress =
                  "0000000000000000000000000000000000";
              }

              resolve(coinInfoElement);
            })
            .catch(error => reject(error));
        })
        .catch(error => reject(error));
    });
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
                  {Blockchain.satoshi2btc(this.props.coinInfo.btc.balance)}
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
                  {Blockchain.satoshi2btc(this.props.coinInfo.tst.balance)}
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
