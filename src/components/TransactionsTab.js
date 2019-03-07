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
import { ScrollView } from "react-native";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import redux from "../redux/redux";
import BitaWalletCard from "../lib/BitaWalletCard";
import Coins from "../Coins";
import Discovery from "../lib/Discovery";

class TransactionsTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCoin: Coins.BTC,
      selectedFee: "Regular",
      coinInfoElement: this.props.coinInfo.btc,
      loading: false,
      txs: []
    };
  }

  onPressRefresh() {
    let coinInfoElement = "";
    if (this.state.selectedCoin === Coins.BTC)
      coinInfoElement = this.props.coinInfo.btc;
    else coinInfoElement = this.props.coinInfo.tst;

    this.setState({ loading: true });

    Discovery.getTransactionHistory(
      coinInfoElement,
      this.state.selectedCoin
    ).then(txs => {
      this.setState({ loading: false, txs });
    });
  }

  render() {
    return (
      <Content contentContainerStyle={{ flex: 1 }}>
        <Content
          contentContainerStyle={{
            flex: 1,
            marginRight: 20
          }}
        >
          <Content contentContainerStyle={{ flex: 1 }}>
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
                      coinInfoElement,
                      txs: []
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
                  {BitaWalletCard.satoshi2btc(
                    this.state.coinInfoElement.balance
                  )}{" "}
                  BTC
                </Label>
              </Item>
            </Form>
            {this.state.loading && (
              <Content
                contentContainerStyle={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text>Loading...</Text>
              </Content>
            )}
            <ScrollView>
              <List>
                {this.state.txs.map(tx => (
                  <ListItem key={tx.txHash}>
                    <Body>
                      <Text
                        style={{
                          backgroundColor: tx.send
                            ? "#db3e00" /*red*/
                            : "#008b02" /*green*/,
                          color: "white",
                          borderRadius: 10
                        }}
                      >
                        {tx.send
                          ? " - " +
                            BitaWalletCard.satoshi2btc(tx.value) +
                            " BTC "
                          : " + " +
                            BitaWalletCard.satoshi2btc(tx.value) +
                            " BTC "}
                      </Text>
                      <Text note>
                        {tx.time.toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour12: true,
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit"
                        })}
                      </Text>
                      <Text note numberOfLines={1}>
                        {tx.send
                          ? "To : " + tx.to
                          : "From : " + tx.from.toString()}
                      </Text>
                    </Body>
                  </ListItem>
                ))}
              </List>
            </ScrollView>
          </Content>
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
