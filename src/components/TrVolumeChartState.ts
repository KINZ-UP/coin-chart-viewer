import GlobalState from './GlobalState';
import { data } from './DataLoader';

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

  public scaleHeight(value: number): number {
    return (
      (value / this.maxTrVolumeOnView) * this.globalState.layout.lower.height
    );
  }

  public calcPosY(height: number): number {
    return (
      this.globalState.layout.lower.height -
      height +
      this.globalState.layout.lower.margin.top
    );
  }
}
