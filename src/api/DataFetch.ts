import store from '../store';
import Subscriber from '../store/Subscriber';

type dataQuery = {
  market: string;
  count?: number;
  to?: string;
};

export default class DataFetch {
  private static baseURL: string | undefined = process.env.BASE_URL;
  constructor() {}

  private setURL({ market, count, to }: dataQuery) {
    return (
      DataFetch.baseURL +
      `?market=${market}&count=${count || 10}&to=${to || ''}`
    );
  }

  public async fetchData({ market, count, to }: dataQuery) {
    const url = this.setURL({ market, count, to });
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
  }

  public static async getMarketList() {
    const url = DataFetch.baseURL + '/list';
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
  }
}
