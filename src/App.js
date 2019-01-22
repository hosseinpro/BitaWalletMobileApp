import React, { Component } from "react";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Container, Header, Body, Title, Subtitle } from "native-base";
import { Image } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer
} from "react-navigation";

import NfcReader from "./lib/NfcReader";
import CardTab from "./components/CardTab";
import SendTab from "./components/SendTab";
import ReceiveTab from "./components/ReceiveTab";
import TransactionsTab from "./components/TransactionsTab";
import MoreTab from "./components/MoreTab";
import ChangePasswordStack from "./components/ChangePasswordStack";
import ChangeLabelStack from "./components/ChangeLabelStack";
import BackupCardStack from "./components/BackupCardStack";
import TapCardModal from "./components/TapCardModal";
import WipeModal from "./components/WipeModal";
import PasswordModal from "./components/PasswordModal";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nfcReader: null,
      supported: false
    };
    let cardInfo = {
      serialNumber: "11223344",
      type: "B",
      version: "1.0",
      label: "Hossein Spending Wallet"
    };
    global.cardInfo = cardInfo;
  }

  componentDidMount() {
    const nfcReader = new NfcReader();
    nfcReader.isSupported().then(supported => {
      this.setState({ supported });
      if (supported) {
        this.setState({ nfcReader });
      }
    });
    this.setState({ showWelcomeSreen: true });
    global.tapCardModal.show(null, null, true);
  }

  cardVerifyPIN() {
    this.state.nfcReader.bitaWalletCard
      .verifyPIN("1234")
      .then(() => {
        console.log("PIN verified");
        this.setState({ cardInfo: this.state.nfcReader.cardInfo });
        console.log(this.state.cardInfo);
      })
      .catch(error => console.log("Error:" + error.message));
  }

  render() {
    return (
      <Container>
        <TapCardModal
          ref={tapCardModal => (global.tapCardModal = tapCardModal)}
        />
        <WipeModal ref={wipeModal => (global.wipeModal = wipeModal)} />
        <PasswordModal
          ref={passwordModal => (global.passwordModal = passwordModal)}
        />
        <Header>
          <Image
            source={require("./img/card.png")}
            style={{ width: 40, height: 40, marginTop: 5 }}
          />
          <Body style={{ marginLeft: 15 }}>
            <Title>{global.cardInfo.label}</Title>
            <Subtitle style={{ fontSize: 12 }}>
              {global.cardInfo.serialNumber}
            </Subtitle>
          </Body>
        </Header>

        <TabContainer />
      </Container>
    );
  }
}

const MoreStack = createStackNavigator({
  More: {
    screen: MoreTab,
    navigationOptions: { header: null }
  },
  ChangePassword: {
    screen: ChangePasswordStack,
    navigationOptions: { title: "Change Password" }
  },
  ChangeLabel: {
    screen: ChangeLabelStack,
    navigationOptions: { title: "Change Label" }
  },

  BackupCard: {
    screen: BackupCardStack,
    navigationOptions: { title: "Backup Card" }
  }
});

const Tabs = createBottomTabNavigator({
  Card: {
    screen: CardTab,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => {
        return (
          <IconFontAwesome name="credit-card" size={25} color={tintColor} />
        );
      }
    }
  },
  Send: {
    screen: SendTab,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => {
        return <IconFontAwesome name="send-o" size={25} color={tintColor} />;
      }
    }
  },
  Receive: {
    screen: ReceiveTab,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => {
        return <IconFontAwesome name="qrcode" size={25} color={tintColor} />;
      }
    }
  },
  Transactions: {
    screen: TransactionsTab,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => {
        return <IconFontAwesome name="list" size={25} color={tintColor} />;
      }
    }
  },
  More: {
    screen: MoreStack,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => {
        return (
          <IconMaterialIcons name="more-horiz" size={25} color={tintColor} />
        );
      }
    }
  }
});

const TabContainer = createAppContainer(Tabs);
