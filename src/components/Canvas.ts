import options from '../options';
import PriceChart from './PriceChart';
import GlobalState from './GlobalState';
import TrVolumeChart from './TrVolumeChart';
import debounce from '../lib/debounce';
import XAxis from './XAxis';
import Outlines from './Outlines';
import formatDatetimeReqStr from '../lib/formatDatetimeReqStr';
import Wrappers from './Wrappers';

export default class Canvas {
  public canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  public wrappers: Wrappers;
  public priceChart: PriceChart;
  public trVolumeChart: TrVolumeChart;
  public xAxis: XAxis;
  public outlines: Outlines;
  public globalState: GlobalState;
  public btnWrapper: HTMLElement | null;

  public isMouseDown: boolean = false;
  private mouseMoveStartPosX: number = 0;
  private offsetCountStart: number = 0;

  constructor(private canvasWidth: number, private canvasHeight: number) {
    this.canvas = document.createElement('canvas');

    this.wrappers = new Wrappers(this.canvas);

    this.btnWrapper = document.getElementById('button-wrapper');

    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.ctx = this.canvas.getContext('2d');

    this.globalState = GlobalState.getInstance();

    this.init();
    this.resize();
    this.assignEvents();
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

    this.globalState.updateLayout(this.canvas.width, this.canvas.height);
    this.wrappers.resize();

    this.update();
  }

  private init(): void {
    if (!this.ctx) return;
    this.priceChart = new PriceChart(this.ctx);
    this.trVolumeChart = new TrVolumeChart(this.ctx);
    this.xAxis = new XAxis(this.ctx);
    // this.outlines = new Outlines(this.ctx);
    this.initFetch();
  }

  private async initFetch(): Promise<void> {
    await this.globalState.init();
    this.update();
  }

  private update(): void {
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateLayout();
    this.updateState();

    this.xAxis.update();
    this.priceChart.update();
    this.trVolumeChart.update();
    // this.outlines.update();
  }

  private updateLayout(): void {
    this.globalState.updateLayout(this.canvas.width, this.canvas.height);
  }

  private updateState(): void {
    this.globalState.updateState();
  }

  private assignEvents(): void {
    window.addEventListener('resize', debounce(this.resize.bind(this), 100));

    this.wrappers.zoomInBtn.addEventListener('click', this.zoomIn.bind(this));
    this.wrappers.zoomOutBtn.addEventListener('click', this.zoomOut.bind(this));

    this.canvas.addEventListener('mousedown', this.mouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.mouseMove.apply(this));
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
      this.onNeedMoreData();
    };
  }

  private async onNeedMoreData(): Promise<void> {
    if (this.globalState.loading) return;
    const dataList = this.globalState.dataLoader.dataList;

    if (
      dataList.length -
        this.globalState.offsetCount -
        this.globalState.dataOnView.length >=
      50
    )
      return;

    this.globalState.loading = true;
    await this.globalState.dataLoader.fetchMore(
      formatDatetimeReqStr(dataList[dataList.length - 1].dateTime)
    );
    this.update();
    this.globalState.loading = false;
  }

  private mouseUp(): void {
    this.isMouseDown = false;
    this.mouseMoveStartPosX = 0;
    this.offsetCountStart = 0;
  }
}
