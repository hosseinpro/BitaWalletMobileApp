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
    onCancel: null,
    error: false
  };

  show(message, cardInfo, showWipe) {
    return new Promise(async (resolve, reject) => {
      this.setState({
        showWipe,
        message,
        cardInfo,
        onComplete: cardInfo => {
          resolve(cardInfo);
        },
        onCancel: () => {
          reject(new Error("Cancel"));
        },
        error: false
      });

      try {
        let res = await global.bitaWalletCard.getInfo();
        if (cardInfo.serialNumber === res.serialNumber) {
          this.state.onComplete(cardInfo);
          return;
        }
      } catch {}

      this.setState({ visible: true });
      global.nfcReader.enableCardDetection(this.cardDetected.bind(this));
    });
  }

  async onPressWipe() {
    global.nfcReader.disableCardDetection();
    this.setState({ visible: false });

    try {
      await global.wipeModal.show(null, "m");
    } catch {}

    this.setState({ visible: true });
    global.nfcReader.enableCardDetection(this.cardDetected.bind(this));
  }

  async onPressCancel() {
    global.nfcReader.disableCardDetection();
    this.setState({ visible: false });
    this.state.onCancel();
  }

  async cardDetected() {
    try {
      let res = await global.bitaWalletCard.getInfo();
      let cardInfo = {};
      cardInfo.serialNumber = res.serialNumber;
      cardInfo.type = "";
      cardInfo.version = res.version;
      cardInfo.label = res.label;

      if (
        this.state.cardInfo !== null &&
        this.state.cardInfo.serialNumber !== cardInfo.serialNumber
      ) {
        this.setState({ error: true });
        global.nfcReader.enableCardDetection(this.cardDetected.bind(this));
        return;
      }

      this.setState({ visible: false });
      this.state.onComplete(cardInfo);
    } catch (error) {
      console.log(error);
      global.nfcReader.enableCardDetection(this.cardDetected.bind(this));
    }
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
              onPress={() => this.onPressWipe()}
            >
              <Text style={{ color: Colors.text }}>Wipe</Text>
            </Button>
          )}
          {!this.state.showWipe && (
            <Button
              rounded
              block
              style={{ backgroundColor: Colors.secondary, margin: 20 }}
              onPress={() => this.onPressCancel()}
            >
              <Text style={{ color: Colors.text }}>Cancel</Text>
            </Button>
          )}
        </Content>
      </Modal>
    );
  }
}
