import moment from 'moment';
import GlobalState from '../../state/GlobalState';

export default class DateWrapper extends HTMLDivElement {
  public state: GlobalState = GlobalState.getInstance();
  constructor() {
    super();
  }

  public update() {
    this.render();
  }

  private render() {
    const data =
      this.state.dataOnView[this.state.pointerIdx || 0] ??
      this.state.dataLoader.dataList[0];

    this.textContent = moment(data?.dateTime).format('YYYY.MM.DD');
  }
}

customElements.define('date-div', DateWrapper, { extends: 'div' });
