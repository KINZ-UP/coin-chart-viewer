import chartConfig from '../../chartConfig';
import PriceMarker from './PriceMarker';
import strokeLine from '../../lib/strokeLine';
import Model from '../../model';
import Pointer from '../../model/Pointer';

export default class PointerGrid {
  public priceMarker: PriceMarker;

  constructor(public ctx: CanvasRenderingContext2D) {
    this.priceMarker = new PriceMarker(this.ctx);
  }

  public draw(
    model: Model,
    pointer: Pointer,
    formatTrVolumeTick: (num: number) => string
  ) {
    const { layout } = model;

    const { x, y } = pointer;
    if (!x || !y) return;

    this.ctx.strokeStyle = chartConfig.pointerGrid.color;

    const { global, width } = layout;
    const hztStartX = global.margin.left;
    const hztEndX = hztStartX + width;
    const hztY = this.getPointerY(model, pointer);

    const vtcStartY = global.margin.top;
    const vtcEndY = vtcStartY + global.height;
    const vtcX = this.getPointerX(model, pointer);

    strokeLine(this.ctx, hztStartX, hztY, hztEndX, hztY);
    strokeLine(this.ctx, vtcX, vtcStartY, vtcX, vtcEndY);

    this.priceMarker.draw(model, pointer, formatTrVolumeTick);
  }

  private getPointerX(model: Model, pointer: Pointer): number {
    const { state } = model;

    const idx = pointer.idx ?? 0;
    return state.global.posXCenterByIdx[idx];
  }

  private getPointerY(model: Model, pointer: Pointer): number {
    const { layout } = model;

    if (!pointer.y) return 0;
    return pointer.y + layout.global.margin.top;
  }
}
