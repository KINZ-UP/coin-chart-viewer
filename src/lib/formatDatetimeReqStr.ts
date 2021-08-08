import moment from 'moment';

export default function formatDatetimeReqStr(datetime: Date | string): string {
  return moment(datetime).utc().format('YYYY-MM-DD HH:mm:ss');
}
