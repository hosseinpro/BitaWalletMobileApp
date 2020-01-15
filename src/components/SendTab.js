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
import Coins from "../Coins";
import XebaWalletServer from "../lib/XebaWalletServer";

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

  async onPressSend() {
    if (this.state.amount === "") {
      await AlertBox.info("Send", "Please enter an amount");
      return;
    } else if (this.state.to === "") {
      await AlertBox.info("Send", "Please enter a receiver address");
      return;
    }
    let coinElement = "";
    if (this.state.selectedCoin === Coins.BTC)
      coinElement = this.props.coinInfo.btc;
    else coinElement = this.props.coinInfo.tst;

    const spend = BitaWalletCard.btc2satoshi(parseFloat(this.state.amount));
    const fee = 8000; //6250;

    try {
      const inputSection = BitaWalletCard.buildInputSection(
        spend,
        fee,
        coinElement.addressInfo
      );

      if (inputSection === null) {
        await AlertBox.info("Error", "Not enough fund");
        return;
      }

      await global.tapCardModal.show(null, this.props.cardInfo, false);

      global.waitModal.show();

      await global.bitaWalletCard.signTx(
        spend,
        fee,
        this.state.to,
        inputSection.fund,
        coinElement.changeKeyPath,
        inputSection.inputSection,
        inputSection.signerKeyPaths
      );

      const pin = await global.pinModal.show();

      let tx = await global.bitaWalletCard.verifyPIN(pin);

      await XebaWalletServer.send(coinElement.name, tx);
      await AlertBox.info(
        "Sent!",
        this.state.amount + " BTC" + " is sent to \n" + this.state.to
      );

      this.reset();
    } catch (error) {
      if (error !== undefined && error.message === "Incorrect PIN")
        await AlertBox.info("Incorrect PIN", error.leftTries + " tries left.");
      this.cancel();
      console.log(error);
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
                onPress={async () => {
                  let address = await global.qrCodeScannerModal.show();
                  if (!BitaWalletCard.validateBitcoinAddress(address))
                    address = "";
                  this.setState({ to: address });
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
    cardInfo: state.cardInfo,
    coinInfo: state.coinInfo
  };
};

export default connect(mapStateToProps, null)(SendTab);
