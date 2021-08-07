import Data from '../Data';
import Layout from '../Layout';
import GlobalState from './GlobalState';
import PriceChartState from './PriceChartState';
import TrVolumeChartState from './TrVolumeChartState';

export default class State {
  public global: GlobalState;
  public price: PriceChartState;
  public trVolume: TrVolumeChartState;

  constructor(data: Data, layout: Layout) {
    this.global = new GlobalState(layout);
    this.price = new PriceChartState(data, layout);
    this.trVolume = new TrVolumeChartState(data, layout);
  }

  init() {
    this.global.init();
    this.update();
  }

  update() {
    this.price.update();
    this.trVolume.update();
  }

  resize() {
    this.global.resize();
  }

  zoomIn() {
    this.global.zoomIn();
  }

  zoomOut() {
    this.global.zoomOut();
  }

  onSwipe(moveCount: number, dataLength: number) {
    const offsetCount = Math.min(
      Math.max(moveCount, 3 - this.global.numBarsOnView),
      dataLength - this.global.numBarsOnView + 3
    );
    this.global.updateOffsetCount(offsetCount);
  }
}
