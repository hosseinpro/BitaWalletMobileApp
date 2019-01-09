import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import BitaWalletCard from "./src/BitaWalletCard";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supported: false,
      enabled: false,
      isTestRunning: false,
      tag: null,
      bitaWalletCard: null
    };
  }

  componentDidMount() {
    NfcManager.isSupported().then(supported => {
      this.setState({ supported });
      if (supported) {
        const bitaWalletCard = new BitaWalletCard(this.transmit.bind(this));
        this.setState({ bitaWalletCard });
        this._startNfc();
      }
    });
  }

  transmit(commandAPDU) {
    return new Promise((resolve, reject) => {
      commandAPDU = commandAPDU.toUpperCase().replace(/\s/g, "");
      // is connected
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

  _startNfc = () => {
    NfcManager.start()
      .then(() => NfcManager.isEnabled())
      .then(() => NfcManager.registerTagEvent())
      .then(() => NfcManager.requestTechnology(NfcTech.IsoDep))
      .then(() => NfcManager.getTag())
      .then(() => this.test())
      .then(() => NfcManager.closeTechnology())
      .then(() => NfcManager.unregisterTagEvent())
      .catch(err => {
        console.warn(err);
        this.setState({ enabled: false });
      });
  };

  test() {
    this.state.bitaWalletCard
      .selectApplet()
      .then(() => console.log("Applet selected"))
      .catch(error => console.log("Error:" + error.message));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>My first app!</Text>
        <Button onPress={() => this._startNfc()} title="Test" color="#841584" />
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
