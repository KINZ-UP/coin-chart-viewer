import getDateString from '../lib/getDateString';
import strokeLine from '../lib/strokeLine';
import options from '../options';
import GlobalState from './GlobalState';

export default class XAxis {
  public globalState: GlobalState;
  private labelIdxs: number[] = [];
  private labels: string[] = [];

  constructor(public ctx: CanvasRenderingContext2D | null) {
    this.globalState = GlobalState.getInstance();
  }

  update() {
    const n = Math.floor(
      this.globalState.layout.width / this.globalState.fontSize.xAxis / 10
    );
    const l = this.globalState.numBarsOnView;

    // e.g) 1/8, 3/8, 5/8, 7/8th indexes for n = 4
    this.labelIdxs = Array(n)
      .fill(0)
      .map((_, i) => Math.round(((2 * i + 1) / (2 * n)) * l));

    this.labels = this.labelIdxs.map((idx) => {
      const dateTime = this.globalState.dataOnView[idx]?.dateTime;
      return dateTime ? getDateString(new Date(dateTime)) : '';
    });

    this.draw();
  }

  private draw() {
    const { fillStyle, fontFamily, topPadding } = options.xAxis;
    if (!this.ctx) return;
    this.ctx.textBaseline = 'top';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = fillStyle;
    this.ctx.strokeStyle = options.color.gridLine;
    this.ctx.font = `${this.globalState.fontSize.yAxis}px ${fontFamily}`;

    const labelPosY =
      this.globalState.layout.canvasHeight -
      this.globalState.layout.global.margin.bottom +
      topPadding;

    const upperGridStart = this.globalState.layout.upper.margin.top;
    const upperGridEnd = upperGridStart + this.globalState.layout.upper.height;

    const lowerGridStart = upperGridEnd + this.globalState.layout.gap;
    const lowerGridEnd = lowerGridStart + this.globalState.layout.lower.height;

    this.labelIdxs.forEach((idx, i) => {
      if (!this.ctx) return;
      const posX = this.globalState.posXCenterByIdx[idx];
      this.ctx.fillText(this.labels[i], posX, labelPosY);
      strokeLine(this.ctx, posX, upperGridStart, posX, upperGridEnd);
      strokeLine(this.ctx, posX, lowerGridStart, posX, lowerGridEnd);
    });
  }
}
