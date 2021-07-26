import { data } from '../sampleData';
import GlobalState from './GlobalState';

export default class TrVolumnChartState {
  public static instance: TrVolumnChartState | null = null;
  globalState: GlobalState;
  dataOnView: data[];
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
        return Math.max(maxTrVolume, data.candle_acc_trade_volume);
      },
      0
    );
  }
}
