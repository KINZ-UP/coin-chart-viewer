import chartConfig from '../../chartConfig';
import Data, { data } from '../Data';
import Layout from '../Layout';

export default class GlobalState {
  public scaleLevel: number = 4;
  public numBarsOnView: number = chartConfig.numBarsOnViewList[this.scaleLevel];
  public offsetCount: number = 0;
  public barWidth: number = 0;
  public posXLeftByIdx: number[] = [];
  public posXCenterByIdx: number[] = [];

  constructor(private layout: Layout) {
    this.resize();
  }

  init() {
    this.updateOffsetCount(0);
  }

  resize() {
    this.updateBarWidth();
    this.updatePosXList();
  }

  zoomIn() {
    if (this.scaleLevel <= 0) return;
    this.scaleLevel -= 1;
    this.updateNumBarsOnView();
    this.updateBarWidth();
    this.updatePosXList();
  }

  zoomOut() {
    if (this.scaleLevel >= chartConfig.numBarsOnViewList.length - 1) return;
    this.scaleLevel += 1;
    this.updateNumBarsOnView();
    this.updateBarWidth();
    this.updatePosXList();
  }

  pan() {}

  private updateNumBarsOnView() {
    this.numBarsOnView = chartConfig.numBarsOnViewList[this.scaleLevel];
  }

  private updateBarWidth() {
    this.barWidth = this.layout.width / this.numBarsOnView;
  }

  public updateOffsetCount(offsetCount: number) {
    this.offsetCount = offsetCount;
  }

  private updatePosXList(): void {
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
}
