import Model from '../model';
import PriceChart from './PriceChart';
import TrVolumeChart from './TrVolumeChart';
import PointerGrid from './PointerGrid';
import XAxis from './XAxis';
import ChartWrapper from './ChartWrapper';
import Data from '../model/data';
import Pointer from '../model/Pointer';

export default class Display {
  public canvas: HTMLCanvasElement = document.createElement('canvas');
  public ctx: CanvasRenderingContext2D;
  public priceChart: PriceChart;
  public trVolumeChart: TrVolumeChart;
  public xAxis: XAxis;
  public pointerGrid: PointerGrid;
  public wrapper: ChartWrapper;

  constructor(data: Data, pointer: Pointer) {
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.priceChart = new PriceChart(this.ctx);
    this.trVolumeChart = new TrVolumeChart(this.ctx);
    this.xAxis = new XAxis(this.ctx);
    this.pointerGrid = new PointerGrid(this.ctx);
    this.wrapper = new ChartWrapper(this.canvas, data, pointer);
  }

  private draw(model: Model) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.xAxis.draw(model);
    this.priceChart.draw(model);
    this.trVolumeChart.draw(model);
  }

  private drawPointerGrid(model: Model) {
    this.pointerGrid.draw(model, this.trVolumeChart.yAxis.formatTick);
  }

  public onChange(model: Model) {
    this.draw(model);
  }

  onResize(model: Model) {
    const { layout } = model;
    this.canvas.width = layout.canvasWidth;
    this.canvas.height = layout.canvasHeight;
    this.wrapper.onResize(layout);
    this.draw(model);
  }

  onFetch(model: Model) {
    this.draw(model);
    this.wrapper.$legend.update();
  }

  onMouseMove(model: Model) {
    this.draw(model);
    this.drawPointerGrid(model);
    this.wrapper.$legend.update();
  }

  onSwipe(model: Model) {
    this.draw(model);
  }
}
