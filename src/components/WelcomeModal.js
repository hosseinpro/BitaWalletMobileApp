import React, { Component } from "react";
import { Modal, Image } from "react-native";
import { Content, Text, Button } from "native-base";

export default class WelcomeModal extends Component {
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
            flex: 1,
            backgroundColor: "#004dcf"
          }}
        >
          <Content
            contentContainerStyle={{
              flex: 1,
              alignItems: "center"
            }}
          >
            <Image
              source={require("../img/card.png")}
              style={{ width: 350, height: 230 }}
            />
            <Text style={{ fontSize: 25, color: "white" }}>tap your card</Text>
          </Content>
          <Content contentContainerStyle={{ justifyContent: "flex-end" }}>
            <Button
              rounded
              block
              light
              style={{ margin: 20 }}
              onPress={() => this.setState({ visible: false })}
            >
              <Text>Wipe</Text>
            </Button>
          </Content>
        </Content>
      </Modal>
    );
  }
}
