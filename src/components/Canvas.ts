import options from '../options';
import PriceChart from './PriceChart';
import GlobalState from './GlobalState';
import TrVolumeChart from './TrVolumeChart';
import debounce from '../lib/debounce';
import XAxis from './XAxis';
import formatDatetimeReqStr from '../lib/formatDatetimeReqStr';
import Wrappers from './Wrappers';
import PointerGrid from './PointerGrid';
import Subscriber from '../store/Subscriber';
import { State } from '../store';

export default class Canvas extends Subscriber {
  public canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  public wrappers: Wrappers;
  public priceChart: PriceChart;
  public trVolumeChart: TrVolumeChart;
  public xAxis: XAxis;
  public pointerGrid: PointerGrid;
  public globalState: GlobalState;
  public btnWrapper: HTMLElement | null;

  public isMouseDown: boolean = false;
  private mouseMoveStartPosX: number = 0;
  private offsetCountStart: number = 0;

  constructor(private canvasWidth: number, private canvasHeight: number) {
    super();

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
    const clientWidth = document.documentElement.clientWidth;
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
    this.globalState.updateChartBound(this.wrappers.inner);

    this.update();
  }

  private init(): void {
    if (!this.ctx) return;
    this.priceChart = new PriceChart(this.ctx);
    this.trVolumeChart = new TrVolumeChart(this.ctx);
    this.xAxis = new XAxis(this.ctx);
    this.pointerGrid = new PointerGrid(this.ctx);
    this.initFetch();
  }

  public async updateState(state: State) {
    if (this.state.market.market !== state.market.market) {
      await this.globalState.init(state.market.market);
      this.update();
    }
    this.state = state;
  }

  private async initFetch(): Promise<void> {
    await this.globalState.init(this.state.market.market);
    this.update();
  }

  private update(): void {
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateLayout();
    this.updateGlobalState();

    this.xAxis.update();
    this.priceChart.update();
    this.trVolumeChart.update();
    // this.outlines.update();
  }

  private updateGrid(): void {
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.xAxis.update();
    this.priceChart.update();
    this.trVolumeChart.update();
    this.pointerGrid.update();
  }

  private updateLayout(): void {
    this.globalState.updateLayout(this.canvas.width, this.canvas.height);
  }

  private updateGlobalState(): void {
    this.globalState.updateState();
  }

  private assignEvents(): void {
    window.addEventListener('resize', debounce(this.resize.bind(this), 100));

    this.wrappers.zoomInBtn.addEventListener('click', this.zoomIn.bind(this));
    this.wrappers.zoomOutBtn.addEventListener('click', this.zoomOut.bind(this));

    this.wrappers.inner.addEventListener(
      'mousedown',
      this.mouseDown.bind(this)
    );
    this.wrappers.inner.addEventListener('mousemove', this.mouseMove());
    this.wrappers.inner.addEventListener(
      'mouseleave',
      this.mouseLeave.bind(this)
    );
    this.wrappers.inner.addEventListener(
      'touchstart',
      this.touchStart.bind(this)
    );
    this.wrappers.inner.addEventListener('touchmove', this.touchMove());
    this.wrappers.inner.addEventListener('touchend', this.mouseUp.bind(this));
    window.addEventListener('mouseup', this.mouseUp.bind(this));
  }

  private zoomIn(): void {
    this.globalState.zoomIn();
    this.update();
  }

  private zoomOut(): void {
    this.globalState.zoomOut();
    this.update();
    this.onNeedMoreData();
  }

  private swipe(e: Touch | MouseEvent) {
    this.globalState.updatePointer({ x: e.clientX, y: e.clientY });
    if (!this.isMouseDown) {
      this.updateGrid();
      return;
    }
    const mouseMoveX = e.clientX - this.mouseMoveStartPosX;
    this.globalState.mouseMove(
      this.offsetCountStart + Math.floor(mouseMoveX / this.globalState.barWidth)
    );
    this.update();
    this.onNeedMoreData();
  }

  private mouseDown(e: MouseEvent): void {
    this.isMouseDown = true;
    this.mouseMoveStartPosX = e.clientX;
    this.offsetCountStart = this.globalState.offsetCount;
  }

  private touchStart(e: TouchEvent): void {
    this.isMouseDown = true;
    this.mouseMoveStartPosX = e.changedTouches[0].clientX;
    this.offsetCountStart = this.globalState.offsetCount;
  }

  private touchMove(): (e: TouchEvent) => void {
    return (e: TouchEvent) => this.swipe(e.changedTouches[0]);
  }

  private mouseMove(): (e: MouseEvent) => void {
    return (e: MouseEvent) => this.swipe(e);
  }

  private mouseLeave(e: MouseEvent): void {
    this.globalState.updatePointer({ x: null, y: null });
    this.updateGrid();
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
      this.state.market.market,
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
