import React, { Component } from "react";
import { Content, Text, Button, Item, Input, Form, Label } from "native-base";

export default class ChangeLabelStack extends Component {
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
              <Label style={{ marginTop: 15, marginBottom: 15 }}>
                Current Label : {global.cardInfo.label}
              </Label>
            </Item>
            <Item>
              <Label>New Label</Label>
              <Input maxLength={50} />
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
