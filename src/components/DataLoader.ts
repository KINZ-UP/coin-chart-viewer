import DataFetch from '../lib/api/DataFetch';
import options from '../options';

export type data = {
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  tradeVolume: number;
  dateTime: Date;
  movingAverages: movingAverageData;
};

const { openPrice, closePrice, highPrice, lowPrice, tradeVolume, dateTime } =
  options.dataProperties;

export type rawData = {
  [openPrice]: number;
  [closePrice]: number;
  [highPrice]: number;
  [lowPrice]: number;
  [tradeVolume]: number;
  [dateTime]: string;
  [key: string]: any;
};

export type movingAverageData = {
  [key: number]: number | null;
};

export default class DataLoader {
  public dataFetch: DataFetch;
  public dataList: data[] = [];
  private defaultData: data = {
    openPrice: 0,
    closePrice: 0,
    highPrice: 0,
    lowPrice: 0,
    tradeVolume: 0,
    dateTime: new Date(),
    // movingAverages: {5: null, 10: null}
    movingAverages: options.movingAverageList.reduce(
      (defaultMA, elem) => Object.assign(defaultMA, { [elem.interval]: null }),
      {}
    ),
  };

  constructor() {
    this.dataFetch = new DataFetch();
  }

  async init() {
    const rawData = await this.dataFetch.fetchData({
      market: 'KRW-BTC',
      count: 100,
    });
    this.dataProcess(rawData);
  }

  public maIntervals: number[] = options.movingAverageList.map(
    (ma) => ma.interval
  );

  public dataProcess(newData: rawData[]): void {
    newData.forEach(this.addNewData.bind(this));
  }

  private addNewData(rawData: rawData): void {
    const processed: data = {
      ...this.defaultData,
      movingAverages: { ...this.defaultData.movingAverages },
    };
    processed.openPrice = rawData[openPrice];
    processed.closePrice = rawData[closePrice];
    processed.highPrice = rawData[highPrice];
    processed.lowPrice = rawData[lowPrice];
    processed.tradeVolume = rawData[tradeVolume];
    processed.dateTime = new Date(rawData[dateTime]);
    this.dataList.push(processed);
    this.updateMeanAverageData();
  }

  private updateMeanAverageData(): void {
    const l = this.dataList.length;
    this.maIntervals.forEach((interval) => {
      // console.log(l - interval);
      if (l - interval < 0) return;
      this.dataList[l - interval].movingAverages[interval] =
        this.dataList.slice(l - interval).reduce((sum: number, d) => {
          return d.closePrice + sum;
        }, 0) / interval;
    });
  }
}
