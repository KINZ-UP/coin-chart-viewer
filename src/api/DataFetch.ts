export type dataQuery = {
  market: string;
  count?: number;
  to?: string;
  unit?: string;
  minute?: string | null;
};

export default class DataFetch {
  private baseURL: string | undefined =
    process.env.NODE_ENV === 'development'
      ? process.env.BASE_URL_DEV
      : process.env.BASE_URL_PRO;

  constructor() {}

  private setURL({ market, count, to, unit, minute }: dataQuery) {
    return (
      this.baseURL +
      `?unit=${unit || 'days'}${
        minute ? '&minute=' + minute : ''
      }&market=${market}&count=${count || 10}&to=${to || ''}`
    );
  }

  public async fetchData({ market, count, to, unit, minute }: dataQuery) {
    const url = this.setURL({ market, count, to, unit, minute });
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
