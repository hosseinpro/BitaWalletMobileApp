import React, { Component } from "react";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  StyleSheet,
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
  Text
} from "native-base";
import WelcomeScreen from "./components/WelcomeScreen";
import NfcReader from "./lib/NfcReader";
import CardTab from "./components/CardTab";
import SendTab from "./components/SendTab";
import ReceiveTab from "./components/ReceiveTab";
import TransactionsTab from "./components/TransactionsTab";
import MoreTab from "./components/MoreTab";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nfcReader: null,
      supported: false,
      selectedTab: "cardTab"
    };
    global.welcomeScreen = React.createRef();
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
    global.welcomeScreen.show();
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

  renderSelectedTab() {
    switch (this.state.selectedTab) {
      case "cardTab":
        return (
          <CardTab
            style={{ flex: 1 }}
            serialNumber="45367833"
            label="Hossein Spending Card"
          />
        );
      case "sendTab":
        return <SendTab />;
      case "receiveTab":
        return <ReceiveTab />;
      case "transactionsTab":
        return <TransactionsTab />;
      case "moreTab":
        return <MoreTab />;
      default:
    }
  }

  render() {
    return (
      <Container>
        <WelcomeScreen
          ref={welcomeScreen => (global.welcomeScreen = welcomeScreen)}
        />
        <Header>
          <Text style={{ marginLeft: 30, fontSize: 10 }}>
            {this.state.nfcReader === null
              ? ""
              : this.state.nfcReader.cardInfo === null
              ? ""
              : this.state.nfcReader.cardInfo.label}
          </Text>
          <Text style={{ marginLeft: 30, fontSize: 10 }}>
            {this.state.nfcReader === null
              ? ""
              : this.state.nfcReader.cardInfo === null
              ? ""
              : this.state.nfcReader.cardInfo.serialNumber}
          </Text>
        </Header>
        <Content>{this.renderSelectedTab()}</Content>
        <Footer>
          <FooterTab>
            <Button
              vertical
              active={this.state.selectedTab === "cardTab"}
              onPress={() => this.setState({ selectedTab: "cardTab" })}
            >
              <IconFontAwesome name="credit-card" size={30} color="white" />
              <Text>Card</Text>
            </Button>
            <Button
              vertical
              active={this.state.selectedTab === "sendTab"}
              onPress={() => this.setState({ selectedTab: "sendTab" })}
            >
              <IconFontAwesome name="send-o" size={30} color="white" />
              <Text>Send</Text>
            </Button>
            <Button
              vertical
              active={this.state.selectedTab === "receiveTab"}
              onPress={() => this.setState({ selectedTab: "receiveTab" })}
            >
              <IconFontAwesome active name="qrcode" size={30} color="white" />
              <Text>Receive</Text>
            </Button>
            <Button
              vertical
              active={this.state.selectedTab === "transactionsTab"}
              onPress={() => this.setState({ selectedTab: "transactionsTab" })}
            >
              <IconFontAwesome name="list" size={30} color="white" />
              <Text>Txs</Text>
            </Button>
            <Button
              vertical
              active={this.state.selectedTab === "moreTab"}
              onPress={() => this.setState({ selectedTab: "moreTab" })}
            >
              <IconMaterialIcons name="more-horiz" size={30} color="white" />
              <Text>More</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
