import React, { Component } from "react";
import { Image } from "react-native";
import { Content, Text, Button } from "native-base";
import { connect } from "react-redux";
import redux from "../redux/redux";
import AlertBox from "./AlertBox";
import NfcReader from "../lib/NfcReader";

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

  onPressDisconnect() {
    this.startCardDetect();
  }

  render() {
    return (
      <Content contentContainerStyle={{ flex: 1 }}>
        <Content
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            marginLeft: 20,
            marginRight: 20
          }}
        >
          <Text style={{ fontSize: 16 }}>
            {this.props.cardInfo.serialNumber}
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {this.props.cardInfo.label}
          </Text>
          <Image
            source={require("../img/card.png")}
            style={{ width: 350, height: 230 }}
          />
          <Text style={{ fontSize: 20 }}>{2.5} BTC</Text>
        </Content>
        <Button
          rounded
          block
          primary
          style={{ margin: 20 }}
          onPress={() => this.onPressDisconnect()}
        >
          <Text>Disconnect</Text>
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
    setCardPin: pin => dispatch(redux.setCardPin(pin))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardTab);
