import TrVolumeBar from './TrVolumeBar';
import TrVolumnChartState from './TrVolumeChartState';
import TrVolumeChartYTick from './YTick/TrVolumeChartYTick';

export default class TrVolumeChart {
  public state: TrVolumnChartState;
  public barList: TrVolumeBar[] = [];
  public yTick: TrVolumeChartYTick;

  constructor(public ctx: CanvasRenderingContext2D | null) {
    this.state = TrVolumnChartState.getInstance();
    this.yTick = new TrVolumeChartYTick(ctx);
  }

  public update() {
    this.state.update();
    this.draw();
  }

  private draw() {
    this.yTick.update();
    this.barList = this.state.globalState.dataOnView.map((data, idx) => {
      const height = this.state.scaleHeight(data.tradeVolume);
      const posY = this.state.calcPosY(height);
      const isUp = data.openPrice <= data.closePrice;
      const bar = new TrVolumeBar(this.ctx, idx, posY, height, isUp);

      bar.draw();
      return bar;
    });
  }
}
