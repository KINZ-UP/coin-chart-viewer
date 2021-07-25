import options from '../options';
import PriceChart from './PriceChart';
import GlobalState from './GlobalState';
import Margin, { margin } from './Margin';
import TrVolumeChart from './TrVolumeChart';
import debounce from '../lib/debounce';

export default class Canvas {
  private _canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  public priceChart: PriceChart;
  public trVolumeChart: TrVolumeChart;
  public GlobalState: GlobalState;
  public geoConfiguration: {
    margin: margin;
    gap: number;
    upperHeightRatio: number;
  };
  public chartWidth: number = 0;
  public upperChartHeight: number = 0;
  public lowerChartHeight: number = 0;
  public upperChartMargin: margin = {
    top: 0,
    left: 0,
    bottom: 0.5,
    right: 0,
  };
  public lowerChartMargin: margin = {
    top: 0.5,
    left: 0,
    bottom: 0,
    right: 0,
  };

  private canvasRect: DOMRect;
  public isMouseDown: boolean = false;
  private mouseMoveStartPosX: number = 0;
  private offsetCountStart: number = 0;

  constructor(
    private canvasWidth: number,
    private canvasHeight: number,
    private maxAspectRatio?: number | null
  ) {
    this._canvas = document.createElement('canvas');
    const body = document.querySelector('body');
    body?.appendChild(this._canvas);

    this._canvas.width = canvasWidth;
    this._canvas.height = canvasHeight;
    this.maxAspectRatio = maxAspectRatio || null;
    this.ctx = this._canvas.getContext('2d');

    this.geoConfiguration = {
      margin: new Margin(
        options.geoConfiguration.marginRatio.top,
        options.geoConfiguration.marginRatio.left,
        options.geoConfiguration.marginRatio.bottom,
        options.geoConfiguration.marginRatio.right
      ),
      gap: options.geoConfiguration.gapRatio,
      upperHeightRatio: 0.7,
    };
    this.GlobalState = GlobalState.getInstance();

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
    if (this.maxAspectRatio) {
      this.canvas.height = Math.min(
        this.canvasHeight,
        clientWidth * this.maxAspectRatio
      );
    }

    this.canvasRect = this._canvas.getBoundingClientRect();
    this.update();
  }

  private init(): void {
    this.priceChart = new PriceChart(
      this.canvas,
      this.ctx,
      this.chartWidth,
      this.upperChartHeight,
      this.upperChartMargin
    );

    this.trVolumeChart = new TrVolumeChart(
      this.canvas,
      this.ctx,
      this.chartWidth,
      this.lowerChartHeight,
      this.lowerChartMargin
    );
  }

  private update(): void {
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.calcGeometry();

    this.GlobalState.updateGeometry(
      this.chartWidth,
      this.upperChartHeight,
      this.lowerChartHeight,
      this.upperChartMargin,
      this.lowerChartMargin
    );

    this.priceChart.state.update();
    this.priceChart.draw();
    this.trVolumeChart.state.update();
    this.trVolumeChart.draw();
  }

  private calcGeometry(): void {
    this.chartWidth = this.calcChartWidth();
    this.upperChartHeight = this.calcUpperChartHeight();
    this.lowerChartHeight = this.calcLowerChartHeight();
    this.upperChartMargin = this.calcUpperChartMargin();
    this.lowerChartMargin = this.calcLowerChartMargin();
  }

  private calcChartWidth(): number {
    return (
      this.canvas.width *
      (1 -
        this.geoConfiguration.margin.left -
        this.geoConfiguration.margin.right)
    );
  }

  private calcUpperChartHeight(): number {
    return (
      this.canvas.height *
      (1 -
        this.geoConfiguration.margin.top -
        this.geoConfiguration.margin.bottom) *
      this.geoConfiguration.upperHeightRatio *
      (1 - this.geoConfiguration.gap)
    );
  }

  private calcLowerChartHeight(): number {
    return (
      this.canvas.height *
      (1 -
        this.geoConfiguration.margin.top -
        this.geoConfiguration.margin.bottom) *
      (1 - this.geoConfiguration.upperHeightRatio) *
      (1 - this.geoConfiguration.gap)
    );
  }

  private calcUpperChartMargin(): margin {
    return {
      top: this.canvas.height * this.geoConfiguration.margin.top,
      left: this.canvas.width * this.geoConfiguration.margin.left,
      bottom:
        this.canvas.height * this.geoConfiguration.margin.top +
        this.upperChartHeight,
      right: this.canvas.width * this.geoConfiguration.margin.right,
    };
  }

  private calcLowerChartMargin(): margin {
    return {
      top:
        this.canvas.height *
          (this.geoConfiguration.margin.top + this.geoConfiguration.gap) +
        this.upperChartHeight,
      left: this.canvas.width * this.geoConfiguration.margin.left,
      bottom: this.canvas.height * (1 - this.geoConfiguration.margin.bottom),
      right: this.canvas.width * this.geoConfiguration.margin.right,
    };
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
    this.GlobalState.zoomIn();
    this.update();
  }

  private zoomOut(): void {
    this.GlobalState.zoomOut();
    this.update();
  }

  private mouseDown(e: MouseEvent): void {
    this.isMouseDown = true;
    this.mouseMoveStartPosX = e.clientX;
    this.offsetCountStart = this.GlobalState.offsetCount;
  }

  private mouseMove(): (e: MouseEvent) => void {
    return (e: MouseEvent) => {
      if (!this.isMouseDown) return;
      const mouseMoveX = e.clientX - this.mouseMoveStartPosX;
      this.GlobalState.mouseMove(
        this.offsetCountStart +
          Math.floor(mouseMoveX / this.GlobalState.barWidth)
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
