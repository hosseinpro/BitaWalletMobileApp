import React, { Component } from "react";
import { Content, Text, Button } from "native-base";
import { connect } from "react-redux";
import redux from "../redux/redux";
import { NavigationEvents } from "react-navigation";
import AlertBox from "./AlertBox";

class BackupCardStack extends Component {
  state = {};

  async reset() {
    await global.bitaWalletCard.cancel();
  }

  async onPressBackup() {
    try {
      const backupCardInfo = await global.tapCardModal.show(
        "tap your backup card",
        null,
        false
      );
      if (backupCardInfo.serialNumber === this.props.cardInfo.serialNumber) {
        await AlertBox.info(
          "Error",
          "You must use another wallet as a backup."
        );
        this.reset();
        return;
      }
      const backupCardTransportKeyPublic = await global.wipeModal.show(
        backupCardInfo,
        "b"
      );

      await global.tapCardModal.show(
        "tap your main card",
        this.props.cardInfo,
        false
      );
      await bitaWalletCard.exportMasterSeed(backupCardTransportKeyPublic);
      let pin = await global.pinModal.show();
      const encryptedMasterSeedAndTransportKeyPublic = await global.bitaWalletCard.verifyPIN(
        pin
      );

      await global.tapCardModal.show(
        "tap your backup card again",
        backupCardInfo,
        false
      );
      await global.bitaWalletCard.importMasterSeed(
        encryptedMasterSeedAndTransportKeyPublic
      );
      pin = await global.pinModal.show();
      await global.bitaWalletCard.verifyPIN(pin);
      await AlertBox.info("Backup", "Your wallet is backed up.");
    } catch (error) {
      if (error !== undefined && error.message === "Incorrect PIN")
        await AlertBox.info("Incorrect PIN", error.leftTries + " tries left.");
      console.log(error);
    }
    this.reset();
  }

  render() {
    return (
      <Content contentContainerStyle={{ flex: 1 }}>
        <NavigationEvents onWillBlur={payload => this.reset()} />
        <Content
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 20
          }}
        ></Content>
        <Button
          rounded
          block
          style={{ backgroundColor: Colors.secondary, margin: 20 }}
          disabled={this.state.stepBegin}
          onPress={() => this.onPressBackup()}
        >
          <Text style={{ color: Colors.text }}>Backup</Text>
        </Button>
      </Content>
    );
  }
}

const mapStateToProps = state => {
  return {
    cardInfo: state.cardInfo
  };
};

export default connect(mapStateToProps, null)(BackupCardStack);
