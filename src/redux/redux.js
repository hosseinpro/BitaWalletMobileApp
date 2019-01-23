import { createStore } from "redux";

const SET_NFC_READER = "SET_NFC_READER";
const SET_CARD_INFO = "SET_CARD_INFO";

const initialState = {
  nfcReader: null,
  cardInfo: {
    serialNumber: "11223344",
    type: "B",
    version: "1.0",
    label: "Hossein Spending Wallet"
  }
};

function setNfcReader(nfcReader) {
  return { type: SET_NFC_READER, nfcReader };
}

function setCardInfo(cardInfo) {
  return { type: SET_CARD_INFO, cardInfo };
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
  }
  return state;
}

const store = createStore(rootReducer);

export default { store, setNfcReader, setCardInfo };
