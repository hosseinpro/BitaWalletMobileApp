import { createStore } from "redux";

const SET_CARD_INFO = "SET_CARD_INFO";
const UNSET_CARD_INFO = "UNSET_CARD_INFO";
const SET_COIN_INFO = "SET_ADDRESS_INFO";

const initialState = {
  cardInfo: {
    serialNumber: "0000000000000000",
    type: "X",
    version: "0.0",
    label: "Unknown"
  },
  coinInfo: {
    btc: {
      name: "BTC",
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
      receiveAddress: "0000000000000000000000000000000000",
      receiveAddressXPub: "",
      changeAddressXPub: ""
    },
    tst: {
      name: "TST",
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
      receiveAddress: "0000000000000000000000000000000000",
      receiveAddressXPub: "",
      changeAddressXPub: ""
    }
  }
};

function setCardInfo(cardInfo) {
  return { type: SET_CARD_INFO, cardInfo };
}

function unsetCardInfo() {
  return { type: UNSET_CARD_INFO };
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
        cardInfo: initialState.cardInfo
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
  setCoinInfo
};
