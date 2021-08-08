import chartConfig from '../chartConfig';
import getDatetimeUnit from '../lib/getDatetimeUnit';

export type chartData = {
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  tradeVolume: number;
  dateTime: Date;
};

export type data = {
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  tradeVolume: number;
  dateTime: Date;
  movingAverages: movingAverageData;
};

export type movingAverageData = {
  [key: number]: number | null;
};

export type dateTimeUnit = 'minutes' | 'days' | 'months';

export default class Data {
  private _dataList: data[] = [];
  private _dataOnView: data[] = [];
  public loading: boolean = false;
  private maIntervals: number[] = chartConfig.movingAverageList.map(
    (ma) => ma.interval
  );
  public noMore: boolean = false;
  public unit: dateTimeUnit = 'days';

  constructor() {}

  public get dataList() {
    return this._dataList;
  }

  private set dataList(_dataList: data[]) {
    this._dataList = _dataList;
  }

  public get dataOnView() {
    return this._dataOnView;
  }

  private set dataOnView(_dataOnView: data[]) {
    this._dataOnView = _dataOnView;
  }

  init(data: data[]) {
    this.dataList = [];
    this.noMore = false;
    this.onFetch(data);
    this.unit = getDatetimeUnit(data);
  }

  onFetch(data: data[]) {
    if (data.length === 0) {
      this.noMore = true;
      return;
    }
    data.forEach((d) => {
      this.pushData(d);
    });
    this.updateMeanAverageData();
  }

  public updateDataOnView(numBarsOnView: number, offsetCount: number) {
    this.dataOnView = Array(numBarsOnView)
      .fill(null)
      .map((_, idx) => this._dataList[idx + offsetCount] ?? null);
  }

  private pushData(d: data): void {
    this.dataList.push(this.initMnAvgData(d));
    this.updateMeanAverageData();
  }

  private initMnAvgData(d: data): data {
    return {
      ...d,
      movingAverages: chartConfig.movingAverageList.reduce(
        (ma, elem) => ({ ...ma, [elem.interval]: null }),
        {}
      ),
    };
  }

  private updateMeanAverageData(): void {
    const l = this._dataList.length;
    this.maIntervals.forEach((interval) => {
      if (l - interval < 0) return;
      this._dataList[l - interval].movingAverages[interval] =
        this._dataList.slice(l - interval).reduce((sum: number, d) => {
          return d.closePrice + sum;
        }, 0) / interval;
    });
  }
}
