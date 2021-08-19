import Model from '../model';
import PriceChart from './PriceChart';
import TrVolumeChart from './TrVolumeChart';
import PointerGrid from './PointerGrid';
import XAxis from './XAxis';
import Pointer from '../model/Pointer';

export default class Display {
  public canvas: HTMLCanvasElement = document.createElement('canvas');
  public ctx: CanvasRenderingContext2D;
  public priceChart: PriceChart;
  public trVolumeChart: TrVolumeChart;
  public xAxis: XAxis;
  public pointerGrid: PointerGrid | null;

  constructor() {
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.priceChart = new PriceChart(this.ctx);
    this.trVolumeChart = new TrVolumeChart(this.ctx);
    this.xAxis = new XAxis(this.ctx);
    this.pointerGrid = null;
  }

  private draw(model: Model) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.xAxis.draw(model);
    this.priceChart.draw(model);
    this.trVolumeChart.draw(model);
  }

  private drawPointerGrid(model: Model, pointer: Pointer) {
    if (!this.pointerGrid) return;
    this.pointerGrid.draw(model, pointer, this.trVolumeChart.yAxis.formatTick);
  }

  public initPointerGrid() {
    if (this.pointerGrid) return;
    this.pointerGrid = new PointerGrid(this.ctx);
  }

  public onChange(model: Model) {
    this.draw(model);
  }

  onResize(model: Model) {
    const { layout } = model;
    this.canvas.width = layout.canvasWidth;
    this.canvas.height = layout.canvasHeight;
    this.draw(model);
  }

  onFetch(model: Model) {
    this.draw(model);
  }

  onMouseMove(model: Model, pointer: Pointer) {
    this.draw(model);
    this.drawPointerGrid(model, pointer);
  }

  onSwipe(model: Model) {
    this.draw(model);
  }
}
