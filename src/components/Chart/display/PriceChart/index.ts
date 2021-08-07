import Model from '../../model';
import PriceCandle from './PriceCandle';
import MovingAverageLine from './MovingAverageLine';
import PriceChartYAxis from '../YAxis/PriceChartYAxis';

export default class PriceChart {
  public yAxis: PriceChartYAxis;
  public movingAverageLine: MovingAverageLine;

  constructor(public ctx: CanvasRenderingContext2D) {
    this.yAxis = new PriceChartYAxis(ctx);
    this.movingAverageLine = new MovingAverageLine(ctx);
  }

  public draw(model: Model) {
    const { data, state, layout } = model;
    const scaleY = (num: number) => state.price.scaleY(num);
    this.yAxis.draw(layout, state.price, scaleY);

    data.dataOnView.forEach((d, idx) => {
      if (!d) return null;
      new PriceCandle(this.ctx, d, idx, state.global, scaleY);
    });
    this.movingAverageLine.draw(data.dataOnView, state);
  }
}
