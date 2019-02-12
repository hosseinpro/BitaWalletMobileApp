import React, { Component } from "react";
import { Content, Text, Button, Form, Card, CardItem, Body } from "native-base";

export default class BackupCardStack extends Component {
  onPressBackup() {}

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
            <Text style={{ fontSize: 20, marginTop: 20 }}>
              Tap your {"backup"} card
            </Text>
            <Text style={{ marginTop: 20 }}>Checkvalue</Text>
            <Card>
              <CardItem style={{ backgroundColor: "#DEDEDE" }}>
                <Body>
                  <Text style={{ fontWeight: "bold" }}>
                    Wm7HQZEJTRPauV64UYXRrS3cak7
                  </Text>
                </Body>
              </CardItem>
            </Card>
          </Form>
        </Content>
        <Button
          rounded
          block
          style={{ backgroundColor: Colors.secondary, margin: 20 }}
          onPress={() => this.onPressBackup()}
        >
          <Text style={{ color: Colors.text }}>Backup</Text>
        </Button>
      </Content>
    );
  }
}
