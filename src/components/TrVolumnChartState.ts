import { data, sampleData } from '../sampleData';
import GlobalState from './GlobalState';

export class TrVolumnChartState {
  public static instance: TrVolumnChartState | null = null;
  GlobalState: GlobalState;
  dataOnView: data[];
  public maxTrVolumeOnView: number;

  private constructor() {
    this.GlobalState = GlobalState.getInstance();
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
    return this.GlobalState.dataOnView.reduce(
      (maxTrVolume: number, data: data) => {
        return Math.max(maxTrVolume, data.candle_acc_trade_volume);
      },
      0
    );
  }
}
