import React, { Component } from "react";
import { StackNavigator } from "react-navigation";
import { StyleSheet, Text, View, Button } from "react-native";
import NfcReader from "./lib/NfcReader";
import MainScreen from "./components/MainScreen";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nfcReader: null,
      supported: false
    };
  }

  componentDidMount() {
    const nfcReader = new NfcReader();
    nfcReader.isSupported().then(supported => {
      this.setState({ supported });
      if (supported) {
        this.setState({ nfcReader });
      }
    });
  }

  cardVerifyPIN() {
    this.state.nfcReader.bitaWalletCard
      .verifyPIN("1234")
      .then(() => {
        console.log("PIN verified");
        console.log(this.state.nfcReader.cardInfo);
      })
      .catch(error => console.log("Error:" + error.message));
  }

  render() {
    // return <AppStackNavigator />;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>My first app!</Text>
        <Button
          onPress={() =>
            this.state.nfcReader.cardDetection(this.cardVerifyPIN.bind(this))
          }
          title="cardVerifyPIN"
          color="#841584"
        />
      </View>
    );
  }
}

const AppStackNavigator = StackNavigator({
  Main: { screen: MainScreen }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});
