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
import AlertBox from "./AlertBox";
import { connect } from "react-redux";
import redux from "../redux/redux";
import BitaWalletCard from "../lib/BitaWalletCard";

class SendTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCoin: "Bitcoin",
      selectedFee: "Regular"
    };
  }

  componentDidMount() {
    this.reset();
  }

  reset() {
    this.setState({
      selectedCoin: "Bitcoin",
      amount: "",
      to: "",
      selectedFee: "Regular",
      inputSection: null
    });
  }

  onPressSend() {
    if (this.state.amount === "") {
      AlertBox.info("Send", "Please enter an amount");
    } else if (this.state.to === "") {
      AlertBox.info("Send", "Please enter a receiver address");
    } else {
      global.tapCardModal.show(
        null,
        this.props.cardInfo,
        this.requestSend.bind(this)
      );
    }
  }

  requestSend() {
    global.bitaWalletCard
      .verifyPIN(this.props.pin)
      .then(() => {
        const spend = parseInt(this.state.amount);
        const fee = 500;
        global.bitaWalletCard
          .requestSignTx(spend, fee, this.state.to)
          .then(() => {
            const inputSection = BitaWalletCard.buildInputSection(
              spend,
              fee,
              this.props.addressInfo
            );
            this.setState({ inputSection });
            global.passwordModal.show(
              "Enter SEND code",
              this.confirmSend.bind(this),
              () => global.bitaWalletCard.cancel()
            );
          });
      })
      .catch(error => AlertBox.info("Error", "Something is wrong."));
  }

  confirmSend(yescode) {
    global.bitaWalletCard
      .signTx(
        yescode,
        this.state.inputSection.fund,
        this.props.changeKey,
        this.state.inputSection.inputSection,
        this.state.inputSection.signerKeyPaths
      )
      .then(res => {
        console.log("signedTx : " + res.signedTx);

        // pushTX

        AlertBox.info(
          "Send",
          this.state.amount + " BTC" + " is sent to \n" + this.state.to
        );

        this.reset();
      })
      .catch(error => {
        AlertBox.info("Error", "Something is wrong.");
      });
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
                <Picker.Item label="Bitcoin" value="Bitcoin" />
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
              <IconFontAwesome
                name="paste"
                style={{ width: 30 }}
                onPress={() =>
                  Clipboard.getString().then(str => this.setState({ to: str }))
                }
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
    addressInfo: state.addressInfo,
    changeKey: state.changeKey
  };
};

export default connect(
  mapStateToProps,
  null
)(SendTab);
