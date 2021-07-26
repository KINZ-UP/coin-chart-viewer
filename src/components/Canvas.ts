import options from '../options';
import PriceChart from './PriceChart';
import GlobalState from './GlobalState';
import TrVolumeChart from './TrVolumeChart';
import debounce from '../lib/debounce';
import XAxis from './XAxis';

export default class Canvas {
  private _canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  public priceChart: PriceChart;
  public trVolumeChart: TrVolumeChart;
  public xAxis: XAxis;
  public globalState: GlobalState;

  public isMouseDown: boolean = false;
  private mouseMoveStartPosX: number = 0;
  private offsetCountStart: number = 0;

  constructor(private canvasWidth: number, private canvasHeight: number) {
    this._canvas = document.createElement('canvas');
    const body = document.querySelector('body');
    body?.appendChild(this._canvas);

    this._canvas.width = canvasWidth;
    this._canvas.height = canvasHeight;
    this.ctx = this._canvas.getContext('2d');

    this.globalState = GlobalState.getInstance();

    this.init();
    this.resize();

    this.assignEvents();
  }

  public get canvas() {
    return this._canvas;
  }

  private resize(): void {
    const clientWidth = window.innerWidth;
    this.canvas.width = Math.min(this.canvasWidth, clientWidth);
    this.canvas.height = this.canvasHeight;
    if (options.geoConfiguration.maxAspectRatio) {
      this.canvas.height = Math.min(
        this.canvasHeight,
        clientWidth * options.geoConfiguration.maxAspectRatio
      );
    }
    this.update();
  }

  private init(): void {
    this.priceChart = new PriceChart(this.ctx);
    this.trVolumeChart = new TrVolumeChart(this.ctx);
    this.xAxis = new XAxis(this.ctx);
  }

  private update(): void {
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateLayout();

    this.xAxis.update();
    this.priceChart.update();
    this.trVolumeChart.update();
  }

  private updateLayout(): void {
    this.globalState.updateLayout(this._canvas.width, this._canvas.height);
  }

  private assignEvents(): void {
    window.addEventListener('resize', debounce(this.resize.bind(this), 100));

    const zoomInBtn = document.getElementById('zoom-in');
    zoomInBtn?.addEventListener('click', this.zoomIn.bind(this));

    const zoomOutBtn = document.getElementById('zoom-out');
    zoomOutBtn?.addEventListener('click', this.zoomOut.bind(this));

    this._canvas.addEventListener('mousedown', this.mouseDown.bind(this));
    this._canvas.addEventListener('mousemove', this.mouseMove.apply(this));
    window.addEventListener('mouseup', this.mouseUp.bind(this));
  }

  private zoomIn(): void {
    this.globalState.zoomIn();
    this.update();
  }

  private zoomOut(): void {
    this.globalState.zoomOut();
    this.update();
  }

  private mouseDown(e: MouseEvent): void {
    this.isMouseDown = true;
    this.mouseMoveStartPosX = e.clientX;
    this.offsetCountStart = this.globalState.offsetCount;
  }

  private mouseMove(): (e: MouseEvent) => void {
    return (e: MouseEvent) => {
      if (!this.isMouseDown) return;
      const mouseMoveX = e.clientX - this.mouseMoveStartPosX;
      this.globalState.mouseMove(
        this.offsetCountStart +
          Math.floor(mouseMoveX / this.globalState.barWidth)
      );
      this.update();
    };
  }

  private mouseUp(): void {
    this.isMouseDown = false;
    this.mouseMoveStartPosX = 0;
    this.offsetCountStart = 0;
  }
}
