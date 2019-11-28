import React, { Component } from "react";
import { Clipboard } from "react-native";
import {
  Content,
  Text,
  Button,
  Item,
  Input,
  Textarea,
  Form,
  Picker
} from "native-base";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AlertBox from "./AlertBox";
import { connect } from "react-redux";
import redux from "../redux/redux";
import { NavigationEvents } from "react-navigation";
import BitaWalletCard from "../lib/BitaWalletCard";
import Blockchain from "../lib/Blockchain";
import Coins from "../Coins";

class SendTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCoin: Coins.BTC,
      selectedFee: "Regular"
    };
    global.SendTab = this;
  }

  reset() {
    this.cancel();

    this.setState({
      selectedCoin: Coins.BTC,
      amount: "",
      to: "",
      selectedFee: "Regular",
      inputSection: null,
      spend: 0,
      fee: 0
    });
  }

  cancel() {
    global.bitaWalletCard.cancel();
    global.waitModal.hide();
  }

  onPressSend() {
    if (this.state.amount === "") {
      AlertBox.info("Send", "Please enter an amount");
    } else if (this.state.to === "") {
      AlertBox.info("Send", "Please enter a receiver address");
    } else {
      let addressInfo = "";
      if (this.state.selectedCoin === Coins.BTC)
        addressInfo = this.props.coinInfo.btc.addressInfo;
      else addressInfo = this.props.coinInfo.tst.addressInfo;

      const spend = BitaWalletCard.btc2satoshi(parseFloat(this.state.amount));
      const fee = 8000; //6250;

      try {
        const inputSection = BitaWalletCard.buildInputSection(
          spend,
          fee,
          addressInfo
        );

        if (inputSection === null) {
          AlertBox.info("Error", "Not enough fund");
          return;
        }
        this.setState({ inputSection, spend, fee });
      } catch (error) {
        AlertBox.info("Error", error.toString());
        return;
      }

      global.tapCardModal.show(
        null,
        this.props.cardInfo,
        this.requestSend.bind(this)
      );
    }
  }

  async requestSend() {
    global.waitModal.show();

    try {
      await global.bitaWalletCard.verifyPIN(this.props.pin);
      await global.bitaWalletCard.requestSignTx(
        this.state.spend,
        this.state.fee,
        this.state.to
      );
      global.passwordModal.show(
        "Enter SEND code",
        this.confirmSend.bind(this),
        () => this.cancel()
      );
    } catch (error) {
      this.cancel();
      AlertBox.info("Error", error.toString());
    }
  }

  async confirmSend(yescode) {
    let network = "";
    let changeKeyPath = "";
    if (this.state.selectedCoin === Coins.BTC) {
      network = Blockchain.btcMain;
      changeKeyPath = this.props.coinInfo.btc.changeKeyPath;
    } else {
      network = Blockchain.btcTest;
      changeKeyPath = this.props.coinInfo.tst.changeKeyPath;
    }

    try {
      let res = await global.bitaWalletCard.signTx(
        yescode,
        this.state.inputSection.fund,
        changeKeyPath,
        this.state.inputSection.inputSection,
        this.state.inputSection.signerKeyPaths
      );
      await Blockchain.pushTx(res.signedTx, network);
      AlertBox.info(
        "Sent!",
        this.state.amount + " BTC" + " is sent to \n" + this.state.to
      );

      this.reset();
    } catch (error) {
      this.cancel();
      AlertBox.info("Error", error.toString());
    }
  }

  render() {
    return (
      <Content contentContainerStyle={{ flex: 1 }}>
        {/* <NavigationEvents onWillBlur={payload => this.reset()} /> */}
        <Content
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            marginRight: 20
          }}
        >
          <Form style={{ width: "100%" }}>
            <Item>
              <Picker
                mode="dialog"
                selectedValue={this.state.selectedCoin}
                onValueChange={value =>
                  this.setState({
                    selectedCoin: value
                  })
                }
              >
                <Picker.Item label="Bitcoin" value={Coins.BTC} />
                <Picker.Item label="Bitcoin (Testnet)" value={Coins.TST} />
              </Picker>
            </Item>
            <Item>
              <IconFontAwesome name="bitcoin" />
              <Input
                placeholder="Amount"
                keyboardType="numeric"
                value={this.state.amount}
                onChangeText={amount => this.setState({ amount })}
              />
            </Item>
            <Item>
              <IconMaterialIcons name="person-pin" />
              <Input
                placeholder="To"
                value={this.state.to}
                onChangeText={to => this.setState({ to })}
              />
              <IconMaterialCommunityIcons
                name="qrcode-scan"
                style={{ width: 30 }}
                onPress={() => {
                  global.qrCodeScannerModal.show(address =>
                    this.setState({ to: address })
                  );
                  // Clipboard.getString().then(str => this.setState({ to: str }))
                }}
              />
            </Item>
            <Item>
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
            </Item>
            <Item>
              <Textarea rowSpan={3} placeholder="Memo" />
            </Item>
          </Form>
        </Content>
        <Button
          rounded
          block
          style={{ backgroundColor: Colors.secondary, margin: 20 }}
          onPress={() => this.onPressSend()}
        >
          <Text style={{ color: Colors.text }}>Send</Text>
        </Button>
      </Content>
    );
  }
}

const mapStateToProps = state => {
  return {
    pin: state.pin,
    cardInfo: state.cardInfo,
    coinInfo: state.coinInfo
  };
};

export default connect(mapStateToProps, null)(SendTab);
