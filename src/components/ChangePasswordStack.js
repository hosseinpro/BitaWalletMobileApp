import React, { Component } from "react";
import { Content, Text, Button, Item, Input, Form, Label } from "native-base";
import AlertBox from "./AlertBox";
import { connect } from "react-redux";
import redux from "../redux/redux";

class ChangePasswordStack extends Component {
  state = {
    newPin: "",
    newPinConfirm: ""
  };

  onPressChange() {
    if (this.state.newPin === "") {
      AlertBox.info("Password", "Please enter a password");
    } else if (this.state.newPin !== this.state.newPinConfirm) {
      AlertBox.info("Password", "Passwords do not match");
    } else {
      global.tapCardModal.show(
        null,
        this.props.cardInfo,
        false,
        this.changePassword.bind(this)
      );
    }
  }

  changePassword() {
    this.props.nfcReader.bitaWalletCard
      .verifyPIN(this.props.pin)
      .then(() => {
        this.props.nfcReader.bitaWalletCard
          .changePIN(this.state.newPin)
          .then(() => {
            this.props.setCardPin(this.state.newPin);
            AlertBox.info("Password", "Password is changed.");
          });
      })
      .catch(error => {
        AlertBox.info("Error", "Something is wrong.");
      })
      .finally(this.props.navigation.navigate("MoreTab"));
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
              <Label>New Password</Label>
              <Input
                keyboardType="numeric"
                secureTextEntry={true}
                maxLength={4}
                onChangeText={newPin => this.setState({ newPin })}
              />
            </Item>
            <Item>
              <Label>Confirm Password</Label>
              <Input
                keyboardType="numeric"
                secureTextEntry={true}
                maxLength={4}
                onChangeText={newPinConfirm => this.setState({ newPinConfirm })}
              />
            </Item>
          </Form>
        </Content>
        <Button
          rounded
          block
          style={styles.button}
          onPress={() => this.onPressChange()}
        >
          <Text style={styles.button}>Change</Text>
        </Button>
      </Content>
    );
  }
}

const mapStateToProps = state => {
  return {
    nfcReader: state.nfcReader,
    cardInfo: state.cardInfo,
    pin: state.pin
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCardPin: pin => dispatch(redux.setCardPin(pin))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePasswordStack);
