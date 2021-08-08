import moment from 'moment';
import Data, { dateTimeUnit } from '../../../model/Data';
import Pointer from '../../../model/Pointer';

export default class DateWrapper extends HTMLDivElement {
  constructor(public data: Data, public pointer: Pointer) {
    super();
  }

  public update() {
    this.render();
  }

  private render() {
    const data = this.pointer.idx
      ? this.data.dataOnView[this.pointer.idx] ?? this.data.dataList[0]
      : this.data.dataList[0];
    this.textContent = getDateString(data.dateTime, this.data.unit);
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
