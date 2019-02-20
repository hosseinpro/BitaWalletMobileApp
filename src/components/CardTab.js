import React, { Component } from "react";
import { Image } from "react-native";
import { Content, Text, Button } from "native-base";
import { connect } from "react-redux";
import redux from "../redux/redux";
import NfcReader from "../lib/NfcReader";
import BitaWalletCard from "../lib/BitaWalletCard";
import AlertBox from "./AlertBox";
import Blockchain from "../lib/Blockchain";

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

        let addressInfo = {};
        this.fillAddressInfo("btc")
          .then(btcAddressInfo => {
            addressInfo.btc = btcAddressInfo;
            this.fillAddressInfo("tst").then(tstAddressInfo => {
              addressInfo.tst = tstAddressInfo;
            });
          })
          .catch(error => console.log(error))
          .finally(() => {
            this.props.setAddressInfo(addressInfo);
            console.log(addressInfo);
          });
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

  fillAddressInfo(coin) {
    return new Promise((resolve, reject) => {
      let baseKeyPath = "";
      if (coin === "btc")
        baseKeyPath = "6D2C" + BitaWalletCard.btcMain + "00000000";
      else baseKeyPath = "6D2C" + BitaWalletCard.btcTest + "00000000";

      global.bitaWalletCard
        .getAddressList(baseKeyPath, 2)
        .then(res => {
          let network = "";
          if (coin === "btc") network = Blockchain.btcMain;
          else network = Blockchain.btcTest;

          Blockchain.getAddressHistory(res.addressInfo, network)
            .then(addressInfo => {
              let x = {};
              x.addressList = addressInfo;
              if (coin === "btc")
                x.changeKeyPath = "6D2C" + BitaWalletCard.btcMain + "00010000";
              else
                x.changeKeyPath = "6D2C" + BitaWalletCard.btcTest + "00010000";

              resolve(x);

              // this.props.setAddressInfo(addressInfo);

              // this.props.setChangeKey("6D2C0100010000");
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
            alignItems: "center"
          }}
        >
          <Text style={{ fontSize: 16, color: Colors.text }}>
            {this.props.cardInfo.serialNumber}
          </Text>
          <Text
            style={{ fontSize: 20, fontWeight: "bold", color: Colors.text }}
          >
            {this.props.cardInfo.label}
          </Text>
          <Image
            source={require("../img/card.png")}
            style={{ width: 350, height: 230 }}
          />
          <Text style={{ fontSize: 20, color: Colors.text }}>{2.5} BTC</Text>
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
    cardInfo: state.cardInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCardInfo: cardInfo => dispatch(redux.setCardInfo(cardInfo)),
    unsetCardInfo: () => dispatch(redux.unsetCardInfo()),
    setCardPin: pin => dispatch(redux.setCardPin(pin)),
    setAddressInfo: addressInfo => dispatch(redux.setAddressInfo(addressInfo)),
    setChangeKey: changeKey => dispatch(redux.setChangeKey(changeKey))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardTab);
