import { data } from './model/data';
import Model from './model';
import Display from './display';
import Control from './control';
import debounce from './lib/debounce';

export default class Chart {
  public model: Model;
  public display: Display;
  public control: Control;

  constructor(
    maxCanvasWidth: number,
    maxCanvasHeight: number,
    private staticData?: data[],
    private onInitFetch?: () => Promise<data[]>,
    private onFetchMore?: () => Promise<data[]>
  ) {
    this.model = new Model(maxCanvasWidth, maxCanvasHeight);
    this.display = new Display(this.model.data, this.model.pointer);
    this.control = new Control();

    this.resize();
    this.init();
    this.assignEvents();
  }

  private resize(): void {
    this.model.resize();
    this.display.onResize(this.model);
    this.model.layout.updateInnerBoundingRect(this.display.wrapper.$inner);
  }

  public async init(): Promise<void> {
    this.assingStaticData();
    if (!this.onInitFetch) return;
    const data = await this.onInitFetch();
    this.model.init(data);
    this.display.onFetch(this.model);
  }

  private assingStaticData() {
    if (!this.staticData) return;
    this.model.init(this.staticData);
  }

  private assignEvents(): void {
    const { wrapper } = this.display;
    window.addEventListener('resize', debounce(this.resize.bind(this), 100));

    wrapper.$zoomInBtn.addEventListener('click', this.zoomIn.bind(this));
    wrapper.$zoomOutBtn.addEventListener('click', this.zoomOut.bind(this));

    wrapper.$inner.addEventListener('mousedown', this.mouseDown.bind(this));
    wrapper.$inner.addEventListener('mousemove', this.mouseMove());
    wrapper.$inner.addEventListener('mouseleave', this.mouseLeave.bind(this));
    wrapper.$inner.addEventListener('touchstart', this.touchStart.bind(this));
    wrapper.$inner.addEventListener('touchmove', this.touchMove());
    wrapper.$inner.addEventListener('touchend', this.mouseUp.bind(this));
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
    this.model.onMouseMove([e.clientX, e.clientY]);
    if (!this.control.isMouseDown) {
      this.display.onMouseMove(this.model);
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
    this.model.onMouseMove(null);
    this.display.onMouseMove(this.model);
  }

  private async onNeedMoreData(): Promise<void> {
    if (!this.onFetchMore) return;
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

    this.model.startLoading();
    const data = await this.onFetchMore();
    this.model.onFetch(data);
    this.display.onFetch(this.model);
    this.model.finishLoading();
  }

  private mouseUp(): void {
    this.control.mouseUp();
  }
}
