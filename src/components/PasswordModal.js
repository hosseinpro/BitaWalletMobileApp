import React, { Component } from "react";
import { Modal } from "react-native";
import { Content, Button, Text } from "native-base";
import PinView from "react-native-pin-view";

export default class PasswordModal extends Component {
  state = {
    visible: false,
    pinValue: null
  };

  show(message) {
    this.setState({ visible: true, message });
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
            flex: 1,
            alignContent: "center",
            justifyContent: "center"
          }}
        >
          <Text
            style={{
              fontSize: 25,
              color: "red",
              alignSelf: "center",
              marginBottom: 20
            }}
          >
            {this.state.message}
          </Text>
          <PinView
            onComplete={(val, clear) => {
              clear();
              this.setState({ pinValue: val });
              this.setState({ visible: false });
            }}
            pinLength={4}
            buttonBgColor="#E6E6E6"
          />
          <Button
            transparent
            style={{
              alignSelf: "flex-end",
              marginRight: 60
            }}
            onPress={() => this.setState({ visible: false })}
          >
            <Text style={{ fontSize: 16 }}>Cancel</Text>
          </Button>
        </Content>
      </Modal>
    );
  }
}
