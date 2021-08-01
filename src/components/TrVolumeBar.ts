import options from '../options';
import GlobalState from './GlobalState';
import TrVolumnChartState from './TrVolumeChartState';

export default class TrVolumeBar {
  public globalState: GlobalState = GlobalState.getInstance();
  public posX: number;
  public baseY: number;
  public width: number;

  constructor(
    public ctx: CanvasRenderingContext2D | null,
    public idx: number,
    public height: number,
    public isUp: boolean
  ) {
    (this.baseY =
      this.globalState.layout.canvasHeight -
      this.globalState.layout.lower.margin.bottom),
      (this.posX =
        this.globalState.posXLeftByIdx[idx] +
        this.globalState.barWidth * options.barPaddingRatio.trVolumeChart);
    this.width =
      this.globalState.barWidth *
      (1 - 2 * options.barPaddingRatio.trVolumeChart);
  }

  public draw() {
    if (!this.ctx) return;
    this.ctx.fillStyle = this.isUp
      ? options.color.bar.up
      : options.color.bar.down;

    this.ctx.fillRect(this.posX, this.baseY, this.width, this.height);
  }
}
