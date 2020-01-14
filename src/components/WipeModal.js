import React, { Component } from "react";
import { Modal } from "react-native";
import {
  Content,
  Text,
  Button,
  Header,
  Item,
  Input,
  Form,
  Label
} from "native-base";
import AlertBox from "./AlertBox";

export default class WipeModal extends Component {
  state = {
    visible: false,
    newLabel: "",
    cardInfo: null,
    onComplete: null,
    onCancel: null,
    wipeMode: "m"
  };

  show(cardInfo, wipeMode) {
    return new Promise((resolve, reject) => {
      this.setState({
        visible: true,
        cardInfo,
        wipeMode,
        onComplete: () => resolve(),
        onCancel: () => reject()
      });
    });
  }

  async onPressWipe() {
    if (this.state.newLabel === "") {
      await AlertBox.info("Wipe", "Please enter a label");
    } else {
      await global.tapCardModal.show(null, this.state.cardInfo);
      try {
        await global.bitaWalletCard.wipe(
          this.state.wipeMode,
          this.state.newLabel
        );
        let pin = await global.pinModal.show();
        await global.bitaWalletCard.verifyPIN(pin);
        pin = await global.pinModal.show();
        await global.bitaWalletCard.setPIN(pin);
        pin = await global.pinModal.show();
        await global.bitaWalletCard.setPIN(pin);
        await AlertBox.info("Wipe", "Wallet is wiped successfully");
      } catch (error) {
        global.bitaWalletCard.cancel();
        console.log(error);
      }
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
              alignItems: "center",
              marginLeft: 20,
              marginRight: 20
            }}
          >
            <Form style={{ width: "100%" }}>
              <Item>
                <Label style={{ color: Colors.primaryText }}>New Label</Label>
                <Input
                  style={{ color: Colors.secondary }}
                  maxLength={50}
                  onChangeText={newLabel => this.setState({ newLabel })}
                />
              </Item>
            </Form>
          </Content>
          <Button
            rounded
            block
            style={{
              backgroundColor: Colors.secondary,
              marginTop: 20,
              marginLeft: 20,
              marginRight: 20
            }}
            onPress={() => this.onPressWipe()}
          >
            <Text style={{ color: Colors.text }}>Wipe</Text>
          </Button>
          <Button
            rounded
            block
            style={{ backgroundColor: Colors.secondary, margin: 20 }}
            onPress={() => {
              this.setState({ visible: false });
              if (this.state.onCancel !== null) this.state.onCancel();
            }}
          >
            <Text style={{ color: Colors.text }}>Cancel</Text>
          </Button>
        </Content>
      </Modal>
    );
  }
}
