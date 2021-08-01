import config from '../config';

export default class TickScaling {
  public tickSpacing: number;
  public minTick: number;
  public maxTick: number;
  private range: number;
  public maxNumTicks: number = config.yAxis.maxNumTicks;

  constructor(public minPoint: number, public maxPoint: number) {
    this.calculate();
  }

  public calculate() {
    this.range = this.niceNum(this.maxPoint - this.minPoint, false);
    this.tickSpacing = this.niceNum(this.range / (this.maxNumTicks - 1), true);
    this.minTick =
      Math.floor(this.minPoint / this.tickSpacing) * this.tickSpacing;
    this.maxTick =
      Math.ceil(this.maxPoint / this.tickSpacing) * this.tickSpacing;
  }

  niceNum(localRange: number, round: boolean): number {
    let niceFraction; /** nice, rounded fraction */
    const exponent = Math.floor(log10(localRange));
    const fraction = localRange / Math.pow(10, exponent);

    if (round) {
      if (fraction < 1.5) niceFraction = 1;
      else if (fraction < 3) niceFraction = 2;
      else if (fraction < 7) niceFraction = 5;
      else niceFraction = 10;
    } else {
      if (fraction <= 1) niceFraction = 1;
      else if (fraction <= 2) niceFraction = 2;
      else if (fraction <= 5) niceFraction = 5;
      else niceFraction = 10;
    }

    return niceFraction * Math.pow(10, exponent);
  }

  setMinMaxPoints(localMinPoint: number, localMaxPoint: number): void {
    this.minPoint = localMinPoint;
    this.maxPoint = localMaxPoint;
    this.calculate();
  }

  setMaxTicks(localMaxTicks: number): void {
    this.maxNumTicks = localMaxTicks;
    this.calculate();
  }
}

const getBaseLog = (x: number, y: number): number => {
  return Math.log(y) / Math.log(x);
};
const log10 = getBaseLog.bind(null, 10);
