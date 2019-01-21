import React, { Component } from "react";
import {
  Content,
  Text,
  Button,
  Item,
  Icon,
  Input,
  Textarea,
  Form,
  Picker
} from "native-base";
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
        <Content
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            marginLeft: 20,
            marginRight: 20
          }}
        >
          <Form style={{ width: "100%" }}>
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
            <Content contentContainerStyle={{ alignItems: "center" }}>
              <Content contentContainerStyle={{ margin: 20 }}>
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
          </Form>
        </Content>
        <Content contentContainerStyle={{ justifyContent: "flex-end" }}>
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
      </Content>
    );
  }
}
