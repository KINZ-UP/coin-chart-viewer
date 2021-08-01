import { data } from './DataLoader';
import GlobalState from './GlobalState';
import scaleRange from '../../../lib/scaleRange';

export default class TrVolumnChartState {
  public static instance: TrVolumnChartState | null = null;
  globalState: GlobalState;
  public maxTrVolumeOnView: number;

  private constructor() {
    this.globalState = GlobalState.getInstance();
    this.update();
  }

  public static getInstance() {
    if (TrVolumnChartState.instance === null) {
      TrVolumnChartState.instance = new TrVolumnChartState();
    }
    return TrVolumnChartState.instance;
  }

  public update(): void {
    this.maxTrVolumeOnView = this.calcMaxTrVolume();
  }

  public calcMaxTrVolume(): number {
    return this.globalState.dataOnView.reduce(
      (maxTrVolume: number, data: data) => {
        return Math.max(maxTrVolume, data.tradeVolume);
      },
      0
    );
  }

  public scaleY(value: number): number {
    const yBottom =
      this.globalState.layout.canvasHeight -
      this.globalState.layout.lower.margin.bottom;
    const yTop = yBottom - this.globalState.layout.lower.height;

    return scaleRange(value, 0, this.maxTrVolumeOnView, yBottom, yTop);
  }

  public inverseScaleY(y: number): number {
    const yTop = this.globalState.layout.lower.height;
    return scaleRange(y, 0, yTop, 0, this.maxTrVolumeOnView);
  }
}
