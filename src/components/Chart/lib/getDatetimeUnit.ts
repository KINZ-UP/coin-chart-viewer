import moment from 'moment';
import { data, dateTimeUnit } from '../model/data';

export default function getDatetimeUnit(dataList: data[]): dateTimeUnit {
  if (dataList.length < 2) {
    return 'days';
  }
  const [d1, d2] = dataList;
  const spacing = moment(d1.dateTime).diff(moment(d2.dateTime), 'days');
  if (spacing < 1) {
    return 'minutes';
  }
  if (spacing > 20) {
    return 'months';
  }
  return 'days';
}
