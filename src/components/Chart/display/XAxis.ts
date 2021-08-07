import Model from '../model';
import chartConfig from '../chartConfig';
import getDateString from '../lib/getDateString';
import strokeLine from '../lib/strokeLine';

export default class XAxis {
  private labelIdxs: number[] = [];
  private labels: string[] = [];

  constructor(public ctx: CanvasRenderingContext2D) {}

  private update(model: Model) {
    const { data, state, layout } = model;

    const n = Math.floor(layout.width / layout.fontSize.xAxis / 10);
    const l = state.global.numBarsOnView;

    // e.g) 1/8, 3/8, 5/8, 7/8th indexes for n = 4
    this.labelIdxs = Array(n)
      .fill(0)
      .map((_, i) => Math.round(((2 * i + 1) / (2 * n)) * l));

    this.labels = this.labelIdxs.map((idx) => {
      const dateTime = data.dataOnView[idx]?.dateTime;
      return dateTime ? getDateString(new Date(dateTime)) : '';
    });
  }

  public draw(model: Model) {
    this.update(model);

    const { state, layout } = model;
    const { fillStyle, fontFamily, topPadding } = chartConfig.xAxis;

    this.ctx.textBaseline = 'top';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = fillStyle;
    this.ctx.strokeStyle = chartConfig.color.gridLine;
    this.ctx.font = `${layout.fontSize.yAxis}px ${fontFamily}`;

    const labelPosY =
      layout.canvasHeight - layout.global.margin.bottom + topPadding;

    const upperGridStart = layout.upper.margin.top;
    const upperGridEnd = upperGridStart + layout.upper.height;

    const lowerGridStart = upperGridEnd + layout.gap;
    const lowerGridEnd = lowerGridStart + layout.lower.height;

    this.labelIdxs.forEach((idx, i) => {
      if (!this.ctx) return;
      const posX = state.global.posXCenterByIdx[idx];
      this.ctx.fillText(this.labels[i], posX, labelPosY);
      strokeLine(this.ctx, posX, upperGridStart, posX, upperGridEnd);
      strokeLine(this.ctx, posX, lowerGridStart, posX, lowerGridEnd);
    });
  }
}
