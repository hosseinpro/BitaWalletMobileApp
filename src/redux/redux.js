import { createStore } from "redux";

const SET_CARD_INFO = "SET_CARD_INFO";
const UNSET_CARD_INFO = "UNSET_CARD_INFO";
const SET_CARD_PIN = "SET_CARD_PIN";
const SET_ADDRESS_INFO = "SET_ADDRESS_INFO";
const SET_CHANGE_KEY = "SET_CHANGE_KEY";

const initialState = {
  cardInfo: {
    serialNumber: "0000000000000000",
    type: "X",
    version: "0.0",
    label: "Unknown"
  },
  pin: null,
  addressInfo: [
    {
      address: "000000000000000"
    }
  ],
  changeKey: null
};

function setCardInfo(cardInfo) {
  return { type: SET_CARD_INFO, cardInfo };
}

function unsetCardInfo() {
  return { type: UNSET_CARD_INFO };
}

function setCardPin(pin) {
  return { type: SET_CARD_PIN, pin };
}

function setAddressInfo(addressInfo) {
  return { type: SET_ADDRESS_INFO, addressInfo };
}

function setChangeKey(changeKey) {
  return { type: SET_CHANGE_KEY, changeKey };
}

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CARD_INFO:
      return {
        ...state,
        cardInfo: action.cardInfo
      };
    case UNSET_CARD_INFO:
      return {
        ...state,
        cardInfo: initialState.cardInfo,
        pin: null
      };
    case SET_CARD_PIN:
      return {
        ...state,
        pin: action.pin
      };
    case SET_ADDRESS_INFO:
      return {
        ...state,
        addressInfo: action.addressInfo
      };
    case SET_CHANGE_KEY:
      return {
        ...state,
        changeKey: action.changeKey
      };
  }
  return state;
}

const store = createStore(rootReducer);

export default {
  store,
  setCardInfo,
  unsetCardInfo,
  setCardPin,
  setAddressInfo,
  setChangeKey
};
