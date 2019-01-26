import React, { Component } from "react";
import { Modal, Image } from "react-native";
import { Content, Text, Button } from "native-base";
import { connect } from "react-redux";
import redux from "../redux/redux";
import styles from "../styles";

class TabCardModal extends Component {
  state = {
    visible: false,
    message: null,
    cardInfo: null,
    wipe: false,
    onComplete: null,
    error: false
  };

  show(message, cardInfo, wipe, onComplete) {
    this.setState({ visible: true, message, cardInfo, wipe, onComplete });
    this.props.nfcReader.cardDetection(this.cardDetected.bind(this));
  }

  cardDetected() {
    if (
      this.state.cardInfo !== null &&
      this.state.cardInfo.serialNumber !==
        this.props.nfcReader.cardInfo.serialNumber
    ) {
      this.setState({ error: true });
      this.props.nfcReader.cardDetection(this.cardDetected.bind(this));
      return;
    }

    this.state.onComplete(this.props.nfcReader.cardInfo);
    this.setState({ visible: false });
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.visible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <Content contentContainerStyle={styles.container}>
          <Content
            contentContainerStyle={{
              flex: 1,
              alignItems: "center"
            }}
          >
            <Image
              source={require("../img/card.png")}
              style={{ width: 350, height: 230 }}
            />
            <Text style={{ fontSize: 30 }}>
              {this.state.message !== null
                ? this.state.message
                : "tap your card"}
            </Text>
            <Text style={{ fontSize: 20 }}>
              {this.state.cardInfo !== null ? this.state.cardInfo.label : ""}
            </Text>
            <Text style={{ fontSize: 16 }}>
              {this.state.cardInfo !== null
                ? this.state.cardInfo.serialNumber
                : ""}
            </Text>
            <Text style={{ fontSize: 20, color: "red" }}>
              {this.state.error ? "tap correct card" : ""}
            </Text>
          </Content>
          {this.state.wipe && (
            <Button
              rounded
              block
              style={styles.button}
              onPress={() => this.setState({ visible: false })}
              // onPress={() => global.wipeModal.show()}
            >
              <Text style={styles.button}>Wipe</Text>
            </Button>
          )}
          {!this.state.wipe && (
            <Button
              rounded
              block
              style={styles.button}
              onPress={() => this.setState({ visible: false })}
            >
              <Text style={styles.button}>Cancel</Text>
            </Button>
          )}
        </Content>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    nfcReader: state.nfcReader
  };
};

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(TabCardModal);
