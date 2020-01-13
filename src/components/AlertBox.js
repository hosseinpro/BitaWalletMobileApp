import { Alert } from "react-native";

const AlertBox = {
  confirm: function(title, message) {
    return new Promise((resolve, reject) => {
      Alert.alert(
        title,
        message,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "Confirm", onPress: () => resolve() }
        ],
        { cancelable: false }
      );
    });
  },
  info: function(title, message) {
    return new Promise((resolve, reject) => {
      Alert.alert(
        title,
        message,
        [
          {
            text: "Ok",
            onPress: () => resolve()
          }
        ],
        {
          cancelable: false
        }
      );
    });
  }
};

export default AlertBox;
