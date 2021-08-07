import TickScaling from './TickScaling';
import strokeLine from '../../lib/strokeLine';
import chartConfig from '../../chartConfig';
import Layout from '../../model/Layout';
import TrVolumeChartState from '../../model/State/TrVolumeChartState';

export default class TrVolumeChartYTick {
  public maxVal: number = 0;
  public tickScale: TickScaling = new TickScaling(
    0,
    0,
    chartConfig.yAxis.maxNumTicks.trVolumeChart
  );
  public formatTick: (num: number) => string;

  constructor(public ctx: CanvasRenderingContext2D) {}

  public update(maxVal: number): void {
    this.maxVal = maxVal;
    this.tickScale.setMinMaxPoints(0, maxVal);
    this.tickScale.calculate();
    this.formatTick = getformatTickFunc(this.tickScale.tickSpacing);
  }

  public draw(
    layout: Layout,
    state: TrVolumeChartState,
    scaleY: (y: number) => number
  ): void {
    this.update(state.maxTrVolumeOnView);

    const { fillStyle, leftPadding, fontFamily } = chartConfig.yAxis;

    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = fillStyle;
    this.ctx.strokeStyle = chartConfig.color.gridLine;
    this.ctx.font = `${layout.fontSize.yAxis}px ${fontFamily}`;
    let currY = this.getTickStart();

    while (currY <= this.maxVal) {
      const scaledCurrTick = scaleY(currY);
      this.ctx.fillText(
        this.formatTick(currY),
        layout.global.margin.left + layout.width + leftPadding,
        scaledCurrTick
      );

      const gridStartX = layout.lower.margin.left;
      const gridEndX = gridStartX + layout.width;
      strokeLine(
        this.ctx,
        gridStartX,
        scaledCurrTick,
        gridEndX,
        scaledCurrTick
      );
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
}

function getformatTickFunc(spacing: number): (num: number) => string {
  const digit = Math.log10(spacing) / 3;

  let divisor = 1;
  let unit = '';
  if (digit >= 3) {
    divisor = 10 ** 9;
    unit = 'G';
  } else if (digit >= 2) {
    divisor = 10 ** 6;
    unit = 'M';
  } else if (digit >= 1) {
    divisor = 10 ** 3;
    unit = 'K';
  }

  return (num: number) =>
    num === 0 ? '0' : (num / divisor).toLocaleString() + unit;
}
