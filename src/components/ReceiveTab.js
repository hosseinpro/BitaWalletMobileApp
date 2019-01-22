import React, { Component } from "react";
import { Content, Text, Button, Picker } from "native-base";
import QRCode from "react-native-qrcode";

export default class ReceiveTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCoin: "Bitcoin"
    };
  }

  state = {
    address: "mvyQZq6UvkMB97K9bUeHp4VVS1N7SeDzRX",
    selectedCoin: "Bitcoin"
  };

  onPressCopy() {
    this.setState({ address: "mvyQZq6UvkMB97K9bUeHp4VVS1N7SeDzRX" });
  }

  render() {
    return (
      <Content contentContainerStyle={{ flex: 1 }}>
        <Content contentContainerStyle={{ marginLeft: 20, marginRight: 20 }}>
          <Picker
            mode="dialog"
            selectedValue={this.state.selectedCoin}
            onValueChange={value =>
              this.setState({
                selectedCoin: value
              })
            }
          >
            <Picker.Item label="Bitcoin" value="Bitcoin" />
          </Picker>
          <Content contentContainerStyle={{ margin: 20, alignItems: "center" }}>
            <QRCode
              value={this.state.address}
              size={200}
              bgColor="black"
              fgColor="white"
            />
          </Content>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {this.state.address}
          </Text>
        </Content>
        <Button
          rounded
          block
          primary
          style={{ margin: 20 }}
          onPress={() => this.onPressCopy()}
        >
          <Text>Copy</Text>
        </Button>
      </Content>
    );
  }
}
