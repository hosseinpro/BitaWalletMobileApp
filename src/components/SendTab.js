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
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons";

export default class SendTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCoin: "Bitcoin",
      selectedFee: "Regular"
    };
  }

  onPressSend() {}

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
            <Item>
              <IconFontAwesome name="bitcoin" />
              <Input placeholder="Amount" />
            </Item>
            <Item>
              <IconMaterialIcons name="person-pin" />
              <Input placeholder="To" />
            </Item>
            <Picker
              mode="dialog"
              selectedValue={this.state.selectedFee}
              onValueChange={value =>
                this.setState({
                  selectedFee: value
                })
              }
            >
              <Picker.Item label="Regular" value="Regular" />
              <Picker.Item label="Express" value="Express" />
            </Picker>
            <Textarea rowSpan={3} bordered placeholder="Memo" />
          </Form>
        </Content>
        <Button
          rounded
          block
          primary
          style={{ margin: 20 }}
          onPress={() => this.onPressSend()}
        >
          <Text>Send</Text>
        </Button>
      </Content>
    );
  }
}
