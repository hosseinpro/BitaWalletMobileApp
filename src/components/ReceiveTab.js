import React, { Component } from "react";
import { Clipboard } from "react-native";
import { Content, Text, Button, Picker } from "native-base";
import QRCode from "react-native-qrcode";
import { connect } from "react-redux";
import redux from "../redux/redux";
import AlertBox from "./AlertBox";

class ReceiveTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCoin: "Bitcoin"
    };
  }

  onPressCopy() {
    Clipboard.setString(this.props.addressInfo[0].address);
    AlertBox.info("Receive", "The address is copied");
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
          <Content
            contentContainerStyle={{
              margin: 50,
              alignSelf: "center",
              width: 200
            }}
          >
            <QRCode
              value={this.props.addressInfo[0].address}
              size={200}
              bgColor="black"
              fgColor="white"
            />
          </Content>
          <Text
            style={{ fontSize: 20, fontWeight: "bold", color: Colors.text }}
          >
            {this.props.addressInfo[0].address}
          </Text>
        </Content>
        <Button
          rounded
          block
          style={{ backgroundColor: Colors.secondary, margin: 20 }}
          onPress={() => this.onPressCopy()}
        >
          <Text style={{ color: Colors.text }}>Copy</Text>
        </Button>
      </Content>
    );
  }
}

const mapStateToProps = state => {
  return {
    addressInfo: state.addressInfo
  };
};

export default connect(
  mapStateToProps,
  null
)(ReceiveTab);
