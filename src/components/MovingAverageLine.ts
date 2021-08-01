import strokeLine from '../lib/strokeLine';
import options from '../options';
import { data } from './DataLoader';
import PriceChartState from './PriceChartState';

export default class MovingAverageLine {
  public state: PriceChartState;
  constructor(public ctx: CanvasRenderingContext2D) {
    this.state = PriceChartState.getInstance();
  }

  draw() {
    options.movingAverageList.forEach(this.drawByInterval.bind(this));
  }

  drawByInterval({ interval, color }: { interval: number; color: string }) {
    this.ctx.strokeStyle = color;
    const dataList = this.state.globalState.dataOnView;
    dataList.slice(0, dataList.length - 1).forEach((curr: data, idx) => {
      const prev = dataList[idx + 1];
      const prevY = this.getScaledMovingAverage(prev, interval);
      const currY = this.getScaledMovingAverage(curr, interval);

      const prevX = this.state.globalState.posXCenterByIdx[idx + 1];
      const currX = this.state.globalState.posXCenterByIdx[idx];

      if (!prevY || !currY) return;
      strokeLine(this.ctx, prevX, prevY, currX, currY);
    });
  }

  private getScaledMovingAverage(data: data, interval: number): number | null {
    const movingAverage = data.movingAverages[interval];
    if (!movingAverage) return null;
    return this.state.scaleY(movingAverage);
  }
}
