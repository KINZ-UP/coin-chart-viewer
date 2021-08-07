import Data, { data } from '../Data';
import Layout from '../Layout';
import scaleRange from '../../lib/scaleRange';

export default class TrVolumeChartState {
  public maxTrVolumeOnView: number = 0;

  constructor(public data: Data, public layout: Layout) {}

  public update(): void {
    this.maxTrVolumeOnView = this.calcMaxTrVolume();
  }

  private calcMaxTrVolume(): number {
    return this.data.dataOnView.reduce(
      (maxTrVolume: number, data: data | null) => {
        if (!data) return maxTrVolume;
        return Math.max(maxTrVolume, data.tradeVolume);
      },
      0
    );
  }

  public scaleY(value: number): number {
    const yBottom = this.layout.canvasHeight - this.layout.lower.margin.bottom;
    const yTop = yBottom - this.layout.lower.height;

    return scaleRange(value, 0, this.maxTrVolumeOnView, yBottom, yTop);
  }

  public inverseScaleY(y: number): number {
    const yTop = this.layout.lower.height;
    return scaleRange(y, 0, yTop, 0, this.maxTrVolumeOnView);
  }
}
