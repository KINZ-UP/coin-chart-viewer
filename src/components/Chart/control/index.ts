import Layout from '../model/Layout';
import Pointer from '../model/Pointer';

export default class Control {
  public pointer: Pointer = new Pointer();
  public isMouseDown: boolean = false;
  public mouseMoveStartPosX: number = 0;
  public offsetCountStart: number = 0;

  constructor() {}

  public mouseDown(startPosX: number, offsetCountStart: number): void {
    this.isMouseDown = true;
    this.mouseMoveStartPosX = startPosX;
    this.offsetCountStart = offsetCountStart;
  }

  onMouseMove(
    coord: [number, number] | null,
    layout: Layout,
    barWidth: number
  ) {
    this.pointer.update(coord, layout, barWidth);
  }

  public mouseUp(): void {
    this.isMouseDown = false;
    this.mouseMoveStartPosX = 0;
    this.offsetCountStart = 0;
  }
}
