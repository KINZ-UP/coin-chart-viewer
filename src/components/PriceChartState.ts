import GlobalState from './GlobalState';
import { data } from './DataLoader';

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

  public scaleHeight(value: number): number {
    return (
      ((this.maxPriceOnView - value) / this.minMaxDiff) *
        this.globalState.layout.upper.height +
      this.globalState.layout.upper.margin.top
    );
  }

  public inverseScaleHeight(height: number): number {
    return (
      this.maxPriceOnView -
      (height * this.minMaxDiff) / this.globalState.layout.upper.height
    );
  }
}
