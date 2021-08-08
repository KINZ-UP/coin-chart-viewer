import Data, { data } from './data';
import State from './State';
import Layout from './Layout';
import Pointer from './Pointer';

export default class Model {
  public data: Data = new Data();
  public layout: Layout;
  public state: State;

  public _loading: boolean = false;

  constructor(maxCanvasWidth: number, maxCanvasHeight: number) {
    this.layout = new Layout(maxCanvasWidth, maxCanvasHeight);
    this.state = new State(this.data, this.layout);
  }

  public get loading() {
    return this._loading;
  }

  private set loading(flag: boolean) {
    this._loading = flag;
  }

  public startLoading() {
    this.loading = true;
  }

  public finishLoading() {
    this.loading = false;
  }

  resize() {
    this.layout.resize();
    this.state.resize();
  }

  init(data: data[]) {
    this.data.init(data);
    this.data.updateDataOnView(this.state.global.numBarsOnView, 0);
    this.state.init();
  }

  onFetch(newData: data[]) {
    this.data.onFetch(newData);
    this.update();
  }

  zoomIn() {
    this.state.zoomIn();
    this.update();
  }

  zoomOut() {
    this.state.zoomOut();
    this.update();
  }

  onSwipe(moveCount: number) {
    this.state.onSwipe(moveCount, this.data.dataList.length);
    this.update();
  }

  private update() {
    this.data.updateDataOnView(
      this.state.global.numBarsOnView,
      this.state.global.offsetCount
    );
    this.state.update();
  }
}
