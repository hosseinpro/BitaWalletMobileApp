import React, { Component } from "react";
import { Modal } from "react-native";
import {
  Content,
  Text,
  Button,
  Header,
  Item,
  Input,
  Form,
  Label
} from "native-base";
import { connect } from "react-redux";
import redux from "../redux/redux";
import AlertBox from "./AlertBox";

class WipeModal extends Component {
  state = {
    visible: false,
    newPin: "",
    newPinConfirm: "",
    newLabel: "",

    onComplete: null,
    onCancel: null
  };

  show(onComplete, onCancel) {
    this.setState({ visible: true, onComplete, onCancel });
  }

  onPressWipe() {
    if (this.state.newPin === "") {
      AlertBox.info("Wipe", "Please enter a password");
    } else if (this.state.newPin !== this.state.newPinConfirm) {
      AlertBox.info("Wipe", "Passwords do not match");
    } else if (this.state.newLabel === "") {
      AlertBox.info("Wipe", "Please enter a label");
    } else {
      global.tapCardModal.show(null, null, this.cardDetected.bind(this));
    }
  }

  cardDetected(cardInfo) {
    this.setState({ cardInfo });
    this.props.nfcReader.bitaWalletCard
      .requestWipe()
      .then(() => {
        global.passwordModal.show(
          "Enter Yescode",
          this.yescodeEntered.bind(this)
        );
      })
      .catch(error => {
        AlertBox.info("Error", "Something is wrong.");
      });
  }

  yescodeEntered(yescode) {
    this.props.nfcReader.bitaWalletCard
      .wipe(yescode, this.state.newPin, this.state.newLabel)
      .then(() => {
        AlertBox.info("Wipe", "Card is wiped.", () => {
          this.setState({ visible: false });
          this.state.onComplete();
        });
      })
      .catch(error => {
        AlertBox.info("Error", "Something is wrong.");
      });
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
              alignItems: "center",
              marginLeft: 20,
              marginRight: 20
            }}
          >
            <Form style={{ width: "100%" }}>
              <Item>
                <Label style={{ color: Colors.primaryText }}>
                  New Password
                </Label>
                <Input
                  style={{ color: Colors.secondary }}
                  keyboardType="numeric"
                  secureTextEntry={true}
                  maxLength={4}
                  onChangeText={newPin => this.setState({ newPin })}
                />
              </Item>
              <Item>
                <Label style={{ color: Colors.primaryText }}>
                  Confirm Password
                </Label>
                <Input
                  style={{ color: Colors.secondary }}
                  keyboardType="numeric"
                  secureTextEntry={true}
                  maxLength={4}
                  onChangeText={newPinConfirm =>
                    this.setState({ newPinConfirm })
                  }
                />
              </Item>
              <Item>
                <Label style={{ color: Colors.primaryText }}>New Label</Label>
                <Input
                  style={{ color: Colors.secondary }}
                  maxLength={50}
                  onChangeText={newLabel => this.setState({ newLabel })}
                />
              </Item>
            </Form>
          </Content>
          <Button
            rounded
            block
            style={{
              backgroundColor: Colors.secondary,
              marginTop: 20,
              marginLeft: 20,
              marginRight: 20
            }}
            onPress={() => this.onPressWipe()}
          >
            <Text style={{ color: Colors.text }}>Wipe</Text>
          </Button>
          <Button
            rounded
            block
            style={{ backgroundColor: Colors.secondary, margin: 20 }}
            onPress={() => {
              this.setState({ visible: false });
              this.state.onCancel();
            }}
          >
            <Text style={{ color: Colors.text }}>Cancel</Text>
          </Button>
        </Content>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    nfcReader: state.nfcReader
  };
};

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(WipeModal);
