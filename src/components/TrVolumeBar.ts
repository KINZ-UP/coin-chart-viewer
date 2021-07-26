import options from '../options';
import TrVolumnChartState from './TrVolumeChartState';

export default class TrVolumeBar {
  public state: TrVolumnChartState;
  public posX: number;
  public width: number;

  constructor(
    public ctx: CanvasRenderingContext2D | null,
    public idx: number,
    public posY: number,
    public height: number,
    public isUp: boolean
  ) {
    this.state = TrVolumnChartState.getInstance();
    this.posX =
      this.state.globalState.posXLeftByIdx[idx] +
      this.state.globalState.barWidth * options.barPaddingRatio.trVolumeChart;
    this.width =
      this.state.globalState.barWidth *
      (1 - 2 * options.barPaddingRatio.trVolumeChart);
  }

  public draw() {
    if (!this.ctx) return;
    this.ctx.fillStyle = this.isUp
      ? options.color.candleBody.up
      : options.color.candleBody.down;

    this.ctx.fillRect(this.posX, this.posY, this.width, this.height);
  }
}
