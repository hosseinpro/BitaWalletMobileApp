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

export default class TransactionsTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCoin: "Bitcoin",
      selectedFee: "Regular"
    };
  }

  state = {
    startDate: new Date(),
    endDate: new Date()
  };

  onPressRefresh() {
    this.setState({ startDate: new Date(), endDate: new Date() });

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
            marginLeft: 20,
            marginRight: 20
          }}
        >
          <Text
            style={{ fontWeight: "bold", marginTop: 20, color: Colors.text }}
          >
            Balance: {2.5} BTC
          </Text>
          <Form style={{ width: "100%" }}>
            <Item>
              <Picker
                mode="dialog"
                selectedValue={this.state.selectedCoin}
                onValueChange={value =>
                  this.setState({
                    selectedCoin: value
                  })
                }
              >
                <Picker.Item label="Bitcoin" value="Bitcoin" />
              </Picker>
            </Item>
            <Item>
              <Label>Start date :</Label>
              <DatePicker
                defaultDate={this.state.startDate}
                maximumDate={new Date()}
                locale={"en"}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={"fade"}
                androidMode={"default"}
                onDateChange={newDate =>
                  this.setState({ startDate: newDate, endDate: new Date() })
                }
                disabled={false}
              />
            </Item>
            <Item>
              <Label>End date :</Label>
              <DatePicker
                defaultDate={this.state.endDate}
                minimumDate={this.state.startDate}
                maximumDate={new Date()}
                locale={"en"}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={"fade"}
                androidMode={"default"}
                onDateChange={newDate => this.setState({ endDate: newDate })}
                disabled={false}
              />
            </Item>
            <Item>
              <Input placeholder="Search" />
              <IconFontAwesome name="search" />
            </Item>
            <List>
              <ListItem thumbnail>
                {/* <Left>
                  <Thumbnail
                    square
                    source={require("../img/plus.png")}
                    style={{ width: 30, height: 30 }}
                  />
                </Left> */}
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
                  <Text note numberOfLines={1}>
                    Memo : Send to Hossein
                  </Text>
                </Body>
                <Right>
                  <Button transparent>
                    <Text>View</Text>
                  </Button>
                </Right>
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
