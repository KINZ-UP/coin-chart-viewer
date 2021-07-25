import Chart from './Chart';
import { margin } from './Margin';
import TrVolumeBar from './TrVolumeBar';
import { TrVolumnChartState } from './TrVolumnChartState';

export default class TrVolumeChart extends Chart {
  public state: TrVolumnChartState;
  public barList: TrVolumeBar[] = [];
  constructor(
    public canvas: HTMLCanvasElement,
    public ctx: CanvasRenderingContext2D | null,
    public width: number,
    public height: number,
    public margin: margin
  ) {
    super(canvas, ctx, width, height, margin);
    this.state = TrVolumnChartState.getInstance();
  }

  public draw() {
    this.barList = this.state.GlobalState.dataOnView.map((data, idx) => {
      const posX = this.calcPosX(idx);
      const width = this.state.GlobalState.barWidth;

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
      this.canvas.width -
      this.state.GlobalState.barWidth * (idx + 1) -
      this.state.GlobalState.upperChartMargin.right +
      Math.min(0, this.state.GlobalState.offsetCount) *
        this.state.GlobalState.barWidth
    );
  }

  private scaleHeight(value: number): number {
    return (
      (value / this.state.maxTrVolumeOnView) *
      this.state.GlobalState.lowerChartHeight
    );
  }

  private calcPosY(height: number): number {
    return (
      this.state.GlobalState.lowerChartHeight -
      height +
      this.state.GlobalState.lowerChartMargin.top
    );
  }
}
