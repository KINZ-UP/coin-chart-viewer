import options from '../options';
import PriceChartState from './PriceChartState';

export default class PriceCandle {
  public state: PriceChartState;

  constructor(
    public ctx: CanvasRenderingContext2D | null,
    public bodyLeft: number,
    public bodyWidth: number,
    public bodyTop: number,
    public bodyBottom: number,
    public shadowTop: number,
    public shadowBottom: number,
    public bodyHeight: number,
    public shadowHeight: number,
    public isUp: boolean
  ) {
    this.state = PriceChartState.getInstance();
  }

  public draw() {
    this.drawShadow();
    this.drawBody();
  }

  private drawBody() {
    if (!this.ctx) return;

    this.ctx.fillStyle = this.isUp
      ? options.color.candleBody.up
      : options.color.candleBody.down;
    this.ctx.fillRect(
      this.bodyLeft,
      this.bodyTop,
      this.bodyWidth,
      this.bodyHeight
    );
  }

  private drawShadow() {
    if (!this.ctx) return;

    const posXShadow = this.bodyLeft + this.state.globalState.barWidth / 2;
    this.ctx.strokeStyle = this.isUp
      ? options.color.candleShadow.up
      : options.color.candleShadow.down;
    this.ctx.beginPath();
    this.ctx.moveTo(posXShadow, this.shadowTop);
    this.ctx.lineTo(posXShadow, this.shadowBottom);
    this.ctx.stroke();
  }
}
