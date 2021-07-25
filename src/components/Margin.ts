export interface margin {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export default class Margin implements margin {
  constructor(
    public top: number,
    public left: number,
    public bottom: number,
    public right: number
  ) {}
}
