import { data } from '../../model/data';
import GlobalState from '../../model/State/GlobalState';
import chartConfig from '../../chartConfig';
import strokeLine from '../../lib/strokeLine';

export default class PriceCandle {
  public posXLeft: number;
  public posXCenter: number;
  public width: number;
  public open: number;
  public close: number;
  public high: number;
  public low: number;
  public bodyHeight: number;
  public shadowHeight: number;
  public isUp: boolean;

  constructor(
    public ctx: CanvasRenderingContext2D,
    data: data,
    idx: number,
    globalState: GlobalState,
    scaleY: (number: number) => number
  ) {
    this.open = scaleY(data.openPrice);
    this.close = scaleY(data.closePrice);
    this.high = scaleY(data.highPrice);
    this.low = scaleY(data.lowPrice);

    this.bodyHeight = this.close - this.open;
    this.shadowHeight = this.low - this.high;
    this.isUp = this.bodyHeight < 0;

    this.posXLeft =
      globalState.posXLeftByIdx[idx] +
      globalState.barWidth * chartConfig.barSpacingRatio.priceChart;

    this.posXCenter = globalState.posXCenterByIdx[idx];
    this.width =
      globalState.barWidth * (1 - 2 * chartConfig.barSpacingRatio.priceChart);

    this.draw();
  }

  private draw() {
    this.drawShadow();
    this.drawBody();
  }

  private drawBody() {
    this.ctx.fillStyle = this.isUp
      ? chartConfig.color.candleBody.up
      : chartConfig.color.candleBody.down;
    this.ctx.fillRect(this.posXLeft, this.open, this.width, this.bodyHeight);
  }

  private drawShadow() {
    this.ctx.strokeStyle = this.isUp
      ? chartConfig.color.candleShadow.up
      : chartConfig.color.candleShadow.down;

    strokeLine(this.ctx, this.posXCenter, this.high, this.posXCenter, this.low);
  }
}
