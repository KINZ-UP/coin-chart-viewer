type margin = { top: number; bottom: number; left: number; right: number };

export default class Chart {
  constructor(
    public canvas: HTMLCanvasElement,
    public ctx: CanvasRenderingContext2D | null,
    public width: number,
    public height: number,
    public margin: margin
  ) {
    // if (!this.ctx) return;
    // this.ctx.strokeStyle = '#ccc';
    // this.ctx.strokeRect(this.margin.left, this.margin.top, width, height);
    // console.log(this.margin.left, this.margin.top, width, height);
  }
}
