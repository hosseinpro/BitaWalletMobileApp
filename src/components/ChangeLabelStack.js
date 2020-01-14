import React, { Component } from "react";
import { Content, Text, Button, Item, Input, Form, Label } from "native-base";
import AlertBox from "./AlertBox";
import { connect } from "react-redux";
import redux from "../redux/redux";

class ChangeLabelStack extends Component {
  state = {
    newLabel: ""
  };

  async onPressChange() {
    if (this.state.newLabel === "") {
      await AlertBox.info("Label", "Please enter a label");
      return;
    }
    await global.tapCardModal.show(null, this.props.cardInfo, false);
    try {
      await global.bitaWalletCard.setLabel(this.state.newLabel);
      await global.bitaWalletCard.verifyPIN(this.props.pin);
      const cardInfo = {
        ...this.props.cardInfo,
        label: this.state.newLabel
      };
      this.props.setCardInfo(cardInfo);
      await info("Label", "Label is changed.");
    } catch (error) {
      await AlertBox.info("Error", "Something is wrong.");
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
    cardInfo: state.cardInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCardInfo: cardInfo => dispatch(redux.setCardInfo(cardInfo))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeLabelStack);
