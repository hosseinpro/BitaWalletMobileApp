import { createStore } from "redux";

const SET_NFC_READER = "SET_NFC_READER";
const SET_CARD_INFO = "SET_CARD_INFO";
const UNSET_CARD_INFO = "UNSET_CARD_INFO";

const initialState = {
  nfcReader: null,
  cardInfo: {
    serialNumber: "0000000000000000",
    type: "X",
    version: "0.0",
    label: "Unknown"
  }
};

function setNfcReader(nfcReader) {
  return { type: SET_NFC_READER, nfcReader };
}

function setCardInfo(cardInfo) {
  return { type: SET_CARD_INFO, cardInfo };
}

function unsetCardInfo() {
  return { type: UNSET_CARD_INFO };
}

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case SET_NFC_READER:
      return {
        ...state,
        nfcReader: action.nfcReader
      };
    case SET_CARD_INFO:
      return {
        ...state,
        cardInfo: action.cardInfo
      };
    case UNSET_CARD_INFO:
      return {
        ...state,
        cardInfo: initialState.cardInfo
      };
  }
  return state;
}

const store = createStore(rootReducer);

export default { store, setNfcReader, setCardInfo, unsetCardInfo };
