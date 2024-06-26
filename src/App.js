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
import { connect } from "react-redux";
import redux from "./redux/redux";
import Colors from "./Colors";
import CardTab from "./components/CardTab";
import SendTab from "./components/SendTab";
import ReceiveTab from "./components/ReceiveTab";
import TransactionsTab from "./components/TransactionsTab";
import MoreTab from "./components/MoreTab";
import ChangePinStack from "./components/ChangePinStack";
import ChangeLabelStack from "./components/ChangeLabelStack";
import BackupCardStack from "./components/BackupCardStack";
import TapCardModal from "./components/TapCardModal";
import WipeModal from "./components/WipeModal";
import PinModal from "./components/PinModal";
import WaitModal from "./components/WaitModal";
import QRCodeScannerModal from "./components/QRCodeScannerModal";

class App extends Component {
  componentDidMount() {}

  render() {
    return (
      <Container>
        <WaitModal ref={waitModal => (global.waitModal = waitModal)} />
        <TapCardModal
          ref={tapCardModal => (global.tapCardModal = tapCardModal)}
        />
        <WipeModal ref={wipeModal => (global.wipeModal = wipeModal)} />
        <PinModal ref={pinModal => (global.pinModal = pinModal)} />
        <QRCodeScannerModal
          ref={qrCodeScannerModal =>
            (global.qrCodeScannerModal = qrCodeScannerModal)
          }
        />
        <Header
          androidStatusBarColor={Colors.secondaryDark}
          style={{ backgroundColor: Colors.secondary }}
        >
          <Image
            source={require("./img/card.png")}
            style={{ width: 40, height: 40, marginTop: 5 }}
          />
          <Body style={{ marginLeft: 15 }}>
            <Title style={{ color: Colors.text }}>
              {this.props.cardInfo.label}
            </Title>
            <Subtitle style={{ color: Colors.text }}>
              {this.props.cardInfo.serialNumber}
            </Subtitle>
          </Body>
        </Header>
        <TabContainer />
      </Container>
    );
  }
}

const MoreStack = createStackNavigator(
  {
    MoreTab: {
      screen: MoreTab,
      navigationOptions: { header: null }
    },
    ChangePinStack: {
      screen: ChangePinStack,
      navigationOptions: { title: "Change PIN" }
    },
    ChangeLabelStack: {
      screen: ChangeLabelStack,
      navigationOptions: { title: "Change Label" }
    },
    BackupCardStack: {
      screen: BackupCardStack,
      navigationOptions: { title: "3-Tap Backup" }
    }
  }
  // {
  //   defaultNavigationOptions: {
  //     headerStyle: { backgroundColor: Colors.primary },
  //     headerTitleStyle: { color: Colors.secondary },
  //     headerTintColor: Colors.secondary
  //   }
  // }
);

const Tabs = createBottomTabNavigator(
  {
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
  },
  {
    tabBarOptions: {
      activeTintColor: Colors.secondary,
      style: { backgroundColor: Colors.primary }
    }
  }
);

const TabContainer = createAppContainer(Tabs);

const mapStateToProps = state => {
  return {
    cardInfo: state.cardInfo
  };
};

export default connect(mapStateToProps, null)(App);
