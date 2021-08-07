import chartConfig from '../../chartConfig';
import Layout from '../../model/Layout';
import PriceState from '../../model/State/PriceChartState';
import TickScaling from './TickScaling';
import strokeLine from '../../lib/strokeLine';

export default class PriceChartYTick {
  public minPrice: number = 0;
  public maxPrice: number = 0;
  public tickScale: TickScaling = new TickScaling(
    0,
    0,
    chartConfig.yAxis.maxNumTicks.priceChart
  );

  constructor(public ctx: CanvasRenderingContext2D) {}

  public draw(
    layout: Layout,
    state: PriceState,
    scaleY: (num: number) => number
  ): void {
    if (!this.ctx) return;

    const { minPriceOnView, maxPriceOnView } = state;
    this.update(minPriceOnView, maxPriceOnView);

    const { fillStyle, leftPadding, fontFamily } = chartConfig.yAxis;

    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = fillStyle;
    this.ctx.strokeStyle = chartConfig.color.gridLine;
    this.ctx.font = `${layout.fontSize.yAxis}px ${fontFamily}`;
    let currY = this.getTickStart();
    while (currY <= this.maxPrice) {
      const scaledCurrTick = scaleY(currY);
      this.ctx.fillText(
        currY.toLocaleString(),
        layout.global.margin.left + layout.width + leftPadding,
        scaledCurrTick
      );
      strokeLine(
        this.ctx,
        layout.upper.margin.left,
        scaledCurrTick,
        layout.upper.margin.left + layout.width,
        scaledCurrTick
      );
      currY += this.tickScale.tickSpacing;
    }
  }

  private update(minPrice: number, maxPrice: number): void {
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.tickScale.setMinMaxPoints(minPrice, maxPrice);
    this.tickScale.calculate();
  }

  private getTickStart(): number {
    let currY = this.tickScale.minTick;
    while (currY < this.minPrice) {
      currY += this.tickScale.tickSpacing;
    }
    return currY;
  }
}
