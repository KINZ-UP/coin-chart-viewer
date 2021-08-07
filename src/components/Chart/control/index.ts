export default class Control {
  public isMouseDown: boolean = false;
  public mouseMoveStartPosX: number = 0;
  public offsetCountStart: number = 0;

  constructor() {}

  public mouseDown(startPosX: number, offsetCountStart: number): void {
    this.isMouseDown = true;
    this.mouseMoveStartPosX = startPosX;
    this.offsetCountStart = offsetCountStart;
  }

  public mouseUp(): void {
    this.isMouseDown = false;
    this.mouseMoveStartPosX = 0;
    this.offsetCountStart = 0;
  }
}
