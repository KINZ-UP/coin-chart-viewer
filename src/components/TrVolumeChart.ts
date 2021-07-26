import TrVolumeBar from './TrVolumeBar';
import TrVolumnChartState from './TrVolumeChartState';
import TrVolumeChartYTick from './YTick/TrVolumeChartYTick';

export default class TrVolumeChart {
  public state: TrVolumnChartState;
  public barList: TrVolumeBar[] = [];
  public yTick: TrVolumeChartYTick;

  constructor(public ctx: CanvasRenderingContext2D | null) {
    this.state = TrVolumnChartState.getInstance();
    this.yTick = new TrVolumeChartYTick(ctx);
  }

  public update() {
    this.state.update();
    this.draw();
  }

  private draw() {
    this.yTick.update();
    this.barList = this.state.globalState.dataOnView.map((data, idx) => {
      const height = this.scaleHeight(data.candle_acc_trade_volume);
      const posY = this.calcPosY(height);
      const isUp = data.opening_price <= data.trade_price;
      const bar = new TrVolumeBar(this.ctx, idx, posY, height, isUp);

      bar.draw();
      return bar;
    });
  }

  private scaleHeight(value: number): number {
    return (
      (value / this.state.maxTrVolumeOnView) *
      this.state.globalState.layout.lower.height
    );
  }

  private calcPosY(height: number): number {
    return (
      this.state.globalState.layout.lower.height -
      height +
      this.state.globalState.layout.lower.margin.top
    );
  }
}
