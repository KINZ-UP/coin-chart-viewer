import PriceCandle from './PriceCandle';
import PriceChartState from './PriceChartState';
import PriceChartYTick from './YTick/PriceChartYTick';

export default class PriceChart {
  public state: PriceChartState;
  public candleList: PriceCandle[] = [];
  public yTick: PriceChartYTick;

  constructor(public ctx: CanvasRenderingContext2D | null) {
    this.state = PriceChartState.getInstance();
    this.yTick = new PriceChartYTick(ctx);
  }

  public update() {
    this.state.update();
    this.draw();
  }

  private draw() {
    this.yTick.update();
    this.candleList = this.state.globalState.dataOnView.map((data, idx) => {
      const open = this.scaleHeight(data.opening_price);
      const close = this.scaleHeight(data.trade_price);
      const high = this.scaleHeight(data.high_price);
      const low = this.scaleHeight(data.low_price);

      const bodyHeight = close - open;
      const shadowHeight = low - high;
      const isUp = bodyHeight < 0;

      const candle = new PriceCandle(
        this.ctx,
        idx,
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

  private scaleHeight(value: number): number {
    return (
      ((this.state.maxPriceOnView - value) / this.state.minMaxDiff) *
        this.state.globalState.layout.upper.height +
      this.state.globalState.layout.upper.margin.top
    );
  }
}
