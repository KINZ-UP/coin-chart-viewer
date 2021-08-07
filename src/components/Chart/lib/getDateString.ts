export default function getDateString(date: Date): string {
  return `${(date.getMonth() + 1).toString()}.${date.getDate()}`;
}
