import MovingAverageLine from './MovingAverageLine';
import PriceCandle from './PriceCandle';
import PriceChartState from '../state/PriceChartState';
import PriceChartYTick from '../yAxis/PriceChartYTick';

export default class PriceChart {
  public state: PriceChartState = PriceChartState.getInstance();
  public candleList: PriceCandle[] = [];
  public yTick: PriceChartYTick;
  public movingAverageLine: MovingAverageLine;

  constructor(public ctx: CanvasRenderingContext2D) {
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
      const open = this.state.scaleY(data.openPrice);
      const close = this.state.scaleY(data.closePrice);
      const high = this.state.scaleY(data.highPrice);
      const low = this.state.scaleY(data.lowPrice);

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
