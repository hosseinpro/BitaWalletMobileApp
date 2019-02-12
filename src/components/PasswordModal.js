import React, { Component } from "react";
import { Modal } from "react-native";
import { Content, Button, Text } from "native-base";
import PinView from "react-native-pin-view";

export default class PasswordModal extends Component {
  state = {
    visible: false,
    onComplete: null
  };

  show(message, onComplete) {
    this.setState({ visible: true, message, onComplete });
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
        <Content
          contentContainerStyle={{
            backgroundColor: Colors.primary,
            flex: 1,
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
              this.state.onComplete(password);
              this.setState({ visible: false });
            }}
            pinLength={4}
            delayBeforeOnComplete={0}
            buttonBgColor={Colors.secondary}
            inputBgColor={Colors.primaryText}
          />
          <Button
            transparent
            style={{
              alignSelf: "flex-end",
              marginRight: 60
            }}
            onPress={() => this.setState({ visible: false })}
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
