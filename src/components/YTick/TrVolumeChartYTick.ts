import YTick from '.';
import options from '../../options';
import TrVolumeChartState from '../TrVolumeChartState';
import TickScaling from './TickScaling';

export default class TrVolumeChartYTick extends YTick {
  public state: TrVolumeChartState = TrVolumeChartState.getInstance();
  public minVal: number;
  public maxVal: number;
  constructor(public ctx: CanvasRenderingContext2D | null) {
    super(ctx);
    this.tickScale = new TickScaling(0, this.state.maxTrVolumeOnView);
  }

  public update(): void {
    this.tickScale.setMinMaxPoints(0, this.state.maxTrVolumeOnView);
    this.tickScale.calculate();
    this.draw();
  }

  public draw(): void {
    if (!this.ctx) return;
    const { fillStyle, leftPadding, maxFontSize, minFontSize, fontFamily } =
      options.yAxis.trVolumeChart;
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
    while (currY <= this.state.maxTrVolumeOnView) {
      const scaledCurrTick = this.yScale(currY);
      this.ctx.fillText(
        currY.toLocaleString(),
        this.state.globalState.layout.width + leftPadding,
        scaledCurrTick
      );
      this.ctx.beginPath();
      this.ctx.moveTo(
        this.state.globalState.layout.lower.margin.left,
        scaledCurrTick
      );
      this.ctx.lineTo(
        this.state.globalState.layout.lower.margin.left +
          this.state.globalState.layout.width,
        scaledCurrTick
      );
      this.ctx.stroke();
      currY += this.tickScale.tickSpacing;
    }
  }

  private getTickStart(): number {
    let currY = this.tickScale.minTick;
    while (currY < 0) {
      currY += this.tickScale.tickSpacing;
    }
    return currY;
  }

  private yScale(value: number): number {
    return (
      (1 - value / this.state.maxTrVolumeOnView) *
        this.state.globalState.layout.lower.height +
      this.state.globalState.layout.lower.margin.top
    );
  }
}
