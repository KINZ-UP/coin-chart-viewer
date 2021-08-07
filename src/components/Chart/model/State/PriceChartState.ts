import Data, { data } from '../Data';
import Layout from '../Layout';
import scaleRange from '../../lib/scaleRange';

export default class PriceState {
  public maxPriceOnView: number = 0;
  public minPriceOnView: number = 0;
  public minMaxDiff: number = 0;

  constructor(public data: Data, public layout: Layout) {}

  public update() {
    this.maxPriceOnView = this.calcMaxPrice();
    this.minPriceOnView = this.calcMinPrice();
    this.minMaxDiff = this.calcMinMaxDiff();
  }

  private calcMaxPrice(): number {
    return this.data.dataOnView.reduce(
      (maxPrice: number, data: data | null) => {
        if (!data) return maxPrice;
        return Math.max(
          maxPrice,
          data.highPrice,
          ...Object.values(data.movingAverages).map((value) => value || 0)
        );
      },
      0
    );
  }

  private calcMinPrice(): number {
    return this.data.dataOnView.reduce(
      (minPrice: number, data: data | null) => {
        if (!data) return minPrice;
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
    const { upper } = this.layout;
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
      this.layout.upper.height,
      this.minPriceOnView,
      this.maxPriceOnView
    );
  }
}
