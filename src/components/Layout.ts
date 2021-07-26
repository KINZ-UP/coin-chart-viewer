import options from '../options';

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
  public width: number;
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
  public settings = options.geoConfiguration;

  constructor() {}

  public update(canvasWidth: number, canvasHeight: number): void {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.updateGlobalMargin();
    this.updateWidth();
    this.updateGlobalHeight();
    this.updateGap();
    this.updateUpperHeight();
    this.updateLowerHeight();
    this.updateUpperMargin();
    this.updateLowerMargin();
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
}
