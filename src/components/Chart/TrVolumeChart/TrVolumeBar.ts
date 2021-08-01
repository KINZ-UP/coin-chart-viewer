import config from '../config';
import GlobalState from '../state/GlobalState';

export default class TrVolumeBar {
  public globalState: GlobalState = GlobalState.getInstance();
  public posX: number;
  public baseY: number;
  public width: number;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public idx: number,
    public height: number,
    public isUp: boolean
  ) {
    (this.baseY =
      this.globalState.layout.canvasHeight -
      this.globalState.layout.lower.margin.bottom),
      (this.posX =
        this.globalState.posXLeftByIdx[idx] +
        this.globalState.barWidth * config.barPaddingRatio.trVolumeChart);
    this.width =
      this.globalState.barWidth *
      (1 - 2 * config.barPaddingRatio.trVolumeChart);
  }

  public draw() {
    if (!this.ctx) return;
    this.ctx.fillStyle = this.isUp
      ? config.color.bar.up
      : config.color.bar.down;

    this.ctx.fillRect(this.posX, this.baseY, this.width, this.height);
  }
}
