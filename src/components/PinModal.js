import React, { Component } from "react";
import { Modal } from "react-native";
import { Content, Button, Text, Header } from "native-base";
import PinView from "react-native-pin-view";

export default class PinModal extends Component {
  state = {
    visible: false,
    onComplete: null,
    onCancel: null
  };

  show(message) {
    return new Promise((resolve, reject) => {
      this.setState({
        visible: true,
        message,
        onComplete: password => {
          resolve(password);
        },
        onCancel: () => {
          reject(new Error("Cancel"));
        }
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
            backgroundColor: Colors.primary,
            alignContent: "center",
            justifyContent: "center"
          }}
        >
          <Text
            style={{
              fontSize: 25,
              color: Colors.primaryText,
              alignSelf: "center",
              marginBottom: 20
            }}
          >
            {this.state.message}
          </Text>
          <PinView
            onComplete={(password, clear) => {
              clear();
              this.setState({ visible: false });
              this.state.onComplete(password);
            }}
            pinLength={4}
            delayBeforeOnComplete={0}
            buttonBgColor={Colors.secondary}
            buttonTextColor={Colors.secondary}
            inputBgColor={Colors.primaryText}
          />
          <Button
            transparent
            style={{
              alignSelf: "flex-end",
              marginRight: 60
            }}
            onPress={() => {
              this.setState({ visible: false });
              if (this.state.onCancel !== null) this.state.onCancel();
            }}
          >
            <Text style={{ fontSize: 16, color: Colors.secondary }}>
              Cancel
            </Text>
          </Button>
        </Content>
      </Modal>
    );
  }
}
