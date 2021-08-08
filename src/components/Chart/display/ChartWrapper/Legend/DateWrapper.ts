import moment from 'moment';
import Data, { dateTimeUnit } from '../../../model/Data';
import Pointer from '../../../model/Pointer';

export default class DateWrapper extends HTMLDivElement {
  constructor() {
    super();
  }

  public update(data: Data, pointer: Pointer) {
    const d = pointer.idx
      ? data.dataOnView[pointer.idx] ?? data.dataList[0]
      : data.dataList[0];
    this.textContent = getDateString(d.dateTime, data.unit);
  }
}

customElements.define('date-div', DateWrapper, { extends: 'div' });

function getDateString(date: Date, unit: dateTimeUnit): string {
  const datetime = moment(date);
  switch (unit) {
    case 'minutes': {
      return datetime.format('YYYY.MM.DD HH:mm');
    }
    case 'months': {
      return datetime.format('YYYY.MM');
    }
    default:
      return datetime.format('YYYY.MM.DD');
  }
}
