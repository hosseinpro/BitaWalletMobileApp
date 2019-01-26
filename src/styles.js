import { StyleSheet } from "react-native";

// export default (Colors = {
//   background: "#B2AFAC", //ash: soft gray
//   header: "#FFCE2B", //dandelion: yellow
//   button: "#FFCE2B", //dandelion: yellow
//   buttonText: "white",
//   navbar: "#42413D", //carbon: hard gray
//   navbarText: "white"
// });

export default (styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFCE2B", //dandelion: yellow
    color: "black"
  },
  container: {
    backgroundColor: "#B2AFAC",
    flex: 1
  },
  button: {
    backgroundColor: "#FFCE2B", //dandelion: yellow
    margin: 20,
    color: "black"
  },
  tab: {
    backgroundColor: "#42413D" //carbon: hard gray
  },
  stack: {
    backgroundColor: "#959492", //dust
    color: "black"
  },
  pass: {
    backgroundColor: "#B2AFAC",
    flex: 1,
    alignContent: "center",
    justifyContent: "center"
  }
}));
