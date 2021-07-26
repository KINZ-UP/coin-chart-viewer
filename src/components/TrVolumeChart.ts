import Chart from './Chart';
import TrVolumeBar from './TrVolumeBar';
import TrVolumnChartState from './TrVolumeChartState';
import TrVolumeChartYTick from './YTick/TrVolumeChartYTick';

export default class TrVolumeChart extends Chart {
  public state: TrVolumnChartState;
  public barList: TrVolumeBar[] = [];
  public yTick: TrVolumeChartYTick;

  constructor(public ctx: CanvasRenderingContext2D | null) {
    super(ctx);
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
      const posX = this.calcPosX(idx);
      const width = this.state.globalState.barWidth;
      const height = this.scaleHeight(data.candle_acc_trade_volume);
      const posY = this.calcPosY(height);
      const isUp = data.opening_price <= data.trade_price;
      const bar = new TrVolumeBar(this.ctx, posX, posY, width, height, isUp);

      bar.draw();
      return bar;
    });
  }

  private calcPosX(idx: number): number {
    return (
      this.state.globalState.layout.canvasWidth -
      this.state.globalState.barWidth * (idx + 1) -
      this.state.globalState.layout.lower.margin.right +
      Math.min(0, this.state.globalState.offsetCount) *
        this.state.globalState.barWidth
    );
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
