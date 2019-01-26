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
    // this.props.nfcReader.bitaWalletCard
    //   .transmit(
    //     // "0031000129000000000000157c00000000000001f4005f6b5994fbb9fe397235b6517bb6a2c23050f68faf23925e",
    //     "0031000129000000000000157C00000000000001F46FA98AA1ED2089EED4D22A9DE6C4D2994FE323A14A7B3A1862",
    //     res => {
    //       this.props.nfcReader.bitaWalletCard.transmit(
    //         // "0032000100005d313233340000000005f5e1006D2C0100010000014e24092ce2fa35538ebe218d5f35d458d31fbc181dc8de6c14a28a190a2796a8000000001976a9145f6b5994fbb9fe397235b6517bb6a2c23050f68f88acFFFFFFFF6D2C00000000000000",
    //         "0032000100005D313233340000000005F5E1006D2C0100010000014E24092CE2FA35538EBE218D5F35D458D31FBC181DC8DE6C14A28A190A2796A8000000001976A9145F6B5994FBB9FE397235B6517BB6A2C23050F68F88ACFFFFFFFF6D2C00000000000000",
    //         res => {
    //           console.log("Hi");
    //         }
    //       );
    //     }
    //   )
    //   .catch(error => {
    //     AlertBox.info("Error", "Something is wrong.");
    //   });

    // return;

    if (this.state.amount === "") {
      AlertBox.info("Send", "Please enter an amount");
    } else if (this.state.to === "") {
      AlertBox.info("Send", "Please enter a receiver address");
    } else {
      global.tapCardModal.show(
        null,
        this.props.cardInfo,
        false,
        this.requestSend.bind(this)
      );
    }
  }

  requestSend() {
    this.props.nfcReader.bitaWalletCard
      .verifyPIN(this.props.pin)
      .then(() => {
        const spend = parseInt(this.state.amount);
        const fee = 500;
        this.props.nfcReader.bitaWalletCard
          .requestSignTx(spend, fee, this.state.to)
          .then(() => {
            const inputSection = BitaWalletCard.buildInputSection(
              spend,
              fee,
              this.props.addressInfo
            );
            this.setState({ inputSection });
            global.passwordModal.show(
              "Enter Yescode",
              this.confirmSend.bind(this)
            );
          });
      })
      .catch(error => AlertBox.info("Error", "Something is wrong."));
  }

  confirmSend(yescode) {
    this.reset();
    AlertBox.info(
      "Send",
      this.state.amount + " BTC" + " is sent to \n" + this.state.to
    );
    // this.props.nfcReader.bitaWalletCard
    //   .signTx(
    //     yescode,
    //     this.state.inputSection.fund,
    //     this.props.changeKey,
    //     this.state.inputSection.inputSection,
    //     this.state.inputSection.signerKeyPaths
    //   )
    //   .then(res => {
    //     console.log("signedTx : " + res.signedTx);
    //   })
    //   .catch(error => {
    //     AlertBox.info("Error", "Something is wrong.");
    //   });
  }

  render() {
    return (
      <Content contentContainerStyle={styles.container}>
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
          style={styles.button}
          onPress={() => this.onPressSend()}
        >
          <Text style={styles.button}>Send</Text>
        </Button>
      </Content>
    );
  }
}

const mapStateToProps = state => {
  return {
    nfcReader: state.nfcReader,
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
