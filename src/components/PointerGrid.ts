import strokeLine from '../lib/strokeLine';
import options from '../options';
import GlobalState from './GlobalState';
import PriceChartState from './PriceChartState';
import PriceMarker from './PriceMarker';
import TrVolumnChartState from './TrVolumeChartState';

export default class PointerGrid {
  public globalState: GlobalState = GlobalState.getInstance();
  public priceChartState: PriceChartState = PriceChartState.getInstance();
  public trVolumeChartState: TrVolumnChartState =
    TrVolumnChartState.getInstance();
  public priceMarker: PriceMarker;

  constructor(public ctx: CanvasRenderingContext2D) {
    this.priceMarker = new PriceMarker(this.ctx);
  }

  public update() {
    this.draw();
    this.priceMarker.update();
  }

  private draw() {
    const { x, y } = this.globalState.pointer;
    if (!x || !y) return;

    this.ctx.strokeStyle = options.pointerGrid.color;

    const { global, width } = this.globalState.layout;
    const hztStartX = global.margin.left;
    const hztEndX = hztStartX + width;
    const hztY = this.getPointerY();

    const vtcStartY = global.margin.top;
    const vtcEndY = vtcStartY + global.height;
    const vtcX = this.getPointerX();

    strokeLine(this.ctx, hztStartX, hztY, hztEndX, hztY);
    strokeLine(this.ctx, vtcX, vtcStartY, vtcX, vtcEndY);
  }

  private getPointerX(): number {
    if (!this.globalState.pointer.x) return 0;
    const idx = Math.floor(
      (this.globalState.layout.width - this.globalState.pointer.x) /
        this.globalState.barWidth
    );
    return this.globalState.posXCenterByIdx[idx];
  }

  private getPointerY(): number {
    if (!this.globalState.pointer.y) return 0;
    return (
      this.globalState.pointer.y + this.globalState.layout.global.margin.top
    );
  }
}
