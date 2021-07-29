import strokeLine from '../../lib/strokeLine';
import options from '../../options';
import PriceChartState from '../PriceChartState';
import TickScaling from './TickScaling';

export default class PriceChartYTick {
  public state: PriceChartState = PriceChartState.getInstance();
  public minVal: number;
  public maxVal: number;
  public tickScale: TickScaling;

  constructor(public ctx: CanvasRenderingContext2D | null) {
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
    const { fillStyle, leftPadding, fontFamily } = options.yAxis;
    const { layout } = this.state.globalState;

    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = fillStyle;
    this.ctx.strokeStyle = options.color.gridLine;
    this.ctx.font = `${this.state.globalState.fontSize.yAxis}px ${fontFamily}`;
    let currY = this.getTickStart();

    while (currY <= this.state.maxPriceOnView) {
      const scaledCurrTick = this.yScale(currY);
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

  private yScale(value: number): number {
    return (
      ((this.state.maxPriceOnView - value) / this.state.minMaxDiff) *
        this.state.globalState.layout.upper.height +
      this.state.globalState.layout.upper.margin.top
    );
  }
}
