import React, { Component } from "react";
import { Image } from "react-native";
import { Content, Text, Button } from "native-base";
import { connect } from "react-redux";
import redux from "../redux/redux";

class CardTab extends Component {
  onPressDisconnect() {
    // global.tapCardModal.show(null, null, true);
    const cardInfo = {
      serialNumber: "11223344",
      type: "B",
      version: "1.0",
      label: "Negar"
    };
    this.props.setCardInfo(cardInfo);
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
          <Text style={{ fontSize: 16 }}>
            {this.props.cardInfo.serialNumber}
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {this.props.cardInfo.label}
          </Text>
          <Image
            source={require("../img/card.png")}
            style={{ width: 350, height: 230 }}
          />
          <Text style={{ fontSize: 20 }}>{2.5} BTC</Text>
        </Content>
        <Button
          rounded
          block
          primary
          style={{ margin: 20 }}
          onPress={() => this.onPressDisconnect()}
        >
          <Text>Disconnect</Text>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardTab);
