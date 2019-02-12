import React, { Component } from "react";
import { Image } from "react-native";
import { Content, Text, Button } from "native-base";
import { connect } from "react-redux";
import redux from "../redux/redux";
import NfcReader from "../lib/NfcReader";
import AlertBox from "./AlertBox";

class CardTab extends Component {
  componentDidMount() {
    const nfcReader = new NfcReader();
    nfcReader.isSupported().then(supported => {
      if (supported) {
        this.props.setNfcReader(nfcReader);
        this.startCardDetect();
      }
    });
    // setTimeout(this.startCardDetect.bind(this), 100);
  }

  startCardDetect() {
    this.props.unsetCardInfo();
    global.tapCardModal.show(null, null, true, this.cardDetected.bind(this));
  }

  cardDetected(cardInfo) {
    global.passwordModal.show(
      "Enter Card Passcode",
      this.pinEntered.bind(this)
    );
  }

  pinEntered(pin) {
    this.props.nfcReader.bitaWalletCard
      .verifyPIN(pin)
      .then(() => {
        this.props.setCardInfo(this.props.nfcReader.cardInfo);
        this.props.setCardPin(pin);
        this.fillAddressInfo();
      })
      .catch(leftTries => {
        AlertBox.info(
          "Incorrect Password",
          "You have " + leftTries + " tries left.",
          this.cardDetected.bind(this)
        );
      });
    // .finally(() => this.props.nfcReader.disconnectCard());
  }

  fillAddressInfo() {
    this.props.nfcReader.bitaWalletCard
      .getAddressList("6D2C0000000000", 1)
      .then(res => {
        let addressInfo = res.addressInfo;
        addressInfo[0].txs = [];
        let tx = {};
        tx.txHash =
          "a896270a198aa2146cdec81d18bc1fd358d4355f8d21be8e5335fae22c09244e";
        tx.utxo = "0";
        tx.value = "100000000";
        addressInfo[0].txs[0] = tx;
        this.props.setAddressInfo(addressInfo);
        this.props.setChangeKey("6D2C0100010000");
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
    nfcReader: state.nfcReader,
    cardInfo: state.cardInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setNfcReader: nfcReader => dispatch(redux.setNfcReader(nfcReader)),
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
