"use strict";

import React, { Component } from "react";
import { Modal } from "react-native";
import { Content, Header, Button, Text } from "native-base";
import QRCodeScanner from "react-native-qrcode-scanner";

export default class ScanScreen extends Component {
  state = {
    visible: false,
    onComplete: null
  };

  show() {
    return new Promise((resolve, reject) =>
      this.setState({ visible: true, onComplete: address => resolve(address) })
    );
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
        <Header
          androidStatusBarColor={Colors.primaryDark}
          style={{ display: "none" }}
        />
        <Content
          contentContainerStyle={{
            flex: 1,
            backgroundColor: Colors.primary
          }}
        >
          <Content
            contentContainerStyle={{
              flex: 1,
              alignItems: "center"
            }}
          >
            <Text
              style={{ fontSize: 20, color: Colors.primaryText, margin: 10 }}
            >
              Scan
            </Text>
            <Content
              contentContainerStyle={{
                flex: 1,
                alignItems: "center"
              }}
            >
              <QRCodeScanner
                showMarker
                fadeIn={false}
                onRead={e => {
                  this.setState({ visible: false });
                  this.state.onComplete(e.data);
                }}
                vibrate={false}
                cameraProps={{ captureAudio: false }}
              />
            </Content>
          </Content>
          <Button
            rounded
            block
            style={{ backgroundColor: Colors.secondary, margin: 20 }}
            onPress={() => this.setState({ visible: false })}
          >
            <Text style={{ color: Colors.text }}>Cancel</Text>
          </Button>
        </Content>
      </Modal>
    );
  }
}
