import Wrapper from '../';
import Layout from './Layout';
import GlobalState from './State/GlobalState';

export default class Pointer {
  public x: number | null = null;
  public y: number | null = null;
  public idx: number | null = null;

  constructor(private layout: Layout, private globalState: GlobalState) {}

  public update(coord: [number, number] | null) {
    if (!coord) {
      this.x = this.y = this.idx = null;
      return;
    }

    const [x, y] = coord;
    this.x = x - this.layout.innerBoundingClientRect.left;
    this.y = y - this.layout.innerBoundingClientRect.top;
    this.idx = Math.floor(
      (this.layout.width - this.x) / this.globalState.barWidth
    );
  }
}
