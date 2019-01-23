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

class App extends Component {
  componentDidMount() {
    const nfcReader = new NfcReader();
    nfcReader.isSupported().then(supported => {
      if (supported) {
        this.props.setNfcReader(nfcReader);
        global.tapCardModal.show(
          null,
          null,
          true,
          this.cardDetected.bind(this)
        );
      }
    });
    // global.tapCardModal.show(null, null, true, this.cardDetected.bind(this));
  }

  cardDetected(cardInfo) {
    global.passwordModal.show(
      "Enter Card Passcode",
      this.pinEntered.bind(this)
    );
  }

  pinEntered(pin) {
    this.props.nfcReader.cardDetection(this.verifyPIN.bind(this));
  }

  verifyPIN() {
    this.props.nfcReader.bitaWalletCard
      .verifyPIN(pin)
      .then(() => {
        console.log("PIN verified");
        this.props.setCardInfo(this.props.nfcReader.cardInfo);
        console.log(this.props.cardInfo);
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
            <Title>{this.props.cardInfo.label}</Title>
            <Subtitle style={{ fontSize: 12 }}>
              {this.props.cardInfo.serialNumber}
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

const mapStateToProps = state => {
  return {
    nfcReader: state.nfcReader,
    cardInfo: state.cardInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setNfcReader: nfcReader => dispatch(redux.setNfcReader(nfcReader)),
    setCardInfo: cardInfo => dispatch(redux.setCardInfo(cardInfo))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
