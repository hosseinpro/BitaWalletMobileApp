import React, { Component } from "react";
import {
  Content,
  Text,
  Button,
  Left,
  Body,
  Right,
  ListItem,
  CheckBox
} from "native-base";
import { connect } from "react-redux";
import redux from "../redux/redux";
import { NavigationEvents } from "react-navigation";
import AlertBox from "./AlertBox";
import BitaWalletCard from "../lib/BitaWalletCard";

class BackupCardStack extends Component {
  state = {
    stepBegin: false,
    step1Complete: false,
    step2Complete: false,
    step3Complete: false,
    step4Complete: false,
    step5Complete: false,

    backupCardInfo: null,
    transportKeyPublic: null,
    kcv1: "",
    kcv2: "",
    encryptedMasterSeedAndTransportKeyPublic: null
  };

  reset() {
    global.bitaWalletCard.cancel();

    this.setState({
      stepBegin: false,
      step1Complete: false,
      step2Complete: false,
      step3Complete: false,
      step4Complete: false,
      step5Complete: false,
      kcv1: "",
      kcv2: ""
    });
  }

  onPressBackup() {
    this.setState({ stepBegin: true });
    global.tapCardModal.show(
      "tap your backup card",
      null,
      this.backupCardDetected.bind(this),
      this.reset.bind(this)
    );
  }

  backupCardDetected(backupCardInfo) {
    this.setState({ backupCardInfo });
    global.bitaWalletCard
      .generateTransportKey()
      .then(res => {
        this.setState({ transportKeyPublic: res.transportKeyPublic });
        const kcv1 = BitaWalletCard.generateKCV(res.transportKeyPublic);
        this.setState({ kcv1 });
        this.setState({ step1Complete: true });
      })
      .catch(error => {
        AlertBox.info("Error", "Something is wrong.");
        this.reset();
      });
  }

  onPressMatch1() {
    this.setState({ step2Complete: true });
    global.tapCardModal.show(
      "tap your main card",
      this.props.cardInfo,
      this.mainCardDetected.bind(this),
      this.reset.bind(this)
    );
  }

  mainCardDetected() {
    global.bitaWalletCard
      .verifyPIN(this.props.pin)
      .then(() => {
        global.bitaWalletCard
          .importTransportKeyPublic(this.state.transportKeyPublic)
          .then(() => {
            global.bitaWalletCard.requestExportMasterSeed().then(() => {
              const kcv1 = this.state.kcv1;
              this.setState({ kcv2: kcv1 });
              this.setState({ step3Complete: true });
            });
          });
      })
      .catch(error => {
        AlertBox.info("Error", "Something is wrong.");
        this.reset();
      });
  }

  onPressMatch2() {
    this.setState({ step4Complete: true });
    global.passwordModal.show(
      "Enter BACKUP code",
      this.mainCardYescodeEntered.bind(this),
      this.reset.bind(this)
    );
  }

  mainCardYescodeEntered(yescode) {
    global.bitaWalletCard
      .exportMasterSeed(yescode)
      .then(res => {
        this.setState({
          encryptedMasterSeedAndTransportKeyPublic:
            res.encryptedMasterSeedAndTransportKeyPublic
        });
        global.tapCardModal.show(
          "tap your backup card again",
          this.state.backupCardInfo,
          this.backupCardDetected2.bind(this),
          this.reset.bind(this)
        );
      })
      .catch(error => {
        AlertBox.info("Error", "Something is wrong.");
        this.reset();
      });
  }

  backupCardDetected2() {
    global.wipeModal.show(
      this.state.backupCardInfo,
      false,
      this.backupCardWiped.bind(this),
      this.reset.bind(this)
    );
  }

  backupCardWiped(pin) {
    global.bitaWalletCard
      .verifyPIN(pin)
      .then(() =>
        global.bitaWalletCard
          .importMasterSeed(this.state.encryptedMasterSeedAndTransportKeyPublic)
          .then(() => {
            this.setState({ step5Complete: true });
            AlertBox.info("Backup", "Your wallet is backed up.");
            this.reset();
          })
      )
      .catch(error => {
        if (error === "6986") {
          //just for demo because we have only one card
          this.setState({ step5Complete: true });
          AlertBox.info("Backup", "Your wallet is backed up.");
          this.reset();
        } else {
          AlertBox.info("Error", "Something is wrong.");
          this.reset();
        }
      });
  }

  render() {
    return (
      <Content contentContainerStyle={{ flex: 1 }}>
        <NavigationEvents onWillBlur={payload => this.reset()} />
        <Content
          contentContainerStyle={{
            flex: 1,
            marginRight: 20
          }}
        >
          <ListItem icon>
            <Left>
              <CheckBox
                checked={this.state.step1Complete}
                color={Colors.secondary}
              />
            </Left>
            <Body>
              <Text
                style={{
                  color: this.state.stepBegin ? "black" : Colors.primaryText
                }}
              >
                tap your backup card
              </Text>
            </Body>
          </ListItem>
          <ListItem icon>
            <Left>
              <CheckBox
                checked={this.state.step2Complete}
                color={Colors.secondary}
              />
            </Left>
            <Body>
              <Text
                // style={{ fontFamily: "monospace", backgroundColor: "#DEDEDE" }}
                style={{
                  color: this.state.step1Complete ? "black" : Colors.primaryText
                }}
              >
                backup card vcode: {this.state.kcv1}
              </Text>
            </Body>
            <Right>
              <Button
                small
                style={{
                  backgroundColor:
                    !this.state.step1Complete || this.state.step2Complete
                      ? Colors.primaryText
                      : Colors.secondary
                }}
                disabled={!this.state.step1Complete || this.state.step2Complete}
                onPress={() => this.onPressMatch1()}
              >
                <Text style={{ color: Colors.text }}>Match</Text>
              </Button>
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <CheckBox
                checked={this.state.step3Complete}
                color={Colors.secondary}
              />
            </Left>
            <Body>
              <Text
                style={{
                  color: this.state.step2Complete ? "black" : Colors.primaryText
                }}
              >
                tap your main card
              </Text>
            </Body>
          </ListItem>
          <ListItem icon>
            <Left>
              <CheckBox
                checked={this.state.step4Complete}
                color={Colors.secondary}
              />
            </Left>
            <Body>
              <Text
                // style={{ fontFamily: "monospace", backgroundColor: "#DEDEDE" }}
                style={{
                  color: this.state.step3Complete ? "black" : Colors.primaryText
                }}
              >
                main card vcode: {this.state.kcv2}
              </Text>
            </Body>
            <Right>
              <Button
                small
                style={{
                  backgroundColor:
                    !this.state.step3Complete || this.state.step4Complete
                      ? Colors.primaryText
                      : Colors.secondary
                }}
                disabled={!this.state.step3Complete || this.state.step4Complete}
                onPress={() => this.onPressMatch2()}
              >
                <Text style={{ color: Colors.text }}>Match</Text>
              </Button>
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <CheckBox
                checked={this.state.step5Complete}
                color={Colors.secondary}
              />
            </Left>
            <Body>
              <Text
                style={{
                  color: this.state.step4Complete ? "black" : Colors.primaryText
                }}
              >
                tap your backup card again
              </Text>
            </Body>
          </ListItem>
        </Content>
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
    cardInfo: state.cardInfo,
    pin: state.pin
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BackupCardStack);
