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

  pinEntered(pin) {
    global.bitaWalletCard
      .verifyPIN(pin)
      .then(() => {
        this.props.setCardInfo(this.state.cardInfo);
        this.props.setCardPin(pin);

        this.fillCoinInfoCard()
          .then(coinInfo => {
            this.fillCoinInfoBlockchain(Coins.BTC, coinInfo.btc)
              .then(coinInfoBtc =>
                setTimeout(() => {
                  this.fillCoinInfoBlockchain(Coins.TST, coinInfo.tst)
                    .then(coinInfoTst => {
                      const coinInfo = { btc: coinInfoBtc, tst: coinInfoTst };
                      this.props.setCoinInfo(coinInfo);
                      global.waitModal.hide();
                      console.log(coinInfo);
                    })
                    .catch(error => this.startCardDetect());
                }, 1000)
              )
              .catch(error => this.startCardDetect());
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

  fillCoinInfoCard() {
    return new Promise((resolve, reject) => {
      let coinInfo = {};

      let baseKeyPath = "6D2C" + BitaWalletCard.btcMain + "00000000";
      global.bitaWalletCard
        .getAddressList(baseKeyPath, 2)
        .then(res => {
          coinInfo.btc = {};
          coinInfo.btc.addressInfo = res.addressInfo;

          baseKeyPath = "6D2C" + BitaWalletCard.btcTest + "00000000";
          global.bitaWalletCard.getAddressList(baseKeyPath, 2).then(res => {
            coinInfo.tst = {};
            coinInfo.tst.addressInfo = res.addressInfo;

            resolve(coinInfo);
            console.log(coinInfo);
          });
        })
        .catch(error => reject(error));
    });
  }

  fillCoinInfoBlockchain(coin, coinInfoElement) {
    return new Promise((resolve, reject) => {
      let network = "";
      if (coin === Coins.BTC) network = Blockchain.btcMain;
      else network = Blockchain.btcTest;

      Blockchain.getAddressHistory(coinInfoElement.addressInfo, network)
        .then(addressInfo => {
          let coinInfoElement2 = {};
          coinInfoElement2.addressInfo = addressInfo;

          let balance = 0;
          for (let i = 0; i < addressInfo.length; i++) {
            for (let j = 0; j < addressInfo[i].txs.length; j++) {
              balance += addressInfo[i].txs[j].value;
            }
          }
          coinInfoElement2.balance = balance;

          if (coin === Coins.BTC)
            coinInfoElement2.changeKeyPath =
              "6D2C" + BitaWalletCard.btcMain + "00010000";
          else
            coinInfoElement2.changeKeyPath =
              "6D2C" + BitaWalletCard.btcTest + "00010000";

          // temporary
          if (coinInfoElement2.addressInfo.length !== 0) {
            coinInfoElement2.receiveAddress =
              coinInfoElement2.addressInfo[0].address;
          } else {
            coinInfoElement2.receiveAddress =
              "0000000000000000000000000000000000";
          }

          resolve(coinInfoElement2);
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
