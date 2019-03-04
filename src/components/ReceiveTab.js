import React, { Component } from "react";
import { Clipboard } from "react-native";
import { Content, Text, Button, Picker } from "native-base";
import QRCode from "react-native-qrcode";
import { connect } from "react-redux";
import redux from "../redux/redux";
import AlertBox from "./AlertBox";
import Coins from "../Coins";

class ReceiveTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCoin: Coins.BTC,
      receiveAddress: ""
    };
  }

  componentDidMount() {
    this.setState({
      selectedCoin: Coins.BTC,
      receiveAddress: this.props.coinInfo.btc.receiveAddress
    });
  }

  onPressCopy() {
    Clipboard.setString(this.state.receiveAddress);
    AlertBox.info("Receive", "The address is copied");
  }

  render() {
    return (
      <Content contentContainerStyle={{ flex: 1 }}>
        <Content contentContainerStyle={{ marginLeft: 20, marginRight: 20 }}>
          <Picker
            mode="dialog"
            selectedValue={this.state.selectedCoin}
            onValueChange={value => {
              this.setState({
                selectedCoin: value
              });
              if (value === Coins.BTC) {
                this.setState({
                  receiveAddress: this.props.coinInfo.btc.receiveAddress
                });
              } else if (value === Coins.TST) {
                this.setState({
                  receiveAddress: this.props.coinInfo.tst.receiveAddress
                });
              }
            }}
          >
            <Picker.Item label="Bitcoin" value={Coins.BTC} />
            <Picker.Item label="Bitcoin (Testnet)" value={Coins.TST} />
          </Picker>
          <Content
            contentContainerStyle={{
              margin: 50,
              alignSelf: "center",
              width: 200
            }}
          >
            <QRCode
              value={this.state.receiveAddress}
              size={200}
              bgColor="black"
              fgColor="white"
            />
          </Content>
          <Text
            style={{ fontSize: 20, fontWeight: "bold", color: Colors.text }}
          >
            {this.state.receiveAddress}
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
    coinInfo: state.coinInfo
  };
};

export default connect(
  mapStateToProps,
  null
)(ReceiveTab);
