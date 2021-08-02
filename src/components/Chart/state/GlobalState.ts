import config from '../config';
import DataLoader, { data } from './DataLoader';
import Layout from './Layout';

type Pointer = { x: number | null; y: number | null };

export default class GlobalState {
  private static instance: GlobalState | null = null;
  public layout: Layout;
  public dataLoader: DataLoader;
  public scaleLevel: number = 4;
  public numBarsOnView: number;
  public dataOnView: (data | null)[] = [];
  public offsetCount: number = 0;
  public barWidth: number = 0;
  public posXLeftByIdx: number[] = [];
  public posXCenterByIdx: number[] = [];
  public fontSize: { xAxis: number; yAxis: number } = { xAxis: 10, yAxis: 10 };
  public loading: boolean = false;
  public chartBoundingRect: { left: number; top: number } = { left: 0, top: 0 };
  public pointer: Pointer = { x: null, y: null };
  public pointerIdx: number | null = null;

  private constructor() {
    if (
      this.scaleLevel < 0 ||
      this.scaleLevel >= config.numBarsOnViewList.length
    ) {
      throw Error(
        'scale level must be in range of numbBarsOnScreenList indexes'
      );
    }
    this.layout = new Layout();
    this.dataLoader = new DataLoader();
  }

  public static getInstance(): GlobalState {
    if (GlobalState.instance === null) {
      GlobalState.instance = new GlobalState();
    }
    return GlobalState.instance;
  }

  public async init(market: string): Promise<void> {
    await this.dataLoader.init(market);
    this.offsetCount = 0;
  }

  public updateLayout(canvasWidth: number, canvasHeight: number) {
    this.layout.update(canvasWidth, canvasHeight);
    this.updateBarWidth();
    this.updatePosXList();
    this.updateFontSize();
  }

  private updateBarWidth() {
    this.barWidth = this.layout.width / this.numBarsOnView;
  }

  public updateState(): void {
    this.numBarsOnView = config.numBarsOnViewList[this.scaleLevel];
    this.updateDataOnView();
    this.updatePosXList();
  }

  public updateDataOnView(): void {
    this.dataOnView = Array(this.numBarsOnView)
      .fill(null)
      .map(
        (_, idx) => this.dataLoader.dataList[idx + this.offsetCount] ?? null
      );
  }

  public updatePosXList(): void {
    this.posXLeftByIdx = Array.from(
      { length: this.numBarsOnView },
      (_, idx: number) => this.calcPosXbyIdx(idx)
    );
    this.posXCenterByIdx = this.posXLeftByIdx.map((x) => x + this.barWidth / 2);
  }

  private calcPosXbyIdx(idx: number): number {
    return (
      this.layout.canvasWidth -
      this.barWidth * (idx + 1) -
      this.layout.global.margin.right
    );
  }

  public updateFontSize() {
    const locations: ('xAxis' | 'yAxis')[] = ['xAxis', 'yAxis'];
    locations.forEach((loc: 'xAxis' | 'yAxis') => {
      const { maxFontSize, minFontSize, fontSizeRatio } = config[loc];
      this.fontSize[loc] = Math.max(
        minFontSize,
        Math.min(
          maxFontSize,
          document.documentElement.clientWidth * fontSizeRatio
        )
      );
    });
  }

  public zoomIn(): void {
    if (this.scaleLevel <= 0) return;
    this.scaleLevel -= 1;
    this.updateState();
  }

  public zoomOut(): void {
    if (this.scaleLevel >= config.numBarsOnViewList.length - 1) return;
    this.scaleLevel += 1;
    this.updateState();
  }

  public updateChartBound(boundingElem: HTMLElement) {
    this.chartBoundingRect = boundingElem.getBoundingClientRect();
  }

  public updatePointer({ x, y }: Pointer) {
    this.pointer.x = x ? x - this.chartBoundingRect.left : null;
    this.pointer.y = y ? y - this.chartBoundingRect.top : null;
    this.pointerIdx = this.pointer.x
      ? Math.floor((this.layout.width - this.pointer.x) / this.barWidth)
      : null;
  }

  public mouseMove(offsetCount: number): void {
    this.offsetCount = Math.min(
      Math.max(offsetCount, 3 - this.numBarsOnView),
      this.dataLoader.dataList.length - this.numBarsOnView + 3
    );
    this.updateDataOnView();
  }
}
