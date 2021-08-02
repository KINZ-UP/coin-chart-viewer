import config from '../config';
import PriceChartState from '../state/PriceChartState';
import TickScaling from './TickScaling';
import strokeLine from '../../../lib/strokeLine';

export default class PriceChartYTick {
  public state: PriceChartState = PriceChartState.getInstance();
  public minVal: number;
  public maxVal: number;
  public tickScale: TickScaling;

  constructor(public ctx: CanvasRenderingContext2D) {
    this.tickScale = new TickScaling(
      this.state.minPriceOnView,
      this.state.maxPriceOnView,
      config.yAxis.maxNumTicks.priceChart
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
    const { fillStyle, leftPadding, fontFamily } = config.yAxis;
    const { layout } = this.state.globalState;

    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = fillStyle;
    this.ctx.strokeStyle = config.color.gridLine;
    this.ctx.font = `${this.state.globalState.fontSize.yAxis}px ${fontFamily}`;
    let currY = this.getTickStart();

    while (currY <= this.state.maxPriceOnView) {
      const scaledCurrTick = this.state.scaleY(currY);
      this.ctx.fillText(
        currY.toLocaleString(),
        layout.global.margin.left + layout.width + leftPadding,
        scaledCurrTick
      );
      strokeLine(
        this.ctx,
        this.state.globalState.layout.upper.margin.left,
        scaledCurrTick,
        this.state.globalState.layout.upper.margin.left +
          this.state.globalState.layout.width,
        scaledCurrTick
      );
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
}
