import moment from 'moment';
import { dateTimeUnit } from '../model/data';

export default function getDateString(date: Date, unit: dateTimeUnit): string {
  const datetime = moment(date);
  switch (unit) {
    case 'minutes': {
      return datetime.format('M.D / HH:mm');
    }
    case 'months': {
      return datetime.format('YYYY.M');
    }
    default:
      return datetime.format('M.D');
  }
}
