import React, { Component } from "react";
import { Modal } from "react-native";
import { Content, Text, Button } from "native-base";

export default class WipeModal extends Component {
  state = {
    visible: false
  };

  show() {
    this.setState({ visible: true });
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
            flex: 1
          }}
        >
          <Content
            contentContainerStyle={{
              flex: 1,
              alignItems: "center"
            }}
          >
            <Text style={{ fontSize: 20, color: "white" }}>hi</Text>
            <Text style={{ fontSize: 16, color: "white" }}>hoo</Text>
          </Content>
          <Button
            rounded
            block
            primary
            style={{ marginLeft: 20, marginRight: 20, marginBottom: 20 }}
            onPress={() => this.setState({ visible: false })}
          >
            <Text>Wipe</Text>
          </Button>
          <Button
            rounded
            block
            primary
            style={{ marginLeft: 20, marginRight: 20, marginBottom: 20 }}
            onPress={() => this.setState({ visible: false })}
          >
            <Text>Cancel</Text>
          </Button>
        </Content>
      </Modal>
    );
  }
}
