import React, { Component } from "react";
import { Content, Text } from "native-base";
import AlertBox from "./AlertBox";
import { connect } from "react-redux";
import redux from "../redux/redux";

class ChangePinStack extends Component {
  state = {};

  async componentDidMount() {
    try {
      await global.tapCardModal.show(null, this.props.cardInfo, false);
      await global.bitaWalletCard.changePIN();
      let pin = await global.pinModal.show();
      await global.bitaWalletCard.verifyPIN(pin);
      pin = await global.pinModal.show();
      await global.bitaWalletCard.setPIN(pin);
      pin = await global.pinModal.show();
      await global.bitaWalletCard.setPIN(pin);
      await AlertBox.info("PIN", "PIN is changed.");
    } catch (error) {
      if (error.error === "Incorrect PIN")
        await AlertBox.info("Incorrect PIN", error.leftTries + " tries left.");
    }
    this.props.navigation.navigate("MoreTab");
  }

  render() {
    return (
      <Content contentContainerStyle={{ flex: 1 }}>
        <Content
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 20
          }}
        >
          <Text>Please wait...</Text>
        </Content>
      </Content>
    );
  }
}

const mapStateToProps = state => {
  return {
    cardInfo: state.cardInfo
  };
};

const mapDispatchToProps = dispatch => {};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePinStack);
