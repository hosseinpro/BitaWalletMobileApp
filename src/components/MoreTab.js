import React, { Component } from "react";
import { Content, Text, Icon, List, ListItem, Left, Right } from "native-base";

export default class MoreTab extends Component {
  constructor(props) {
    super(props);
    global.MoreTab = this;
  }

  reset() {
    this.props.navigation.navigate("MoreTab");
  }

  render() {
    return (
      <Content contentContainerStyle={{ flex: 1, marginRight: 20 }}>
        <List>
          <ListItem
            onPress={() => this.props.navigation.navigate("ChangePinStack")}
          >
            <Left>
              <Text>Change PIN</Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          {/* <ListItem
            onPress={() => this.props.navigation.navigate("ChangeLabelStack")}
          >
            <Left>
              <Text>Change Card Label</Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem> */}
          <ListItem
            onPress={() => this.props.navigation.navigate("BackupCardStack")}
          >
            <Left>
              <Text>Backup Card</Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
        </List>
      </Content>
    );
  }
}
