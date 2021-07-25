import options from '../options';
import { TrVolumnChartState } from './TrVolumnChartState';

export default class TrVolumeBar {
  public state: TrVolumnChartState;

  constructor(
    public ctx: CanvasRenderingContext2D | null,
    public posX: number,
    public posY: number,
    public width: number,
    public height: number,
    public isUp: boolean
  ) {
    this.state = TrVolumnChartState.getInstance();
  }

  public draw() {
    if (!this.ctx) return;

    this.ctx.fillStyle = this.isUp
      ? options.color.candleBody.up
      : options.color.candleBody.down;

    this.ctx.fillRect(this.posX, this.posY, this.width, this.height);
  }
}
