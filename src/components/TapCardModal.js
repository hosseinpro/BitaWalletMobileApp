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
    onWipe: null,
    error: false
  };

  // onCancel or onWipe should be not null logically
  async show(message, cardInfo, onComplete, onCancel = null, onWipe = null) {
    let showWipe = false;
    if (onWipe !== null) {
      showWipe = true;
    }
    this.setState({
      showWipe,
      message,
      cardInfo,
      onComplete,
      onCancel,
      onWipe
    });

    if (cardInfo !== null) {
      try {
        let res = await global.bitaWalletCard.getSerialNumber();
        if (cardInfo.serialNumber === res.serialNumber) {
          this.state.onComplete(cardInfo);
        } else {
          this.show2();
        }
      } catch (error) {
        this.show2();
      }
    } else {
      this.show2();
    }
  }

  show2() {
    this.setState({ visible: true });
    global.nfcReader.enableCardDetection(this.cardDetected.bind(this));
  }

  async cardDetected() {
    try {
      let cardInfo = await this.getCardInfo();
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

  async getCardInfo() {
    let cardInfo = {};
    await global.bitaWalletCard.selectApplet();
    let res = await global.bitaWalletCard.getSerialNumber();
    cardInfo.serialNumber = res.serialNumber;
    res = await global.bitaWalletCard.getVersion();
    cardInfo.type = res.type;
    cardInfo.version = res.version;
    res = await global.bitaWalletCard.getLabel();
    cardInfo.label = res.label;
    this.cardInfo = cardInfo;
    return cardInfo;
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
                global.nfcReader.disableCardDetection();
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
              onPress={() => {
                global.nfcReader.disableCardDetection();
                this.setState({ visible: false });
                if (this.state.onCancel !== null) {
                  this.state.onCancel();
                }
              }}
            >
              <Text style={{ color: Colors.text }}>Cancel</Text>
            </Button>
          )}
        </Content>
      </Modal>
    );
  }
}
