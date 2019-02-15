import React, { Component } from "react";
import { Modal, Image } from "react-native";
import { Content, Text, Button, Header } from "native-base";

export default class TabCardModal extends Component {
  state = {
    visible: false,
    message: null,
    cardInfo: null,
    showWipe: false,
    onComplete: null,
    onWipe: null,
    error: false
  };

  show(message, cardInfo, onComplete, onWipe = null) {
    let showWipe = false;
    if (onWipe !== null) {
      showWipe = true;
    }
    this.setState({
      visible: true,
      showWipe,
      message,
      cardInfo,
      onComplete,
      onWipe
    });
    global.nfcReader.cardDetection(this.cardDetected.bind(this));
  }

  cardDetected() {
    this.getCardInfo()
      .then(cardInfo => {
        if (
          this.state.cardInfo !== null &&
          this.state.cardInfo.serialNumber !== cardInfo.serialNumber
        ) {
          this.setState({ error: true });
          global.nfcReader.cardDetection(this.cardDetected.bind(this));
          return;
        }

        this.setState({ visible: false });
        this.state.onComplete(cardInfo);
      })
      .catch(error => {
        global.nfcReader.cardDetection(this.cardDetected.bind(this));
      });
  }

  getCardInfo() {
    return new Promise((resolve, reject) => {
      let cardInfo = {};
      global.bitaWalletCard
        .selectApplet()
        .then(() =>
          global.bitaWalletCard
            .getSerialNumber()
            .then(res => (cardInfo.serialNumber = res.serialNumber))
            .then(() =>
              global.bitaWalletCard
                .getVersion()
                .then(res => {
                  cardInfo.type = res.type;
                  cardInfo.version = res.version;
                })
                .then(() =>
                  global.bitaWalletCard
                    .getLabel()
                    .then(res => (cardInfo.label = res.label))
                    .then(() => (this.cardInfo = cardInfo))
                    .then(() => resolve(cardInfo))
                )
            )
        )
        .catch(error => {
          reject(error);
        });
    });
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.visible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <Header
          androidStatusBarColor={Colors.primaryDark}
          style={{ display: "none" }}
        />
        <Content
          contentContainerStyle={{
            flex: 1,
            backgroundColor: Colors.primary
          }}
        >
          <Content
            contentContainerStyle={{
              flex: 1,
              marginTop: 20,
              alignItems: "center"
            }}
          >
            <Image
              source={require("../img/card.png")}
              style={{ width: 350, height: 230 }}
            />
            <Text style={{ fontSize: 30, color: Colors.primaryText }}>
              {this.state.message !== null
                ? this.state.message
                : "tap your card"}
            </Text>
            <Text style={{ fontSize: 20, color: Colors.primaryText }}>
              {this.state.cardInfo !== null ? this.state.cardInfo.label : ""}
            </Text>
            <Text style={{ fontSize: 16, color: Colors.primaryText }}>
              {this.state.cardInfo !== null
                ? this.state.cardInfo.serialNumber
                : ""}
            </Text>
            <Text style={{ fontSize: 20, color: Colors.secondary }}>
              {this.state.error ? "tap correct card" : ""}
            </Text>
          </Content>
          {this.state.showWipe && (
            <Button
              rounded
              block
              style={{ backgroundColor: Colors.secondary, margin: 20 }}
              onPress={() => {
                this.setState({ visible: false });
                this.state.onWipe();
              }}
            >
              <Text style={{ color: Colors.text }}>Wipe</Text>
            </Button>
          )}
          {!this.state.showWipe && (
            <Button
              rounded
              block
              style={{ backgroundColor: Colors.secondary, margin: 20 }}
              onPress={() => this.setState({ visible: false })}
            >
              <Text style={{ color: Colors.text }}>Cancel</Text>
            </Button>
          )}
        </Content>
      </Modal>
    );
  }
}
