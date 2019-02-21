import { createStore } from "redux";

const SET_CARD_INFO = "SET_CARD_INFO";
const UNSET_CARD_INFO = "UNSET_CARD_INFO";
const SET_CARD_PIN = "SET_CARD_PIN";
const SET_COIN_INFO = "SET_ADDRESS_INFO";

const initialState = {
  cardInfo: {
    serialNumber: "0000000000000000",
    type: "X",
    version: "0.0",
    label: "Unknown"
  },
  pin: null,
  coinInfo: {
    btc: {
      addressInfo: [
        {
          address: "0000000000000000000000000000000000",
          keyPath: "00000000000000",
          txs: [
            {
              txHash:
                "0000000000000000000000000000000000000000000000000000000000000000",
              utxo: 0,
              value: 0
            }
          ]
        }
      ],
      balance: 0,
      changeKeyPath: "00000000000000",
      receiveAddress: "0000000000000000000000000000000000"
    },
    tst: {
      addressInfo: [
        {
          address: "0000000000000000000000000000000000",
          keyPath: "00000000000000",
          txs: [
            {
              txHash:
                "0000000000000000000000000000000000000000000000000000000000000000",
              utxo: 0,
              value: 0
            }
          ]
        }
      ],
      balance: 0,
      changeKeyPath: "00000000000000",
      receiveAddress: "0000000000000000000000000000000000"
    }
  }
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

function setCoinInfo(coinInfo) {
  return { type: SET_COIN_INFO, coinInfo };
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
    case SET_COIN_INFO:
      return {
        ...state,
        coinInfo: action.coinInfo
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
  setCoinInfo
};
