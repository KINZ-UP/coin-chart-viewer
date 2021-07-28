import moment from 'moment';

export default function formatDatetimeReqStr(date: Date | string): string {
  return moment(date).subtract(1, 'd').format('YYYY-MM-DD HH:mm:ss');
}
