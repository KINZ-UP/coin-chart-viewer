import { data } from './model/data';
import Model from './model';
import Display from './display';
import Control from './control';
import ChartWrapper from './ChartWrapper';
import debounce from './lib/debounce';

type FetchOption = {
  staticData?: data[];
  onInitFetch?: () => Promise<data[]>;
  onFetchMore?: () => Promise<data[]>;
  onFetchError?: () => void;
};

export default class Chart {
  public model: Model;
  public display: Display;
  public control: Control;
  public wrapper: ChartWrapper;

  constructor(
    maxCanvasWidth: number,
    maxCanvasHeight: number,
    $parentElem: HTMLElement | null,
    private fetchOption?: FetchOption
  ) {
    this.model = new Model(maxCanvasWidth, maxCanvasHeight);
    this.display = new Display();
    this.control = new Control();
    this.wrapper = new ChartWrapper(this.display.canvas, $parentElem);

    this.resize();
    this.init();

    window.addEventListener('resize', debounce(this.resize.bind(this), 100));
  }

  private resize(): void {
    this.model.resize();
    this.display.onResize(this.model);
    this.wrapper.onResize(this.model.layout);
    this.model.layout.updateInnerBoundingRect(this.wrapper.$inner);
  }

  private assingStaticData() {
    if (!this.fetchOption?.staticData) return;
    this.model.init(this.fetchOption.staticData);
  }

  public async init(): Promise<void> {
    this.assingStaticData();
    if (!this.fetchOption?.onInitFetch) return;
    this.wrapper.startLoading();
    try {
      const data = await this.fetchOption.onInitFetch();
      this.model.init(data);
      this.display.onFetch(this.model);
      this.display.initPointerGrid();
      this.wrapper.renderLegend();
      this.wrapper.update(this.model.data, this.control.pointer);
      this.assignEvents();
    } catch (e) {
      if (this.fetchOption.onFetchError) this.fetchOption.onFetchError();
    }
    this.wrapper.finishLoading();
  }

  private async onNeedMoreData(): Promise<void> {
    if (!this.fetchOption?.onFetchMore) return;
    if (this.model.data.noMore) return;
    if (this.model.loading) return;

    const dataList = this.model.data.dataList;
    if (
      dataList.length -
        this.model.state.global.offsetCount -
        this.model.data.dataOnView.length >=
      50
    )
      return;

    this.wrapper.startLoading();
    try {
      const data = await this.fetchOption.onFetchMore();
      this.model.onFetch(data);
      this.display.onFetch(this.model);
      this.wrapper.update(this.model.data, this.control.pointer);
    } catch (e) {
      if (this.fetchOption.onFetchError) this.fetchOption.onFetchError();
    }
    this.wrapper.finishLoading();
  }

  private assignEvents(): void {
    this.wrapper.$zoomInBtn.addEventListener('click', this.zoomIn.bind(this));
    this.wrapper.$zoomOutBtn.addEventListener('click', this.zoomOut.bind(this));

    this.wrapper.$inner.addEventListener(
      'mousedown',
      this.mouseDown.bind(this)
    );
    this.wrapper.$inner.addEventListener('mousemove', this.mouseMove());
    this.wrapper.$inner.addEventListener(
      'mouseleave',
      this.mouseLeave.bind(this)
    );
    this.wrapper.$inner.addEventListener(
      'touchstart',
      this.touchStart.bind(this)
    );
    this.wrapper.$inner.addEventListener('touchmove', this.touchMove());
    this.wrapper.$inner.addEventListener('touchend', this.mouseUp.bind(this));
    window.addEventListener('mouseup', this.mouseUp.bind(this));
  }

  private zoomIn(): void {
    this.model.zoomIn();
    this.display.onChange(this.model);
  }

  private zoomOut(): void {
    this.model.zoomOut();
    this.display.onChange(this.model);
    this.onNeedMoreData();
  }

  private onMove(e: Touch | MouseEvent) {
    this.control.onMouseMove(
      [e.clientX, e.clientY],
      this.model.layout,
      this.model.state.global.barWidth
    );
    if (!this.control.isMouseDown) {
      this.display.onMouseMove(this.model, this.control.pointer);
      this.wrapper.update(this.model.data, this.control.pointer);
      return;
    }

    const mouseMoveX = e.clientX - this.control.mouseMoveStartPosX;
    this.model.onSwipe(
      this.control.offsetCountStart +
        Math.floor(mouseMoveX / this.model.state.global.barWidth)
    );
    this.display.onSwipe(this.model);
    this.onNeedMoreData();
  }

  private mouseDown(e: MouseEvent): void {
    this.control.mouseDown(e.clientX, this.model.state.global.offsetCount);
  }

  private touchStart(e: TouchEvent): void {
    this.control.mouseDown(
      e.changedTouches[0].clientX,
      this.model.state.global.offsetCount
    );
  }

  private touchMove(): (e: TouchEvent) => void {
    return (e: TouchEvent) => this.onMove(e.changedTouches[0]);
  }

  private mouseMove(): (e: MouseEvent) => void {
    return (e: MouseEvent) => this.onMove(e);
  }

  private mouseLeave(): void {
    this.control.onMouseMove(
      null,
      this.model.layout,
      this.model.state.global.barWidth
    );
    this.display.onMouseMove(this.model, this.control.pointer);
    this.wrapper.update(this.model.data, this.control.pointer);
  }

  private mouseUp(): void {
    this.control.mouseUp();
  }
}
