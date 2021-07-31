import { State, Action } from '../Store';
import { Market } from '../App';

type state = {
  market: Market;
  marketList: Market[];
};

const UPDATE_MARKET_LIST = 'UPDATE_MARKET_LIST' as const;
const CHANGE_MARKET = 'CHANGE_MARKET' as const;

export const updateMarketList = (list: Market[]) => ({
  type: UPDATE_MARKET_LIST,
  payload: list,
});
export const changeMarket = (market: Market) => ({
  type: CHANGE_MARKET,
  payload: market,
});

export const initialState: state = {
  market: {
    market: 'KRW-BTC',
    korean_name: '비트코인',
    english_name: 'Bitcoin',
  },
  marketList: [],
};

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case UPDATE_MARKET_LIST: {
      return {
        ...state,
        marketList: action.payload,
      };
    }
    case CHANGE_MARKET: {
      return {
        ...state,
        market: action.payload,
      };
    }
    default:
      return state;
  }
}
