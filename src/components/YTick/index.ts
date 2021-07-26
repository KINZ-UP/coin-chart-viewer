import TickScaling from './TickScaling';

export default class YTick {
  public tickScale: TickScaling;

  constructor(public ctx: CanvasRenderingContext2D | null) {}
}
