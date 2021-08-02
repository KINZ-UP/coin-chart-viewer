import config from '../config';
import GlobalState from '../state/GlobalState';
import PriceChartState from '../state/PriceChartState';
import TrVolumnChartState from '../state/TrVolumeChartState';
import PriceMarker from './PriceMarker';
import strokeLine from '../../../lib/strokeLine';

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

    this.ctx.strokeStyle = config.pointerGrid.color;

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
    const idx = this.globalState.pointerIdx ? this.globalState.pointerIdx : 0;
    return this.globalState.posXCenterByIdx[idx];
  }

  private getPointerY(): number {
    if (!this.globalState.pointer.y) return 0;
    return (
      this.globalState.pointer.y + this.globalState.layout.global.margin.top
    );
  }
}
