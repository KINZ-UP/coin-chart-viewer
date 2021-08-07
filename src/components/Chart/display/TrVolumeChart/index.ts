import TrVolumeBar from './TrVolumeBar';
import TrVolumeChartYAxis from '../YAxis/TrVolumeChartYAxis';
import Model from '../../model';

export default class TrVolumeChart {
  public yAxis: TrVolumeChartYAxis;

  constructor(public ctx: CanvasRenderingContext2D) {
    this.yAxis = new TrVolumeChartYAxis(ctx);
  }

  public draw(model: Model) {
    const { data, state, layout } = model;
    const scaleY = (num: number) => state.trVolume.scaleY(num);
    this.yAxis.draw(layout, state.trVolume, scaleY);

    data.dataOnView.forEach((d, idx) => {
      if (!d) return;
      new TrVolumeBar(this.ctx, d, idx, state.global, scaleY);
    });
  }
}
