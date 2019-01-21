import React, { Component } from "react";
import { Image } from "react-native";
import { Content, Text, Button } from "native-base";

export default class CardTab extends Component {
  onPressDisconnect() {
    global.welcomeModal.show();
  }

  render() {
    return (
      <Content contentContainerStyle={{ flex: 1 }}>
        <Content
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            marginLeft: 20,
            marginRight: 20
          }}
        >
          <Text style={{ fontSize: 16 }}>{this.props.serialNumber}</Text>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {this.props.label}
          </Text>
          <Image
            source={require("../img/card.png")}
            style={{ width: 350, height: 230 }}
          />
          <Text style={{ fontSize: 20 }}>{2.5} BTC</Text>
        </Content>
        <Content contentContainerStyle={{ justifyContent: "flex-end" }}>
          <Button
            rounded
            block
            primary
            style={{ margin: 20 }}
            onPress={() => this.onPressDisconnect()}
          >
            <Text>Disconnect</Text>
          </Button>
        </Content>
      </Content>
    );
  }
}