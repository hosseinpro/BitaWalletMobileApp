import { Alert } from "react-native";

const AlertBox = {
  confirm: function(title, message, confirmFunction) {
    Alert.alert(
      title,
      message,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Confirm", onPress: () => confirmFunction() }
      ],
      { cancelable: false }
    );
  },
  info: function(title, message, okFunction) {
    Alert.alert(title, message, [{ text: "Ok", onPress: () => okFunction() }], {
      cancelable: false
    });
  }
};

export default AlertBox;
