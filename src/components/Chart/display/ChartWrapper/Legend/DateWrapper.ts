import moment from 'moment';
import Data from '../../../model/Data';
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
    this.textContent = moment(data?.dateTime).format('YYYY.MM.DD');
  }
}

customElements.define('date-div', DateWrapper, { extends: 'div' });
