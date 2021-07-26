import options from '../options';
import GlobalState from './GlobalState';

export default class Outlines {
  public globalState: GlobalState = GlobalState.getInstance();
  constructor(public ctx: CanvasRenderingContext2D) {}

  public update() {
    this.drawUpperOutline();
  }

  private drawUpperOutline(): void {
    const { upper, lower, width } = this.globalState.layout;
    this.ctx.strokeStyle = options.outline.strokeStyle;
    this.ctx.strokeRect(
      upper.margin.left,
      upper.margin.top,
      width,
      upper.height
    );
    this.ctx.strokeRect(
      lower.margin.left,
      lower.margin.top,
      width,
      lower.height
    );
  }
}
