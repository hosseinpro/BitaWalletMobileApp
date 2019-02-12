import React, { Component } from "react";
import { Content, Text, Button, Item, Input, Form, Label } from "native-base";
import AlertBox from "./AlertBox";
import { connect } from "react-redux";
import redux from "../redux/redux";

class ChangeLabelStack extends Component {
  state = {
    newLabel: ""
  };

  onPressChange() {
    if (this.state.newLabel === "") {
      AlertBox.info("Label", "Please enter a label");
    } else {
      global.tapCardModal.show(
        null,
        this.props.cardInfo,
        false,
        this.changeLabel.bind(this)
      );
    }
  }

  changeLabel(cardInfo) {
    this.props.nfcReader.bitaWalletCard
      .verifyPIN(this.props.pin)
      .then(() => {
        this.props.nfcReader.bitaWalletCard
          .setLabel(this.state.newLabel)
          .then(() => {
            const cardInfo = {
              ...this.props.cardInfo,
              label: this.state.newLabel
            };
            this.props.setCardInfo(cardInfo);
            AlertBox.info("Label", "Label is changed.");
          });
      })
      .catch(error => {
        AlertBox.info("Error", "Something is wrong.");
      })
      .finally(this.props.navigation.navigate("MoreTab"));
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
              <Label style={{ marginTop: 15, marginBottom: 15 }}>
                Current Label : {this.props.cardInfo.label}
              </Label>
            </Item>
            <Item>
              <Label>New Label</Label>
              <Input
                maxLength={50}
                onChangeText={newLabel => this.setState({ newLabel })}
              />
            </Item>
          </Form>
        </Content>
        <Button
          rounded
          block
          style={{ backgroundColor: Colors.secondary, margin: 20 }}
          onPress={() => this.onPressChange()}
        >
          <Text style={{ color: Colors.text }}>Change</Text>
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
    setCardInfo: cardInfo => dispatch(redux.setCardInfo(cardInfo))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeLabelStack);
