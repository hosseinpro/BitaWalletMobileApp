import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import BitaWalletCard from "./BitaWalletCard";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supported: false,
      bitaWalletCard: null,
      cardInfo: {}
    };
  }

  componentDidMount() {
    NfcManager.isSupported().then(supported => {
      this.setState({ supported });
      if (supported) {
        const bitaWalletCard = new BitaWalletCard(this.transmit.bind(this));
        this.setState({ bitaWalletCard });
      }
    });
  }

  transmit(commandAPDU) {
    return new Promise((resolve, reject) => {
      commandAPDU = commandAPDU.toUpperCase().replace(/\s/g, "");
      // is connected?
      let inBuffer = BitaWalletCard.hex2Bytes(commandAPDU);
      NfcManager.transceive(inBuffer)
        .then(outBuffer => {
          const responseAPDU = BitaWalletCard.bytes2Hex(outBuffer);
          resolve(responseAPDU);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  cardDetection = eventFunction => {
    NfcManager.start()
      .then(() => NfcManager.isEnabled())
      .then(() => NfcManager.closeTechnology())
      .then(() => NfcManager.unregisterTagEvent())
      .then(() => NfcManager.registerTagEvent())
      .then(() => NfcManager.requestTechnology(NfcTech.IsoDep))
      .then(() => NfcManager.getTag())
      .then(() => this.getCardInfo())
      .then(() => eventFunction())
      .then(() => NfcManager.closeTechnology())
      .then(() => NfcManager.unregisterTagEvent())
      .catch(err => {
        console.warn(err);
        this.setState({ enabled: false });
      });
  };

  getCardInfo() {
    let cardInfo = {};
    this.state.bitaWalletCard
      .selectApplet()
      .then(
        this.state.bitaWalletCard
          .getSerialNumber()
          .then(res => (cardInfo.serialNumber = res.serialNumber))
          .then(
            this.state.bitaWalletCard
              .getVersion()
              .then(res => {
                cardInfo.type = res.type;
                cardInfo.version = res.version;
              })
              .then(
                this.state.bitaWalletCard
                  .getLabel()
                  .then(res => (cardInfo.label = res.label))
                  .then(() => this.setState({ cardInfo }))
              )
          )
      )
      .catch(error => console.log(error));
  }

  cardVerifyPIN() {
    this.state.bitaWalletCard
      .verifyPIN("1234")
      .then(() => {
        console.log("PIN verified");
        console.log(this.state.cardInfo);
      })
      .catch(error => console.log("Error:" + error.message));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>My first app!</Text>
        <Button
          onPress={() => this.cardDetection(this.cardVerifyPIN.bind(this))}
          title="cardVerifyPIN"
          color="#841584"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
