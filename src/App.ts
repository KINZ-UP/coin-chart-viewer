import DataFetch from './api/DataFetch';
import Canvas from './components/Canvas';
import Header from './components/Header';
import store from './store';
import { changeMarket, updateMarketList } from './store/reducer';
import Subscriber from './store/Subscriber';

export type Market = {
  market: string;
  korean_name: string;
  english_name: string;
  [key: string]: string;
};

export default class App extends Subscriber {
  constructor() {
    super();
    this.init();
  }

  private async init() {
    new Header();
    new Canvas(800, 600);

    const fetchedList: Market[] = await DataFetch.getMarketList();
    store.dispatch(updateMarketList(fetchedList.filter(this.isKRW)));
  }

  private isKRW(market: Market) {
    return market.market.startsWith('KRW-');
  }
}
