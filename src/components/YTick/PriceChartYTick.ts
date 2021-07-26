import YTick from '.';
import options from '../../options';
import PriceChartState from '../PriceChartState';
import TickScaling from './TickScaling';

export default class PriceChartYTick extends YTick {
  public state: PriceChartState = PriceChartState.getInstance();
  public minVal: number;
  public maxVal: number;
  constructor(public ctx: CanvasRenderingContext2D | null) {
    super(ctx);

    this.tickScale = new TickScaling(
      this.state.minPriceOnView,
      this.state.maxPriceOnView
    );
  }

  public update(): void {
    this.tickScale.setMinMaxPoints(
      this.state.minPriceOnView,
      this.state.maxPriceOnView
    );
    this.tickScale.calculate();
    this.draw();
  }

  public draw(): void {
    if (!this.ctx) return;
    const { fillStyle, leftPadding, maxFontSize, minFontSize, fontFamily } =
      options.yAxis.priceChart;
    const fontSize = Math.max(
      minFontSize,
      Math.min(maxFontSize, window.innerWidth * 0.03)
    );

    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = fillStyle;
    this.ctx.strokeStyle = options.color.gridLine;
    this.ctx.font = `${fontSize}px ${fontFamily}`;
    let currY = this.getTickStart();
    while (currY <= this.state.maxPriceOnView) {
      const scaledCurrTick = this.yScale(currY);
      this.ctx.fillText(
        currY.toLocaleString(),
        this.state.globalState.layout.width + leftPadding,
        scaledCurrTick
      );
      this.ctx.beginPath();
      this.ctx.moveTo(
        this.state.globalState.layout.upper.margin.left,
        scaledCurrTick
      );
      this.ctx.lineTo(
        this.state.globalState.layout.upper.margin.left +
          this.state.globalState.layout.width,
        scaledCurrTick
      );
      this.ctx.stroke();
      currY += this.tickScale.tickSpacing;
    }
  }

  private getTickStart(): number {
    let currY = this.tickScale.minTick;
    while (currY < this.state.minPriceOnView) {
      currY += this.tickScale.tickSpacing;
    }
    return currY;
  }

  private yScale(value: number): number {
    return (
      ((this.state.maxPriceOnView - value) / this.state.minMaxDiff) *
        this.state.globalState.layout.upper.height +
      this.state.globalState.layout.upper.margin.top
    );
  }
}
