import React, { Component } from "react";
import {
  Content,
  Text,
  Button,
  Item,
  Input,
  Form,
  Picker,
  DatePicker,
  Label,
  List,
  ListItem,
  Right,
  Body
} from "native-base";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import Blockchain from "../lib/Blockchain";
import { connect } from "react-redux";
import redux from "../redux/redux";
import BitaWalletCard from "../lib/BitaWalletCard";
import Coins from "../Coins";

class TransactionsTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCoin: Coins.BTC,
      selectedFee: "Regular",
      coinInfoElement: this.props.coinInfo.btc
    };
  }

  onPressRefresh() {
    let addressList = [
      "1J38WorKngZLJvA7qMin9g5jqUfTQUBZNE",
      "1DEP8i3QJCsomS4BSMY2RpU1upv62aGvhD"
    ];
    Blockchain.getAddressHistoryUnspent(addressList)
      .then(res => console.log(res))
      .catch(err => console.log(err));
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
              <Picker
                mode="dialog"
                selectedValue={this.state.selectedCoin}
                onValueChange={value => {
                  let coinInfoElement;
                  if (value === Coins.BTC) {
                    coinInfoElement = this.props.coinInfo.btc;
                  } else if (value === Coins.TST) {
                    coinInfoElement = this.props.coinInfo.tst;
                  }
                  this.setState({
                    selectedCoin: value,
                    coinInfoElement
                  });
                }}
              >
                <Picker.Item label="Bitcoin" value={Coins.BTC} />
                <Picker.Item label="Bitcoin (Testnet)" value={Coins.TST} />
              </Picker>
            </Item>
            <Item>
              <Label style={{ marginTop: 15, marginBottom: 15 }}>
                Balance :{" "}
                {BitaWalletCard.satoshi2btc(this.state.coinInfoElement.balance)}{" "}
                BTC
              </Label>
            </Item>
            <List>
              <ListItem>
                <Body>
                  <Text
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      borderRadius: 10
                    }}
                  >
                    {" +0.005 BTC "}
                  </Text>
                  <Text note>{new Date().toDateString()}</Text>
                  <Text note numberOfLines={1}>
                    From : mvyQZq6UvkMB97K9bUeHp4VVS1N7SeDzRX
                  </Text>
                </Body>
              </ListItem>
            </List>
          </Form>
        </Content>
        <Button
          rounded
          block
          style={{ backgroundColor: Colors.secondary, margin: 20 }}
          onPress={() => this.onPressRefresh()}
        >
          <Text style={{ color: Colors.text }}>Refresh</Text>
        </Button>
      </Content>
    );
  }
}

const mapStateToProps = state => {
  return {
    coinInfo: state.coinInfo
  };
};

export default connect(
  mapStateToProps,
  null
)(TransactionsTab);
