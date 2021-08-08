import Layout from './Layout';

export default class Pointer {
  public x: number | null = null;
  public y: number | null = null;
  public idx: number | null = null;

  constructor() {}

  public update(
    coord: [number, number] | null,
    layout: Layout,
    barWidth: number
  ) {
    if (!coord) {
      this.x = this.y = this.idx = null;
      return;
    }

    const [x, y] = coord;
    this.x = x - layout.innerBoundingClientRect.left;
    this.y = y - layout.innerBoundingClientRect.top;
    this.idx = Math.floor((layout.width - this.x) / barWidth);
  }
}
