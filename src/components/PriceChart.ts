import MovingAverageLine from './MovingAverageLine';
import PriceCandle from './PriceCandle';
import PriceChartState from './PriceChartState';
import PriceChartYTick from './YTick/PriceChartYTick';

export default class PriceChart {
  public state: PriceChartState;
  public candleList: PriceCandle[] = [];
  public yTick: PriceChartYTick;
  public movingAverageLine: MovingAverageLine;

  constructor(public ctx: CanvasRenderingContext2D) {
    this.state = PriceChartState.getInstance();
    this.yTick = new PriceChartYTick(ctx);
    this.movingAverageLine = new MovingAverageLine(ctx);
  }

  public update() {
    this.state.update();
    this.draw();
  }

  private draw() {
    this.yTick.update();
    this.candleList = this.state.globalState.dataOnView.map((data, idx) => {
      const open = this.state.scaleHeight(data.openPrice);
      const close = this.state.scaleHeight(data.closePrice);
      const high = this.state.scaleHeight(data.highPrice);
      const low = this.state.scaleHeight(data.lowPrice);

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

    this.movingAverageLine.draw();
  }
}
