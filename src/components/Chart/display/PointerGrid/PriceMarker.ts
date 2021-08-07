import Model from '../../model';
import chartConfig from '../../chartConfig';

export default class PriceMarker {
  constructor(public ctx: CanvasRenderingContext2D) {}

  public draw(model: Model, formatTrVolumeTick: (num: number) => string) {
    this.drawRect(model);
    this.drawPrice(model, formatTrVolumeTick);
  }

  private drawRect(model: Model) {
    const { layout, pointer } = model;

    if (!pointer.y) return;

    const height = chartConfig.pointerPriceMarker.height;
    this.ctx.fillStyle = chartConfig.pointerPriceMarker.color.background;

    const startX = layout.canvasWidth - layout.global.margin.right;
    const startY = pointer.y + layout.global.margin.top - height / 2;
    const width = layout.global.margin.right;

    this.ctx.fillRect(startX, startY, width, height);
  }

  private drawPrice(model: Model, formatTrVolumeTick: (num: number) => string) {
    const { layout, pointer, state } = model;

    if (!pointer.y) return;

    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = chartConfig.pointerPriceMarker.color.font;

    const posX =
      layout.canvasWidth -
      layout.global.margin.right +
      chartConfig.yAxis.leftPadding;

    const posY = pointer.y + layout.global.margin.top;

    const pointerPrice: string =
      pointer.y <= layout.upper.height
        ? Math.round(
            state.price.inverseScaleY(layout.upper.height - pointer.y)
          ).toLocaleString()
        : formatTrVolumeTick(
            state.trVolume.inverseScaleY(layout.global.height - pointer.y)
          );

    this.ctx.fillText(pointerPrice, posX, posY);
  }
}
