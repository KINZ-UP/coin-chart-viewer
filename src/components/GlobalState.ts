import options from '../options';
import { data, sampleData } from '../sampleData';
import { margin } from './Margin';

export default class GlobalState {
  private static instance: GlobalState | null = null;
  public scaleLevel: number = 4;
  public numBarsOnView: number;
  public sampleData: data[] = sampleData;
  public dataOnView: data[];
  public offsetCount: number = 0;
  public chartWidth: number = 0;
  public barWidth: number = 0;
  public upperChartHeight: number = 0;
  public lowerChartHeight: number = 0;
  public upperChartMargin: margin = {
    top: 0,
    left: 0,
    bottom: 0.5,
    right: 0,
  };
  public lowerChartMargin: margin = {
    top: 0.5,
    left: 0,
    bottom: 0,
    right: 0,
  };

  private constructor() {
    if (
      this.scaleLevel < 0 ||
      this.scaleLevel >= options.numBarsOnViewList.length
    ) {
      throw Error(
        'scale level must be in range of numbBarsOnScreenList indexes'
      );
    }

    this.updateState();
  }

  public static getInstance(): GlobalState {
    if (GlobalState.instance === null) {
      GlobalState.instance = new GlobalState();
    }
    return GlobalState.instance;
  }

  public updateGeometry(
    chartWidth: number,
    upperChartHeight: number,
    lowerChartHeight: number,
    upperChartMargin: margin,
    lowerChartMargin: margin
  ) {
    this.updateChartWidth(chartWidth);
    this.updateBarWidth();
    this.updateChartHeight(upperChartHeight, lowerChartHeight);
    this.updateChartMargin(upperChartMargin, lowerChartMargin);
  }

  private updateChartWidth(chartWidth: number) {
    this.chartWidth = chartWidth;
  }

  private updateBarWidth() {
    this.barWidth = this.chartWidth / this.numBarsOnView;
  }

  private updateChartHeight(
    upperChartHeight: number,
    lowerChartHeight: number
  ) {
    this.upperChartHeight = upperChartHeight;
    this.lowerChartHeight = lowerChartHeight;
  }

  private updateChartMargin(
    upperChartMargin: margin,
    lowerChartMargin: margin
  ) {
    this.upperChartMargin = upperChartMargin;
    this.lowerChartMargin = lowerChartMargin;
  }

  public updateState(): void {
    this.numBarsOnView = options.numBarsOnViewList[this.scaleLevel];
    this.updateDataOnView();
  }

  public updateDataOnView(): void {
    this.dataOnView = this.sampleData.slice(
      Math.max(this.offsetCount, 0),
      this.offsetCount + this.numBarsOnView
    );
  }

  public zoomIn(): void {
    if (this.scaleLevel <= 0) return;
    this.scaleLevel -= 1;
    this.updateState();
  }

  public zoomOut(): void {
    if (this.scaleLevel >= options.numBarsOnViewList.length - 1) return;
    this.scaleLevel += 1;
    this.updateState();
  }

  public mouseMove(offsetCount: number): void {
    this.offsetCount = Math.min(
      Math.max(offsetCount, 3 - this.numBarsOnView),
      this.sampleData.length - this.numBarsOnView + 3
    );
    this.updateDataOnView();
  }
}
