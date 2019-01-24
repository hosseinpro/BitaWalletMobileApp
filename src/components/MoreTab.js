import React, { Component } from "react";
import { Text, Icon, List, ListItem, Left, Right } from "native-base";

export default class MoreTab extends Component {
  render() {
    return (
      <List>
        <ListItem
          onPress={() => this.props.navigation.navigate("ChangePasswordStack")}
        >
          <Left>
            <Text>Change Card Password</Text>
          </Left>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </ListItem>
        <ListItem
          onPress={() => this.props.navigation.navigate("ChangeLabelStack")}
        >
          <Left>
            <Text>Change Card Label</Text>
          </Left>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </ListItem>
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
    );
  }
}
