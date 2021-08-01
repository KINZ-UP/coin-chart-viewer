import config from '../config';
import DataFetch from '../../../api/DataFetch';

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
  config.dataProperties;

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
  public rawDataList: rawData[] = [];
  private defaultData: data = {
    openPrice: 0,
    closePrice: 0,
    highPrice: 0,
    lowPrice: 0,
    tradeVolume: 0,
    dateTime: new Date(),

    // movingAverages: {5: null, 10: null}
    movingAverages: config.movingAverageList.reduce(
      (defaultMA, elem) => Object.assign(defaultMA, { [elem.interval]: null }),
      {}
    ),
  };

  constructor() {
    this.dataFetch = new DataFetch();
  }

  async init(market: string) {
    this.dataList = [];
    const rawData = await this.dataFetch.fetchData({
      market,
      count: 100,
    });
    this.dataProcess(rawData);
  }

  public async fetchMore(market: string, to: string): Promise<void> {
    try {
      const rawData = await this.dataFetch.fetchData({
        market,
        count: 50,
        to,
      });
      this.dataProcess(rawData);
    } catch (e) {
      console.log(e);
    }
  }

  public maIntervals: number[] = config.movingAverageList.map(
    (ma) => ma.interval
  );

  public dataProcess(newData: rawData[]): void {
    this.rawDataList = this.rawDataList.concat(newData);
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
