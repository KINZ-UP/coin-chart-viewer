import DataFetch, { dataQuery } from './api/DataFetch';
import Chart from './components/Chart';
import Header from './components/Headers';
import Subscriber from './store/Subscriber';
import store, { State } from './store';
import { updateMarketList } from './store/reducer';
import { chartData, data } from './components/Chart/model/data';
import chartConfig from './components/Chart/chartConfig';
import formatDatetimeReqStr from './lib/formatDatetimeReqStr';

export type Market = {
  market: string;
  korean_name: string;
  english_name: string;
  [key: string]: string;
};

const { openPrice, closePrice, highPrice, lowPrice, tradeVolume, dateTime } =
  chartConfig.dataProperties;

export type rawData = {
  [openPrice]: number;
  [closePrice]: number;
  [highPrice]: number;
  [lowPrice]: number;
  [tradeVolume]: number;
  [dateTime]: string;
  [key: string]: any;
};

export default class App extends Subscriber {
  private dataFetch: DataFetch = new DataFetch();
  private chart: Chart;

  constructor() {
    super();
    this.init();
  }

  private async init() {
    new Header();
    this.chart = new Chart(
      '#root',
      800,
      600,
      undefined,
      this.onInitFetch.bind(this),
      this.onFetchMore.bind(this)
    );

    const fetchedList: Market[] = await this.dataFetch.getMarketList();
    store.dispatch(updateMarketList(fetchedList.filter(this.isKRW)));
  }

  public updateState(state: State) {
    if (this.state.market.market !== state.market.market) {
      this.state = state;
      this.chart.init();
    }
    if (this.state.unit !== state.unit || this.state.minute !== state.minute) {
      this.state.unit = state.unit;
      this.state.minute = state.minute;
      this.chart.init();
    }
  }

  private isKRW(market: Market) {
    return market.market.startsWith('KRW-');
  }

  async onInitFetch(): Promise<data[]> {
    const dataQuery: dataQuery = {
      market: this.state.market.market,
      unit: this.state.unit,
      minute: this.state.minute,
      count: 100,
    };
    const fetchedData: rawData = await this.dataFetch.fetchData(dataQuery);
    return fetchedData.map(this.dataProcess);
  }

  async onFetchMore(): Promise<data[]> {
    const { dataList } = this.chart.model.data;
    const dataQuery: dataQuery = {
      market: this.state.market.market,
      unit: this.state.unit,
      minute: this.state.minute,
      count: 50,
      to: formatDatetimeReqStr(dataList[dataList.length - 1].dateTime),
    };
    const fetchedData: rawData = await this.dataFetch.fetchData(dataQuery);
    return fetchedData.map(this.dataProcess);
  }

  private dataProcess(data: rawData): chartData {
    const {
      opening_price,
      trade_price,
      high_price,
      low_price,
      candle_acc_trade_volume,
      candle_date_time_kst,
    } = data;
    return {
      openPrice: opening_price,
      closePrice: trade_price,
      highPrice: high_price,
      lowPrice: low_price,
      tradeVolume: candle_acc_trade_volume,
      dateTime: new Date(candle_date_time_kst),
    };
  }
}
