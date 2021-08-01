import options from '../options';
import GlobalState from './GlobalState';
import PriceChartState from './PriceChartState';
import TrVolumnChartState from './TrVolumeChartState';

export default class PriceMarker {
  public globalState: GlobalState = GlobalState.getInstance();
  public priceChartState: PriceChartState = PriceChartState.getInstance();
  public trVolumeChartState: TrVolumnChartState =
    TrVolumnChartState.getInstance();

  constructor(public ctx: CanvasRenderingContext2D) {}

  public update() {
    this.drawRect();
    this.drawPrice();
  }

  private drawRect() {
    if (!this.globalState.pointer.y) return;

    const height = options.pointerPriceMarker.height;
    this.ctx.fillStyle = options.pointerPriceMarker.color.background;

    const startX =
      this.globalState.layout.canvasWidth -
      this.globalState.layout.global.margin.right;
    const startY =
      this.globalState.pointer.y +
      this.globalState.layout.global.margin.top -
      height / 2;
    const width = this.globalState.layout.global.margin.right;

    this.ctx.fillRect(startX, startY, width, height);
  }

  private drawPrice() {
    if (!this.globalState.pointer.y) return;
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = options.pointerPriceMarker.color.font;

    const { layout } = this.globalState;

    const posX =
      layout.canvasWidth -
      layout.global.margin.right +
      options.yAxis.leftPadding;

    const posY = this.globalState.pointer.y + layout.global.margin.top;

    const pointerPrice =
      this.globalState.pointer.y <= layout.upper.height
        ? this.priceChartState.inverseScaleY(
            layout.upper.height - this.globalState.pointer.y
          )
        : this.trVolumeChartState.inverseScaleY(
            layout.global.height - this.globalState.pointer.y
          );

    this.ctx.fillText(Math.round(pointerPrice).toLocaleString(), posX, posY);
  }
}
