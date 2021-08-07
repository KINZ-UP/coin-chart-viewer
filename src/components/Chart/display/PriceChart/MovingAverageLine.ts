import strokeLine from '../../lib/strokeLine';
import config from '../../chartConfig';
import { data } from '../../model/data';
import State from '../../model/State';

export default class MovingAverageLine {
  constructor(public ctx: CanvasRenderingContext2D) {}

  draw(dataOnView: data[], state: State) {
    config.movingAverageList.forEach((mv) =>
      this.drawByInterval(mv, dataOnView, state)
    );
  }

  drawByInterval(
    { interval, color }: { interval: number; color: string },
    dataOnView: data[],
    state: State
  ) {
    this.ctx.strokeStyle = color;
    const scaleY = (num: number) => state.price.scaleY(num);
    const { posXCenterByIdx } = state.global;

    dataOnView
      .slice(0, dataOnView.length - 1)
      .forEach((curr: data | null, idx) => {
        const prev = dataOnView[idx + 1];
        if (!curr || !prev) return;

        const prevY = this.getScaledMovingAverage(prev, interval, scaleY);
        const currY = this.getScaledMovingAverage(curr, interval, scaleY);

        const prevX = posXCenterByIdx[idx + 1];
        const currX = posXCenterByIdx[idx];

        if (!prevY || !currY) return;
        strokeLine(this.ctx, prevX, prevY, currX, currY);
      });
  }

  private getScaledMovingAverage(
    data: data,
    interval: number,
    scaleY: (number: number) => number
  ): number | null {
    const movingAverage = data.movingAverages[interval];
    if (!movingAverage) return null;
    return scaleY(movingAverage);
  }
}
