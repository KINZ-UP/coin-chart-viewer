import DataFetch from './api/DataFetch';
import Chart from './components/Chart';
import Header from './components/Header';
import Subscriber from './store/Subscriber';
import store from './store';
import { updateMarketList } from './store/reducer';

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
    new Chart(800, 600);

    const fetchedList: Market[] = await DataFetch.getMarketList();
    store.dispatch(updateMarketList(fetchedList.filter(this.isKRW)));
  }

  private isKRW(market: Market) {
    return market.market.startsWith('KRW-');
  }
}
