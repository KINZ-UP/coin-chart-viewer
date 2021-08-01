import config from '../config';
import PriceChartState from '../state/PriceChartState';
import strokeLine from '../../../lib/strokeLine';

export default class PriceCandle {
  public state: PriceChartState;
  public posXLeft: number;
  public posXCenter: number;
  public width: number;

  constructor(
    public ctx: CanvasRenderingContext2D | null,
    private idx: number,
    public bodyTop: number,
    public bodyBottom: number,
    public shadowTop: number,
    public shadowBottom: number,
    public bodyHeight: number,
    public shadowHeight: number,
    public isUp: boolean
  ) {
    this.state = PriceChartState.getInstance();
    this.posXLeft =
      this.state.globalState.posXLeftByIdx[this.idx] +
      this.state.globalState.barWidth * config.barPaddingRatio.priceChart;
    this.posXCenter = this.state.globalState.posXCenterByIdx[this.idx];
    this.width =
      this.state.globalState.barWidth *
      (1 - 2 * config.barPaddingRatio.priceChart);
  }

  public draw() {
    this.drawShadow();
    this.drawBody();
  }

  private drawBody() {
    if (!this.ctx) return;

    this.ctx.fillStyle = this.isUp
      ? config.color.candleBody.up
      : config.color.candleBody.down;
    this.ctx.fillRect(this.posXLeft, this.bodyTop, this.width, this.bodyHeight);
  }

  private drawShadow() {
    if (!this.ctx) return;

    this.ctx.strokeStyle = this.isUp
      ? config.color.candleShadow.up
      : config.color.candleShadow.down;

    strokeLine(
      this.ctx,
      this.posXCenter,
      this.shadowTop,
      this.posXCenter,
      this.shadowBottom
    );
  }
}
