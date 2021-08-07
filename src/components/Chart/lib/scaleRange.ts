export default function scaleRange(
  x: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number
): number {
  return yMin + ((x - xMin) / (xMax - xMin)) * (yMax - yMin);
}
