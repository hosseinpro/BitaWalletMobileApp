import React, { Component } from "react";
import { Content, Text, Button, Item, Input, Form, Label } from "native-base";

export default class ChangePasswordStack extends Component {
  onPressChange() {}

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
            <Item>
              <Label>New Password</Label>
              <Input
                keyboardType="numeric"
                secureTextEntry={true}
                maxLength={6}
              />
            </Item>
            <Item>
              <Label>Confirm Password</Label>
              <Input
                keyboardType="numeric"
                secureTextEntry={true}
                maxLength={6}
              />
            </Item>
          </Form>
        </Content>
        <Button
          rounded
          block
          primary
          style={{ margin: 20 }}
          onPress={() => this.onPressChange()}
        >
          <Text>Change</Text>
        </Button>
      </Content>
    );
  }
}
