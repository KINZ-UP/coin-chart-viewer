import Chart from './Chart';
import GlobalState from './GlobalState';
import { margin } from './Margin';
import PriceCandle from './PriceCandle';
import { PriceChartState } from './PriceChartState';

export default class PriceChart extends Chart {
  public state: PriceChartState;
  public candleList: PriceCandle[] = [];

  constructor(
    public canvas: HTMLCanvasElement,
    public ctx: CanvasRenderingContext2D | null,
    public width: number,
    public height: number,
    public margin: margin
  ) {
    super(canvas, ctx, width, height, margin);
    this.state = PriceChartState.getInstance();
  }

  public draw() {
    this.candleList = this.state.GlobalState.dataOnView.map((data, idx) => {
      const posX = this.calcCandlePosX(idx);
      const width = this.state.GlobalState.barWidth;

      const open = this.scaleHeight(data.opening_price);
      const close = this.scaleHeight(data.trade_price);
      const high = this.scaleHeight(data.high_price);
      const low = this.scaleHeight(data.low_price);

      const bodyHeight = close - open;
      const shadowHeight = low - high;
      const isUp = bodyHeight < 0;

      const candle = new PriceCandle(
        this.ctx,
        posX,
        width,
        open,
        close,
        high,
        low,
        bodyHeight,
        shadowHeight,
        isUp
      );
      candle.draw();

      return candle;
    });
  }

  private calcCandlePosX(idx: number): number {
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
      ((this.state.maxPriceOnView - value) / this.state.minMaxDiff) *
        this.state.GlobalState.upperChartHeight +
      this.state.GlobalState.upperChartMargin.top
    );
  }
}
