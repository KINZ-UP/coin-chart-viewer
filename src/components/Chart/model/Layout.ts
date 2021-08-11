import chartConfig from '../chartConfig';

export interface margin {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export interface layout {
  height: number;
  margin: margin;
}

type edge = 'top' | 'left' | 'bottom' | 'right';
type direction = 'VERTICAL' | 'HORIZONTAL';

export default class Layout {
  public canvasWidth: number = 0;
  public canvasHeight: number = 0;
  public width: number = 0;
  public global: layout = {
    height: 0,
    margin: { top: 0, left: 0, bottom: 0, right: 0 },
  };
  public upper: layout = {
    height: 0,
    margin: { top: 0, left: 0, bottom: 0, right: 0 },
  };
  public lower: layout = {
    height: 0,
    margin: { top: 0, left: 0, bottom: 0, right: 0 },
  };
  public gap: number;
  public settings = chartConfig.layout;
  public innerBoundingClientRect: { left: number; top: number } = {
    left: 0,
    top: 0,
  };
  public fontSize: { xAxis: number; yAxis: number } = { xAxis: 10, yAxis: 10 };

  constructor(public maxCanvasWidth: number, public maxCanvasHeight: number) {}

  public resize() {
    const { clientWidth } = document.documentElement;
    this.canvasWidth = Math.min(this.maxCanvasWidth, clientWidth);
    this.canvasHeight = chartConfig.layout.maxAspectRatio
      ? Math.min(
          this.maxCanvasHeight,
          clientWidth * chartConfig.layout.maxAspectRatio
        )
      : this.maxCanvasHeight;

    this.update();
  }

  public update(): void {
    this.updateGlobalMargin();
    this.updateWidth();
    this.updateGlobalHeight();
    this.updateGap();
    this.updateUpperHeight();
    this.updateLowerHeight();
    this.updateUpperMargin();
    this.updateLowerMargin();
    this.updateFontSize();
  }

  private updateGlobalMargin(): void {
    this.global.margin.top = this.calcGlobalMargin('top', 'VERTICAL');
    this.global.margin.left = this.calcGlobalMargin('left', 'HORIZONTAL');
    this.global.margin.bottom = this.calcGlobalMargin('bottom', 'VERTICAL');
    this.global.margin.right = this.calcGlobalMargin('right', 'HORIZONTAL');
  }

  private calcGlobalMargin(edge: edge, direction: direction): number {
    const canvasLength =
      direction === 'HORIZONTAL' ? this.canvasWidth : this.canvasHeight;
    return this.applyMinMax(
      edge,
      canvasLength * this.settings.margin.ratio[edge]
    );
  }

  private applyMinMax(edge: edge, value: number): number {
    return Math.max(
      this.settings.margin.min[edge],
      Math.min(this.settings.margin.max[edge], value)
    );
  }

  private updateWidth(): void {
    this.width =
      this.canvasWidth - this.global.margin.left - this.global.margin.right;
  }

  private updateGlobalHeight(): void {
    this.global.height =
      this.canvasHeight - this.global.margin.top - this.global.margin.bottom;
  }

  private updateGap(): void {
    this.gap = this.global.height * this.settings.gapRatio;
  }

  private updateUpperHeight(): void {
    this.upper.height =
      this.global.height * this.settings.upperHeightRatio - 0.5 * this.gap;
  }

  private updateLowerHeight(): void {
    this.lower.height =
      this.global.height * (1 - this.settings.upperHeightRatio) -
      0.5 * this.gap;
  }

  private updateUpperMargin(): void {
    this.upper.margin = { ...this.global.margin };
    this.upper.margin.bottom =
      this.canvasHeight - this.upper.margin.top - this.upper.height;
  }

  private updateLowerMargin(): void {
    this.lower.margin = { ...this.global.margin };
    this.lower.margin.top =
      this.canvasHeight - this.lower.margin.bottom - this.lower.height;
  }

  private updateFontSize() {
    const locations: ('xAxis' | 'yAxis')[] = ['xAxis', 'yAxis'];
    locations.forEach((loc: 'xAxis' | 'yAxis') => {
      const { maxFontSize, minFontSize, fontSizeRatio } = chartConfig[loc];
      this.fontSize[loc] = Math.max(
        minFontSize,
        Math.min(
          maxFontSize,
          document.documentElement.clientWidth * fontSizeRatio
        )
      );
    });
  }

  public updateInnerBoundingRect(innerWrapper: HTMLElement) {
    this.innerBoundingClientRect = innerWrapper.getBoundingClientRect();
  }
}
