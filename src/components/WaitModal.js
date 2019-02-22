import React, { Component } from "react";
import { Modal, Image } from "react-native";
import { Content, Text, Button, Header } from "native-base";

export default class WaitModal extends Component {
  state = {
    visible: false,
    message: null
  };

  show(message = null) {
    this.setState({
      visible: true,
      message
    });
  }

  hide() {
    this.setState({
      visible: false
    });
  }

  render() {
    return (
      <Modal
        animationType="fade"
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
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text style={{ fontSize: 30, color: Colors.primaryText }}>
            {this.state.message !== null
              ? this.state.message
              : "Please wait..."}
          </Text>
        </Content>
      </Modal>
    );
  }
}
