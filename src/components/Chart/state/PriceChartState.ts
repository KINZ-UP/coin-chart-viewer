import { data } from './DataLoader';
import GlobalState from './GlobalState';
import scaleRange from '../../../lib/scaleRange';

export default class PriceChartState {
  public static instance: PriceChartState | null = null;
  globalState: GlobalState;
  public maxPriceOnView: number;
  public minPriceOnView: number;
  public minMaxDiff: number;

  private constructor() {
    this.globalState = GlobalState.getInstance();
    this.update();
  }

  public static getInstance() {
    if (PriceChartState.instance === null) {
      PriceChartState.instance = new PriceChartState();
    }
    return PriceChartState.instance;
  }

  public update(): void {
    this.maxPriceOnView = this.calcMaxPrice();
    this.minPriceOnView = this.calcMinPrice();
    this.minMaxDiff = this.calcMinMaxDiff();
  }

  public calcMaxPrice(): number {
    return this.globalState.dataOnView.reduce(
      (maxPrice: number, data: data) => {
        return Math.max(
          maxPrice,
          data.highPrice,
          ...Object.values(data.movingAverages).map((value) => value || 0)
        );
      },
      0
    );
  }

  public calcMinPrice(): number {
    return this.globalState.dataOnView.reduce(
      (minPrice: number, data: data) => {
        return Math.min(
          minPrice,
          data.lowPrice,
          ...Object.values(data.movingAverages).map(
            (value) => value || Infinity
          )
        );
      },
      Infinity
    );
  }

  private calcMinMaxDiff(): number {
    return this.maxPriceOnView - this.minPriceOnView;
  }

  public scaleY(value: number): number {
    const { upper } = this.globalState.layout;
    const yTop = upper.margin.top;
    const yBottom = yTop + upper.height;

    return scaleRange(
      value,
      this.minPriceOnView,
      this.maxPriceOnView,
      yBottom,
      yTop
    );
  }

  public inverseScaleY(y: number): number {
    return scaleRange(
      y,
      0,
      this.globalState.layout.upper.height,
      this.minPriceOnView,
      this.maxPriceOnView
    );
  }
}
