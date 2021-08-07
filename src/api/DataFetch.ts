export type dataQuery = {
  market: string;
  count?: number;
  to?: string;
};

export default class DataFetch {
  private baseURL: string | undefined =
    process.env.NODE_ENV === 'development'
      ? process.env.BASE_URL_DEV
      : process.env.BASE_URL_PRO;

  constructor() {}

  private setURL({ market, count, to }: dataQuery) {
    return (
      this.baseURL + `?market=${market}&count=${count || 10}&to=${to || ''}`
    );
  }

  public async fetchData({ market, count, to }: dataQuery) {
    const url = this.setURL({ market, count, to });
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
  }

  public async getMarketList() {
    const url = this.baseURL + '/list';
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
  }
}
