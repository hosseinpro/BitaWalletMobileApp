import React, { Component } from "react";
import { Image } from "react-native";
import { Content, Text, Button } from "native-base";

export default class CardTab extends Component {
  onPressDisconnect() {
    global.tapCardModal.show(null, null, true);
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
          <Text style={{ fontSize: 16 }}>{global.cardInfo.serialNumber}</Text>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {global.cardInfo.label}
          </Text>
          <Image
            source={require("../img/card.png")}
            style={{ width: 350, height: 230 }}
          />
          <Text style={{ fontSize: 20 }}>{2.5} BTC</Text>
        </Content>
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
    );
  }
}
