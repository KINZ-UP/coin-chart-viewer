import { Market } from '../App';

export type State = {
  market: Market;
  marketList: Market[];
  unit: string;
  minute: string | null;
};

const UPDATE_MARKET_LIST = 'UPDATE_MARKET_LIST' as const;
const CHANGE_MARKET = 'CHANGE_MARKET' as const;
const CHANGE_UNIT = 'CHANGE_UNIT' as const;
const CHANGE_UNIT_TO_MINUTE = 'CHANGE_UNIT_TO_MINUTE' as const;

export const updateMarketList = (list: Market[]) => ({
  type: UPDATE_MARKET_LIST,
  payload: list,
});
export const changeMarket = (market: Market) => ({
  type: CHANGE_MARKET,
  payload: market,
});
export const changeUnit = (unit: string) => ({
  type: CHANGE_UNIT,
  payload: unit,
});
export const changeUnitToMinute = (minute: string) => ({
  type: CHANGE_UNIT_TO_MINUTE,
  payload: minute,
});

export type Action =
  | ReturnType<typeof updateMarketList>
  | ReturnType<typeof changeMarket>
  | ReturnType<typeof changeUnit>
  | ReturnType<typeof changeUnitToMinute>;

export const initialState: State = {
  market: {
    market: 'KRW-BTC',
    korean_name: '비트코인',
    english_name: 'Bitcoin',
  },
  marketList: [],
  unit: 'days',
  minute: null,
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
    case CHANGE_UNIT: {
      return {
        ...state,
        unit: action.payload,
        minute: null,
      };
    }
    case CHANGE_UNIT_TO_MINUTE: {
      return {
        ...state,
        unit: 'minutes',
        minute: action.payload,
      };
    }
    default:
      return state;
  }
}
