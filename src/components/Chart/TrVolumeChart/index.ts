import TrVolumeBar from './TrVolumeBar';
import TrVolumnChartState from '../state/TrVolumeChartState';
import TrVolumeChartYTick from '../yAxis/TrVolumeChartYTick';

export default class TrVolumeChart {
  public state: TrVolumnChartState = TrVolumnChartState.getInstance();
  public barList: TrVolumeBar[] = [];
  public yTick: TrVolumeChartYTick;

  constructor(public ctx: CanvasRenderingContext2D) {
    this.yTick = new TrVolumeChartYTick(ctx);
  }

  public update() {
    this.state.update();
    this.draw();
  }

  private draw() {
    this.yTick.update();
    const yMin =
      this.state.globalState.layout.canvasHeight -
      this.state.globalState.layout.lower.margin.bottom;
    this.barList = this.state.globalState.dataOnView.map((data, idx) => {
      const yMax = this.state.scaleY(data.tradeVolume);
      const height = yMax - yMin;
      const isUp = data.openPrice <= data.closePrice;
      const bar = new TrVolumeBar(this.ctx, idx, height, isUp);

      bar.draw();
      return bar;
    });
  }
}
