import options from '../options';
import { data, sampleData } from '../sampleData';
import Layout, { margin } from './Layout';

export default class GlobalState {
  private static instance: GlobalState | null = null;
  public layout: Layout;
  public scaleLevel: number = 4;
  public numBarsOnView: number;
  public sampleData: data[] = sampleData;
  public dataOnView: data[];
  public offsetCount: number = 0;
  public barWidth: number = 0;

  private constructor() {
    if (
      this.scaleLevel < 0 ||
      this.scaleLevel >= options.numBarsOnViewList.length
    ) {
      throw Error(
        'scale level must be in range of numbBarsOnScreenList indexes'
      );
    }

    this.layout = new Layout();
    this.updateState();
  }

  public static getInstance(): GlobalState {
    if (GlobalState.instance === null) {
      GlobalState.instance = new GlobalState();
    }
    return GlobalState.instance;
  }

  public updateLayout(canvasWidth: number, canvasHeight: number) {
    this.layout.update(canvasWidth, canvasHeight);
    this.updateBarWidth();
  }

  private updateBarWidth() {
    this.barWidth = this.layout.width / this.numBarsOnView;
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
