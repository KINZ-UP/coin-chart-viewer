type dataQuery = {
  market: string;
  count?: number;
  to?: string;
};

export default class DataFetch {
  private baseURL: string = 'http://localhost:9000/upbit';
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
}
