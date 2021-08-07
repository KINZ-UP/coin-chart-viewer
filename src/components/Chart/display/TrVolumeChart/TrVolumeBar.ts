import chartConfig from '../../chartConfig';
import { data } from '../../model/data';
import GlobalState from '../../model/State/GlobalState';

export default class TrVolumeBar {
  public posX: number = 0;
  public baseY: number = 0;
  public width: number = 0;
  private height: number = 0;
  private isUp: boolean = true;

  constructor(
    private ctx: CanvasRenderingContext2D,
    data: data,
    idx: number,
    globalState: GlobalState,
    scaleY: (number: number) => number
  ) {
    this.posX =
      globalState.posXLeftByIdx[idx] +
      globalState.barWidth * chartConfig.barPaddingRatio.trVolumeChart;
    this.width =
      globalState.barWidth *
      (1 - 2 * chartConfig.barPaddingRatio.trVolumeChart);

    this.baseY = scaleY(0);
    this.height = scaleY(data.tradeVolume) - this.baseY;
    this.isUp = data.openPrice < data.closePrice;

    this.draw();
  }

  private draw() {
    this.ctx.fillStyle = this.isUp
      ? chartConfig.color.bar.up
      : chartConfig.color.bar.down;

    this.ctx.fillRect(this.posX, this.baseY, this.width, this.height);
  }
}
